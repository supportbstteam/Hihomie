import { redirect } from "next/navigation";
import getUserFromServerSession from "@/lib/getUserFromServerSession";
import ListContacts from "@/components/estate/ListContacts";


export default async function DashboardPage() {
  const user = await getUserFromServerSession();
  if (!user) redirect("/login");

  return (
    <>
      <ListContacts />
    </>
  );
}
