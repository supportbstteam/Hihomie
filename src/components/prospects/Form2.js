import React, { useEffect, useState } from "react";
import { t } from "@/components/translations";
import Input from "../ui/Input";
import Dropdown from "../ui/DropDown";

const Form2 = ({ setAddressDetailsData, selectedUser }) => {
  const [addressDetailsData, setAddressLocalDetailsData] = useState({
    company_name: "",
    street: "",
    city: "",
    state: "",
    zip_code: "",
    country: "Spain",
    website: "",
  });

  useEffect(() => {
    if (selectedUser) {
      setAddressLocalDetailsData({
        company_name: selectedUser.company_name || "",
        street: selectedUser.street || "",
        city: selectedUser.city || "",
        state: selectedUser.state || "",
        zip_code: selectedUser.zip_code || "",
        country: selectedUser.country || "Spain",
        website: selectedUser.website || "",
      });

      // Parent state bhi update karna zaroori hai
      setAddressDetailsData({
        company_name: selectedUser.company_name || "",
        street: selectedUser.street || "",
        city: selectedUser.city || "",
        state: selectedUser.state || "",
        zip_code: selectedUser.zip_code || "",
        country: selectedUser.country || "Spain",
        website: selectedUser.website || "",
      });
    }
  }, [selectedUser, setAddressDetailsData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressLocalDetailsData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // update parent state also
    setAddressDetailsData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <Input
        label={t("company_name")}
        type="text"
        name="company_name"
        value={addressDetailsData.company_name}
        onChange={handleChange}
      />

      <Input
        label={t("street")}
        type="text"
        name="street"
        value={addressDetailsData.street}
        onChange={handleChange}
      />

      <Input
        label={t("city")}
        type="text"
        name="city"
        value={addressDetailsData.city}
        onChange={handleChange}
      />

      <Input
        label={t("state")}
        type="text"
        name="state"
        value={addressDetailsData.state}
        onChange={handleChange}
      />

      <Input
        label={t("pin_code")}
        type="text"
        name="zip_code"
        value={addressDetailsData.zip_code}
        onChange={handleChange}
      />

      <Dropdown
        label={t("country")}
        name="country"
        value={addressDetailsData.country}
        onChange={handleChange}
        required
        options={[
          { value: "Spain", label: "Spain" },
          { value: "India", label: "India" },
          { value: "América", label: "América" },
          { value: "Austria", label: "Austria" },
          { value: "Canadá", label: "Canadá" },
        ]}

      />

      <Input
        label={t("website")}
        type="text"
        name="website"
        value={addressDetailsData.website}
        onChange={handleChange}
      />
    </div>
  );
};

export default Form2;
