"use client";
import CustomerAdd from "@/components/prospects/CustomerAdd";
import EditCard from "@/components/prospects/EditCard";
import {
  get_leadStatusCardUpdate,
  get_manager_leadStatusData,
  get_manager_leadStatusDataForList,
} from "@/store/setting";
import React, { useEffect, useRef, useState } from "react";
import { CiCirclePlus, CiMail } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import { SlCalender } from "react-icons/sl";
import { LuPhone, LuPhoneCall } from "react-icons/lu";
import { FaListUl, FaPlus, FaWhatsapp } from "react-icons/fa";
import { MdFilterList } from "react-icons/md";
import Filter from "@/components/prospects/Filter";
// import List from "@/components/List";
import ManagerList from "@/components/ManagerList";
import Stats from "@/components/Stats";
import { CiImport } from "react-icons/ci";
import {
  Calendar,
  ChartSpline,
  Mail,
  Percent,
  Phone,
  PiggyBank,
  Plus,
  List as ListIcon,
  ListFilter,
  Download,
} from "lucide-react";
import Icon from "@/components/ui/Icon";
import ImportModal from "@/components/prospects/Impode";
import toast from "react-hot-toast";
import { messageClear } from "@/store/customer";
import { t } from "@/components/translations";

export default function CustomDnD() {
  const dispatch = useDispatch();
  const { leadStatus, leadStatusList, successMessage } = useSelector(
    (state) => state.setting
  );

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
  const [impodeOpen, setImpodeOpen] = useState(false);

  const touchPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!listComponent) {
      dispatch(get_manager_leadStatusData());
    } else {
      dispatch(get_manager_leadStatusDataForList());
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

  const handleCardAdded = () => {
    setOpen(false);
    dispatch(messageClear());
    dispatch(get_manager_leadStatusData());
    dispatch(get_manager_leadStatusDataForList());
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
    dispatch(
      get_leadStatusCardUpdate({
        sourceColId: draggedCard.sourceColId,
        destColId: destColId,
        cardId: draggedObj._id || draggedObj.id,
      })
    );
  };

  const handleDropBetween = (destColId, destIndex) => {
    if (!draggedCard) return;

    const sourceCol = columns[draggedCard.sourceColId];
    const destCol = columns[destColId];
    const draggedObj = sourceCol.cards[draggedCard.index];

    if (draggedCard.sourceColId === destColId) {
      let newCards = [...sourceCol.cards];
      newCards.splice(draggedCard.index, 1);
      let adjustedIndex =
        destIndex > draggedCard.index ? destIndex - 1 : destIndex;
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

  useEffect(() => {
    if (successMessage) {
      dispatch(messageClear());
      dispatch(get_manager_leadStatusDataForList());
      dispatch(get_manager_leadStatusData());
    }
  }, [successMessage, dispatch]);

  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <aside className="w-full bg-white">
        <div className="flex items-center justify-between p-4">
          <div className="hidden sm:flex flex-col">
            <h2 className="h2">{t("lead_management")}</h2>
            <span className="p text-muted-foreground">
              {t("organize_leads_and_track_their_progress_effectively_here")}
            </span>
          </div>
          <div className="flex w-full sm:w-auto justify-end">
            <div className="flex items-center gap-2 sm:gap-4">
              <Icon
                onClick={() => {
                  setOpen(true);
                }}
                variant="outline"
                icon={Plus}
                size={16}
                color="#99A1B7"
              />
              <Icon
                variant="outline"
                icon={ListIcon}
                size={16}
                color="#99A1B7"
                onClick={() => setListComponent((prev) => !prev)}
              />

              <Icon
                variant="outline"
                icon={Download}
                size={16}
                color="#99A1B7"
                onClick={() => setImpodeOpen(true)}
              />

              <Icon
                icon={ListFilter}
                variant="outline"
                size={16}
                color="#99A1B7"
                onClick={() => setFilterOpen(true)}
              />
            </div>
          </div>
        </div>
      </aside>
      {/* <LowerNav /> */}

      <Stats leadStatus={leadStatus} />

      {/* BOARD */}
      {!listComponent ? (
        <div className="flex-1 h-[40vh] p-4 rounded-md w-full grid grid-flow-col auto-cols-[296px] gap-4  overflow-x-auto custom-scrollbar mb-1">
          {Object.values(columns).map((col) => (
            <div
              key={col.id}
              data-col-id={col.id}
              className={`p-2 pb-8 flex-1 transition-colors duration-200 overflow-hidden border-t-5 rounded-md
                                ${
                                  dragOverColId === col.id
                                    ? "bg-blue-100"
                                    : "bg-[#F9F9F9]"
                                }`}
              style={{ borderTopColor: col.color }}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDrop={() => handleDropColumn(col.id)}
            >
              <div className="flex justify-between items-center gap-2 mb-2">
                <div className="flex gap-2 items-center">
                  <div
                    style={{ backgroundColor: col.color }}
                    className={`bg-[${col.color}] w-2 h-2 rounded-full`}
                  ></div>
                  <h2 className="font-semibold">{col.title}</h2>
                </div>
                <button
                  onClick={() => {
                    setSelectedColId(col.id);
                    setOpen(true);
                  }}
                  className="text-[#67778880] cursor-pointer text-3xl hover:text-gray-700"
                >
                  <CiCirclePlus />
                </button>
              </div>
              <div className="overflow-y-scroll scrollbar-hide h-full pr-1 custom-scrollbar">
                {col.cards.map((card, index) => (
                  <div
                    key={card._id}
                    draggable
                    onDragStart={() => handleDragStart(card._id, col.id, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDropBetween(col.id, index)}
                    onClick={() => handleCardClick(col.id, card)}
                    onTouchStart={(e) =>
                      handleTouchStart(e, card._id, col.id, index)
                    }
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className={`shadow-md rounded-md p-4 mb-3 cursor-grab transition 
                                        ${
                                          draggingCardId === card.id
                                            ? "opacity-60 border-2 border-blue-500"
                                            : "bg-white "
                                        }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {card.first_name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                          {`${card.first_name?.charAt(0).toUpperCase() || ""}${
                            card.first_name?.slice(1) || ""
                          } ${card.last_name?.charAt(0).toUpperCase() || ""}${
                            card.last_name?.slice(1) || ""
                          }`}
                        </h3>
                      </div>
                    </div>

                    <div className=" grid gap-2 mb-4 text-light">
                      <span className="flex gap-2">
                        <Mail size={16} />

                        <p className="text-light pxs">{card.email}</p>
                      </span>
                      <span className="flex gap-2">
                        <Phone size={16} />
                        <p className="text-light pxs">{card.phone}</p>
                      </span>
                      <span className="flex gap-2">
                        <Calendar size={16} />
                        <p className="text-light pxs">
                          {new Date().toLocaleDateString()}
                        </p>
                      </span>
                    </div>

                    <div className=" w-3/5 m-auto grid grid-cols-3 text-light">
                      <a
                        href={`tel:${card.phone}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <LuPhoneCall />
                      </a>
                      <a
                        href={`https://wa.me/${card.phone}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaWhatsapp />
                      </a>
                      <a
                        href={`mailto:${card.email}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <CiMail />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-3 sm:p-5">
          <Filter
            leadStatusList={leadStatus}
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
            setSelecteFilterData={setSelecteFilterData}
          />
          <ManagerList
            leadStatusList={leadStatusList}
            selecteFilterData={selecteFilterData}
            setSelectedUser={setSelectedUser}
            successMessage={successMessage}
            setSelectedColId={setSelectedColId}
          />
        </div>
      )}

      {open && (
        <CustomerAdd
          open={open}
          setOpen={setOpen}
          selectedColId={selectedColId}
          handleCardAdded={handleCardAdded}
          leadStatus={leadStatus}
        />
      )}

      {selectedUser && (
        <EditCard
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          colId={selectedColId}
          leadStatus={leadStatus}
        />
      )}

      {impodeOpen && (
        <ImportModal isOpen={impodeOpen} setImpodeOpen={setImpodeOpen} />
      )}
    </div>
  );
}
