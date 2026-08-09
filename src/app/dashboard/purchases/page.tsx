"use client";

import React, { useState, useMemo } from "react";
import {
  Download,
  Search,
  Eye,
  RotateCcw,
  FileText,
  Filter,
  ArrowUpDown,
  TrendingUp,
  Calendar,
  CheckCircle2,
  XCircle,
  RefreshCw,
  DollarSign,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

// --- Mock Data Types & Datasets ---
export interface Purchase {
  id: string;
  customerName: string;
  customerEmail: string;
  courseTitle: string;
  amount: number;
  status: "Paid" | "Refunded" | "Failed";
  date: string; // YYYY-MM-DD for date filtering
  displayDate: string;
}

const INITIAL_PURCHASES: Purchase[] = [
  {
    id: "PUR-1001",
    customerName: "Shahwaiz",
    customerEmail: "shahwaiz@example.com",
    courseTitle: "Photography",
    amount: 59.99,
    status: "Paid",
    date: "2026-07-28",
    displayDate: "Jul 28, 2026",
  },
  {
    id: "PUR-1002",
    customerName: "John",
    customerEmail: "john.doe@example.com",
    courseTitle: "Conversational Language Mastery",
    amount: 29.99,
    status: "Paid",
    date: "2026-07-29",
    displayDate: "Jul 29, 2026",
  },
  {
    id: "PUR-1003",
    customerName: "Sarah Jenkins",
    customerEmail: "sarah.j@example.com",
    courseTitle: "Full-Stack Web Development Bootcamp",
    amount: 99.99,
    status: "Paid",
    date: "2026-08-01",
    displayDate: "Aug 01, 2026",
  },
  {
    id: "PUR-1004",
    customerName: "Michael Chang",
    customerEmail: "m.chang@example.com",
    courseTitle: "Conversational Language Mastery",
    amount: 29.99,
    status: "Refunded",
    date: "2026-08-02",
    displayDate: "Aug 02, 2026",
  },
  {
    id: "PUR-1005",
    customerName: "Emma Watson",
    customerEmail: "e.watson@example.com",
    courseTitle: "Digital Marketing Essentials",
    amount: 49.99,
    status: "Failed",
    date: "2026-08-03",
    displayDate: "Aug 03, 2026",
  },
  {
    id: "PUR-1006",
    customerName: "David Miller",
    customerEmail: "david.m@example.com",
    courseTitle: "Full-Stack Web Development Bootcamp",
    amount: 99.99,
    status: "Paid",
    date: "2026-08-04",
    displayDate: "Aug 04, 2026",
  },
];

// Revenue Trend Chart Data (Last 12 Months)
const REVENUE_TREND_DATA = [
  { month: "Sep", revenue: 3400 },
  { month: "Oct", revenue: 4200 },
  { month: "Nov", revenue: 3900 },
  { month: "Dec", revenue: 5800 },
  { month: "Jan", revenue: 4900 },
  { month: "Feb", revenue: 5200 },
  { month: "Mar", revenue: 6100 },
  { month: "Apr", revenue: 5800 },
  { month: "May", revenue: 7300 },
  { month: "Jun", revenue: 8100 },
  { month: "Jul", revenue: 9400 },
  { month: "Aug", revenue: 10500 },
];

// Top Selling Courses Chart Data
const TOP_SELLING_COURSES_DATA = [
  { name: "Full-Stack Web Dev", sales: 8499 },
  { name: "Language Mastery", sales: 3600 },
  { name: "Photography", sales: 1800 },
  { name: "Digital Marketing", sales: 1200 },
];

export default function PurchasesPage() {
  // --- State Variables for Filters ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "All" | "Today" | "Week" | "Month" | "Year"
  >("All");
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");

  // Extract unique course titles for the course dropdown filter
  const uniqueCourses = useMemo(() => {
    return Array.from(new Set(INITIAL_PURCHASES.map((p) => p.courseTitle)));
  }, []);

  // --- Reactive Filter & Search Engine ---
  const filteredPurchases = useMemo(() => {
    return INITIAL_PURCHASES.filter((purchase) => {
      // 1. Search Query Filter (Matches Customer, Email, or Course)
      const matchesSearch =
        purchase.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        purchase.customerEmail
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        purchase.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.id.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Course Filter
      const matchesCourse =
        selectedCourse === "All" || purchase.courseTitle === selectedCourse;

      // 3. Status Filter
      const matchesStatus =
        selectedStatus === "All" || purchase.status === selectedStatus;

      // 4. Timeframe Preset Filter
      let matchesTimeframe = true;
      const purchaseDate = new Date(purchase.date);
      const today = new Date("2026-08-04"); // Reference date matching current temporal context

      if (selectedTimeframe === "Today") {
        matchesTimeframe = purchase.date === "2026-08-04";
      } else if (selectedTimeframe === "Week") {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        matchesTimeframe = purchaseDate >= sevenDaysAgo;
      } else if (selectedTimeframe === "Month") {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        matchesTimeframe = purchaseDate >= startOfMonth;
      } else if (selectedTimeframe === "Year") {
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        matchesTimeframe = purchaseDate >= startOfYear;
      }

      return (
        matchesSearch && matchesCourse && matchesStatus && matchesTimeframe
      );
    }).sort((a, b) => {
      if (sortOrder === "asc") return a.amount - b.amount;
      if (sortOrder === "desc") return b.amount - a.amount;
      return 0;
    });
  }, [
    searchTerm,
    selectedTimeframe,
    selectedCourse,
    selectedStatus,
    sortOrder,
  ]);

  // --- Handlers & Actions ---

  // Export CSV Handler
  const handleExportCSV = () => {
    if (filteredPurchases.length === 0) {
      toast.warning("No purchases to export matching current filters.");
      return;
    }

    const headers = [
      "Transaction ID,Customer Name,Customer Email,Course,Amount,Status,Date\n",
    ];
    const rows = filteredPurchases.map(
      (p) =>
        `${p.id},"${p.customerName}","${p.customerEmail}","${p.courseTitle}",$${p.amount},${p.status},${p.date}`,
    );

    const blob = new Blob([...headers, rows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `purchases_export_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Export Downloaded", {
      description: `Exported ${filteredPurchases.length} purchase record(s) to CSV.`,
    });
  };

  // Download Receipt Handler
  const handleDownloadReceipt = (purchase: Purchase) => {
    toast.success("Receipt Downloaded", {
      description: `Receipt for ${purchase.id} (${purchase.customerName}) saved.`,
    });
  };

  // Refund Handler (Future workflow)
  const handleRefund = (purchase: Purchase) => {
    toast.info("Refund (Future Action)", {
      description: `Refund capability for ${purchase.id} is coming in the next release.`,
    });
  };

  // Toggle Amount Sort
  const toggleAmountSort = () => {
    if (sortOrder === "none") setSortOrder("desc");
    else if (sortOrder === "desc") setSortOrder("asc");
    else setSortOrder("none");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-[#0a0a0b] tracking-tight">
            Purchases
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track all course purchases and payment history.
          </p>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0a0b] text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* 2. ANALYTICS CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Trend (Line Chart) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                Financial Overview
              </span>
              <h2 className="text-lg font-bold text-[#0a0a0b] mt-0.5">
                Last 12 Months Revenue
              </h2>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              +24.8% YoY
            </div>
          </div>
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={REVENUE_TREND_DATA}
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
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value) => {
                    const amount =
                      typeof value === "number" ? value : Number(value ?? 0);
                    return [`$${amount.toLocaleString()}`, "Revenue"];
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0a0a0b"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#0a0a0b",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 6, fill: "#2563eb" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Courses (Bar Chart) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="mb-6">
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
              Course Performance
            </span>
            <h2 className="text-lg font-bold text-[#0a0a0b] mt-0.5">
              Top Selling Courses
            </h2>
          </div>
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={TOP_SELLING_COURSES_DATA}
                layout="vertical"
                margin={{ top: 0, right: 10, left: 30, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  tickFormatter={(v) => `$${v}`}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#374151" }}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                  }}
                  formatter={(value) => {
                    const amount =
                      typeof value === "number" ? value : Number(value ?? 0);
                    return [`$${amount.toLocaleString()}`, "Total Revenue"];
                  }}
                />
                <Bar
                  dataKey="sales"
                  fill="#3b82f6"
                  radius={[0, 6, 6, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. FILTERS BAR & CONTROLS */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        {/* Top Bar: Search + Quick Timeframe Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name, email, course, or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0a0a0b]/20 focus:bg-white transition-all"
            />
          </div>

          {/* Quick Date Range Buttons */}
          <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl overflow-x-auto">
            {(["All", "Today", "Week", "Month", "Year"] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  selectedTimeframe === tf
                    ? "bg-white text-[#0a0a0b] shadow-sm font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Detailed Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-1.5 text-gray-500 font-medium mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter By:</span>
          </div>

          {/* Course Dropdown */}
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 font-medium px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#0a0a0b]/10"
          >
            <option value="All">All Courses</option>
            {uniqueCourses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 font-medium px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#0a0a0b]/10"
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Refunded">Refunded</option>
            <option value="Failed">Failed</option>
          </select>

          {/* Amount Sort Button */}
          <button
            onClick={toggleAmountSort}
            className={`flex items-center gap-1.5 border px-3 py-2 rounded-lg font-medium transition-colors ${
              sortOrder !== "none"
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-gray-50 border-gray-200 text-gray-700"
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>
              Amount:{" "}
              {sortOrder === "none"
                ? "Default"
                : sortOrder === "asc"
                  ? "Low to High"
                  : "High to Low"}
            </span>
          </button>

          {/* Reset Filters Button */}
          {(searchTerm ||
            selectedTimeframe !== "All" ||
            selectedCourse !== "All" ||
            selectedStatus !== "All" ||
            sortOrder !== "none") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedTimeframe("All");
                setSelectedCourse("All");
                setSelectedStatus("All");
                setSortOrder("none");
              }}
              className="text-red-600 hover:text-red-800 font-medium text-xs ml-auto flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 4. PURCHASES TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Showing {filteredPurchases.length} of {INITIAL_PURCHASES.length}{" "}
            Transactions
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50">
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Course</th>
                <th className="py-3.5 px-6">Amount</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((purchase) => (
                  <tr
                    key={purchase.id}
                    className="hover:bg-gray-50/60 transition-colors group"
                  >
                    {/* Customer Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#0a0a0b] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                          {purchase.customerName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-[#0a0a0b]">
                            {purchase.customerName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {purchase.customerEmail}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Course Title */}
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-800 max-w-xs truncate">
                        {purchase.courseTitle}
                      </p>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {purchase.id}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-6 font-semibold text-[#0a0a0b]">
                      ${purchase.amount.toFixed(2)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          purchase.status === "Paid"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : purchase.status === "Refunded"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {purchase.status === "Paid" && (
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                        )}
                        {purchase.status === "Refunded" && (
                          <RotateCcw className="w-3 h-3 text-amber-600" />
                        )}
                        {purchase.status === "Failed" && (
                          <XCircle className="w-3 h-3 text-red-600" />
                        )}
                        {purchase.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-gray-500 text-xs">
                      {purchase.displayDate}
                    </td>

                    {/* Actions Column */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Download Receipt Action */}
                        <button
                          onClick={() => handleDownloadReceipt(purchase)}
                          title="Download Receipt"
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        {/* Refund Action (Future workflow) */}
                        <button
                          onClick={() => handleRefund(purchase)}
                          title="Refund (Future)"
                          disabled={purchase.status !== "Paid"}
                          className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500"
                        >
                          <RotateCcw className="w-4 h-4" />
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
                    No purchases match your selected search or filter options.
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
