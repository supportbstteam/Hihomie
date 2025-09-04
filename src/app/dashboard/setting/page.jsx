'use client'
import React, { useEffect, useState } from 'react'
import { FaPlus, FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import AddStatus from '@/components/setting/status/AddStatus';
import { useDispatch, useSelector } from 'react-redux';
import { delete_leadStatusDelete, get_leadStatusData, messageClear } from '@/store/setting';
import EditStatus from '@/components/setting/status/EditStatus';
import { t } from '@/components/translations';
import { capitalizeFirstLetter } from '@/components/ui/string';
import Icon from '@/components/ui/Icon';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmDeleteModal from '@/components/ConfirmAlert';

const Page = () => {
    const dispatch = useDispatch();
    const { leadStatus, successMessage, errorMessage } = useSelector((state) => state.setting);

    const [open, setOpen] = useState(false);
    const [statusData, setStatusData] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusToDelete, setStatusToDelete] = useState(null);


    // Pagination logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = leadStatus.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(leadStatus.length / recordsPerPage);

    useEffect(() => {
        dispatch(get_leadStatusData());
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(delete_leadStatusDelete(id));
    };

     const openDeleteModal = (Id) => {
    setStatusToDelete(Id);
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
    }, [errorMessage, successMessage]);

    return (
        <div className="grid w-full">
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
                <div className="p-6 bg-white rounded-xl shadow-md">
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border border-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">{t('S.N')}</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">{t('name')}</th>
                                    <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">{t('color')}</th>
                                    <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">{t('action')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {currentRecords.map((row, i) => (
                                    <tr
                                        key={row._id}
                                        className={`hover:bg-gray-50 transition-colors duration-200 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                            }`}
                                    >
                                        <td className="py-3 px-4 text-gray-700">{indexOfFirstRecord + i + 1}</td>
                                        <td className="py-3 text-sm px-4 text-gray-500">{capitalizeFirstLetter(row.status_name)}</td>
                                        <td className="py-3 px-4 text-center">
                                            <span
                                                className="inline-block w-6 h-6 rounded-full border border-gray-300 shadow-sm"
                                                style={{ backgroundColor: row.color }}
                                            />
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <div className="flex justify-center gap-4 text-lg">
                                                <FaRegEdit
                                                    onClick={() => setStatusData(row)}
                                                    className="text-orange-500 cursor-pointer hover:scale-110 transition-transform"
                                                />
                                                <FaRegTrashAlt
                                                    onClick={() => openDeleteModal(row._id)}
                                                    className="text-red-500 cursor-pointer hover:scale-110 transition-transform"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-4">
                        <button
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
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
                                    className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-sky-500 text-white' : 'bg-gray-200'
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
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {open && <AddStatus open={open} setOpen={setOpen} />}
            {statusData && <EditStatus statusData={statusData} setStatusData={setStatusData} />}


            {isModalOpen && (
                <ConfirmDeleteModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={() => handleDelete(statusToDelete)}
                />
            )}

        </div>
    );
};

export default Page;
