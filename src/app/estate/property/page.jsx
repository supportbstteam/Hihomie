import { redirect } from "next/navigation";
import getUserFromServerSession from "@/lib/getUserFromServerSession";
import CreateProperty from "@/components/estate/CreateProperty";
import api from "@/lib/api/api";

export default async function DashboardPage() {
  const user = await getUserFromServerSession();
  if (!user) redirect("/login");

  const response = await api.get("/estate/users");
  const estateUsers = response.data.estateUsers;

  return (
    <>
      <CreateProperty users={estateUsers} />
    </>
  );
}
