"use client";
import AddCategory from "@/components/category/AddCategory";
import { delete_category, get_category, messageClear } from "@/store/category";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import EditCategory from "@/components/category/EditCategory";
import { t } from "@/components/translations";
import ConfirmDeleteModal from "@/components/ConfirmAlert";
import Icon from "@/components/ui/Icon";
import { Plus } from "lucide-react";

const Category = () => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categorys, setCategorys] = useState(null);

  const dispatch = useDispatch();
  const { loader, category, errorMessage, successMessage } = useSelector(
    (state) => state.category
  );

  useEffect(() => {
    dispatch(get_category());
  }, [dispatch]);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = category.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(category.length / recordsPerPage);

  const handleDelete = (id) => {
    dispatch(delete_category(id));
    setIsModalOpen(false);
  };

  const handleEdit = (cat, flag) => {
    setEditOpen(flag);
    setCategorys(cat);
  };

  const openDeleteModal = (catId) => {
    setCategoryToDelete(catId);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      setIsModalOpen(false)
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [errorMessage, successMessage, dispatch]);

  return (
    <div className="">
      {/* Header */}
      <aside className="w-full bg-white shadow-md border-b sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div></div>
          <div className="flex justify-end">
            <Icon
              icon={Plus}
              size={20}
              color="#99A1B7"
              onClick={() => setOpen(true)}
            />
          </div>
        </div>
      </aside>

      {/* Table */}
      <div className="p-5">
        <div className="bg-white rounded-xl shadow-lg p-5">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-4 text-left text-sm font-semibold">{t("serial")}</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">{t("category")}</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">{t("status")}</th>
                <th className="py-3 px-4 text-center text-sm font-semibold">{t("action")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentRecords.map((item, i) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm font-medium text-gray-700">
                    {indexOfFirstRecord + i + 1}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${item.status
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {item.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-4 text-lg">
                      <FaRegEdit
                        onClick={() => handleEdit(item, true)}
                        className="text-orange-500 cursor-pointer hover:scale-110 transition-transform"
                      />
                      <FaRegTrashAlt
                        onClick={() => openDeleteModal(item._id)}
                        className="text-red-500 cursor-pointer hover:scale-110 transition-transform"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              {t("previous")}
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded ${currentPage === index + 1
                      ? "bg-sky-500 text-white"
                      : "bg-gray-200"
                    }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
            >
              {t("next")}
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {editOpen && (
        <EditCategory categorys={categorys} setEditOpen={setEditOpen} />
      )}
      {open && <AddCategory setOpen={setOpen} />}
      {isModalOpen && (
        <ConfirmDeleteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => handleDelete(categoryToDelete)}
        />
      )}
    </div>
  );
};

export default Category;
