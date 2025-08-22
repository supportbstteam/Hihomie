import React from "react";
import Card from "./Card";

const Rechazado = ({ users, columnKey, onDropCard }) => {
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
      <h2 className="font-semibold text-gray-800 flex items-center gap-2"> <span
                               className={`w-3 h-3 rounded-full bg-red-500`}
                           />RECHAZADO</h2>
      <section className="grid gap-4 overflow-y-scroll scrollbar-hide">
        <Card users={users} onDragStart={handleDragStart} />
      </section>
    </div>
  );
};

export default Rechazado;
