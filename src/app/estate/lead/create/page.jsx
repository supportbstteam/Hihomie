import { redirect } from "next/navigation";
import getUserFromServerSession from "@/lib/getUserFromServerSession";
import CreateLead from "@/components/estate/CreateLead";

export default async function DashboardPage() {
  const user = await getUserFromServerSession();
  if (!user) redirect("/login");

  return (
    <>
      <CreateLead />
    </>
  );
}
