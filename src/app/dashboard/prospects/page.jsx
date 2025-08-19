'use client'
import React from 'react'
import { MdOutlineFilterList } from "react-icons/md";
import { FaList, FaPlus } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";;
import Nuevos from '@/components/prospects/Nuevos';
import Contactado from '@/components/prospects/Contactado';
import EnElBanco from '@/components/prospects/EnElBanco';
import Aprobado from '@/components/prospects/Aprobado';
import Rechazado from '@/components/prospects/Rechazado';

const Page = () => {
    return (
        <div className='grid w-full'>
            {/* Header */}
            <aside className="w-full bg-white shadow-md border-b sticky top-0 z-50">
                <div className="flex items-center justify-between px-4 py-2 sm:px-6 sm:py-3">
                    <div className="hidden sm:flex flex-col">
                        <span className="text-[#071437] text-2xl font-semibold">
                            Gestión de clientes potenciales
                        </span>
                        <span className="text-[#99A1B7] text-sm">
                            Organiza los clientes potenciales y sigue su progreso de forma eficaz aquí
                        </span>
                    </div>

                    <div className="flex w-full sm:w-auto justify-end">
                        <ul className="flex items-center gap-3 sm:gap-4">
                            <li className="flex items-center gap-2 rounded-1xl border border-gray-200 bg-white shadow-sm px-3 py-2 cursor-pointer">
                                <FaList className="text-lg sm:text-xl text-gray-500" />
                            </li>
                            <li className="flex items-center gap-2 rounded-1xl border border-gray-200 bg-white shadow-sm px-3 py-2 cursor-pointer">
                                <FiDownload className="text-lg sm:text-xl text-gray-500" />
                            </li>
                            <li className="rounded-1xl border border-gray-200 bg-white shadow-sm p-2 cursor-pointer">
                                <MdOutlineFilterList className="text-lg sm:text-xl text-gray-500" />
                            </li>
                            <li className="flex items-center gap-2 rounded-1xl border border-gray-200 bg-white shadow-sm px-3 py-2 font-medium cursor-pointer">
                                <FaPlus className="text-lg sm:text-xl" />
                            </li>
                        </ul>
                    </div>
                </div>
            </aside>
            {/* Main Grid */}
            <div className="  p-4 rounded-xl   bg-[#f9f9f9]  overflow-hidden ">
                <div className="flex  gap-4 p-4 rounded-xl  bg-white overflow-x-auto scrollbar-hide">
                    <Nuevos />
                    <Contactado />
                    <EnElBanco />
                    <Aprobado />
                    <Rechazado />
                </div>
            </div>
        </div>
    )
}

export default Page