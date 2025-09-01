'use client'
import { get_teamData } from '@/store/userTema';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { t } from '@/components/translations';

const Filter = ({ leadStatusList, filterOpen, setFilterOpen, setSelecteFilterData }) => {
    const dispatch = useDispatch();
    const { loader, team } = useSelector((state) => state.team);

    const [open, setOpen] = useState(false);

    // ✅ Local states for filters
    const [selectedGestor, setSelectedGestor] = useState("");
    const [selectedEstado, setSelectedEstado] = useState("");
    const [fullName, setFullName] = useState(""); // 🔥 New
    const [phone, setPhone] = useState("");       // 🔥 New

    useEffect(() => {
        dispatch(get_teamData());
    }, [dispatch]);

    const handleApply = () => {
        // ✅ Send all values to parent
        setSelecteFilterData({
            gestor: selectedGestor,
            estado: selectedEstado,
            full_name: fullName,
            phone: phone,
        });
        setFilterOpen(false);

        // Reset filters
        setSelectedGestor("");
        setSelectedEstado("");
        setFullName("");
        setPhone("");
    };

    const handleCancel = () => {
        setSelectedGestor("");
        setSelectedEstado("");
        setFullName("");
        setPhone("");
        setOpen(false);
    };

    return (
        <div>
            {/* ==== Overlay ==== */}
            {filterOpen && (
                <div className="fixed inset-0 bg-opacity-30 z-40 pointer-events-none" />
            )}

            {/* ==== Drawer ==== */}
            <aside
                className={`fixed top-0 right-0 h-full w-[25%] bg-white shadow-lg z-50 transform transition-transform duration-300 ${filterOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">{t('filter')}</h2>
                        <p className="text-[#99A1B7]">{t('find_exact')}</p>
                    </div>
                    <button
                        onClick={() => setFilterOpen(false)}
                        className="text-[#99A1B7] text-2xl px-3 py-1"
                    >
                        ✕
                    </button>
                </div>

                {/* Drawer Content */}
                <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-60px)]">
                    {/* Gestor */}
                    <div>
                        <label className="font-medium">{t('manager')}</label>
                        <select
                            value={selectedGestor}
                            onChange={(e) => setSelectedGestor(e.target.value)}
                            className="mt-1 w-full h-[5vh] text-[#99A1B7] outline-none bg-transparent rounded-lg border px-3 py-2"
                        >
                            <option value="">Todos los gestores</option>
                            {team.map((g) => (
                                <option key={g._id} value={g._id}>
                                    {g.name} {g.lname}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Estado */}
                    <div>
                        <label className="font-medium">{t('status')}</label>
                        <select
                            value={selectedEstado}
                            onChange={(e) => setSelectedEstado(e.target.value)}
                            className="mt-1 w-full h-[5vh] text-[#99A1B7] outline-none bg-transparent rounded-lg border px-3 py-2"
                        >
                            <option value="">Todas las hipotecas</option>
                            {leadStatusList.map((item, i) => (
                                <option key={i} value={item.leadStatusId}>
                                    {item.leadStatusname}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Usuario */}
                    <div>
                        <label className="font-medium">{t('full_name')}</label>
                        <input
                            type="text"
                            name="full_name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="mt-1 w-full h-[5vh] text-[#99A1B7] outline-none bg-transparent rounded-lg border px-3 py-2"
                            placeholder="Buscar por nombre"
                        />
                    </div>

                    {/* Contacto */}
                    <div>
                        <label className="font-medium">{t('phone')}</label>
                        <input
                            type="number"
                            name="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="mt-1 w-full h-[5vh] text-[#99A1B7] outline-none bg-transparent rounded-lg border px-3 py-2"
                            placeholder="Buscar por contacto"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 h-[7vh] pt-4">
                        <button
                            onClick={handleCancel}
                            className="flex-1 rounded-lg border py-2"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            onClick={handleApply}
                            className="flex-1 rounded-lg bg-[#21B573] text-white py-2"
                        >
                           {t('apply')}
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default Filter;
