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

                {/* Title */}
                <div className="flex flex-col">
                    <span className="text-[#071437] text-2xl font-semibold">
                        Panel de control
                    </span>
                    <span className="text-[#99A1B7] text-sm">
                        Vista completa del rendimiento empresarial
                    </span>
                </div>

                {/* Right Side - Date & Filter */}
                <div>
                    <ul className="flex items-center gap-3 sm:gap-5">
                        {/* Date */}
                        <li className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1 text-lg font-medium text-[#99A1B7] cursor-pointer hover:bg-gray-50">
                            15 dic 2024 - 8 jun 2025
                            <SlCalender className="text-xl" />
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

