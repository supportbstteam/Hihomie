"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { t } from "@/components/translations";
import { Card } from "@/components/ui/Card";
import useUserFromSession from "@/lib/useUserFromSession";
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
    get_banksData,
} from "@/store/dashboard";

const COLORS_BANK = ["#22c55e", "#3b82f6", "#8b5cf6"];
const COLORS_SIGNED = ["#22c55e", "#3b82f6"];
const COLORS_CONTACTED = ["#22c55e", "#91a5caff"];
function generateColors(count, variation = "default") {
    return Array.from({ length: count }, (_, i) => {
        const hue = Math.floor((360 / count) * i);

        switch (variation) {
            case "pastel":
                return `hsl(${hue}, 60%, 75%)`;
            case "vivid":
                return `hsl(${hue}, 80%, 50%)`;
            case "dark":
                return `hsl(${hue}, 60%, 45%)`;
            case "neutral":
                return `hsl(${hue}, 30%, 60%)`;
            default:
                return `hsl(${hue}, 70%, 55%)`;
        }
    });
}

const DonutChartCard = ({ title, data, colors, dataKey = "value" }) => (
    <Card className="h-full">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <div className="h-72 mt-4">
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

const ManagerStats = ({ setOpen, manager: user, setManager }) => {
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
        banksData,
        successTag,
    } = useSelector((state) => state.dashboard);

    useEffect(() => {
        if (user?._id) {
            dispatch(get_total_lead({ userId: user._id }));
            dispatch(get_total_manager());
            dispatch(get_total_staff());
            dispatch(get_newLeadsThisWeek());
            dispatch(get_latestActivities());
            dispatch(get_contractData({ userId: user._id }));
            dispatch(get_contactedUsers({ userId: user._id }));
            dispatch(get_documentSubmittedUsers({ userId: user._id }));
            dispatch(get_mortgageStatusData({ userId: user._id }));
            dispatch(get_banksData({ userId: user._id }));
        }
    }, [user?._id]);
    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/40 flex items-start justify-center z-[100] px-4">
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 20, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="bg-white w-full md:max-w-[80%] mx-auto rounded-xl shadow-2xl p-6 md:p-8 relative mt-5 max-h-[90vh] flex flex-col overflow-y-auto"
                >
                    <button
                        onClick={() => { setOpen(false); setManager(null) }}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
                    >
                        ✕
                    </button>

                    <p className="text-gray-700 text-[20px] mb-6 font-semibold">{t('manager_stats')}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                        <div className="lg:col-span-1 xl:col-span-2">
                            <DonutChartCard
                                title="User's Contracts Data"
                                data={contractData}
                                colors={generateColors(contractData.length, "vivid")}
                            />
                        </div>
                        <div className="lg:col-span-1 xl:col-span-2">
                            <DonutChartCard
                                title="Contacted vs. Not Contacted Users"
                                data={contactedUsers}
                                colors={generateColors(contactedUsers.length, "vivid")}
                            />
                        </div>
                        <div className="lg:col-span-1 xl:col-span-2">
                            <DonutChartCard
                                title="Document Submitted vs. Not Submitted Users"
                                data={documentSubmittedUsers}
                                colors={generateColors(documentSubmittedUsers.length, "vivid")}
                            />
                        </div>
                        <div className="lg:col-span-1 xl:col-span-2">
                            <DonutChartCard
                                title="Distribution by Bank"
                                data={banksData}
                                colors={generateColors(banksData.length, "vivid")}
                            />
                        </div>
                    </div>
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

                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default ManagerStats