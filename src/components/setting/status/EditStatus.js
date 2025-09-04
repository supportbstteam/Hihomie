'use client'
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react'
import { messageClear, update_statusData } from '@/store/setting';
import { motion, AnimatePresence } from "framer-motion";
import { t } from '@/components/translations';
const EditStatus = ({ open, setOpen, statusData, setStatusData }) => {

    const dispatch = useDispatch();
    const { loader, successMessage, errorMessage } = useSelector(state => state.setting);

    const [formData, setFormData] = useState({
        status_name: "",
        color: "",
        id: "",
    });

    useEffect(() => {
        if (statusData) {
            setFormData({
                status_name: statusData.status_name || "",
                color: statusData.color || "",
                id: statusData._id || "",
            });
        }
    }, [statusData]);

    // handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };
    const [errors, setErrors] = useState({
        status_name: "",
        color: "",
    });

    // ✅ Validate function

    const validateForm = () => {
        const newErrors = { status_name: "", color: "" };
        let valid = true;

        if (!formData.status_name) {
            newErrors.status_name = "Status name is required";
            valid = false;
        } else if (!/^[A-Za-z\s]+$/.test(formData.status_name)) {
            newErrors.status_name = "Only alphabets and spaces allowed";
            valid = false;
        }

        if (!formData.color) {
            newErrors.color = "Please select a color";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    // handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        dispatch(update_statusData(formData))
    };

    useEffect(() => {
        if (successMessage) {
            setStatusData(null)
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
                <div className="fixed inset-0 bg-black/40 flex  justify-center z-[100]">
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 30, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="bg-white md:w-full h-[35vh] sm:w-[50%] md:max-w-[35%] mx-auto rounded-xl shadow-2xl p-6 md:p-8 relative overflow-y-auto mt-5"
                    >

                        {/* Header */}
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('edit_status')}</h2>
                        <button
                            onClick={() => setStatusData(null)}
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
                                    className={`w-full border rounded-sm px-3 py-2 mt-2 text-sm focus:ring-1 focus:outline-none ${errors.status_name ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-green-400"
                                        }`}
                                    placeholder='Escribir estado'
                                    name="status_name"
                                    value={formData.status_name}
                                    onChange={handleChange}
                                />
                                {errors.status_name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.status_name}</p>
                                )}
                            </div>

                            {/* Color select */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    {t('color')}*
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
                                                className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition ${formData.color === item.color ? "border-black scale-110" : "border-gray-300"
                                                    }`}
                                                style={{ backgroundColor: item.color }}
                                            >
                                                {formData.color === item.color && (
                                                    <span className="text-white text-xs font-bold">✔</span>
                                                )}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {errors.color && (
                                    <p className="text-red-500 text-xs mt-1">{errors.color}</p>
                                )}
                            </div>

                            {/* Footer buttons */}
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="reset"
                                    className="px-5 cursor-pointer py-2 border rounded-sm text-gray-700 hover:bg-gray-100 text-sm"
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
                                    className="px-6 cursor-pointer py-2 bg-green-600 text-white rounded-sm hover:bg-green-700 text-sm font-medium"
                                >
                                    {loader ? t('loading') : t('submit')}
                                </button>
                            </div>
                        </form>

                    </motion.div>
                </div>

            </div>
        </AnimatePresence>
    )
}

export default EditStatus
