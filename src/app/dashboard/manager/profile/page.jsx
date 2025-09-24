"use client";

import { useState, useEffect } from "react";
import { t } from "@/components/translations";
import Input from "@/components/ui/Input";
// import Dropdown from "@/components/ui/DropDown";
import { useDispatch, useSelector } from "react-redux";
import { get_userById, update_userById } from "@/store/userTema";
import useUserFromSession from "@/lib/useUserFromSession";
import toast from "react-hot-toast"
const ManagerProfile = () => {
  const authUser = useUserFromSession();
  const dispatch = useDispatch();
  const { userById, loader, successMessage, errorMessage } = useSelector((state) => state.team);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  useEffect(() => {
    if (authUser) {
        dispatch(get_userById({id: authUser?.id}));
    }
  }, [authUser, dispatch]);

    useEffect(() => {
      setFormData({
        name: userById.name || "",
        email: userById.email || "",
        role: userById.role || "",
      });
    }, [userById]);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let newErrors = {
      email: "",
      role: "",
    };
    let valid = true;

    if (!formData.email.trim()) {
      newErrors.email = t("emailRequired");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("validEmail");
      valid = false;
    }
    if (!formData.role) {
      newErrors.role = t("roleRequired");
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(update_userById({id: authUser?.id, object:formData}));
  };
  
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
    }
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [successMessage, errorMessage]);

  return (
    // Main container
    <div className="bg-gray-50 flex items-center justify-center font-sans p-4">
      {/* Form Card */}
      <div className="w-full p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          User Profile
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 grid grid-cols-2 gap-6"
        >
          {/* name */}
          <Input
            label={t("name")}
            type="text"
            name="name"
            id="name"
            title={t("name")}
            value={formData.name ?? ""}
            onChange={handleChange}
          />

          {/* Email */}
          <Input
            label={t("email")}
            type="email"
            name="email"
            id="email"
            title={t("email")}
            value={formData.email ?? ""}
            onChange={handleChange}
            required
          />
          
          <Input
            label={t("role")}
            type="text"
            name="role"
            id="role"
            title={t("role")}
            value={t(formData.role) ?? ""}
            onChange={handleChange}
            disabled
          />

          {/* Password */}
          <Input
            label={t("password")}
            type="password"
            name="password"
            id="password"
            title={t("password")}
            value={formData.password ?? ""}
            onChange={handleChange}
            placeholder="Leave blank to keep current"
          />

          {/* Submit Button */}
          <div className="col-span-2">
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
            >
              {loader ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagerProfile;
