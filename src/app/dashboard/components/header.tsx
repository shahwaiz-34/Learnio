"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Plus, 
  ChevronRight,
  Menu
} from "lucide-react";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-gray-200">
      
      {/* Left Section: Mobile Menu & Breadcrumbs */}
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle (optional, for smaller screens) */}
        <button className="p-1 md:hidden text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumbs (Hidden on very small screens) */}
        <nav className="hidden sm:flex items-center text-sm text-gray-500">
          <Link href="/courses" className="hover:text-gray-900 transition-colors">
            Courses
          </Link>
          <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
          <span className="font-medium text-[#0a0a0b]">Dashboard</span>
        </nav>
      </div>

      {/* Middle Section: Global Search */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#0a0a0b] transition-colors" />
          <input 
            type="text" 
            placeholder="Search courses, students..." 
            className="w-full bg-gray-50 border border-gray-200 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0a0a0b]/20 focus:border-[#0a0a0b] transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden lg:inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-medium text-gray-500 bg-white border border-gray-200 rounded">
              ⌘ K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Create Button */}
        <button className="hidden sm:flex items-center gap-1.5 bg-[#0a0a0b] text-white px-3.5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 shadow-sm transition-all active:scale-95">
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span>Create</span>
        </button>

        <div className="flex items-center gap-1 border-l border-gray-200 pl-2 sm:pl-4">
          
          {/* Global Search Mobile Toggle */}
          <button className="md:hidden p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors">
            <Search className="w-5 h-5" />
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors relative"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* Profile Avatar */}
          <button className="ml-1 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-semibold hover:ring-2 hover:ring-indigo-600/30 hover:ring-offset-2 transition-all">
            SG
          </button>
        </div>
      </div>
    </header>
  );
}
