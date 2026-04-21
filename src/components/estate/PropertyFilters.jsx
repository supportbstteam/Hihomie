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
  const [ref, setRef] = useState("");
  const [propertyFor, setPropertyFor] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [price_min, setPrice_min] = useState("");
  const [price_max, setPrice_max] = useState("");

  const handleApply = () => {
    // ✅ Send all values to parent
    setSelectedFilterData({
      ref: ref,
      propertyFor: propertyFor,
      type: type,
      status: status,
      location: location,
      // price_min: price_min,
      // price_max: price_max,
    });
    setFilterOpen(false);
  };

  const handleCancel = () => {
    setRef("");
    setPropertyFor("");
    setType("");
    setStatus("");
    setLocation("");
    // setPrice_min("");
    // setPrice_max("");

    setSelectedFilterData({
      ref: "",
      propertyFor: "",
      type: "",
      status: "",
      location: "",
      // price_min: "",
      // price_max: "",
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
            label={t("property_for")}
            type="text"
            name="property_for"
            title={t("select_property_for")}
            value={propertyFor}
            onChange={(e) => setPropertyFor(e.target.value)}
            options={[
              { value: "sale", label: "Sale" },
              { value: "rent", label: "Rent" },
            ]}
          />
          <Dropdown
            label={t("type")}
            type="text"
            name="type"
            title={t("select_type")}
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={[
              { label: "Floor", value: "flat" },
              { label: "House Chalet", value: "chalet" },
              { label: "Rustic House", value: "country_house" },
              { label: "Bungalow", value: "bungalow" },
              { label: "Room", value: "room" },
              { label: "Parking Space", value: "parking" },
              { label: "Local", value: "shop" },
              { label: "Industrial Warehouse", value: "industrial" },
              { label: "Office", value: "office" },
              { label: "Land", value: "land" },
              { label: "Storage Room", value: "storage" },
              { label: "Building", value: "building" },
              { label: "Attic", value: "penthouse" },
              { label: "Duplex", value: "duplex" },
              { label: "Study", value: "studio" },
            ]}
          />
          <Dropdown
            label={t("status")}
            type="text"
            name="status"
            title={t("select_status")}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { label: "Prospectus", value: "prospectus" },
              { label: "Available", value: "available" },
              { label: "Reserved", value: "reserved" },
              { label: "Rented", value: "rented" },
              { label: "Sold", value: "sold" },
              { label: "Inactive", value: "inactive" },
            ]}
          />

          <Input
            label={t("reference")}
            type="text"
            name="ref"
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            placeholder={t("pf1")}
          />
          <Input
            label={t("location")}
            type="text"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={t("pf2")}
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
          <Button onClick={handleApply} className="py-2 px-4 cursor-pointer" size="full">
            {t("apply")}
          </Button>
        </div>
      </aside>
    </div>
  );
};

export default PropertyFilters;
