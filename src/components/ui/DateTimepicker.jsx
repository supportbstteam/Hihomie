import React from "react";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { Asterisk, Calendar } from "lucide-react";
import clsx from "clsx";

import "react-datepicker/dist/react-datepicker.css";

const DateTimepicker = ({
  label,
  value,
  onChange,
  name,
  error,
  required,
  icon,
  dateFormat = "dd/MM/yyyy h:mm aa",
  ...props
}) => {
  const inputId = name || "date-picker";

  // Convert incoming value to Date object
  const selectedDate = value ? new Date(value) : null;

  const handleChange = (date) => {
    // Save full date + time
    const formatted = date ? format(date, "yyyy-MM-dd HH:mm:ss") : "";

    onChange({
      target: {
        name: name,
        value: formatted,
      },
    });
  };

  return (
    <div className="space-y-1 rounded-radius text-black">
      <div className="flex">
        {label && (
          <label htmlFor={inputId} className="block psm text-dark">
            {label}
          </label>
        )}
        {required && <Asterisk size={12} color="#E33629" />}
      </div>

      <div className="relative">
        <DatePicker
          id={inputId}
          name={name}
          selected={selectedDate}
          onChange={handleChange}
          dateFormat={dateFormat}
          showTimeSelect                // <-- ENABLE TIME PICKER
          timeFormat="HH:mm"            // <-- 24hr format (optional)
          timeIntervals={15}            // <-- Time gap 15 mins
          className={clsx(
            "text-light text-sm appearance-none font-normal w-full px-2 py-3 border border-gray-400 rounded-md pr-10 rounded-radius focus:outline-none focus:ring-1 focus:ring-primary",
            error ? "border-red-500" : "border-stroke"
          )}
          placeholderText="Select date & time"
          autoComplete="off"
          {...props}
        />

        {/* Calendar Icon */}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {icon ? icon : <Calendar />}
        </span>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default DateTimepicker;
