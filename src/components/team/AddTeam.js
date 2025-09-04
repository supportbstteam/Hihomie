'use client'
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { add_team, messageClear } from '@/store/userTema';
import { t } from '@/components/translations';

const AddTeam = ({ setOpen }) => {
  const dispatch = useDispatch();
  const { loader, errorMessage, successMessage } = useSelector(state => state.team);

  const [formData, setFormData] = useState({
    name: "",
    lname: "",
    email: "",
    phone: "",
    jobTitle: "",
    role: "",
    password: "",
    status: true,
    image: null,
  });

  const [errors, setErrors] = useState({
    name: '',
    lname: '',
    email: '',
    phone: '',
    jobTitle: '',
    role: '',
    password: '',
    image: ''
  });

  // Handle input change
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

  // Validation
  const validateForm = () => {
    let newErrors = { name: '', lname: '', email: '', phone: '', jobTitle: '', role: '', password: '', image: '' };
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

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    if (!formData.image) {
      newErrors.image = "Image is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }
    dispatch(add_team(data));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      setOpen(false);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, setOpen]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/40 flex justify-center items-start z-[100] px-4">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 20, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white w-full sm:w-[50%] md:max-w-[40%] mx-auto rounded-xl shadow-2xl p-6 md:p-8 relative mt-5 max-h-[90vh] flex flex-col"
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>

          <p className="text-gray-700 text-[20px] mb-6">{t('add_user_label')}</p>

          <form onSubmit={handleSubmit} className="space-y-4 mb-5 overflow-y-auto max-h-[70vh]">

            {/* First Name */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-medium text-sm">{t('first_name')}*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`p-2 border rounded-md text-sm focus:outline-none focus:ring-2 
                  ${errors.name ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-green-400"}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Last Name */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-medium text-sm">{t('last_name')}*</label>
              <input
                type="text"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                className={`p-2 border rounded-md text-sm focus:outline-none focus:ring-2 
                  ${errors.lname ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-green-400"}`}
              />
              {errors.lname && <p className="text-red-500 text-xs mt-1">{errors.lname}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-medium text-sm">{t('email')}*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`p-2 border rounded-md text-sm focus:outline-none focus:ring-2 
                  ${errors.email ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-green-400"}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-medium text-sm">{t('phone')}*</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`p-2 border rounded-md text-sm focus:outline-none focus:ring-2 
                  ${errors.phone ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-green-400"}`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Job Title */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-medium text-sm">{t('position')}*</label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                className={`p-2 border rounded-md text-sm focus:outline-none focus:ring-2 
                  ${errors.jobTitle ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-green-400"}`}
              />
              {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle}</p>}
            </div>

            {/* Role */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-medium text-sm">{t('role')}</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`p-2 bg-white border rounded-md text-sm focus:outline-none focus:ring-2 
                  ${errors.role ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-green-400"}`}
              >
                <option value="">--Seleccionar Rol--</option>
                <option value="admin">Administradora</option>
                <option value="staff">Personal</option>
                <option value="accounting">Contabilidad</option>
                <option value="management">Gestión</option>
              </select>
              {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
            </div>

            {/* Image */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-medium text-sm">{t('image')}*</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={`p-2 border rounded-md text-sm focus:outline-none focus:ring-2 
                  ${errors.image ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-green-400"}`}
              />
              {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-medium text-sm">{t('password')}*</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`p-2 border rounded-md text-sm focus:outline-none focus:ring-2 
                  ${errors.password ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-green-400"}`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-medium text-sm">{t('status')}</label>
              <label className="relative inline-flex items-center cursor-pointer w-fit">
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

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                type="reset"
                className="px-6 cursor-pointer py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                onClick={() => setFormData({
                  name: "",
                  lname: "",
                  email: "",
                  phone: "",
                  jobTitle: "",
                  role: "",
                  password: "",
                  status: false,
                  image: null,
                })}
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

export default AddTeam;
