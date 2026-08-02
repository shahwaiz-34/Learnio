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
  PanelLeft,
  MoreHorizontal
} from "lucide-react";

const menuGroups = [
  {
    title: "DASHBOARD",
    items: [
      { name: "Courses Dashboard", icon: LayoutDashboard, href: "/dashboard" },
      { name: "Students", icon: Users, href: "/students" },
      { name: "Purchases", icon: ShoppingBag, href: "/purchases" },
      { name: "Subscriptions", icon: CreditCard, href: "/subscriptions" },
      { name: "Analytics", icon: BarChart2, href: "/analytics" },
      { name: "Payments", icon: Wallet, href: "/payments" },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      { name: "Settings", icon: Settings, href: "/settings" },
      { name: "Profile", icon: User, href: "/profile" },
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
      className={`relative flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-40 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header / Logo Area */}
      <div className="flex items-center justify-between h-16 px-4 py-4 mt-2">
        <div className="flex items-center gap-2 overflow-hidden">
          {/* Logo Circle */}
          <div className="flex items-center justify-center min-w-10 min-h-10 bg-[#0a0a0b] text-white rounded-full font-bold text-xl">
            {isCollapsed ? "L" : "le"}
          </div>
          {/* Learnio Brand Name */}
          {!isCollapsed && (
            <span className="text-xl font-bold tracking-tight text-[#0a0a0b] whitespace-nowrap opacity-100 transition-opacity duration-300">
              Learnio.
            </span>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsManualCollapse(!isManualCollapse)}
          className={`absolute ${
            isCollapsed ? "right-[-20px] top-6" : "right-4 top-6"
          } bg-white hover:bg-gray-50 text-gray-900 transition-all z-10`}
          aria-label={isManualCollapse ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <PanelLeft size={24} strokeWidth={1.5} />
        </button>
      </div>

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