"use client";
import { Shield, User2, CreditCard, FileText } from "lucide-react";
import { SettingsProvider, useSettings } from "@/context/SettingContext";

const tabs = [
  { id: 1, label: "Profile", icon: User2, value: "profile" },
  { id: 2, label: "Security", icon: Shield, value: "security" },
  { id: 3, label: "Billing", icon: CreditCard, value: "billing" },
  { id: 4, label: "Invoices", icon: FileText, value: "invoices" },
];

function Sidebar() {
  const { activeTab, setActiveTab } = useSettings();
  return (
    <div className="w-full sm:w-[25%] md:w-[20%] bg-white p-4 border-r border-gray-100">
      <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
      <p className="text-sm text-gray-500 mb-6">Manage your account</p>
      <nav className="flex flex-row sm:flex-col gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-3 px-3 py-2 rounded-[5px] text-sm font-medium transition-colors w-full text-left cursor-pointer
              ${isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
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
      <div className="flex flex-col sm:flex-row h-full overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </SettingsProvider>
  );
}