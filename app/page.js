import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TodosPage from "./components/Todos";

export default async function Home() {
  const cookieStore =await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/login");
  }

  return (
    <>
      <TodosPage/>
    </>
  );
}
