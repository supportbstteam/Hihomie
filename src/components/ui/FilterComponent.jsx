"use client";
import React, { useState } from "react";
import Button from "./Button";
import Dropdown from "./DropDown";

const options = [
  { label: "A", value: "a" },
  { label: "N", value: "n" },
  { label: "F", value: "f" },
  { label: "G", value: "G" },
  { label: "D", value: "D" },
];

const FilterComponent = () => {
  const [managers, setManagers] = useState([]);
  const [mortgage, setMortgage] = useState("");
  const [user, setUser] = useState("");
  const [contact, setContact] = useState("");

  const handleManagerSelect = (manager) => {
    setManagers((prevManagers) =>
      prevManagers.includes(manager)
        ? prevManagers.filter((item) => item !== manager)
        : [...prevManagers, manager]
    );
  };

  const handleApply = () => {
    console.log("Applied filters:", { managers, mortgage, user, contact });
  };

  const handleReset = () => {
    setManagers([]);
    setMortgage("");
    setUser("");
    setContact("");
  };

  return (
    <div className="w-80  border border-gray-300 rounded-lg">
      <div className="mb-4 p-6 border-b-2 border-stock">
        <h2 className="text-xl font-semibold">Filter</h2>
        <p className="psm text-light">Find Exactly What You Need</p>
      </div>

      {/* Manager Filter */}
      <div className="p-6 pt-2">
        <div className="mb-6">
          <Dropdown
            label="Manager"
            options={options}
            value={contact}
            onChange={(e) => handleManagerSelect(e.target.value)}
          />

          <div className="flex flex-wrap gap-2 mb-2">
            {managers.map((manager, i) => (
              <div
                key={i}
                className="flex items-center px-4 py-1 bg-gray-200 rounded-full text-sm"
              >
                {manager}
                <span
                  className="ml-2 cursor-pointer text-red-500"
                  onClick={() => handleManagerSelect(manager)}
                >
                  ✕
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mortgage Filter */}

        <div className="mb-6">
          <Dropdown
            label="Mortgage"
            options={options}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>

        {/* User Filter */}

        <div className="mb-6">
          <Dropdown
            label="User"
            options={options}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>

        {/* Contact Filter */}
        <div className="mb-6">
          <Dropdown
            label="Contact"
            options={options}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between p-4  border-t-2 border-stock ">
        <Button variant="secondary" size="sm">
          Reset
        </Button>
        <Button size="sm">Apply</Button>
      </div>
    </div>
  );
};

export default FilterComponent;
