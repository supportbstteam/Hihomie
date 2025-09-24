"use client";

import React, { useState, useEffect } from "react";
import { FaFileExcel, FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Icon from "../ui/Icon";
import Datepicker from "../ui/Datepicker";
import { X } from "lucide-react";
import { Button } from "../ui/Button";
import useUserFromSession from "@/lib/useUserFromSession";
import DropDown from "../ui/DropDown";
import { t } from "@/components/translations";

const ExportModal = ({ isOpen, setExportOpen }) => {
    const user = useUserFromSession();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch("/api/team");
            const { data } = await response.json();
            setUsers(data);
        };
        fetchUsers();
    }, []);

    const [formData, setFormData] = useState({
        from_date: "",
        to_date: "",
        user_id: user?.id,
        user_role: user?.role,
        selected_user: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleExport = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/setting/download", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                // Handle non-successful responses, e.g., show an error message
                throw new Error('Network response was not ok');
            }

            // Get the data as a Blob
            const blob = await response.blob();

            // Create a temporary URL for the Blob
            const url = window.URL.createObjectURL(blob);

            // Create a temporary link element
            const a = document.createElement("a");
            a.href = url;
            a.download = "data-export.xlsx"; // Set the download file name

            // Append the link to the body and click it to trigger the download
            document.body.appendChild(a);
            a.click();

            // Clean up by removing the link and revoking the URL
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
            // You could add logic here to show a user-facing error message
        } finally {
            setIsLoading(false); // Stop the loader, regardless of success or failure
        }
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
                        className="bg-white w-[40%] rounded-lg py-6 pl-4 pr-2 relative"
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
                                onClick={() => setExportOpen(false)}
                            />
                        </div>

                        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 ml-4">
                            <FaFileExcel size={30} className="text-green-500" />
                            Export Leads
                        </h2>

                        <div className="flex flex-col justify-center space-x-4 mb-4">
                            <div className="grid grid-cols-1 mx-4 py-4">
                                {user.role == "admin" && <DropDown
                                    label={t("select_user")}
                                    placeholder={t("select_user")}
                                    name="selected_user"
                                    value={formData.selected_user}
                                    onChange={handleChange}
                                    title={t("select_user")}
                                    options={users.map((item) => ({
                                        value: item._id,
                                        label: item.name,
                                    }))}
                                />}
                            </div>

                            <div className="grid grid-cols-2 gap-6 mx-4">
                                <Datepicker
                                    label={t("from_date")}
                                    placeholder={t("from_date")}
                                    name="from_date"
                                    value={formData.from_date}
                                    onChange={handleChange}
                                    dateFormat="dd/MM/yyyy"
                                />
                                <Datepicker
                                    label={t("to_date")}
                                    placeholder={t("to_date")}
                                    name="to_date"
                                    value={formData.to_date}
                                    onChange={handleChange}
                                    dateFormat="dd/MM/yyyy"
                                />
                            </div>
                        </div>

                        {isLoading && <div className="flex justify-center items-center rounded-lg bg-green-100 mx-4 p-4 ">
                            <span className="mr-10"><p>Import in progress: We are currently processing your Excel sheet.</p></span>
                            <FaSpinner className="ml-2 animate-spin" size={30} />
                        </div>}

                        <div className="flex justify-end space-x-2 mx-4 mt-6">
                            <Button variant="outline" onClick={() => setExportOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleExport} disabled={isLoading}>
                                {isLoading ? 'Exporting...' : 'Export'}
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ExportModal;
