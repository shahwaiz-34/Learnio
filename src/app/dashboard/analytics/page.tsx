"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  CreditCard,
  Download,
  Filter,
  Calendar,
  Flame,
  Star,
  Award,
  UserPlus,
  ArrowUpRight,
  BarChart3,
  PieChart as PieChartIcon,
  Layers,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { toast } from "sonner";

// --- Mock Datasets ---

const REVENUE_12_MONTHS = [
  { month: "Sep 25", revenue: 4200, sales: 38 },
  { month: "Oct 25", revenue: 5100, sales: 45 },
  { month: "Nov 25", revenue: 4800, sales: 42 },
  { month: "Dec 25", revenue: 6300, sales: 58 },
  { month: "Jan 26", revenue: 7100, sales: 64 },
  { month: "Feb 26", revenue: 6800, sales: 60 },
  { month: "Mar 26", revenue: 8400, sales: 76 },
  { month: "Apr 26", revenue: 9200, sales: 82 },
  { month: "May 26", revenue: 8900, sales: 79 },
  { month: "Jun 26", revenue: 10500, sales: 94 },
  { month: "Jul 26", revenue: 12400, sales: 110 },
  { month: "Aug 26", revenue: 11450, sales: 102 },
];

const TOP_SELLING_COURSES = [
  { name: "Next.js 14 Fullstack Blueprint", sales: 342, revenue: 50958 },
  { name: "React Native Mastery", sales: 215, revenue: 32035 },
  { name: "Tailwind CSS Pro Guide", sales: 184, revenue: 16376 },
  { name: "Convex Realtime DB & Backend", sales: 142, revenue: 21158 },
  { name: "AI Integration with OpenRouter", sales: 98, revenue: 19502 },
];

const COURSE_DISTRIBUTION = [
  { name: "Next.js Fullstack", value: 38, color: "#0a0a0b" },
  { name: "React Native", value: 24, color: "#2563EB" },
  { name: "Tailwind CSS", value: 16, color: "#06B6D4" },
  { name: "Convex Backend", value: 14, color: "#8B5CF6" },
  { name: "AI Integrations", value: 8, color: "#F59E0B" },
];

const STUDENT_GROWTH_DATA = [
  { month: "Mar", totalStudents: 620, newStudents: 65 },
  { month: "Apr", totalStudents: 740, newStudents: 85 },
  { month: "May", totalStudents: 860, newStudents: 92 },
  { month: "Jun", totalStudents: 990, newStudents: 105 },
  { month: "Jul", totalStudents: 1140, newStudents: 130 },
  { month: "Aug", totalStudents: 1240, newStudents: 128 },
];

const SUBSCRIPTION_GROWTH_DATA = [
  { month: "Mar", monthly: 180, yearly: 90 },
  { month: "Apr", monthly: 210, yearly: 110 },
  { month: "May", monthly: 240, yearly: 135 },
  { month: "Jun", monthly: 280, yearly: 155 },
  { month: "Jul", monthly: 320, yearly: 180 },
  { month: "Aug", monthly: 350, yearly: 210 },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("12m");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedPlan, setSelectedPlan] = useState("all");

  const handleExportReport = () => {
    toast.success("Analytics Report exported successfully!", {
      description: "A CSV report file has been downloaded to your system.",
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      
      {/* 1. HEADER & FILTERS BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-[#0a0a0b] tracking-tight">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Track revenue, students, sales, and overall business growth in real time.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-500 font-medium">Range:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent font-semibold text-[#0a0a0b] outline-none cursor-pointer"
            >
              <option value="12m">Last 12 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="30d">Last 30 Days</option>
              <option value="ytd">Year to Date (2026)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs shadow-sm">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-500 font-medium">Course:</span>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="bg-transparent font-semibold text-[#0a0a0b] outline-none cursor-pointer max-w-[140px] truncate"
            >
              <option value="all">All Courses</option>
              <option value="nextjs">Next.js 14 Fullstack</option>
              <option value="rn">React Native Mastery</option>
              <option value="tailwind">Tailwind CSS Pro</option>
              <option value="convex">Convex Realtime DB</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs shadow-sm">
            <Layers className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-500 font-medium">Plan:</span>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="bg-transparent font-semibold text-[#0a0a0b] outline-none cursor-pointer"
            >
              <option value="all">All Plans</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 bg-[#0a0a0b] hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 2. KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Revenue</span>
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-[#0a0a0b]">$96,950.00</h3>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% from last period
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Monthly Revenue</span>
            <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-[#0a0a0b]">$11,450.00</h3>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12.2% vs last month
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Students</span>
            <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-[#0a0a0b]">1,240</h3>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +128 new this month
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Subscriptions</span>
            <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-[#0a0a0b]">560</h3>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +8.5% active retention
            </p>
          </div>
        </div>
      </div>

      {/* 3. REVENUE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gray-100 rounded-lg text-gray-700">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0a0a0b]">Revenue Trend</h3>
                <p className="text-xs text-gray-500">12-Month continuous revenue trajectory</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> Steady Growth
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE_12_MONTHS} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748B" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748B" }} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0a0a0b", color: "#fff", borderRadius: "12px", border: "none", fontSize: "12px" }}
                  formatter={(value: any) => [`$${value.toLocaleString()}`, "Revenue"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0a0a0b"
                  strokeWidth={3}
                  dot={{ r: 3, fill: "#0a0a0b" }}
                  activeDot={{ r: 6, fill: "#2563EB" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gray-100 rounded-lg text-gray-700">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0a0a0b]">Monthly Revenue</h3>
              <p className="text-xs text-gray-500">Revenue per month breakdown</p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_12_MONTHS.slice(-6)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748B" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748B" }} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0a0a0b", color: "#fff", borderRadius: "12px", border: "none", fontSize: "12px" }}
                  formatter={(value: any) => [`$${value.toLocaleString()}`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. SALES & COURSES SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0a0a0b]">Top Selling Courses</h3>
                <p className="text-xs text-gray-500">Ranked by total units sold & revenue generated</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {TOP_SELLING_COURSES.map((course, idx) => {
              const maxSales = TOP_SELLING_COURSES[0].sales;
              const percentage = Math.round((course.sales / maxSales) * 100);

              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#0a0a0b] truncate max-w-[280px]">
                      {idx + 1}. {course.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500">{course.sales} sales</span>
                      <span className="font-bold text-[#0a0a0b]">${course.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-[#0a0a0b] h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gray-100 rounded-lg text-gray-700">
              <PieChartIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0a0a0b]">Course Distribution</h3>
              <p className="text-xs text-gray-500">Revenue share by course topic</p>
            </div>
          </div>

          <div className="h-48 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={COURSE_DISTRIBUTION}
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {COURSE_DISTRIBUTION.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0a0a0b", color: "#fff", borderRadius: "12px", border: "none", fontSize: "12px" }}
                  formatter={(value: any) => [`${value}%`, "Share"]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center pointer-events-none">
              <span className="text-xl font-bold text-[#0a0a0b]">100%</span>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Share</p>
            </div>
          </div>

          <div className="space-y-1.5 text-xs pt-2 border-t border-gray-100">
            {COURSE_DISTRIBUTION.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-[#0a0a0b]">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. STUDENTS & SUBSCRIPTIONS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0a0a0b]">Student Growth</h3>
              <p className="text-xs text-gray-500">Cumulative total enrolled students</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={STUDENT_GROWTH_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748B" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748B" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0a0a0b", color: "#fff", borderRadius: "12px", border: "none", fontSize: "12px" }}
                />
                <Line
                  type="monotone"
                  dataKey="totalStudents"
                  name="Total Students"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#8B5CF6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0a0a0b]">Subscription Growth</h3>
              <p className="text-xs text-gray-500">Monthly vs Yearly active plan trajectory</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SUBSCRIPTION_GROWTH_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748B" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748B" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0a0a0b", color: "#fff", borderRadius: "12px", border: "none", fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="monthly" name="Monthly Plans" stackId="1" stroke="#2563EB" fill="#3B82F6" fillOpacity={0.4} />
                <Area type="monotone" dataKey="yearly" name="Yearly Plans" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 6. PERFORMANCE METRICS */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#0a0a0b]">Performance Metrics</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-gray-400 uppercase">Average Order Value</span>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-extrabold text-[#0a0a0b]">$142.50</p>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">+4.2%</span>
            </div>
            <p className="text-[11px] text-gray-500">Average price paid per enrollment</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-gray-400 uppercase">Conversion Rate</span>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-extrabold text-[#0a0a0b]">3.8%</p>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">+0.6%</span>
            </div>
            <p className="text-[11px] text-gray-500">Visitors converted to paid students</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-gray-400 uppercase">Monthly Recurring (MRR)</span>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-extrabold text-[#0a0a0b]">$8,420.00</p>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">+14.1%</span>
            </div>
            <p className="text-[11px] text-gray-500">Predictable monthly subscription revenue</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-gray-400 uppercase">Customer Lifetime Value</span>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-extrabold text-[#0a0a0b]">$380.00</p>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">+9.5%</span>
            </div>
            <p className="text-[11px] text-gray-500">Average revenue generated per student</p>
          </div>
        </div>
      </div>

      {/* 7. RECENT INSIGHTS (Emojis replaced with Lucide icons) */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0a0a0b]">Recent Insights</h3>
            <p className="text-xs text-gray-500">Key business benchmarks and highlight metrics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Best Selling Course */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-gray-500 uppercase">Best Selling Course</span>
            </div>
            <p className="text-sm font-bold text-[#0a0a0b] truncate">Next.js 14 Fullstack Blueprint</p>
            <p className="text-xs text-gray-500">342 units sold ($50,958 total)</p>
          </div>

          {/* Highest Revenue Month */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-gray-500 uppercase">Highest Revenue Month</span>
            </div>
            <p className="text-sm font-bold text-[#0a0a0b]">July 2026</p>
            <p className="text-xs text-gray-500">$12,400.00 total earnings</p>
          </div>

          {/* New Students This Month */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-gray-500 uppercase">New Students This Month</span>
            </div>
            <p className="text-sm font-bold text-[#0a0a0b]">+128 Enrolled</p>
            <p className="text-xs text-emerald-600 font-medium">+15.3% higher than July average</p>
          </div>

          {/* Subscriptions Ratio */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold text-gray-500 uppercase">Subscriptions Ratio</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="text-emerald-600 flex items-center gap-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> 560 Active
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-red-500 flex items-center gap-0.5">
                <XCircle className="w-3.5 h-3.5" /> 18 Cancelled
              </span>
            </div>
            <p className="text-xs text-gray-500">96.8% monthly retention rate</p>
          </div>

        </div>
      </div>

    </div>
  ); 
}