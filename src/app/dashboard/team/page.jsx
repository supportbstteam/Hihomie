'use client'
import React, { useEffect, useState } from 'react'
import { FaPlus, FaRegEdit, FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import AddTeam from '@/components/team/AddTeam';
import { delete_teamData, get_teamData, messageClear } from '@/store/userTema';
import EditTeam from '@/components/team/EditTeam';
import { t } from '@/components/translations';
import { capitalizeFirstLetter } from '@/components/ui/string';
import { Plus } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import ConfirmDeleteModal from '@/components/ConfirmAlert';

const Team = () => {

    const dispatch = useDispatch();
    const { loader, team, errorMessage, successMessage } = useSelector((state) => state.team);
    const [open, setOpen] = useState(false)
    const [user, setUser] = useState()

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;

      const [isModalOpen, setIsModalOpen] = useState(false);
      const [teamToDelete, setTeamToDelete] = useState(null);

    // Pagination logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = team.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(team.length / recordsPerPage);



    // fetch customers from API
    useEffect(() => {
        dispatch(get_teamData());
    }, [dispatch]);

    const openDeleteModal = (catId) => {
    setTeamToDelete(catId);
    setIsModalOpen(true);
  };


    const handleDelete = (id) => {
        dispatch(delete_teamData(id))
    }

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            setOpen(false)
            setUser(null)
            setIsModalOpen(false)
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear());
        }
    }, [errorMessage, successMessage])


    return (
        <div className='grid w-full'>
            {/* Header */}
            <aside className="w-full bg-white shadow-md border-b sticky top-0 z-50">
                <div className="flex items-center justify-between px-4 py-2 sm:px-6 sm:py-3">
                    <div className="hidden sm:flex flex-col">

                    </div>

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

            <div className='p-5'>
                <div className="p-6 bg-white rounded-xl shadow-md">
                    <table className="min-w-full border border-gray-200 rounded-lg shadow-md overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">{t('full_name')}</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">{t('position')}</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">{t('role')}</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">{t('email')}</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">{t('phone')}</th>
                                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">{t('status')}</th>
                                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">{t('action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentRecords.map((row, i) => (
                                <tr
                                    key={i}
                                    className={`hover:bg-gray-50 transition-colors duration-200 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                >
                                    <td className="py-3 px-4 flex items-center gap-3">
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_BASE_URL}/${row.image}`}
                                            className="w-7 h-7 rounded-full border object-cover"
                                        />
                                        <span className="text-gray-800 text-sm font-medium">{capitalizeFirstLetter(row.name)} {capitalizeFirstLetter(row.lname)}</span>
                                    </td>
                                    <td className="py-3 text-sm px-4 text-gray-700">{capitalizeFirstLetter(row.jobTitle)}</td>
                                    <td className="py-3 text-sm px-4 text-gray-700">
                                        {capitalizeFirstLetter(row.role)}
                                    </td>
                                    <td className="py-3 text-sm px-4  text-gray-700">{row.email}</td>
                                    <td className="py-3 text-sm px-4  text-gray-700">{row.phone}</td>
                                    <td className="py-3 text-sm px-4 text-center">
                                        <span
                                            className={`px-3 py-1 text-sm font-semibold rounded-full ${row.status ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                }`}
                                        >
                                            {row.status ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex justify-center gap-3 text-lg">
                                            <FaRegEdit
                                                onClick={() => setUser(row)}
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

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-4">
                        <button
                            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
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
                                    className={`px-3 py-1 rounded-md transition ${currentPage === index + 1
                                        ? 'bg-sky-500 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {open &&

                <AddTeam setOpen={setOpen} />

            }

            {
                user && <EditTeam user={user} setUser={setUser} />
            }

            {isModalOpen && (
                <ConfirmDeleteModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={() => handleDelete(teamToDelete)}
                />
            )}


        </div>
    )
}

export default Team