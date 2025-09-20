import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Head from "next/head";
import LowerNav from "@/components/LowerNav";
import Stats from "@/components/Stats";
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  return (
    <>
      {/* <LowerNav className="w-full p-0" /> */}
      <div className="p-6 bg-background-secondary h-full">
        <h1 className="h1 mb-2 ">
          Welcome, {session.user?.name || session.user?.email}
        </h1>
        <p className="p text-muted-foreground">
          You are signed in as{" "}
          <span className="font-medium text-primary">{session.user.role}</span>.
        </p>
      </div>
    </>
  );
}
