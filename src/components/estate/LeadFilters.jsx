"use client";
import React, { useState } from "react";
import { t } from "@/components/translations";
import Input from "../ui/Input";
import Dropdown from "../ui/DropDown";
import Icon from "../ui/Icon";
import { X } from "lucide-react";
import { Button } from "../ui/Button";

const PropertyFilters = ({
  filterOpen,
  setFilterOpen,
  setSelectedFilterData,
}) => {
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [intent, setIntent] = useState("");

  const handleApply = () => {
    // ✅ Send all values to parent
    setSelectedFilterData({
      location: location,
      name: name,
      phone: phone,
      intent: intent,
    });
    setFilterOpen(false);
  };

  const handleCancel = () => {
    setLocation("");
    setName("");
    setPhone("");
    setIntent("");

    setSelectedFilterData({
      location: "",
      name: "",
      phone: "",
      intent: "",
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
            label={t("intent")}
            type="text"
            name="intent"
            title={t("select_intent")}
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            options={[
              { value: "Sale", label: "Sale" },
              { value: "Rent", label: "Rent" },
            ]}
          />
          <Input
            label={t("location")}
            type="text"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ubicación de la propiedad"
          />
          <Input
            label={t("name")}
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del lead"
          />
          <Input
            label={t("phone")}
            type="text"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Teléfono del lead"
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

export default PropertyFilters;
