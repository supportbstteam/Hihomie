import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Correct import path for App Router
import { getServerSession } from "next-auth";

export default async function getUserFromServerSession() {
    const session = await getServerSession(authOptions);
    return session.user;
}