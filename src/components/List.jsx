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
import React, { useEffect, useState } from "react"; // ✅ Missing useState import
import { t } from "@/components/translations";
import Icon from "./ui/Icon";
import Avatar from "./ui/Avatar";
import { useDispatch, useSelector } from "react-redux";
import {
  card_delete_list,
  get_leadStatusData,
  get_leadStatusDataForList,
} from "@/store/setting";
import { bulk_assignment, messageClear } from "@/store/customer";
import toast from "react-hot-toast";
import ConfirmDeleteModal from "./ConfirmAlert";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MailModel from "@/components/prospects/MailModel";

const List = ({
  leadStatusList,
  selecteFilterData,
  setSelectedUser,
  successMessage,
  setSelectedColId,
  authUser,
}) => {

  const dispatch = useDispatch();
  const { assignTeam } = useSelector((state) => state.team);
  const { successMessage: customerSuccessMessage } = useSelector(
    (state) => state.customer
  );

  const [onEdit, setOnEdit] = useState({
    lead_title: "",
    surname: "",
    first_name: "",
    last_name: "",
    company: "",
    designation: "",
    phone: "",
    email: "",
    lead_value: "",
    assigned: "",
    status: "",
    type_of_opration: "",
    customer_situation: "",
    purchase_status: "",
    commercial_notes: "",
    manager_notes: "",
    detailsData: {},
    addressDetailsData: {},
    id: "",
    colId: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
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

  // ✅ Filtering Logic
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

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [gestor, estado, full_name, phone]);

  const recordsPerPage = 10;

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredList.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredList.length / recordsPerPage);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/team");
      const { data } = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  // ✅ Handle Edit Click
  const handleEditClick = (item) => {
    const updatedUser = {
      ...item,
      colId: item.leadStatusId, // assign leadStatusId to colId
      id: item._id, // assign card _id to id
    };
    setSelectedColId(item.leadStatusId);
    setSelectedUser(updatedUser);
  };

  const handleDeleteClick = async (cardId, columId) => {
    try {
      // Dispatch deletion and wait for success
      await dispatch(card_delete_list({ cardId, columId })).unwrap();

      // Close modal
      setIsModalOpen(false);
      setCardToDelete(null);
      setColumToDelete(null);

      // Refresh list
      dispatch(get_leadStatusDataForList());

      // Show success toast directly
      toast.success("Card deleted successfully");
    } catch (error) {
      toast.error("Failed to delete card");
    }
  };

  const openDeleteModal = (catId, columId) => {
    setCardToDelete(catId);
    setColumToDelete(columId);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (successMessage) {
      dispatch(messageClear());
      setIsModalOpen(false);
    }
    dispatch(get_leadStatusDataForList());
    dispatch(get_leadStatusData());
  }, [successMessage, dispatch, assignTeam]);

  const toggleAllLeads = () => {
    if (selectedLeads.length === currentRecords.length) {
      setSelectedLeads([]);
    } else {
      const allLeads = currentRecords.map((lead) => ({
        id: lead._id,
        status: lead.status,
      }));
      setSelectedLeads(allLeads);
    }
  };

  const toggleLead = (id, status) => {
    if (selectedLeads.some((lead) => lead.id === id)) {
      setSelectedLeads(selectedLeads.filter((lead) => lead.id !== id));
    } else {
      setSelectedLeads([...selectedLeads, { id: id, status: status }]);
    }
  };

  const handleAssignment = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const manager = formData.get("manager");
    const leads = selectedLeads?.map((lead) => ({
      userId: manager,
      cardId: lead.id,
      colId: lead.status,
    }));

    dispatch(bulk_assignment(leads));
  };

  useEffect(() => {
    if (customerSuccessMessage) {
      toast.success(customerSuccessMessage);
      dispatch(messageClear());
      dispatch(get_leadStatusDataForList());
      dispatch(get_leadStatusData());
    }
  }, [customerSuccessMessage, dispatch]);

  const getPageNumbers = () => {
    const pages = [];

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div>
      <form
        onSubmit={handleAssignment}
        className="flex flex-col md:flex-row md:items-center gap-3 mb-4"
      >
        <div className="w-full md:w-64">
          <select
            name="manager"
            id="manager"
            defaultValue=""
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            <option value="" disabled>
              — {t("select")} {t("manager")} —
            </option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-primary hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-transform duration-150 active:scale-95"
        >
          {t("assign")}
        </button>
      </form>

      <div className="overflow-auto custom-scrollbar max-h-[42vh] rounded-md shadow-md ">
        {/* -----------------------new table starts----------------------- */}

        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[70px] pl-4">
                {" "}
                <input
                  type="checkbox"
                  checked={selectedLeads.length === currentRecords.length}
                  onChange={toggleAllLeads}
                  className="w-4 h-4 accent-emerald-600"
                />
              </TableHead>
              <TableHead className="w-[70px] pl-4">{t("Sr. No")}</TableHead>
              <TableHead className="w-[180px]">{t("full_name")}</TableHead>
              <TableHead className="w-[150px]">{t("title")}</TableHead>
              <TableHead>{t("created_at")}</TableHead>
              <TableHead>{t("value")}</TableHead>
              <TableHead>{t("assigned")}</TableHead>
              <TableHead>{t("phone")}</TableHead>
              <TableHead>{t("status")}</TableHead>
             {authUser?.role != 'external' &&  <TableHead>{t("action")}</TableHead>}
              
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRecords.length > 0 ? (
              currentRecords.map((item, i) => (
                <TableRow
                  key={i}
                  className={`hover:bg-gray-50 transition-colors duration-200 ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <TableCell className="pl-4">
                    <input
                      type="checkbox"
                      checked={selectedLeads.some(
                        (lead) => lead.id === item._id
                      )}
                      onChange={() => toggleLead(item._id, item.status)}
                      className="w-4 h-4 accent-emerald-600"
                    />
                  </TableCell>
                  <TableCell className="pl-4">{i + 1}</TableCell>
                  <TableCell>
                    {item.first_name} {item.last_name}
                  </TableCell>
                  <TableCell>{item.lead_title}</TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{item.lead_value}</TableCell>
                  <TableCell className="text-right flex gap-1">
                    {item?.users?.slice(0, 3).map((user, p) => (
                      <Avatar
                        key={p}
                        src={user.image ? user.image : "default.jpg"}
                        alt={user?.name}
                        size="xs"
                        title={user?.name}
                      />
                    ))}
                    {item?.users?.length > 3 && (
                      <span className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-gray-300 text-sm font-bold -ml-2 border-2 border-white">
                        +{item?.users?.length - 3}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{item.phone}</TableCell>
                  <TableCell>
                    <span
                      className="px-2 py-1 rounded-full text-xs font-normal"
                      style={{
                        color: "#000000ff",
                        backgroundColor: `${item.color}33`,
                      }}
                    >
                      {item.leadStatusname}
                    </span>
                  </TableCell>
                  {/* <TableCell>
                  <Badge variant={item.status ? "active" : "inactive"}>
                    {item.status ? "Active" : "Inactive"}
                  </Badge>
                </TableCell> */}

               {authUser?.role != 'external' &&
                  <TableCell className="flex justify-between gap-2 ">
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
                    {/* <Icon icon={Mail} size={20} href={`mailto:${item.email}`} onClick={() => {
                      setMailDetails(item);
                      setMailModelOpen(true);
                    }} /> */}
                    <div
                      className="relative inline-block"
                      onMouseEnter={() => setIconOpen(item._id)}
                      onMouseLeave={() => setIconOpen(null)}
                    >
                      {/* Ellipsis always visible */}
                      <Icon
                        icon={EllipsisVertical}
                        size={20}
                        onClick={() =>
                          setIconOpen(iconOpen === item._id ? null : item._id)
                        }
                      />

                      {/* Actions visible on hover */}
                      {iconOpen === item._id && (
                        <div className="absolute w-24 right-4 top-0 mt-[-8px] flex justify-evenly gap-2 bg-background shadow-md p-2 rounded-lg z-10">
                          <Icon
                            icon={Trash}
                            size={20}
                            onClick={() =>
                              openDeleteModal(item._id, item.leadStatusId)
                            }
                          />
                          <Icon
                            icon={Pencil}
                            size={20}
                            onClick={() => handleEditClick(item)}
                          />
                        </div>
                      )}
                    </div>
                  </TableCell>
                }
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

        {/* -----------------------new table ends----------------------- */}

        {isModalOpen && (
          <ConfirmDeleteModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={() => handleDeleteClick(cardToDelete, columToDelete)}
          />
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-3 py-1 bg-green-500 rounded disabled:bg-gray-200"
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        <div className="flex justify-center items-center gap-2 mt-4">
          {/* First Page */}
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:bg-green-500"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            1
          </button>

          {/* Left Ellipsis */}
          {currentPage > 3 && <span className="px-2">...</span>}

          {/* Middle Dynamic Pages */}
          <div className="flex gap-2">
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md transition ${
                  currentPage === page
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Right Ellipsis */}
          {currentPage < totalPages - 2 && <span className="px-2">...</span>}

          {/* Last Page */}
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:bg-green-500"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            {totalPages}
          </button>
        </div>

        <button
          className="px-3 py-1 bg-green-500 rounded disabled:bg-gray-200"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages}
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
