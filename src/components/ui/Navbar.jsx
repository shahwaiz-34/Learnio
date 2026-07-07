"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useUser, // The 2026 standard for checking session state
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import {
  GraduationCap,
  BookOpen,
  Zap,
  CreditCard,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn, isLoaded } = useUser(); // Modern hook for state-based rendering

  return (
    <nav className="relative bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">
              MasterClass
            </span>
            <GraduationCap className="w-6 h-6 text-gray-800" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/courses"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" /> Courses
            </Link>
            <Link
              href="/pro"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4" /> Pro
            </Link>

            {/* Show when Signed In */}
            {isLoaded && isSignedIn && (
              <>
                <Link
                  href="/billing"
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  Billing
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            )}

            {/* Show when Signed Out */}
            {isLoaded && !isSignedIn && (
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-all">
                  Log in
                </button>
              </SignInButton>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-500"
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
      {isOpen && (
        <div className="md:hidden absolute top-16 w-full bg-white border-b border-gray-100 z-50">
          <div className="px-4 pt-2 pb-6 space-y-4 shadow-xl">
            <Link
              href="/courses"
              className="block py-2 text-base font-medium text-gray-600"
            >
              Courses
            </Link>
            <Link
              href="/pro"
              className="block py-2 text-base font-medium text-gray-600"
            >
              Pro
            </Link>

            {isLoaded && isSignedIn ? (
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <Link
                  href="/billing"
                  className="flex items-center gap-2 text-gray-600"
                >
                  <CreditCard className="w-5 h-5" /> Billing
                </Link>
                <div className="flex items-center gap-3">
                  <UserButton />
                  <span className="text-sm font-medium">Account</span>
                </div>
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="w-full cursor-pointer py-3 bg-black text-white rounded-lg font-medium">
                  Log in
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
