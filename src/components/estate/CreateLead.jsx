"use client"

import { useState } from 'react';
import { t } from "@/components/translations";

// Organized fields based on the new LEAD TRACKING CSV
const formCategories = [
  {
    title: "Basic Information",
    fields: [
      { name: "lead_id", label: "Lead ID", type: "text" },
      { name: "name", label: "Name", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "address", label: "Address", type: "text" },
      { name: "city", label: "City", type: "text" },
      { 
        name: "rent_or_sale", 
        label: "Rent or Sale", 
        type: "select",
        options: ["", "Rent", "Sale", "Both"]
      },
    ]
  },
  {
    title: "Assignment & Source",
    fields: [
      { name: "registration_date", label: "Registration Date", type: "date" },
      { name: "sourcer", label: "Sourcer", type: "text" },
      { name: "assigned_agent", label: "Assigned Agent", type: "text" },
      { name: "source_channel", label: "Source / Channel", type: "text" },
    ]
  },
  {
    title: "Tracking & Status",
    fields: [
      { name: "lead_status", label: "Lead Status", type: "text" },
      { name: "last_contact", label: "Last Contact", type: "date" },
      { name: "last_contact_result", label: "Last Contact Result", type: "text" },
      { name: "next_call", label: "Next Call", type: "date" },
      { name: "days_since_last_contact", label: "Days since last contact", type: "number" },
      { name: "days_until_next_call", label: "Days until next call", type: "number" },
      { name: "follow_up_overdue", label: "Follow-up Overdue", type: "checkbox" },
    ]
  },
  {
    title: "Financials",
    fields: [
      { name: "sale_price", label: "Sale Price", type: "number" },
      { name: "fees", label: "Fees", type: "number" },
    ]
  },
  {
    title: "Notes",
    fields: [
      { name: "observations", label: "Observations", type: "textarea" },
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
        <h2 className="text-2xl font-bold text-gray-800">Create New Lead</h2>
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
                        <option key={i} value={opt}>{opt || "Select..."}</option>
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
                      <span className="ml-2 text-sm text-gray-600">Yes, overdue</span>
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
            Save Lead
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateLead;