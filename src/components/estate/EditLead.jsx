"use client";

import { useState, useEffect, use } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  update_estate_lead,
  get_estate_lead,
  messageClear,
} from "@/store/estate"; // Assuming you have/will create these actions

// Reusing the exact same categories
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
        options: ["", "Rent", "Sale", "Both"],
      },
    ],
  },
  {
    title: "Assignment & Source",
    fields: [
      { name: "registration_date", label: "Registration Date", type: "date" },
      { name: "capturer", label: "Capturer", type: "text" },
      { name: "assigned_agent", label: "Assigned Agent", type: "text" },
      { name: "source_channel", label: "Source / Channel", type: "text" },
    ],
  },
  {
    title: "Tracking & Status",
    fields: [
      { name: "lead_status", label: "Lead Status", type: "text" },
      { name: "last_contact", label: "Last Contact", type: "date" },
      {
        name: "last_contact_result",
        label: "Last Contact Result",
        type: "text",
      },
      { name: "next_call", label: "Next Call", type: "date" },
      {
        name: "days_since_last_contact",
        label: "Days since last contact",
        type: "number",
      },
      {
        name: "days_until_next_call",
        label: "Days until next call",
        type: "number",
      },
      {
        name: "follow_up_overdue",
        label: "Follow-up Overdue",
        type: "checkbox",
      },
    ],
  },
  {
    title: "Financials",
    fields: [
      { name: "sale_price", label: "Sale Price", type: "number" },
      { name: "fees", label: "Fees", type: "number" },
    ],
  },
  {
    title: "Notes",
    fields: [{ name: "observations", label: "Observations", type: "textarea" }],
  },
];

// Helper function to format MongoDB ISO dates to YYYY-MM-DD for HTML date inputs
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toISOString().split("T")[0];
  } catch (e) {
    return "";
  }
};

const EditLead = ({ id }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Extract ID from URL params (Next.js App Router structure)
  const leadId = id;

  // Assuming your store has a "lead" object to hold the currently fetched lead
  const { estate_lead, loader, successMessage, errorMessage, successTag } =
    useSelector((state) => state.estate);

  // Initialize state dynamically
  const initialState = formCategories.reduce((acc, category) => {
    category.fields.forEach((field) => {
      acc[field.name] = field.type === "checkbox" ? false : "";
    });
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialState);

  // 1. Fetch the lead data when the component mounts
  useEffect(() => {
      if (leadId) {
      dispatch(get_estate_lead(leadId));
    }
  }, [leadId, dispatch]);


  // 2. Populate the form when the fetched lead data changes
  useEffect(() => {
    if (estate_lead && Object.keys(estate_lead).length > 0) {
      const populatedData = { ...initialState };

      // Map database fields to form state
      Object.keys(populatedData).forEach((key) => {
        if (estate_lead[key] !== undefined && estate_lead[key] !== null) {
          if (
            ["registration_date", "last_contact", "next_call"].includes(key)
          ) {
            populatedData[key] = formatDateForInput(estate_lead[key]);
          } else {
            populatedData[key] = estate_lead[key];
          }
        }
      });

        setFormData(populatedData);
        setFormData(estate_lead);
    }
  }, [estate_lead, dispatch]);

  // 3. Handle success/error messages
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      if (successTag === "ESTATE_LEAD_UPDATED") {
        // Optional: redirect back to list after successful update
        // router.push("/estate/leads");
      }
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, router, successTag]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch update action passing the ID and the modified data
    dispatch(update_estate_lead({ id: leadId, data: formData }));
  };

  if (loader && !estate_lead) {
    return (
      <div className="p-8 text-center bg-white shadow-md">
        Loading lead data...
      </div>
    );
  }

  return (
    <div className="w-full bg-white shadow-md">
      <div className="border-b px-6 py-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Edit Lead</h2>
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        {formCategories.map((category, idx) => (
          <div key={idx} className="border-b border-gray-200">
            {/* Category Header */}
            <div className="bg-gray-50 px-6 py-3">
              <h3 className="text-lg font-semibold text-gray-700">
                {category.title}
              </h3>
            </div>

            {/* Category Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-6">
              {category.fields.map((field) => (
                <div
                  key={field.name}
                  className={`flex flex-col ${field.type === "textarea" ? "md:col-span-2 lg:col-span-3" : ""}`}
                >
                  <label
                    htmlFor={field.name}
                    className="mb-2 text-sm font-medium text-gray-700"
                  >
                    {field.label}
                  </label>

                  {field.type === "textarea" ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      rows="3"
                      className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ) : field.type === "select" ? (
                    <select
                      id={field.name}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {field.options.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt || "Select..."}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "checkbox" ? (
                    <div className="flex items-center mt-2">
                      <input
                        id={field.name}
                        name={field.name}
                        type="checkbox"
                        checked={formData[field.name]}
                        onChange={handleChange}
                        className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Yes, overdue
                      </span>
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
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-4">
          <button
            type="submit"
            disabled={loader}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-150 disabled:opacity-50"
          >
            {loader ? "Updating..." : "Update Lead"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLead;
