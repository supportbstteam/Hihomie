"use client";

import { useDispatch, useSelector } from "react-redux";
import { customerAdd, messageClear } from "@/store/customer";
import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { get_leadStatusData, get_leadStatusDataForList } from "@/store/setting";
import Form1 from "./Form1";
import Form2 from "./Form2";
import { motion, AnimatePresence } from "framer-motion";
import { t } from "@/components/translations";
import Input from "../ui/Input";
import Dropdown from "../ui/DropDown";
import { Asterisk } from "lucide-react";

const CustomerAdd = ({ open, setOpen, selectedColId, leadStatus }) => {
  const dispatch = useDispatch();
  const { loader, successMessage, errorMessage } = useSelector(
    (state) => state.customer
  );
  const [details, setDetails] = useState(false);
  const [address_details, setAddressDetails] = useState(false);
  const [detailsData, setDetailsData] = useState({});
  const [addressDetailsData, setAddressDetailsData] = useState({});

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
    type_of_opration: "Primera casa",
    customer_situation: "Quiere información",
    purchase_status: "Todavía buscando",
    commercial_notes: "",
    manager_notes: "",
    detailsData: {},
    addressDetailsData: {},
    selectedColId: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      let updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // अगर status बदला है → selectedColId भी update कर दो
      if (name === "status") {
        updated.selectedColId = value;
      }

      return updated;
    });
  };

  const handleToggle = (e) => {
    setDetails(e.target.checked); // ON → true, OFF → false
  };

  const handleToggleAddress = (e) => {
    setAddressDetails(e.target.checked); // ON → true, OFF → false
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      selectedColId: selectedColId || "",
    }));
  }, [selectedColId]);

  // 🔑 sync detailsData and addressDetailsData into formData
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


  const validate = (values) => {
    const newErrors = {};

    if (!values.lead_title.trim()) {
      newErrors.lead_title = "Lead title is required";
    }

    if (!values.surname) {
      newErrors.surname = "Surname is required";
    }

    if (!values.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!values.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    if (!values.company.trim()) {
      newErrors.company = "Company is required";
    }

    if (!values.designation.trim()) {
      newErrors.designation = "Designation is required";
    }

    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = "Invalid email format";
    }

    if (values.phone && !/^[0-9]{7,15}$/.test(values.phone)) {
      newErrors.phone = "Phone must be digits (7–15 numbers)";
    }

    if (!values.status) {
      newErrors.status = "Status is required";
    }

    return newErrors;
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      dispatch(customerAdd(formData));
    } 
  };


  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      setOpen(false);
      dispatch(messageClear());
      dispatch(get_leadStatusData());
      dispatch(get_leadStatusDataForList());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [errorMessage, successMessage]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] px-4">
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white w-full  md:max-w-[60%] mx-auto rounded-xl shadow-2xl p-6 md:p-8 relative overflow-y-auto mt-5"
          >
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>

            <p className="text-gray-700 text-[20px] mb-6">
              {t("add_new_lead")}
            </p>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="  mb-5 overflow-y-auto max-h-[90vh] md:max-h-[70vh]"
            >
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-2" >

                {/* Lead Title */}

                <Input
                  label={t("lead_title")}
                  type="text"
                  name="lead_title"
                  value={formData.lead_title}
                  onChange={handleChange}
                  required
                  error={errors.lead_title}
                />

                {/* Status */}
                <div className="grid gap-2 items-center">
                  <label className="w-32 text-dark psm">
                    {t("surname")}
                  </label>
                  <select
                    name="surname"
                    className="flex-1 px-2 py-2 bg-white border border-stroke rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                    value={formData.surname}
                    onChange={handleChange}
                  >
                    <option value="">--Seleccione Apellido--</option>
                    <option value="Señor.">Señor.</option>
                    <option value="Señora.">Señora.</option>
                  </select>
                </div>


                {/* First Name */}

                <Input
                  label={t("first_name")}
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  error={errors.first_name}
                />

                {/* Last Name */}

                <Input
                  label={t("last_name")}
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  error={errors.last_name}
                />


                <Input
                  label={t("company")}
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  error={errors.company}
                />


                <Input
                  label={t("designation")}
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                  error={errors.designation}
                />

                {/* Telephone */}

                <Input
                  label={t("phonr")}
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />

                {/* Email */}

                <Input
                  label={t("email")}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  error={errors.email}
                />

                {/* Lead Value */}

                <Input
                  label={t("lead_amout") + " ($)"}
                  type="number"
                  name="lead_value"
                  value={formData.lead_value}
                  onChange={handleChange}
                />

                {/* Assigned */}

                <Input
                  label={t("assigned")}
                  type="text"
                  className="flex-1 p-1 border border-stroke rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                  name="assigned"
                  value={formData.assigned}
                  onChange={handleChange}
                />

                {/* Status */}
                <div className="grid gap-2 items-center">

                  <label className="w-32 psm text-dark">
                    <div className="flex">
                      {t("status")}
                      <Asterisk size={12} color="#E33629" />
                    </div>
                  </label>
                  <select
                    name="status"
                    className="flex-1 psm p-2 bg-white border border-stroke rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    error={errors.lead_title}
                  >
                    {leadStatus.map((item, i) => (
                      <option value={`${item._id}`} key={i}>
                        {item.status_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-2 items-center">
                  <label className=" psm text-dark">
                    {t("type_of_operation")}
                  </label>
                  <select
                    name="type_of_opration"
                    className="flex-1 psm px-2 py-2 bg-white border border-stroke rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                    value={formData.type_of_opration}
                    onChange={handleChange}
                    required
                  >
                    <option value="Primera casa">Primera casa</option>
                    <option value="Segunda casa">Segunda casa</option>
                    <option value="Inversión">Inversión</option>
                    <option value="Subrogación">Surrogacy</option>
                    <option value="Refinanciación">Refinanciación</option>
                  </select>
                </div>
                {/* <Dropdown
                size="md"
                label={t("type_of_operation")}
                name="type_of_opration"
                value={formData.type_of_opration}
                onChange={handleChange}
                
                options={[
                  { lable: "--Seleccione--", value: "" },
                  { lable: "Primera casa", value: "Primera casa" },
                  { lable: "Segunda casa", value: "Segunda casa" },
                  { lable: "Inversión", value: "Inversión" },
                  { lable: "Subrogación", value: "Surrogacy" },
                  { lable: "Refinanciación", value: "Refinanciación" },
                ]}
              /> */}

                <div className="grid gap-2 items-center">
                  <label className=" text-dark psm">
                    {t("custome_setiuation")}
                  </label>
                  <select
                    name="customer_situation"
                    className="flex-1 psm p-2 bg-white border border-stroke rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                    value={formData.customer_situation}
                    onChange={handleChange}
                    required
                  >
                    <option value="Quiere información">Quiere información</option>
                    <option value="Tomará tiempo">Tomará tiempo</option>
                    <option value="Urgente">Urgente</option>
                    <option value="Evaluando">Evaluando</option>
                    <option value="Decidida">Decidida</option>
                  </select>
                </div>

                <div className="grid gap-2 items-center">
                  <label className="text-dark psm">
                    {t("purchase_status")}
                  </label>
                  <select
                    name="purchase_status"
                    className="flex-1 psm p-2 bg-white border border-stroke rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                    value={formData.purchase_status}
                    onChange={handleChange}
                    required
                  >
                    <option value="Todavía buscando">Todavía buscando</option>
                    <option value="Vivienda Seleccionada">
                      Vivienda Seleccionada
                    </option>
                    <option value="Propiedad">Propiedad</option>
                  </select>
                </div>
              </section>
              <div className="grid grid-cols-1  gap-2 mt-4">


                <section className="bg-gray-50 p-4 rounded-md border border-stroke">
                  <h3 className="p mb-4">
                    {t("note")}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="commercial_notes"
                        className="block psm mb-1"
                      >
                        {t("commerical_note")}
                      </label>
                      <textarea
                        id="commercial_notes"
                        name="commercial_notes"
                        rows="4"
                        className="w-full p-2 border border-stroke rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none text-sm"
                        defaultValue={formData.commercial_notes}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="manager_notes"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t("Managers_notes")}
                      </label>
                      <textarea
                        id="manager_notes"
                        name="manager_notes"
                        rows="4"
                        className="w-full p-2 border border-stroke rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none text-sm"
                        defaultValue={formData.manager_notes}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                </section>
                {/* Automatic Toggle */}
                <div className="flex items-center justify-between mt-2">
                  <span className="w-32 font-medium text-dark psm">
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
                    {/* Outer background */}
                    <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-green-600 transition-colors"></div>
                    {/* Inner circle */}
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></div>
                  </label>
                </div>

                {/* detaisl section start */}

                {details && <Form1 setDetailsData={setDetailsData} />}

                {/* Automatic Toggle */}
                <div className="flex items-center justify-between mt-2">
                  <span className="font-medium text-dark psm">
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
                    {/* Outer background */}
                    <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-green-600 transition-colors"></div>
                    {/* Inner circle */}
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></div>
                  </label>
                </div>

                {address_details && (
                  <Form2 setAddressDetailsData={setAddressDetailsData} />
                )}

                {/* Buttons */}
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setOpen(false)}
                    type="reset"
                    className="px-6 py-2 border border-stock rounded-sm text-gray-700 hover:bg-gray-100"
                  >
                    {t("cancel")}
                  </button>
                  <button
                    disabled={loader}
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700"
                  >
                    {loader ? t("loading") : t("submit")}
                  </button>
                </div>

              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CustomerAdd;
