"use client";
import { useSettings } from "@/context/SettingContext";
import ProfileTab from "./components/ProfileTab";
import SecurityTab from "./components/SecurityTab";
import BillingTab from "./components/BillingTab";
import InvoicesTab from "./components/InvoicesTab";

export default function SettingsPage() {
  const { activeTab } = useSettings();
  return (
    <div>
      {activeTab === "profile" && <ProfileTab />}
      {activeTab === "security" && <SecurityTab/>}
      {activeTab === "billing" && <BillingTab/>}
      {activeTab === "invoices" && <InvoicesTab/>}
    </div>
  );
}