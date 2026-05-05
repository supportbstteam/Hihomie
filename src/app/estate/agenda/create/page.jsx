import { redirect } from "next/navigation";
import getUserFromServerSession from "@/lib/getUserFromServerSession";
import CreateAgenda from "@/components/estate/CreateAgenda";
import api from "@/lib/api/api";

export default async function DashboardPage() {
  const user = await getUserFromServerSession();
  if (!user) redirect("/login");

  const [usersRes, propertiesRes, contactsRes] = await Promise.all([
    api.get("/estate/users"),
    api.get("/estate/property"),
    api.get("/estate/contacts"), 
  ]);

  const estateUsers = usersRes.data.estateUsers;
  const properties = propertiesRes.data.data;
  const contacts = contactsRes.data.data;

  return (
    <>
      <CreateAgenda
        users={estateUsers}
        properties={properties}
        contacts={contacts}
      />
    </>
  );
}
