"use client";

import { 
  DollarSign, 
  ShoppingCart, 
  GraduationCap, 
  BookOpen, 
  RefreshCcw, 
  Wallet, 
  Receipt, 
  TrendingUp,
  Download,
  BarChart2,
  Users
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

// --- Mock Data for Charts ---
const revenueData = [
  { name: "Jan", total: 1200 }, { name: "Feb", total: 2100 },
  { name: "Mar", total: 1800 }, { name: "Apr", total: 2400 },
  { name: "May", total: 2800 }, { name: "Jun", total: 3200 },
  { name: "Jul", total: 3900 }, { name: "Aug", total: 4800 },
  { name: "Sep", total: 5100 }, { name: "Oct", total: 4600 },
  { name: "Nov", total: 5800 }, { name: "Dec", total: 6420 }
];

const courseSalesData = [
  { name: "React Pro", sales: 145 },
  { name: "Next.js Mastery", sales: 112 },
  { name: "UI Design", sales: 85 },
  { name: "Backend Dev", sales: 64 },
];

const subscriptionData = [
  { name: "Monthly", value: 72 },
  { name: "Yearly", value: 24 },
];
const COLORS = ["#0a0a0b", "#6b7280"];

// --- Reusable Stat Card Component ---
const StatCard = ({ title, value, subtitle, icon: Icon, trend }: any) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="p-2 bg-gray-50 rounded-md text-gray-600">
        <Icon size={18} strokeWidth={2} />
      </div>
    </div>
    <div>
      <div className="text-2xl font-bold text-[#0a0a0b]">{value}</div>
      <p className={`text-sm mt-1 ${trend === 'up' ? 'text-green-600' : 'text-gray-500'}`}>
        {subtitle}
      </p>
    </div>
  </div>
);

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-8">
      
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0a0a0b]">Dashboard</h1>
     
        </div>
        <div className="flex flex-wrap items-center gap-2">
          
          
          <button className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={16} /> Export Sales
          </button>
          <button className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <BarChart2 size={16} /> View Analytics
          </button>
          <button className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Users size={16} /> Manage Students
          </button>
        </div>
      </div>

      {/* Row 1: Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value="$24,580" subtitle="+12.5% this month" icon={DollarSign} trend="up" />
        <StatCard title="Total Sales" value="482" subtitle="+18 this week" icon={ShoppingCart} trend="up" />
        <StatCard title="Total Students" value="1,284" subtitle="+42 this month" icon={GraduationCap} trend="up" />
        <StatCard title="Total Courses" value="12" subtitle="3 Published" icon={BookOpen} trend="neutral" />
      </div>

      {/* Row 2: Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Subs" value="96" subtitle="72 Monthly • 24 Yearly" icon={RefreshCcw} trend="neutral" />
        <StatCard title="Monthly Revenue" value="$6,420" subtitle="+9.3% from last month" icon={Wallet} trend="up" />
        <StatCard title="Average Order" value="$43.80" subtitle="Stable across courses" icon={Receipt} trend="neutral" />
        <StatCard title="Conversion Rate" value="8.6%" subtitle="Based on unique visits" icon={TrendingUp} trend="neutral" />
      </div>

      {/* Row 3: Main Charts (Line & Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Revenue Trend Line Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-8 flex flex-col">
          <h3 className="text-base font-semibold text-[#0a0a0b] mb-6">Revenue Trend (Last 12 Months)</h3>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `$${val}`} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }} />
                <Line type="monotone" dataKey="total" stroke="#0a0a0b" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#0a0a0b' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscription Plans Donut Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-4 flex flex-col">
          <h3 className="text-base font-semibold text-[#0a0a0b] mb-6">Subscription Plans</h3>
          <div className="flex-1 min-h-[300px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={subscriptionData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={2} dataKey="value" stroke="none">
                  {subscriptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-[#0a0a0b]">96</span>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Secondary Charts (Bar Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Selling Courses */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-6 flex flex-col">
          <h3 className="text-base font-semibold text-[#0a0a0b] mb-6">Sales by Course</h3>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseSalesData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#111827' }} width={120} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                <Bar dataKey="sales" fill="#0a0a0b" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Month (Alternative representation) */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-6 flex flex-col">
          <h3 className="text-base font-semibold text-[#0a0a0b] mb-6">Revenue by Month</h3>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData.slice(-6)} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `$${val}`} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                <Bar dataKey="total" fill="#6b7280" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 5: Lists (Recent Purchases & Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Purchases */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-base font-semibold text-[#0a0a0b] mb-4">Recent Purchases</h3>
          <ul className="space-y-4">
            {[
              { name: "John Doe", course: "Photography Masterclass", price: "$49.00", time: "2 mins ago", initials: "JD", color: "bg-blue-100 text-blue-700" },
              { name: "Sarah Smith", course: "Advanced Baking", price: "$39.00", time: "1 hour ago", initials: "SS", color: "bg-emerald-100 text-emerald-700" },
              { name: "Ahmed Khan", course: "Spanish Language 101", price: "$59.00", time: "3 hours ago", initials: "AK", color: "bg-amber-100 text-amber-700" },
            ].map((item, i) => (
              <li key={i} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${item.color}`}>
                    {item.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0a0a0b]">{item.name}</p>
                    <p className="text-xs text-gray-500">Bought {item.course}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#0a0a0b]">{item.price}</p>
                  <p className="text-xs text-gray-400">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-base font-semibold text-[#0a0a0b] mb-4">Recent Activity</h3>
          <ul className="space-y-5">
            {[
              { title: "New course published", desc: "UI/UX Fundamentals is now live", icon: BookOpen, time: "Today, 10:23 AM" },
              { title: "Subscription renewed", desc: "Pro Plan - Yearly billing", icon: RefreshCcw, time: "Yesterday, 3:45 PM" },
              { title: "Student registered", desc: "12 new students joined this week", icon: Users, time: "Aug 1, 2026" },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-gray-50 rounded-full border border-gray-100 text-gray-600">
                  <item.icon size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0a0a0b]">{item.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}