import Link from "next/link";
import { LuBellDot } from "react-icons/lu";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SlCalender } from "react-icons/sl";
import { MdOutlineFilterList, MdOutlineFilterListOff } from "react-icons/md";
import Date from "./ui/Date";
import Icon from "./ui/Icon";
import { Download, List, ListFilter, Plus } from "lucide-react";
import { t } from "@/components/translations";

export default async function LoweNav() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <aside className="w-full bg-white sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-2 sm:px-4 sm:py-4">
        {/* Title (hide on mobile) */}
        <div className="hidden sm:flex flex-col">
          <p className="h5 text-dark">{t("control_panel")}</p>
          <span className="p text-light">{t("complete_view")}</span>
        </div>

        {/* Right Side - Date & Filter */}
        <div className="flex w-full sm:w-auto justify-end">
          <ul className="flex items-center gap-3 sm:flex sm:justify-between text-stock">
            {/* Date */}
            <Date />

            {/* Filter Icon */}
            <Icon variant="outline" icon={List} size={16} color="#99A1B7" />
            <Icon
              variant="outline"
              icon={Download}
              size={16}
              color="#99A1B7"
              href="/"
            />
            <Icon
              variant="outline"
              icon={ListFilter}
              size={16}
              color="#99A1B7"
              href="/"
            />
            <Icon
              variant="outline"
              icon={Plus}
              size={16}
              color="#99A1B7"
              href="/"
            />
          </ul>
        </div>
      </div>
    </aside>
  );
}
