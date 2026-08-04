"use client";

import React, { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Clock, 
  Camera, 
  ShieldCheck, 
  Key, 
  Smartphone, 
  Lock, 
  CheckCircle2, 
  History, 
  ExternalLink,
  Laptop,
  Save,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "Shahwaiz Goraya",
    email: "shahwaiz@gmail.com",
    phone: "+92 300 1234567",
    bio: "Full-Stack Web Developer & Content Creator. Building modern course platforms and web apps.",
    timezone: "(UTC+05:00) Islamabad, Karachi",
    language: "English (US)",
  });

  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      toast.success("Profile Updated", {
        description: "Your personal information has been successfully saved.",
      });
    }, 800);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      toast.success("Avatar updated", {
        description: "Click 'Save Changes' to retain this image.",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* 1. HEADER */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-[#0a0a0b] tracking-tight">Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account information, security, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Profile Card & Connected Accounts */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center space-y-4 relative">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-[#0a0a0b] text-white flex items-center justify-center text-2xl font-bold border-4 border-gray-100 shadow-inner overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>SG</span>
                )}
              </div>
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md cursor-pointer transition-colors"
                title="Change Photo"
              >
                <Camera className="w-4 h-4" />
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handlePhotoUpload} 
                />
              </label>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#0a0a0b]">{formData.fullName}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{formData.email}</p>
              <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                Admin
              </span>
            </div>

            <label 
              htmlFor="avatar-upload" 
              className="w-full text-xs font-medium py-2 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-700 cursor-pointer"
            >
              Change Photo
            </label>
          </div>

          {/* Connected Accounts */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#0a0a0b]">Connected Accounts</h3>
            <div className="space-y-3">
              
              {/* Clerk */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    C
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#0a0a0b]">Clerk</p>
                    <p className="text-[10px] text-gray-400">Authentication</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3 h-3" /> Connected
                </span>
              </div>

              {/* Stripe */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                    S
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#0a0a0b]">Stripe</p>
                    <p className="text-[10px] text-gray-400">Payments & Subscriptions</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3 h-3" /> Connected
                </span>
              </div>

              {/* Convex */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                    Cx
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#0a0a0b]">Convex</p>
                    <p className="text-[10px] text-gray-400">Realtime Database</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3 h-3" /> Connected
                </span>
              </div>

            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-gray-400" />
              <h3 className="text-base font-bold text-[#0a0a0b]">Recent Activity</h3>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5 pb-2.5 border-b border-gray-100">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-medium text-[#0a0a0b]">Updated profile details</p>
                  <p className="text-[10px] text-gray-400">Today at 1:17 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 pb-2.5 border-b border-gray-100">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-medium text-[#0a0a0b]">Created course "Photography Mastery"</p>
                  <p className="text-[10px] text-gray-400">Jul 28, 2026</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 pb-2.5 border-b border-gray-100">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-medium text-[#0a0a0b]">Purchased course license</p>
                  <p className="text-[10px] text-gray-400">Jul 20, 2026</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-medium text-[#0a0a0b]">Subscription renewed (Yearly Plan)</p>
                  <p className="text-[10px] text-gray-400">Jun 15, 2026</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Personal Info Form, Account Info & Security */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Personal Information Form */}
          <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-[#0a0a0b]">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl pl-9 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0a0a0b]/20 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl pl-9 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0a0a0b]/20 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl pl-9 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0a0a0b]/20 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Language</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select 
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl pl-9 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0a0a0b]/20 focus:bg-white transition-all"
                  >
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Timezone */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Timezone</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select 
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl pl-9 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0a0a0b]/20 focus:bg-white transition-all"
                >
                  <option>(UTC+05:00) Islamabad, Karachi</option>
                  <option>(UTC+00:00) London, UTC</option>
                  <option>(UTC-05:00) Eastern Time (US & Canada)</option>
                  <option>(UTC-08:00) Pacific Time (US & Canada)</option>
                </select>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Bio</label>
              <textarea 
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0a0a0b]/20 focus:bg-white transition-all"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#0a0a0b] text-white text-xs font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-70"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Account Information (Read-only) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[#0a0a0b]">Account Information</h3>
            <p className="text-xs text-gray-400 -mt-2">System metadata and integration keys (Read-only)</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] uppercase font-semibold text-gray-400">Clerk User ID</span>
                <p className="text-xs font-mono font-medium text-gray-800 mt-1 truncate">user_2x9JkL4mP8qN</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] uppercase font-semibold text-gray-400">Stripe Customer ID</span>
                <p className="text-xs font-mono font-medium text-gray-800 mt-1 truncate">cus_N9xL2pQ1rS5v</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] uppercase font-semibold text-gray-400">Account Created</span>
                <p className="text-xs font-medium text-gray-800 mt-1">Jan 10, 2026</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] uppercase font-semibold text-gray-400">Last Login</span>
                <p className="text-xs font-medium text-gray-800 mt-1">Today at 1:17 PM (PKT)</p>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[#0a0a0b]">Security</h3>

            <div className="divide-y divide-gray-100">
              
              {/* Change Password */}
              <div className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#0a0a0b]">Change Password</p>
                    <p className="text-[11px] text-gray-400">Last changed 45 days ago</p>
                  </div>
                </div>
                <button 
                  onClick={() => toast.info("Redirecting to password reset workflow...")}
                  className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Update
                </button>
              </div>

              {/* Two-Factor Authentication */}
              <div className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg text-green-600">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#0a0a0b]">Two-Factor Authentication (2FA)</p>
                    <p className="text-[11px] text-green-600 font-medium">Enabled via Authenticator App</p>
                  </div>
                </div>
                <button 
                  onClick={() => toast.info("Configuring 2FA settings...")}
                  className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Configure
                </button>
              </div>

              {/* Active Sessions */}
              <div className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#0a0a0b]">Active Sessions</p>
                    <p className="text-[11px] text-gray-400">1 active session on Chrome (macOS)</p>
                  </div>
                </div>
                <button 
                  onClick={() => toast.success("All other sessions logged out.")}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  Log Out Others
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}