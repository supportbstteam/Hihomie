"use client";
import { get_teamData } from "@/store/userTema";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { t } from "@/components/translations";
import Input from "../ui/Input";
import Dropdown from "../ui/DropDown";
import Icon from "../ui/Icon";
import { X } from "lucide-react";
import { Button } from "../ui/Button";
import useUserFromSession from "@/lib/useUserFromSession";

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
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [contacted, setContacted] = useState("");
  const [contract_signed, setContract_signed] = useState("");
  const [document_submitted, setDocument_submitted] = useState("");
  const [bank, setBank] = useState("");
  const authUser = useUserFromSession();
  const [email, setEmail] = useState("");

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
      contacted: contacted,
      contract_signed: contract_signed,
      document_submitted: document_submitted,
      bank: bank,
      email: email,
    });
    setFilterOpen(false);

    // Reset filters
    setSelectedGestor("");
    setSelectedEstado("");
    setFullName("");
    setPhone("");
    setContacted("");
    setContract_signed("");
    setDocument_submitted("");
    setBank("");
    setEmail("");
  };

  const handleCancel = () => {
    setSelectedGestor("");
    setSelectedEstado("");
    setFullName("");
    setPhone("");
    setContacted("");
    setContract_signed("");
    setDocument_submitted("");
    setBank("");
    setEmail("");
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
        className={`fixed top-0 right-0 h-full w-[25%] flex flex-col justify-between content-between bg-white  shadow-lg z-50 transform transition-transform duration-300  ${filterOpen ? "translate-x-0" : "translate-x-full"
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
          {authUser?.role === "admin" && (
            <Dropdown
              label={t("manager")}
              type="text"
              name="manager"
              title={t("select_manager")}
              value={selectedGestor}
              onChange={(e) => setSelectedGestor(e.target.value)}
              placeholder="Buscar por contacto"
              options={team.map((item, i) => ({
                value: item._id,
                label: `${item.name} ${item.lname}`,
              }))}
            />
          )}

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
          />

          <Dropdown
            label={t("contacted")}
            type="text"
            name="contacted"
            title={t("choose_option")}
            value={contacted}
            onChange={(e) => setContacted(e.target.value)}
            options={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
          />

          <Dropdown
            label={t("contract_signed")}
            type="text"
            name="contract_signed"
            title={t("choose_option")}
            value={contract_signed}
            onChange={(e) => setContract_signed(e.target.value)}
            options={[
              { label: "Yes", value: "true" },
              { label: "No", value: "false" },
            ]}
          />

          <Dropdown
            label={t("document_submitted")}
            type="text"
            name="document_submitted"
            title={t("choose_option")}
            value={document_submitted}
            onChange={(e) => setDocument_submitted(e.target.value)}
            options={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
          />

          <Dropdown
            label={t("bank")}
            type="text"
            name="bank"
            title={t("select_bank")}
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            options={[
              { value: "CaixaBank", label: "CaixaBank" },
              { value: "Banco Santander", label: "Banco Santander" },
              { value: "BBVA", label: "BBVA" }
            ]}
          />

          <Input
            label={t("full_name")}
            type="text"
            name="full_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nombre completo"
          />

          <Input
            label={t("phone")}
            type="text"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Buscar por contacto"
          />

          <Input
            label={t("email")}
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
          />


        </div>
        <div className="flex h-fit justify-between p-4 gap-4  border-t border-stock">
          <Button onClick={handleCancel} className="py-2 px-4" variant="outline" size="full">
            {t("cancel")}
          </Button>
          <Button onClick={handleApply} className="py-2 px-4" size="full">
            {t("apply")}
          </Button>
        </div>
      </aside>
    </div>
  );
};

export default Filter;
