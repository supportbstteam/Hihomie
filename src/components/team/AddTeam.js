import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { add_team, messageClear } from "@/store/userTema";
import { t } from "@/components/translations";
import Input from "../ui/Input";
import Dropdown from "../ui/DropDown";

const AddTeam = ({ setOpen }) => {
  const dispatch = useDispatch();
  const { loader, errorMessage, successMessage } = useSelector((state) => state.team);

  const [errors, setErrors] = useState({});
  const [details, setDetails] = useState(false); // Toggle for details section
  const [formData, setFormData] = useState({
    name: "",
    lname: "",
    email: "",
    phone: "",
    jobTitle: "",
    role: "",
    status: false,
    image: null,
    password: "",
  });

  const requiredFields = ["name", "lname", "email", "phone", "jobTitle", "role", "password", "image"];

  const validate = (values) => {
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!values[field] || (typeof values[field] === "string" && values[field].trim() === "")) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = "Invalid email format";
    }

    if (values.password && values.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleToggle = (e) => {
    setDetails(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      dispatch(add_team(formData));
    } else {
      toast.error("Please fix validation errors before submitting");
    }
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
  }, [successMessage, errorMessage]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
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

          <p className="text-gray-700 text-[20px] mb-6">{t("add_user_label")}</p>

          <form onSubmit={handleSubmit} className="space-y-4 mb-5 overflow-y-auto max-h-[70vh]">
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
              value={formData.role}
              onChange={handleChange}
              error={errors.role}
              options={[
                { value: "admin", label: "Administrator" },
                { value: "staff", label: "Staff" },
                { value: "accounting", label: "Accounting" },
                { value: "management", label: "Management" },
              ]}
            />

            <Input
              label={t("image")}
              type="file"
              accept="image/*"
              name="image"
              onChange={handleFileChange}
              required
              error={errors.image}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              error={errors.password}
            />

            {/* Details Toggle */}
            <div className="flex items-center justify-between mt-2">
              <span className="w-32 font-medium text-gray-700 text-sm">{t("details")}</span>
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
                <h3 className="text-lg font-semibold">{t("additional_details")}</h3>
                {/* Additional form inputs or components for details */}
                <Input
                  label={t("additional_info")}
                  name="additionalInfo"
                  value={formData.additionalInfo || ""}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={() =>
                  setFormData({
                    name: "",
                    lname: "",
                    email: "",
                    phone: "",
                    jobTitle: "",
                    role: "",
                    status: false,
                    image: null,
                    password: "",
                  })
                }
                type="reset"
                className="px-6 py-2 border border-stroke rounded-sm text-gray-700 hover:bg-gray-100"
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
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddTeam;
