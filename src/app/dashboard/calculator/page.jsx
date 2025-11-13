"use client";

import { useSelector, useDispatch } from "react-redux";
import { setTab } from "@/store/calculator";
import { MdOutlineShare, MdOutlineFileDownload } from "react-icons/md";
import MortgageSimulator from "@/components/calculator/MortgageSimulator";
import LoanCalculator from "@/components/calculator/LoanCalculator";
import AffordabilityChecker from "@/components/calculator/AffordabilityChecker";

const calculator = () => {
  const dispatch = useDispatch();
  const tab = useSelector((state) => state.calculator.tab);
  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center mb-4 bg-white mx-auto p-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Financial Calculator Suite
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Professional mortgage & loan analysis
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="bg-white border border-gray-200 rounded-md w-10 h-10 flex justify-center items-center text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Share"
          >
            <MdOutlineShare className="h-7 w-7 text-gray-400/70" />
          </button>
          <button
            className="bg-white border border-gray-200 rounded-md w-10 h-10 flex justify-center items-center text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Download"
          >
            <MdOutlineFileDownload className="h-7 w-7 text-gray-400/70" />
          </button>
        </div>
      </header>

      <div className="w-full mx-auto p-4">
        {/* Main Tabs */}
        <nav className="flex gap-2">
          <button
            onClick={() => dispatch(setTab("mortgage"))}
            className={`text-sm font-medium py-2 px-3 sm:px-5 rounded-md border ${tab === "mortgage" ? "bg-emerald-500 text-white border-emerald-500" : "border-gray-200 bg-white text-gray-800"} cursor-pointer transition-colors whitespace-nowrap`}
          >
            Mortgage Simulator
          </button>
          {/* <button
            onClick={() => dispatch(setTab("loan"))}
            className={`text-sm font-medium py-2 px-3 sm:px-5 rounded-md border ${tab === "loan" ? "bg-emerald-500 text-white border-emerald-500" : "border-gray-200 bg-white text-gray-800"} cursor-pointer transition-colors whitespace-nowrap`}
          >
            Loan Calculator
          </button> */}
          {/* <button
            onClick={() => dispatch(setTab("affordability"))}
            className={`text-sm font-medium py-2 px-3 sm:px-5 rounded-md border ${tab === "affordability" ? "bg-emerald-500 text-white border-emerald-500" : "border-gray-200 bg-white text-gray-800"} cursor-pointer transition-colors whitespace-nowrap`}
          >
            Affordability Checker
          </button> */}
        </nav>
      </div>
      {tab === "mortgage" && <MortgageSimulator />}
      {tab === "loan" && <LoanCalculator />}
      {/* {tab === "affordability" && <AffordabilityChecker />} */}
    </>
  );
};

export default calculator;
