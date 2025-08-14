'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { FaAt } from "react-icons/fa";
import { MdOutlineAssuredWorkload, MdOutlineCalculate, MdOutlineDashboard, MdOutlineHandshake, MdOutlineHeadphones, MdOutlineLogout, MdOutlineRealEstateAgent } from "react-icons/md";
import { SiConvertio } from "react-icons/si";

const MENU = {
  admin: [
    { href: '/dashboard', label: 'Tablero', icon: <MdOutlineDashboard /> },
    { href: '#', label: 'Prospectos', icon: <MdOutlineCalculate /> },
    { href: '#', label: 'Gerente', icon: <MdOutlineHandshake /> },
    { href: '#', label: 'Agentes', icon: <MdOutlineRealEstateAgent /> },
    { href: '#', label: 'Banco', icon: <MdOutlineAssuredWorkload /> },
    { href: '#', label: 'Calculadora', icon: <MdOutlineCalculate /> },
    { href: '#', label: 'Comisión', icon: <MdOutlineHandshake /> },
    { href: '#', label: 'Importar', icon: <SiConvertio /> },
    { href: '#', label: 'Ayuda y Soporte', icon: <MdOutlineHeadphones /> },
  ],
  manager: [
    { href: '/dashboard', label: 'Tablero', icon: <MdOutlineDashboard /> },
    { href: '#', label: 'Prospectos', icon: <MdOutlineCalculate /> },
    { href: '#', label: 'Gerente', icon: <MdOutlineHandshake /> },
    { href: '#', label: 'Agentes', icon: <MdOutlineRealEstateAgent /> },
    { href: '#', label: 'Banco', icon: <MdOutlineAssuredWorkload /> },
  ],
  user: [
    { href: '/dashboard', label: 'Tablero', icon: <MdOutlineDashboard /> },
    { href: '#', label: 'Prospectos', icon: <MdOutlineCalculate /> },
    { href: '#', label: 'Gerente', icon: <MdOutlineHandshake /> },
  ],
}

export default function Sidebar() {
  const { data: session, status } = useSession()

  // Show nothing until session loads
  if (status === "loading") {
    return (
      <aside className="w-64 shrink-0 border-r bg-white p-4">
        <div className="text-gray-500">Loading menu...</div>
      </aside>
    )
  }

  // If no session (not logged in)
  if (!session) return null

  const role = session?.user?.role || 'user'
  const items = MENU[role] || MENU.user

  return (
    <aside className="w-64 shrink-0 border-r bg-white p-4">
      <div className="flex items-center gap-2 mb-4">
        <FaAt size={20} className='text-[#F8C51B]' />
        <h2 className="font-semibold">Cuenta Administrativa</h2>
      </div>
      <nav className="space-y-2">
        {items.map((i, idx) => (
          <div key={idx}>
            <Link
              href={i.href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100"
            >
              <span className='text-[#84909A]'>{i.icon}</span>
              <span className='text-[#071437]'>{i.label}</span>
            </Link>

            {/* Add horizontal line after Agentes */}
            {i.label === 'Agentes' && (
              <hr className="my-4 border-gray-300" />
            )}
          </div>
        ))}

        {/* Logout Button */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 w-full text-left rounded-lg px-3 py-2 hover:bg-gray-100"
        >
          <MdOutlineLogout className='text-[#84909A]' /> Logout
        </button>
      </nav>
    </aside>
  )
}
