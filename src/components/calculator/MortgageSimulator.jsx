"use client";

import { useState } from "react";
import { FaRegClipboard } from 'react-icons/fa';

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

const MortgageSimulator = () => {
  const [financing, setFinancing] = useState(0);

  // Base styles for form controls
  const formControlBase =
    "w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition";

  const sliderTrackStyle = {
    background: `linear-gradient(to right, #10b981 ${financing}%, #e5e7eb ${financing}%)`,
  };

  const handleAddInterestRow = () => {
    setFinancing(financing + 1);
  };

  return (
    <>
      <div className="w-full mx-auto p-4">

        {/* Calculator Body */}
        <main className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Input Form Card */}
          <section className="lg:col-span-3 bg-white rounded-lg p-6 sm:p-8 shadow-lg">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
              <span className="text-emerald-500 font-bold text-xl">%</span> Mortgage Simulator
            </h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="mb-6">
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Property Location
                  </label>
                  <select id="location" className={formControlBase}>
                    <option>Select Location</option>
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
                      id="price"
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
                    {financing}%
                  </span>
                </div>
                <input
                  type="range"
                  id="financing"
                  min="0"
                  max="100"
                  value={financing}
                  style={sliderTrackStyle}
                  onChange={(e) => setFinancing(e.target.value)}
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
                    placeholder="Interest (TIH)"
                    className={`${formControlBase} col-span-2`}
                  />
                  <input
                    type="text"
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
            </form>
          </section>

          {/* Result Card */}
          <section className="lg:col-span-2 bg-white rounded-lg p-6 sm:p-8 shadow-lg flex flex-col">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
              <span className="text-emerald-500 flex items-center">
                <FaRegClipboard className="h-6 w-6"/>
              </span>{" "}
              Result
            </h2>
            <div className="flex-grow flex flex-col justify-center items-center text-center">
              <div className="mb-6">
                <PlaceholderIcon />
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-gray-500">
                Enter your property details to see monthly payments and total
                costs.
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default MortgageSimulator;
