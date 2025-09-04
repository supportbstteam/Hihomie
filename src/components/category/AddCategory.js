'use client'
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react';
import { AddCategorys, messageClear } from '@/store/category';
import { motion, AnimatePresence } from "framer-motion";
import { t } from '@/components/translations';

const AddCategory = ({ setOpen }) => {
    const dispatch = useDispatch();
    const { loader, errorMessage, successMessage } = useSelector(state => state.category);

    const [formData, setFormData] = useState({
        category: "",
        status: true,
    });
    const [errors, setErrors] = useState({ category: '' })

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const validateForm = () => {
        let newErrors = { category: '' }
        let valid = true

        // ✅ Alphabet-only Validation for Category
        if (!formData.category) {
            newErrors.category = "Category is required"
            valid = false
        } else if (!/^[A-Za-z\s]+$/.test(formData.category)) {
            newErrors.category = "Only alphabets are allowed"
            valid = false
        }

        setErrors(newErrors)
        return valid
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return
        dispatch(AddCategorys(formData));
    };

    useEffect(() => {
        if (successMessage) {
            setOpen(false);
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [errorMessage, successMessage]);

    // 🔥 Prevent background scrolling when modal is open
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
                    className="bg-white w-full sm:w-[50%] md:max-w-[35%] mx-auto rounded-xl shadow-2xl p-6 md:p-8 relative mt-5 max-h-[90vh] flex flex-col"
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setOpen(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
                    >
                        ✕
                    </button>

                    <p className="text-gray-700 text-[20px] mb-6">{t('add_category_label')}</p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 mb-5 overflow-y-auto max-h-[70vh]">

                        {/* Category */}
                        <div className="flex flex-col gap-1">
                            <label className="text-gray-700 font-medium text-sm">
                                {t('category')}*
                            </label>

                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={`p-2 w-full text-sm rounded-lg border focus:ring-1 focus:ring-green-400 focus:outline-none ${errors.category ? "border-red-500" : "border-gray-300"
                                    }`}
                            />

                            {errors.category && (
                                <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                            )}
                        </div>


                        {/* Status */}
                        {/* Status Toggle */}
                        <div className="flex flex-col gap-1">
                            <label className="text-gray-700 font-medium text-sm">{t('status')}</label>
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
                                className="px-6 cursor-pointer  py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                                onClick={() => setFormData({ category: "", status: "" })}
                            >
                                {t('cancel')}
                            </button>
                            <button
                                disabled={loader}
                                type="submit"
                                className="px-6 cursor-pointer py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                {loader ? t('loading') : t('submit')}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AddCategory;
