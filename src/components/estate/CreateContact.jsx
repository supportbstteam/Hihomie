"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { create_estate_contact, messageClear } from "@/store/estate";
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
    contact_id: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    assigned_agent: "",
    source_channel: "",
    contact_status: "",
    observations: "",
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    const runOnLoad = async () => {
      try {
        const response = await fetch("/api/estate/contacts/increment", {
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
          contact_id: data,
        }));

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
      if (successTag === "ESTATE_CONTACT_CREATED") {
        router.push("/estate/contact");
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
    dispatch(create_estate_contact(formData));
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
                id="contact_id"
                label="Contact ID"
                name="contact_id"
                type="text"
                value={formData.contact_id}
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
                id="email"
                label="Email"
                name="email"
                type="email"
                value={formData.email}
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

            <div className="flex flex-col">
              <Input
                id="contact_status"
                label="Contact Status"
                name="contact_status"
                type="text"
                value={formData.contact_status}
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
