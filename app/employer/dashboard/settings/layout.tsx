"use client";
import { Shield, User2, CreditCard, FileText } from "lucide-react";
import { SettingsProvider, useSettings } from "@/context/SettingContext";

const tabs = [
  { id: 1, label: "Profile", icon: User2, value: "profile" },
  { id: 2, label: "Security", icon: Shield, value: "security" },
  { id: 3, label: "Billing", icon: CreditCard, value: "billing" },
  { id: 4, label: "Invoices", icon: FileText, value: "invoices" },
];

function TopTabs() {
  const { activeTab, setActiveTab } = useSettings();
  return (
    <div className="w-full bg-white border-b border-gray-200 px-6 pt-6">
      <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
      <p className="text-sm text-gray-500 mb-4">Manage your account</p>
      <nav className="flex flex-row gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 cursor-pointer
                ${isActive
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                }`}
            >
              <Icon size={16} className={isActive ? "text-blue-700" : "text-gray-400"} />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <div className="flex flex-col h-full overflow-hidden">
        <TopTabs />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </SettingsProvider>
  );
}