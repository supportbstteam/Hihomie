import { redirect } from "next/navigation";
import getUserFromServerSession from "@/lib/getUserFromServerSession";
import CreateContact from "@/components/estate/CreateContact";

export default async function DashboardPage() {
  const user = await getUserFromServerSession();
  if (!user) redirect("/login");

  return (
    <>
      <CreateContact />
    </>
  );
}
