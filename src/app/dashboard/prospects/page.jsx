'use client'
import React, { useEffect, useState } from 'react'
import { SlCalender } from "react-icons/sl";
import { MdOutlineFilterList } from "react-icons/md";
import { FaList, FaPlus, FaEnvelope, FaPhone, FaCalendarAlt } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { CiCirclePlus } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';
import { customerAdd, messageClear } from '@/store/customer';
import toast from 'react-hot-toast';


const clients = {
    "NUEVOS CLIENTES POTENCIALES": [
        {
            name: "Cameron Williamson",
            email: "camila.iglesias@correo.es",
            phone: "+34 678 901 295",
            date: "Aug,30 2025",
            ingresos: "4.500 € / mes",
            hipoteca: "280.000 €",
        },
        {
            name: "Cameron Williamson",
            email: "camila.iglesias@correo.es",
            phone: "+34 678 901 295",
            date: "Aug,30 2025",
            ingresos: "4.500 € / mes",
            hipoteca: "280.000 €",
        },
    ],
    "CONTACTADO": [],
    "EN EL BANCO": [
        {
            name: "Eleanor Pena",
            email: "camila.iglesias@correo.es",
            phone: "+34 678 901 295",
            date: "Aug,30 2025",
            ingresos: "4.500 € / mes",
            hipoteca: "280.000 €",
        },
    ],
}



const page = () => {

    const [open, setOpen] = useState(false)

    const dispatch = useDispatch();

    const { loader, successMessage, errorMessage } = useSelector(state => state.customer);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        origin: "",
        automatic: false,
    });

    // handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    console.log(formData)

    // handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(customerAdd(formData))

    };

      useEffect(() => {

        if (successMessage) {
          toast.success(successMessage)
          setOpen(false)
          dispatch(messageClear());
        }
    
        if (errorMessage) {
          toast.error(errorMessage)
          dispatch(messageClear());
        }
    
      }, [errorMessage, successMessage])

    return (
        <div>
            <aside className="w-full bg-white shadow-md border-b sticky top-0 z-50">
                <div className="flex items-center justify-between px-4 py-2 sm:px-6 sm:py-3">

                    {/* Title (hide on mobile) */}
                    <div className="hidden sm:flex flex-col">
                        <span className="text-[#071437] text-2xl font-semibold">
                            Gestión de clientes potenciales
                        </span>
                        <span className="text-[#99A1B7] text-sm">
                            Organiza los clientes potenciales y sigue su progreso de forma eficaz aquí
                        </span>
                    </div>

                    {/* Right Side - Date & Filter */}
                    <div className="flex w-full sm:w-auto justify-end">
                        <ul className="flex items-center gap-3 sm:gap-4">
                            {/* List */}
                            <li className="flex items-center gap-2 rounded-1xl border border-gray-200 bg-white shadow-sm px-3 py-2 text-sm sm:text-base text-gray-600 hover:bg-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer">
                                <FaList className="text-lg sm:text-xl text-gray-500" />
                            </li>

                            {/* Download */}
                            <li className="flex items-center gap-2 rounded-1xl border border-gray-200 bg-white shadow-sm px-3 py-2 text-sm sm:text-base text-gray-600 hover:bg-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer">
                                <FiDownload className="text-lg sm:text-xl text-gray-500" />
                            </li>

                            {/* Filter */}
                            <li className="rounded-1xl border border-gray-200 bg-white shadow-sm p-2 hover:bg-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer">
                                <MdOutlineFilterList className="text-lg sm:text-xl text-gray-500" />
                            </li>

                            {/* Add New */}
                            <li className="flex items-center gap-2 rounded-1xl border border-gray-200 bg-white shadow-sm px-3 py-2 text-sm sm:text-base font-medium hover:shadow-md transition-all duration-200 cursor-pointer">
                                <FaPlus className="text-lg sm:text-xl" />
                            </li>
                        </ul>
                    </div>
                </div>
            </aside>


            <div className="py-6 bg-gray-50 min-h-screen">
                {/* Grid Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(clients).map(([status, users], i) => (
                        <div
                            key={status}
                            className="bg-white rounded-xl shadow-md p-4 flex flex-col"
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
                                    {status}
                                </h2>
                                <button onClick={() => setOpen(true)} className="text-[#67778880] text-3xl  hover:text-gray-700"><CiCirclePlus /></button>
                            </div>

                            {/* Client Cards */}
                            <div className="space-y-4">
                                {users.length > 0 ? (
                                    users.map((user, idx) => (
                                        <div
                                            key={idx}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow transition"
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                                                    {user.name[0]}
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl text-[#071437]">
                                                        {user.name}
                                                    </h3>
                                                </div>
                                            </div>

                                            {/* Details */}
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

                                            {/* Finance Box */}
                                            <div className="border border-green-400 rounded-md p-3 mt-3 flex justify-between text-sm text-gray-700">
                                                <div>
                                                    📈 <span className="font-medium text-green-600">Ingresos</span>
                                                    <p>{user.ingresos}</p>
                                                </div>
                                                <div>
                                                    💰 <span className="font-medium text-green-600">%Hipoteca</span>
                                                    <p>{user.hipoteca}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-400 italic">
                                        No clients here
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {open && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]">
                    <div className="bg-white w-full max-w-5xl h-[75vh] rounded-2xl shadow-2xl p-10 relative overflow-y-auto">

                        {/* Close Button */}
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                        >
                            ✕
                        </button>

                        <h2 className="text-3xl font-bold mb-4">Nuevos clientes potenciales</h2>
                        <p className="text-gray-500 text-lg">Crear nuevos clientes potenciales</p>
                        <hr className='mb-8' />
                        {/* Form */}
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="text-base text-gray-700">Nombre</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-xl px-4 py-3 mt-2 text-lg focus:ring focus:ring-green-200"
                                    placeholder='Nombre'
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="text-base text-gray-700">Apellido</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-xl px-4 py-3 mt-2 text-lg focus:ring focus:ring-green-200"
                                    placeholder='Apellido'
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="text-base text-gray-700">Correo electrónico</label>
                                <input
                                    type="email"
                                    className="w-full border rounded-xl px-4 py-3 mt-2 text-lg focus:ring focus:ring-green-200"
                                    placeholder='Correo electrónico'
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="text-base text-gray-700">Número de contacto</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-xl px-4 py-3 mt-2 text-lg focus:ring focus:ring-green-200"
                                    placeholder='Número de contacto'
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="text-base text-gray-700">Contraseña</label>
                                <input
                                    type="password"
                                    className="w-full border rounded-xl px-4 py-3 mt-2 text-lg focus:ring focus:ring-green-200"
                                    placeholder='Contraseña'
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="text-base text-gray-700">Origen del cliente potencial</label>
                                <select name="origin" className="w-full border rounded-xl px-4 py-3 mt-2 text-lg focus:ring focus:ring-green-200" value={formData.origin}
                                    onChange={handleChange}>
                                    <option>Seleccionar origen</option>
                                    <option>Facebook</option>
                                    <option>Google</option>
                                    <option>Referido</option>
                                </select>
                            </div>
                        
                        <div className="flex justify-between items-center mt-10">

                            <span className='font-semibold text-2xl'>Automatico</span>
                            <span><div className="flex items-center gap-3">

                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" name="automatic" checked={formData.automatic}
                                        onChange={handleChange} />
                                    <div className="w-14 h-8 bg-gray-300 rounded-full peer peer-checked:bg-green-600 transition-colors"></div>
                                    <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></div>
                                </label>

                            </div></span>

                        </div>

                        {/* Footer */}
                        {/* Footer */}
                        <div className="col-span-2 flex gap-5 justify-between items-center mt-10">
                            <button
                                type="reset"
                                className="px-6 py-3 border rounded-xl w-[95%] text-gray-700 hover:bg-gray-100 text-lg"
                                onClick={() =>
                                    setFormData({
                                        first_name: "",
                                        last_name: "",
                                        email: "",
                                        phone: "",
                                        password: "",
                                        origin: "",
                                        automatic: false,
                                    })
                                }
                            >
                                Restablecer
                            </button>
                            <button
                               disabled={loader}
                                type="submit"
                                className="px-8 py-3 w-[95%] bg-green-600 text-white rounded-xl hover:bg-green-700 text-lg font-semibold"
                            >
                                 {loader ? "Loading..." : "Aplicar"}
                            </button>
                        </div>
                        </form>
                    </div>
                </div>
            )}





        </div>


    )
}

export default page