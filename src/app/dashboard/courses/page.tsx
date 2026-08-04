"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Users, 
  DollarSign 
} from "lucide-react";

//  Mock Data 
const MOCK_COURSES = [
  {
    id: "1",
    title: "Conversational Language Mastery",
    price: 29.99,
    students: 120,
    revenue: 3600,
    status: "Published",
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=600",
    category: "Languages"
  },
  {
    id: "2",
    title: "Full-Stack Web Development Boot...",
    price: 99.99,
    students: 85,
    revenue: 8499,
    status: "Published",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=600",
    category: "Programming"
  },
  {
    id: "3",
    title: "Digital Marketing Essentials",
    price: 49.99,
    students: 0,
    revenue: 0,
    status: "Draft",
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=600",
    category: "Marketing"
  }
];

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  // Bulk selection logic
  const toggleSelection = (id: string) => {
    setSelectedCourses(prev => 
      prev.includes(id) ? prev.filter(courseId => courseId !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedCourses.length === MOCK_COURSES.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(MOCK_COURSES.map(course => course.id));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Courses</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all your courses</p>
        </div>
        <Link 
          href="/dashboard/courses/new"
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Course
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        
        {/* Search */}
        <div className="relative w-full lg:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search courses..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Note: You can replace these native selects with shadcn/ui Select components */}
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="">Category</option>
            <option value="programming">Programming</option>
            <option value="marketing">Marketing</option>
            <option value="languages">Languages</option>
          </select>
          
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="">Price</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>

          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="">Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="">Sort: Newest</option>
            <option value="revenue">Sort: Revenue</option>
            <option value="students">Sort: Students</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions Bar (Appears when items are selected) */}
      {selectedCourses.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <span className="text-sm font-medium text-blue-800">
            {selectedCourses.length} course(s) selected
          </span>
          <div className="flex items-center gap-2">
            <button className="text-sm px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 font-medium">
              Publish
            </button>
            <button className="text-sm px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 font-medium">
              Unpublish
            </button>
            <button className="text-sm px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 font-medium">
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Select All Toggle */}
      <div className="flex items-center px-2">
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input 
            type="checkbox" 
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            checked={selectedCourses.length === MOCK_COURSES.length && MOCK_COURSES.length > 0}
            onChange={selectAll}
          />
          Select All
        </label>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_COURSES.map((course) => (
          <div 
            key={course.id} 
            className={`group bg-white rounded-2xl border transition-all hover:shadow-md overflow-hidden flex flex-col relative ${
              selectedCourses.includes(course.id) ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'
            }`}
          >
            {/* Checkbox overlay */}
            <div className="absolute top-3 left-3 z-10">
              <input 
                type="checkbox"
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 shadow-sm cursor-pointer"
                checked={selectedCourses.includes(course.id)}
                onChange={() => toggleSelection(course.id)}
              />
            </div>

            {/* Image Section */}
            <div className="h-48 w-full relative bg-gray-100 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3">
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm backdrop-blur-md ${
                  course.status === 'Published' 
                    ? 'bg-green-100/90 text-green-800' 
                    : 'bg-gray-100/90 text-gray-700'
                }`}>
                  {course.status}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-1" title={course.title}>
                  {course.title}
                </h3>
              </div>
              
              <div className="text-2xl font-bold text-gray-900 mb-4">
                ${course.price}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-auto py-4 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 text-gray-400" />
                  {course.students} Students
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                  {course.revenue.toLocaleString()} Rev
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="bg-gray-50 p-4 flex items-center justify-between gap-2 border-t border-gray-100">
              <Link 
                href={`/dashboard/courses/${course.id}`}
                className="flex-1 flex justify-center items-center py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Eye className="w-4 h-4 mr-1.5" />
                View
              </Link>
              <Link 
                href={`/dashboard/courses/${course.id}/edit`}
                className="flex-1 flex justify-center items-center py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Edit className="w-4 h-4 mr-1.5" />
                Edit
              </Link>
              <button 
                className="flex-1 flex justify-center items-center py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                onClick={() => alert(`Delete course ${course.id}?`)}
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}