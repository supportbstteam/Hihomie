"use client"

import { useState } from 'react';

// Organized fields based on the new SEGUIMIENTO LEADS CSV
const formCategories = [
  {
    title: "Información Básica (Basic Info)",
    fields: [
      { name: "id_lead", label: "ID Lead", type: "text" },
      { name: "nombre", label: "Nombre", type: "text" },
      { name: "telefono", label: "Teléfono", type: "text" },
      { name: "direccion", label: "Dirección", type: "text" },
      { name: "poblacion", label: "Población", type: "text" },
      { 
        name: "alquiler_o_venta", 
        label: "Alquiler o Venta", 
        type: "select",
        options: ["", "Alquiler", "Venta", "Ambos"]
      },
    ]
  },
  {
    title: "Asignación y Origen (Assignment & Source)",
    fields: [
      { name: "fecha_alta", label: "Fecha Alta", type: "date" },
      { name: "captador", label: "Captador", type: "text" },
      { name: "comercial_asignado", label: "Comercial (Asignado)", type: "text" },
      { name: "fuente_canal", label: "Fuente / Canal", type: "text" },
    ]
  },
  {
    title: "Seguimiento y Estado (Tracking & Status)",
    fields: [
      { name: "estado_lead", label: "Estado Lead", type: "text" },
      { name: "ultimo_contacto", label: "Último Contacto", type: "date" },
      { name: "resultado_ultimo_contacto", label: "Resultado Último Contacto", type: "text" },
      { name: "siguiente_llamada", label: "Siguiente Llamada", type: "date" },
      { name: "dias_desde_ultimo_contacto", label: "Días desde último contacto", type: "number" },
      { name: "dias_hasta_siguiente_llamada", label: "Días hasta siguiente llamada", type: "number" },
      { name: "seguimiento_vencido", label: "Seguimiento Vencido", type: "checkbox" },
    ]
  },
  {
    title: "Datos Económicos (Financials)",
    fields: [
      { name: "precio_venta", label: "Precio de Venta", type: "number" },
      { name: "honorarios", label: "Honorarios", type: "number" },
    ]
  },
  {
    title: "Notas (Notes)",
    fields: [
      { name: "observaciones", label: "Observaciones", type: "textarea" },
    ]
  }
];

const CreateLead = () => {
  // Initialize state dynamically
  const initialState = formCategories.reduce((acc, category) => {
    category.fields.forEach(field => {
      acc[field.name] = field.type === 'checkbox' ? false : '';
    });
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Lead Form Submitted:", formData);
    // Add your API POST call here (like the one we worked on earlier!)
  };

  return (
    <div className="w-full bg-white shadow-md">
      <div className="border-b px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-800">Crear Nuevo Lead</h2>
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        {formCategories.map((category, idx) => (
          <div key={idx} className="border-b border-gray-200">
            {/* Category Header */}
            <div className="bg-gray-50 px-6 py-3">
              <h3 className="text-lg font-semibold text-gray-700">{category.title}</h3>
            </div>
            
            {/* Category Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-6">
              {category.fields.map((field) => (
                <div 
                  key={field.name} 
                  // Make textareas span full width if desired, or keep them in the grid
                  className={`flex flex-col ${field.type === 'textarea' ? 'md:col-span-2 lg:col-span-3' : ''}`}
                >
                  <label htmlFor={field.name} className="mb-2 text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  
                  {field.type === 'textarea' ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      rows="3"
                      className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ) : field.type === 'select' ? (
                    <select
                      id={field.name}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {field.options.map((opt, i) => (
                        <option key={i} value={opt}>{opt || "Seleccione..."}</option>
                      ))}
                    </select>
                  ) : field.type === 'checkbox' ? (
                    <div className="flex items-center mt-2">
                      <input
                        id={field.name}
                        name={field.name}
                        type="checkbox"
                        checked={formData[field.name]}
                        onChange={handleChange}
                        className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Sí, vencido</span>
                    </div>
                  ) : (
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Submit Button */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-150"
          >
            Guardar Lead
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateLead;