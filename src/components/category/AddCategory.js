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
        status: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(AddCategorys(formData));
    };

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
                            <label className="text-gray-700 font-medium text-sm">{t('category')}*</label>
                            <input
                                type="text"
                                className="p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            />
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
                                className="px-6 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                                onClick={() => setFormData({ category: "", status: "" })}
                            >
                                {t('cancel')}
                            </button>
                            <button
                                disabled={loader}
                                type="submit"
                                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
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
