'use client'
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { add_team, messageClear } from '@/store/userTema';

const AddTeam = ({ setOpen }) => {
    const dispatch = useDispatch();
    const { loader, errorMessage, successMessage } = useSelector(state => state.team);

    const [formData, setFormData] = useState({
        name: "",
        lname: "",
        email: "",
        phone: "",
        jobTitle: "",
        role: "",
        status: false,
        image: null,
    });

    // 🔹 Common Input Change Handler
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // 🔹 File Change Handler
    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            image: e.target.files[0],
        }));
    };

    // 🔹 Submit Handler
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        for (let key in formData) {
            data.append(key, formData[key]);
        }
        dispatch(add_team(data));
    };

    // 🔹 Show success/error toast
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            setOpen(false);
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    // 🔹 Prevent background scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/40 flex justify-center items-start z-[100] px-4">
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 20, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="bg-white w-full sm:w-[50%] md:max-w-[40%] mx-auto rounded-xl shadow-2xl p-6 md:p-8 relative mt-5 max-h-[90vh] flex flex-col"
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
                    <form onSubmit={handleSubmit} className="space-y-4 mb-5 overflow-y-auto max-h-[70vh]">

                        {/* Name */}
                        <div className="flex flex-col gap-1">
                            <label className="text-gray-700 font-medium text-sm">Nombre De Pila*</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                            />
                        </div>

                        {/* Last Name */}
                        <div className="flex flex-col gap-1">
                            <label className="text-gray-700 font-medium text-sm">Apellido*</label>
                            <input
                                type="text"
                                name="lname"
                                value={formData.lname}
                                onChange={handleChange}
                                required
                                className="p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1">
                            <label className="text-gray-700 font-medium text-sm">Correo Electrónico*</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                            />
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col gap-1">
                            <label className="text-gray-700 font-medium text-sm">Teléfono*</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                            />
                        </div>

                        {/* Job Title */}
                        <div className="flex flex-col gap-1">
                            <label className="text-gray-700 font-medium text-sm">Título Profesional*</label>
                            <input
                                type="text"
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleChange}
                                required
                                className="p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                            />
                        </div>

                        {/* Role */}
                        <div className="flex flex-col gap-1">
                            <label className="text-gray-700 font-medium text-sm">Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                className="p-2 bg-white border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                            >
                                <option value="">--Seleccionar Rol--</option>
                                <option value="admin">Administradora</option>
                                <option value="staff">Personal</option>
                                <option value="accounting">Contabilidad</option>
                                <option value="management">Gestión</option>
                            </select>
                        </div>

                        {/* Image */}
                        <div className="flex flex-col gap-1">
                            <label className="text-gray-700 font-medium text-sm">Imagen*</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                required
                                className="p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                            />
                        </div>

                        {/* Status Toggle */}
                        <div className="flex flex-col gap-1">
                            <label className="text-gray-700 font-medium text-sm">Estado</label>
                            <label className="relative inline-flex items-center cursor-pointer w-fit">
                                <input
                                    type="checkbox"
                                    name="status"
                                    checked={formData.status}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-green-600 transition-colors"></div>
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></div>
                            </label>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 justify-end">
                            <button
                                type="reset"
                                className="px-6 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                                onClick={() => setFormData({
                                    name: "",
                                    lname: "",
                                    email: "",
                                    phone: "",
                                    jobTitle: "",
                                    role: "",
                                    status: false,
                                    image: null,
                                })}
                            >
                                Reiniciar
                            </button>
                            <button
                                disabled={loader}
                                type="submit"
                                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                {loader ? "Cargando..." : "Entregar"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AddTeam;
