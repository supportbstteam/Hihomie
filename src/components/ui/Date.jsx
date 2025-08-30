import { CalendarDays } from "lucide-react";
import React from "react";
import { SlCalender } from "react-icons/sl";

const Date = () => {
  return (
    <div className="flex items-center justify-center gap-3 border border-stock px-4 py-2 rounded-radius cursor-pointer hover:bg-gray-50">
      <span className="psm text-[#99A1B7]" >15 dic 2024 - 8 jun 2025</span>
      <CalendarDays  color="#99A1B7" size={16} />
      {/* <CalendarDays /> */}
    </div>
  );
};

export default Date;
