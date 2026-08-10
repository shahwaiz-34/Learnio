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
  AreaChart,
  Area,
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

// --- Mock Data ---
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

// --- Modern Color Palettes ---
const PIE_COLORS = ["#4f46e5", "#38bdf8"]; // Indigo & Sky
const BAR_COLORS = ["#4f46e5", "#8b5cf6", "#0ea5e9", "#10b981"]; // Indigo, Violet, Sky, Emerald

// --- Reusable Stat Card Component ---
const StatCard = ({ title, value, subtitle, icon: Icon, trend, iconColor, iconBg }: any) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between group">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-sm font-semibold text-gray-500 group-hover:text-gray-700 transition-colors">{title}</h3>
      <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor}`}>
        <Icon size={20} strokeWidth={2} />
      </div>
    </div>
    <div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <p className={`text-sm mt-1.5 font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-gray-500'}`}>
        {subtitle}
      </p>
    </div>
  </div>
);

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-8 bg-gray-50/50 min-h-screen p-4 sm:p-6 lg:p-8">
      
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Track your course sales, revenue, and student growth.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm active:scale-95">
            <Download size={16} /> Export
          </button>
          <button className="hidden lg:flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm active:scale-95">
            <Users size={16} /> Students
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200 active:scale-95">
            <BarChart2 size={16} /> View Analytics
          </button>
        </div>
      </div>

      {/* Row 1: Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Revenue" value="$24,580" subtitle="↑ 12.5% vs last month" icon={DollarSign} trend="up" iconColor="text-emerald-600" iconBg="bg-emerald-100" />
        <StatCard title="Total Sales" value="482" subtitle="↑ 18 this week" icon={ShoppingCart} trend="up" iconColor="text-sky-600" iconBg="bg-sky-100" />
        <StatCard title="Total Students" value="1,284" subtitle="↑ 42 this month" icon={GraduationCap} trend="up" iconColor="text-violet-600" iconBg="bg-violet-100" />
        <StatCard title="Total Courses" value="12" subtitle="3 Published currently" icon={BookOpen} trend="neutral" iconColor="text-amber-600" iconBg="bg-amber-100" />
      </div>

      {/* Row 2: Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Active Subs" value="96" subtitle="72 Monthly • 24 Yearly" icon={RefreshCcw} trend="neutral" iconColor="text-indigo-600" iconBg="bg-indigo-100" />
        <StatCard title="Monthly MRR" value="$6,420" subtitle="↑ 9.3% from last month" icon={Wallet} trend="up" iconColor="text-emerald-600" iconBg="bg-emerald-100" />
        <StatCard title="Average Order" value="$43.80" subtitle="Stable across courses" icon={Receipt} trend="neutral" iconColor="text-gray-600" iconBg="bg-gray-100" />
        <StatCard title="Conversion Rate" value="8.6%" subtitle="Based on unique visits" icon={TrendingUp} trend="neutral" iconColor="text-rose-600" iconBg="bg-rose-100" />
      </div>

      {/* Row 3: Main Charts (Area & Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Revenue Trend Area Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-8 flex flex-col">
          <h3 className="text-base font-bold text-gray-900 mb-6">Revenue Trend (Last 12 Months)</h3>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  itemStyle={{ color: '#4f46e5', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 6, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscription Plans Donut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-4 flex flex-col">
          <h3 className="text-base font-bold text-gray-900 mb-6">Subscription Plans</h3>
          <div className="flex-1 min-h-[300px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={subscriptionData} cx="50%" cy="50%" innerRadius={85} outerRadius={115} paddingAngle={3} dataKey="value" stroke="none">
                  {subscriptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-extrabold text-gray-900">96</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">Active Subs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Secondary Charts (Bar Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Selling Courses */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-6 flex flex-col">
          <h3 className="text-base font-bold text-gray-900 mb-6">Sales by Course</h3>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseSalesData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }} width={120} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="sales" radius={[0, 4, 4, 0]} barSize={28}>
                  {courseSalesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Month (Alternative representation) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-6 flex flex-col">
          <h3 className="text-base font-bold text-gray-900 mb-6">Recent Monthly Revenue</h3>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData.slice(-6)} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `$${val}`} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: '#0ea5e9' }} />
                <Bar dataKey="total" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 5: Lists (Recent Purchases & Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Purchases */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-gray-900">Recent Purchases</h3>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View all</button>
          </div>
          <ul className="space-y-4">
            {[
              { name: "John Doe", course: "Photography Masterclass", price: "$49.00", time: "2 mins ago", initials: "JD", color: "bg-blue-100 text-blue-700" },
              { name: "Sarah Smith", course: "Advanced Baking", price: "$39.00", time: "1 hour ago", initials: "SS", color: "bg-emerald-100 text-emerald-700" },
              { name: "Ahmed Khan", course: "Spanish Language 101", price: "$59.00", time: "3 hours ago", initials: "AK", color: "bg-amber-100 text-amber-700" },
            ].map((item, i) => (
              <li key={i} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm ${item.color}`}>
                    {item.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500 mt-0.5">Bought <span className="font-medium text-gray-700">{item.course}</span></p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{item.price}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-gray-900">System Activity</h3>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Settings</button>
          </div>
          <ul className="space-y-6">
            {[
              { title: "New course published", desc: "UI/UX Fundamentals is now live", icon: BookOpen, time: "Today, 10:23 AM", color: "text-amber-600 bg-amber-50 border-amber-100" },
              { title: "Subscription renewed", desc: "Pro Plan - Yearly billing", icon: RefreshCcw, time: "Yesterday, 3:45 PM", color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
              { title: "Student registered", desc: "12 new students joined this week", icon: Users, time: "Aug 1, 2026", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <div className={`mt-0.5 p-2.5 rounded-xl border ${item.color}`}>
                  <item.icon size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                  <p className="text-xs font-medium text-gray-400 mt-1.5">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}