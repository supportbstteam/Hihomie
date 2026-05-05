"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { create_agenda, messageClear } from "@/store/estateAgenda";
import Input from "@/components/ui/Input";
import Dropdown from "@/components/ui/DropDown";
import Datepicker from "@/components/ui/Datepicker";
import TimePicker from "@/components/ui/TimePicker"; // ← replaces DateTimePicker for time fields

const CreateAgenda = ({ users = [], properties = [], contacts = [] }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { loader, successMessage, errorMessage, successTag } = useSelector(
    (state) => state.estateAgenda,
  );

  const [formData, setFormData] = useState({
    title: "",
    type: "Visit",
    date: "",
    startTime: "",
    endTime: "",
    responsible: "",
    contact: "",
    property: "",
    observations: "",
  });

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      if (successTag === "AGENDA_CREATED") {
        router.push("/estate/agenda");
      }
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, router, successTag]);

  const handleChange = (e) => {
    const name = e.target?.name || e.name;
    const value = e.target?.value ?? e.value ?? e;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.date ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.responsible
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    dispatch(create_agenda(formData));
  };

  const typeOptions = [
    { label: "Visit", value: "Visit" },
    { label: "Call", value: "Call" },
    { label: "Meeting", value: "Meeting" },
  ];

  return (
    <div className="flex w-full flex-col bg-white font-sans min-h-screen">
      {/* Page Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-800">Schedule a task</h2>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col md:flex-row w-full bg-white">
        <div className="flex flex-1 flex-col gap-5 p-6 border-r border-gray-100">
          <form
            onSubmit={handleSave}
            className="flex flex-1 flex-col gap-5 p-6 border-r border-gray-100"
          >
            <Input
              label="Task Title"
              name="title"
              placeholder="Task title"
              value={formData.title}
              onChange={handleChange}
            />

            <Dropdown
              label="Type of Task"
              name="type"
              title="Select Task type"
              options={typeOptions}
              value={formData.type}
              onChange={handleChange}
            />

            {/* Date and Time Row */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <Datepicker
                  label="Date"
                  name="date"
                  placeholder="Date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              {/* ← TimePicker instead of DateTimePicker */}
              <div className="flex-1">
                <TimePicker
                  label="Start Time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* ← TimePicker instead of DateTimePicker */}
              <div className="flex-1">
                <TimePicker
                  label="End Time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Dropdown
              label="Responsible"
              name="responsible"
              title="Select Responsible person"
              value={formData.responsible}
              onChange={handleChange}
              options={users.map((user) => ({
                label: user.name + (user.lname ? " " + user.lname : ""),
                value: user._id,
              }))}
            />

            <Dropdown
              label="Contact"
              name="contact"
              title="Select contact"
              value={formData.contact}
              onChange={handleChange}
              options={contacts.map((contact) => ({
                label: contact.name,
                value: contact._id,
              }))}
            />

            <Dropdown
              label="Property"
              name="property"
              title="Select property..."
              value={formData.property}
              onChange={handleChange}
              options={properties.map((property) => ({
                label:
                  "(" +
                  property.property_title +
                  ")" +
                  " " +
                  property.full_address,
                value: property._id,
              }))}
            />

            {/* Observations */}
            <div className="flex flex-col mt-2">
              <label
                htmlFor="observations"
                className="mb-1.5 text-sm font-medium text-gray-700"
              >
                Observations
              </label>
              <textarea
                id="observations"
                name="observations"
                value={formData.observations}
                onChange={handleChange}
                className="h-28 resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Page Footer */}
      <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
        <button
          onClick={handleSave}
          disabled={loader}
          className="rounded-md bg-green-600 px-8 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
        >
          {loader ? "Saving..." : "Save Task"}
        </button>
      </div>
    </div>
  );
};

export default CreateAgenda;