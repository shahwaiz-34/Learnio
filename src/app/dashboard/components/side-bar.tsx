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
  const { isCollapsed } = useSidebar();
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  // show collapsed state when context says so and not hovered
  const collapsed = isCollapsed && !isHovered;

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex flex-col h-screen bg-white border-r border-gray-200 z-40 ${
        collapsed ? "w-20" : "w-64"
      }`}
      aria-expanded={!collapsed}
    >
      {/* Header / Logo Area */}
      

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 custom-mt-3">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6 px-3">
            {/* Group Header */}
            <div className="h-6 mb-2 flex items-center">
              {isCollapsed ? (
                <MoreHorizontal className="w-4 h-4 text-gray-400 mx-auto" />
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
                      className={`flex items-center rounded-lg transition-[width,background,color,transform] duration-300 ease-out group ${
                        collapsed
                          ? "justify-center w-10 h-10 mx-auto transform-gpu"
                          : "justify-start gap-3 px-3 py-2.5 w-full"
                      } ${
                        isActive
                          ? "bg-[#0a0a0b] text-white shadow-sm scale-100"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <Icon
                        className={`min-w-5 min-h-5 ${
                          isActive ? "text-white" : "text-gray-500 group-hover:text-gray-900"
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