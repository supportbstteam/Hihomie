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
import { useDispatch } from "react-redux";
import { card_delete_list, get_leadStatusData, get_leadStatusDataForList } from "@/store/setting";
import toast from "react-hot-toast";
import { messageClear } from "@/store/customer";
import ConfirmDeleteModal from "./ConfirmAlert";

const List = ({ leadStatusList, selecteFilterData, setSelectedUser, successMessage }) => {

  const dispatch = useDispatch();

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

  // ✅ Handle Edit Click
  const handleEditClick = (item) => {
    const updatedUser = {
      ...item,
      colId: item.leadStatusId, // assign leadStatusId to colId
      id: item._id,             // assign card _id to id
    };

    setSelectedUser(updatedUser); // update local state
    if (onEdit) setSelectedUser(updatedUser); // send to parent
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
      setIsModalOpen(false)
      dispatch(get_leadStatusDataForList())
      dispatch(get_leadStatusData())
    }

  }, [successMessage, dispatch]);


  return (
    <div className="overflow-x-auto bg-white rounded-md shadow-md">
      <table className="min-w-full divide-y divide-gray-200 rounded-lg shadow-md overflow-hidden">
        <thead className="bg-[#F8FAFD]">
          <tr className="">
            <th className="w-[80px] psm text-dark px-1 py-3 text-left">{ t('Sr. No')}</th>

            <th className="w-[250px] psm text-dark pl-4 py-3 text-left">
              {t("full_name")}
            </th>
            <th className="w-[150px] psm text-dark px-1 py-3 text-left">{t("title")}</th>
            <th className="w-[150px] psm text-dark px-1 py-3 text-left">
              {t("created_at")}
            </th>
            <th className="w-[150px] psm text-dark px-1 py-3 text-left">{t("value")}</th>
            <th className="w-[250px] psm text-dark px-1 py-3 text-left">
              {t("assigned")}
            </th>
            <th className="w-[250px] psm text-dark px-1 py-3 text-left">{t("phone")}</th>
            <th className="w-[250px] psm text-dark px-1 py-3 text-left">{t("status")}</th>
            <th className="w-[250px] psm text-dark pr-4 py-3 text-left">{t("action")}</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-sm">
          {filteredList.length > 0 ? (
            filteredList.map((item, i) => (
              
              <tr
                key={i}
                className={`hover:bg-gray-50 transition-colors duration-200 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                
                {/* Serial Number */}
                <td className="pl-4 py-3 pxs text-light font-medium">{i + 1}</td>

                {/* Full Name */}
                <td className="px-1 py-3 pxs text-light font-medium">{item.first_name} {item.last_name}</td>

                {/* Lead Title */}
                <td className="px-1 py-3 pxs text-light">{item.lead_title}</td>

                {/* Created At */}
                <td className="px-1 py-3 pxs text-light">{new Date(item.createdAt).toLocaleDateString()}</td>

                {/* Lead Value */}
                <td className="px-1 py-3 pxs text-light">{item.lead_value}</td>
                <td className="pr-4 py-3 pxs text-light flex gap-1">

                {item?.users?.slice(0, 3).map((user, p) => (
                  <Avatar
                    key={p}
                    src={user.image}
                    alt={item?.users?.[0]?.name}
                    size="xs"
                  />
                  ))}
                  {item?.users?.length > 3 && (
                    <span className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-gray-300 text-sm font-bold -ml-2 border-2 border-white">
                      +{item?.users?.length - 3}
                    </span>
                  )}
                </td>

                {/* Phone */}
                <td className="px-4 py-4 text-light">{item.phone}</td>
                {/* Status */}
                <td className="px-4 py-4">
                  <span
                    className="px-2 py-1 rounded-full text-xs font-semibold"
                    style={{
                      color: item.color, // text color
                      backgroundColor: `${item.color}33` // light background with 20% opacity
                    }}
                  >
                    {item.leadStatusname}
                  </span>
                </td>
                <td className="  px-4 py-4 flex justify-between gap-2 ">
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
                    <Icon icon={EllipsisVertical} size={20}  onClick={() => setIconOpen(iconOpen === item._id ? null : item._id)} />

                    {/* Actions visible on hover */}
                    {iconOpen === item._id && (
                      <div className="absolute w-24 right-4 top-0 mt-[-8px] flex justify-evenly gap-2 bg-background shadow-md p-2 rounded-lg z-10">
                        <Icon
                          icon={Trash}
                          size={20}
                          onClick={() => console.log("Delete", item._id)}
                        />
                        <Icon
                          icon={Pencil}
                          size={20}
                          onClick={() => handleEditClick(item)}
                        />
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center py-6 text-gray-500">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>


      {isModalOpen && (
        <ConfirmDeleteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => handleDeleteClick(cardToDelete, columToDelete)}
        />
      )}


    </div>
  );
};

export default List;