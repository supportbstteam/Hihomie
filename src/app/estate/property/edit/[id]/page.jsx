// "use client";

// import { use } from "react";
import { useParams, redirect } from "next/navigation";
import getUserFromServerSession from "@/lib/getUserFromServerSession";
import EditProperty from "@/components/estate/EditProperty";

export default async function EditPropertyPage({ params }) {
    //   const { id } = use(params);
    const { id } = params;
    // const { id } = useParams();
  const user = await getUserFromServerSession();
  if (!user) redirect("/login");

  return (
    <>
      <EditProperty id={id} />
    </>
  );
}
