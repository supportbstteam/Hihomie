import { useSession } from "next-auth/react";

export default function useUserFromSession() {
    // below we get the data variable fron destructuring and rename it to user now we can use the user variable name to use the data values
    const { data: session, status } = useSession();

    if (status === "loading") return null;      // still loading
    if (!session) return null;  

    // user variable contain two information user details as an array and expires variable for expiration time so we only return user details
    return session?.user;
}