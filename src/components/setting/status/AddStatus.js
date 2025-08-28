'use client'
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react'
import { AddStatusData, messageClear } from '@/store/setting';

const AddStatus = ({ open, setOpen }) => {

    const dispatch = useDispatch();

    const { loader, successMessage, errorMessage } = useSelector(state => state.setting);

    const [formData, setFormData] = useState({
        status_name: "",
        color: "",
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
        dispatch(AddStatusData(formData))
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

    const menu = [
        { color: '#cccccc' },
        { color: '#20aee3' },
        { color: '#24d2b5' },
        { color: '#ff5c6c' },
        { color: '#ff9041' },
        { color: '#6772e5' },
        { color: '#cddc39' },
        { color: '#795548' },
    ]

    return (
        <div>
            {open && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]">
                    <div className="bg-white w-full max-w-3xl h-[55vh] rounded-2xl shadow-2xl p-10 relative overflow-y-auto">

                        {/* Close Button */}
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                        >
                            ✕
                        </button>

                        <p className="text-gray-500 text-lg">Estado</p>
                        <hr className='mb-8' />

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="w-full">
                                <label className="text-base text-gray-700">Nombre del estado</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-xl px-4 py-3 mt-2 text-lg focus:ring focus:ring-green-200"
                                    placeholder='Status Name'
                                    name="status_name"
                                    value={formData.status_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="w-full">
                                <label className="text-base text-gray-700">Color</label>
                                <div className="flex flex-wrap gap-3 mt-2">
                                    {menu.map((item, i) => (
                                        <label key={i} className="cursor-pointer">
                                            <input
                                                type="radio"
                                                name="color"
                                                value={item.color}
                                                checked={formData.color === item.color}
                                                onChange={handleChange}
                                                className="hidden"
                                            />
                                            <span
                                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition 
            ${formData.color === item.color ? "border-black scale-110" : "border-gray-300"}`}
                                                style={{ backgroundColor: item.color }}
                                            >
                                                {formData.color === item.color && (
                                                    <span className="text-white text-xs font-bold">✔</span>
                                                )}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex gap-5 justify-between items-center mt-10">
                                <button
                                    type="reset"
                                    className="px-6 py-3 border rounded-xl w-1/2 text-gray-700 hover:bg-gray-100 text-lg"
                                    onClick={() =>
                                        setFormData({
                                            status_name: "",
                                            color: "",
                                        })
                                    }
                                >
                                    Restablecer
                                </button>
                                <button
                                    disabled={loader}
                                    type="entregar"
                                    className="px-8 py-3 w-1/2 bg-green-600 text-white rounded-xl hover:bg-green-700 text-lg font-semibold"
                                >
                                    {loader ? "Cargando..." : "Aplicar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AddStatus
