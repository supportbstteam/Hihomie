import { redirect } from "next/navigation";
import getUserFromServerSession from "@/lib/getUserFromServerSession";
import CreateProperty from "@/components/estate/CreateProperty";

export default async function DashboardPage() {
  const user = await getUserFromServerSession();
  if (!user) redirect("/login");

  return (
    <>
      <CreateProperty />
    </>
  );
}
