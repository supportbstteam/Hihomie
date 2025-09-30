"use client";

import React from "react";

// --- SVG Icon Components ---
const ResultIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
);

// A dedicated component for the SVG Gauge Chart
const GaugeChart = ({ percentage }) => {
    const radius = 55;
    const strokeWidth = 10;
    const circumference = Math.PI * radius;

    // Function to calculate the x, y coordinates on the circle
    const getCoords = (percent) => {
        const angle = (percent / 100) * 180; // 180 degrees for a semi-circle
        const angleRad = (angle - 180) * (Math.PI / 180); // Adjust for SVG's coordinate system
        const x = 100 + radius * Math.cos(angleRad);
        const y = 100 + radius * Math.sin(angleRad);
        return { x, y };
    };
    
    // Calculate marker position
    const markerPosition = getCoords(percentage);

    // SVG arc paths are complex; these are pre-calculated for the segments
    // A function to describe an arc path
    const describeArc = (x, y, radius, startAngle, endAngle) => {
        const start = getCoords((startAngle/180)*100);
        const end = getCoords((endAngle/180)*100);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
    }
    
    const greenArc = describeArc(100, 100, radius, 0, 60);    // 0 to 60 degrees
    const yellowArc = describeArc(100, 100, radius, 65, 115); // 65 to 115 degrees
    const redArc = describeArc(100, 100, radius, 120, 180); // 120 to 180 degrees

    return (
        <div className="relative w-full flex justify-center items-center my-4">
            <svg viewBox="0 0 200 110" className="w-full max-w-xs">
                {/* Colored Arcs */}
                <path d={greenArc} fill="none" stroke="#22c55e" strokeWidth={strokeWidth} strokeLinecap="round" />
                <path d={yellowArc} fill="none" stroke="#facc15" strokeWidth={strokeWidth} strokeLinecap="round" />
                <path d={redArc} fill="none" stroke="#ef4444" strokeWidth={strokeWidth} strokeLinecap="round" />

                {/* Marker */}
                <circle cx={markerPosition.x} cy={markerPosition.y} r="6" fill="white" stroke="#22c55e" strokeWidth="3" />
            </svg>
            {/* Percentage Text in the middle */}
            <div className="absolute flex flex-col items-center justify-center top-38 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="text-4xl font-bold text-gray-800">{percentage}%</span>
            </div>
        </div>
    );
};

const AffordabilityChecker = () => {
    // Base styles for form controls
    const formControlBase = "w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition bg-white";

    return (
        <main className="grid grid-cols-2 gap-6 mx-auto p-4">
            {/* Input Form Card */}
            <section className="col-span-1 bg-white rounded-lg p-6 sm:p-8 shadow-lg">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
                    <span className="text-emerald-500">%</span> Economic Data
                </h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    {/* Leads */}
                    <div className="mb-6">
                        <label htmlFor="leads" className="block text-sm font-medium text-gray-700 mb-2">Leads</label>
                        <select id="leads" className={formControlBase}>
                            <option>daniel.romero22@mockmail.net</option>
                        </select>
                    </div>

                    {/* Salary */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-md font-bold text-gray-800">Salary</h3>
                            <button type="button" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">Add More</button>
                        </div>
                        <div className="space-y-3">
                            {/* Salary 1 */}
                            <div className="flex items-center gap-3">
                                <div className="flex-grow">
                                    <label htmlFor="salary1" className="sr-only">Salary 1</label>
                                    <input type="text" id="salary1" className={formControlBase} />
                                </div>
                                <div className="w-24">
                                    <label htmlFor="payment1" className="sr-only">No of Payment 1</label>
                                    <input type="text" id="payment1" className={`${formControlBase} text-center`} />
                                </div>
                                <button className="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-md border border-gray-300 bg-white text-xl font-light text-gray-500 hover:border-red-500 hover:text-red-500 transition">-</button>
                            </div>
                            {/* Salary 2 */}
                            <div className="flex items-center gap-3">
                                <div className="flex-grow">
                                    <label htmlFor="salary2" className="sr-only">Salary 2</label>
                                    <input type="text" id="salary2" className={formControlBase} />
                                </div>
                                <div className="w-24">
                                    <label htmlFor="payment2" className="sr-only">No of Payment 2</label>
                                    <input type="text" id="payment2" className={`${formControlBase} text-center`} />
                                </div>
                                <button className="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-md border border-gray-300 bg-white text-xl font-light text-gray-500 hover:border-red-500 hover:text-red-500 transition">-</button>
                            </div>
                        </div>
                    </div>

                    {/* Sum of Debts */}
                    <div>
                        <label htmlFor="sumOfDebts" className="block text-sm font-medium text-gray-700 mb-2">Sum of Debts</label>
                        <input type="text" id="sumOfDebts" className={formControlBase} />
                    </div>
                </form>
            </section>

            {/* Result Card */}
            <section className="col-span-1 bg-white rounded-lg p-6 sm:p-8 shadow-lg flex flex-col">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
                    <span className="text-emerald-500 flex items-center"><ResultIcon /></span> Result
                </h2>
                <div className="flex-grow flex flex-col">
                    <div className="bg-emerald-50 p-4 rounded-md text-center mb-4">
                        <p className="text-sm text-emerald-700 font-medium mb-1">Total Household Income</p>
                        <p className="text-2xl font-bold text-emerald-700">€63,034/year</p>
                    </div>
                    
                    <GaugeChart percentage={13} />

                    <div className="space-y-2 mt-4">
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-500 text-sm">Max Recommended Debt (30%)</span>
                            <span className="text-gray-800 font-medium">€18,910</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-500 text-sm">Available Debt Capacity</span>
                            <span className="text-gray-800 font-medium">€10,902</span>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default AffordabilityChecker;  