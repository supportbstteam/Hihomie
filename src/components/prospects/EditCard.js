'use client'

import { useDispatch, useSelector } from "react-redux";
import { cardDelete, customerUpdate, add_customer_comments, get_customer_comments, delete_comments, add_due_date, get_due_date } from "@/store/customer";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { t } from "@/components/translations";
import Input from "../ui/Input";
import Dropdown from "../ui/DropDown";
import Form1 from "./Form1";
import Form2 from "./Form2";
import AssignUser from "./AssignUser";
import { Button } from "../ui/Button";
import { Trash2 } from "lucide-react";
import ConfirmDeleteModal from "@/components/ConfirmAlert";
import useUserFromSession from "@/lib/useUserFromSession";
import Datepicker from "../ui/Datepicker";
import { format } from "date-fns";

const date = format(new Date(), "yyyy-MM-dd");

const EditCard = ({ selectedUser, setSelectedUser, colId, leadStatus }) => {
  const dispatch = useDispatch();
  const { loader, successMessage, errorMessage, comments, dueDate } = useSelector(
    (state) => state.customer
  );
  const authUser = useUserFromSession();
  const [users, setUsers] = useState([]);
  const [details, setDetails] = useState(false);
  const [address_details, setAddressDetails] = useState(false);
  const [detailsData, setDetailsData] = useState({});
  const [addressDetailsData, setAddressDetailsData] = useState({});
  const [deleteConfirmAlert, setDeleteConfirmAlert] = useState(false);
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
    status: "",
    type_of_opration: "",
    customer_situation: "",
    purchase_status: "",
    commercial_notes: "",
    manager_notes: "",
    detailsData: {},
    addressDetailsData: {},
    id: "",
    colId: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/team");
      const { data } = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  // 🔹 reusable function to reset form

  // handle input change
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
    };
    let valid = true;

    if (!formData.lead_title.trim()) {
      newErrors.lead_title = t("leadTitleRequired");
      valid = false;
    }
    if (!formData.surname) {
      newErrors.surname = t("prefixRequired");
      valid = false;
    }
    if (!formData.first_name.trim()) {
      newErrors.first_name = t("firstNameRequired");
      valid = false;
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = t("lastNameRequired");
      valid = false;
    }
    // if (!formData.company.trim()) {
    //   newErrors.company = "Company is required";
    //   valid = false;
    // }
    // if (!formData.designation.trim()) {
    //   newErrors.designation = "Designation is required";
    //   valid = false;
    // }
    if (!formData.email.trim()) {
      newErrors.email = t("emailRequired");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("validEmail");
      valid = false;
    }
    if (formData.phone && !/^[0-9]{7,15}$/.test(formData.phone)) {
      newErrors.phone = t("validPhone");
      valid = false;
    }
    if (!formData.status) {
      newErrors.status = t("statusRequired");
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
      if (successMessage === "Comment added successfully" || successMessage === "Comment deleted successfully") {
        toast.success(successMessage);
      } else {
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
          status: "",
          type_of_opration: "",
          customer_situation: "",
          purchase_status: "",
          commercial_notes: "",
          manager_notes: "",
          detailsData: {},
          addressDetailsData: {},
          id: "",
          colId: "", // ✅ keep the current colId
        });
      }
    }
  }, [successMessage, errorMessage]);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        ...selectedUser,
        id: selectedUser._id || "",
        colId: selectedUser.status ? selectedUser.status : colId || "",
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

  // Comment Section Logic
  const [commentFormData, setCommentFormData] = useState({
    comment: "",
    colId: selectedUser.status ? selectedUser.status : colId || "",
    userId: authUser.id,
  });

  useEffect(() => {
    dispatch(get_customer_comments(selectedUser._id));
  }, []);

  useEffect(() => {
    if (successMessage === "Comment added successfully" || successMessage === "Comment deleted successfully") {
      dispatch(get_customer_comments(selectedUser._id));
    }
  }, [selectedUser, successMessage]);

  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setCommentFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    dispatch(add_customer_comments({ commentFormData, cardId: selectedUser._id }));
  };

  const handleCommentDelete = (id) => {
    dispatch(delete_comments(id));
  };

  // Due Date Section Logic
  const [dueDateForm, setDueDateForm] = useState({
    due_date: "",
    due_date_note: "",
    colId: selectedUser.status ? selectedUser.status : colId || "",
    userId: authUser.id,
  });

  useEffect(() => {
    dispatch(get_due_date(selectedUser._id));
  }, []);

  useEffect(() => {
    if (dueDate) {
      setDueDateForm((prev) => ({
        ...prev,
        due_date: dueDate.due_date || "",
        due_date_note: dueDate.due_date_note || "",
      }));
    }
  }, [dueDate]);

  useEffect(() => {
    if (successMessage === "Due date added successfully" || successMessage === "Due date deleted successfully") {
      dispatch(get_due_date(selectedUser._id));
    }
  }, [selectedUser, successMessage]);

  const handleDueDateFormChange = (e) => {
    const { name, value } = e.target;
    setDueDateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDueDateSubmit = (e) => {
    e.preventDefault();
    dispatch(add_due_date({ dueDateForm, cardId: selectedUser._id }));
  };

  return (
    <AnimatePresence>
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] px-4">
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white w-full md:max-w-[70%] mx-auto rounded-radius shadow-2xl p-6 md:p-8 relative overflow-y-auto mt-5 custom-scrollbar"
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
            <div className="overflow-y-auto custom-scrollbar max-h-[70vh] grid grid-cols-1 md:grid-cols-12 gap-4">
              <form
                onSubmit={handleSubmit}
                className="space-y-4 mb-5 col-span-8"
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
                  {/* Status */}

                  <Dropdown
                    label={t("surname")}
                    value={formData.surname}
                    onChange={handleChange}
                    name="surname"
                    options={[
                      { value: t("mr"), label: t("mr") },
                      { value: t("mrs"), label: t("mrs") }
                    ]}
                  />

                  {/* First Name */}

                  <Input
                    label={t("first_name")}
                    type="text"
                    value={formData.first_name}
                    onChange={handleChange}
                    name="first_name"
                    required
                    error={errors.first_name}
                  />

                  {/* Last Name */}

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
                  {/* <Input
                    label={t("designation")}
                    type="text"
                    value={formData.designation}
                    onChange={handleChange}
                    name="designation"
                    error={errors.designation}
                  /> */}

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

                  {/* because the assigning process is now done by the assign user module not this dropdown */}
                  {/* <Dropdown
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
                  /> */}

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
                    label={t("type_of_operation")}
                    type="text"
                    value={formData.type_of_opration}
                    onChange={handleChange}
                    name="type_of_opration"
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
                    type="text"
                    value={formData.customer_situation}
                    onChange={handleChange}
                    name="customer_situation"
                    options={[
                      { value: t("customer_situation1"), label: t("customer_situation1") },
                      { value: t("urgent"), label: t("urgent") },
                      { value: t("evaluating"), label: t("evaluating") },
                      { value: t("decided"), label: t("decided") },
                    ]}
                  />
                  <Dropdown
                    label={t("purchase_status")}
                    type="text"
                    value={formData.purchase_status}
                    onChange={handleChange}
                    name="purchase_status"
                    options={[
                      { value: t("still_searching"), label: t("still_searching") },
                      {
                        value: t("selected_housing"),
                        label: t("selected_housing"),
                      },
                      { value: t("property"), label: t("property") },
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
              <div className="col-span-4 h-full space-y-4 bg-gray-100 p-2 rounded-lg">
                <div className="h-fit bg-primary/20 p-2 rounded-lg mb-4">
                  <AssignUser colId={colId} cardid={selectedUser._id} />
                </div>
                {/* <Button variant="destructive" onClick={() => setDeleteConfirmAlert(true)}>
                  <Trash2 className="w-4 h-4" />
                </Button> */}
                <form onSubmit={handleDueDateSubmit}>
                  <Input
                    label={t("due_date")}
                    name="due_date_note"
                    value={dueDateForm.due_date_note}
                    onChange={handleDueDateFormChange}
                  />
                  <Datepicker
                    // label={t("due_date")}
                    name="due_date"
                    value={dueDateForm.due_date}
                    onChange={handleDueDateFormChange}
                    dateFormat="dd/MM/yyyy" // <-- Customize your format here!
                  />
                  <button type="submit" className="px-6 py-2 mt-2 cursor-pointer bg-green-600 text-white rounded-sm hover:bg-green-700">
                    {loader ? t("loading") : t("submit")}
                  </button>
                </form>
              </div>
              <div className="space-y-4 mb-5 col-span-8">
                <form onSubmit={handleCommentSubmit}>
                  <Input
                    label={t("comment")}
                    value={commentFormData.comment}
                    onChange={handleCommentChange}
                    name="comment"
                    placeholder={t("enter_comment")}
                    error={errors.comment}
                  />
                  <button type="submit" className="px-6 py-2 mt-2 cursor-pointer bg-green-600 text-white rounded-sm hover:bg-green-700">
                    {t("submit")}
                  </button>
                </form>
                <div>
                  <div className="space-y-1 max-h-96 overflow-y-auto p-2 bg-gray-50 rounded-lg shadow-inner">
                    {comments && comments.map((comment, index) => (
                      // Comment component
                      <div key={index} className="relative flex items-center justify-between bg-white p-2 rounded-md shadow-sm border border-gray-200">
                        <p className="text-gray-800 text-sm pr-10">{comment.comment}</p>
                        {authUser?.role === "admin" ? (
                          <button
                            onClick={() => handleCommentDelete(comment._id)}
                            className="absolute top-1 right-1 p-1 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )
                          : authUser?.id === comment.userId && (
                            <button
                              onClick={() => handleCommentDelete(comment._id)}
                              className="absolute top-1 right-1 p-1 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <ConfirmDeleteModal
              isOpen={deleteConfirmAlert}
              onClose={() => setDeleteConfirmAlert(false)}
              onConfirm={() => handleDelete(selectedUser._id)}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditCard;
