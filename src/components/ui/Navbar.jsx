"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import {
  GraduationCap,
  BookOpen,
  Zap,
  CreditCard,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 group"
            onClick={() => setIsOpen(false)}
          >
            <div className="p-1.5 bg-black rounded-lg group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              MasterClass
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {/* Global Links */}
            <div className="flex items-center gap-6">
              <Link
                href="/courses"
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" /> Courses
              </Link>
              <Link
                href="/pro"
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4" /> Pro
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-900 bg-gray-100 rounded-md hover:bg-gray-200 transition-all active:scale-95"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            </div>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-200 rounded-full"></div>

            {/* Auth/User Section */}
            <div className="flex items-center gap-3">
              {isLoaded && isSignedIn && (
                <>
                  <Link
                    href="/billing"
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:border-gray-300 hover:text-gray-900 transition-all active:scale-95"
                  >
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    Billing
                  </Link>
                  <div className="pl-2">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </>
              )}

              {isLoaded && !isSignedIn && (
                <SignInButton mode="modal">
                  <button className="px-5 py-2 text-sm font-semibold text-white bg-black rounded-full hover:bg-gray-800 transition-all active:scale-95 shadow-sm">
                    Log in
                  </button>
                </SignInButton>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden absolute w-full bg-white border-b border-gray-100 shadow-xl transition-all duration-300 ease-in-out origin-top ${
          isOpen
            ? "opacity-100 scale-y-100 translate-y-0"
            : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-2">
          {/* Global Links */}
          <Link
            href="/courses"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BookOpen className="w-5 h-5 text-gray-400" /> Courses
          </Link>
          <Link
            href="/pro"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Zap className="w-5 h-5 text-gray-400" /> Pro
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <LayoutDashboard className="w-5 h-5 text-gray-700" /> Dashboard
          </Link>

          {/* Auth Section */}
          <div className="pt-4 mt-2 border-t border-gray-100">
            {isLoaded && isSignedIn ? (
              <div className="space-y-2">
                <Link
                  href="/billing"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <CreditCard className="w-5 h-5 text-gray-400" /> Billing
                </Link>
                <div className="flex items-center gap-3 px-3 py-4 mt-2 bg-gray-50 rounded-lg">
                  <UserButton afterSignOutUrl="/" />
                  <span className="text-sm font-medium text-gray-700">
                    Account Management
                  </span>
                </div>
              </div>
            ) : (
              <div className="px-3 py-2">
                <SignInButton mode="modal">
                  <button className="w-full py-3 bg-black text-white rounded-lg font-medium shadow-sm hover:bg-gray-800 transition-colors active:scale-95">
                    Log in
                  </button>
                </SignInButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
