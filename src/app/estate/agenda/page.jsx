import { redirect } from "next/navigation";
import getUserFromServerSession from "@/lib/getUserFromServerSession";
import ListAgenda from "@/components/estate/ListAgenda";

export default async function DashboardPage() {
  const user = await getUserFromServerSession();
  if (!user) redirect("/login");

  return (
    <>
      <ListAgenda />
    </>
  );
}
