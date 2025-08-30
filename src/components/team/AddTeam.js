'use client'
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { add_team, messageClear } from '@/store/userTema';

const AddTeam = ({ setOpen }) => {
    const dispatch = useDispatch();
    const { loader, errorMessage, successMessage } = useSelector(state => state.team);

    // ✅ सारी fields state में रखीं
    const [formData, setFormData] = useState({
        name: "",
        lname: "",
        email: "",
        phone: "",
        jobTitle: "",
        role: "",
        status: false,
        image: null, // <-- नया field
    });

    // ✅ common change handler
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = new FormData();
        for (let key in formData) {
            data.append(key, formData[key]);
        }

        dispatch(add_team(data));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            image: e.target.files[0],
        }));
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/40 flex items-start justify-center z-[100] px-4">
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 20, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="bg-white w-full max-w-[40%] mx-auto rounded-xl shadow-2xl p-6 md:p-8 relative overflow-y-auto mt-5"
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setOpen(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
                    >
                        ✕
                    </button>

                    <p className="text-gray-700 text-[20px] mb-6">Agregar Nuevo Usuario</p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 mb-5 overflow-y-auto max-h-[77vh]">

                        {/* First Name */}
                        <div className="flex items-center gap-5">
                            <label className="w-32 text-gray-700 font-medium">Nombre De Pila*</label>
                            <input
                                type="text"
                                className="flex-1 p-1 border border-gray-300 rounded-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Last Name */}
                        <div className="flex items-center gap-5">
                            <label className="w-32 text-gray-700 font-medium">Apellido*</label>
                            <input
                                type="text"
                                className="flex-1 p-1 border border-gray-300 rounded-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                                name="lname"
                                value={formData.lname}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="flex items-center gap-5">
                            <label className="w-32 text-gray-700 font-medium">Correo Electrónico*</label>
                            <input
                                type="email"
                                className="flex-1 p-1 border border-gray-300 rounded-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div className="flex items-center gap-5">
                            <label className="w-32 text-gray-700 font-medium">Teléfono*</label>
                            <input
                                type="text"
                                className="flex-1 p-1 border border-gray-300 rounded-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Job Title */}
                        <div className="flex items-center gap-5">
                            <label className="w-32 text-gray-700 font-medium">Título Profesional*</label>
                            <input
                                type="text"
                                className="flex-1 p-1 border border-gray-300 rounded-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Role */}
                        <div className="flex items-center gap-5">
                            <label className="w-32 text-gray-700 font-medium text-sm">Role</label>
                            <select
                                name="role"
                                className="flex-1 p-2 bg-white border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="">--Seleccionar Rol--</option>
                                <option value="admin">Administradora</option>
                                <option value="staff">Personal</option>
                                <option value="accounting">Contabilidad</option>
                                <option value="management">Gestión</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-5">
                            <label className="w-32 text-gray-700 font-medium">Imagen*</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="flex-1 p-1 border border-gray-300 rounded-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                                onChange={handleFileChange}
                                required
                            />
                        </div>

                        {/* Status Toggle */}
                        <div className="flex items-center justify-between mt-2">
                            <span className="w-32 font-medium text-gray-700 text-sm">Estado</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    name="status"
                                    checked={formData.status}
                                    onChange={handleChange}
                                />
                                {/* Outer background */}
                                <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-green-600 transition-colors"></div>
                                {/* Inner circle */}
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></div>
                            </label>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 justify-end">
                            <button
                                type="reset"
                                className="px-6 py-2 border rounded-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setFormData({
                                    firstName: "",
                                    lastName: "",
                                    email: "",
                                    phone: "",
                                    jobTitle: "",
                                    role: "",
                                    status: false,
                                })}
                            >
                                Reiniciar
                            </button>
                            <button
                                disabled={loader}
                                type="submit"
                                className="px-6 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700"
                            >
                                {loader ? "Cargando..." : "Entregar"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default AddTeam;
