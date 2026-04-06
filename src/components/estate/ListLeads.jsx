"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  get_estate_leads,
  delete_estate_lead,
  messageClear,
} from "@/store/estate";
import ConfirmDeleteModal from "@/components/ConfirmAlert";
import Icon from "@/components/ui/Icon";
import { Plus, Upload } from "lucide-react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import useUserFromSession from "@/lib/useUserFromSession";
import PropertiesImportModal from "@/components/estate/ImportProperties";
import EstateLeadImportModal from "@/components/estate/ImportEstateLead";

const ListLeads = () => {
  const user = useUserFromSession();
  const router = useRouter();
  const dispatch = useDispatch();

  const { estate_leads, loader, successMessage, errorMessage } = useSelector(
    (state) => state.estate,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [importOpen, setImportOpen] = useState(false);

  useEffect(() => {
    dispatch(get_estate_leads());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(get_estate_leads());
      dispatch(messageClear());
      setIsModalOpen(false);
      setLeadToDelete(null);
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  // Modal Handlers
  const openDeleteModal = (id) => {
    setLeadToDelete(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (leadToDelete) {
      dispatch(delete_estate_lead(leadToDelete));
    }
  };

  // Fallback dummy data mapped to the new schema
  const displayLeads =
    estate_leads?.length > 0
      ? estate_leads
      : [
          {
            _id: "69cf747f11b9759492899e0d",
            lead_id: "LD-001",
            name: "John Doe",
            phone: "9988776655",
            city: "New York",
            address: "123 Broadway St",
            rent_or_sale: "Sale",
            lead_status: "New",
            next_call: "2026-04-10T00:00:00.000Z",
            assigned_agent: "Jane Smith",
            follow_up_overdue: false,
          },
        ];

  return (
    <div className="grid w-full">
      {/* Header aligned with reference layout */}
      <aside className="w-full bg-white sticky top-0 z-50 border-b">
        <div className="flex items-center justify-between p-4">
          <div className="hidden sm:flex flex-col">
            <h2 className="text-xl font-bold text-gray-900">Leads</h2>
            <p className="text-sm text-gray-500">
              Manage all your real estate leads and inquiries
            </p>
          </div>

          <div className="flex w-full sm:w-auto justify-end gap-4">
            <Icon
              icon={Plus}
              variant="outline"
              size={16}
              color="#99A1B7"
              onClick={() => router.push("/estate/lead/create")}
            />
            <Icon
              variant="outline"
              title="Upload"
              icon={Upload}
              size={16}
              color="#99A1B7"
              onClick={() => setImportOpen(true)}
            />
          </div>
        </div>
      </aside>

      {/* Main Card Container (Padding and max-width removed per instructions) */}
      <div className="w-full bg-background-secondary">
        {loader ? (
          <div className="p-8 text-center text-gray-500 font-medium bg-white border-b shadow-sm">
            Loading leads...
          </div>
        ) : (
          <table className="min-w-full border-b border-gray-200 shadow-sm overflow-hidden bg-white">
            <thead className="bg-gray-100 border-y border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                  Lead Info
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                  Location
                </th>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">
                  Intent
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
              {displayLeads.map((lead, i) => (
                <tr
                  key={lead._id}
                  className={`hover:bg-gray-50 transition-colors duration-200 ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  {/* Lead Info */}
                  <td className="py-3 px-4 text-sm text-gray-800">
                    <div className="font-semibold">
                      {lead.name || "Unknown"}
                    </div>
                    <div className="text-gray-500 text-xs mt-0.5">
                      {lead.phone ? `📞 ${lead.phone}` : "No phone"}
                    </div>
                  </td>

                  {/* Location */}
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <div className="font-medium">{lead.city || "-"}</div>
                    <div className="text-gray-500 text-xs mt-0.5 truncate max-w-[150px]">
                      {lead.address || "No address"}
                    </div>
                  </td>

                  {/* Intent (Rent or Sale) */}
                  <td className="py-3 px-4 text-sm text-center">
                    {lead.rent_or_sale ? (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          lead.rent_or_sale.toLowerCase() === "sale"
                            ? "bg-blue-100 text-blue-800"
                            : lead.rent_or_sale.toLowerCase() === "rent"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {lead.rent_or_sale}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs uppercase">
                        N/A
                      </span>
                    )}
                  </td>

                  {/* Status & Tracking */}
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {lead.lead_status || "Unclassified"}
                      </span>
                      {lead.follow_up_overdue && (
                        <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          OVERDUE
                        </span>
                      )}
                    </div>
                    <div className="text-gray-500 text-xs mt-0.5">
                      Next Call:{" "}
                      {lead.next_call
                        ? new Date(lead.next_call).toLocaleDateString()
                        : "Not scheduled"}
                    </div>
                  </td>

                  {/* Assignment */}
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <div className="font-medium">
                      {lead.assigned_agent || "Unassigned"}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-3 text-lg">
                      <Link href={`/estate/lead/${lead._id}`}>
                        <FaRegEdit
                          className="text-orange-500 cursor-pointer hover:scale-110 transition-transform"
                          title="Edit Lead"
                        />
                      </Link>

                      {user?.role === "admin" && (
                        <FaRegTrashAlt
                          onClick={() => openDeleteModal(lead._id)}
                          className="text-red-500 cursor-pointer hover:scale-110 transition-transform"
                          title="Delete Lead"
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {displayLeads.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    No leads found. Click the + icon to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
      {importOpen && (
        <EstateLeadImportModal
          isOpen={importOpen}
          setImportOpen={setImportOpen}
        />
      )}
    </div>
  );
};

export default ListLeads;
