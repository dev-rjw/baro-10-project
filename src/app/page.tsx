"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import TodoList from "./components/TodoList";
import CompletedList from "./components/CompletedList";

export default function Home() {
  const queryClient = new QueryClient();

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <TodoList />
        <CompletedList />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </div>
  );
}
