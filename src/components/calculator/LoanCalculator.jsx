"use client";

import { useState } from "react";
import { FaRegClipboard } from "react-icons/fa";

const LoanCalculator = () => {
  // Base styles for form controls
  const formControlBase =
    "w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition bg-white";

  const [principal, setPrincipal] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [totalPayment, setTotalPayment] = useState("");
  const [totalInterest, setTotalInterest] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (principal && loanTerm && interestRate) {
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
      setMonthlyPayment(monthlyPayment);
      setTotalPayment(totalPayment);
      setTotalInterest(totalInterest);
    } else {
      console.error("Please enter all the fields");
    }
  };
  return (
    <main className="grid grid-cols-2 gap-6 mx-auto p-4">
      {/* Input Form Card */}
      <section className="col-span-1 bg-white rounded-lg p-6 sm:p-8 shadow-lg">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
          <span className="text-emerald-500">%</span> Loan Calculator
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="form-group">
              <label
                htmlFor="creditAmount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Credit Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="creditAmount"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  placeholder="Enter Credit Amount"
                  className={formControlBase}
                />
              </div>
            </div>
            <div className="form-group">
              <label
                htmlFor="loanTerm"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Loan Term
              </label>
              <input
                type="number"
                id="loanTerm"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                placeholder="Enter Loan Term"
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
              Interest Rate
            </label>
            <input
              type="number"
              id="interestRate"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="Enter Interest Rate"
              className={formControlBase}
            />
          </div>

          <div className="flex justify-end gap-3">
            {" "}
            {/* Buttons aligned to the right with gap */}
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-colors"
            >
              Calculate
            </button>
          </div>
        </form>
      </section>

      {/* Result Card */}
      <section className="col-span-1 bg-white rounded-lg p-6 sm:p-8 shadow-lg flex flex-col">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
          <span className="text-emerald-500 flex items-center">
            <FaRegClipboard className="h-6 w-6" />
          </span>{" "}
          Result
        </h2>
        <div className="flex-grow flex flex-col justify-start">
          {" "}
          {/* Align content to top of result card */}
          <div className="bg-emerald-50 p-4 rounded-md mb-6">
            <p className="text-sm text-emerald-700 font-medium mb-1">
              Monthly Credit Fee
            </p>
            <p className="text-2xl font-bold text-emerald-700">€{monthlyPayment}/month</p>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-500 text-sm">Total Repayment</span>
            <span className="text-gray-800 font-medium">€{totalPayment}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-500 text-sm">Total Interest</span>
            <span className="text-gray-800 font-medium">€{totalInterest}</span>
          </div>
          <button className="mt-8 px-6 py-2 rounded-md text-sm font-medium text-gray-600 border border-gray-300 bg-white hover:bg-gray-50 transition-colors">
            Send mortgage simulation
          </button>
        </div>
      </section>
    </main>
  );
};

export default LoanCalculator;
