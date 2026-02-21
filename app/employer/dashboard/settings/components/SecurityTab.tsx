"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function SecurityTab() {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="w-full h-fit p-6 space-y-4 bg-gray-50 min-h-screen">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-gray-900">Security</h2>
        <p className="text-sm text-gray-500">Manage your password, two-factor authentication, and active sessions.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-5 space-y-4">
          <p className="text-sm font-bold text-gray-900">Change Password</p>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-600">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                placeholder="Enter current password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white outline-none focus:ring-2 focus:ring-blue-500 transition pr-10"
              />
              <button
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-600">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Enter new password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white outline-none focus:ring-2 focus:ring-blue-500 transition pr-10"
              />
              <button
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-600">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm new password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white outline-none focus:ring-2 focus:ring-blue-500 transition pr-10"
              />
              <button
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-5 py-4 flex items-center justify-end gap-[5px]">
          <button className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-5 py-2 rounded-[5px] transition-colors">
            Forget Password
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-[5px] transition-colors">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}