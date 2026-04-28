import { redirect } from "next/navigation";
import getUserFromServerSession from "@/lib/getUserFromServerSession";
import EditContact from "@/components/estate/EditContact";

export default async function EditLeadPage({ params }) {
  const { id } = await params;
  const user = await getUserFromServerSession();
  if (!user) redirect("/login");

  return (
    <>
      <EditContact id={id} />
    </>
  );
}
