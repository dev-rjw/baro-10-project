import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getTodos = async () => {
  const result = await axios.get("http://localhost:3000/todos");
  return result.data;
};

type Result = {
  id: string;
  title: string;
  completed: boolean;
};

const TodoList = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  if (isLoading) {
    return <div>잠시만 기다려주세요...</div>;
  }

  if (isError) {
    return <div>에러가 발생했습니다.</div>;
  }

  return (
    <div>
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
