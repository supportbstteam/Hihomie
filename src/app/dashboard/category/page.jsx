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
import {
  Mail,
  MessageSquareText,
  Pencil,
  Phone,
  Plus,
  Trash,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

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
      setIsModalOpen(false);
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
      <aside className="w-full bg-white sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div>
            <h2 className="h2">{t("category")}</h2>
          </div>
          <div className="flex justify-end">
            <Icon
              variant="outline"
              icon={Plus}
              size={16}
              color="#99A1B7"
              onClick={() => setOpen(true)}
            />
          </div>
        </div>
      </aside>
      {/* Table */}
      <div className="p-4 bg-background-secondary ">
        <div className="overflow-auto custom-scrollbar max-h-[50vh] rounded-md shadow-md bg-white">
          <Table>
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead className="pl-8">{t("Sr. No")}</TableHead>
                <TableHead>{t("category")}</TableHead>
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
                    <TableCell className="pl-8">{i + 1}</TableCell>

                    <TableCell>
                      {" "}
                      {item.category.charAt(0).toUpperCase() +
                        item.category.slice(1)}
                    </TableCell>

                    <TableCell>
                      <Badge variant={item.status ? "active" : "inactive"}>
                        {item.status ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    <TableCell className="flex justify-start gap-2">

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Icon
                              icon={Pencil}
                              size={20}
                              onClick={() => handleEdit(item, true)}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Icon
                              icon={Trash}
                              size={20}
                              onClick={() =>
                                openDeleteModal(item._id, item.leadStatusId)
                              }
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 p-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    onClick={() => setCurrentPage(currentPage)}
                  >
                    {currentPage}
                  </PaginationLink>
                </PaginationItem>
                {/* <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem> */}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            {/* <button
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
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
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
            </button> */}
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
