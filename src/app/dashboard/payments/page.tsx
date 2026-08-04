"use client";

import React, { useState, useMemo } from "react";
import {
  CreditCard,
  Search,
  Filter,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  Eye,
  Download,
  RefreshCw,
  X,
  TrendingUp,
  PieChart as PieChartIcon,
  FileText,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { toast } from "sonner";

// --- Data Interfaces ---
export interface Payment {
  id: string;
  customerName: string;
  customerEmail: string;
  courseTitle: string;
  amount: number;
  paymentMethod: "Stripe" | "PayPal" | "Credit Card" | "Apple Pay";
  status: "Succeeded" | "Pending" | "Failed" | "Refunded";
  date: string;
  rawDate: string; // ISO YYYY-MM-DD
}

// --- Mock Data ---
const INITIAL_PAYMENTS: Payment[] = [
  {
    id: "PAY-9041",
    customerName: "Shahwaiz Goraya",
    customerEmail: "shahwaiz@example.com",
    courseTitle: "Next.js 14 Fullstack Blueprint",
    amount: 149.00,
    paymentMethod: "Stripe",
    status: "Succeeded",
    date: "Aug 04, 2026",
    rawDate: "2026-08-04",
  },
  {
    id: "PAY-9040",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    courseTitle: "Fullstack Web Development",
    amount: 299.00,
    paymentMethod: "Credit Card",
    status: "Succeeded",
    date: "Aug 03, 2026",
    rawDate: "2026-08-03",
  },
  {
    id: "PAY-9039",
    customerName: "Sarah Jenkins",
    customerEmail: "sarah.j@example.com",
    courseTitle: "UI/UX Fundamentals & Figma",
    amount: 89.00,
    paymentMethod: "PayPal",
    status: "Pending",
    date: "Aug 02, 2026",
    rawDate: "2026-08-02",
  },
  {
    id: "PAY-9038",
    customerName: "Michael Chang",
    customerEmail: "m.chang@example.com",
    courseTitle: "Convex Realtime DB & Backend",
    amount: 120.00,
    paymentMethod: "Stripe",
    status: "Succeeded",
    date: "Aug 01, 2026",
    rawDate: "2026-08-01",
  },
  {
    id: "PAY-9037",
    customerName: "Emma Watson",
    customerEmail: "e.watson@example.com",
    courseTitle: "React Masterclass 2026",
    amount: 89.00,
    paymentMethod: "Apple Pay",
    status: "Failed",
    date: "Jul 29, 2026",
    rawDate: "2026-07-29",
  },
  {
    id: "PAY-9036",
    customerName: "David Miller",
    customerEmail: "david.m@example.com",
    courseTitle: "Tailwind CSS Pro Guide",
    amount: 49.00,
    paymentMethod: "Credit Card",
    status: "Refunded",
    date: "Jul 25, 2026",
    rawDate: "2026-07-25",
  },
  {
    id: "PAY-9035",
    customerName: "Ayesha Khan",
    customerEmail: "ayesha.k@example.com",
    courseTitle: "AI Integration with OpenRouter",
    amount: 199.00,
    paymentMethod: "Stripe",
    status: "Succeeded",
    date: "Jul 18, 2026",
    rawDate: "2026-07-18",
  },
];

// Revenue Trend Chart Data
const REVENUE_TREND_DATA = [
  { month: "Feb", revenue: 3200 },
  { month: "Mar", revenue: 4500 },
  { month: "Apr", revenue: 4100 },
  { month: "May", revenue: 6800 },
  { month: "Jun", revenue: 7400 },
  { month: "Jul", revenue: 9200 },
  { month: "Aug", revenue: 11450 },
];

// Colors for Donut Chart
const STATUS_COLORS: Record<string, string> = {
  Succeeded: "#10B981", // Emerald Green
  Pending: "#F59E0B",   // Amber Yellow
  Failed: "#EF4444",    // Red
  Refunded: "#6B7280",  // Gray
};

export default function PaymentsPage() {
  const [payments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Succeeded" | "Pending" | "Failed" | "Refunded">("All");
  const [dateRangeFilter, setDateRangeFilter] = useState<"All" | "7days" | "30days" | "90days">("All");
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  // --- Filtering Logic ---
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      // Search term filter
      const matchesSearch =
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === "All" || payment.status === statusFilter;

      // Date range filter
      let matchesDate = true;
      if (dateRangeFilter !== "All") {
        const paymentDate = new Date(payment.rawDate).getTime();
        const now = new Date("2026-08-04").getTime(); // Relative to current simulated date
        const daysDiff = (now - paymentDate) / (1000 * 3600 * 24);

        if (dateRangeFilter === "7days" && daysDiff > 7) matchesDate = false;
        if (dateRangeFilter === "30days" && daysDiff > 30) matchesDate = false;
        if (dateRangeFilter === "90days" && daysDiff > 90) matchesDate = false;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [payments, searchTerm, statusFilter, dateRangeFilter]);

  // --- Compute Donut Data ---
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { Succeeded: 0, Pending: 0, Failed: 0, Refunded: 0 };
    payments.forEach((p) => {
      counts[p.status] = (counts[p.status] || 0) + 1;
    });
    return Object.keys(counts).map((key) => ({
      name: key,
      value: counts[key],
    }));
  }, [payments]);

  // Quick Stat Summaries
  const totalRevenue = useMemo(() => {
    return payments
      .filter((p) => p.status === "Succeeded")
      .reduce((sum, p) => sum + p.amount, 0);
  }, [payments]);

  const handleDownloadReceipt = (receipt: Payment) => {
    toast.success(`Receipt #${receipt.id} downloaded successfully!`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-[#0a0a0b] tracking-tight">Payments</h1>
          <p className="text-sm text-gray-500 mt-1">Track all payment transactions, revenue analytics, and issue digital receipts.</p>
        </div>

        {/* Quick Revenue Badges */}
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Total Revenue</p>
              <p className="text-base font-bold text-[#0a0a0b]">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Total Transactions</p>
              <p className="text-base font-bold text-[#0a0a0b]">{payments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CHARTS SECTION (Revenue Trend & Payment Status) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Trend (Line Chart) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gray-100 rounded-lg text-gray-700">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0a0a0b]">Revenue Trend</h3>
                <p className="text-xs text-gray-500">Monthly revenue growth over time</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +24.5% MoM
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748B" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748B" }} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0a0a0b", color: "#fff", borderRadius: "12px", border: "none", fontSize: "12px" }}
                  formatter={(value: any) => [`$${value}`, "Revenue"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0a0a0b"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#0a0a0b", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6, fill: "#2563EB" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Status Breakdown (Donut Chart) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gray-100 rounded-lg text-gray-700">
              <PieChartIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0a0a0b]">Payment Status</h3>
              <p className="text-xs text-gray-500">Distribution by transaction status</p>
            </div>
          </div>

          <div className="h-48 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusCounts}
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusCounts.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#0a0a0b"} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0a0a0b", color: "#fff", borderRadius: "12px", border: "none", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center pointer-events-none">
              <span className="text-xl font-bold text-[#0a0a0b]">{payments.length}</span>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Total</p>
            </div>
          </div>

          {/* Status Color Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-100">
            {statusCounts.map((status) => (
              <div key={status.name} className="flex items-center justify-between bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[status.name] }}></span>
                  <span className="text-gray-600 font-medium">{status.name}</span>
                </div>
                <span className="font-bold text-[#0a0a0b]">{status.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. FILTERS BAR */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Payment ID, customer, course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0a0a0b]/20 focus:bg-white transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            
            {/* Date Range Filter */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-500 font-medium">Date Range:</span>
              <select
                value={dateRangeFilter}
                onChange={(e) => setDateRangeFilter(e.target.value as any)}
                className="bg-transparent font-semibold text-[#0a0a0b] outline-none cursor-pointer"
              >
                <option value="All">All Time</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
            </div>

            {/* Payment Status Filter */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-500 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-transparent font-semibold text-[#0a0a0b] outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Succeeded">Succeeded</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            {/* Reset Button */}
            {(searchTerm || statusFilter !== "All" || dateRangeFilter !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                  setDateRangeFilter("All");
                }}
                className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1 px-2 py-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}

          </div>

        </div>
      </div>

      {/* 4. PAYMENTS TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Showing {filteredPayments.length} of {payments.length} Transactions
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50">
                <th className="py-3.5 px-6">Payment ID</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Course</th>
                <th className="py-3.5 px-6">Amount</th>
                <th className="py-3.5 px-6">Payment Method</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50/60 transition-colors">
                    
                    {/* Payment ID */}
                    <td className="py-4 px-6 font-mono text-xs font-bold text-[#0a0a0b]">
                      {payment.id}
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-[#0a0a0b]">{payment.customerName}</p>
                        <p className="text-[11px] text-gray-400">{payment.customerEmail}</p>
                      </div>
                    </td>

                    {/* Course */}
                    <td className="py-4 px-6 text-xs text-gray-700 font-medium max-w-xs truncate">
                      {payment.courseTitle}
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-6 text-xs font-bold text-[#0a0a0b]">
                      ${payment.amount.toFixed(2)}
                    </td>

                    {/* Payment Method */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 font-medium bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200">
                        <CreditCard className="w-3 h-3 text-gray-400" />
                        {payment.paymentMethod}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        payment.status === "Succeeded"
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          : payment.status === "Pending"
                          ? "bg-amber-100 text-amber-700 border border-amber-200"
                          : payment.status === "Failed"
                          ? "bg-red-100 text-red-700 border border-red-200"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}>
                        {payment.status === "Succeeded" && <CheckCircle2 className="w-3 h-3" />}
                        {payment.status === "Pending" && <Clock className="w-3 h-3" />}
                        {payment.status === "Failed" && <XCircle className="w-3 h-3" />}
                        {payment.status === "Refunded" && <RotateCcw className="w-3 h-3" />}
                        {payment.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-xs text-gray-500 font-medium">
                      {payment.date}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedReceipt(payment)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                        title="View Receipt"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Receipt</span>
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-500 text-sm">
                    No payment transactions matched your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. DIGITAL RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-200 p-6 space-y-6 relative animate-in fade-in zoom-in-95">
            
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Top Badge */}
            <div className="text-center space-y-2 border-b border-gray-100 pb-5">
              <div className="w-12 h-12 bg-gray-100 text-[#0a0a0b] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0a0a0b]">Payment Receipt</h3>
              <p className="text-xs font-mono text-gray-400">Transaction #{selectedReceipt.id}</p>
            </div>

            {/* Receipt Summary Info */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500 font-medium">Customer</span>
                <span className="font-bold text-[#0a0a0b]">{selectedReceipt.customerName}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500 font-medium">Email</span>
                <span className="text-gray-700 font-medium">{selectedReceipt.customerEmail}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500 font-medium">Course</span>
                <span className="font-bold text-[#0a0a0b] max-w-[200px] truncate text-right">{selectedReceipt.courseTitle}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500 font-medium">Payment Method</span>
                <span className="font-semibold text-gray-800">{selectedReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500 font-medium">Date</span>
                <span className="text-gray-700 font-medium">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500 font-medium">Status</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  selectedReceipt.status === "Succeeded" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"
                }`}>
                  {selectedReceipt.status}
                </span>
              </div>
            </div>

            {/* Total Amount Box */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">Total Paid</p>
                <p className="text-xl font-extrabold text-[#0a0a0b]">${selectedReceipt.amount.toFixed(2)}</p>
              </div>
              <span className="text-xs text-gray-400 font-mono">USD</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleDownloadReceipt(selectedReceipt)}
                className="flex-1 py-2.5 bg-[#0a0a0b] text-white text-xs font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="py-2.5 px-4 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}