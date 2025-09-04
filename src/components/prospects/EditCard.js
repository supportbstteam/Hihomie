'use client'

import { useDispatch, useSelector } from "react-redux";
import { cardDelete, customerUpdate } from "@/store/customer";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { t } from "@/components/translations";
import Input from "../ui/Input";
import Dropdown from "../ui/DropDown";
import Form1 from "./Form1";
import Form2 from "./Form2";
import AssignUser from "./AssignUser";

const EditCard = ({ selectedUser, setSelectedUser, colId, leadStatus }) => {
  const dispatch = useDispatch();
  const { loader, successMessage, errorMessage } = useSelector(
    (state) => state.customer
  );

  const [details, setDetails] = useState(false);
  const [address_details, setAddressDetails] = useState(false);
  const [detailsData, setDetailsData] = useState({});
  const [addressDetailsData, setAddressDetailsData] = useState({});
  const [errors, setErrors] = useState({
    surname: '',
    lead_title: '',
    first_name: '',
    last_name: '',
    company: '',
    designation: '',
    email: '',
    phone: '',
    status: ''
  });

  const [formData, setFormData] = useState({
    lead_title: "",
    surname: "",
    first_name: "",
    last_name: "",
    company: "",
    designation: "",
    phone: "",
    email: "",
    lead_value: "",
    assigned: "",
    status: "Nueva",
    type_of_opration: "Primera casa",
    customer_situation: "Quiere información",
    purchase_status: "Todavía buscando",
    commercial_notes: "",
    manager_notes: "",
    detailsData: {},
    addressDetailsData: {},
    id: "",
    colId: "",
  });

  // 🔹 handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleToggle = (e) => setDetails(e.target.checked);
  const handleToggleAddress = (e) => setAddressDetails(e.target.checked);

  // 🔹 validation
  const validateForm = () => {
    let newErrors = {
      surname: '',
      lead_title: '',
      first_name: '',
      last_name: '',
      company: '',
      designation: '',
      email: '',
      phone: '',
      status: ''
    };
    let valid = true;

    if (!formData.lead_title.trim()) {
      newErrors.lead_title = "Lead title is required";
      valid = false;
    }
    if (!formData.surname) {
      newErrors.surname = "Surname is required";
      valid = false;
    }
    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
      valid = false;
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
      valid = false;
    }
    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
      valid = false;
    }
    if (!formData.designation.trim()) {
      newErrors.designation = "Designation is required";
      valid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }
    if (formData.phone && !/^[0-9]{7,15}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be digits (7–15 numbers)";
      valid = false;
    }
    if (!formData.status) {
      newErrors.status = "Status is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // 🔹 submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    dispatch(customerUpdate(formData));
  };

  const handleDelete = (id) => {
    dispatch(cardDelete(id));
  };

  useEffect(() => {
    if (successMessage) {
      setSelectedUser(null);
      setFormData({
        lead_title: "",
        surname: "",
        first_name: "",
        last_name: "",
        company: "",
        designation: "",
        phone: "",
        email: "",
        lead_value: "",
        assigned: "",
        status: "New",
        type_of_opration: "First Home",
        customer_situation: "Want Information",
        purchase_status: "Still Looking",
        commercial_notes: "",
        manager_notes: "",
        detailsData: {},
        addressDetailsData: {},
        id: "",
        colId: "",
      });
    }
  }, [successMessage, errorMessage]);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        ...selectedUser,
        id: selectedUser._id || "",
        colId: selectedUser.colId ? selectedUser.colId : colId || "",
      });
    }
  }, [selectedUser]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      detailsData: detailsData,
    }));
  }, [detailsData]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      addressDetailsData: addressDetailsData,
    }));
  }, [addressDetailsData]);

  return (
    <AnimatePresence>
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] px-4">
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white w-full md:max-w-[70%] mx-auto rounded-radius shadow-2xl p-6 md:p-8 relative overflow-y-auto mt-5"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>

            <p className="text-gray-700 text-[20px] mb-6">{t("edit_lead")}</p>

            {/* Form */}
            <div className="overflow-y-auto max-h-[70vh] flex flex-col-reverse md:flex-row justify-between gap-4">
              <form
                onSubmit={handleSubmit}
                className="space-y-4 mb-5 w-full md:w-8/12"
              >
                {/* Lead Title */}
                <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <Input
                    label={t("lead_title")}
                    value={formData.lead_title}
                    onChange={handleChange}
                    name="lead_title"
                    required
                    error={errors.lead_title}
                  />
                  <Dropdown
                    label={t("surname")}
                    value={formData.surname}
                    onChange={handleChange}
                    name="surname"
                    options={[
                      { value: "Señor.", label: "Señor." },
                      { value: "Señora.", label: "Señora." },
                    ]}
                    error={errors.surname}
                  />
                  <Input
                    label={t("first_name")}
                    type="text"
                    value={formData.first_name}
                    onChange={handleChange}
                    name="first_name"
                    required
                    error={errors.first_name}
                  />
                  <Input
                    label={t("last_name")}
                    type="text"
                    value={formData.last_name}
                    onChange={handleChange}
                    name="last_name"
                    required
                    error={errors.last_name}
                  />
                  <Input
                    label={t("company")}
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                    name="company"
                    error={errors.company}
                  />
                  <Input
                    label={t("designation")}
                    type="text"
                    value={formData.designation}
                    onChange={handleChange}
                    name="designation"
                    error={errors.designation}
                  />
                  <Input
                    label={t("phone")}
                    type="text"
                    value={formData.phone}
                    onChange={handleChange}
                    name="phone"
                    error={errors.phone}
                  />
                  <Input
                    label={t("email")}
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    name="email"
                    error={errors.email}
                  />
                  <Input
                    label={t("lead_amout") + " ($)"}
                    type="number"
                    value={formData.lead_value}
                    onChange={handleChange}
                    name="lead_value"
                  />
                  <Input
                    label={t("assigned")}
                    type="text"
                    value={formData.assigned}
                    onChange={handleChange}
                    name="assigned"
                  />
                  <Dropdown
                    label={t("status")}
                    type="text"
                    value={formData.status}
                    onChange={handleChange}
                    name="status"
                    options={leadStatus.map((item) => ({
                      value: item._id,
                      label: item.status_name,
                    }))}
                    error={errors.status}
                  />
                  <Dropdown
                    label={t("type_of_opration")}
                    type="text"
                    value={formData.type_of_opration}
                    onChange={handleChange}
                    name="type_of_opration"
                    options={[
                      { value: "Primera casa", label: "Primera casa" },
                      { value: "Segunda casa", label: "Segunda casa" },
                      { value: "Inversión", label: "Inversión" },
                      { value: "Subrogación", label: "Surrogacy" },
                      { value: "Refinanciación", label: "Refinanciación" },
                    ]}
                  />
                  <Dropdown
                    label={t("custome_setiuation")}
                    type="text"
                    value={formData.customer_situation}
                    onChange={handleChange}
                    name="customer_situation"
                    options={[
                      { value: "Quiere información", label: "Quiere información" },
                      { value: "Tomará tiempo", label: "Tomará tiempo" },
                      { value: "Urgente", label: "Urgente" },
                      { value: "Evaluando", label: "Evaluando" },
                      { value: "Decidida", label: "Decidida" },
                    ]}
                  />
                  <Dropdown
                    label={t("purchase_status")}
                    type="text"
                    value={formData.purchase_status}
                    onChange={handleChange}
                    name="purchase_status"
                    options={[
                      { value: "Todavía buscando", label: "Todavía buscando" },
                      { value: "Vivienda Seleccionada", label: "Vivienda Seleccionada" },
                      { value: "Propiedad", label: "Propiedad" },
                    ]}
                  />
                </section>

                <section className="grid gap-4">
                  <section className="bg-gray-50 p-4 rounded-md border border-stroke grid gap-4">
                    <h3 className="text-base font-semibold text-gray-800 mb-4">
                      {t("note")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="commercial_notes" className="block text-sm font-medium text-gray-700 mb-1">
                          {t("commerical_note")}
                        </label>
                        <textarea
                          id="commercial_notes"
                          name="commercial_notes"
                          rows="4"
                          className="w-full p-2 border border-stroke rounded-md focus:ring-1 focus:ring-primary focus:outline-none text-sm"
                          placeholder="Escribe tus notas comerciales..."
                          defaultValue={formData.commercial_notes}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="manager_notes" className="block text-sm font-medium text-gray-700 mb-1">
                          {t("Managers_notes")}
                        </label>
                        <textarea
                          id="manager_notes"
                          name="manager_notes"
                          rows="4"
                          className="w-full p-2 border border-stroke rounded-md focus:ring-1 focus:ring-primary focus:outline-none text-sm"
                          placeholder="Manager's remarks..."
                          defaultValue={formData.manager_notes}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                    </div>
                  </section>

                  <div className="flex items-center justify-between mt-2 ">
                    <span className="w-32 font-medium text-gray-700 text-sm">
                      {t("details")}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        name="details"
                        checked={details}
                        onChange={handleToggle}
                      />
                      <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-green-600 transition-colors"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></div>
                    </label>
                  </div>

                  {details && (
                    <Form1
                      setDetailsData={setDetailsData}
                      selectedUser={selectedUser.detailsData}
                    />
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <span className="font-medium text-gray-700 text-sm">
                      {t("address_organization")}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        name="address_details"
                        checked={address_details}
                        onChange={handleToggleAddress}
                      />
                      <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-green-600 transition-colors"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></div>
                    </label>
                  </div>

                  {address_details && (
                    <Form2
                      setAddressDetailsData={setAddressDetailsData}
                      selectedUser={selectedUser.addressDetailsData}
                    />
                  )}

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setSelectedUser(null)}
                      type="reset"
                      className="px-6 cursor-pointer py-2 border border-stroke rounded-sm text-gray-700 hover:bg-gray-100"
                    >
                      {t("cancel")}
                    </button>
                    <button
                      disabled={loader}
                      type="submit"
                      className="px-6 py-2 cursor-pointer bg-green-600 text-white rounded-sm hover:bg-green-700"
                    >
                      {loader ? t("loading") : t("submit")}
                    </button>
                  </div>
                </section>
              </form>
              <div className="w-full md:w-4/12 h-fit bg-primary/20 p-2 rounded-radius">
                <AssignUser colId={colId} cardid={selectedUser._id} />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditCard;
