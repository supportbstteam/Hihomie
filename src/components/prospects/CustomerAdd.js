'use client'

import { useDispatch, useSelector } from 'react-redux';
import { customerAdd, messageClear } from '@/store/customer';
import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react'
import { get_leadStatusData } from '@/store/setting';
import Form1 from './Form1';
import Form2 from './Form2';

const CustomerAdd = ({ open, setOpen, selectedColId, leadStatus }) => {
    const dispatch = useDispatch();
    const { loader, successMessage, errorMessage } = useSelector(state => state.customer);
    const [details, setDetails] = useState(false);
    const [address_details, setAddressDetails] = useState(false);
    const [detailsData, setDetailsData] = useState({});
    const [addressDetailsData, setAddressDetailsData] = useState({});

    const [formData, setFormData] = useState({
        lead_title: "",
        surname: "",
        first_name: "",
        last_name: "",
        company: "",
        designation: "",
        phone: "",
        email: "",
        lead_value: "",
        assigned: "",
        status: "New",
        type_of_opration: "First Home",
        customer_situation: "Want Information",
        purchase_status: "Still Looking",
        commercial_notes: "",
        manager_notes: "",
        detailsData: {},
        addressDetailsData: {},
        selectedColId: selectedColId,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleToggle = (e) => {
        setDetails(e.target.checked); // ON → true, OFF → false
    };

    const handleToggleAddress = (e) => {
        setAddressDetails(e.target.checked); // ON → true, OFF → false
    };

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            selectedColId: selectedColId || ""
        }));
    }, [selectedColId]);

    // 🔑 sync detailsData and addressDetailsData into formData
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            detailsData: detailsData,
        }));
    }, [detailsData]);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            addressDetailsData: addressDetailsData,
        }));
    }, [addressDetailsData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(customerAdd(formData))
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            setOpen(false)
            dispatch(messageClear());
            dispatch(get_leadStatusData());
        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear());
        }
    }, [errorMessage, successMessage])




    return (
        <div>
            {open && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] px-4">
                    <div className="bg-white w-full max-w-[40%] mx-auto rounded-xl shadow-2xl p-6 md:p-8 relative overflow-y-auto ">

                        {/* Close Button */}
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
                        >
                            ✕
                        </button>

                        <p className="text-gray-700 text-[20px] mb-6">Add A New Lead</p>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4 mb-5 overflow-y-auto max-h-[77vh]">

                            {/* Lead Title */}
                            <div className="flex items-center gap-3">
                                <label className="w-32 text-gray-700 font-medium text-sm">Lead Title*</label>
                                <input
                                    type="text"
                                    className="flex-1 p-1 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                                    name="lead_title"
                                    value={formData.lead_title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-3">
                                <label className="w-32 text-gray-700 font-medium text-sm">Surname</label>
                                <select
                                    name="surname"
                                    className="flex-1 p-1 bg-white border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                                    value={formData.surname}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">--Select Surname--</option>
                                    <option value="Mr.">Mr.</option>
                                    <option value="Mrs.">Mrs.</option>
                                </select>
                            </div>

                            {/* First Name */}
                            <div className="flex items-center gap-3">
                                <label className="w-32 text-gray-700 font-medium text-sm">First Name*</label>
                                <input
                                    type="text"
                                    className="flex-1 p-1 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Last Name */}
                            <div className="flex items-center gap-3">
                                <label className="w-32 text-gray-700 font-medium text-sm">Last Name*</label>
                                <input
                                    type="text"
                                    className="flex-1 p-1 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="w-32 text-gray-700 font-medium text-sm">Company</label>
                                <input
                                    type="text"
                                    className="flex-1 p-1 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="w-32 text-gray-700 font-medium text-sm">Designation</label>
                                <input
                                    type="text"
                                    className="flex-1 p-1 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Telephone */}
                            <div className="flex items-center gap-3">
                                <label className="w-32 text-gray-700 font-medium text-sm">Telephone</label>
                                <input
                                    type="text"
                                    className="flex-1 p-1 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Email */}
                            <div className="flex items-center gap-3">
                                <label className="w-32 text-gray-700 font-medium text-sm">Email Address</label>
                                <input
                                    type="email"
                                    className="flex-1 p-1 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Lead Value */}
                            <div className="flex items-center gap-3">
                                <label className="w-32 text-gray-700 font-medium text-sm">Lead Value ($)</label>
                                <input
                                    type="number"
                                    className="flex-1 p-1 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                                    name="lead_value"
                                    value={formData.lead_value}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Assigned */}
                            <div className="flex items-center gap-3">
                                <label className="w-32 text-gray-700 font-medium text-sm">Assigned</label>
                                <input
                                    type="text"
                                    className="flex-1 p-1 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                                    name="assigned"
                                    value={formData.assigned}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-3">
                                <label className="w-32 text-gray-700 font-medium text-sm">Status*</label>
                                <select
                                    name="status"
                                    className="flex-1 p-1 bg-white border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                >

                                    {leadStatus.map((item, i) =>
                                        <option value={`${item.status_name}`} key={i}>{item.status_name}</option>
                                    )}


                                </select>
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="w-32 text-gray-700 font-medium text-sm">Type of Operation</label>
                                <select
                                    name="type_of_opration"
                                    className="flex-1 p-1 bg-white border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                                    value={formData.type_of_opration}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="First Home">First Home</option>
                                    <option value="Second Home">Second Home</option>
                                    <option value="Investment">Investment</option>
                                    <option value="Surrogacy">Surrogacy</option>
                                    <option value="Refinancing">Refinancing</option>


                                </select>
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="w-32 text-gray-700 font-medium text-sm">Customer Situation</label>
                                <select
                                    name="customer_situation"
                                    className="flex-1 p-1 bg-white border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                                    value={formData.customer_situation}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="Want Information">Want Information</option>
                                    <option value="It will take time">It will take time</option>
                                    <option value="Urgent">Urgent</option>
                                    <option value="Evaluating">Evaluating</option>
                                    <option value="Decided">Decided</option>


                                </select>
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="w-32 text-gray-700 font-medium text-sm">Purchase Status</label>
                                <select
                                    name="purchase_status"
                                    className="flex-1 p-1 bg-white border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                                    value={formData.purchase_status}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="Want Information">Still Looking</option>
                                    <option value="Selected Housing">Selected Housing</option>
                                    <option value="Proprietary">Proprietary</option>


                                </select>
                            </div>

                            <section className="bg-gray-50 p-4 rounded-md border">
                                <h3 className="text-base font-semibold text-gray-800 mb-4">
                                    Notes and Observations
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            htmlFor="commercial_notes"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Commercial Notes
                                        </label>
                                        <textarea
                                            id="commercial_notes"
                                            name="commercial_notes"
                                            rows="4"
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none text-sm"
                                            placeholder="Escribe tus notas comerciales..."
                                            defaultValue={formData.commercial_notes}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="manager_notes"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Manager&apos;s Notes
                                        </label>
                                        <textarea
                                            id="manager_notes"
                                            name="manager_notes"
                                            rows="4"
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none text-sm"
                                            placeholder="Manager's remarks..."
                                            defaultValue={formData.manager_notes}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>
                                </div>
                            </section>


                            {/* Automatic Toggle */}
                            <div className="flex items-center justify-between mt-2">
                                <span className="w-32 font-medium text-gray-700 text-sm">Details</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        name="details"
                                        checked={details}
                                        onChange={handleToggle}
                                    />
                                    {/* Outer background */}
                                    <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-green-600 transition-colors"></div>
                                    {/* Inner circle */}
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></div>
                                </label>
                            </div>

                            {/* detaisl section start */}

                            {details &&

                                <Form1 setDetailsData={setDetailsData} />

                            }


                            {/* Automatic Toggle */}
                            <div className="flex items-center justify-between mt-2">
                                <span className="font-medium text-gray-700 text-sm">Address & Organisation Details</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        name="address_details"
                                        checked={address_details}
                                        onChange={handleToggleAddress}
                                    />
                                    {/* Outer background */}
                                    <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-green-600 transition-colors"></div>
                                    {/* Inner circle */}
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></div>
                                </label>
                            </div>

                            {address_details &&

                                <Form2 setAddressDetailsData={setAddressDetailsData} />

                            }

                            {/* Buttons */}
                            <div className="flex gap-3 justify-end">
                                <button
                                    type="reset"
                                    className="px-6 py-2 border rounded-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() =>
                                        setFormData({
                                            lead_title: "",
                                            first_name: "",
                                            last_name: "",
                                            phone: "",
                                            email: "",
                                            lead_value: "",
                                            assigned: "",
                                            status: "New",
                                            automatic: false,
                                        })
                                    }
                                >
                                    Reset
                                </button>
                                <button
                                    disabled={loader}
                                    type="submit"
                                    className="px-6 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700"
                                >
                                    {loader ? "Loading..." : "Submit"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CustomerAdd;
