"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  CreditCard,
  TrendingUp,
  DollarSign,
  Search,
  Filter,
  RefreshCw,
  Eye,
  XCircle,
  Settings,
  CheckCircle2,
  AlertCircle,
  CalendarCheck,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { toast } from "sonner";

// --- Mock Subscription Data Types ---
export interface Subscription {
  id: string;
  userName: string;
  userEmail: string;
  plan: "Monthly" | "Yearly";
  status: "Active" | "Cancelled";
  renewalDate: string;
  autoRenew: boolean;
  price: number;
}

const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "SUB-101",
    userName: "Shahwaiz",
    userEmail: "shahwaiz@example.com",
    plan: "Monthly",
    status: "Active",
    renewalDate: "Aug 30, 2026",
    autoRenew: true,
    price: 29.99,
  },
  {
    id: "SUB-102",
    userName: "John",
    userEmail: "john.doe@example.com",
    plan: "Yearly",
    status: "Active",
    renewalDate: "Jul 20, 2027",
    autoRenew: true,
    price: 299.99,
  },
  {
    id: "SUB-103",
    userName: "Sarah Jenkins",
    userEmail: "sarah.j@example.com",
    plan: "Monthly",
    status: "Cancelled",
    renewalDate: "Expired",
    autoRenew: false,
    price: 29.99,
  },
  {
    id: "SUB-104",
    userName: "Michael Chang",
    userEmail: "m.chang@example.com",
    plan: "Yearly",
    status: "Active",
    renewalDate: "Sep 15, 2026",
    autoRenew: true,
    price: 299.99,
  },
  {
    id: "SUB-105",
    userName: "Emma Watson",
    userEmail: "e.watson@example.com",
    plan: "Monthly",
    status: "Active",
    renewalDate: "Aug 18, 2026",
    autoRenew: true,
    price: 29.99,
  },
  {
    id: "SUB-106",
    userName: "David Miller",
    userEmail: "david.m@example.com",
    plan: "Yearly",
    status: "Cancelled",
    renewalDate: "Expired",
    autoRenew: false,
    price: 299.99,
  },
];

// --- Mock Datasets for Recharts ---
const GROWTH_DATA = [
  { month: "Jan", subscribers: 65 },
  { month: "Feb", subscribers: 78 },
  { month: "Mar", subscribers: 90 },
  { month: "Apr", subscribers: 105 },
  { month: "May", subscribers: 118 },
  { month: "Jun", subscribers: 126 },
];

const PLAN_DISTRIBUTION_DATA = [
  { name: "Monthly", value: 84, color: "#3b82f6" },
  { name: "Yearly", value: 42, color: "#8b5cf6" },
];

const REVENUE_BY_PLAN_DATA = [
  { plan: "Monthly", revenue: 2520 },
  { plan: "Yearly", revenue: 1730 },
];

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(
    INITIAL_SUBSCRIPTIONS,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlanFilter, setSelectedPlanFilter] = useState<
    "All" | "Monthly" | "Yearly"
  >("All");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<
    "All" | "Active" | "Cancelled"
  >("All");

  // --- Dynamic Filtering ---
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      const matchesSearch =
        sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPlan =
        selectedPlanFilter === "All" || sub.plan === selectedPlanFilter;
      const matchesStatus =
        selectedStatusFilter === "All" || sub.status === selectedStatusFilter;

      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [subscriptions, searchTerm, selectedPlanFilter, selectedStatusFilter]);

  // --- Actions ---
  const handleCancelSubscription = (sub: Subscription) => {
    if (sub.status === "Cancelled") {
      toast.info("Subscription is already cancelled.");
      return;
    }

    setSubscriptions((prev) =>
      prev.map((item) =>
        item.id === sub.id
          ? {
              ...item,
              status: "Cancelled",
              autoRenew: false,
              renewalDate: "Expired",
            }
          : item,
      ),
    );

    toast.warning("Subscription Cancelled", {
      description: `Subscription ${sub.id} for ${sub.userName} has been cancelled.`,
    });
  };

  const handleManage = (sub: Subscription) => {
    toast.info(`Opening subscription settings for ${sub.userName}...`);
  };

  const handleView = (sub: Subscription) => {
    toast.info(`Viewing details for ${sub.userName}'s ${sub.plan} plan.`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-[#0a0a0b] tracking-tight">
            Subscriptions
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage recurring payments and subscription plans.
          </p>
        </div>
      </div>

      {/* 2. TOP METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Active Plans Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Active Plans
            </span>
            <div className="p-2 bg-green-50 rounded-xl text-green-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#0a0a0b]">126</p>
          <p className="text-xs text-green-600 font-medium">
            +12% from last month
          </p>
        </div>

        {/* Monthly Plans Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Monthly Plans
            </span>
            <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#0a0a0b]">84</p>
          <p className="text-xs text-gray-500 font-medium">
            66.7% of total subscriber base
          </p>
        </div>

        {/* Yearly Plans Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Yearly Plans
            </span>
            <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#0a0a0b]">42</p>
          <p className="text-xs text-gray-500 font-medium">
            33.3% of total subscriber base
          </p>
        </div>

        {/* MRR Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              MRR
            </span>
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#0a0a0b]">$4,250</p>
          <p className="text-xs text-emerald-600 font-medium">
            +8.5% recurring growth
          </p>
        </div>
      </div>

      {/* 3. CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Subscription Growth (Line Chart) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Growth Trend
            </span>
            <h2 className="text-base font-bold text-[#0a0a0b] mt-0.5">
              Subscription Growth
            </h2>
          </div>
          <div className="w-full h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={GROWTH_DATA}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                  }}
                  formatter={(value) => {
                    const count =
                      typeof value === "number" ? value : Number(value ?? 0);
                    return [`${count} Active Subs`, "Total"];
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="subscribers"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#2563eb",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plan Distribution (Donut Chart) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="mb-2">
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
              Breakdown
            </span>
            <h2 className="text-base font-bold text-[#0a0a0b] mt-0.5">
              Plan Distribution
            </h2>
          </div>
          <div className="w-full h-[200px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PLAN_DISTRIBUTION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {PLAN_DISTRIBUTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Plan (Bar Chart) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="mb-2">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Revenue Stream
            </span>
            <h2 className="text-base font-bold text-[#0a0a0b] mt-0.5">
              Revenue by Plan
            </h2>
          </div>
          <div className="w-full h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={REVENUE_BY_PLAN_DATA}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="plan"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                  formatter={(value) => {
                    const amount =
                      typeof value === "number" ? value : Number(value ?? 0);
                    return [`$${amount.toLocaleString()}`, "Revenue"];
                  }}
                />
                <Bar
                  dataKey="revenue"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  barSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. FILTERS BAR */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search user name, email, or subscription ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0a0a0b]/20 focus:bg-white transition-all"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-gray-500 font-medium">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>

            {/* Plan Filter */}
            <select
              value={selectedPlanFilter}
              onChange={(e) => setSelectedPlanFilter(e.target.value as any)}
              className="bg-gray-50 border border-gray-200 text-gray-700 font-medium px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#0a0a0b]/10"
            >
              <option value="All">All Plans</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
              className="bg-gray-50 border border-gray-200 text-gray-700 font-medium px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#0a0a0b]/10"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Reset Filters */}
            {(searchTerm ||
              selectedPlanFilter !== "All" ||
              selectedStatusFilter !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedPlanFilter("All");
                  setSelectedStatusFilter("All");
                }}
                className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1 ml-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 5. SUBSCRIPTIONS TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Showing {filteredSubscriptions.length} of {subscriptions.length}{" "}
            Subscriptions
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50">
                <th className="py-3.5 px-6">User</th>
                <th className="py-3.5 px-6">Plan</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Renewal Date</th>
                <th className="py-3.5 px-6">Auto Renew</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSubscriptions.length > 0 ? (
                filteredSubscriptions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    {/* User */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#0a0a0b] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                          {sub.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-[#0a0a0b]">
                            {sub.userName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {sub.userEmail}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                          sub.plan === "Yearly"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {sub.plan} (${sub.price}/yr)
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          sub.status === "Active"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {sub.status === "Active" ? (
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-gray-400" />
                        )}
                        {sub.status}
                      </span>
                    </td>

                    {/* Renewal */}
                    <td className="py-4 px-6 text-xs text-gray-600 font-medium">
                      {sub.renewalDate}
                    </td>

                    {/* Auto Renew */}
                    <td className="py-4 px-6">
                      <span
                        className={`text-xs font-semibold ${sub.autoRenew ? "text-green-600" : "text-gray-400"}`}
                      >
                        {sub.autoRenew ? "Yes" : "No"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* View Action */}
                        <button
                          onClick={() => handleView(sub)}
                          title="View Details"
                          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Manage Action */}
                        <button
                          onClick={() => handleManage(sub)}
                          title="Manage Subscription"
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                        </button>

                        {/* Cancel Action */}
                        <button
                          onClick={() => handleCancelSubscription(sub)}
                          title="Cancel Subscription"
                          disabled={sub.status === "Cancelled"}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 text-gray-500 text-sm"
                  >
                    No subscriptions match your search or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
