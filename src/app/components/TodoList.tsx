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
    return <div className="flex justify-center items-center h-screen">잠시만 기다려주세요...</div>;
  }

  if (isError) {
    return <div className="flex justify-center items-center h-screen text-red-600">에러가 발생했습니다.</div>;
  }

  // Todo 추가 핸들러
  const handleAddTodo = async () => {
    if (title.trim() !== "") {
      addMutation.mutate({
        id: new Date().getTime().toString(),
        title: title,
        completed: false,
      });
      setTitle("");
    } else {
      alert("타이틀을 입력해주세요.");
      return;
    }
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
      return;
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl text-center font-bold mb-6">할 일 목록</h1>

      <div className="flex mb-4">
        <input className="flex-1 px-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" placeholder="할 일을 입력하세요" value={title} name="title" onChange={(event) => setTitle(event.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddTodo()} />
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg cursor-pointer" onClick={handleAddTodo}>
          추가
        </button>
      </div>

      <div>
        {data?.map((result: Todo) => (
          <div key={result.id} className="mb-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center mb-2">
              <button className="flex mr-2 w-6 h-6 items-center justify-center" onClick={() => handleCompletedUpdateTodo(result)}>
                {result.completed ? "✅" : "⬜"}
              </button>

              {editId === result.id ? <input className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" value={editTitle} name="editTitle" onChange={(event) => setEditTitle(event.target.value)} onKeyDown={(e) => e.key === "Enter" && handleTitleUpdateTodo(result)} autoFocus /> : <span className={`flex-1 ${result.completed ? "line-through text-gray-500" : "text-gray-800"}`}>{result.title}</span>}
            </div>

            <div className="flex justify-end space-x-2">
              {editId === result.id ? (
                <button className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded" onClick={() => handleTitleUpdateTodo(result)}>
                  완료
                </button>
              ) : (
                <button className="px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded" onClick={() => handleTitleUpdateTodoStart(result)}>
                  수정
                </button>
              )}

              <button className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded" onClick={() => handleDeleteTodo(result.id)}>
                삭제
              </button>
            </div>
          </div>
        ))}

        {data?.length === 0 && <div className="text-center py-4 text-gray-500">할 일이 없습니다. 새 할 일을 추가해보세요!</div>}
      </div>
    </div>
  );
};

export default TodoList;
