"use client";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { FaTrashAlt } from "react-icons/fa"; // ✅ Import trash icon
import { t } from "@/components/translations";

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-105 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeOut" } }} // ✅ Smooth fade-out
        >
          <motion.div
            className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full text-center relative" // ✅ Wider modal
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
            exit={{
              scale: 0.8,
              opacity: 0,
              transition: { duration: 0.3, ease: "easeIn" },
            }}
          >
            {/* ✅ Delete icon at top center */}
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-4 rounded-full">
                <FaTrashAlt className="text-red-600 text-3xl" />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              {t("are_you_sure")}
            </h2>
            <p className="text-gray-600 mb-6">{t("you_want_to_delete_this")}</p>

            <div className="flex justify-center gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 cursor-pointer rounded-xl bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
              >
                {t("cancel")}
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 cursor-pointer rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
              >
                {t("delete")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDeleteModal;
