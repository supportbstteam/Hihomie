import { useSession } from "next-auth/react";

export default function getUserFromSession() {
    // below we get the data variable fron destructuring and rename it to user now we can use the user variable name to use the data values
    const { data: user } = useSession();
    // user variable contain two information user details as an array and expires variable for expiration time so we only return user details
    return user.user;
}