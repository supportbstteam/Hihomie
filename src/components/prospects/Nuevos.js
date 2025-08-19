'use client'
import React, { useEffect, useState } from 'react'
import { CiCirclePlus } from 'react-icons/ci'
import Card from './Card'
import { useDispatch, useSelector } from 'react-redux'
import { get_customer } from '@/store/customer'
import CustomerAdd from './CustomerAdd'

const Nuevos = () => {

 const [open, setOpen] = useState(false)
    const dispatch = useDispatch();
    const { customer } = useSelector(state => state.customer);

    useEffect(() => {
        dispatch(get_customer())
    }, [])
  return (
     <div
            className="min-w-[400px] flex-1 rounded-xl shadow-md p-2 flex flex-col bg-[#f9f9f9]"
        >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                    <span
                        className={`w-3 h-3 rounded-full bg-blue-500`}
                    />
                    NUEVOS CLIENTES POTENCIALES
                </h2>
                <button
                    onClick={() => setOpen(true)}
                    className="text-[#67778880] text-3xl hover:text-gray-700"
                >
                    <CiCirclePlus />
                </button>
            </div>
            <section className="grid gap-4 h-[70vh] overflow-y-scroll scrollbar-hide">
                <Card users={customer}/>
            </section>



             <CustomerAdd open={open} setOpen={setOpen} />
        </div>

        
  )
}

export default Nuevos