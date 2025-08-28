'use client'
import React, { useState, useEffect } from 'react'
import TextEditor from '../TextEditor'

const Form1 = ({ setDetailsData, selectedUser }) => {

    const [detailsData, setLocalDetailsData] = useState({
        source: "Yellow & Pages",
        category: "Default",
        tag: "High",
        last_connected: "",
        notes: "",
    });

    // ✅ Jab selectedUserData aaye to local state update karo
    useEffect(() => {
        if (selectedUser) {
            setLocalDetailsData({
                source: selectedUser.source || "Yellow & Pages",
                category: selectedUser.category || "Default",
                tag: selectedUser.tag || "High",
                last_connected: selectedUser.last_connected || "",
                notes: selectedUser.notes || "",
            });

            // Parent me bhi update bhej do
            setDetailsData({
                source: selectedUser.source || "Yellow & Pages",
                category: selectedUser.category || "Default",
                tag: selectedUser.tag || "High",
                last_connected: selectedUser.last_connected || "",
                notes: selectedUser.notes || "",
            });
        }
    }, [selectedUser, setDetailsData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalDetailsData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setDetailsData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-1 w-full mb-5">
                <label className="text-gray-700 font-medium text-sm">Notes</label>
                <div className="w-full">
                    <TextEditor
                        className="min-h-[150px]"
                        name="notes"
                        value={detailsData.notes}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <label className="w-32 text-gray-700 font-medium text-sm">Source</label>
                <select
                    name="source"
                    className="flex-1 p-1 bg-white border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                    value={detailsData.source}
                    onChange={handleChange}
                    required
                >
                    <option value="Yellow & Pages">Yellow & Pages</option>
                    <option value="Yahoo">Yahoo</option>
                    <option value="Google Places">Google Places</option>
                    <option value="Facebook Ads">Facebook Ads</option>
                </select>
            </div>

            <div className="flex items-center gap-3">
                <label className="w-32 text-gray-700 font-medium text-sm">Category</label>
                <select
                    name="category"
                    className="flex-1 p-1 bg-white border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                    value={detailsData.category}
                    onChange={handleChange}
                    required
                >
                    <option value="Default">Default</option>
                    <option value="Application Development">Application Development</option>
                    <option value="Graphic Design">Graphic Design</option>
                </select>
            </div>

            <div className="flex items-center gap-3">
                <label className="w-32 text-gray-700 font-medium text-sm">Tags</label>
                <select
                    name="tag"
                    className="flex-1 p-1 bg-white border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                    value={detailsData.tag}
                    onChange={handleChange}
                    required
                >
                    <option value="High">High</option>
                    <option value="Joomla">Joomla</option>
                    <option value="Logo Design">Logo Design</option>
                    <option value="Web Design">Web Design</option>
                    <option value="wordpress">wordpress</option>
                </select>
            </div>

            <div className="flex items-center gap-3">
                <label className="w-32 text-gray-700 font-medium text-sm">Last Contacted</label>
                <input
                    type="Date"
                    className="flex-1 p-1 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                    name="last_connected"
                    value={detailsData.last_connected}
                    onChange={handleChange}
                    required
                />
            </div>

            <hr />
        </div>
    )
}

export default Form1
