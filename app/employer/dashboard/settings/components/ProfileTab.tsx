"use client";
import React, { useState, useRef } from "react";

export default function ProfileTab() {
  const [fullName, setFullName] = useState("Sarah Anderson");
  const [email, setEmail] = useState("sarah@company.com");
  const [companyName, setCompanyName] = useState("Acme Corp");
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setAvatar(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full h-fit p-6 space-y-4 bg-gray-50 min-h-screen">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
        <p className="text-sm text-gray-500">Update your personal details and company information.</p>
      </div>

      <div className="bg-white rounded-xl p-6 flex items-center gap-5 border border-gray-300">
        <div className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-bold text-xl shrink-0 overflow-hidden">
          {avatar ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" /> : "SA"}
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-gray-900 text-[16px]">Profile Photo</p>
          <p className="text-xs text-gray-700">JPG, PNG or GIF. Max 2MB.</p>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleUpload}
              className="px-4 py-1.5 text-sm rounded-md border border-gray-400 bg-gray-200 hover:bg-gray-30 text-gray-700 font-medium transition-colors"
            >
              Upload
            </button>
            <button
              onClick={handleRemove}
              className="px-4 py-1.5 text-sm rounded-md text-red-500 hover:bg-red-50 font-medium transition-colors"
            >
              Remove
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-300 overflow-hidden">
        <div className="p-5 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600">Email Address</label>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full font-medium">
                Verified
              </span>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <p className="text-xs text-gray-400">Changing your email requires verification.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-600">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 px-5 py-4 flex items-center justify-between">
          <p className="text-xs text-gray-400">Last updated: Feb 15, 2026</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-[5px] transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}