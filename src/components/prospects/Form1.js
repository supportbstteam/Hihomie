"use client";
import React, { useState, useEffect } from "react";
import TextEditor from "../TextEditor";
import { t } from "@/components/translations";
import Dropdown from "../ui/DropDown";
import Input from "../ui/Input";

const Form1 = ({ setDetailsData, selectedUser }) => {
  const [detailsData, setLocalDetailsData] = useState({
    source: "Amarillo y páginas",
    category: "Por defecto",
    tag: "Alta",
    last_connected: "",
    notes: "",
  });

  // ✅ Jab selectedUserData aaye to local state update karo
  useEffect(() => {
    if (selectedUser) {
      setLocalDetailsData({
        source: selectedUser.source || "Amarillo y páginas",
        category: selectedUser.category || "Por defecto",
        tag: selectedUser.tag || "Alta",
        last_connected: selectedUser.last_connected || "",
        notes: selectedUser.notes || "",
      });

      // Parent me bhi update bhej do
      setDetailsData({
        source: selectedUser.source || "Amarillo y páginas",
        category: selectedUser.category || "Por defecto",
        tag: selectedUser.tag || "Alta",
        last_connected: selectedUser.last_connected || "",
        notes: selectedUser.notes || "",
      });
    }
  }, [selectedUser, setDetailsData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalDetailsData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setDetailsData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    console.log(detailsData)

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-1 w-full mb-5">
                <label className="text-gray-700 font-medium text-sm">{t('notes')}</label>
                <div className="w-full">
                    <TextEditor
                        className="min-h-[150px]"
                        name="notes"
                        value={detailsData.notes}
                        onChange={(val) => {
                            setLocalDetailsData((prev) => ({ ...prev, notes: val }));
                            setDetailsData((prev) => ({ ...prev, notes: val }));
                        }}
                    />
                </div>
            </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">


      <Dropdown
        label={t("fountain")}
        name="source"
        value={detailsData.source}
        onChange={handleChange}
        options={[
          { value: "Amarillo y páginas", label: "Amarillo y páginas" },
          {
            value: "yahoo",
            label: "yahoo",
          },
          { value: "Lugares de Google", label: "Lugares de Google" },
          { value: "Anuncios de Facebook", label: "Anuncios de Facebook" },
        ]}
      />

      <Dropdown
        label={t("Category")}
        name="category"
        value={detailsData.category}
        onChange={handleChange}
        options={[
          { value: "Por defecto", label: "Por defecto" },
          {
            value: "Desarrollo de aplicaciones",
            label: "Desarrollo de aplicaciones",
          },
          { value: "Diseño Gráfico", label: "Diseño Gráfico" },
        ]}
      />

      <Dropdown
        label={t("tag")}
        name="tag"
        value={detailsData.tag}
        onChange={handleChange}
        options={[
          { value: "Alta", label: "Alta" },
          { value: "Joomla", label: "Joomla" },
          { value: "Diseño de logotipo", label: "Logo Design" },
          { value: "Diseño Web", label: "Diseño Web" },
          { value: "Wordpress", label: "Wordpress" },
        ]}
      />
      {/* 
      <div className="flex items-center gap-3">
        <label className="w-32 text-gray-700 font-medium text-sm">
          {t("date")}
        </label>
        <input
          type="Date"
          className="flex-1 p-1 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
          name="last_connected"
          value={detailsData.last_connected}
          onChange={handleChange}
          required
        />
      </div> */}

      <Input
        label={t("date")}
        type="Date"
        name="last_connected"
        value={detailsData.last_connected}
        onChange={handleChange}
        required
      />
      </div>


      <hr className="border border-stroke" />
    </div>
  );
};

export default Form1;
