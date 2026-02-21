"use client";
import React from "react";
import { CreditCard, Zap } from "lucide-react";

export default function BillingTab() {
  const usageStats = [
    { label: "Job Postings", used: 12, total: 25 },
    { label: "Team Members", used: 4, total: 10 },
    { label: "API Calls", used: 8200, total: 50000, display: "8.2K / 50K" },
  ];

  return (
    <div className="w-full h-fit p-6 space-y-4 bg-gray-50 min-h-screen">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-gray-900">Billing</h2>
        <p className="text-sm text-gray-500">Manage your subscription plan and payment method.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">Current Plan</span>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full font-medium">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-1.5 text-sm font-semibold rounded-[5px] border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors">
                Change Plan
              </button>
              <button className="flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-[5px] bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors">
                <Zap size={14} />
                Upgrade
              </button>
            </div>
          </div>

          <div className="mb-1">
            <span className="text-4xl font-bold text-gray-900">$49</span>
            <span className="text-sm text-gray-500 ml-1">/month</span>
          </div>
          <p className="text-sm font-semibold text-gray-900">Employer Pro</p>
          <p className="text-xs text-gray-400 mt-0.5">Renews on March 15, 2026</p>

          <div className="grid grid-cols-3 gap-6 mt-6 border-t border-gray-200 pt-2">
            {usageStats.map((stat) => {
              const pct = (stat.used / stat.total) * 100;
              return (
                <div key={stat.label}>
                  <p className="text-xs font-semibold text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-sm font-bold text-gray-900 mb-2">
                    {stat.display ?? `${stat.used} / ${stat.total}`}
                  </p>
                  <div className="w-full bg-gray-300 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-15 h-10 rounded-lg border border-gray-300 bg-gray-100 flex items-center justify-center text-gray-500">
            <CreditCard size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Visa ending in 4242</p>
            <p className="text-xs text-gray-400">Expires 08/2027</p>
          </div>
        </div>
        <button className="px-4 py-1.5 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium transition-colors">
          Update
        </button>
      </div>
    </div>
  );
}