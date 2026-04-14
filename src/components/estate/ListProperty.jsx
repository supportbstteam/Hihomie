"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { get_properties, delete_property, messageClear } from "@/store/estate";
import ConfirmDeleteModal from "@/components/ConfirmAlert";
import Icon from "@/components/ui/Icon";
import { Plus, Upload, ListFilter } from "lucide-react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import PropertiesImportModal from "@/components/estate/ImportProperties";
import useUserFromSession from "@/lib/useUserFromSession";
import Filters from "@/components/estate/PropertyFilters";
import getThreePages from "@/lib/pagination";

const ListProperty = () => {
  const user = useUserFromSession();
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    properties,
    loader,
    successMessage,
    errorMessage,
    total_count,
    total_pages,
    page,
  } = useSelector((state) => state.estate);
  // const { filters } = useSelector((state) => state.propertyFilter);

  const [currentPage, setCurrentPage] = useState(page || 1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilterData, setSelectedFilterData] = useState();

  useEffect(() => {
    dispatch(get_properties({ page: currentPage, ...selectedFilterData }));
  }, [dispatch, selectedFilterData]);

  // useEffect(() => {
  //   setSelectedFilterData(filters);
  // }, [filters]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(get_properties({ page: currentPage, ...selectedFilterData }));
      dispatch(messageClear());
      setIsModalOpen(false);
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
  const displayProperties = properties?.length > 0 ? properties : [];

  const handlePageChange = (pageNo) => {
    setCurrentPage(pageNo);
    dispatch(get_properties({ page: pageNo, ...selectedFilterData }));
  };

  return (
    <div className="grid w-full">
      {/* Header aligned with reference layout */}
      <aside className="w-full bg-white sticky top-0 z-30">
        <div className="flex items-center justify-between p-4">
          <div className="hidden sm:flex flex-col">
            <h2 className="text-xl font-bold text-gray-900">Properties</h2>
            <p className="text-sm text-gray-500">
              Manage all your real estate listings
            </p>
          </div>

          <div className="flex w-full sm:w-auto justify-end gap-4">
            <Icon
              icon={Plus}
              variant="outline"
              size={16}
              color="#99A1B7"
              onClick={() => router.push("/estate/property")}
            />
            <Icon
              variant="outline"
              title="Upload"
              icon={Upload}
              size={16}
              color="#99A1B7"
              onClick={() => setImportOpen(true)}
            />
            <Icon
              icon={ListFilter}
              variant="outline"
              size={16}
              color="#99A1B7"
              onClick={() => setFilterOpen(true)}
            />
          </div>
        </div>
      </aside>

      {/* Main Card Container wrapped in bg-background-secondary */}
      <div className="p-4 bg-background-secondary">
        {loader ? (
          <div className="p-8 text-center text-gray-500 font-medium bg-white rounded-lg shadow-md">
            Loading properties...
          </div>
        ) : (
          <table className="min-w-full border border-gray-200 rounded-lg shadow-md overflow-hidden bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                  Reference
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                  Location
                </th>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">
                  For
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                  Details
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                  Type
                </th>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayProperties.map((property, i) => (
                <tr
                  key={property._id}
                  className={`hover:bg-gray-50 transition-colors duration-200 ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="py-3 px-4 text-sm font-medium text-gray-800">
                    {property.reference}
                  </td>

                  <td className="py-3 px-4 text-sm text-gray-700">
                    <div className="font-medium">{property.city}</div>
                    <div className="text-gray-500 text-xs">
                      {property.street}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-sm text-center">
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

                  <td className="py-3 px-4 text-sm text-gray-700">
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

                  <td className="py-3 px-4 text-sm text-gray-700">
                    {property.type || "Not Defined"}
                  </td>

                  {/* Actions matching reference style */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-3 text-lg">
                      <Link href={`/estate/property/edit/${property._id}`}>
                        <FaRegEdit className="text-orange-500 cursor-pointer hover:scale-110 transition-transform" />
                      </Link>

                      {user?.role === "admin" && (
                        <FaRegTrashAlt
                          onClick={() => openDeleteModal(property._id)}
                          className="text-red-500 cursor-pointer hover:scale-110 transition-transform"
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {displayProperties.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    No properties found. Click the + icon to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-between items-center w-full p-4">
        {/* PREV LEFT SIDE */}
        <button
          className="cursor-pointer px-3 py-1 bg-green-500 rounded disabled:bg-gray-200"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Prev
        </button>

        {/* CENTER THREE BUTTONS */}
        <div className="flex items-center justify-center gap-2 w-full">
          <button
            className="cursor-pointer px-3 py-1 bg-gray-200 rounded"
            onClick={() => handlePageChange(1)}
          >
            1
          </button>
          <div>...</div>
          {getThreePages(currentPage, total_pages).map((page, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(page)}
              className={`cursor-pointer px-3 py-1 rounded transition 
                ${currentPage === page ? "bg-green-600 text-white" : "bg-gray-200"}
              `}
            >
              {page}
            </button>
          ))}
          <div>...</div>
          <button
            className="cursor-pointer px-3 py-1 bg-gray-200 rounded"
            onClick={() => handlePageChange(total_pages)}
          >
            {total_pages}
          </button>
        </div>

        {/* NEXT RIGHT SIDE */}
        <button
          disabled={currentPage === total_pages}
          className="cursor-pointer px-3 py-1 bg-green-500 rounded disabled:bg-gray-200"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>

      <Filters
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        setSelectedFilterData={setSelectedFilterData}
      />

      {/* Modals placed at the bottom */}
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
      {importOpen && (
        <PropertiesImportModal
          isOpen={importOpen}
          setImportOpen={setImportOpen}
        />
      )}
    </div>
  );
};

export default ListProperty;
