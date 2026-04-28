"use client";
import React, { useState } from "react";
import { t } from "@/components/translations";
import Input from "../ui/Input";
import Dropdown from "../ui/DropDown";
import Icon from "../ui/Icon";
import { X } from "lucide-react";
import { Button } from "../ui/Button";

const ContactFilters = ({
  filterOpen,
  setFilterOpen,
  setSelectedFilterData,
}) => {
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [assignedAgent, setAssignedAgent] = useState("");
  const [status, setStatus] = useState("");

  const handleApply = () => {
    // ✅ Send all values to parent
    setSelectedFilterData({
      address: address,
      name: name,
      phone: phone,
      email: email,
      assignedAgent: assignedAgent,
      status: status,
    });
    setFilterOpen(false);
  };

  const handleCancel = () => {
    setAddress("");
    setName("");
    setPhone("");
    setEmail("");
    setAssignedAgent("");
    setStatus("");

    setSelectedFilterData({
      address: "",
      name: "",
      phone: "",
      email: "",
      assignedAgent: "",
      status: "",
    });
    setFilterOpen(false);
  };
  return (
    <div>
      {/* ==== Overlay ==== */}
      {filterOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 cursor-pointer"
          onClick={() => setFilterOpen(false)}
        />
      )}
      {/* ==== Drawer ==== */}
      <aside
        className={`fixed top-0 right-0 h-full w-[25%] flex flex-col justify-between content-between bg-white  shadow-lg z-50 transform transition-transform duration-300  ${
          filterOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="w-full p-4 border-b border-stroke  flex items-center justify-between">
          <div>
            <h2 className="plg">{t("filter")}</h2>
            <p className="psm text-light">{t("find_exact")}</p>
          </div>
          <Icon
            icon={X}
            size={20}
            variant="primary"
            onClick={() => setFilterOpen(false)}
          />
        </div>

        {/* Drawer Content */}
        <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-60px)] ">
          <Dropdown
            label={t("status")}
            type="text"
            name="status"
            title={t("select_status")}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
          <Input
            label={t("address")}
            type="text"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={t("pf3")}
          />
          <Input
            label={t("name")}
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("pf4")}
          />
          <Input
            label={t("email")}
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("pf5")}
          />
        </div>
        <div className="flex h-fit justify-between p-4 gap-4  border-t border-stock">
          <Button
            onClick={handleCancel}
            className="py-2 px-4 cursor-pointer"
            variant="outline"
            size="full"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleApply}
            className="py-2 px-4 cursor-pointer"
            size="full"
          >
            {t("apply")}
          </Button>
        </div>
      </aside>
    </div>
  );
};

export default ContactFilters;
