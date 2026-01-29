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
import { useSession } from "next-auth/react"; // 1. Import useSession

const CustomerAdd = ({ open, setOpen, selectedColId, handleCardAdded, leadStatus }) => {
  const dispatch = useDispatch();
  const { loader, successMessage, errorMessage } = useSelector(
    (state) => state.customer
  );
  const [details, setDetails] = useState(false);
  const [users, setUsers] = useState([]);
  const [address_details, setAddressDetails] = useState(false);
  const [detailsData, setDetailsData] = useState({});
  const [addressDetailsData, setAddressDetailsData] = useState({});
  const [contract_signed, setContractSigned] = useState(false);
  const { data: session } = useSession(); // 2. Get the session data

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
    contacted: "no",
    commercial_notes: "",
    manager_notes: "",
    detailsData: {},
    addressDetailsData: {},
    selectedColId: selectedColId || "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/team");
      const { data } = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    // 3. Conditionally set the 'assigned' field based on the user's role
    if (session?.user?.role === "manager" || session?.user?.role === "staff") {
      setFormData((prev) => ({
        ...prev,
        assigned: session.user.id,
      }));
    } else if (session?.user?.role === "admin") {
      // If admin, they can choose anyone, but we can set a default if needed
      // For now, we'll leave it as is so they can select from the dropdown.
    }
  }, [session]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleToggle = (e) => {
    setDetails(e.target.checked);
  };

  const handleToggleAddress = (e) => {
    setAddressDetails(e.target.checked);
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      selectedColId: selectedColId || "",
    }));
  }, [selectedColId]);

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

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      contract_signed: contract_signed,
    }));
  }, [contract_signed]);

  const validate = (values) => {
    const newErrors = {};

    // if (!values.lead_title.trim()) {
    //   newErrors.lead_title = t("leadTitleRequired");
    // }
    if (!values.surname) {
      newErrors.surname = t("prefixRequired");
    }
    if (!values.first_name.trim()) {
      newErrors.first_name = t("firstNameRequired");
    }
    if (!values.last_name.trim()) {
      newErrors.last_name = t("lastNameRequired");
    }
    if (!values.email.trim()) {
      newErrors.email = t("emailRequired");
    }
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = t("validEmail");
    }
    if (values.phone && !/^[0-9]{7,15}$/.test(values.phone)) {
      newErrors.phone = t("validPhone");
    }
    if (!values.selectedColId) {
      newErrors.selectedColId = t("statusRequired");
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
      handleCardAdded();
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [errorMessage, successMessage, dispatch, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] px-4">
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white w-full md:max-w-[60%] mx-auto rounded-xl shadow-2xl p-6 md:p-8 relative overflow-y-auto mt-5"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
            <p className="text-gray-700 text-[20px] mb-6">
              {t("add_new_lead")}
            </p>
            <form
              onSubmit={handleSubmit}
              className="mb-5 overflow-y-auto custom-scrollbar pr-1 max-h-[90vh] md:max-h-[70vh]"
            >
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {/* ... other inputs ... */}
                <Input
                  label={t("lead_title")}
                  type="text"
                  name="lead_title"
                  value={formData.lead_title}
                  onChange={handleChange}
                />
                <Dropdown
                  label={t("prefix")}
                  name="surname"
                  title={t("select_surname")}
                  value={formData.surname}
                  onChange={handleChange}
                  error={errors.surname}
                  required
                  options={[
                    { value: t("mr"), label: t("mr") },
                    { value: t("mrs"), label: t("mrs") },
                  ]}
                />
                <Input
                  label={t("first_name")}
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  error={errors.first_name}
                />
                <Input
                  label={t("last_name")}
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  error={errors.last_name}
                  required
                />
                <Input
                  label={t("referred_by")}
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  error={errors.company}
                />
                <Dropdown
                  label={t("designation")}
                  name="designation"
                  title={t("select_designation")}
                  value={formData.designation}
                  onChange={handleChange}
                  error={errors.designation}
                  options={[
                    { value: "ceo", label: t("ceo") },
                    { value: "marketing_manager", label: t("marketing_manager") },
                    { value: "hr_executive", label: t("hr_executive") },
                    { value: "sales_head", label: t("sales_head") },
                    { value: "owner_founder", label: t("owner_founder") },
                    { value: "team_lead", label: t("team_lead") },
                    { value: "agent", label: t("agent") },
                  ]}
                />
                <Input
                  label={t("phone")}
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                />
                <Input
                  label={t("email")}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  error={errors.email}
                />
                <Input
                  label={t("lead_amout") + " ($)"}
                  type="number"
                  name="lead_value"
                  value={formData.lead_value}
                  onChange={handleChange}
                  error={errors.lead_value}
                />
                {/* Conditional rendering based on user role from NextAuth */}
                {session?.user?.role === "admin" ? (
                  <Dropdown
                    label={t("assigned_to")}
                    name="assigned"
                    title={t("select_assigned")}
                    value={formData.assigned}
                    onChange={handleChange}
                    error={errors.assigned}
                    options={users.map((item) => ({
                      value: item._id,
                      label: item.name,
                    }))}
                  />
                ) : (
                  <Dropdown
                    label={t("assigned_to")}
                    name="assigned"
                    title={t("select_assigned")}
                    value={formData.assigned || ""}
                    onChange={handleChange}
                    options={[
                      {
                        value: session?.user?.id || "",
                        label: session?.user?.name || "",
                      },
                    ]}
                  />
                )}
                <Dropdown
                  label={t("status")}
                  name="selectedColId"
                  title={t("select_status")}
                  value={formData.selectedColId}
                  onChange={handleChange}
                  required
                  error={errors.selectedColId}
                  options={leadStatus.map((item) => ({
                    value: item._id,
                    label: item.status_name,
                  }))}
                />
                <Dropdown
                  label={t("type_of_operation")}
                  name="type_of_opration"
                  title={t("select_type_of_operation")}
                  value={formData.type_of_opration}
                  onChange={handleChange}
                  error={errors.type_of_opration}
                  options={[
                    { value: t("first_house"), label: t("first_house") },
                    { value: t("second_house"), label: t("second_house") },
                    { value: t("investment"), label: t("investment") },
                    { value: t("surrogacy"), label: t("surrogacy") },
                    { value: t("refinancing"), label: t("refinancing") },
                  ]}
                />
                <Dropdown
                  label={t("customer_situation")}
                  name="customer_situation"
                  title={t("select_customer_situation")}
                  value={formData.customer_situation}
                  onChange={handleChange}
                  error={errors.customer_situation}
                  required
                  options={[
                    { value: t("customer_situation1"), label: t("customer_situation1") },
                    { value: t("urgent"), label: t("urgent") },
                    { value: t("evaluating"), label: t("evaluating") },
                    { value: t("decided"), label: t("decided") },
                  ]}
                />
                <Dropdown
                  label={t("purchase_status")}
                  name="purchase_status"
                  title={t("select_purchase_status")}
                  value={formData.purchase_status}
                  onChange={handleChange}
                  error={errors.purchase_status}
                  required
                  options={[
                    { value: t("still_searching"), label: t("still_searching") },
                    {
                      value: t("selected_housing"),
                      label: t("selected_housing"),
                    },
                    { value: t("property"), label: t("property") },
                  ]}
                />
                <Dropdown
                  label={t("contacted")}
                  name="contacted"
                  value={formData.contacted}
                  onChange={handleChange}
                  error={errors.contacted}
                  required
                  options={[
                    { value: "no", label: "No" },
                    { value: "yes", label: "Yes" },
                  ]}
                />
              </section>
              <div className="grid grid-cols-1 gap-2 mt-4">
                <section className="bg-gray-50 p-4 rounded-md border border-stroke">
                  <h3 className="p mb-4">{t("note")}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="commercial_notes" className="block psm mb-1">
                        {t("commerical_note")}
                      </label>
                      <textarea
                        id="commercial_notes"
                        name="commercial_notes"
                        rows="4"
                        className="w-full p-2 border border-stroke rounded-md focus:ring-1 focus:ring-primary focus:outline-none text-sm"
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
                        defaultValue={formData.manager_notes}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                </section>
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
                    <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-green-600 transition-colors"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></div>
                  </label>
                </div>
                {details && <Form1 setDetailsData={setDetailsData} />}
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
                    <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-green-600 transition-colors"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></div>
                  </label>
                </div>
                {address_details && (
                  <Form2 setAddressDetailsData={setAddressDetailsData} />
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="font-medium text-dark psm">
                    {t("contract_signed")}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      name="contract_signed"
                      checked={contract_signed}
                      onChange={() => setContractSigned(!contract_signed)}
                    />
                    <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-green-600 transition-colors"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></div>
                  </label>
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setOpen(false)}
                    type="reset"
                    className="px-6 py-2 cursor-pointer border border-stock rounded-sm text-gray-700 hover:bg-gray-100"
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
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CustomerAdd;