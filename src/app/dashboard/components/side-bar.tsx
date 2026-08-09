"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "./SidebarContext";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  CreditCard,
  BarChart2,
  Wallet,
  Settings,
  User,
  BookOpen,
  MoreHorizontal,
} from "lucide-react";

const menuGroups = [
  {
    title: "DASHBOARD",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
      { name: "Students", icon: Users, href: "/dashboard/students" },
      { name: "Courses", icon: BookOpen, href: "/dashboard/courses" },
      { name: "Purchases", icon: ShoppingBag, href: "/dashboard/purchases" },
      {
        name: "Subscriptions",
        icon: CreditCard,
        href: "/dashboard/subscriptions",
      },
      { name: "Analytics", icon: BarChart2, href: "/dashboard/analytics" },
      { name: "Payments", icon: Wallet, href: "/dashboard/payments" },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      { name: "Settings", icon: Settings, href: "/dashboard/settings" },
      { name: "Profile", icon: User, href: "/dashboard/profile" },
    ],
  },
];

export default function SideBar() {
  const { isCollapsed } = useSidebar();
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  // Unified collapse state logic
  const collapsed = isCollapsed && !isHovered;

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex flex-col h-screen bg-white border-r border-gray-200 z-40 transition-all duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-64"
      }`}
      aria-expanded={!collapsed}
    >
      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6 px-3">
            {/* Group Header */}
            <div className="h-6 mb-2 flex items-center px-3">
              {collapsed ? (
                <MoreHorizontal className="w-4 h-4 text-gray-400 mx-auto transition-opacity duration-200" />
              ) : (
                <span className="text-xs font-semibold text-gray-500 tracking-wider whitespace-nowrap opacity-100 transition-opacity duration-300">
                  {group.title}
                </span>
              )}
            </div>

            {/* Links */}
            <ul className="space-y-1.5">
              {group.items.map((item, itemIndex) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <li key={itemIndex}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all duration-200 ease-in-out group ${
                        isActive
                          ? "bg-[#0a0a0b] text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      {/* Fixed Width Icon Container prevents layout shifts */}
                      <div className="w-5 h-5 flex items-center justify-center shrink-0">
                        <Icon
                          className={`w-5 h-5 transition-colors duration-200 ${
                            isActive
                              ? "text-white"
                              : "text-gray-500 group-hover:text-gray-900"
                          }`}
                          strokeWidth={isActive ? 2.5 : 2}
                        />
                      </div>

                      {/* Smoothly animated text label */}
                      <span
                        className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                          collapsed
                            ? "opacity-0 w-0 overflow-hidden translate-x-[-8px]"
                            : "opacity-100 w-auto translate-x-0"
                        }`}
                      >
                        {item.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}