"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  get_estate_contacts,
  delete_estate_contact,
  messageClear,
} from "@/store/estate";
import ConfirmDeleteModal from "@/components/ConfirmAlert";
import Icon from "@/components/ui/Icon";
import { Plus, Upload, ListFilter } from "lucide-react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import useUserFromSession from "@/lib/useUserFromSession";
// import EstateContactImportModal from "@/components/estate/ImportEstateContact";
import Filters from "@/components/estate/ContactFilters";
import getThreePages from "@/lib/pagination";

const ListContacts = () => {
  const user = useUserFromSession();
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    estate_contacts,
    loader,
    successMessage,
    errorMessage,
    contact_total_count: total_count,
    contact_total_pages: total_pages,
    contact_page: page,
  } = useSelector((state) => state.estate);

  const [currentPage, setCurrentPage] = useState(page || 1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilterData, setSelectedFilterData] = useState();

  useEffect(() => {
    dispatch(get_estate_contacts({ page: currentPage, ...selectedFilterData }));
  }, [dispatch, selectedFilterData]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(
        get_estate_contacts({ page: currentPage, ...selectedFilterData }),
      );
      dispatch(messageClear());
      setIsModalOpen(false);
      setContactToDelete(null);
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  // Modal Handlers
  const openDeleteModal = (id) => {
    setContactToDelete(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (contactToDelete) {
      dispatch(delete_estate_contact(contactToDelete));
    }
  };

  // Fallback dummy data mapped to the new schema
  const displayContacts = estate_contacts?.length > 0 ? estate_contacts : [];

  const handlePageChange = (pageNo) => {
    setCurrentPage(pageNo);
    dispatch(get_estate_contacts({ page: pageNo, ...selectedFilterData }));
  };

  return (
    <div className="grid w-full">
      {/* Header aligned with reference layout */}
      <aside className="w-full bg-white sticky top-0 z-30 border-b">
        <div className="flex items-center justify-between p-4">
          <div className="hidden sm:flex flex-col">
            <h2 className="text-xl font-bold text-gray-900">Contacts</h2>
            <p className="text-sm text-gray-500">
              Manage all your real estate Contacts
            </p>
          </div>

          <div className="flex w-full sm:w-auto justify-end gap-4">
            <Icon
              icon={Plus}
              variant="outline"
              size={16}
              color="#99A1B7"
              onClick={() => router.push("/estate/contact/create")}
            />
            {/* <Icon
              variant="outline"
              title="Upload"
              icon={Upload}
              size={16}
              color="#99A1B7"
              onClick={() => setImportOpen(true)}
            /> */}
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

      {/* Main Card Container (Padding and max-width removed per instructions) */}
      <div className="w-full bg-background-secondary p-4">
        {loader ? (
          <div className="p-8 text-center text-gray-500 font-medium bg-white border-b shadow-sm">
            Loading contacts...
          </div>
        ) : (
          <table className="min-w-full border border-gray-200 rounded-lg shadow-md overflow-hidden bg-white">
            <thead className="bg-gray-100 border-y border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                  Contact Info
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                  Address
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                  Status & Tracking
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                  Assignment
                </th>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayContacts.map((contact, i) => (
                <tr
                  key={contact._id}
                  className={`hover:bg-gray-50 transition-colors duration-200 ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  {/* Contact Info */}
                  <td className="py-3 px-4 text-sm text-gray-800">
                    <div className="font-semibold">
                      {contact.name || "Unknown"}
                    </div>
                    <div className="text-gray-500 text-xs mt-0.5">
                      {contact.phone ? `📞 ${contact.phone}` : "No phone"}
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-3 px-4 text-sm text-left">
                    {/* <div className="font-medium"> */}
                      {contact.email || "No email"}
                    {/* </div> */}
                  </td>

                  {/* Address */}
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <div className="font-medium">{contact.city || "-"}</div>
                    <div className="text-gray-500 text-xs mt-0.5 truncate max-w-[150px]">
                      {contact.address || "No address"}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <span className="font-medium">
                      {contact.contact_status || "Unclassified"}
                    </span>
                  </td>

                  {/* Assignment */}
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <div className="font-medium">
                      {contact.assigned_agent || "Unassigned"}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-3 text-lg">
                      <Link href={`/estate/contact/${contact._id}`}>
                        <FaRegEdit
                          className="text-orange-500 cursor-pointer hover:scale-110 transition-transform"
                          title="Edit Contact"
                        />
                      </Link>

                      {user?.role === "admin" && (
                        <FaRegTrashAlt
                          onClick={() => openDeleteModal(contact._id)}
                          className="text-red-500 cursor-pointer hover:scale-110 transition-transform"
                          title="Delete Contact"
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {displayContacts.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    No contacts found. Click the + icon to create one.
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

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
      {/* {importOpen && (
        <EstateContactImportModal
          isOpen={importOpen}
          setImportOpen={setImportOpen}
        />
      )} */}
    </div>
  );
};

export default ListContacts;
