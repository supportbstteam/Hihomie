'use client'
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react'
import { category_update, messageClear } from '@/store/category';


const EditCategory = ({setEditOpen, categorys}) => {

     const dispatch = useDispatch();
    const { loader, errorMessage, successMessage } = useSelector(state => state.category);

    const [formData, setFormData] = useState({
        category: "",
        status : "",
        id : "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    useEffect(() => {
    if (categorys) {
        setFormData({
            category: categorys.category || "",
            status: categorys.status || "",
            id :  categorys._id || "",
        });
    }
}, [categorys]);


    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(category_update(formData))
    };

    useEffect(() => {
        
        if (successMessage) {
            toast.success(successMessage)
            setEditOpen(false)
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear());
        }
    }, [errorMessage, successMessage])


  return (
    <div>
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] px-4">
                    <div className="bg-white w-full max-w-[40%] mx-auto rounded-xl shadow-2xl p-6 md:p-8 relative overflow-y-auto ">

                        {/* Close Button */}
                        <button
                            onClick={() => setEditOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
                        >
                            ✕
                        </button>

                        <p className="text-gray-700 text-[20px] mb-6">Editar categoría</p>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4 mb-5 overflow-y-auto max-h-[77vh]">

                            {/* Lead Title */}
                            <div className="flex items-center gap-3">
                                <label className="w-32 text-gray-700 font-medium text-sm">Categoría*</label>
                                <input
                                    type="text"
                                    className="flex-1 p-1 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-3">
                                <label className="w-32 text-gray-700 font-medium text-sm">Estado</label>
                                <select
                                    name="status"
                                    className="flex-1 p-1 bg-white border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">--Seleccionar estado--</option>
                                    <option value="Activa">Activa</option>
                                    <option value="Inactiva">Inactiva</option>
                                </select>
                            </div>

                           

                            {/* Buttons */}
                            <div className="flex gap-3 justify-end">
                                <button
                                    type="reset"
                                    className="px-6 py-2 border rounded-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() =>
                                        setFormData({
                                            category: "",
                                            status: "",
                                        })
                                    }
                                >
                                    Reiniciar
                                </button>
                                <button
                                    disabled={loader}
                                    type="entregar"
                                    className="px-6 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700"
                                >
                                    {loader ? "Cargando..." : "Entregar"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>

        </div>
  )
}

export default EditCategory