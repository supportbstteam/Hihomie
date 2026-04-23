import { redirect } from "next/navigation";
import getUserFromServerSession from "@/lib/getUserFromServerSession";
import EditProperty from "@/components/estate/EditProperty";
import api from "@/lib/api/api";

export default async function EditPropertyPage({ params }) {
  const { id } = await params;
  const user = await getUserFromServerSession();
  if (!user) redirect("/login");

  const response = await api.get("/estate/users");
  const estateUsers = response.data.estateUsers;

  return (
    <>
      <EditProperty id={id} users={estateUsers} />
    </>
  );
}
