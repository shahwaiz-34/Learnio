"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  MoreHorizontal
} from "lucide-react";

const menuGroups = [
  {
    title: "DASHBOARD",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
      { name: "Students", icon: Users, href: "/dashboard/students" },
      { name: "Courses", icon: BookOpen, href: "/dashboard/courses" },
      { name: "Purchases", icon: ShoppingBag, href: "/dashboard/purchases" },
      { name: "Subscriptions", icon: CreditCard, href: "/dashboard/subscriptions" },
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
  // Track manual toggle state (default to collapsed)
  const [isManualCollapse, setIsManualCollapse] = useState(true);
  // Track mouse hover state
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  // The sidebar is only truly collapsed if it was manually closed AND is not being hovered
  const isCollapsed = isManualCollapse && !isHovered;

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-40 scrollbar-none ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header / Logo Area */}
      

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 custom-scrollbar mt-4">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6 px-3">
            {/* Group Header */}
            <div className="h-6 mb-2 flex items-center">
              {isCollapsed ? (
                <MoreHorizontal className="w-5 h-5 text-gray-400 mx-auto" />
              ) : (
                <span className="text-xs font-semibold text-gray-500 tracking-wider px-3 whitespace-nowrap">
                  {group.title}
                </span>
              )}
            </div>

            {/* Links */}
            <ul className="space-y-2">
              {group.items.map((item, itemIndex) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <li key={itemIndex}>
                    <Link
                      href={item.href}
                      className={`flex items-center rounded-lg transition-all duration-200 group ${
                        isCollapsed
                          ? "justify-center w-10 h-10 mx-auto" 
                          : "justify-start gap-3 px-3 py-2.5 w-full" 
                      } ${
                        isActive
                          ? "bg-[#0a0a0b] text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <Icon
                        className={`min-w-5 min-h-5 ${
                          isActive
                            ? "text-white"
                            : "text-gray-500 group-hover:text-gray-900"
                        }`}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                      {!isCollapsed && (
                        <span className="font-medium whitespace-nowrap text-sm">
                          {item.name}
                        </span>
                      )}
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