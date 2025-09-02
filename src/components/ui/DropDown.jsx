import React from "react";
import clsx from "clsx";
import { Asterisk } from "lucide-react";

const Dropdown = ({
  label,
  options,
  value,
  onChange,
  error,
  name,
  className,
  title,
  required,
  size = "md",
}) => {
  const sizeStyles = {
    md: "text-sm py-2",
    xl: "text-base py-3",
    xxl: "text-base md:text-[22px] py-2 md:py-4 font-medium",
  };

  const selectId = name || "dropdown";

  return (
    <div className={clsx("space-y-1 rounded-radius text-black", className)}>
      <div className="flex">
        {label && (
          <label htmlFor={selectId} className="block psm text-dark">
            {label}
          </label>
        )}
        {required ? <Asterisk size={12} color="#E33629" /> : ""}
      </div>
      <div className="relative">
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={clsx(
            "text-gray-900 appearance-none font-heading w-full px-4 border pr-10 rounded-radius focus:outline-none focus:ring-2 focus:ring-primary overflow-hidden",
            error ? "border-red-500" : "border-gray-300",
            sizeStyles[size],
            className
          )}
        >
          {title && (
            <option value="" disabled className="text-gray-900">
              {title}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-gray-900">
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom SVG arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg
            className="w-5 h-5 text-light"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="text-base text-red-500">{error}</p>}
    </div>
  );
};

export default Dropdown;
