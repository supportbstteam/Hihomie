'use client'
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { update_team } from '@/store/userTema';
import { t } from '@/components/translations';
import Input from '../ui/Input';
import Dropdown from '../ui/DropDown';

const EditTeam = ({ user, setUser }) => {
  const dispatch = useDispatch();
  const { loader } = useSelector(state => state.team);

  const defaultForm = {
    name: "",
    lname: "",
    email: "",
    phone: "",
    jobTitle: "",
    role: "",
    status: false,
    password: "",
    id: "",
    image: null,
  };

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(defaultForm);

  // ✅ Handle change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle file change
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const [details, setDetails] = useState(false);

  const handleToggle = () => {
    setDetails(!details);
  };

  // ✅ Load data from props
  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || "",
        lname: user?.lname || "",
        email: user?.email || "",
        phone: user?.phone || "",
        jobTitle: user?.jobTitle || "",
        role: user?.role || "",
        status: user?.status ?? false,
        password: "",
        id: user?._id || "",
        additionalInfo: user?.additionalInfo || "",
      });
    } else {
      setFormData(defaultForm);
    }
  }, [user]);

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};
    let valid = true;

    if (!formData.name) {
      newErrors.name = t("nameRequired");
      valid = false;
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = t("alphabetAllowed");
      valid = false;
    }

    if (!formData.lname) {
      newErrors.lname = t("lnameRequired");
      valid = false;
    } else if (!/^[A-Za-z\s]+$/.test(formData.lname)) {
      newErrors.lname = t("alphabetAllowed");
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = t("emailRequired");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("validEmail");
      valid = false;
    }

    if (!formData.phone) {
      newErrors.phone = t("phoneRequired");
      valid = false;
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = t("numericAllowed");
      valid = false;
    }

    if (!formData.jobTitle) {
      newErrors.jobTitle = t("jobTitleRequired");
      valid = false;
    } else if (!/^[A-Za-z\s]+$/.test(formData.jobTitle)) {
      newErrors.jobTitle = t("alphabetAllowed");
      valid = false;
    }

    if (!formData.role) {
      newErrors.role = t("roleRequired");
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // ✅ Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    dispatch(update_team(data));
    // dispatch(update_team(formData));
  };

  // ✅ Helper for red border
  const inputClass = (field) =>
    `p-2 rounded-md focus:ring-1 focus:outline-none ${errors[field]
      ? "border-red-500 focus:ring-red-400"
      : "border-gray-300 focus:ring-green-400"
    } border`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/40 flex items-start justify-center z-[100] px-4">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 20, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white w-full sm:w-[50%] md:max-w-[40%] mx-auto rounded-xl shadow-2xl p-6 md:p-8 relative mt-5 max-h-[90vh] flex flex-col"
        >
          <button
            onClick={() => setUser(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>

          <p className="text-gray-700 text-[20px] mb-6 font-semibold">{t('edit_user')}</p>

          <form onSubmit={handleSubmit} className="space-y-4 mb-5 max-h-[77vh] overflow-y-auto">
            <Input
              label={t("first_name")}
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              error={errors.name}
            />

            <Input
              label={t("last_name")}
              name="lname"
              value={formData.lname}
              onChange={handleChange}
              required
              error={errors.lname}
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
              label={t("phone")}
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              error={errors.phone}
            />
            <Input
              label={t("position")}
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              required
              error={errors.jobTitle}
            />

            <Dropdown
              label={t("role")}
              name="role"
              title={t("select_role")}
              value={formData.role}
              onChange={handleChange}
              error={errors.role}
              required
              options={[
                { value: "manager", label: t("manager") },
                { value: "staff", label: t("staff") },
                { value: "external", label: t("external") },
              ]}
            />

            <Input
              label={t("image")}
              type="file"
              accept="image/*"
              name="image"
              onChange={handleFileChange}
              error={errors.image}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            {/* Status */}
            <div className="flex flex-col">
              <span className="font-medium text-gray-700 mb-1">{t('status')}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-green-600 transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></div>
              </label>
            </div>

            {/* Details Toggle */}
            <div className="flex items-center justify-between mt-2">
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

            {/* Details Section */}
            {details && (
              <div className="p-4 bg-gray-50 border rounded-md">
                <h3 className="text-lg font-semibold">
                  {t("additional_details")}
                </h3>
                {/* Additional form inputs or components for details */}
                <Input
                  label={t("additional_info")}
                  name="additionalInfo"
                  value={formData.additionalInfo || ""}
                  onChange={handleChange}
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 justify-end pt-4">
              <button
                type="reset"
                onClick={() => setFormData(defaultForm)}
                className="px-6 cursor-pointer py-2 border rounded-md text-gray-700 hover:bg-gray-100"
              >
                {t('cancel')}
              </button>
              <button
                disabled={loader}
                type="submit"
                className="px-6 cursor-pointer py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {loader ? t('loading') : t('submit')}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditTeam;
