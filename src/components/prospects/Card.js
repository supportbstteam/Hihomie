import React, { useState } from "react";
import { FaCalendarAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import EditCard from "./EditCard";
import { format } from "date-fns";

const Card = ({ users, onDragStart }) => {
  const [selectedUser, setSelectedUser] = useState(null); // popup ke liye user store karne ke liye

  const handleCardClick = (user) => {
    setSelectedUser(user); // jis user pe click hua uska data popup me dikhayenge
  };

  const closePopup = () => {
    setSelectedUser(null);
  };

  return (
    <>
      {users.map((user, i) => (
        <div
          key={i}
          className="h-fit shadow rounded-lg p-4 hover:shadow transition bg-white cursor-pointer"
          draggable
          onDragStart={(e) => onDragStart(e, user, i)}
          onClick={() => handleCardClick(user)} // card click event
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
              {user.first_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl text-[#071437]">
                {user.first_name} {user.last_name}
              </h3>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-gray-400" /> {user.email}
            </div>
            <div className="flex items-center gap-2">
              <FaPhone className="text-gray-400" /> {user.phone}
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-400" /> {format(new Date(user.createdAt), "MMM dd, yyyy")}
            </div>
          </div>

          {/* Finance Box */}
          <div className="border border-green-400 rounded-md p-3 mt-3 flex justify-between text-sm text-gray-700">
            <div>
              📈 <span className="font-medium text-green-600">Ingresos</span>
              <p>4.500 € / mes</p>
            </div>
            <div>
              💰 <span className="font-medium text-green-600">%Hipoteca</span>
              <p>280.000 €</p>
            </div>
          </div>
        </div>
      ))}

      {/* Popup for editing */}
      {selectedUser && (
        <EditCard
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          closePopup={closePopup}
        />
      )}
    </>
  );
};

export default Card;
