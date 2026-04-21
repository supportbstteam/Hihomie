"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { create_estate_lead, messageClear } from "@/store/estate";
import Input from "@/components/ui/Input";
import Dropdown from "@/components/ui/DropDown";
import Datepicker from "@/components/ui/Datepicker";

const CreateContact = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { loader, successMessage, errorMessage, successTag } = useSelector(
    (state) => state.estate,
  );

  const initialState = {
    lead_id: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    rent_or_sale: "",
    registration_date: "",
    capturer: "",
    assigned_agent: "",
    source_channel: "",
    lead_status: "",
    last_contact: "",
    last_contact_result: "",
    next_call: "",
    days_since_last_contact: "",
    days_until_next_call: "",
    follow_up_overdue: false,
    sale_price: "",
    fees: "",
    observations: "",
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    const runOnLoad = async () => {
      try {
        const response = await fetch("/api/estate/leads/increment", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          lead_id: data,
        }));

        console.log("API Response inside useEffect:", data); // ✅ works here
      } catch (error) {
        console.error("API GET Error:", error);
      }
    };

    runOnLoad();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      if (successTag === "ESTATE_LEAD_CREATED") {
        router.push("/estate/lead");
      }
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, router, successTag]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(create_estate_lead(formData));
  };

  return (
    <div className="w-full bg-white shadow-md">
      <div className="border-b px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-800">Create New Contact</h2>
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        {/* --- Category: Basic Information --- */}
        <div className="border-b border-gray-200">
          <div className="bg-gray-50 px-6 py-3">
            <h3 className="text-lg font-semibold text-gray-700">
              Basic Information
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-6">
            <div className="flex flex-col">
              <Input
                id="lead_id"
                label="Lead ID"
                name="lead_id"
                type="text"
                value={formData.lead_id}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <Input
                id="name"
                label="Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col">
              <Input
                id="phone"
                label="Phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col">
              <Input
                id="address"
                label="Address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <Input
                id="city"
                label="City"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <Dropdown
                id="rent_or_sale"
                label="Rent or Sale"
                name="rent_or_sale"
                options={[
                  { label: "----------", value: "" },
                  { label: "Rent", value: "Rent" },
                  { label: "Sale", value: "Sale" },
                  { label: "Both", value: "Both" },
                ]}
                value={formData.rent_or_sale}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* --- Category: Assignment & Source --- */}
        <div className="border-b border-gray-200">
          <div className="bg-gray-50 px-6 py-3">
            <h3 className="text-lg font-semibold text-gray-700">
              Assignment & Source
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-6">
            <div className="flex flex-col">
              <Datepicker
                name="registration_date"
                label="Registration Date"
                value={formData.registration_date}
                onChange={handleChange}
                dateFormat="dd/MM/yyyy"
                className="text-light text-sm appearance-none font-normal w-full px-2 py-3 border border-gray-400 rounded-md pr-10 rounded-radius focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col">
              <Input
                id="capturer"
                label="Capturer"
                name="capturer"
                type="text"
                value={formData.capturer}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <Input
                id="assigned_agent"
                label="Assigned Agent"
                name="assigned_agent"
                type="text"
                value={formData.assigned_agent}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <Input
                id="source_channel"
                label="Source / Channel"
                name="source_channel"
                type="text"
                value={formData.source_channel}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* --- Category: Tracking & Status --- */}
        <div className="border-b border-gray-200">
          <div className="bg-gray-50 px-6 py-3">
            <h3 className="text-lg font-semibold text-gray-700">
              Tracking & Status
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-6">
            <div className="flex flex-col">
              <Input
                id="lead_status"
                label="Lead Status"
                name="lead_status"
                type="text"
                value={formData.lead_status}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <Datepicker
                name="last_contact"
                label="Last Contact"
                value={formData.last_contact}
                onChange={handleChange}
                dateFormat="dd/MM/yyyy"
                className="text-light text-sm appearance-none font-normal w-full px-2 py-3 border border-gray-400 rounded-md pr-10 rounded-radius focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col">
              <Input
                id="last_contact_result"
                label="Last Contact Result"
                name="last_contact_result"
                type="text"
                value={formData.last_contact_result}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <Datepicker
                name="next_call"
                label="Next Call"
                value={formData.next_call}
                onChange={handleChange}
                dateFormat="dd/MM/yyyy"
                className="text-light text-sm appearance-none font-normal w-full px-2 py-3 border border-gray-400 rounded-md pr-10 rounded-radius focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col">
              <Input
                id="days_since_last_contact"
                label="Days since last contact"
                name="days_since_last_contact"
                type="number"
                value={formData.days_since_last_contact}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <Input
                id="days_until_next_call"
                label="Days until next call"
                name="days_until_next_call"
                type="number"
                value={formData.days_until_next_call}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="follow_up_overdue"
                className="mb-2 text-sm font-medium text-gray-700"
              >
                Follow-up Overdue
              </label>
              <div className="flex items-center mt-2">
                <input
                  id="follow_up_overdue"
                  name="follow_up_overdue"
                  type="checkbox"
                  checked={formData.follow_up_overdue}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-600">Yes, overdue</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Category: Financials --- */}
        <div className="border-b border-gray-200">
          <div className="bg-gray-50 px-6 py-3">
            <h3 className="text-lg font-semibold text-gray-700">Financials</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-6">
            <div className="flex flex-col">
              <Input
                id="sale_price"
                label="Sale Price"
                name="sale_price"
                type="number"
                value={formData.sale_price}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <Input
                id="fees"
                label="Fees"
                name="fees"
                type="number"
                value={formData.fees}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* --- Category: Notes --- */}
        <div className="border-b border-gray-200">
          <div className="bg-gray-50 px-6 py-3">
            <h3 className="text-lg font-semibold text-gray-700">Notes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-6">
            <div className="flex flex-col md:col-span-2 lg:col-span-3">
              <label
                htmlFor="observations"
                className="mb-2 text-sm font-medium text-gray-700"
              >
                Observations
              </label>
              <textarea
                id="observations"
                name="observations"
                value={formData.observations}
                onChange={handleChange}
                rows="3"
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-4">
          <button
            type="submit"
            disabled={loader}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-150 disabled:opacity-50"
          >
            {loader ? "Saving..." : "Save Contact"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateContact;
