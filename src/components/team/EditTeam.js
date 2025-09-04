'use client'
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { update_team } from '@/store/userTema';
import { t } from '@/components/translations';

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
      newErrors.name = "First Name is required";
      valid = false;
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = "Only alphabets are allowed";
      valid = false;
    }

    if (!formData.lname) {
      newErrors.lname = "Last Name is required";
      valid = false;
    } else if (!/^[A-Za-z\s]+$/.test(formData.lname)) {
      newErrors.lname = "Only alphabets are allowed";
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
      valid = false;
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
      valid = false;
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Only numeric values are allowed";
      valid = false;
    }

    if (!formData.jobTitle) {
      newErrors.jobTitle = "Job Title is required";
      valid = false;
    } else if (!/^[A-Za-z\s]+$/.test(formData.jobTitle)) {
      newErrors.jobTitle = "Only alphabets are allowed";
      valid = false;
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // ✅ Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    dispatch(update_team(formData));
  };

  // ✅ Helper for red border
  const inputClass = (field) =>
    `p-2 rounded-md focus:ring-1 focus:outline-none ${
      errors[field]
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
            {/* First Name */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">{t('first_name')}*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass("name")}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Last Name */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">{t('last_name')}*</label>
              <input
                type="text"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                className={inputClass("lname")}
              />
              {errors.lname && <p className="text-red-500 text-xs mt-1">{errors.lname}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">{t('email')}*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass("email")}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">{t('phone')}*</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={inputClass("phone")}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Job Title */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">{t('position')}*</label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                className={inputClass("jobTitle")}
              />
              {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle}</p>}
            </div>

            {/* Role */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">{t('role')}</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={inputClass("role")}
              >
                <option value="">--Seleccionar Rol--</option>
                <option value="admin">Administradora</option>
                <option value="staff">Personal</option>
                <option value="accounting">Contabilidad</option>
                <option value="management">Gestión</option>
              </select>
              {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-medium text-sm">{t('password')}</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep same"
                className="p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
              />
            </div>

            {/* Status */}
            <div className="flex flex-col">
              <span className="font-medium text-gray-700 mb-1">{t('status')}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="status"
                  checked={!!formData.status}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-green-600 transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></div>
              </label>
            </div>

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
