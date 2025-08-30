import Link from 'next/link'
import { LuBellDot } from "react-icons/lu";
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export default async function TopNav() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/')

  return (
    <aside className="w-full shrink-0 border-b border-stock bg-white p-4 flex items-center justify-between relative">
      
      {/* Logo */}
      <div className="absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0">
         <img
        src={`${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`}
        alt="Logo"
       className="w-20 sm:w-28 md:w-36 lg:w-40"
      />

      </div>

      {/* Notification + Profile */}
      <div className="ml-auto">
        <ul className="flex items-center gap-3 sm:gap-5">
          <li>
            <LuBellDot className="text-xl sm:text-2xl text-gray-500 cursor-pointer hover:text-green-600 transition" />
          </li>
          <li>
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/admin.png`}
              alt="Admin"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gray-300"
            />
          </li>
          <li className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm sm:text-base font-semibold text-gray-800">
              {session.user.name}
            </span>
            <span className="text-xs sm:text-sm text-gray-500 truncate max-w-[140px]">
              {session.user.email}
            </span>
          </li>
        </ul>
      </div>
    </aside>
  )
}
