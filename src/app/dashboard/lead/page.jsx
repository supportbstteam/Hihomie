'use client'
import CustomerAdd from '@/components/prospects/CustomerAdd';
import EditCard from '@/components/prospects/EditCard';
import { get_leadStatusCardUpdate, get_leadStatusData, get_leadStatusDataForList } from '@/store/setting';
import React, { useEffect, useRef, useState } from 'react';
import { CiCirclePlus, CiMail } from "react-icons/ci";
import { useSelector, useDispatch } from 'react-redux';
import { SlCalender } from "react-icons/sl";
import { LuPhone, LuPhoneCall } from "react-icons/lu";
import { FaListUl, FaPlus, FaWhatsapp } from "react-icons/fa";
import { MdFilterList } from "react-icons/md";
import Filter from '@/components/prospects/Filter';
import List from '@/components/List';
import Stats from '@/components/Stats';

export default function CustomDnD() {
    const dispatch = useDispatch();
    const { leadStatus, leadStatusList } = useSelector((state) => state.setting);

    const [columns, setColumns] = useState({});
    const [draggedCard, setDraggedCard] = useState(null);
    const [draggingCardId, setDraggingCardId] = useState(null);
    const [dragOverColId, setDragOverColId] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedColId, setSelectedColId] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const [listComponent, setListComponent] = useState(false);
    const [selecteFilterData, setSelecteFilterData] = useState();

    const touchPosition = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!listComponent) {
            dispatch(get_leadStatusData());
        } else {
            dispatch(get_leadStatusDataForList());
        }
    }, [dispatch, listComponent]);

    useEffect(() => {
        if (leadStatus && leadStatus.length > 0) {
            const newColumns = leadStatus.reduce((acc, item) => {
                acc[item._id] = {
                    id: item._id,
                    title: item.status_name,
                    color: item.color,
                    cards: item.cards,
                };
                return acc;
            }, {});
            setColumns(newColumns);
        }
    }, [leadStatus]);

    const handleCardAdded = (colId, newCard) => {
        setColumns(prev => ({
            ...prev,
            [colId]: {
                ...prev[colId],
                cards: [...prev[colId].cards, newCard],
            }
        }));
    };

    const handleDragStart = (cardId, sourceColId, index) => {
        setDraggedCard({ cardId, sourceColId, index });
        setDraggingCardId(cardId);
    };

    const handleDragEnd = () => {
        setDraggedCard(null);
        setDraggingCardId(null);
        setDragOverColId(null);
    };

    const handleDragOver = (e, colId) => {
        e.preventDefault();
        setDragOverColId(colId);
    };

    const handleDropColumn = (destColId) => {
        if (!draggedCard) return;
        const sourceCol = columns[draggedCard.sourceColId];
        const destCol = columns[destColId];
        const draggedObj = sourceCol.cards[draggedCard.index];

        if (draggedCard.sourceColId === destColId) {
            handleDragEnd();
            return;
        }

        const newSourceCards = [...sourceCol.cards];
        newSourceCards.splice(draggedCard.index, 1);
        const newDestCards = [draggedObj, ...destCol.cards];

        setColumns({
            ...columns,
            [draggedCard.sourceColId]: { ...sourceCol, cards: newSourceCards },
            [destColId]: { ...destCol, cards: newDestCards },
        });

        handleDragEnd();
        dispatch(get_leadStatusCardUpdate({
            sourceColId: draggedCard.sourceColId,
            destColId: destColId,
            cardId: draggedObj._id || draggedObj.id
        }));
    };

    const handleDropBetween = (destColId, destIndex) => {
        if (!draggedCard) return;

        const sourceCol = columns[draggedCard.sourceColId];
        const destCol = columns[destColId];
        const draggedObj = sourceCol.cards[draggedCard.index];

        if (draggedCard.sourceColId === destColId) {
            let newCards = [...sourceCol.cards];
            newCards.splice(draggedCard.index, 1);
            let adjustedIndex = destIndex > draggedCard.index ? destIndex - 1 : destIndex;
            newCards.splice(adjustedIndex, 0, draggedObj);

            setColumns({
                ...columns,
                [destColId]: { ...destCol, cards: newCards },
            });
        } else {
            let newSourceCards = [...sourceCol.cards];
            newSourceCards.splice(draggedCard.index, 1);
            let newDestCards = [...destCol.cards];
            newDestCards.splice(destIndex, 0, draggedObj);

            setColumns({
                ...columns,
                [draggedCard.sourceColId]: { ...sourceCol, cards: newSourceCards },
                [destColId]: { ...destCol, cards: newDestCards },
            });
        }
        handleDragEnd();
    };

    const handleTouchStart = (e, cardId, sourceColId, index) => {
        const touch = e.touches[0];
        touchPosition.current = { x: touch.clientX, y: touch.clientY };
        handleDragStart(cardId, sourceColId, index);
    };

    const handleTouchMove = (e) => {
        if (!draggedCard) return;
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        const colElement = element?.closest("[data-col-id]");
        if (colElement) {
            setDragOverColId(colElement.dataset.colId);
        }
    };

    const handleTouchEnd = () => {
        if (dragOverColId) {
            handleDropColumn(dragOverColId);
        }
        handleDragEnd();
    };

    const handleCardClick = (colId, card) => {
        setSelectedColId(colId);
        setSelectedUser(card);
    };

    return (
        <>
            {/* HEADER */}
            <aside className="w-full bg-white shadow-md border-b sticky top-0 z-50">
                <div className="flex items-center justify-between px-4 py-2 sm:px-6 sm:py-3">
                    <div className="hidden sm:flex flex-col"></div>
                    <div className="flex w-full sm:w-auto justify-end">
                        <ul className="flex items-center gap-2 sm:gap-4">
                            <li className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white shadow-sm px-2 py-1 sm:px-3 sm:py-2 cursor-pointer">
                                <FaPlus className="text-lg sm:text-xl" />
                            </li>
                            <li onClick={() => setListComponent((prev) => !prev)} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white shadow-sm px-2 py-1 sm:px-3 sm:py-2 cursor-pointer">
                                <FaListUl className="text-lg sm:text-xl" />
                            </li>
                            <li onClick={() => setFilterOpen(true)} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white shadow-sm px-2 py-1 sm:px-3 sm:py-2 cursor-pointer">
                                <MdFilterList className="text-lg sm:text-xl" />
                            </li>
                        </ul>
                    </div>
                </div>
            </aside>

            {/* BOARD */}
            {!listComponent ? (
                <div className="flex gap-4 sm:gap-6 p-3 sm:p-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                    {Object.values(columns).map((col) => (
                        <div
                            key={col.id}
                            data-col-id={col.id}
                            className={`rounded-lg p-4 w-[50%] sm:w-[300px] md:w-[360px] flex-shrink-0 transition-colors duration-300 ease-in-out
                                ${dragOverColId === col.id ? "bg-blue-100" : "bg-gray-100"}`}
                            onDragOver={(e) => handleDragOver(e, col.id)}
                            onDrop={() => handleDropColumn(col.id)}
                        >
                            <div className='flex justify-between gap-2'>
                                <h2 className="font-bold mb-3 text-sm sm:text-base">{col.title}</h2>
                                <button
                                    onClick={() => {
                                        setSelectedColId(col.id);
                                        setOpen(true);
                                    }}
                                    className='text-[#67778880] text-2xl hover:text-gray-700'
                                >
                                    <CiCirclePlus />
                                </button>
                            </div>

                            {col.cards.map((card, index) => (
                                <div
                                    key={card._id}
                                    draggable
                                    onDragStart={() => handleDragStart(card._id, col.id, index)}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={() => handleDropBetween(col.id, index)}
                                    onClick={() => handleCardClick(col.id, card)}
                                    onTouchStart={(e) => handleTouchStart(e, card._id, col.id, index)}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                    className={`shadow-md rounded-xl p-3 sm:p-4 mb-3 cursor-grab transition-all duration-300 ease-in-out
                                        ${draggingCardId === card.id
                                            ? "opacity-60 border-2 border-blue-500 scale-105"
                                            : "bg-white hover:shadow-lg"}`}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                            {card.first_name?.[0] || "?"}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                                                {card.first_name} {card.last_name}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="text-xs sm:text-sm text-[#99A1B7] space-y-1 mb-3 leading-5 font-semibold">
                                        <p className='flex items-center gap-2'><CiMail /> {card.email}</p>
                                        <p className='flex items-center gap-2'><LuPhone /> {card.phone}</p>
                                        <p className='flex items-center gap-2'><SlCalender /> {new Date().toLocaleDateString()}</p>
                                    </div>
                                    <div className='flex justify-center items-center gap-6 sm:gap-10 text-lg sm:text-[22px] text-[#99A1B7] mt-2'>
                                        <a href={`tel:${card.phone}`} onClick={(e) => e.stopPropagation()}><LuPhoneCall /></a>
                                        <a href={`https://wa.me/${card.phone}`} onClick={(e) => e.stopPropagation()}><FaWhatsapp /></a>
                                        <a href={`mailto:${card.email}`} onClick={(e) => e.stopPropagation()}><CiMail /></a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <div className='p-3 sm:p-5'>
                    <Filter leadStatusList={leadStatusList} filterOpen={filterOpen} setFilterOpen={setFilterOpen} setSelecteFilterData={setSelecteFilterData} />
                    <div className="my-4"><Stats /></div>
                    <List leadStatusList={leadStatusList} selecteFilterData={selecteFilterData} setSelectedUser={setSelectedUser} />
                </div>
            )}

            <CustomerAdd
                open={open}
                setOpen={setOpen}
                selectedColId={selectedColId}
                onCardAdded={handleCardAdded}
                leadStatus={leadStatus}
            />

            {selectedUser && (
                <EditCard
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    colId={selectedColId}
                    leadStatus={leadStatus}
                />
            )}
        </>
    );
}
