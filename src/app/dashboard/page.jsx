import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Head from "next/head";
import LowerNav from "@/components/LowerNav";
import Stats from "@/components/Stats";
import List from "@/components/List";
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  return (
    <>
      <LowerNav className="w-full p-0" />
      <div className="p-6">
        <h1 className="mb-2 text-2xl font-bold">
          Welcome, {session.user?.name || session.user?.email}
        </h1>
        <p className="text-gray-600">
          You are signed in as{" "}
          <span className="font-medium">{session.user.role}</span>.
        </p>
        <br></br>
        <Stats />
        <br></br>
        <List />
      </div>
    </>
  );
}
