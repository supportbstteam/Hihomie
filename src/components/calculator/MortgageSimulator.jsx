"use client";

import { useState, useEffect, useRef } from "react";
import { FaRegClipboard } from "react-icons/fa";
import Dropdown from "@/components/ui/DropDown";
import DynamicEmailDropdown from "@/components/DynamicEmailDropdown";
import { t } from "@/components/translations";

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
  property_price: 100000,
  bank_financing: 100,
  savings: 0,
  itp: "",
  fees: 0,
  other_costs: 2500,
  roi_type: "fixed",
  roi_interest: 2.15,
  roi_year: 30,
};
// roi == rate of interest

const initialResultData = {
  monthly_fee: 0,
  mortgage_amount: "",
  total_fee: "",
  property_value: "",
  itp: "",
  fees: "",
  interest: "",
  savings: "",
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

  const [principal, setPrincipal] = useState(0);
  const [loanTerm, setLoanTerm] = useState(1);
  const [interestRate, setInterestRate] = useState(1);
  const [monthlyLoanPayment, setMonthlyLoanPayment] = useState("");
  const [totalLoanPayment, setTotalLoanPayment] = useState("");
  const [totalLoanInterest, setTotalLoanInterest] = useState("");

  const [salary1, setSalary1] = useState(0);
  const [payment1, setPayment1] = useState(12);
  const [salary2, setSalary2] = useState(0);
  const [payment2, setPayment2] = useState(12);
  const [sumOfDebts, setSumOfDebts] = useState(0);
  const [debtRatio, setDebtRatio] = useState(0);

  const timerRef = useRef(null);
  const mortgageTimerRef = useRef(null);
  const debtRatioTimerRef = useRef(null);

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "bank_financing") {
      value = Math.min(100, Math.max(0, Number(value)));
    }

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
    setResultData(initialResultData);
  };

  const calculateMortgage = () => {
    // parse numeric inputs once (use radix 10 for parseInt)
    const propertyPrice = parseInt(formData.property_price, 10) || 0;
    const itpPercent = parseInt(formData.itp, 10) || 0;
    const bankFinancingPercent = parseInt(formData.bank_financing, 10) || 0;
    const fees = parseInt(formData.fees, 10) || 0;
    const otherCosts = parseInt(formData.other_costs, 10) || 0;
    const savings = parseInt(formData.savings, 10) || 0;

    // roi and years: roi can be fractional, so use parseFloat
    const roiAnnual = parseFloat(formData.roi_interest) || 0;
    const roiYears = parseInt(formData.roi_year, 10) || 0;

    // derived values
    const r = roiAnnual / 12 / 100; // monthly rate (decimal)
    const n = Math.max(roiYears * 12, 1); // total months (avoid divide-by-zero)

    // ITP amount and financed property price
    const totalItp = Math.round((propertyPrice * itpPercent) / 100);
    const ppAfterFinancing = Math.round(
      (propertyPrice * bankFinancingPercent) / 100
    );
    const downPayment = propertyPrice - ppAfterFinancing;

    // total fees and extra expenses calculation
    const totalFee = propertyPrice + fees + totalItp + otherCosts;
    const extraExpenses = totalItp + otherCosts + fees + downPayment;

    // mortgage (amount to be financed) and credit (if savings insufficient)
    let mortgageAmount = 0;
    let creditAmount = 0;

    if (savings >= extraExpenses) {
      mortgageAmount = Math.round(totalFee - savings);
    } else {
      mortgageAmount = Math.round(propertyPrice - downPayment);
      creditAmount = extraExpenses - savings;
    }

    // compute monthly payment (handle zero-interest case)
    let monthlyPayment;
    if (r === 0) {
      monthlyPayment = Math.round(mortgageAmount / n);
    } else {
      const denominator = 1 - Math.pow(1 + r, -n);
      monthlyPayment = Math.round((mortgageAmount * r) / denominator);
    }

    // totals and interest
    const totalPayment = Math.round(monthlyPayment * n + downPayment);
    const totalInterest = totalPayment - propertyPrice;

    // set result state
    setResultData({
      monthly_fee: monthlyPayment,
      mortgage_amount: mortgageAmount,
      // credit_amount: creditAmount,
      total_fee: totalFee,
      property_value: propertyPrice,
      itp: totalItp,
      fees,
      other_costs: otherCosts,
      interest: totalInterest,
      savings: savings,
    });

    // also return the object if caller needs it
    return {
      monthly_fee: monthlyPayment,
      mortgage_amount: mortgageAmount,
      credit_amount: creditAmount,
      total_fee: totalFee,
      property_value: propertyPrice,
      itp: totalItp,
      fees,
      other_costs: otherCosts,
      interest: totalInterest,
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setResult(true);
    calculateMortgage();
  };

  useEffect(() => {
    if (mortgageTimerRef.current) clearTimeout(mortgageTimerRef.current);
    mortgageTimerRef.current = setTimeout(() => {
      setResult(true);
      calculateMortgage();
    }, 2000);

    return () => {
      if (mortgageTimerRef.current) clearTimeout(mortgageTimerRef.current);
    };
  }, [formData]);

  const calculateLoan = () => {
    if (loanTerm && interestRate) {
      const r = interestRate / 12 / 100; // monthly interest rate
      const n = loanTerm * 12; // total months

      if (r === 0) {
        return principal / n; // simple division if interest = 0
      }

      // Stable formula
      const denominator = 1 - Math.pow(1 + r, -n);
      const monthlyPayment = Math.round((principal * r) / denominator);
      const totalPayment = monthlyPayment * n;
      const totalInterest = totalPayment - principal;
      setMonthlyLoanPayment(monthlyPayment);
      setTotalLoanPayment(totalPayment);
      setTotalLoanInterest(totalInterest);
    } else {
      alert("Please enter all the fields");
    }
  };
  const handleLoanSubmit = (e) => {
    e.preventDefault();
    calculateLoan();
  };

  // for automatic calculation of loan just after entering value
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      calculateLoan();
    }, 2000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [principal, loanTerm, interestRate]);

  const calculateDebtRatio = () => {
    const sal1int = parseInt(salary1);
    const sal2int = parseInt(salary2);
    const pay1int = parseInt(payment1);
    const pay2int = parseInt(payment2);
    const sumOfDebtsint = parseInt(sumOfDebts);
    const totalSalary = sal1int * pay1int + sal2int * pay2int;
    const totalDebt = sumOfDebtsint * 12 + resultData.monthly_fee * 12;
    if (totalSalary > 0) {
      const debtRatio = (totalDebt / totalSalary) * 100;
      setDebtRatio(Number(debtRatio.toFixed(2)));
    }
  };

  const handleDebtRatioCalculation = (e) => {
    e.preventDefault();
    calculateDebtRatio();
  };

  useEffect(() => {
    if (debtRatioTimerRef.current) clearTimeout(debtRatioTimerRef.current);
    debtRatioTimerRef.current = setTimeout(() => {
      calculateDebtRatio();
    }, 2000);
    return () => {
      if (debtRatioTimerRef.current) clearTimeout(debtRatioTimerRef.current);
    };
  }, [salary1, salary2, payment1, payment2, sumOfDebts]);

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

  const formatKey = (key) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const handleSendSimulation = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    const subject = "Your Mortgage Simulation Results";
    const mailContent = `
                        <h1>Your Mortgage Simulation</h1>
                        <p>Hello,</p>
                        <p>Thank you for using our calculator. Here are the results you requested:</p>

                        <ul>
                          ${Object.entries(resultData)
                            .map(([key, value]) => {
                              return `<li>${formatKey(
                                key
                              )}: <strong>€${value}</strong></li>`;
                            })
                            .join("")}
                        </ul>
                        `;

    const res = fetch("/api/send-email", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        subject: subject,
        mailContent: mailContent,
      }),
    });

    handleCloseModal();
  };

  const [lead, setLead] = useState("");
  return (
    <>
      <div className="w-full min-h-screen mx-auto p-4">
        {/* Mortgage Simulator Calculator */}
        <main className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0">
          {/* Input Form Card */}
          <section className="lg:col-span-3 bg-white rounded-lg p-6 sm:p-8 shadow-lg">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
              <span className="text-emerald-500 font-bold text-xl">%</span>{" "}
              {t("mortgage_simulator")}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="mb-6">
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t("property_location")}
                  </label>
                  <select
                    id="location"
                    className={formControlBase}
                    onChange={handleLocationChange}
                  >
                    <option>{t("select_location")}</option>
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
                    {t("property_price")}
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
                    {t("bank_financing")}
                  </label>
                  <div className="relative w-24">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      name="bank_financing"
                      value={formData.bank_financing}
                      onChange={handleChange}
                      className="w-full px-2 py-1 pr-6 border border-gray-300 rounded-md text-sm text-right focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />

                    {/* Percentage symbol */}
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      %
                    </span>
                  </div>
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
                <div className="grid grid-cols-4 gap-3 mb-2">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("savings_contributed")}
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
                      {t("itp_general_type")}
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
                      {t("fees")}
                    </label>
                    <input
                      type="text"
                      name="fees"
                      value={formData.fees}
                      onChange={handleChange}
                      placeholder="Enter Fees"
                      className={formControlBase}
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("other_costs")}
                    </label>
                    <input
                      type="text"
                      name="other_costs"
                      value={formData.other_costs}
                      onChange={handleChange}
                      placeholder="Enter Other Costs"
                      className={formControlBase}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("interest_details")}
                </label>
                <div className="grid grid-cols-6 gap-2 items-center mb-2">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("type")}
                    </label>
                    <select
                      name="roi_type"
                      value={formData.roi_type}
                      onChange={(e) => {
                        const selected = e.target.value;

                        if (selected === "fixed") {
                          setFormData({
                            ...formData,
                            roi_type: selected,
                            roi_interest: 2.15,
                            roi_year: 30,
                          });
                        } else if (selected === "variable") {
                          setFormData({
                            ...formData,
                            roi_type: selected,
                            roi_interest: 0.25,
                            roi_year: 30,
                          });
                        }
                      }}
                      className={`${formControlBase}`}
                    >
                      <option value="fixed">Fixed</option>
                      <option value="variable">Variable</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("interest")}
                    </label>
                    <input
                      type="number"
                      name="roi_interest"
                      value={formData.roi_interest}
                      onChange={handleChange}
                      placeholder="Interest (TIH)"
                      className={`${formControlBase}`}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("year")}
                    </label>
                    <input
                      type="number"
                      name="roi_year"
                      value={formData.roi_year}
                      onChange={handleChange}
                      placeholder="Year"
                      className={`${formControlBase} col-span-2`}
                    />
                  </div>
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
                  {t("reset")}
                </button>
                {/* <button
                  type="submit"
                  className="bg-emerald-500 text-white p-2 px-3 rounded-md hover:bg-emerald-600 transition"
                >
                  Calculate
                </button> */}
              </div>
            </form>
          </section>

          {/* Result Card */}
          <section className="lg:col-span-2 bg-white rounded-lg p-6 sm:p-8 shadow-lg flex flex-col">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
              <span className="text-emerald-500 flex items-center">
                <FaRegClipboard className="h-6 w-6" />
              </span>{" "}
              {t("result")}
            </h2>
            {!result ? (
              <div className="flex-grow flex flex-col justify-center items-center text-center">
                <div className="mb-6">
                  <PlaceholderIcon />
                </div>
                <p className="max-w-xs text-sm leading-relaxed text-gray-500">
                  {t("mortgage_result_string")}
                </p>
              </div>
            ) : (
              <div className="flex-grow flex flex-col justify-start">
                {" "}
                {/* Align content to top of result card */}
                <div className="bg-emerald-50 p-4 rounded-md mb-6">
                  <p className="text-sm text-emerald-700 font-medium mb-1">
                    {t("monthly_fee")}
                  </p>
                  <p className="text-2xl font-bold text-emerald-700">
                    €{resultData.monthly_fee}/{t("month")}
                  </p>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500 text-sm">
                    {t("mortgage_amount")}
                  </span>
                  <span className="text-gray-800 font-medium">
                    €{resultData.mortgage_amount}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500 text-sm">
                    {t("total_purchase_cost")}
                  </span>
                  <span className="text-gray-800 font-medium">
                    €{resultData.total_fee}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500 text-sm">
                    {t("property_value")}
                  </span>
                  <span className="text-gray-800 font-medium">
                    €{resultData.property_value}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500 text-sm">
                    {t("itp_general_type")}
                  </span>
                  <span className="text-gray-800 font-medium">
                    €{resultData.itp}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500 text-sm">{t("fees")}</span>
                  <span className="text-gray-800 font-medium">
                    €{resultData.fees}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500 text-sm">
                    {t("other_costs")}
                  </span>
                  <span className="text-gray-800 font-medium">
                    €{resultData.other_costs}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500 text-sm">
                    {t("total_interest")}
                  </span>
                  <span className="text-gray-800 font-medium">
                    €{resultData.interest}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500 text-sm">{t("savings")}</span>
                  <span className="text-gray-800 font-medium">
                    €{resultData.savings}
                  </span>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="bg-emerald-500 text-white p-2 mt-3 px-3 rounded-md hover:bg-emerald-600 transition"
                  >
                    {t("send_mortgage_simulation")}
                  </button>
                </div>
              </div>
            )}
          </section>
        </main>

        {/* Loan Calculator */}
        <main className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6 min-h-0">
          <section className="col-span-3 bg-white rounded-lg p-6 sm:p-8 shadow-lg">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
              <span className="text-emerald-500">%</span> {t("loan_calculator")}
            </h2>
            <form onSubmit={handleLoanSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="form-group">
                  <label
                    htmlFor="creditAmount"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t("credit_amount")}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="creditAmount"
                      value={principal}
                      onChange={(e) => setPrincipal(e.target.value)}
                      className={formControlBase}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label
                    htmlFor="loanTerm"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t("loan_term")}
                  </label>
                  <input
                    type="number"
                    id="loanTerm"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    className={formControlBase}
                  />
                </div>
              </div>

              <div className="mb-8">
                {" "}
                {/* Increased margin bottom as per image */}
                <label
                  htmlFor="interestRate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("interest_rate")}
                </label>
                <input
                  type="number"
                  id="interestRate"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className={formControlBase}
                />
              </div>

              <div className="flex justify-end gap-3">
                {" "}
                {/* Buttons aligned to the right with gap */}
                {/* <button
                  type="submit"
                  className="px-6 py-2 rounded-md text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-colors"
                >
                  Calculate
                </button> */}
              </div>
            </form>
          </section>
          <section className="col-span-2 bg-white rounded-lg p-6 sm:p-8 shadow-lg flex flex-col">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
              <span className="text-emerald-500 flex items-center">
                <FaRegClipboard className="h-6 w-6" />
              </span>{" "}
              {t("result")}
            </h2>
            <div className="flex-grow flex flex-col justify-start">
              {" "}
              {/* Align content to top of result card */}
              <div className="bg-emerald-50 p-4 rounded-md mb-6">
                <p className="text-sm text-emerald-700 font-medium mb-1">
                  {t("monthly_fee")}
                </p>
                <p className="text-2xl font-bold text-emerald-700">
                  €{monthlyLoanPayment}/{t("month")}
                </p>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm">
                  {t("total_repayment")}
                </span>
                <span className="text-gray-800 font-medium">
                  €{totalLoanPayment}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500 text-sm">
                  {t("total_interest")}
                </span>
                <span className="text-gray-800 font-medium">
                  €{totalLoanInterest}
                </span>
              </div>
            </div>
          </section>
        </main>

        {/* Affordability Checker */}
        <main className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6 min-h-0">
          <section className="col-span-5 bg-white rounded-lg p-6 sm:p-8 shadow-lg">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
              <span className="text-emerald-500">%</span> {t("economic_data")}
            </h2>
            <form onSubmit={handleDebtRatioCalculation}>
              <div className="mb-6">
                <DynamicEmailDropdown setEmail={setLead} />
              </div>
              <div className="mb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-10">
                    <div className="flex-grow">
                      <label
                        htmlFor="salary1"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        {t("salary1")}
                      </label>
                      <input
                        type="text"
                        id="salary1"
                        name="salary1"
                        value={salary1}
                        onChange={(e) => setSalary1(e.target.value)}
                        className={formControlBase}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="payment1"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        {t("no_of_payments")}
                      </label>
                      <input
                        type="text"
                        id="payment1"
                        name="payment1"
                        value={payment1}
                        onChange={(e) => setPayment1(e.target.value)}
                        className={`${formControlBase}`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="flex-grow">
                      <label
                        htmlFor="salary2"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        {t("salary2")}
                      </label>
                      <input
                        type="text"
                        id="salary2"
                        name="salary2"
                        value={salary2}
                        onChange={(e) => setSalary2(e.target.value)}
                        className={formControlBase}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="payment2"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        {t("no_of_payments")}
                      </label>
                      <input
                        type="text"
                        id="payment2"
                        name="payment2"
                        value={payment2}
                        onChange={(e) => setPayment2(e.target.value)}
                        className={`${formControlBase}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sum of Debts */}
              <div>
                <label
                  htmlFor="sumOfDebts"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("sum_of_debts")}
                </label>
                <input
                  type="text"
                  id="sumOfDebts"
                  name="sumOfDebts"
                  value={sumOfDebts}
                  onChange={(e) => setSumOfDebts(e.target.value)}
                  className={formControlBase}
                />
              </div>

              <div className="mt-6">
                <label
                  htmlFor="debtRatio"
                  className="block text-lg font-medium text-gray-700 mb-2"
                >
                  {t("debt_ratio")}
                </label>
                <span
                  id="debtRatio"
                  className="block text-lg font-medium text-emerald-500"
                >
                  {debtRatio}%
                </span>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-md text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-colors"
                >
                  {t("calculate")}
                </button>
              </div>
            </form>
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
              {t("send_simulation")}
            </h3>

            <DynamicEmailDropdown setEmail={setEmail} />

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleCloseModal}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={handleSendSimulation}
                className="bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600 transition"
              >
                {t("send")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MortgageSimulator;
