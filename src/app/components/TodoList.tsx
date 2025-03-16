import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

// Todo 타입 선언
type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

// axios로 todos 가져오기
const getTodos = async () => {
  const result = await axios.get("http://localhost:3000/todos");
  return result.data;
};

// axios로 todo 추가하기
const addTodo = async (todo: Todo) => {
  const result = await axios.post("http://localhost:3000/todos", todo);
  return result;
};

// axios로 todo 삭제하기
const deleteTodo = async (id: string) => {
  const result = await axios.delete(`http://localhost:3000/todos/${id}`);
  return result;
};

// axios로 todo 변경하기
const updateTodo = async (todo: Todo) => {
  const result = await axios.patch(`http://localhost:3000/todos/${todo.id}`, todo);
  return result;
};

// 메인 함수
const TodoList = () => {
  const [title, setTitle] = useState<string>("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");

  const queryClient = useQueryClient();

  // useQuery 사용 - getTodos
  const { data, isLoading, isError } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  // useMutation 사용 - addTodo
  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // useMutation 사용 - deleteTodo
  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // useMutation 사용 - updateTodo
  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  if (isLoading) {
    return <div>잠시만 기다려주세요...</div>;
  }

  if (isError) {
    return <div>에러가 발생했습니다.</div>;
  }

  // Todo 추가 핸들러
  const handleAddTodo = async () => {
    addMutation.mutate({
      id: new Date().getTime().toString(),
      title: title,
      completed: false,
    });
    setTitle("");
  };

  // Todo 삭제 핸들러
  const handleDeleteTodo = async (id: string) => {
    deleteMutation.mutate(id);
  };

  // Todo Completed 변경 핸들러
  const handleCompletedUpdateTodo = async (todo: Todo) => {
    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
    };
    updateMutation.mutate(updatedTodo);
  };

  // Todo Title 변경 시작 핸들러
  const handleTitleUpdateTodoStart = (todo: Todo) => {
    setEditId(todo.id);
    setEditTitle(todo.title);
  };

  // Todo Title 변경 핸들러
  const handleTitleUpdateTodo = async (todo: Todo) => {
    if (editTitle.trim() !== "") {
      const updatedTodo = {
        ...todo,
        title: editTitle,
      };
      updateMutation.mutate(updatedTodo);
      setEditId(null);
    } else {
      alert("타이틀을 입력해주세요.");
    }
  };

  return (
    <>
      <input type="text" value={title} name="title" onChange={(event) => setTitle(event.target.value)} />
      <button onClick={handleAddTodo}>일정 추가하기</button>
      {data?.map((result: Todo) => {
        return (
          <div key={result.id}>
            <button onClick={() => handleCompletedUpdateTodo(result)}>{result.completed ? "✅" : "🟩"}</button>
            {editId === result.id ? (
              <>
                <input type="text" value={editTitle} name="editTitle" onChange={(event) => setEditTitle(event.target.value)} />
                <br></br>
                <button onClick={() => handleTitleUpdateTodo(result)}>수정 완료하기</button>
              </>
            ) : (
              <>
                <div>{result.title}</div>
                <button onClick={() => handleTitleUpdateTodoStart(result)}>수정하기</button>
              </>
            )}
            <button onClick={() => handleDeleteTodo(result.id)}>삭제하기</button>
            <hr></hr>
          </div>
        );
      })}
    </>
  );
};

export default TodoList;
