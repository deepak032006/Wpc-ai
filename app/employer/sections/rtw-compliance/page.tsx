'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// --- Types ---
type TabId = "staff" | "rtw" | "pension" | "auth" | "contracts" | "financial" | "summary";

type Employee = {
  id: string;
  name: string;
  nationality: string;
  documentType?: string;
  documentNumber?: string;
  startDate?: string;
};

// --- Tabs ---
const tabs: { label: string; id: TabId }[] = [
  { label: "Staff List", id: "staff" },
  { label: "1. RTW Compliance", id: "rtw" },
  { label: "2. Pension", id: "pension" },
  { label: "3. Authorising Officer", id: "auth" },
  { label: "4. Contracts", id: "contracts" },
  { label: "5. Financial", id: "financial" },
  { label: "6. Summary", id: "summary" },
];

// --- Icons ---
const GreenCheckCircle = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
    <circle cx="28" cy="28" r="27" stroke="#10B981" strokeWidth="2" fill="none" />
    <path d="M18 28l8 8 12-14" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: "2px" }}>
    <path d="M8 2L1 14h14L8 2z" fill="none" stroke="#DC2626" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M8 7v3M8 12v.5" stroke="#DC2626" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

// --- Helpers ---
function formatDate(dateStr?: string): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = d.getDate();
  const suffix = day === 1 || day === 21 || day === 31 ? "st" : day === 2 || day === 22 ? "nd" : day === 3 || day === 23 ? "rd" : "th";
  const month = d.toLocaleString("en-GB", { month: "long" });
  return `${month} ${day}${suffix}, ${d.getFullYear()}`;
}

function getInitial(name?: string): string {
  return (name || "?").trim()[0].toUpperCase();
}

// --- TopNav Component ---
function TopNav({ activeTabId, onBack, onTabClick, isTabUnlocked }: {
  activeTabId: TabId;
  onBack: () => void;
  onTabClick: (tabId: TabId) => void;
  isTabUnlocked: (tabId: TabId) => boolean;
}) {
  return (
    <div style={{ backgroundColor: "white", borderBottom: "1px solid #E2E8F0", padding: "0 28px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingTop: "16px", paddingBottom: "2px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center" }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M13 15L8 10L13 5" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#0F172A" }}>HR Records Validation</h1>
          <div style={{ fontSize: "11.5px", color: "#94A3B8", marginTop: "1px" }}>V.03</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "6px", marginTop: "10px", paddingBottom: "12px", overflowX: "auto" }}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const unlocked = isTabUnlocked(tab.id);
          return (
            <button key={tab.id} onClick={() => onTabClick(tab.id)} style={{
              padding: "6px 16px",
              borderRadius: "20px",
              border: isActive ? "none" : "1.5px solid #D1D5DB",
              cursor: unlocked && !isActive ? "pointer" : "default",
              fontSize: "13px",
              fontWeight: isActive ? "600" : "400",
              color: isActive ? "white" : "#374151",
              backgroundColor: isActive ? "#0852C9" : "white",
              whiteSpace: "nowrap",
              transition: "all 0.15s",
              boxShadow: isActive ? "none" : "0 1px 2px rgba(0,0,0,0.04)",
            }}>{tab.label}</button>
          );
        })}
      </div>
    </div>
  );
}

// --- NoMigrantScreen ---
function NoMigrantScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div style={{ maxWidth: "860px", margin: "30px auto", padding: "0 24px" }}>
      <div style={{
        backgroundColor: "white", borderRadius: "12px", border: "1px solid #E2E8F0",
        padding: "80px 40px", display: "flex", flexDirection: "column",
        alignItems: "center", textAlign: "center", gap: "10px",
      }}>
        <GreenCheckCircle />
        <h2 style={{ margin: "10px 0 0", fontSize: "20px", fontWeight: "700", color: "#0F172A" }}>No Migrant Employees</h2>
        <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#64748B", maxWidth: "380px", lineHeight: "1.65" }}>
          All employees are British/Irish and skip RTW validation.
        </p>
        <button onClick={onContinue} style={{
          marginTop: "12px", padding: "11px 28px", backgroundColor: "#0852C9",
          color: "white", border: "none", borderRadius: "8px",
          fontSize: "14px", fontWeight: "600", cursor: "pointer",
        }}>
          Continue to Pension Compliance
        </button>
      </div>
    </div>
  );
}

// --- RTWVerificationScreen ---
function RTWVerificationScreen({ migrants, onBackToStaffList }: { migrants: Employee[], onBackToStaffList: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const employee = migrants[currentIndex];
  const hasDocument = !!(employee?.documentType || employee?.documentNumber);
  const formattedStart = employee?.startDate ? formatDate(employee.startDate) : null;

  return (
    <div style={{ maxWidth: "860px", margin: "30px auto", padding: "0 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: "22px" }}>
        <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#0F172A", letterSpacing: "-0.3px" }}>
          Workflow 1: RTW & Start Date Compliance
        </h2>
        <p style={{ margin: "6px 0 0", fontSize: "13.5px", color: "#64748B" }}>
          Validating Right to Work documents for migrant employees
        </p>
      </div>

      {/* Employee Info & Card */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <button style={{
          padding: "5px 16px", borderRadius: "20px",
          border: "1.5px solid #E2E8F0",
          backgroundColor: "white", color: "#475569",
          fontSize: "13px", fontWeight: "400", cursor: "default",
        }}>Employee {currentIndex + 1} of {migrants.length}</button>
        <span style={{ fontSize: "13.5px", color: "#475569", fontWeight: "500" }}>{employee?.name}</span>
      </div>

      <div style={{
        backgroundColor: "white", borderRadius: "10px", border: "1px solid #E2E8F0",
        padding: "20px 24px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "16px",
      }}>
        <div style={{
          width: "44px", height: "44px", borderRadius: "50%",
          backgroundColor: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px", fontWeight: "700", color: "#0852C9", flexShrink: 0,
        }}>{getInitial(employee?.name)}</div>
        <div>
          <div style={{ fontSize: "17px", fontWeight: "700", color: "#0F172A" }}>{employee?.name}</div>
          <div style={{ fontSize: "13px", color: "#64748B", marginTop: "4px" }}>
            Migrant Worker{formattedStart ? ` • Employment Start: ${formattedStart}` : ""}
          </div>
        </div>
      </div>

      {/* RTW Verification */}
      <div style={{
        backgroundColor: "white", borderRadius: "10px", border: "1px solid #E2E8F0",
        padding: "24px 26px", marginBottom: "28px",
      }}>
        <h3 style={{ margin: "0 0 5px", fontSize: "16px", fontWeight: "700", color: "#0F172A" }}>RTW Document Verification</h3>
        <p style={{ margin: "0 0 18px", fontSize: "13px", color: "#64748B" }}>Verify the uploaded RTW document and extracted information</p>
        {!hasDocument ? (
          <div style={{
            display: "flex", alignItems: "flex-start", gap: "11px",
            padding: "14px 18px",
            backgroundColor: "#FFF5F5",
            borderRadius: "8px", border: "1.5px solid #FCA5A5",
          }}>
            <AlertTriangleIcon />
            <div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#DC2626", marginBottom: "3px" }}>RTW Document Missing</div>
              <div style={{ fontSize: "13px", color: "#DC2626", lineHeight: "1.5" }}>
                No RTW document has been uploaded for this employee. Validation cannot proceed.
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            padding: "16px 18px", backgroundColor: "#F0FDF4",
            borderRadius: "8px", border: "1.5px solid #BBF7D0",
          }}>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "#166534", marginBottom: "10px" }}>✓ RTW Document on File</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: "12px" }}>
              {employee.documentType && <div>
                <div style={{ fontSize: "11px", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "3px" }}>Document Type</div>
                <div style={{ fontSize: "13.5px", fontWeight: "600", color: "#0F172A" }}>{employee.documentType}</div>
              </div>}
              {employee.documentNumber && <div>
                <div style={{ fontSize: "11px", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "3px" }}>Document No.</div>
                <div style={{ fontSize: "13.5px", fontWeight: "600", color: "#0F172A" }}>{employee.documentNumber}</div>
              </div>}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={onBackToStaffList} style={{
          padding: "10px 20px", backgroundColor: "white", color: "#374151",
          border: "1.5px solid #D1D5DB", borderRadius: "8px",
          fontSize: "14px", fontWeight: "500", cursor: "pointer",
        }}>Back to Staff List</button>

        {migrants.length > 1 && <div style={{ display: "flex", gap: "10px" }}>
          {currentIndex > 0 && <button onClick={() => setCurrentIndex(currentIndex - 1)} style={{
            padding: "10px 18px", backgroundColor: "white", color: "#475569",
            border: "1.5px solid #E2E8F0", borderRadius: "8px",
            fontSize: "13.5px", fontWeight: "500", cursor: "pointer",
          }}>← Previous</button>}
          {currentIndex < migrants.length - 1 && <button onClick={() => setCurrentIndex(currentIndex + 1)} style={{
            padding: "10px 18px", backgroundColor: "#0852C9", color: "white",
            border: "none", borderRadius: "8px",
            fontSize: "13.5px", fontWeight: "600", cursor: "pointer",
          }}>Next Employee →</button>}
        </div>}
      </div>
    </div>
  );
}

// --- Main Component ---
export default function RTWCompliance() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("hr_employees");
      if (saved) setEmployees(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  const migrants = employees.filter((e) => e.nationality === "Migrant");
  const hasMigrants = migrants.length > 0;

  const getProgress = (): Record<string, boolean> => {
    try { return JSON.parse(sessionStorage.getItem("hr_progress") || "{}"); } catch { return {}; }
  };

  const markRTWComplete = () => {
    try {
      const p = getProgress();
      sessionStorage.setItem("hr_progress", JSON.stringify({ ...p, rtw: true }));
    } catch {}
  };

  const isTabUnlocked = (tabId: TabId): boolean => {
    if (tabId === "staff" || tabId === "rtw") return true;
    const p = getProgress();
    if (tabId === "pension") return !!p.rtw;
    if (tabId === "auth") return !!p.pension;
    if (tabId === "contracts") return !!p.auth;
    if (tabId === "financial") return !!p.contracts;
    if (tabId === "summary") return !!p.financial;
    return false;
  };

  const handleTabClick = (tabId: TabId) => {
    if (tabId === "rtw") return;
    if (tabId === "staff") { router.push("/employer/sections/hr-validation"); return; }
    if (!isTabUnlocked(tabId)) return;

    const routes: Record<Exclude<TabId, "staff" | "rtw">, string> = {
      pension: "/employer/sections/pension",
      auth: "/employer/sections/authorising-officer",
      contracts: "/employer/sections/contracts",
      financial: "/employer/sections/financial",
      summary: "/employer/sections/summary",
    };
    if (tabId in routes) router.push(routes[tabId as keyof typeof routes]);
  };

  const handleBack = () => router.push("/employer/sections/hr-validation");
  const handleContinueToPension = () => { markRTWComplete(); router.push("/employer/sections/pension"); };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", backgroundColor: "#F1F5F9", minHeight: "100vh" }}>
      <TopNav activeTabId="rtw" onBack={handleBack} onTabClick={handleTabClick} isTabUnlocked={isTabUnlocked} />
      {loaded && (hasMigrants
        ? <RTWVerificationScreen migrants={migrants} onBackToStaffList={handleBack} />
        : <NoMigrantScreen onContinue={handleContinueToPension} />
      )}
    </div>
  );
}