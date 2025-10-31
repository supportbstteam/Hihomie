"use client";

import React, { useState, useEffect } from "react";
import { t } from "@/components/translations";
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
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  get_total_lead,
  get_newLeadsThisWeek,
  get_latestActivities,
  get_total_manager,
  get_total_staff,
  get_contractData,
  get_contactedUsers,
  get_documentSubmittedUsers,
  get_mortgageStatusData,
} from "@/store/dashboard";
import { get_tasks, get_admin_tasks } from "@/store/task";
import useUserFromSession from "@/lib/useUserFromSession";

// --- Reusable Chart Color Constants ---
const COLORS_BANK = ["#22c55e", "#3b82f6", "#8b5cf6"];
const COLORS_SIGNED = ["#22c55e", "#91a5caff"];
const COLORS_CONTACTED = ["#22c55e", "#91a5caff"];

const bankData = [
  { name: "CaixaBank", value: 40 },
  { name: "Banco Santander", value: 30 },
  { name: "BBVA", value: 30 },
];

// const mortgageStatusData = [
//   { name: "Pending Doc", value: 180 },
//   { name: "Pre-study", value: 100 },
//   { name: "Sent to Bank", value: 250 },
//   { name: "Pending Prop", value: 220 },
//   { name: "Valuation", value: 120 },
//   { name: "FEIN", value: 30 },
//   { name: "Signing", value: 100 },
//   { name: "Denied", value: 130 },
//   { name: "Granted", value: 240 },
// ];

const failureReasons = [
  { reason: "Not Contacted", value: "1,43,382" },
  { reason: "Not Viable", value: "1,43,382" },
  { reason: "Has Other Advisors", value: "1,43,382" },
  { reason: "Doesn't Want To Pay", value: "1,43,382" },
];

// --- Individual Components ---

const StatCard = ({ title, value, change, pending, progress }) => (
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
    {pending !== undefined && (
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="text-left text-sm text-gray-500 mt-1">
            {t("pending")}
          </div>
          <div className="text-right text-sm text-gray-500 mt-1">{pending}</div>
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
            labelLine={true}
            // label={true}
            label={({ percent }) => `${(percent * 100).toFixed(2)}%`}
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

const CustomTooltip = ({ active, payload, total }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const name = payload[0].payload.name;
    const percentage = ((value / total) * 100).toFixed(2);

    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow text-sm">
        <p className="font-semibold">{name}</p>
        <p>Leads: {value}</p>
        <p>Percentage: {percentage}%</p>
      </div>
    );
  }
  return null;
};

export function Dashboard() {
  const dispatch = useDispatch();
  const {
    totalLeads,
    totalManager,
    totalStaff,
    latestActivities,
    newLeadsThisWeek,
    contractData,
    contactedUsers,
    documentSubmittedUsers,
    mortgageStatusData,
    successTag,
  } = useSelector((state) => state.dashboard);
  const { tasks, admin_tasks } = useSelector((state) => state.task);
  const user = useUserFromSession();
  useEffect(() => {
    if(user?.id){
      dispatch(get_total_lead());
      dispatch(get_total_manager());
      dispatch(get_total_staff());
      dispatch(get_newLeadsThisWeek());
      dispatch(get_latestActivities());
      dispatch(get_tasks({ date: new Date().toISOString().split("T")[0], manager_id: user.id }));
      dispatch(get_admin_tasks(new Date().toISOString().split("T")[0]));
      dispatch(get_contractData({ userId: user.id }));
      dispatch(get_contactedUsers({ userId: user.id }));
      dispatch(get_documentSubmittedUsers({ userId: user.id }));
      dispatch(get_mortgageStatusData({ userId: user.id }));
    }
  }, [user?.id]);
  return (
    <main className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {/* Row 1 */}
        <div className="md:col-span-1 lg:col-span-2 xl:col-span-3">
          <StatCard
            title={t("total_leads")}
            value={totalLeads[0]}
            change={`+ ${totalLeads[1]}`}
            pending={totalLeads[0] - totalLeads[1]}
            progress={(totalLeads[1] / totalLeads[0]) * 100}
          />
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="">
              <StatCard
                title={t("total_manager")}
                value={totalManager[0]}
                change={`+ ${totalManager[1]}`}
              />
            </div>
            <div className="">
              <StatCard
                title={t("total_staff")}
                value={totalStaff[0]}
                change={`+ ${totalStaff[1]}`}
              />
            </div>
          </div>
        </div>
        <div className="md:col-span-1 lg:col-span-2 xl:col-span-3">
          <Card>
            <h3 className="text-lg font-semibold text-gray-700">
              {t("newLeadsThisWeek")}
            </h3>
            <p className="text-sm text-gray-500">
              {t("comparedToPreviousWeek")}
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
        <div className="lg:col-span-4 xl:col-span-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 h-[calc(100vh-290px)]">
            <div className="lg:col-span-3 xl:col-span-4">
              <Card>
                <h3 className="text-lg font-semibold text-gray-700">
                  {t("latest_activities")}
                </h3>
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
                                {new Date(
                                  activity.createdAt
                                ).toLocaleDateString("en-US", {
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
            <div className="lg:col-span-1 xl:col-span-2 overflow-y-auto">
              {user?.role === "admin" && (
                <Card className="h-full overflow-y-auto">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    {t("tasks")}
                  </h3>
                  {admin_tasks.map((task) => (
                    <div key={task._id} className="flex-grow pr-1">
                      {/* <span className="mr-3 text-lg">
                  {task.completed ? (
                    <FaCheckCircle className="text-green-500" />
                  ) : (
                    <FaRegCircle className="text-gray-400 hover:text-blue-500" />
                  )}
                </span> */}
                      <div className="mb-2">
                        <span className="mb-4 px-2 py-1 text-lg">
                          {task.user_name}
                        </span>
                        {task.task_Details.map((task_number) => (
                          <div
                            key={task_number._id}
                            className={`text-base my-2 ml-4 px-2 ${
                              task_number.completed
                                ? "line-through bg-green-100 text-gray-500 rounded-sm"
                                : "bg-green-100 text-gray-800 rounded-sm"
                            }`}
                          >
                            {task_number.task}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </Card>
              )}
              {user?.role !== "admin" && (
                <Card className="h-full overflow-y-auto">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    {t("tasks")}
                  </h3>
                  {tasks.map((task) => (
                    <div key={task._id} className="flex items-center flex-grow">
                      {/* <span className="mr-3 text-lg">
                  {task.completed ? (
                    <FaCheckCircle className="text-green-500" />
                  ) : (
                    <FaRegCircle className="text-gray-400 hover:text-blue-500" />
                  )}
                </span> */}
                      <span
                        className={`text-base flex-grow mb-2 px-2 py-1 ${
                          task.completed
                            ? "line-through bg-green-100 text-gray-500 rounded-sm"
                            : "bg-green-100 text-gray-800 rounded-sm"
                        }`}
                      >
                        {task.task}
                      </span>
                    </div>
                  ))}
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Row 3 */}
        <div className="lg:col-span-1 xl:col-span-2">
          {user?.role === "admin" && (
            <DonutChartCard
              title="User's Contracts Data"
              data={contractData}
              colors={COLORS_SIGNED}
            />
          )}
          {user?.role !== "admin" && (
            <DonutChartCard
              title="User's Contracts Data"
              data={contractData}
              colors={COLORS_SIGNED}
            />
          )}
        </div>
        <div className="lg:col-span-1 xl:col-span-2">
          <DonutChartCard
            title="Contacted vs. Not Contacted Users"
            data={contactedUsers}
            colors={COLORS_CONTACTED}
          />
        </div>
        <div className="lg:col-span-1 xl:col-span-2">
          <DonutChartCard
            title="Document Submitted vs. Not Submitted Users"
            data={documentSubmittedUsers}
            colors={COLORS_CONTACTED}
          />
        </div>
        {/* <div className="lg:col-span-1 xl:col-span-2">
          <DonutChartCard
            title="Distribution by Bank"
            data={bankData}
            colors={COLORS_BANK}
          />
        </div> */}

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
                    height={60}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    content={
                      <CustomTooltip
                        total={mortgageStatusData.reduce(
                          (sum, d) => sum + d.value,
                          0
                        )}
                      />
                    }
                  />
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
