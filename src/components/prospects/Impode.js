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
import Icon from "../ui/Icon";
import { X } from "lucide-react";
import { Button } from "../ui/Button";

const ImportModal = ({ isOpen, setImpodeOpen }) => {
  const [successRows, setSuccessRows] = useState([]);
  const [errorRows, setErrorRows] = useState([]);
  const [showResults, setShowResults] = useState(false);

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
      .then((payload) => {
        const results = payload?.results ?? [];
        const success = [];
        let errors = [];
        for (const item of results) {
          if (item?.errors) {
            item.errors.map((errorMessage) => {
              errors.push(`Row ${item.row} ${errorMessage}`);
            });
          } else {
            success.push(item?.message);
          }
        }
        console.log(success, errors);
        setSuccessRows(success);
        setErrorRows(errors);
        setShowResults(true);
        toast.success("File uploaded successfully");
        dispatch(get_leadStatusDataForList({page: 1}));
        dispatch(get_leadStatusData());
        setFile(null);
        // setImpodeOpen(false);
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
            className="bg-white w-[40%] max-h-[85vh] overflow-y-auto rounded-lg p-6 relative"
            initial={{ y: "-100vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100vh", opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
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
              {/* <div className="flex flex-col items-center p-4 border rounded cursor-pointer hover:bg-gray-100">
                <FaFileCsv size={40} className="text-gray-500" />
                <span className="mt-2 text-sm font-medium">CSV</span>
              </div> */}
              <div className="flex flex-col items-center p-4 border rounded cursor-pointer hover:bg-gray-100">
                <FaFileExcel size={40} className="text-green-500" />
                <span className="mt-2 text-sm font-medium">XLS</span>
              </div>
            </div>

            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded h-32 cursor-pointer hover:bg-gray-50 mb-4"
            >
              <span>
                {file
                  ? file.name
                  : "Drop a single file or click to upload (XLS)"}
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
              <a href="/xlsx-sample.xlsx" className="text-blue-500 underline">
                Excel File Sample
              </a>
            </p>
            {/* RESULTS PANEL */}
            {
              showResults && (
                <div className="mt-4 border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">
                      Import Results —{" "}
                      <span className="text-sm text-gray-600">
                        {successRows.length} succeeded, {errorRows.length} failed
                      </span>
                    </h3>

                    <div className="space-x-2">
                      <button
                        onClick={() => {
                          setSuccessRows([]);
                          setErrorRows([]);
                          setShowResults(false);
                        }}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded text-sm"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="mb-2 font-medium">Successes</div>
                      <div className="max-h-48 overflow-auto border rounded p-2 bg-green-50">
                        {successRows.length === 0 ? (
                          <div className="text-sm text-gray-600">No successful rows</div>
                        ) : (
                          <ul className="text-sm">
                            {successRows.map((s, i) => (
                              <li key={i} className="mb-1">
                                {s}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 font-medium">Errors</div>
                      <div className="max-h-48 overflow-auto border rounded p-2 bg-red-50">
                        {errorRows.length === 0 ? (
                          <div className="text-sm text-gray-600">No errors</div>
                        ) : (
                          <ul className="text-sm">
                            {errorRows.map((e, idx) => (
                              <li key={idx} className="mb-1">
                                <div>
                                  {e}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImportModal;
