"use client";

import { useState } from "react";
import { FaRegClipboard } from "react-icons/fa";

const PlaceholderIcon = () => (
  <svg
    width="150"
    height="120"
    viewBox="0 0 150 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="35" y="10" width="80" height="100" rx="8" fill="#F7F8FA" />
    <path
      d="M35 18C35 13.5817 38.5817 10 43 10H107C111.418 10 115 13.5817 115 18V30H35V18Z"
      fill="#E5E6E8"
    />
    <rect x="45" y="45" width="60" height="6" rx="3" fill="#E5E6E8" />
    <rect x="45" y="60" width="40" height="6" rx="3" fill="#E5E6E8" />
    <rect x="45" y="75" width="50" height="6" rx="3" fill="#E5E6E8" />
    <path
      d="M102 70C102 61.1634 109.163 54 118 54C126.837 54 134 61.1634 134 70C134 78.8366 126.837 86 118 86C109.163 86 102 78.8366 102 70Z"
      fill="white"
      stroke="#E5E6E8"
      strokeWidth="2"
    />
    <path
      d="M118 64V76"
      stroke="#10b981"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M112 70H124"
      stroke="#10b981"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M18.9983 53.6653C18.9983 51.0765 21.0747 49 23.6635 49H34.3317C36.9205 49 38.9969 51.0765 38.9969 53.6653V76.3347C38.9969 78.9235 36.9205 81 34.3317 81H23.6635C21.0747 81 18.9983 78.9235 18.9983 76.3347V53.6653Z"
      fill="white"
      stroke="#E5E6E8"
      strokeWidth="2"
    />
    <rect x="24" y="54" width="10" height="2" rx="1" fill="#E5E6E8" />
  </svg>
);

const initialFormData = {
  property_location: "",
  property_price: "",
  bank_financing: 0,
  savings: "",
  itp: "",
  fees: "",
  roi_type: "",
  roi_interest: "",
  roi_year: "",
};
// roi == rate of interest

const initialResultData = {
  monthly_fee: "",
  mortgage_amount: "",
  total_fee: "",
  property_value: "",
  itp: "",
  fees: "",
  interest: "",
};

const locations = [
  { _id: "1", name: "A Coruña", itp: 9 },
  { _id: "2", name: "Álava", itp: 7 },
  { _id: "3", name: "Albacete", itp: 9 },
  { _id: "4", name: "Alicante", itp: 10 },
  { _id: "5", name: "Almería", itp: 7 },
  { _id: "6", name: "Asturias", itp: 8 },
  { _id: "7", name: "Ávila", itp: 8 },
  { _id: "8", name: "Badajoz", itp: 8 },
  { _id: "9", name: "Baleares (Illes)", itp: 8 },
  { _id: "10", name: "Barcelona", itp: 10 },
  { _id: "11", name: "Burgos", itp: 8 },
  { _id: "12", name: "Cáceres", itp: 8 },
  { _id: "13", name: "Cádiz", itp: 7 },
  { _id: "14", name: "Cantabria", itp: 8 },
  { _id: "15", name: "Castellón", itp: 10 },
  { _id: "16", name: "Ceuta", itp: 6 },
  { _id: "17", name: "Ciudad Real", itp: 9 },
  { _id: "18", name: "Córdoba", itp: 7 },
  { _id: "19", name: "Cuenca", itp: 9 },
  { _id: "20", name: "Girona", itp: 10 },
  { _id: "21", name: "Granada", itp: 7 },
  { _id: "22", name: "Guadalajara", itp: 9 },
  { _id: "23", name: "Guipúzcoa", itp: 7 },
  { _id: "24", name: "Huelva", itp: 7 },
  { _id: "25", name: "Huesca", itp: 8 },
  { _id: "26", name: "Jaén", itp: 7 },
  { _id: "27", name: "La Rioja", itp: 7 },
  { _id: "28", name: "Las Palmas", itp: 6.5 },
  { _id: "29", name: "León", itp: 8 },
  { _id: "30", name: "Lleida", itp: 10 },
  { _id: "31", name: "Lugo", itp: 9 },
  { _id: "32", name: "Madrid", itp: 6 },
  { _id: "33", name: "Málaga", itp: 7 },
  { _id: "34", name: "Melilla", itp: 6 },
  { _id: "35", name: "Murcia", itp: 8 },
  { _id: "36", name: "Navarra", itp: 6 },
  { _id: "37", name: "Ourense", itp: 9 },
  { _id: "38", name: "Palencia", itp: 8 },
  { _id: "39", name: "Pontevedra", itp: 9 },
  { _id: "40", name: "Salamanca", itp: 8 },
  { _id: "41", name: "Santa Cruz de Tenerife", itp: 6.5 },
  { _id: "42", name: "Segovia", itp: 8 },
  { _id: "43", name: "Sevilla", itp: 7 },
  { _id: "44", name: "Soria", itp: 8 },
  { _id: "45", name: "Tarragona", itp: 10 },
  { _id: "46", name: "Teruel", itp: 8 },
  { _id: "47", name: "Toledo", itp: 9 },
  { _id: "48", name: "Valencia", itp: 10 },
  { _id: "49", name: "Valladolid", itp: 8 },
  { _id: "50", name: "Vizcaya", itp: 7 },
  { _id: "51", name: "Zamora", itp: 8 },
  { _id: "52", name: "Zaragoza", itp: 8 },
];

const MortgageSimulator = () => {
  const [financing, setFinancing] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState(false);
  const [resultData, setResultData] = useState(initialResultData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationChange = (e) => {
    const location = locations.find((loc) => loc._id === e.target.value);
    setFormData((prev) => ({
      ...prev,
      property_location: location.name,
      itp: location.itp,
    }));
  };

  const handleReset = () => {
    setResult(false);
    setFormData(initialFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setResult(true);
    const r = formData.roi_interest / 12 / 100; // monthly interest rate
    const n = formData.roi_year * 12; // total months

    if (r === 0) {
      return formData.property_price / n; // simple division if interest = 0
    }

    // Stable formula
    const pp_after_financing = (formData.property_price * formData.bank_financing) / 100;
    const down_payment = formData.property_price - pp_after_financing;
    const denominator = 1 - Math.pow(1 + r, -n);
    const monthlyPayment = Math.round((pp_after_financing * r) / denominator);
    const totalPayment = monthlyPayment * n + down_payment;
    const totalInterest = parseInt(totalPayment) - parseInt(formData.property_price);
    const total_itp = (formData.property_price * formData.itp) / 100;
    const totalFee = parseInt(formData.property_price) + parseInt(formData.fees) + parseInt(total_itp);
    setResultData({
      monthly_fee: monthlyPayment,
      mortgage_amount: pp_after_financing,
      total_fee: totalFee,
      property_value: formData.property_price,
      itp: total_itp,
      fees: formData.fees,
      interest: totalInterest,
    });
  };

  // Base styles for form controls
  const formControlBase =
    "w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition";

  const sliderTrackStyle = {
    background: `linear-gradient(to right, #10b981 ${formData.bank_financing}%, #e5e7eb ${formData.bank_financing}%)`,
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEmail("");
  };

  const handleSendSimulation = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    
    const res = fetch("/api/send-email", { method: "POST", body: JSON.stringify({ email, data: resultData }) });
    
    handleCloseModal();
  };

  return (
    <>
      <div className="w-full mx-auto p-4">
        {/* Calculator Body */}
        <main className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Input Form Card */}
          <section className="lg:col-span-3 bg-white rounded-lg p-6 sm:p-8 shadow-lg">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
              <span className="text-emerald-500 font-bold text-xl">%</span>{" "}
              Mortgage Simulator
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="mb-6">
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Property Location
                  </label>
                  <select
                    id="location"
                    className={formControlBase}
                    onChange={handleLocationChange}
                  >
                    <option>Select Location</option>
                    {locations.map((location) => (
                      <option key={location._id} value={location._id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Property Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      €
                    </span>
                    <input
                      type="text"
                      name="property_price"
                      value={formData.property_price}
                      onChange={handleChange}
                      placeholder="Enter Price"
                      className={`${formControlBase} pl-8`}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="financing"
                    className="text-sm font-medium text-gray-700"
                  >
                    Bank Financing
                  </label>
                  <span className="font-semibold text-emerald-500">
                    {formData.bank_financing}%
                  </span>
                </div>
                <input
                  type="range"
                  name="bank_financing"
                  min="0"
                  max="100"
                  value={formData.bank_financing}
                  style={sliderTrackStyle}
                  onChange={handleChange}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="mb-6">
                <div className="grid grid-cols-3 gap-3 mb-2">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Savings Contributed
                    </label>
                    <input
                      type="text"
                      name="savings"
                      value={formData.savings}
                      onChange={handleChange}
                      placeholder="Enter Savings Contributed"
                      className={formControlBase}
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ITP/General Type
                    </label>
                    <input
                      type="text"
                      name="itp"
                      value={formData.itp}
                      onChange={handleChange}
                      placeholder="Enter ITP/General Type"
                      className={formControlBase}
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fees / Other Costs
                    </label>
                    <input
                      type="text"
                      name="fees"
                      value={formData.fees}
                      onChange={handleChange}
                      placeholder="Enter Fees / Other Costs"
                      className={formControlBase}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rate of Interest
                </label>
                <div className="grid grid-cols-6 gap-2 items-center mb-2">
                  <select className={`${formControlBase} col-span-2`}>
                    <option>Fixed</option>
                    <option>Variable</option>
                  </select>
                  <input
                    type="text"
                    name="roi_interest"
                    value={formData.roi_interest}
                    onChange={handleChange}
                    placeholder="Interest (TIH)"
                    className={`${formControlBase} col-span-2`}
                  />
                  <input
                    type="text"
                    name="roi_year"
                    value={formData.roi_year}
                    onChange={handleChange}
                    placeholder="Year"
                    className={`${formControlBase} col-span-2`}
                  />
                  {/* <button
                    type="button"
                    className="w-11 h-11 col-span-1 rounded-md border border-gray-300 bg-white text-2xl font-light text-gray-500 hover:border-emerald-500 hover:text-emerald-500 transition"
                  >
                    +
                  </button> */}
                </div>
                {/* <div className="grid grid-cols-7 gap-2 items-center">
                  <select className={`${formControlBase} col-span-2`}>
                    <option>Variable</option>
                    <option>Fixed</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Interest (TIH)"
                    className={`${formControlBase} col-span-2`}
                  />
                  <input
                    type="text"
                    placeholder="Year"
                    className={`${formControlBase} col-span-2`}
                  />
                </div> */}
              </div>
              <div className="flex justify-end mt-6 gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-gray-400 text-white p-2 px-5 rounded-md hover:bg-gray-600 transition"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 text-white p-2 px-3 rounded-md hover:bg-emerald-600 transition"
                >
                  Calculate
                </button>
              </div>
            </form>
          </section>

          {/* Result Card */}
          <section className="lg:col-span-2 bg-white rounded-lg p-6 sm:p-8 shadow-lg flex flex-col">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
              <span className="text-emerald-500 flex items-center">
                <FaRegClipboard className="h-6 w-6" />
              </span>{" "}
              Result
            </h2>
            {!result ? (
              <div className="flex-grow flex flex-col justify-center items-center text-center">
                <div className="mb-6">
                  <PlaceholderIcon />
                </div>
                <p className="max-w-xs text-sm leading-relaxed text-gray-500">
                  Enter your property details to see monthly payments and total
                  costs.
                </p>
              </div>
            ) : (
              <div className="flex-grow flex flex-col justify-start">
                {" "}
                {/* Align content to top of result card */}
                <div className="bg-emerald-50 p-4 rounded-md mb-6">
                  <p className="text-sm text-emerald-700 font-medium mb-1">
                    Your Monthly Fee
                  </p>
                  <p className="text-2xl font-bold text-emerald-700">
                    €{resultData.monthly_fee}/month
                  </p>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500 text-sm">
                    Total Purchase Cost
                  </span>
                  <span className="text-gray-800 font-medium">
                    €{resultData.total_fee}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500 text-sm">Property Value</span>
                  <span className="text-gray-800 font-medium">
                    €{resultData.property_value}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500 text-sm">
                    ITP Type/General Type
                  </span>
                  <span className="text-gray-800 font-medium">
                    €{resultData.itp}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500 text-sm">
                    Fees / Other Costs
                  </span>
                  <span className="text-gray-800 font-medium">
                    €{resultData.fees}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500 text-sm">Total Interest</span>
                  <span className="text-gray-800 font-medium">
                    €{resultData.interest}
                  </span>
                </div>
                <div>
                  <button type="button" onClick={() => setIsModalOpen(true)} className="bg-emerald-500 text-white p-2 mt-3 px-3 rounded-md hover:bg-emerald-600 transition">
                    Send Mortagage Simulation
                  </button>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* --- New Email Modal --- */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={handleCloseModal} // Close on backdrop click
        >
          <div
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()} // Prevent closing on modal click
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Send Simulation
            </h3>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={formControlBase} // Re-use existing style
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleCloseModal}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendSimulation}
                className="bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600 transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MortgageSimulator;
