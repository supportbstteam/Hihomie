"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation"; // ✅ Add this
import { FaAt } from "react-icons/fa";
import {
  MdOutlineAssuredWorkload,
  MdOutlineCalculate,
  MdOutlineCategory,
  MdOutlineDashboard,
  MdOutlineHandshake,
  MdOutlineHeadphones,
  MdOutlineLogout,
  MdOutlineRealEstateAgent,
} from "react-icons/md";
import { SiConvertio } from "react-icons/si";
import { RxCross2 } from "react-icons/rx";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoSettingsOutline } from "react-icons/io5";
import { t } from "@/components/translations";

const MENU = {
  admin: [
    { href: "/dashboard", label: t("dashboard"), icon: <MdOutlineDashboard /> },
    {
      href: "/dashboard/category",
      label: t("category"),
      icon: <MdOutlineCategory />,
    },
    { href: "/dashboard/lead", label: t("lead"), icon: <MdOutlineCalculate /> },
    { href: "/dashboard/team", label: t("team"), icon: <MdOutlineCalculate /> },
    // { href: '#', label: t('manager'), icon: <MdOutlineHandshake /> },
    // { href: '#', label: t('agent'), icon: <MdOutlineRealEstateAgent /> },
    // { href: '#', label: t('bank'), icon: <MdOutlineAssuredWorkload /> },
    // { href: '#', label: t('calculator'), icon: <MdOutlineCalculate /> },
    // { href: '#', label: t('commission'), icon: <MdOutlineHandshake /> },
    // { href: '#', label: t('metter'), icon: <SiConvertio /> },
    // { href: '#', label: t('help_support'), icon: <MdOutlineHeadphones /> },
    {
      href: "/dashboard/setting",
      label: t("setting"),
      icon: <IoSettingsOutline />,
    },
  ],
  manager: [
    { href: "/dashboard", label: "Tablero", icon: <MdOutlineDashboard /> },
    // { href: '#', label: 'Prospectos', icon: <MdOutlineCalculate /> },
    // { href: '#', label: 'Gerente', icon: <MdOutlineHandshake /> },
    // { href: '#', label: 'Agentes', icon: <MdOutlineRealEstateAgent /> },
    // { href: '#', label: 'Banco', icon: <MdOutlineAssuredWorkload /> },
  ],
  user: [
    { href: "/dashboard", label: "Tablero", icon: <MdOutlineDashboard /> },
    // { href: '#', label: 'Prospectos', icon: <MdOutlineCalculate /> },
    // { href: '#', label: 'Gerente', icon: <MdOutlineHandshake /> },
  ],
};

export default function Sidebar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const pathname = usePathname(); // ✅ current path

  if (status === "loading") {
    return (
      <aside className="w-full shrink-0 border-r border-stock bg-white p-4">
        <div className="text-muted-foreground">Loading menu...</div>
      </aside>
    );
  }

  if (!session) return null;

  const role = session?.user?.role || "user";
  const items = MENU[role] || MENU.user;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setOpen(true)}
        className="p-2 md:hidden fixed top-4 left-4 z-50 bg-white rounded-lg shadow"
      >
        <GiHamburgerMenu size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-background h-full  shrink-0 border-r border-border  p-2 transform transition-transform duration-300 
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Close Button (Mobile Only) */}
        <div className="flex justify-between items-center mb-4 md:hidden z-[999]">
          <h2 className="font-semibold">Menú</h2>
          <button onClick={() => setOpen(false)}>
            <RxCross2 size={24} />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <FaAt size={20} className="text-[#F8C51B]" />
          <h2 className="font-medium">{t("account")}</h2>
        </div>

        <nav className="flex-1 space-y-2  overflow-y-auto  pr-1 custom-scrollbar ">
          {items.map((i, idx) => {
            const isActive = pathname === i.href; // ✅ Check active

            return (
              <div key={idx}>
                <Link
                  href={i.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 
                    hover:bg-gray-100 transition-colors
                    ${isActive ? "bg-[#21B57340]" : ""} `}
                >
                  <span
                    className={`${
                      isActive ? "text-[#21B573]" : "text-[#84909A]"
                    }`}
                  >
                    {i.icon}
                  </span>
                  <span
                    className={`${
                      isActive ? "text-[#21B573]" : "text-[#071437]"
                    }`}
                  >
                    {i.label}
                  </span>
                </Link>

                {i.label === "Agentes" && (
                  <hr className="my-4 border-gray-300" />
                )}
              </div>
            );
          })}


          {/* Logout Button */}
          <button
            onClick={() => {
              setOpen(false);
              signOut({ callbackUrl: "/" });
            }}
            className="flex items-center cursor-pointer gap-2 w-full text-left rounded-lg px-3 py-2 hover:bg-gray-100"
          >
            <MdOutlineLogout className="text-[#84909A]" /> Logout
          </button>
        </nav>
      </aside>
    </>
  );
}
