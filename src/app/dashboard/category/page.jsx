"use client";
import AddCategory from "@/components/category/AddCategory";
import { delete_category, get_category, messageClear } from "@/store/category";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaRegEdit, FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import EditCategory from "@/components/category/EditCategory";
import { t } from "@/components/translations";
import Icon from "@/components/ui/Icon";
import { Plus } from "lucide-react";
import { capitalizeFirstLetter, capitalizeWords } from "@/components/ui/string";

const Category = () => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [categorys, setCategorys] = useState(false);

  const dispatch = useDispatch();
  const { loader, category, errorMessage, successMessage } = useSelector(
    (state) => state.category
  );

  useEffect(() => {
    dispatch(get_category());
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  // const currentRecords = category.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(category.length / recordsPerPage);

  const handleDelete = (id) => {

    if (window.confirm("Are you sure you want to delete this item?")) {
      dispatch(delete_category(id));
    }


  };

  const handleEdit = (category, flag) => {
    setEditOpen(flag);
    setCategorys(category);
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [errorMessage, successMessage]);

  return (
    <div className="">
      <aside className="w-full bg-white  border-b border-stroke sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-2 sm:px-6 sm:py-3">
          <div className="hidden sm:flex flex-col"></div>

          <div className="flex w-full sm:w-auto justify-end">
            <Icon
              icon={Plus}
              size={20}
              color="#99A1B7"
              onClick={() => setOpen(true)}
            />
          </div>
        </div>
      </aside>
      <div className="p-5">
        <div className="bg-white rounded-xl shadow-md mt-5 p-5">
          <table className="min-w-full border border-gray-200 rounded-lg shadow-md overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">{t("serial")}</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">{t("category")}</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">{t("status")}</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">{t("action")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {category.map((item, i) => (
                <tr
                  key={item._id}
                  className={`hover:bg-gray-50 transition-colors duration-200 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="py-3 px-4 text-sm text-gray-700 font-medium">{i + 1}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{capitalizeFirstLetter(item.category)}</td>
                  <td className="py-3 px-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${item.status === true
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                        }`}
                    >
                      {item.status === true ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-3 text-lg">
                      <FaRegEdit
                        onClick={() => handleEdit(item, true)}
                        className="text-orange-500 cursor-pointer hover:scale-110 transition-transform duration-200"
                      />
                      <FaRegTrashAlt
                        onClick={() => handleDelete(item._id)}
                        className="text-red-500 cursor-pointer hover:scale-110 transition-transform duration-200"
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

      {editOpen && (
        <EditCategory categorys={categorys} setEditOpen={setEditOpen} />
      )}

      {open && <AddCategory setOpen={setOpen} />}
    </div>
  );
};

export default Category;
