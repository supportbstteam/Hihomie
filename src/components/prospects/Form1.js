'use client'
import React, { useState, useEffect } from 'react'
import TextEditor from '../TextEditor'
import { t } from '@/components/translations';

const Form1 = ({ setDetailsData, selectedUser }) => {

    const [detailsData, setLocalDetailsData] = useState({
        source: "Amarillo y páginas",
        category: "Por defecto",
        tag: "Alta",
        last_connected: "",
        notes: "",
    });

    // ✅ Jab selectedUserData aaye to local state update karo
    useEffect(() => {
        if (selectedUser) {
            setLocalDetailsData({
                source: selectedUser.source || "Amarillo y páginas",
                category: selectedUser.category || "Por defecto",
                tag: selectedUser.tag || "Alta",
                last_connected: selectedUser.last_connected || "",
                notes: selectedUser.notes || "",
            });

            // Parent me bhi update bhej do
            setDetailsData({
                source: selectedUser.source || "Amarillo y páginas",
                category: selectedUser.category || "Por defecto",
                tag: selectedUser.tag || "Alta",
                last_connected: selectedUser.last_connected || "",
                notes: selectedUser.notes || "",
            });
        }
    }, [selectedUser, setDetailsData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalDetailsData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setDetailsData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    console.log(detailsData)

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-1 w-full mb-5">
                <label className="text-gray-700 font-medium text-sm">{t('notes')}</label>
                <div className="w-full">
                    <TextEditor
                        className="min-h-[150px]"
                        name="notes"
                        value={detailsData.notes}
                        onChange={(val) => {
                            setLocalDetailsData((prev) => ({ ...prev, notes: val }));
                            setDetailsData((prev) => ({ ...prev, notes: val }));
                        }}
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <label className="w-32 text-gray-700 font-medium text-sm">{t('fountain')}</label>
                <select
                    name="source"
                    className="flex-1 p-1 bg-white border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                    value={detailsData.source}
                    onChange={handleChange}
                    required
                >
                    <option value="Amarillo y páginas">Amarillo y páginas</option>
                    <option value="yahoo">yahoo</option>
                    <option value="Lugares de Google">Lugares de Google</option>
                    <option value="Anuncios de Facebook">Anuncios de Facebook</option>
                </select>
            </div>

            <div className="flex items-center gap-3">
                <label className="w-32 text-gray-700 font-medium text-sm">{t('Category')}</label>
                <select
                    name="category"
                    className="flex-1 p-1 bg-white border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                    value={detailsData.category}
                    onChange={handleChange}
                    required
                >
                    <option value="Por defecto">Por defecto</option>
                    <option value="Desarrollo de aplicaciones">Desarrollo de aplicaciones</option>
                    <option value="Diseño Gráfico">Diseño Gráfico</option>
                </select>
            </div>

            <div className="flex items-center gap-3">
                <label className="w-32 text-gray-700 font-medium text-sm">{t('tag')}</label>
                <select
                    name="tag"
                    className="flex-1 p-1 bg-white border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                    value={detailsData.tag}
                    onChange={handleChange}
                    required
                >
                    <option value="Alta">Alta</option>
                    <option value="Joomla">Joomla</option>
                    <option value="Diseño de logotipo">Logo Design</option>
                    <option value="Diseño Web">Diseño Web</option>
                    <option value="Wordpress">Wordpress</option>
                </select>
            </div>

            <div className="flex items-center gap-3">
                <label className="w-32 text-gray-700 font-medium text-sm">{t('date')}</label>
                <input
                    type="Date"
                    className="flex-1 p-1 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                    name="last_connected"
                    value={detailsData.last_connected}
                    onChange={handleChange}
                    required
                />
            </div>

            <hr className='border border-stroke' />
        </div>
    )
}

export default Form1
