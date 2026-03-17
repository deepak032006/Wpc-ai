'use client';

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createAuthorisingOfficerAction,
  listEmployeesAction,
  type Employee,
} from "@/app/employer/sections/action/action";

interface Tab { label: string; id: string; }
interface Progress { [key: string]: boolean; }
interface Creds { seniorMost: boolean; director: boolean; onPayroll: boolean; holdsShares: boolean; }
interface AOStatusResult { ok: boolean; reason: string | null; }
interface CredItem { key: keyof Creds; label: string; desc: string; }

function getClientToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.split("; ").find((row) => row.startsWith("access-token="));
  if (!match) return "";
  return decodeURIComponent(match.split("=").slice(1).join("="))
    .replace(/\s+/g, "").replace(/^(Bearer|Token)\s*/i, "");
}

const tabs: Tab[] = [
  { label: "Staff List", id: "staff" },
  { label: "1. RTW Compliance", id: "rtw" },
  { label: "2. Pension", id: "pension" },
  { label: "3. Authorising Officer", id: "auth" },
  { label: "4. Contracts", id: "contracts" },
  { label: "5. Financial", id: "financial" },
  { label: "6. Summary", id: "summary" },
];

const getProgress = (): Progress => {
  try { return JSON.parse(sessionStorage.getItem("hr_progress") || "{}"); } catch { return {}; }
};
const markComplete = (key: string): void => {
  try {
    const p = getProgress();
    sessionStorage.setItem("hr_progress", JSON.stringify({ ...p, [key]: true }));
  } catch {}
};
const isTabUnlocked = (tabId: string): boolean => {
  if (["staff", "rtw", "pension", "auth"].includes(tabId)) return true;
  const p = getProgress();
  if (tabId === "contracts") return !!p.auth;
  if (tabId === "financial") return !!p.contracts;
  if (tabId === "summary") return !!p.financial;
  return false;
};

function getAOStatus(creds: Creds): AOStatusResult | null {
  const { seniorMost, director, onPayroll, holdsShares } = creds;
  if (seniorMost) return { ok: true, reason: "Senior-most employee responsible for recruitment" };
  if (director && onPayroll) return { ok: true, reason: "Director on payroll" };
  if (director && holdsShares) return { ok: true, reason: "Director holding shares" };
  if (onPayroll && holdsShares) return { ok: true, reason: "Senior management employee on payroll" };
  if (director && !onPayroll && !holdsShares) return { ok: false, reason: null };
  if (Object.values(creds).every((v) => !v)) return null;
  return { ok: false, reason: null };
}

const SpinnerIcon = ({ color = "#0852C9" }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ animation: "spin 1s linear infinite" }}>
    <circle cx="10" cy="10" r="8" stroke="#CBD5E1" strokeWidth="2.5" />
    <path d="M10 2a8 8 0 018 8" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 2L3 5v5c0 4.418 3.134 7.891 7 8.944C16.866 17.891 20 14.418 20 10V5l-7-3H10z"
      stroke="#374151" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
  </svg>
);
const GreenCircleCheck = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="8" cy="8" r="7" stroke="#16A34A" strokeWidth="1.4" fill="none" />
    <path d="M5 8l2 2 4-4" stroke="#16A34A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const RedCircleX = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="8" cy="8" r="7" stroke="#DC2626" strokeWidth="1.4" fill="none" />
    <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#DC2626" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

function TopNav({ onBack, onTabClick }: { onBack: () => void; onTabClick: (id: string) => void }) {
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
          const isActive = tab.id === "auth";
          const unlocked = isTabUnlocked(tab.id);
          return (
            <button key={tab.id} onClick={() => onTabClick(tab.id)} style={{
              padding: "6px 16px", borderRadius: "20px",
              border: isActive ? "none" : "1.5px solid #D1D5DB",
              cursor: unlocked && !isActive ? "pointer" : "default",
              fontSize: "13px", fontWeight: isActive ? "600" : "400",
              color: isActive ? "white" : "#374151",
              backgroundColor: isActive ? "#0852C9" : "white",
              whiteSpace: "nowrap",
            }}>{tab.label}</button>
          );
        })}
      </div>
    </div>
  );
}

function AOCriteriaBox() {
  return (
    <div style={{ backgroundColor: "white", borderRadius: "10px", border: "1px solid #E2E8F0", padding: "22px 26px" }}>
      <p style={{ margin: "0 0 14px", fontSize: "14px", fontWeight: "700", color: "#0F172A" }}>Acceptable AO Criteria:</p>
      {["Senior-most employee responsible for recruitment", "Director on payroll", "Director holding shares", "Senior management employee on payroll"].map((c) => (
        <div key={c} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <GreenCircleCheck />
          <span style={{ fontSize: "13.5px", color: "#374151" }}>{c}</span>
        </div>
      ))}
      <div style={{ borderTop: "1px solid #E2E8F0", marginTop: "12px", paddingTop: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
        <RedCircleX />
        <span style={{ fontSize: "13.5px", color: "#DC2626", fontWeight: "500" }}>Not Acceptable: Director not on payroll AND holding no shares</span>
      </div>
    </div>
  );
}

function CredRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: () => void }) {
  return (
    <div onClick={onChange} style={{
      display: "flex", alignItems: "flex-start", gap: "12px",
      padding: "14px 16px", borderRadius: "8px", marginBottom: "10px",
      border: `1.5px solid ${checked ? "#0852C9" : "#E2E8F0"}`,
      backgroundColor: checked ? "#F0F6FF" : "white", cursor: "pointer",
    }}>
      <div style={{
        width: "18px", height: "18px", borderRadius: "4px", flexShrink: 0, marginTop: "1px",
        border: `2px solid ${checked ? "#0852C9" : "#D1D5DB"}`,
        backgroundColor: checked ? "#0852C9" : "white",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {checked && <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5l2.5 2.5L9 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </div>
      <div>
        <div style={{ fontSize: "13.5px", fontWeight: "600", color: "#0F172A" }}>{label}</div>
        <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>{desc}</div>
      </div>
    </div>
  );
}

function AODetailsForm({
  mode, employees, hrRecordId, onValidate, onContinue, onChangeMode,
}: {
  mode: string;
  employees: Employee[];
  hrRecordId: number | null;
  onValidate: (status: AOStatusResult | null) => void;
  onContinue: () => void;
  onChangeMode: () => void;
}) {
  const [selectedEmpId, setSelectedEmpId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [creds, setCreds] = useState<Creds>({ seniorMost: false, director: false, onPayroll: false, holdsShares: false });
  const [validated, setValidated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const toggleCred = (key: keyof Creds) => { setCreds((prev) => ({ ...prev, [key]: !prev[key] })); setValidated(false); };

  const handleEmpChange = (empId: string) => {
    const id = parseInt(empId, 10);
    setSelectedEmpId(id);
    const emp = employees.find((e) => e.id === id);
    if (emp) setName(emp.employee_full_name);
    setValidated(false);
    setCreds({ seniorMost: false, director: false, onPayroll: false, holdsShares: false });
  };

  const status = getAOStatus(creds);
  const canValidate = name.trim().length > 0 && role.trim().length > 0;

  const handleValidate = async () => {
    if (!canValidate) return;
    if (!hrRecordId) {
      setApiError("HR Record ID missing. Please go back to Staff List.");
      return;
    }
    setSubmitting(true);
    setApiError("");

    const res = await createAuthorisingOfficerAction(
      {
        HRValidationRecord_id: hrRecordId,
        Employee_id: null,
        selected_from_staff: false,
        full_name: name,
        role_in_company: role,
        AO_Credentials_senior_most_employee: creds.seniorMost,
        AO_Credentials_company_director: creds.director,
        AO_Credentials_on_payroll: creds.onPayroll,
        AO_Credentials_holds_shared: creds.holdsShares,
      },
      getClientToken(),
    );

    if (!res.success) { console.error("FULL ERROR:", res.message); setApiError(res.message); setSubmitting(false); return; }
    setValidated(true);
    onValidate(status);
    setSubmitting(false);
  };

  const credList: CredItem[] = [
    { key: "seniorMost", label: "Senior-most employee", desc: "Responsible for recruitment decisions" },
    { key: "director", label: "Director", desc: "Listed as company director" },
    { key: "onPayroll", label: "On Payroll", desc: "Receives regular salary from the company" },
    { key: "holdsShares", label: "Holds Shares", desc: "Has shareholding in the company" },
  ];

  return (
    <div style={{ backgroundColor: "white", borderRadius: "10px", border: "1px solid #E2E8F0", padding: "24px 26px", marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <ShieldIcon />
          <div>
            <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#0F172A" }}>Authorising Officer Details</h3>
            <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#64748B" }}>{mode === "staff" ? "Select an employee and verify credentials" : "Enter new AO's details"}</p>
          </div>
        </div>
        <button onClick={onChangeMode} style={{ background: "none", border: "none", cursor: "pointer", color: "#0852C9", fontSize: "13.5px", fontWeight: "600" }}>Change</button>
      </div>

      {apiError && (
        <div style={{ marginBottom: "14px", padding: "12px 16px", backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px" }}>
          <p style={{ margin: 0, fontSize: "13px", color: "#DC2626" }}>⚠ {apiError}</p>
        </div>
      )}

      {mode === "staff" && (
        <div style={{ marginBottom: "16px" }}>
          <label style={lbl}>Select Employee</label>
          <div style={{ position: "relative" }}>
            <select value={selectedEmpId ?? ""} onChange={(e) => handleEmpChange(e.target.value)} style={{ ...inputStyle, appearance: "none", paddingRight: "36px" }}>
              <option value="">-- Select employee --</option>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.employee_full_name}</option>)}
            </select>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <path d="M3 5l4 4 4-4" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      )}

      <div style={{ marginBottom: "16px" }}>
        <label style={lbl}>Full Name *</label>
        <input type="text" value={name} onChange={(e) => { setName(e.target.value); setValidated(false); }}
          readOnly={mode === "staff" && !!selectedEmpId}
          placeholder={mode === "staff" ? "" : "Enter full name"}
          style={{ ...inputStyle, backgroundColor: (mode === "staff" && !!selectedEmpId) ? "#F8FAFC" : "white" }} />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={lbl}>Role / Position *</label>
        <input type="text" value={role} onChange={(e) => { setRole(e.target.value); setValidated(false); }}
          placeholder="Enter role or position" style={inputStyle} />
      </div>

      <p style={{ margin: "0 0 12px", fontSize: "13.5px", fontWeight: "600", color: "#0F172A" }}>AO Credentials</p>
      {credList.map((c) => <CredRow key={c.key} label={c.label} desc={c.desc} checked={creds[c.key]} onChange={() => toggleCred(c.key)} />)}

      {validated && status !== null && (
        <div style={{ marginTop: "12px" }}>
          {status.ok ? (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "14px 16px", backgroundColor: "#F0FDF4", borderRadius: "8px", border: "1.5px solid #86EFAC" }}>
              <GreenCircleCheck />
              <div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#166534" }}>AO Acceptable</div>
                <div style={{ fontSize: "13px", color: "#166534", marginTop: "2px" }}>✓ {status.reason}</div>
              </div>
            </div>
          ) : (
            <div style={{ padding: "14px 16px", backgroundColor: "#FFF5F5", borderRadius: "8px", border: "1.5px solid #FCA5A5" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <RedCircleX />
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#DC2626" }}>AO Not Acceptable</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <button onClick={handleValidate} disabled={!canValidate || submitting}
          style={{ width: "100%", padding: "13px", backgroundColor: "#0852C9", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: canValidate && !submitting ? "pointer" : "not-allowed", opacity: canValidate && !submitting ? 1 : 0.5, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          {submitting ? <><SpinnerIcon color="#fff" /> Saving…</> : "Validate Authorising Officer"}
        </button>
        {validated && status?.ok && (
          <button onClick={onContinue} style={{ width: "100%", padding: "13px", backgroundColor: "#0F172A", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
            Continue to Contract Validation →
          </button>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// INNER PAGE — uses useSearchParams, must live inside <Suspense>
// ═══════════════════════════════════════════════════════════════════════════════
function AuthorisingOfficerInner(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [mode, setMode] = useState<string | null>(null);
  const [aoStatus, setAOStatus] = useState<AOStatusResult | null>(null);
  const [hrRecordId, setHrRecordId] = useState<number | null>(null);
  const [loadingEmps, setLoadingEmps] = useState(false);

  useEffect(() => {
    const fromUrl = searchParams.get("record_id");
    let recordId: number | null = null;

    if (fromUrl && !isNaN(parseInt(fromUrl, 10))) {
      recordId = parseInt(fromUrl, 10);
      try { sessionStorage.setItem("hr_record_id", fromUrl); } catch {}
    } else {
      try {
        const v = sessionStorage.getItem("hr_record_id");
        if (v && !isNaN(parseInt(v, 10))) recordId = parseInt(v, 10);
      } catch {}
    }

    setHrRecordId(recordId);

    if (recordId) {
      setLoadingEmps(true);
      listEmployeesAction(recordId, getClientToken()).then((res) => {
        if (res.success && res.data) setEmployees(res.data);
        setLoadingEmps(false);
      });
    }
  }, [searchParams]);

  const rid = (id: number | null) => id ? `?record_id=${id}` : "";

  const handleTabClick = (tabId: string): void => {
    if (tabId === "auth") return;
    const routes: Record<string, string> = {
      staff: `/employer/sections/hr-validation${rid(hrRecordId)}`,
      rtw: `/employer/sections/rtw-compliance${rid(hrRecordId)}`,
      pension: `/employer/sections/hr-validation/pension${rid(hrRecordId)}`,
      contracts: `/employer/sections/contracts${rid(hrRecordId)}`,
      financial: `/employer/sections/financial${rid(hrRecordId)}`,
      summary: `/employer/sections/summary${rid(hrRecordId)}`,
    };
    if (!isTabUnlocked(tabId)) return;
    if (routes[tabId]) router.push(routes[tabId]);
  };

  const handleContinue = (): void => {
    markComplete("auth");
    router.push(`/employer/sections/contracts${rid(hrRecordId)}`);
  };

  const selectOptions = [
    {
      id: "staff",
      icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="11" r="5" stroke="#0852C9" strokeWidth="1.8" fill="none" /><path d="M4 25c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#0852C9" strokeWidth="1.8" strokeLinecap="round" fill="none" /></svg>,
      title: "Select from Staff",
      desc: "Choose an existing employee as Authorising Officer",
    },
    {
      id: "new",
      icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 6v16M6 14h16" stroke="#0852C9" strokeWidth="2" strokeLinecap="round" /></svg>,
      title: "Add New Individual",
      desc: "Add a new person as Authorising Officer",
    },
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", backgroundColor: "#F1F5F9", minHeight: "100vh" }}>
      <TopNav onBack={() => router.back()} onTabClick={handleTabClick} />
      <div style={{ maxWidth: "860px", margin: "30px auto", padding: "0 24px" }}>
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#0F172A", letterSpacing: "-0.3px" }}>Workflow 3: Authorising Officer Assessment</h2>
          <p style={{ margin: "6px 0 0", fontSize: "13.5px", color: "#64748B" }}>Select and validate the Authorising Officer for sponsor licence compliance</p>
        </div>

        {!mode ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              {selectOptions.map((opt) => (
                <button key={opt.id} onClick={() => setMode(opt.id)}
                  style={{ backgroundColor: "white", border: "1.5px solid #E2E8F0", borderRadius: "10px", padding: "28px 24px", textAlign: "left", cursor: "pointer", transition: "all 0.15s" }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = "#0852C9"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(8,82,201,0.08)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "10px", backgroundColor: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>{opt.icon}</div>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", marginBottom: "6px" }}>{opt.title}</div>
                  <div style={{ fontSize: "13px", color: "#64748B", lineHeight: "1.5" }}>{opt.desc}</div>
                </button>
              ))}
            </div>
            <AOCriteriaBox />
          </>
        ) : (
          <>
            {loadingEmps && mode === "staff" ? (
              <div style={{ textAlign: "center", padding: "24px" }}><SpinnerIcon /></div>
            ) : (
              <AODetailsForm
                mode={mode}
                employees={employees}
                hrRecordId={hrRecordId}
                onValidate={setAOStatus}
                onContinue={handleContinue}
                onChangeMode={() => { setMode(null); setAOStatus(null); }}
              />
            )}
            <AOCriteriaBox />
          </>
        )}

        <div style={{ marginTop: "24px" }}>
          <button onClick={() => router.push(`/employer/sections/hr-validation/pension${rid(hrRecordId)}`)}
            style={{ padding: "10px 20px", backgroundColor: "white", color: "#374151", border: "1.5px solid #D1D5DB", borderRadius: "8px", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>
            Back to Pension Compliance
          </button>
        </div>
      </div>
    </div>
  );
}


export default function AuthorisingOfficer(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div style={{
          fontFamily: "'Segoe UI', system-ui, sans-serif",
          backgroundColor: "#F1F5F9",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <SpinnerIcon />
        </div>
      }
    >
      <AuthorisingOfficerInner />
    </Suspense>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "6px" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #D1D5DB", fontSize: "14px", outline: "none", boxSizing: "border-box", color: "#0F172A", backgroundColor: "white" };