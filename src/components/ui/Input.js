import React from "react";
import clsx from "clsx";
import { Asterisk } from "lucide-react";

const Input = ({ label, error, className,required, ...props }) => {
  return (
    <div className="space-y-1">
      <div className="flex ">
      {label && <label className="block psm text-dark">{label}</label>} {required ? <Asterisk size={12} color="#E33629" /> : ""}
      </div>
      <input
        className={clsx(
          "w-full psm px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-primary",
          error ? "border-red-500" : "border-stroke",
          className
        )}
        {...props}
      />
      {error && <p className="text-base text-red-500">{error}</p>}
    </div>
  );
};

export default Input