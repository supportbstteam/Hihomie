'use clint'
import { assign_to_team, get_assignTeam, get_teamData } from '@/store/userTema';
import React, { useEffect, useState } from 'react'
import { BsPlusCircleDotted } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from "framer-motion";
import useUserFromSession from '@/lib/useUserFromSession';
import { t } from '@/components/translations';

const AssignUser = ({ colId, cardid }) => {
    const user = useUserFromSession();
    const dispatch = useDispatch();
    const { loader, assignTeam, team, errorMessage, successMessage } = useSelector((state) => state.team);

    const [assignUser, setAssigneUser] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(assign_to_team({ object: selectedUsers, colId, cardId: cardid }))
    };


    const toggleUser = (id) => {
        setSelectedUsers(prev =>
            prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        if (cardid && colId) {
            dispatch(get_assignTeam({ cardId: cardid, colId }));
        }
    }, [dispatch, cardid, colId]);

    useEffect(() => {
        dispatch(get_teamData());
    }, [dispatch]);

    useEffect(() => {
        if (assignTeam?.length > 0) {
            const assignedIds = assignTeam.map(user => user._id);
            setSelectedUsers(assignedIds);
        }
    }, [assignTeam]);

    useEffect(() => {
        if (successMessage) {
            setAssigneUser(false)

            setSelectedUsers([])

            if (cardid && colId) {
                dispatch(get_assignTeam({ cardId: cardid, colId }));
            }

        }
    }, [dispatch, cardid, colId, successMessage])

    return (
        <>
            <div>
                <h1 className="text-[#67757c]">Assigned User</h1>
                <div className='flex items-center gap-1'>
                    {assignTeam?.map((item, index) => (
                        <img
                            key={index}
                            src={`${process.env.NEXT_PUBLIC_BASE_URL}/${item.image ? item.image : 'default.jpg'}`}
                            alt={item.name}
                            title={item.name}
                            className="w-8 h-8 rounded-full"
                        />
                    ))}
                    {user.role === "admin" && (
                        <button className="text-2xl" onClick={() => setAssigneUser(true)}><BsPlusCircleDotted /></button>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {assignUser && (
                    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                        <motion.div
                            initial={{ y: -100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -100, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="bg-white h-[40vh] w-full max-w-[45%] rounded-lg shadow-2xl p-6 md:p-8 relative overflow-y-auto"
                        >
                            <button
                                onClick={() => setAssigneUser(false)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            >
                                X
                            </button>
                            <h2 className="text-lg font-semibold mb-4">Assign Users</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col gap-2 overflow-y-auto">
                                    {team.map(user => (
                                        <label key={user._id} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user._id)}
                                                onChange={() => toggleUser(user._id)}
                                                className="w-4 h-4 accent-teal-500"
                                            />
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_BASE_URL}/${user.image ? user.image : 'default.jpg'}`}
                                                alt={user.name}
                                                title={user.name}
                                                className="w-6 h-6 rounded-full"
                                            />
                                            <span>{user.name} {user.lname}</span>
                                        </label>
                                    ))}
                                </div>
                                <button
                                    type="submit"
                                    className="mt-4 w-full bg-[#21B573] hover:bg-green-600 text-white py-2 rounded"
                                >
                                    Update
                                </button>
                            </form>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </>

    )
}

export default AssignUser