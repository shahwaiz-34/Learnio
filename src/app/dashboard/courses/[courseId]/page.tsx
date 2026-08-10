"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  DollarSign,
  Calendar,
  Clock,
  TrendingUp,
  Search,
  CheckCircle2,
  MoreVertical,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

// --- Mock Course Details Data ---
const MOCK_COURSE = {
  id: "1",
  title: "Conversational Language Mastery",
  description:
    "Master conversational Spanish through immersive audio lessons, real-world scenario practice, and interactive dialogue exercises designed for beginner to intermediate learners.",
  price: 29.99,
  studentsCount: 120,
  revenue: 3600,
  createdDate: "Jan 15, 2026",
  lastUpdated: "Jul 28, 2026",
  status: "Published",
  thumbnail: "/course.jpg",
  category: "Languages",
};

const revenueTrendData = [
  { month: "Feb", revenue: 300 },
  { month: "Mar", revenue: 450 },
  { month: "Apr", revenue: 600 },
  { month: "May", revenue: 520 },
  { month: "Jun", revenue: 830 },
  { month: "Jul", revenue: 900 },
];

const MOCK_PURCHASES = [
  {
    id: "p1",
    student: "Sarah Jenkins",
    email: "sarah.j@example.com",
    date: "2 hours ago",
    amount: "$29.99",
  },
  {
    id: "p2",
    student: "Michael Chang",
    email: "m.chang@example.com",
    date: "5 hours ago",
    amount: "$29.99",
  },
  {
    id: "p3",
    student: "Emma Watson",
    email: "e.watson@example.com",
    date: "Yesterday",
    amount: "$29.99",
  },
  {
    id: "p4",
    student: "David Miller",
    email: "david.m@example.com",
    date: "2 days ago",
    amount: "$29.99",
  },
];

const MOCK_STUDENTS = [
  {
    id: "s1",
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    joined: "Aug 02, 2026",
    progress: 15,
  },
  {
    id: "s2",
    name: "Michael Chang",
    email: "m.chang@example.com",
    joined: "Aug 02, 2026",
    progress: 0,
  },
  {
    id: "s3",
    name: "Emma Watson",
    email: "e.watson@example.com",
    joined: "Aug 01, 2026",
    progress: 68,
  },
  {
    id: "s4",
    name: "David Miller",
    email: "david.m@example.com",
    joined: "Jul 31, 2026",
    progress: 100,
  },
  {
    id: "s5",
    name: "Alex Rivera",
    email: "a.rivera@example.com",
    joined: "Jul 29, 2026",
    progress: 42,
  },
];

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId as string;

  const [studentSearch, setStudentSearch] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle Delete Course
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course? This action cannot be undone.",
    );
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      // API call to delete course using `courseId`
      console.log(`Deleting course ID: ${courseId}`);

      toast.success("Course Deleted", {
        description: `Course #${courseId} has been removed successfully.`,
      });

      router.push("/dashboard/courses");
    } catch (error) {
      toast.error("Failed to delete course");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredStudents = MOCK_STUDENTS.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase()),
  );

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Top Header / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/courses"
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
                {MOCK_COURSE.status}
              </span>
              <span className="text-xs text-gray-400">ID: {courseId}</span>
            </div>
            <h1 className="text-2xl font-bold text-[#0a0a0b] tracking-tight mt-0.5">
              Course Overview
            </h1>
          </div>
        </div>

        {/* Edit & Delete Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/courses/${courseId}/edit`}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 shadow-sm transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Main Course Hero Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Course Thumbnail */}
          <div className="lg:col-span-5 aspect-video w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-100 relative group">
            <img
              src={MOCK_COURSE.thumbnail}
              alt={MOCK_COURSE.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Course Primary Info */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
                {MOCK_COURSE.category}
              </span>
              <h2 className="text-2xl font-bold text-[#0a0a0b] mt-1">
                {MOCK_COURSE.title}
              </h2>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                {MOCK_COURSE.description}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-xs text-gray-500 font-medium">Price</span>
                <p className="text-xl font-bold text-[#0a0a0b] mt-0.5">
                  ${MOCK_COURSE.price}
                </p>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                  <Users className="w-3.5 h-3.5" />
                  <span>Students</span>
                </div>
                <p className="text-xl font-bold text-[#0a0a0b] mt-0.5">
                  {MOCK_COURSE.studentsCount}
                </p>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Revenue</span>
                </div>
                <p className="text-xl font-bold text-green-600 mt-0.5">
                  ${MOCK_COURSE.revenue.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Metadata Footer */}
            <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-gray-100 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>
                  Created: <strong>{MOCK_COURSE.createdDate}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>
                  Last Updated: <strong>{MOCK_COURSE.lastUpdated}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Chart & Recent Purchases */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm lg:col-span-8 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-semibold text-[#0a0a0b]">
                Revenue History
              </h3>
              <p className="text-xs text-gray-500">
                Monthly earnings generated by this course
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-md">
              <TrendingUp className="w-3.5 h-3.5" />
              +18.4%
            </div>
          </div>
          <div className="flex-1 min-h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueTrendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="courseRevenue"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#0a0a0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0a0a0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0a0a0b"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#courseRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Purchases */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm lg:col-span-4 flex flex-col">
          <h3 className="text-base font-semibold text-[#0a0a0b] mb-4">
            Recent Purchases
          </h3>
          <div className="space-y-4 flex-1">
            {MOCK_PURCHASES.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80 border border-gray-100"
              >
                <div>
                  <p className="text-sm font-medium text-[#0a0a0b]">
                    {p.student}
                  </p>
                  <p className="text-xs text-gray-500">{p.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">
                    {p.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Enrolled Student List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-[#0a0a0b]">
              Enrolled Students
            </h3>
            <p className="text-xs text-gray-500">
              Students actively taking this course
            </p>
          </div>

          {/* Student Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search student..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0a0a0b]/20"
            />
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50">
                <th className="py-3 px-4 rounded-l-lg">Student</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4 rounded-r-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0a0a0b] text-white flex items-center justify-center text-xs font-bold">
                          {s.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="font-medium text-[#0a0a0b]">{s.name}</p>
                          <p className="text-xs text-gray-500">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs">
                      {s.joined}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#0a0a0b] h-full rounded-full"
                            style={{ width: `${s.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                          {s.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="p-1 text-gray-400 hover:text-gray-700 rounded-md">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-6 text-gray-500 text-xs"
                  >
                    No students found matching "{studentSearch}"
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
