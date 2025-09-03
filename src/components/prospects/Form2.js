import React, { useEffect, useState } from 'react'
import { t } from '@/components/translations';

const Form2 = ({ setAddressDetailsData, selectedUser }) => {

    const [addressDetailsData, setAddressLocalDetailsData] = useState({
        company_name: "",
        street: "",
        city: "",
        state: "",
        zip_code: "",
        country : "India",
        website : "",
    });

    useEffect(() => {
        if (selectedUser) {
            setAddressLocalDetailsData({
                company_name: selectedUser.company_name || "",
                street: selectedUser.street || "",
                city: selectedUser.city || "",
                state: selectedUser.state || "",
                zip_code: selectedUser.zip_code || "",
                country: selectedUser.country || "India",
                website: selectedUser.website || "",
            });

            // Parent state bhi update karna zaroori hai
            setAddressDetailsData({
                company_name: selectedUser.company_name || "",
                street: selectedUser.street || "",
                city: selectedUser.city || "",
                state: selectedUser.state || "",
                zip_code: selectedUser.zip_code || "",
                country: selectedUser.country || "India",
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
        <div className="flex flex-col gap-4 w-full">

            <div className="flex items-center gap-3">
                <label className="w-32 text-gray-700 font-medium text-sm">{t('company_name')}</label>
                <input
                    type="text"
                    className="flex-1 p-1 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                    name="company_name"
                    value={addressDetailsData.company_name}
                    onChange={handleChange}
                />
            </div>

            <div className="flex items-center gap-3">
                <label className="w-32 text-gray-700 font-medium text-sm">{t('street')}</label>
                <input
                    type="text"
                    className="flex-1 p-1 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                    name="street"
                    value={addressDetailsData.street}
                    onChange={handleChange}
                />
            </div>

            <div className="flex items-center gap-3">
                <label className="w-32 text-gray-700 font-medium text-sm">{t('city')}</label>
                <input
                    type="text"
                    className="flex-1 p-1 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                    name="city"
                    value={addressDetailsData.city}
                    onChange={handleChange}
                />
            </div>

            <div className="flex items-center gap-3">
                <label className="w-32 text-gray-700 font-medium text-sm">{t('state')}</label>
                <input
                    type="text"
                    className="flex-1 p-1 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                    name="state"
                    value={addressDetailsData.state}
                    onChange={handleChange}
                />
            </div>

            <div className="flex items-center gap-3">
                <label className="w-32 text-gray-700 font-medium text-sm">{t('pin_code')}</label>
                <input
                    type="text"
                    className="flex-1 p-1 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                    name="zip_code"
                    value={addressDetailsData.zip_code}
                    onChange={handleChange}
                />
            </div>

            <div className="flex items-center gap-3">
                <label className="w-32 text-gray-700 font-medium text-sm">{t('country')}</label>
                <select
                    name="country"
                    className="flex-1 p-1 bg-white border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                    value={addressDetailsData.country}
                    onChange={handleChange}
                    required
                >
                     <option value="Spain">Spain</option>
                    <option value="India">India</option>
                    <option value="América">América</option>
                    <option value="Austria">Austria</option>
                    <option value="Canadá">Canadá</option>
                </select>
            </div>

            <div className="flex items-center gap-3">
                <label className="w-32 text-gray-700 font-medium text-sm">{t('website')}</label>
                <input
                    type="text"
                    className="flex-1 p-1 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                    name="website"
                    value={addressDetailsData.website}
                    onChange={handleChange}
                />
            </div>



        </div>
    )
}

export default Form2