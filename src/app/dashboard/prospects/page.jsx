'use client'
import React, { useEffect, useState } from 'react'
import { MdOutlineFilterList } from "react-icons/md";
import { FaList, FaPlus, FaEnvelope, FaPhone, FaCalendarAlt } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { CiCirclePlus } from "react-icons/ci";
import CustomerAdd from '@/components/prospects/CustomerAdd';
import { useDispatch, useSelector } from 'react-redux';
import { get_customer } from '@/store/customer';
import Card from '@/components/prospects/Card';


const statusLabels = {
    1: "NUEVOS CLIENTES POTENCIALES",
    2: "CONTACTADO",
    3: "EN EL BANCO",
    4: "APROBADO",
    5: "RECHAZADO",
};

const Page = () => {
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch();
    const { customer } = useSelector(state => state.customer);

    useEffect(() => {
        dispatch(get_customer())
    }, [])

    return (
        <div>
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
            <div className="p-3 rounded-xl  bg-[#fff] w-[2000px] scrollbar-hide">
                <div className="grid md:grid-cols-5  gap-4 overflow-x-scroll rounded-xl bg-[#fff] ">
                    {Object.entries(customer).map(([statusNumber, users], i) => (
                        <div
                            key={statusNumber}
                            className="rounded-xl shadow-md p-2 flex flex-col h-[80vh]   bg-[#f9f9f9]"
                        >
                            {/* Column Header */}
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <span
                                        className={`w-3 h-3 rounded-full ${i === 0
                                            ? "bg-blue-500"
                                            : i === 1
                                                ? "bg-green-500"
                                                : "bg-purple-500"
                                            }`}
                                    />
                                    {statusLabels[statusNumber] || statusNumber}
                                </h2>
                                <button
                                    onClick={() => setOpen(true)}
                                    className="text-[#67778880] text-3xl hover:text-gray-700"
                                >
                                    <CiCirclePlus />
                                </button>
                            </div>
                            <section className="grid gap-4 scrollbar-hide">


                            {/* Client Cards with vertical scroll */}
                            <Card users={users}/>
                            </section>

                            {/* <div className="space-y-4 overflow-y-auto pr-2 flex-grow">
                                {users.length > 0 ? (
                                    users.map((user, idx) => (
                                        <div
                                            key={idx}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow transition"
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                                                    {user.first_name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl text-[#071437]">
                                                        {user.first_name} {user.last_name}
                                                    </h3>
                                                </div>
                                            </div>

                                            <div className="space-y-2 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <FaEnvelope className="text-gray-400" /> {user.email}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FaPhone className="text-gray-400" /> {user.phone}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FaCalendarAlt className="text-gray-400" /> {user.date}
                                                </div>
                                            </div>

                                            <div className="border border-green-400 rounded-md p-3 mt-3 flex justify-between text-sm text-gray-700">
                                                <div>
                                                    📈 <span className="font-medium text-green-600">Ingresos</span>
                                                    <p>4.500 € / mes</p>
                                                </div>
                                                <div>
                                                    💰 <span className="font-medium text-green-600">%Hipoteca</span>
                                                    <p>280.000 €</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-400 italic">
                                        No clients here
                                    </p>
                                )}
                            </div> */}
                        </div>
                    ))}
                </div>
            </div>

            <CustomerAdd open={open} setOpen={setOpen} />
        </div>
    )
}

export default Page