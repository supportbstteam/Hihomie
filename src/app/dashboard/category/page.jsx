'use client'
import AddCategory from '@/components/category/AddCategory'
import { delete_category, get_category, messageClear } from '@/store/category'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaPlus, FaRegEdit, FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import toast from 'react-hot-toast'
import EditCategory from '@/components/category/EditCategory'
import { t } from '@/components/translations';


const Category = () => {
    const [open, setOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [categorys, setCategorys] = useState(false)

    const dispatch = useDispatch();
    const { loader, category, errorMessage, successMessage } = useSelector(state => state.category);


    useEffect(() => {
        dispatch(get_category())
    }, [])

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;


    // Pagination logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    // const currentRecords = category.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(category.length / recordsPerPage);

    const handleDelete = (id) => {
        dispatch(delete_category(id))
    }

    const handleEdit = (category,flag) => {
        setEditOpen(flag)
         setCategorys(category)
    }


    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear());
        }
    }, [errorMessage, successMessage])

  
    return (
        <div className=''>
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

              <div className='p-5'>

                <div className="bg-white rounded-xl shadow-md mt-5 p-5">
                <table className="w-full text-left border-collapse overflow-auto">
                    <thead>
                        <tr className="border-b text-gray-600">
                            <th className="py-3 text-left">{t('category')}</th>
                            <th className="py-3 text-center">{t('status')}</th>
                            <th className="py-3 text-center">{t('action')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {category.map((item) => (
                            <tr key={item._id} className="border-b hover:bg-gray-50">
                                <td className="py-3">{item.category}</td>
                                <td className="py-3 text-center">{item.status}</td>
                                <td className="py-3 text-center">
                                    <div className="flex justify-center gap-3 text-lg">
                                        <FaRegEdit onClick={() => handleEdit(item, true)} className="text-orange-500 cursor-pointer hover:scale-110 transition" />
                                        <FaRegTrashAlt
                                            onClick={() => handleDelete(item._id)}
                                            className="text-red-500 cursor-pointer hover:scale-110 transition"
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
                        {t('previous')}
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
                       {t('next')}
                    </button>
                </div>
            </div>
              </div>

            {editOpen && 
             
             <EditCategory categorys={categorys} setEditOpen={setEditOpen}/>
             
             }

            {open &&
                <AddCategory setOpen={setOpen} />
            }
             
             

        </div>
    )
}

export default Category