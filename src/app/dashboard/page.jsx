import { redirect } from "next/navigation";
import Head from "next/head";
import LowerNav from "@/components/LowerNav";
import getUserFromServerSession from "@/lib/getUserFromServerSession";
import { Dashboard } from "@/components/Dashboard";

export default async function DashboardPage() {
  const user = await getUserFromServerSession();
  if (!user) redirect("/login");
   
  console.log();

  return (
    <>
      {/* <LowerNav className="w-full p-0" /> */}
      {/* <div className="p-6 bg-background-secondary">
        <h1 className="h1 mb-2 ">
          Welcome, {user?.name || user?.email}
        </h1>
        <p className="p text-muted-foreground">
          You are signed in as{" "}
          <span className="font-medium text-primary">{user.role}</span>.
        </p>
      </div> */}
      {user?.role != 'external' && <Dashboard />}
      
    </>
  );
}
