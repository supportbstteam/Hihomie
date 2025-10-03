"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { get_total_lead, get_newLeadsThisWeek, get_latestActivities } from "@/store/dashboard";

// --- Reusable Chart Color Constants ---
const COLORS_BANK = ["#22c55e", "#3b82f6", "#8b5cf6"];
const COLORS_SIGNED = ["#e5e7eb", "#22c55e"];

const signedOrderData = [
  { name: "With Signed", value: 75 },
  { name: "Without Signed", value: 25 },
];
const contactedData = [
  { name: "Delivered", value: 80 },
  { name: "Canceled", value: 20 },
];
const bankData = [
  { name: "CaixaBank", value: 40 },
  { name: "Banco Santander", value: 30 },
  { name: "BBVA", value: 30 },
];

const mortgageStatusData = [
  { name: "Pending Doc", value: 180 },
  { name: "Pre-study", value: 100 },
  { name: "Sent to Bank", value: 250 },
  { name: "Pending Prop", value: 220 },
  { name: "Valuation", value: 120 },
  { name: "FEIN", value: 30 },
  { name: "Signing", value: 100 },
  { name: "Denied", value: 130 },
  { name: "Granted", value: 240 },
];

const failureReasons = [
  { reason: "Not Contacted", value: "1,43,382" },
  { reason: "Not Viable", value: "1,43,382" },
  { reason: "Has Other Advisors", value: "1,43,382" },
  { reason: "Doesn't Want To Pay", value: "1,43,382" },
];

// --- Individual Components ---

const StatCard = ({ title, value, change, progress }) => (
  <Card>
    <div className="text-sm text-gray-500 uppercase">{title}</div>
    <div className="flex items-end justify-between mt-2">
      <div className="text-3xl font-bold">{value}</div>
      {change && (
        <div
          className={`flex items-center text-sm ${
            change.startsWith("+") ? "text-green-500" : "text-red-500"
          }`}
        >
          {change.startsWith("+") ? (
            <ArrowUp size={16} />
          ) : (
            <ArrowDown size={16} />
          )}
          <span>{change.substring(1)}</span>
        </div>
      )}
    </div>
    {progress !== undefined && (
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="text-left text-sm text-gray-500 mt-1">Pending</div>
          <div className="text-right text-sm text-gray-500 mt-1">
            {progress}%
          </div>
        </div>
      </div>
    )}
  </Card>
);

const DonutChartCard = ({ title, data, colors, dataKey = "value" }) => (
  <Card className="h-full">
    <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
    <div className="h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey={dataKey}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Legend iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

export function Dashboard() {
  const dispatch = useDispatch();
  const { totalLeads, totalManager, totalAgent, latestActivities, newLeadsThisWeek, successTag } = useSelector(
    (state) => state.dashboard
  );
  useEffect(() => {
    dispatch(get_total_lead());
    dispatch(get_newLeadsThisWeek());
    dispatch(get_latestActivities());
  }, []);
  return (
    <main className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {/* Row 1 */}
        <div className="md:col-span-1 lg:col-span-2 xl:col-span-3">
          <StatCard
            title="Total Leads"
            value={totalLeads}
            change="+ 36%"
            progress={45}
          />
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="">
              <StatCard title="Total Manager" value="4" change="+ 25%" />
            </div>
            <div className="">
              <StatCard title="Total Staff" value="2" change="+ 25%" />
            </div>
          </div>
        </div>
        <div className="md:col-span-1 lg:col-span-2 xl:col-span-3">
          <Card>
            <h3 className="text-lg font-semibold text-gray-700">
              New Leads This Week
            </h3>
            <p className="text-sm text-gray-500">
              Compared To The Previous Week
            </p>
            <div className="h-48 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={newLeadsThisWeek}
                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={true}
                    tick={{ fontSize: 12 }}
                    angle={-25}
                    textAnchor="end"
                    height={40}
                  />
                  <YAxis
                    tickLine={true}
                    axisLine={true}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Bar dataKey="value" fill="#a7f3d0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Row 2 */}
        <div className="lg:col-span-3 xl:col-span-4">
          <Card>
            <h3 className="text-lg font-semibold text-gray-700">
              Latest Activities
            </h3>
            <p className="text-sm text-gray-500">
              User Distribution Across Different Stages.
            </p>
            <table className="w-full mt-4 text-sm text-left">
              <tbody>
                {latestActivities.map((activity, i) => (
                  <tr key={i} className="border-b last:border-b-0">
                    <td className="py-3 pr-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {activity.lead_title.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">
                            {activity.lead_title}
                          </div>
                          <div className="text-gray-500">
                            {new Date(activity.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-600">
                      {activity.lead_value}
                    </td>
                    <td className="py-3 pl-3 text-right">
                      <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {activity.status_name}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
        <div className="lg:col-span-1 xl:col-span-2">
          <DonutChartCard
            title="Users Signed Order"
            data={signedOrderData}
            colors={COLORS_SIGNED}
          />
        </div>

        {/* Row 3 */}
        <div className="lg:col-span-1 xl:col-span-2">
          <DonutChartCard
            title="Contacted vs. Uncontacted Users"
            data={contactedData}
            colors={["#22c55e", "#e5e7eb"]}
          />
        </div>
        <div className="lg:col-span-2 xl:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold text-gray-700">
              Reason for failure
            </h3>
            <p className="text-sm text-gray-500">
              Categorized By Reasons For Failure.
            </p>
            <div className="mt-4 space-y-3">
              {failureReasons.map((item) => (
                <div
                  key={item.reason}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="font-medium text-gray-700">
                    {item.reason}
                  </span>
                  <span className="text-gray-500">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="lg:col-span-1 xl:col-span-2">
          <DonutChartCard
            title="Distribution by Bank"
            data={bankData}
            colors={COLORS_BANK}
          />
        </div>

        {/* Row 4 */}
        <div className="lg:col-span-4 xl:col-span-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-700">
              Mortgage Status
            </h3>
            <p className="text-sm text-gray-500">
              User Distribution Across Different Mortgage Process Stages.
            </p>
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mortgageStatusData}
                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10 }}
                    angle={-25}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Bar dataKey="value" fill="#86efac" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
