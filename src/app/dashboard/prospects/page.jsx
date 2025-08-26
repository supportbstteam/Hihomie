'use client'
import CustomerAdd from '@/components/prospects/CustomerAdd';
import EditCard from '@/components/prospects/EditCard';
import { get_leadStatusCardUpdate, get_leadStatusData } from '@/store/setting';
import React, { useEffect, useState } from 'react';
import { CiCirclePlus } from "react-icons/ci";
import { useSelector, useDispatch } from 'react-redux';

export default function CustomDnD() {
    const dispatch = useDispatch();
    const { leadStatus } = useSelector((state) => state.setting);

    const [columns, setColumns] = useState({});
    const [draggedCard, setDraggedCard] = useState(null);
    const [draggingCardId, setDraggingCardId] = useState(null); // 👈 new
    const [dragOverColId, setDragOverColId] = useState(null);   // 👈 new
    const [open, setOpen] = useState(false);
    const [selectedColId, setSelectedColId] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null); // 👈 नया state
    useEffect(() => {
        dispatch(get_leadStatusData());
    }, [dispatch]);

    useEffect(() => {
        if (leadStatus && leadStatus.length > 0) {
            const newColumns = leadStatus.reduce((acc, item) => {
                acc[item._id] = {
                    id: item._id,
                    title: item.status_name,
                    color: item.color,
                    cards: item.cards.map((c, i) => ({
                        id: c._id || `${item._id}-${i}`,
                        title: `${c.first_name || ""} ${c.last_name || ""}`.trim() || `Card ${i + 1}`,
                        first_name : c.first_name,
                        last_name : c.last_name,
                        email: c.email,
                        phone: c.phone,
                        origin: c.origin,
                        automatic: c.automatic,
                    })),
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

    // start dragging
    const handleDragStart = (cardId, sourceColId, index) => {
        setDraggedCard({ cardId, sourceColId, index });
        setDraggingCardId(cardId); // 👈 highlight this card
    };

    const handleDragEnd = () => {
        setDraggedCard(null);
        setDraggingCardId(null); // 👈 remove highlight
        setDragOverColId(null);
    };

    const handleDragOver = (e, colId) => {
        e.preventDefault();
        setDragOverColId(colId); // 👈 highlight this column
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


    const handleCardClick = (colId, card) => {
        setSelectedColId(colId);
        setSelectedUser(card);
    };

    return (
        <div className="flex gap-6 p-6">
            {Object.values(columns).map((col) => (
                <div
                    key={col.id}
                    className={`rounded-lg p-4 w-72 transition-colors duration-200 
                        ${dragOverColId === col.id ? "bg-blue-100" : "bg-gray-100"}`}
                    onDragOver={(e) => handleDragOver(e, col.id)}
                    onDrop={() => handleDropColumn(col.id)}
                >
                    <div className='flex justify-between gap-2'>
                        <h2 className="font-bold mb-3">{col.title}</h2>
                        <button
                            onClick={() => {
                                setSelectedColId(col.id);
                                setOpen(true);
                            }}
                            className='text-[#67778880] text-3xl hover:text-gray-700'
                        >
                            <CiCirclePlus />
                        </button>
                    </div>

                    {col.cards.map((card, index) => (
                        <div
                            key={card.id}
                            draggable
                            onDragStart={() => handleDragStart(card.id, col.id, index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDropBetween(col.id, index)}
                            onClick={() => handleCardClick(col.id, card)}
                            className={`shadow-md rounded-xl p-4 mb-3 cursor-grab transition 
                                ${draggingCardId === card.id ? "opacity-50 border-2 border-blue-500" : "bg-white"}`}
                        >
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                    {card.title?.[0] || "?"}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">
                                        {card.title}
                                    </h3>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="text-sm text-gray-600 space-y-1 mb-3">
                                <p>📞 {card.phone}</p>
                                <p>📅 {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ))}

            <CustomerAdd
                open={open}
                setOpen={setOpen}
                selectedColId={selectedColId}
                onCardAdded={handleCardAdded}
            />

            {selectedUser && (
                <EditCard
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    colId={selectedColId}
                />
            )}

        </div>
    );
}
