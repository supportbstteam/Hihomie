import React, { useState } from "react";
import Card from "./Card";
import { CiCirclePlus } from "react-icons/ci";
import CustomerAdd from "./CustomerAdd";
import EditCard from "./EditCard";

const Nuevos = ({ users, setUsers, columnKey, onDropCard }) => {


    const [selectedUser, setSelectedUser] = useState(null); // <-- define state here

   const [open, setOpen] = useState(false)
  const handleDragStart = (e, user) => {
    e.dataTransfer.setData("userId", user._id);
    e.dataTransfer.setData("from", columnKey);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const userId = e.dataTransfer.getData("userId");
    const from = e.dataTransfer.getData("from");
    if (userId) {
      onDropCard(userId, from, columnKey);
    }
  };

  return (
    <div
      className="min-w-[400px] h-[75vh] flex-1 rounded-xl shadow-md p-2 flex flex-col bg-[#f9f9f9]"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
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
      <section className="grid gap-4 overflow-y-scroll scrollbar-hide">
        <Card users={users} onDragStart={handleDragStart} selectedUser={selectedUser} />
      {selectedUser && (
          <EditCard
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        )}
        <CustomerAdd open={open} setOpen={setOpen} />
      </section>
    </div>
  );
};

export default Nuevos;
