"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { LuUser, LuSettings, LuLogOut, LuChevronDown } from "react-icons/lu";
import { signOut } from "next-auth/react";

const ProfileDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <div
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="hidden sm:flex flex-col leading-tight text-right">
          <span className="text-sm font-semibold text-gray-800 group-hover:text-green-600 transition">
            {user.name}
          </span>
          <span className="text-xs text-gray-500 truncate max-w-[140px]">
            {user.email}
          </span>
        </div>
        <LuChevronDown
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-999 overflow-hidden"
          >
            <li className="border-b border-gray-100">
              <Link
                href="/dashboard/manager/profile"
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                onClick={() => setIsOpen(false)}
              >
                <LuUser className="text-lg text-gray-400" />
                Profile
              </Link>
            </li>
            {user.role === "admin" && (
              <li className="border-b border-gray-100">
                <Link
                  href="/dashboard/setting"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                  onClick={() => setIsOpen(false)}
                >
                  <LuSettings className="text-lg text-gray-400" />
                  Settings
                </Link>
              </li>
            )}
            <li>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition font-medium"
              >
                <LuLogOut className="text-lg" />
                Logout
              </button>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
