import { redirect } from "next/navigation";
import getUserFromServerSession from "@/lib/getUserFromServerSession";
import EditLead from "@/components/estate/EditLead";

export default async function EditLeadPage({ params }) {
  const { id } = await params;
  const user = await getUserFromServerSession();
  if (!user) redirect("/login");

  return (
    <>
      <EditLead id={id} />
    </>
  );
}
