import Link from 'next/link'
import { LuBellDot } from "react-icons/lu";
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { SlCalender } from "react-icons/sl";
import { MdOutlineFilterList } from "react-icons/md";

export default async function LoweNav() {
    const session = await getServerSession(authOptions)
    if (!session) redirect('/login')

    return (
        <aside className="w-full bg-white shadow-md border-b sticky top-0 z-50">
            <div className="flex items-center justify-between px-4 py-2 sm:px-6 sm:py-3">

                {/* Title (hide on mobile) */}
                <div className="hidden sm:flex flex-col">
                    <span className="text-[#071437] text-2xl font-semibold">
                        Panel de control
                    </span>
                    <span className="text-[#99A1B7] text-sm">
                        Vista completa del rendimiento empresarial
                    </span>
                </div>

                {/* Right Side - Date & Filter */}
                <div className="flex w-full sm:w-auto justify-end">
                    <ul className="flex items-center gap-4 sm:gap-6 sm:flex sm:justify-between">
                        {/* Date */}
                        <li className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1 text-sm sm:text-lg font-medium text-[#99A1B7] cursor-pointer hover:bg-gray-50">
                            <span>15 dic 2024 - 8 jun 2025</span>
                            <SlCalender className="text-lg sm:text-xl" />
                        </li>

                        {/* Filter Icon */}
                        <li className="border text-[#99A1B7] border-gray-300 rounded-md p-2 cursor-pointer hover:bg-gray-50">
                            <MdOutlineFilterList className="text-xl text-[#071437]" />
                        </li>
                    </ul>
                </div>

            </div>
        </aside>
    )
}
