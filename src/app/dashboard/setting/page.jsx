'use client'
import React, { useEffect, useState } from 'react'
import { FaPlus, FaRegEdit, FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import AddStatus from '@/components/setting/status/AddStatus';
import { useDispatch, useSelector } from 'react-redux';
import { delete_leadStatusDelete, get_leadStatusData } from '@/store/setting';
import toast from 'react-hot-toast';
import { messageClear } from '@/store/customer';

const page = () => {

      const dispatch = useDispatch();
      const { loader,leadStatus, successMessage, errorMessage } = useSelector((state) => state.setting);

    const [open, setOpen] = useState(false)

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    // Pagination logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = leadStatus.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(leadStatus.length / recordsPerPage);

   

      // fetch customers from API
      useEffect(() => {
        dispatch(get_leadStatusData());
      }, [dispatch]);
    

      const handleDelete = (id) => {
         dispatch(delete_leadStatusDelete(id))
      }
      

    return (
        <div className='grid w-full'>
            {/* Header */}
            <aside className="w-full bg-white shadow-md border-b sticky top-0 z-50">
                <div className="flex items-center justify-between px-4 py-2 sm:px-6 sm:py-3">
                    <div className="hidden sm:flex flex-col">

                    </div>

                    <div className="flex w-full sm:w-auto justify-end">
                        <ul className="flex items-center gap-3 sm:gap-4">
                            <li className="flex items-center gap-2 rounded-1xl border border-gray-200 bg-white shadow-sm px-3 py-2 font-medium cursor-pointer">
                                <FaPlus className="text-lg sm:text-xl" onClick={() => setOpen(true)} />
                            </li>
                        </ul>
                    </div>
                </div>
            </aside>

            <div className="p-6 bg-white rounded-xl shadow-md">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b text-gray-600">
                            <th className="py-3 text-left">Nombre</th>
                            {/* <th className="py-3 text-center">Leads</th> */}
                            <th className="py-3 text-center">Color</th>
                            {/* <th className="py-3 text-center">Created By</th> */}
                            <th className="py-3 text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leadStatus.map((row, i) => (
                            <tr key={i} className="border-b hover:bg-gray-50">
                                {/* Name */}
                                <td className="py-3 flex items-center gap-2">
                                    {row.status_name}
                                </td>

                                {/* Leads */}
                                {/* <td className="py-3 text-center">1</td> */}

                                {/* Color */}
                                <td className="py-3 text-center">
                                    <span
                                        className="inline-block w-5 h-3 rounded-full"
                                        style={{ backgroundColor: row.color }}
                                    ></span>
                                </td>

                                {/* Created By */}
                                {/* <td className="py-3 text-center">
                                    <div className="flex justify-center items-center gap-2">
                                        <img
                                            src="https://cdn-icons-png.flaticon.com/512/4712/4712100.png"
                                            alt="avatar"
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <span className="text-gray-700">System</span>
                                    </div>
                                </td> */}

                                {/* Action */}
                                <td className="py-3 text-center">
                                    <div className="flex justify-center gap-3 text-lg">
                                        <FaRegEye className="text-green-500 cursor-pointer hover:scale-110 transition" />
                                        <FaRegEdit className="text-orange-500 cursor-pointer hover:scale-110 transition" />
                                        <FaRegTrashAlt onClick={()=>handleDelete(row._id)} className="text-red-500 cursor-pointer hover:scale-110 transition" />
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
                        Previa
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
                        Próxima
                    </button>
                </div>
            </div>

            <AddStatus open={open} setOpen={setOpen} />

           
        </div>
    )
}

export default page