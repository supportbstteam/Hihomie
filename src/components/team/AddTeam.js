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
  const { loader, errorMessage, successMessage } = useSelector(
    (state) => state.team
  );

  const [details, setDetails] = useState(false);

  const handleToggle = () => {
    setDetails(!details);
  };

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
    name: "",
    lname: "",
    email: "",
    phone: "",
    jobTitle: "",
    role: "",
    password: "",
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
    let newErrors = {
      name: "",
      lname: "",
      email: "",
      phone: "",
      jobTitle: "",
      role: "",
      password: "",
    };
    let valid = true;

    if (!formData.name) {
      newErrors.name = t("firstNameRequired");
      valid = false;
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = t("alphabetAllowed");
      valid = false;
    }

    if (!formData.lname) {
      newErrors.lname = t("lastNameRequired");
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

    if (!formData.password) {
      newErrors.password = t("passwordRequired");
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
      setOpen(false);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, setOpen]);

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

          <p className="text-gray-700 text-[20px] mb-6">
            {t("add_user_label")}
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 mb-5 overflow-y-auto max-h-[70vh]"
          >
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
                { value: "manager", label: "Manager" },
                { value: "staff", label: "Staff" },
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
              required
              error={errors.password}
            />

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
