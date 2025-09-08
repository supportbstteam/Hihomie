"use client";
import { get_teamData } from "@/store/userTema";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { t } from "@/components/translations";
import Input from "../ui/Input";
import Dropdown from "../ui/DropDown";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import { X } from "lucide-react";

const Filter = ({
  leadStatusList,
  filterOpen,
  setFilterOpen,
  setSelecteFilterData,
}) => {
  const dispatch = useDispatch();
  const { loader, team } = useSelector((state) => state.team);

  const [open, setOpen] = useState(false);

  // ✅ Local states for filters
  const [selectedGestor, setSelectedGestor] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("");
  const [fullName, setFullName] = useState(""); // 🔥 New
  const [phone, setPhone] = useState(""); // 🔥 New

  useEffect(() => {
    dispatch(get_teamData());
  }, [dispatch]);

  const handleApply = () => {
    // ✅ Send all values to parent
    setSelecteFilterData({
      gestor: selectedGestor,
      estado: selectedEstado,
      full_name: fullName,
      phone: phone,
    });
    setFilterOpen(false);

    // Reset filters
    setSelectedGestor("");
    setSelectedEstado("");
    setFullName("");
    setPhone("");
  };

  const handleCancel = () => {
    setSelectedGestor("");
    setSelectedEstado("");
    setFullName("");
    setPhone("");
    setOpen(false);
  };

  return (
    <div>
      {/* ==== Overlay ==== */}
      {filterOpen && (
        <div className="fixed inset-0 bg-opacity-30 z-40 pointer-events-none" />
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
            variant="primary"
            onClick={() => setFilterOpen(false)}
          />
        </div>

        {/* Drawer Content */}
        <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-60px)] ">
          {/* Gestor */}
          <Dropdown
            label={t("manager")}
            type="text"
            name="manager"
            title={t("select_manager")}
            value={selectedGestor}
            onChange={(e) => setSelectedGestor(e.target.value)}
            placeholder="Buscar por contacto"
            options={team.map((item, i) => ({
              //  key: i,
              value: item._id,
              label: `${item.name} ${item.lname}`,
            }))}
          />

          {/* Estado */}

          <Dropdown
            label={t("status")}
            type="text"
            name="status"
            title={t("select_status")}
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
            placeholder="Buscar por contacto"
            options={leadStatusList.map((item, i) => ({
              value: item._id,
              label: item.status_name,
            }))}
            // options={leadStatusList.map((item, i) => ({
            //   //  key: i,
            //   value: item.leadStatusId,
            //   label: item.leadStatusname,
            // }))}
          />

          {/* Usuario */}

          <Input
            label={t("full_name")}
            type="text"
            name="full_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Buscar por contacto"
          />

          {/* Contacto */}

          <Input
            label={t("phone")}
            type="text"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Buscar por contacto"
          />

          {/* Action Buttons */}
          {/* <div className="flex gap-3 h-[7vh] pt-4">
            <button
              onClick={handleCancel}
              className="flex-1 rounded-lg border border-stroke py-2"
            >
              {t("cancel")}
            </button>
            <button
              onClick={handleApply}
              className="flex-1 rounded-lg bg-[#21B573] text-white py-2"
            >
              {t("apply")}
            </button>
          </div> */}

         
        </div>
         <div className="flex h-fit justify-between p-4 gap-4  border-t border-stock">
            <Button onClick={handleCancel} variant="outline" size="full">
              {t("cancel")}
            </Button>
            <Button onClick={handleApply} size="full">
              {t("apply")}
            </Button>
          </div>
      </aside>
    </div>
  );
};

export default Filter;
