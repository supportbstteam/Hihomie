'use client'
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react'
import { AddStatusData, messageClear } from '@/store/setting';
import { motion, AnimatePresence } from "framer-motion";
import { t } from '@/components/translations';
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
        <AnimatePresence>
            <div>
                {open && (
                    <div className="fixed inset-0 bg-black/40 flex justify-center z-[100]">
                        <motion.div
                            initial={{ y: -100, opacity: 0 }}
                            animate={{ y: 30, opacity: 1 }}
                            exit={{ y: -100, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="bg-white md:w-full h-[35vh] sm:w-[50%] md:max-w-[35%] mx-auto rounded-xl shadow-2xl p-6 md:p-8 relative overflow-y-auto mt-5"
                        >


                            {/* Header */}
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('add_status')}</h2>
                            <button
                                onClick={() => setOpen(false)}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
                            >
                                ✕
                            </button>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                {/* Estado name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {t('status')} {t('name')}*
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-sm px-3 py-2 mt-2 text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                                        placeholder='Escribir estado'
                                        name="status_name"
                                        value={formData.status_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Color select */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {t('color')}
                                    </label>
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
                                                    className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition 
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

                                {/* Footer buttons */}
                                <div className="flex justify-end gap-3 mt-4">
                                    <button
                                        type="reset"
                                        className="px-5 py-2 border rounded-sm text-gray-700 hover:bg-gray-100 text-sm"
                                        onClick={() =>
                                            setFormData({
                                                status_name: "",
                                                color: "",
                                            })
                                        }
                                    >
                                       {t('cancel')}
                                    </button>
                                    <button
                                        disabled={loader}
                                        type="submit"
                                        className="px-6 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700 text-sm font-medium"
                                    >
                                        {loader ?t('loading') : t('submit')}
                                    </button>
                                </div>
                            </form>

                        </motion.div>
                    </div>
                )}
            </div>
        </AnimatePresence>
    )
}

export default AddStatus
