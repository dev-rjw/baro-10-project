import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

type Result = {
  id: string;
  title: string;
  completed: boolean;
};

const getTodos = async () => {
  const result = await axios.get("http://localhost:3000/todos");
  return result.data;
};

const setTodo = async (addTodo: Result) => {
  const result = await axios.post("http://localhost:3000/todos", addTodo);
  return result;
};

const TodoList = () => {
  const [title, setTitle] = useState<string>("");
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  const mutation = useMutation({
    mutationFn: setTodo,
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

  const addTodo = async () => {
    mutation.mutate({
      id: new Date().getTime().toString(),
      title: title,
      completed: false,
    });
    setTitle("");
  };

  return (
    <div>
      <input type="text" value={title} name="title" onChange={(event) => setTitle(event.target.value)} />
      <button onClick={addTodo}>일정 추가하기</button>
      {data?.map((result: Result) => {
        return (
          <div key={result.id}>
            <div>{result.title}</div>
            <button>{result.completed ? "취소하기" : "완료하기"}</button>
            <hr></hr>
          </div>
        );
      })}
    </div>
  );
};

export default TodoList;
