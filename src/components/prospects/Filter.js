'use client'
import React, { useState } from 'react'

const Filter = ({ filterOpen, setFilterOpen }) => {



    const [open, setOpen] = useState(false);

    // Gestor multi-select state
    const [gestores] = useState([
        "Sonia Degollada",
        "Adria Fernandez",
        "Inma Macias",
         "Inma test",
    ]);
    const [selectedGestores, setSelectedGestores] = useState([]);

    // Handle select change
    const handleGestorChange = (e) => {
        const value = e.target.value;
        if (value !== "" && !selectedGestores.includes(value)) {
            setSelectedGestores([...selectedGestores, value]);
        }
    };

    // Remove chip
    const removeGestor = (name) => {
        setSelectedGestores(selectedGestores.filter((g) => g !== name));
    };





    return (
        <div>


            {/* ==== Drawer (Right Side Popup) ==== */}
            <div
                className={`fixed inset-0 z-40 transition-opacity ${filterOpen ? "visible z-103" : "opacity-0 invisible"
                    }`}
                onClick={() => setFilterOpen(false)}
            />

            <aside
                className={`fixed top-0 right-0 h-full w-[25%] bg-white shadow-lg z-50 transform transition-transform duration-300 ${filterOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="p-4 border-b flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">Filters</h2>
                        <p className='text-[#99A1B7]'>Encuentra exactamente lo que necesitas</p>
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
                        <label className="font-medium">Gestor</label>
                        <select
                            onChange={handleGestorChange}
                            className="mt-1 w-full h-[5vh] text-[#99A1B7] outline-none bg-transparent rounded-lg border px-3 py-2"
                            defaultValue=""
                        >
                            <option value="">Todos los gestores</option>
                            {gestores.map((g) => (
                                <option key={g} value={g}>
                                    {g}
                                </option>
                            ))}
                        </select>

                        {/* Chips */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedGestores.map((name) => (
                                <span
                                    key={name}
                                    className="flex items-center gap-1 bg-[#F9F9F9] rounded-full px-3 py-1 "
                                >
                                    {name}
                                    <button
                                        onClick={() => removeGestor(name)}
                                        className="text-[#99A1B7] hover:text-black"
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Contactado */}
                    <div>
                        <label className=" font-medium">Contactado</label>
                        <select className="mt-1 w-full h-[5vh] text-[#99A1B7] outline-none bg-transparent rounded-lg border px-3 py-2">
                            <option>Todas las hipotecas</option>
                            <option>Hipoteca 1</option>
                            <option>Hipoteca 2</option>
                        </select>
                    </div>

                    {/* Usuario */}
                    <div>
                        <label className=" font-medium">Usuario</label>
                        <select className="mt-1 w-full h-[5vh] text-[#99A1B7] outline-none bg-transparent rounded-lg border px-3 py-2">
                            <option>Todos los usuarios</option>
                            <option>Usuario 1</option>
                            <option>Usuario 2</option>
                        </select>
                    </div>

                    {/* Contacto */}
                    <div>
                        <label className="font-medium">Contacto</label>
                        <select className="mt-1 w-full h-[5vh] text-[#99A1B7] outline-none bg-transparent rounded-lg border px-3 py-2">
                            <option>Todos los contactos</option>
                            <option>Contacto 1</option>
                            <option>Contacto 2</option>
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 h-[7vh] pt-4">
                        <button
                            onClick={() => {
                                setSelectedGestores([]);
                                setOpen(false);
                            }}
                            className="flex-1 rounded-lg border py-2"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => alert(JSON.stringify({ selectedGestores }))}
                            className="flex-1 rounded-lg bg-[#21B573] text-white py-2"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </aside>


        </div>
    )
}

export default Filter