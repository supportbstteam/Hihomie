import React from "react";
import clsx from "clsx";

const Input = ({ label, error, className, ...props }) => {
  return (
    <div className="space-y-1">
      {label && <label className="block text-base font-medium">{label}</label>}
      <input
        className={clsx(
          "w-full px-4 py-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500",
          error ? "border-red-500" : "border-gray-300",
          className
        )}
        {...props}
      />
      {error && <p className="text-base text-red-500">{error}</p>}
    </div>
  );
};

export default Input