"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
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

  const [currentPage, setCurrentPage] = useState(page || 1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilterData, setSelectedFilterData] = useState();

  useEffect(() => {
    dispatch(get_properties({ page: currentPage, ...selectedFilterData }));
  }, [dispatch, selectedFilterData, currentPage]);

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
  }, [successMessage, errorMessage, dispatch, currentPage, selectedFilterData]);

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

  const displayProperties = properties?.length > 0 ? properties : [];

  const handlePageChange = (pageNo) => {
    setCurrentPage(pageNo);
    dispatch(get_properties({ page: pageNo, ...selectedFilterData }));
  };

  return (
    <div className="grid w-full">
      {/* Header */}
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

      {/* Main Container - padding and max-width removed */}
      <div className="bg-background-secondary w-full">
        {loader ? (
          <div className="p-8 text-center text-gray-500 font-medium bg-white shadow-md">
            Loading Properties...
          </div>
        ) : (
          <div className="flex flex-col w-full gap-4 p-4">
            {displayProperties.map((property) => (
              <div
                key={property._id}
                className="flex flex-col sm:flex-row bg-white border-y sm:border border-gray-200 sm:rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="relative w-full sm:w-64 h-48 sm:h-44 flex-shrink-0 bg-gray-200">
                  <Image
                    src={property.images?.[0] || "/file.svg"}
                    alt={property.title || property.reference || "Property"}
                    fill
                  />

                  {/* Status Overlay - Pinned to Bottom Left */}
                  <div className="absolute bottom-1 left-1 bg-green-900/50 text-white text-sm font-semibold px-2 py-1 rounded backdrop-blur-sm shadow-sm">
                    {property.status || "Available"}
                  </div>
                </div>

                {/* Details Section - Right side close to image boundary */}
                <div className="flex flex-col flex-grow p-4 relative justify-start">
                  {/* Action Buttons Pinned to Top Right */}
                  <div className="absolute top-4 right-4 flex gap-3 text-lg bg-white/80 p-1 rounded backdrop-blur-sm">
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

                  {/* Title & Price */}
                  <div className="pr-20">
                    {" "}
                    {/* pr-20 prevents text overlapping with absolute buttons */}
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                      {property.title ||
                        property.reference ||
                        "Untitled Property"}
                    </h3>
                    <p className="text-lg font-bold text-green-600 mt-1">
                      {property.sale_price
                        ? `$${property.sale_price.toLocaleString()}`
                        : "Price upon request"}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mt-2 text-sm line-clamp-2">
                    {property.description ||
                      "No description provided for this property."}
                  </p>

                  {/* Additional Previous Info (Rooms, Location, Type) */}
                  <div className="mt-auto pt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span
                      className={`px-2 py-1 rounded-full font-bold uppercase ${
                        property.transaction_type === "sale"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {property.transaction_type}
                    </span>
                    <span className="font-medium">
                      📍 {property.city}{" "}
                      {property.street ? `, ${property.street}` : ""}
                    </span>
                    <span title="Rooms">🛏️ {property.rooms || "-"}</span>
                    <span title="Bathrooms">
                      🚿 {property.bathrooms || "-"}
                    </span>
                    <span title="Surface Area">
                      📐 {property.surface ? `${property.surface}m²` : "-"}
                    </span>
                    <span className="border-l border-gray-300 pl-4">
                      {property.type || "Not Defined"}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {displayProperties.length === 0 && (
              <div className="p-8 text-center text-gray-500 bg-white border-y sm:border border-gray-200 sm:rounded-lg">
                No properties found. Click the + icon to create one.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center w-full p-4">
        <button
          className="cursor-pointer px-3 py-1 bg-green-500 rounded disabled:bg-gray-200"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Prev
        </button>

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

      {/* Modals */}
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
