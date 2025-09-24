import React from "react";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { Asterisk } from "lucide-react";
import clsx from "clsx";
import { Calendar } from "lucide-react";

// You MUST import the CSS for react-datepicker
import "react-datepicker/dist/react-datepicker.css";

const Datepicker = ({
  label,
  value,
  onChange,
  name,
  error,
  required,
  icon,
  dateFormat = "dd/MM/yyyy", // Default format, can be overridden by props
  ...props
}) => {
  const inputId = name || "date-picker";
  const formattedValue = value ? format(new Date(value), "yyyy-MM-dd") : "";

  // This handler creates a synthetic event object to match your existing handleChange
  const handleChange = (date) => {
    const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
    onChange({
      target: {
        name: name,
        value: formattedDate,
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
          selected={formattedValue ? formattedValue : null} // `selected` expects a Date object or null
          onChange={handleChange}
          dateFormat={dateFormat} // <-- THE KEY PROP FOR FORMATTING
          className={clsx(
            "text-light text-sm appearance-none font-normal font-heading w-full px-2 py-3 border border-gray-400 rounded-md pr-10 rounded-radius focus:outline-none focus:ring-1 focus:ring-primary",
            error ? "border-red-500" : "border-stroke"
          )}
          placeholderText="Select a date"
          autoComplete="off"
          {...props}
        />
        {icon ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </span>
        ) : (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Calendar />
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Datepicker;
