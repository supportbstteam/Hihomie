"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditCard from "@/components/prospects/EditCard";
import { get_leadStatusData } from "@/store/setting";

export default function LeadEditPage({ params }) {
//   const { cardId, colId } = params;  destructure both dynamic segments

   const { cardId, colId } = React.use(params);

  const dispatch = useDispatch();
  const { leadStatus } = useSelector((state) => state.setting);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedColId, setSelectedColId] = useState(colId);

  useEffect(() => {
    dispatch(get_leadStatusData());
  }, [dispatch]);

  useEffect(() => {
    if (leadStatus && leadStatus.length) {
      for (const status of leadStatus) {
        const card = status.cards.find((c) => c._id === cardId);
        if (card) {
          setSelectedUser(card);
          setSelectedColId(status._id);
          break;
        }
      }
    }
  }, [leadStatus, cardId]);

  if (!selectedUser) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Editar cliente potencial</h1>
      <EditCard
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        colId={selectedColId}
        leadStatus={leadStatus}
      />
    </div>
  );
}
