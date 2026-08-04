"use client";

import React, { useState } from "react";
import { 
  Globe, 
  CreditCard, 
  BookOpen, 
  Bell, 
  SunMoon, 
  Activity, 
  AlertTriangle, 
  Upload, 
  Save, 
  CheckCircle2, 
  RefreshCw, 
  Trash2, 
  ShieldAlert, 
  Database, 
  Zap, 
  Check,
  ChevronRight,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

type TabType = "general" | "payments" | "courses" | "notifications" | "appearance" | "system" | "danger";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [isSaving, setIsSaving] = useState(false);

  // --- Form States ---
  const [generalSettings, setGeneralSettings] = useState({
    websiteName: "Learnio",
    supportEmail: "support@learnio.com",
    websiteDescription: "The modern platform for creating, managing, and selling online courses seamlessly.",
    logoUrl: null as string | null,
    faviconUrl: null as string | null,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    stripeConnected: true,
    defaultCurrency: "USD",
    taxRate: 10,
  });

  const [courseSettings, setCourseSettings] = useState({
    allowFreeCourses: true,
    autoPublish: false,
    categories: "Web Development, UI/UX Design, Marketing, Mobile Dev, Cloud Computing",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifs: true,
    purchaseNotifs: true,
    subAlerts: true,
    marketingEmails: false,
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "system" as "light" | "dark" | "system",
    primaryColor: "#0a0a0b",
  });

  // --- Handlers ---
  const handleSave = (sectionName: string) => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success(`${sectionName} Saved`, {
        description: "Your settings updates have been successfully applied.",
      });
    }, 700);
  };

  const handleFileUpload = (type: "logo" | "favicon", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setGeneralSettings((prev) => ({
        ...prev,
        [type === "logo" ? "logoUrl" : "faviconUrl"]: url,
      }));
      toast.success(`${type === "logo" ? "Logo" : "Favicon"} Uploaded`, {
        description: "Save changes to retain these modifications.",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* 1. HEADER */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-[#0a0a0b] tracking-tight">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure your application preferences, integrations, and system defaults.</p>
      </div>

      {/* 2. TABBED LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDEBAR NAVIGATION TABS */}
        <div className="lg:col-span-3 space-y-1">
          <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm space-y-1 sticky top-6">
            
            <button
              onClick={() => setActiveTab("general")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "general"
                  ? "bg-[#0a0a0b] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4" />
                <span>General</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${activeTab === "general" ? "text-white" : ""}`} />
            </button>

            <button
              onClick={() => setActiveTab("payments")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "payments"
                  ? "bg-[#0a0a0b] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4" />
                <span>Payments</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${activeTab === "payments" ? "text-white" : ""}`} />
            </button>

            <button
              onClick={() => setActiveTab("courses")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "courses"
                  ? "bg-[#0a0a0b] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4" />
                <span>Course Settings</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${activeTab === "courses" ? "text-white" : ""}`} />
            </button>

            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "notifications"
                  ? "bg-[#0a0a0b] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${activeTab === "notifications" ? "text-white" : ""}`} />
            </button>

            <button
              onClick={() => setActiveTab("appearance")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "appearance"
                  ? "bg-[#0a0a0b] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <SunMoon className="w-4 h-4" />
                <span>Appearance</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${activeTab === "appearance" ? "text-white" : ""}`} />
            </button>

            <button
              onClick={() => setActiveTab("system")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "system"
                  ? "bg-[#0a0a0b] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4" />
                <span>System Status</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${activeTab === "system" ? "text-white" : ""}`} />
            </button>

            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => setActiveTab("danger")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "danger"
                    ? "bg-red-600 text-white shadow-sm"
                    : "text-red-600 hover:bg-red-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Danger Zone</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${activeTab === "danger" ? "text-white" : ""}`} />
              </button>
            </div>

          </div>
        </div>

        {/* TAB CONTENT PANELS */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: GENERAL */}
          {activeTab === "general" && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#0a0a0b]">General Information</h2>
                <p className="text-xs text-gray-500">Global website branding and communication contact details.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Website Name</label>
                    <input 
                      type="text"
                      value={generalSettings.websiteName}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, websiteName: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#0a0a0b]/20 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Support Email</label>
                    <input 
                      type="email"
                      value={generalSettings.supportEmail}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#0a0a0b]/20 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Website Description</label>
                  <textarea 
                    rows={3}
                    value={generalSettings.websiteDescription}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, websiteDescription: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0a0a0b]/20 focus:bg-white transition-all"
                  />
                </div>

                {/* Upload Logos & Favicons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  
                  {/* Logo Upload */}
                  <div className="p-4 border border-dashed border-gray-200 bg-gray-50/50 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
                    <p className="text-xs font-semibold text-[#0a0a0b]">Logo Upload</p>
                    <p className="text-[11px] text-gray-400">PNG, SVG or WEBP (Max 2MB)</p>
                    <label className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-xs font-medium rounded-lg hover:bg-gray-50 cursor-pointer shadow-sm transition-colors">
                      <Upload className="w-3.5 h-3.5 text-gray-500" />
                      <span>{generalSettings.logoUrl ? "Replace Logo" : "Choose File"}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload("logo", e)} />
                    </label>
                  </div>

                  {/* Favicon Upload */}
                  <div className="p-4 border border-dashed border-gray-200 bg-gray-50/50 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
                    <p className="text-xs font-semibold text-[#0a0a0b]">Favicon Upload</p>
                    <p className="text-[11px] text-gray-400">ICO or PNG (32x32px recommended)</p>
                    <label className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-xs font-medium rounded-lg hover:bg-gray-50 cursor-pointer shadow-sm transition-colors">
                      <Upload className="w-3.5 h-3.5 text-gray-500" />
                      <span>{generalSettings.faviconUrl ? "Replace Favicon" : "Choose File"}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload("favicon", e)} />
                    </label>
                  </div>

                </div>
              </div>

              <div className="flex justify-end border-t border-gray-100 pt-4">
                <button
                  onClick={() => handleSave("General Settings")}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#0a0a0b] text-white text-xs font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-70"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PAYMENTS */}
          {activeTab === "payments" && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#0a0a0b]">Payment & Stripe Integration</h2>
                <p className="text-xs text-gray-500">Configure global currency, taxes, and connected payment provider status.</p>
              </div>

              <div className="space-y-5">
                
                {/* Stripe Connected Banner */}
                <div className="flex items-center justify-between p-4 bg-purple-50/60 border border-purple-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                      S
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0a0a0b]">Stripe Integration</p>
                      <p className="text-xs text-purple-700 font-medium">Connected to live merchant gateway</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full border border-green-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Default Currency */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Default Currency</label>
                    <select 
                      value={paymentSettings.defaultCurrency}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, defaultCurrency: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#0a0a0b]/20 focus:bg-white transition-all"
                    >
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                      <option value="GBP">GBP (£) - British Pound</option>
                      <option value="PKR">PKR (Rs) - Pakistani Rupee</option>
                    </select>
                  </div>

                  {/* Tax Rate */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Global Tax Rate (%)</label>
                    <input 
                      type="number"
                      value={paymentSettings.taxRate}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, taxRate: Number(e.target.value) })}
                      className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#0a0a0b]/20 focus:bg-white transition-all"
                    />
                  </div>
                </div>

              </div>

              <div className="flex justify-end border-t border-gray-100 pt-4">
                <button
                  onClick={() => handleSave("Payment Settings")}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#0a0a0b] text-white text-xs font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-70"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: COURSE SETTINGS */}
          {activeTab === "courses" && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#0a0a0b]">Course Settings</h2>
                <p className="text-xs text-gray-500">Default options for course publishing and catalog classifications.</p>
              </div>

              <div className="space-y-5">
                
                {/* Toggles */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-xs font-semibold text-[#0a0a0b]">Allow Free Courses</p>
                      <p className="text-[11px] text-gray-500">Instructors can publish courses with $0 price</p>
                    </div>
                    <input 
                      type="checkbox"
                      checked={courseSettings.allowFreeCourses}
                      onChange={(e) => setCourseSettings({ ...courseSettings, allowFreeCourses: e.target.checked })}
                      className="w-4 h-4 rounded text-[#0a0a0b] focus:ring-[#0a0a0b]"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-xs font-semibold text-[#0a0a0b]">Auto Publish</p>
                      <p className="text-[11px] text-gray-500">Automatically publish courses without manual admin review</p>
                    </div>
                    <input 
                      type="checkbox"
                      checked={courseSettings.autoPublish}
                      onChange={(e) => setCourseSettings({ ...courseSettings, autoPublish: e.target.checked })}
                      className="w-4 h-4 rounded text-[#0a0a0b] focus:ring-[#0a0a0b]"
                    />
                  </div>
                </div>

                {/* Course Categories */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Course Categories (Comma separated)</label>
                  <textarea 
                    rows={2}
                    value={courseSettings.categories}
                    onChange={(e) => setCourseSettings({ ...courseSettings, categories: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0a0a0b]/20 focus:bg-white transition-all"
                  />
                </div>

                {/* Default Thumbnail Upload */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Default Course Thumbnail</label>
                  <div className="p-4 border border-dashed border-gray-200 bg-gray-50/50 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
                    <p className="text-xs font-semibold text-[#0a0a0b]">Fallback Banner Preview</p>
                    <p className="text-[11px] text-gray-400">Default placeholder when no custom course thumbnail is supplied</p>
                    <label className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-xs font-medium rounded-lg hover:bg-gray-50 cursor-pointer shadow-sm transition-colors">
                      <Upload className="w-3.5 h-3.5 text-gray-500" />
                      <span>Upload Banner</span>
                      <input type="file" accept="image/*" className="hidden" onChange={() => toast.success("Thumbnail updated")} />
                    </label>
                  </div>
                </div>

              </div>

              <div className="flex justify-end border-t border-gray-100 pt-4">
                <button
                  onClick={() => handleSave("Course Settings")}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#0a0a0b] text-white text-xs font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-70"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#0a0a0b]">Notification Alerts</h2>
                <p className="text-xs text-gray-500">Manage automated email triggers and platform alerts.</p>
              </div>

              <div className="divide-y divide-gray-100">
                
                <div className="py-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-[#0a0a0b]">Email Notifications</p>
                    <p className="text-[11px] text-gray-500">Master switch for all outbound platform email dispatches</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={notificationSettings.emailNotifs}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifs: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0a0a0b] focus:ring-[#0a0a0b]"
                  />
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-[#0a0a0b]">Purchase Notifications</p>
                    <p className="text-[11px] text-gray-500">Receive instant alerts when a user purchases a course</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={notificationSettings.purchaseNotifs}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, purchaseNotifs: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0a0a0b] focus:ring-[#0a0a0b]"
                  />
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-[#0a0a0b]">Subscription Alerts</p>
                    <p className="text-[11px] text-gray-500">Get notified of renewals, cancellations, and upgraded plans</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={notificationSettings.subAlerts}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, subAlerts: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0a0a0b] focus:ring-[#0a0a0b]"
                  />
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-[#0a0a0b]">Marketing Emails</p>
                    <p className="text-[11px] text-gray-500">Receive feature updates, platform news, and tips</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={notificationSettings.marketingEmails}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, marketingEmails: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0a0a0b] focus:ring-[#0a0a0b]"
                  />
                </div>

              </div>

              <div className="flex justify-end border-t border-gray-100 pt-4">
                <button
                  onClick={() => handleSave("Notification Preferences")}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#0a0a0b] text-white text-xs font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-70"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: APPEARANCE */}
          {activeTab === "appearance" && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#0a0a0b]">Appearance Settings</h2>
                <p className="text-xs text-gray-500">Customize visual themes and dashboard primary accents.</p>
              </div>

              <div className="space-y-6">
                
                {/* Theme Selector */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Theme Mode</label>
                  <div className="grid grid-cols-3 gap-3">
                    
                    <button
                      type="button"
                      onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: "light" })}
                      className={`p-4 rounded-xl border text-center space-y-2 transition-all ${
                        appearanceSettings.theme === "light"
                          ? "border-[#0a0a0b] bg-gray-50 ring-2 ring-[#0a0a0b]/10"
                          : "border-gray-200 hover:bg-gray-50/50"
                      }`}
                    >
                      <div className="w-8 h-8 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xs">
                        ☀
                      </div>
                      <p className="text-xs font-semibold text-[#0a0a0b]">Light Mode</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: "dark" })}
                      className={`p-4 rounded-xl border text-center space-y-2 transition-all ${
                        appearanceSettings.theme === "dark"
                          ? "border-[#0a0a0b] bg-gray-50 ring-2 ring-[#0a0a0b]/10"
                          : "border-gray-200 hover:bg-gray-50/50"
                      }`}
                    >
                      <div className="w-8 h-8 mx-auto rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                        🌙
                      </div>
                      <p className="text-xs font-semibold text-[#0a0a0b]">Dark Mode</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: "system" })}
                      className={`p-4 rounded-xl border text-center space-y-2 transition-all ${
                        appearanceSettings.theme === "system"
                          ? "border-[#0a0a0b] bg-gray-50 ring-2 ring-[#0a0a0b]/10"
                          : "border-gray-200 hover:bg-gray-50/50"
                      }`}
                    >
                      <div className="w-8 h-8 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                        💻
                      </div>
                      <p className="text-xs font-semibold text-[#0a0a0b]">System Theme</p>
                    </button>

                  </div>
                </div>

                {/* Primary Color Picker */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Primary Color Accent</label>
                  <div className="flex items-center gap-3">
                    {["#0a0a0b", "#2563eb", "#7c3aed", "#059669", "#dc2626"].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setAppearanceSettings({ ...appearanceSettings, primaryColor: color })}
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center transition-transform hover:scale-110"
                        style={{ backgroundColor: color }}
                      >
                        {appearanceSettings.primaryColor === color && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <div className="flex justify-end border-t border-gray-100 pt-4">
                <button
                  onClick={() => handleSave("Appearance Settings")}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#0a0a0b] text-white text-xs font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-70"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: SYSTEM STATUS */}
          {activeTab === "system" && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#0a0a0b]">System Operational Health</h2>
                <p className="text-xs text-gray-500">Live operational status monitoring for underlying microservices and databases.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Database */}
                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500">Database Status</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Operational
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[#0a0a0b]">PostgreSQL Cluster</p>
                  <p className="text-[11px] text-gray-400">Latency: 12ms | Connections: Active</p>
                </div>

                {/* API Status */}
                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500">API Gateway Status</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Operational
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[#0a0a0b]">Next.js API Routes</p>
                  <p className="text-[11px] text-gray-400">Uptime: 99.98% | Response: 45ms</p>
                </div>

                {/* Stripe Status */}
                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500">Stripe Webhook Relay</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Operational
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[#0a0a0b]">Stripe Subscriptions</p>
                  <p className="text-[11px] text-gray-400">Webhooks: Synced & Active</p>
                </div>

                {/* Convex Status */}
                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500">Convex Realtime</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Operational
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[#0a0a0b]">Convex Cloud Backend</p>
                  <p className="text-[11px] text-gray-400">Syncing live course state</p>
                </div>

              </div>
            </div>
          )}

          {/* TAB 7: DANGER ZONE */}
          {activeTab === "danger" && (
            <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3 text-red-600">
                <ShieldAlert className="w-6 h-6" />
                <div>
                  <h2 className="text-lg font-bold text-red-900">Danger Zone</h2>
                  <p className="text-xs text-red-600">Irreversible administrative actions. Proceed with extreme caution.</p>
                </div>
              </div>

              <div className="divide-y divide-red-100 border-t border-b border-red-100">
                
                {/* Reset Demo Data */}
                <div className="py-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#0a0a0b]">Reset Demo Data</p>
                    <p className="text-[11px] text-gray-500">Restore all metrics, courses, and users back to seed defaults</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to reset all demo data?")) {
                        toast.success("Demo Data Reset", { description: "Database restored to initial seeds." });
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-semibold hover:bg-amber-100 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset Data
                  </button>
                </div>

                {/* Delete All Courses */}
                <div className="py-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#0a0a0b]">Delete All Courses</p>
                    <p className="text-[11px] text-gray-500">Permanently erase all published and draft course content from database</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm("DANGER: Are you sure you want to delete ALL courses? This cannot be undone.")) {
                        toast.error("Courses Deleted", { description: "All courses have been permanently deleted." });
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Courses
                  </button>
                </div>

                {/* Delete Account */}
                <div className="py-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-red-700">Delete Administrator Account</p>
                    <p className="text-[11px] text-gray-500">Completely purge your profile, subscriptions, and access tokens</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm("CRITICAL WARNING: This will permanently delete your admin account. Continue?")) {
                        toast.error("Account Purged", { description: "Your admin account has been scheduled for deletion." });
                      }
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Account
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}