import { redirect } from "next/navigation";
import getUserFromServerSession from "@/lib/getUserFromServerSession";
import EditProperty from "@/components/estate/EditProperty";

export default async function EditPropertyPage({ params }) {
  const { id } = params;
  const user = await getUserFromServerSession();
  if (!user) redirect("/login");

  return (
    <>
      <EditProperty id={id} />
    </>
  );
}
