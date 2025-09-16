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
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { t } from "@/components/translations";
import Icon from "./ui/Icon";
import Avatar from "./ui/Avatar";
import { useDispatch, useSelector } from "react-redux";
import {
  card_delete_list,
  get_leadStatusData,
  get_leadStatusDataForList,
} from "@/store/setting";
import toast from "react-hot-toast";
import { messageClear } from "@/store/customer";
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

const List = ({
  leadStatusList,
  selecteFilterData,
  setSelectedUser,
  successMessage,
  setSelectedColId,
}) => {
  const dispatch = useDispatch();
  const { assignTeam } = useSelector((state) => state.team);

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

  const { gestor, estado, full_name, phone } = selecteFilterData || {};

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

    return matchGestor && matchEstado && matchName && matchPhone;
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

  return (
    <div>
      <div className="overflow-auto custom-scrollbar max-h-[50vh] rounded-md shadow-md ">
        {/* -----------------------new table starts----------------------- */}

        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[70px] pl-4">{t("Sr. No")}</TableHead>
              <TableHead className="w-[180px]">{t("full_name")}</TableHead>
              <TableHead className="w-[150px]">{t("title")}</TableHead>
              <TableHead>{t("created_at")}</TableHead>
              <TableHead>{t("value")}</TableHead>
              <TableHead>{t("assigned")}</TableHead>
              <TableHead>{t("phone")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("action")}</TableHead>
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
                        color: item.color, // text color
                        backgroundColor: `${item.color}33`, // light background with 20% opacity
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
                  <TableCell className="flex justify-between gap-2 ">
                    <Icon icon={Phone} size={20} href={`tel:${item.phone}`} />
                    <Icon
                      icon={MessageSquareText}
                      size={20}
                      href={`https://wa.me/${item.phone}`}
                    />
                    <Icon icon={Mail} size={20} href={`mailto:${item.email}`} />
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
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
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

        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded-md transition ${
                currentPage === index + 1
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          className="px-3 py-1 bg-green-500 rounded disabled:bg-gray-200"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default List;
