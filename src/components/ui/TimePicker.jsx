import React from "react";
import DatePicker from "react-datepicker";
import { Asterisk, Clock } from "lucide-react";
import clsx from "clsx";

import "react-datepicker/dist/react-datepicker.css";

const TimePicker = ({
  label,
  value,
  onChange,
  name,
  error,
  required,
  icon,
  placeholder = "Select time",
  timeIntervals = 15,
  ...props
}) => {
  const inputId = name || "time-picker";

  // Convert "HH:mm" string → Date object (react-datepicker needs a Date)
  const selectedTime = (() => {
    if (!value) return null;
    const [h, m] = value.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  })();

  const handleChange = (date) => {
    if (!date) {
      onChange({ target: { name, value: "" } });
      return;
    }
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    onChange({ target: { name, value: `${hours}:${minutes}` } });
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
          selected={selectedTime}
          onChange={handleChange}
          showTimeSelect
          showTimeSelectOnly          // ← hides the calendar, shows only time
          timeIntervals={timeIntervals}
          timeFormat="HH:mm"
          dateFormat="HH:mm"
          className={clsx(
            "text-light text-sm appearance-none font-normal w-full px-2 py-3 border border-gray-400 rounded-md pr-10 rounded-radius focus:outline-none focus:ring-1 focus:ring-primary",
            error ? "border-red-500" : "border-stroke"
          )}
          placeholderText={placeholder}
          autoComplete="off"
          {...props}
        />

        {/* Clock Icon */}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {icon ? icon : <Clock size={18} />}
        </span>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default TimePicker;