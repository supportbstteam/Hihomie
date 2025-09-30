"use client";

import { FaRegClipboard } from 'react-icons/fa';

const LoanCalculator = () => {
    // Base styles for form controls
    const formControlBase = "w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition bg-white";

    return (
        <main className="grid grid-cols-2 gap-6 mx-auto p-4">
            {/* Input Form Card */}
            <section className="col-span-1 bg-white rounded-lg p-6 sm:p-8 shadow-lg">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
                    <span className="text-emerald-500">%</span> Loan Calculator
                </h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div className="form-group">
                            <label htmlFor="creditAmount" className="block text-sm font-medium text-gray-700 mb-2">Credit Amount</label>
                            <div className="relative">
                                {/* Using a select for the € 15000 input as per image */}
                                <select id="creditAmount" className={formControlBase}>
                                    <option>€ 15000</option>
                                    <option>€ 20000</option>
                                    <option>€ 25000</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 mb-2">Loan Term</label>
                            <select id="loanTerm" className={formControlBase}>
                                <option>10 Year</option>
                                <option>15 Year</option>
                                <option>20 Year</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-8"> {/* Increased margin bottom as per image */}
                        <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-2">Interest Rate</label>
                        <input type="text" id="interestRate" placeholder="Enter Interest Rate" className={formControlBase} />
                    </div>

                    <div className="flex justify-end gap-3"> {/* Buttons aligned to the right with gap */}
                        <button type="button" className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                            Reset
                        </button>
                        <button type="submit" className="px-6 py-2 rounded-md text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-colors">
                            Calculate
                        </button>
                    </div>
                </form>
            </section>

            {/* Result Card */}
            <section className="col-span-1 bg-white rounded-lg p-6 sm:p-8 shadow-lg flex flex-col">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
                    <span className="text-emerald-500 flex items-center"><FaRegClipboard className="h-6 w-6"/></span> Result
                </h2>
                <div className="flex-grow flex flex-col justify-start"> {/* Align content to top of result card */}
                    <div className="bg-emerald-50 p-4 rounded-md mb-6">
                        <p className="text-sm text-emerald-700 font-medium mb-1">Monthly Credit Fee</p>
                        <p className="text-2xl font-bold text-emerald-700">€139/month</p>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-500 text-sm">Total Repayment</span>
                        <span className="text-gray-800 font-medium">€16,724</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-gray-500 text-sm">Total Interest</span>
                        <span className="text-gray-800 font-medium">€1,724</span>
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