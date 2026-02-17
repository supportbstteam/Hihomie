"use client";
import {
  Edit,
  EllipsisVertical,
  Mail,
  MessageSquareText,
  Pencil,
  Phone,
  Trash,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { t } from "@/components/translations";
import Icon from "./ui/Icon";
import Avatar from "./ui/Avatar";
import { useDispatch, useSelector } from "react-redux";
import {
  card_delete_list,
  delete_bulk,
  get_leadStatusData,
  get_leadStatusDataForList,
} from "@/store/setting";
import { bulk_assignment, messageClear } from "@/store/customer";
import toast from "react-hot-toast";
import ConfirmDeleteModal from "./ConfirmAlert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MailModel from "@/components/prospects/MailModel";
import formatDate from "@/lib/formatDate";

const List = ({
  leadStatusList,
  selecteFilterData,
  setSelectedUser,
  successMessage,
  setSelectedColId,
  authUser,
  total_count,
  total_pages,
  page,
}) => {
  const dispatch = useDispatch();
  const { assignTeam } = useSelector((state) => state.team);
  const { successMessage: customerSuccessMessage } = useSelector(
    (state) => state.customer
  );

  const [currentPage, setCurrentPage] = useState(page || 1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [columToDelete, setColumToDelete] = useState(null);
  const [iconOpen, setIconOpen] = useState(null);
  const [mailModelOpen, setMailModelOpen] = useState(false);
  const [mailDetails, setMailDetails] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [users, setUsers] = useState([]);

  const {
    gestor,
    estado,
    full_name,
    phone,
    contacted,
    contract_signed,
    bank,
    email,
    document_submitted,
  } = selecteFilterData || {};

  // 🔥 Client-side filtering — but pagination stays server-side
  const filteredList = leadStatusList.filter((item) => {
    const matchGestor = gestor
      ? item?.users?.some((user) => user._id === gestor)
      : true;

    const matchEstado = estado ? item?.leadStatusId === estado : true;

    const matchName = full_name
      ? `${item.first_name || ""} ${item.last_name || ""}`
          .toLowerCase()
          .includes(full_name.toLowerCase())
      : true;

    const matchPhone = phone ? item?.phone?.toString().includes(phone) : true;

    const matchContacted = contacted ? item?.contacted === contacted : true;

    const matchContract_signed = contract_signed
      ? item?.contract_signed === (contract_signed === "true")
      : true;

    const matchBank = bank ? item?.bankDetailsData?.bank_name === bank : true;

    const matchDocumentSubmitted = document_submitted
      ? item?.documentSubmitted === document_submitted
      : true;

    const matchEmail = email
      ? item?.email?.toLowerCase().includes(email.toLowerCase())
      : true;

    return (
      matchGestor &&
      matchEstado &&
      matchName &&
      matchPhone &&
      matchContacted &&
      matchContract_signed &&
      matchBank &&
      matchEmail &&
      matchDocumentSubmitted
    );
  });

  // 🔥 Filter change → reset to page 1 but do NOT slice
  useEffect(() => {
    setCurrentPage(1);
    dispatch(get_leadStatusDataForList(1));
  }, [gestor, estado, full_name, phone, contacted, contract_signed, bank, email, document_submitted]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/team");
      const { data } = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleEditClick = (item) => {
    window.open(`/dashboard/lead/edit/${item._id}/${item.status}`, "_blank");
  };

  const openDeleteModal = (catId, columId) => {
    setCardToDelete(catId);
    setColumToDelete(columId);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (cardId, columId) => {
    try {
      await dispatch(card_delete_list({ cardId, columId })).unwrap();
      setIsModalOpen(false);
      dispatch(get_leadStatusDataForList(currentPage));
      toast.success("Card deleted successfully");
    } catch (error) {
      toast.error("Failed to delete card");
    }
  };

  useEffect(() => {
    if (successMessage) {
      dispatch(messageClear());
      dispatch(get_leadStatusDataForList(currentPage));
    }
  }, [successMessage, dispatch]);

  const toggleLead = (id, status) => {
    if (selectedLeads.some((lead) => lead.id === id)) {
      setSelectedLeads(selectedLeads.filter((lead) => lead.id !== id));
    } else {
      setSelectedLeads([...selectedLeads, { id, status }]);
    }
  };

  const toggleAllLeads = () => {
    if (selectedLeads.length === filteredList.length) {
      setSelectedLeads([]);
    } else {
      const allLeads = filteredList.map((lead) => ({
        id: lead._id,
        status: lead.status,
      }));
      setSelectedLeads(allLeads);
    }
  };

  const handleBulkDelete = () => {
    if (selectedLeads.length === 0) {
      toast.error("Please select at least one lead");
      return;
    }
    const payload = selectedLeads.map((lead) => ({
      cardId: lead.id,
      colId: lead.status,
    }));

    dispatch(delete_bulk({ leads: payload }))
      .unwrap()
      .then((res) => {
        toast.success(res.message || "Delete successful");
        dispatch(get_leadStatusDataForList(currentPage));
      })
      .catch(() => toast.error("Something went wrong"));
  };

  const handlePageChange = (pageNo) => {
    setCurrentPage(pageNo);
    dispatch(get_leadStatusDataForList(pageNo));
  };

  return (
    <div>
      {/* DELETE BUTTON */}
      <div className="flex justify-end">
        <button
          className="px-3 py-1 bg-red-500 text-white rounded"
          onClick={() => confirm("Are you sure?") && handleBulkDelete()}
        >
          Delete
        </button>
      </div>

      {/* TABLE */}
      <div className="rounded-md shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[70px] pl-4">
                <input
                  type="checkbox"
                  checked={selectedLeads.length === filteredList.length}
                  onChange={toggleAllLeads}
                />
              </TableHead>
              <TableHead className="w-[70px]">Sr. No</TableHead>
              <TableHead>{t("title")}</TableHead>
              <TableHead>{t("full_name")}</TableHead>
              <TableHead>{t("email")}</TableHead>
              <TableHead>{t("phone")}</TableHead>
              <TableHead>{t("assigned")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("created_at")}</TableHead>
              {authUser?.role != "external" && <TableHead>{t("action")}</TableHead>}
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredList.length > 0 ? (
              filteredList.map((item, i) => (
                <TableRow
                  key={i}
                  className={`hover:bg-gray-200 transition-colors duration-200 ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <TableCell className="pl-4">
                    <input
                      type="checkbox"
                      checked={selectedLeads.some((lead) => lead.id === item._id)}
                      onChange={() => toggleLead(item._id, item.status)}
                    />
                  </TableCell>
                  <TableCell>{i + 1}</TableCell>
                     <TableCell>{item.lead_title}</TableCell>
                  <TableCell>
                    {item.first_name} {item.last_name}
                  </TableCell>
                   <TableCell>{item.email}</TableCell>
                  <TableCell>{item.phone}</TableCell>
                  <TableCell>
                    {item?.users?.slice(0, 3).map((user, p) => (
                      <Avatar
                        key={p}
                        src={user.image ?? "default.jpg"}
                        alt={user?.name}
                        size="xs"
                        title={user?.name}
                      />
                    ))}
                  </TableCell>
                  <TableCell>{item.leadStatusname}</TableCell>
                  <TableCell>
                    {formatDate(item.createdAt)}
                  </TableCell>
                  
                  {authUser?.role != "external" && (
                    <TableCell className="flex gap-2">
                      <Icon icon={Phone} size={20} href={`tel:${item.phone}`} />
                      <Icon
                        icon={MessageSquareText}
                        size={20}
                        href={`https://wa.me/${item.phone}`}
                      />
                      <Icon
                        icon={Mail}
                        size={20}
                        onClick={() => {
                          setMailDetails(item);
                          setMailModelOpen(true);
                        }}
                      />
                      <Icon
                        icon={Pencil}
                        size={20}
                        onClick={() => handleEditClick(item)}
                      />
                      <Icon
                        icon={Trash}
                        size={20}
                        onClick={() =>
                          openDeleteModal(item._id, item.leadStatusId)
                        }
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-4">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* DELETE CONFIRM MODAL */}
        {isModalOpen && (
          <ConfirmDeleteModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={() => handleDeleteClick(cardToDelete, columToDelete)}
          />
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-3 py-1 bg-green-500 rounded disabled:bg-gray-200"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Prev
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: total_pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-green-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          className="px-3 py-1 bg-green-500 rounded disabled:bg-gray-200"
          disabled={currentPage === total_pages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {mailModelOpen && (
        <MailModel
          isOpen={mailModelOpen}
          setMailModelOpen={setMailModelOpen}
          mailDetails={mailDetails}
        />
      )}
    </div>
  );
};

export default List;
