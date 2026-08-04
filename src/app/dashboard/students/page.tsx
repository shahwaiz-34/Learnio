"use client";

import React, { useState, useMemo } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Eye, 
  BookOpen, 
  CreditCard, 
  Calendar, 
  DollarSign, 
  RefreshCw, 
  X,
  Mail,
  UserCheck,
  CheckCircle2,
  Clock
} from "lucide-react";
import { toast } from "sonner";

// --- Student Data Interface ---
export interface Student {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  purchasedCourses: string[];
  subscription: "Monthly" | "Yearly" | "None";
  totalSpent: number;
  joinedDate: string; // Display format
  rawJoinedDate: string; // ISO format for sorting
}

// --- Initial Mock Data ---
const INITIAL_STUDENTS: Student[] = [
  {
    id: "STU-201",
    name: "Shahwaiz Goraya",
    email: "shahwaiz@example.com",
    purchasedCourses: ["Next.js 14 Fullstack", "React Native Mastery", "Tailwind CSS Pro"],
    subscription: "Monthly",
    totalSpent: 420.00,
    joinedDate: "Aug 02, 2026",
    rawJoinedDate: "2026-08-02",
  },
  {
    id: "STU-202",
    name: "John Doe",
    email: "john.doe@example.com",
    purchasedCourses: ["Fullstack Web Development"],
    subscription: "Yearly",
    totalSpent: 299.00,
    joinedDate: "Jul 20, 2026",
    rawJoinedDate: "2026-07-20",
  },
  {
    id: "STU-203",
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    purchasedCourses: ["UI/UX Fundamentals", "Figma to Code"],
    subscription: "None",
    totalSpent: 149.50,
    joinedDate: "Jun 12, 2026",
    rawJoinedDate: "2026-06-12",
  },
  {
    id: "STU-204",
    name: "Michael Chang",
    email: "m.chang@example.com",
    purchasedCourses: ["Convex Realtime DB", "Node.js Microservices", "Docker & Kubernetes"],
    subscription: "Yearly",
    totalSpent: 580.00,
    joinedDate: "May 28, 2026",
    rawJoinedDate: "2026-05-28",
  },
  {
    id: "STU-205",
    name: "Emma Watson",
    email: "e.watson@example.com",
    purchasedCourses: ["React Masterclass"],
    subscription: "Monthly",
    totalSpent: 89.00,
    joinedDate: "May 04, 2026",
    rawJoinedDate: "2026-05-04",
  },
  {
    id: "STU-206",
    name: "David Miller",
    email: "david.m@example.com",
    purchasedCourses: [],
    subscription: "None",
    totalSpent: 0.00,
    joinedDate: "Apr 15, 2026",
    rawJoinedDate: "2026-04-15",
  },
  {
    id: "STU-207",
    name: "Ayesha Khan",
    email: "ayesha.k@example.com",
    purchasedCourses: ["AI Integration with OpenRouter", "Python Automation"],
    subscription: "Monthly",
    totalSpent: 230.00,
    joinedDate: "Mar 10, 2026",
    rawJoinedDate: "2026-03-10",
  }
];

export default function StudentsPage() {
  const [students] = useState<Student[]>(INITIAL_STUDENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState<"All" | "Monthly" | "Yearly" | "None">("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "spent-high" | "spent-low">("newest");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // --- Dynamic Search, Filtering & Sorting ---
  const filteredStudents = useMemo(() => {
    return students
      .filter((student) => {
        const matchesSearch = 
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSubscription = 
          subscriptionFilter === "All" || student.subscription === subscriptionFilter;

        return matchesSearch && matchesSubscription;
      })
      .sort((a, b) => {
        if (sortOrder === "newest") {
          return new Date(b.rawJoinedDate).getTime() - new Date(a.rawJoinedDate).getTime();
        }
        if (sortOrder === "oldest") {
          return new Date(a.rawJoinedDate).getTime() - new Date(b.rawJoinedDate).getTime();
        }
        if (sortOrder === "spent-high") {
          return b.totalSpent - a.totalSpent;
        }
        if (sortOrder === "spent-low") {
          return a.totalSpent - b.totalSpent;
        }
        return 0;
      });
  }, [students, searchTerm, subscriptionFilter, sortOrder]);

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    toast.info(`Viewing details for ${student.name}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-[#0a0a0b] tracking-tight">Students</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all enrolled students, track course progress, and view purchase history.</p>
        </div>

        {/* Quick Metric Badges */}
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Total Enrolled</p>
              <p className="text-sm font-bold text-[#0a0a0b]">{students.length}</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-green-600" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Active Subscribers</p>
              <p className="text-sm font-bold text-[#0a0a0b]">
                {students.filter(s => s.subscription !== "None").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FILTERS & SEARCH BAR */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search student name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0a0a0b]/20 focus:bg-white transition-all"
            />
          </div>

          {/* Filter & Sorting Controls */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            
            {/* Filter by Subscription */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-500 font-medium">Subscription:</span>
              <select
                value={subscriptionFilter}
                onChange={(e) => setSubscriptionFilter(e.target.value as any)}
                className="bg-transparent font-semibold text-[#0a0a0b] outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Monthly">Monthly Plan</option>
                <option value="Yearly">Yearly Plan</option>
                <option value="None">No Subscription</option>
              </select>
            </div>

            {/* Sort by Join Date / Spent */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-500 font-medium">Sort By:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="bg-transparent font-semibold text-[#0a0a0b] outline-none cursor-pointer"
              >
                <option value="newest">Joined: Newest First</option>
                <option value="oldest">Joined: Oldest First</option>
                <option value="spent-high">Total Spent: High to Low</option>
                <option value="spent-low">Total Spent: Low to High</option>
              </select>
            </div>

            {/* Reset Filters */}
            {(searchTerm || subscriptionFilter !== "All" || sortOrder !== "newest") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSubscriptionFilter("All");
                  setSortOrder("newest");
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

      {/* 3. STUDENTS TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Showing {filteredStudents.length} of {students.length} Students
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50">
                <th className="py-3.5 px-6">Avatar & Name</th>
                <th className="py-3.5 px-6">Email</th>
                <th className="py-3.5 px-6">Purchased Courses</th>
                <th className="py-3.5 px-6">Subscription</th>
                <th className="py-3.5 px-6">Total Spent</th>
                <th className="py-3.5 px-6">Joined Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/60 transition-colors">
                    
                    {/* Avatar & Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#0a0a0b] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                          {student.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-semibold text-[#0a0a0b]">{student.name}</p>
                          <p className="text-[11px] text-gray-400">{student.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-6 text-xs text-gray-600 font-medium">
                      {student.email}
                    </td>

                    {/* Purchased Courses */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs font-semibold text-[#0a0a0b]">
                          {student.purchasedCourses.length} {student.purchasedCourses.length === 1 ? "Course" : "Courses"}
                        </span>
                      </div>
                    </td>

                    {/* Subscription */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        student.subscription === "Yearly"
                          ? "bg-purple-100 text-purple-700 border border-purple-200"
                          : student.subscription === "Monthly"
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}>
                        {student.subscription}
                      </span>
                    </td>

                    {/* Total Spent */}
                    <td className="py-4 px-6 text-xs font-bold text-[#0a0a0b]">
                      ${student.totalSpent.toFixed(2)}
                    </td>

                    {/* Joined Date */}
                    <td className="py-4 px-6 text-xs text-gray-500 font-medium">
                      {student.joinedDate}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleViewStudent(student)}
                        title="View Student Profile"
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500 text-sm">
                    No enrolled students match your search or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. STUDENT DETAIL MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-200 p-6 space-y-5 relative animate-in fade-in zoom-in-95">
            
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              <div className="w-12 h-12 rounded-full bg-[#0a0a0b] text-white flex items-center justify-center text-base font-bold shadow-md">
                {selectedStudent.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0a0a0b]">{selectedStudent.name}</h3>
                <p className="text-xs text-gray-500">{selectedStudent.email}</p>
                <p className="text-[10px] text-blue-600 font-mono font-medium mt-0.5">{selectedStudent.id}</p>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] uppercase font-semibold text-gray-400">Subscription</span>
                <p className="font-bold text-[#0a0a0b] mt-0.5">{selectedStudent.subscription}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] uppercase font-semibold text-gray-400">Total Lifetime Value</span>
                <p className="font-bold text-emerald-600 mt-0.5">${selectedStudent.totalSpent.toFixed(2)}</p>
              </div>
            </div>

            {/* Purchased Courses List */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-gray-500" /> Enrolled Courses ({selectedStudent.purchasedCourses.length})
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {selectedStudent.purchasedCourses.length > 0 ? (
                  selectedStudent.purchasedCourses.map((course, idx) => (
                    <div key={idx} className="p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium text-gray-800 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                      <span className="truncate">{course}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic">No courses purchased yet.</p>
                )}
              </div>
            </div>

            {/* Joined Date */}
            <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
              <Calendar className="w-3.5 h-3.5" />
              <span>Joined on {selectedStudent.joinedDate}</span>
            </div>

            {/* Close Action */}
            <button
              onClick={() => setSelectedStudent(null)}
              className="w-full py-2.5 bg-[#0a0a0b] text-white text-xs font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
            >
              Close Details
            </button>

          </div>
        </div>
      )}

    </div>
  );
}