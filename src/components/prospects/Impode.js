"use client";

import React, { useState } from "react";
import { FaFileCsv, FaFileExcel } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import {
  get_leadStatusData,
  get_leadStatusDataForList,
  upload_file,
} from "@/store/setting";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import { X } from "lucide-react";

const ImportModal = ({ isOpen, setImpodeOpen }) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!validTypes.includes(selectedFile.type)) {
      alert("Please upload a CSV or Excel file");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) return alert("No file selected");

    // Dispatch upload action
    dispatch(upload_file(file))
      .unwrap() // ensures we can use then/catch
      .then(() => {
        toast.success("File uploaded successfully");
        dispatch(get_leadStatusDataForList());
        dispatch(get_leadStatusData());
        setFile(null);
        setImpodeOpen(false);
      })
      .catch(() => {
        toast.error("Upload failed. Try again.");
      });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-106"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <motion.div
            className="bg-white w-[40%] rounded-lg p-6 relative"
            initial={{ y: "-100vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100vh", opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setImpodeOpen(false)}
            >
              ✕
            </button> */}
            <div className="absolute top-4 right-4 ">
              <Icon
                icon={X}
                size={20}
                variant="primary"
                onClick={() => setImpodeOpen(false)}
              />
            </div>

            <h2 className="text-lg font-semibold mb-4">Import Leads</h2>

            <div className="flex justify-center space-x-4 mb-4">
              <div className="flex flex-col items-center p-4 border rounded cursor-pointer hover:bg-gray-100">
                <FaFileCsv size={40} className="text-gray-500" />
                <span className="mt-2 text-sm font-medium">CSV</span>
              </div>
              <div className="flex flex-col items-center p-4 border rounded cursor-pointer hover:bg-gray-100">
                <FaFileExcel size={40} className="text-green-500" />
                <span className="mt-2 text-sm font-medium">XLSX</span>
              </div>
            </div>

            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded h-32 cursor-pointer hover:bg-gray-50 mb-4"
            >
              <span>
                {file
                  ? file.name
                  : "Drop a single file or click to upload (CSV or XLSX)"}
              </span>
              <input
                id="file-upload"
                type="file"
                accept=".csv, .xlsx, .xls"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setImpodeOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload}>Upload</Button>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              You can download sample importing files below <br />
              <a href="/csv-sample.csv" className="text-blue-500 underline">
                CSV Sample
              </a>{" "}
              |{" "}
              <a href="/xlsx-sample.xlsx" className="text-blue-500 underline">
                XLSX Sample
              </a>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImportModal;
