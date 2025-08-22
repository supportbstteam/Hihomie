'use client'

import { useDispatch, useSelector } from 'react-redux';
import { customerAdd, messageClear } from '@/store/customer';
import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react'

const CustomerAdd = ({ open, setOpen }) => {


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

                            <div className="flex justify-between items-center mt-10 col-span-2">
                                <span className="font-semibold text-2xl">Automático</span>
                                <div className="flex items-center gap-3">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            name="automatic"
                                            checked={formData.automatic}
                                            onChange={handleChange}
                                        />
                                        <div className="w-14 h-8 bg-gray-300 rounded-full peer peer-checked:bg-green-600 transition-colors"></div>
                                        <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></div>
                                    </label>
                                </div>
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

export default CustomerAdd