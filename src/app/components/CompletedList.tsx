import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Todo 타입 선언
type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

// axios로 필터 된 todos 가져오기
const getFilteredTodos = async () => {
  const result = await axios.get("http://localhost:3000/todos");
  const filteredResult = result.data.filter((todo: Todo) => todo.completed === true);
  return filteredResult;
};

const CompletedList = () => {
  // useQuery 사용 - getFilteredTodos
  const { data, isLoading, isError } = useQuery({
    queryKey: ["filteredTodos"],
    queryFn: getFilteredTodos,
  });

  if (isLoading) {
    return <div>잠시만 기다려주세요...</div>;
  }

  if (isError) {
    return <div>에러가 발생했습니다.</div>;
  }
  return (
    <div>
      <h1>완료 목록</h1>
      {data?.map((result: Todo) => {
        return <div key={result.id}>{result.title}</div>;
      })}
    </div>
  );
};

export default CompletedList;
