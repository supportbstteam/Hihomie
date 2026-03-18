"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import toast from "react-hot-toast";
import { get_properties, delete_property, messageClear } from "@/store/estate";
import ConfirmDeleteModal from "@/components/ConfirmAlert";

const ListProperty = () => {
  const dispatch = useDispatch();

  const { properties, loader, successMessage, errorMessage } = useSelector(
    (state) => state.estate,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  useEffect(() => {
    dispatch(get_properties());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(get_properties());
      dispatch(messageClear());
      setIsModalOpen(false); // Close modal on success
      setPropertyToDelete(null);
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  // Modal Handlers
  const openDeleteModal = (id) => {
    setPropertyToDelete(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (propertyToDelete) {
      dispatch(delete_property(propertyToDelete));
    }
  };

  // Fallback dummy data
  const displayProperties =
    properties?.length > 0
      ? properties
      : [
          {
            _id: "1",
            reference: "REF-001",
            transaction_type: "sale",
            city: "Madrid",
            street: "Gran Vía",
            rooms: 3,
            bathrooms: 2,
            surface: 120,
            type: "Flat",
          },
        ];

  const thStyle =
    "py-4 px-6 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700 uppercase tracking-wider";
  const tdStyle = "py-4 px-6 border-b border-gray-100 text-sm text-gray-800";

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 p-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Properties</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage all your real estate listings
          </p>
        </div>
        <Link
          href="/estate/property" // Check if this is your correct create route
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow transition-all transform active:scale-95"
        >
          + Add Property
        </Link>
      </div>

      {/* Main Card Container */}
      <div className="w-full bg-white mt-4 border-t border-b border-gray-200 p-0">
        {loader ? (
          <div className="p-8 text-center text-gray-500 font-medium">
            Loading properties...
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className={thStyle}>Reference</th>
                  <th className={thStyle}>Location</th>
                  <th className={thStyle}>For</th>
                  <th className={thStyle}>Details</th>
                  <th className={thStyle}>Type</th>
                  <th className={`${thStyle} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayProperties.map((property) => (
                  <tr
                    key={property._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className={`${tdStyle} font-medium text-gray-900`}>
                      {property.reference}
                    </td>

                    <td className={tdStyle}>
                      <div className="font-medium">{property.city}</div>
                      <div className="text-gray-500 text-xs">
                        {property.street}
                      </div>
                    </td>

                    <td className={tdStyle}>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          property.transaction_type === "sale"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {property.transaction_type}
                      </span>
                    </td>

                    <td className={tdStyle}>
                      <div className="flex items-center gap-3 text-gray-600">
                        <span title="Rooms">🛏️ {property.rooms || "-"}</span>
                        <span title="Bathrooms">
                          🚿 {property.bathrooms || "-"}
                        </span>
                        <span title="Surface Area">
                          📐 {property.surface ? `${property.surface}m²` : "-"}
                        </span>
                      </div>
                    </td>

                    <td className={tdStyle}>
                      {property.type || "Not Defined"}
                    </td>

                    {/* Actions */}
                    <td className={`${tdStyle} text-right space-x-3`}>
                      {/* ✅ Replaced button with Link component */}
                      <Link 
                        href={`/estate/property/edit/${property._id}`} 
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        Edit
                      </Link>
                      
                      <button
                        onClick={() => openDeleteModal(property._id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {displayProperties.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      No properties found. Click "Add Property" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListProperty;