'use client';

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createFinancialRecordAction,
  updateFinancialRecordAction,
  addLargeTransactionAction,
  deleteLargeTransactionAction,
  syncContractPaymentsAction,
  listClientContractsAction,
  type LargeTransaction,
  type ClientContract,
} from "@/app/employer/sections/action/action";

interface Tab { label: string; id: string; }
interface Step { id: string; label: string; }
interface Progress { [key: string]: boolean; }

const tabs: Tab[] = [
  { label: "Staff List", id: "staff" },
  { label: "1. RTW Compliance", id: "rtw" },
  { label: "2. Pension", id: "pension" },
  { label: "3. Authorising Officer", id: "auth" },
  { label: "4. Contracts", id: "contracts" },
  { label: "5. Financial", id: "financial" },
  { label: "6. Summary", id: "summary" },
];

const STEPS: Step[] = [
  { id: "balance", label: "1. Balance" },
  { id: "cashflow", label: "2. Cash Flow" },
  { id: "investments", label: "3. Investments" },
  { id: "contracts", label: "4. Contracts" },
];

const MIN_BALANCE = 10425;
const NON_COMPLIANT_REFS = ["loan", "gift", "director investment", "director's loan", "personal"];

function getClientToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.split("; ").find((row) => row.startsWith("access-token="));
  if (!match) return "";
  return decodeURIComponent(match.split("=").slice(1).join("=")).replace(/\s+/g, "").replace(/^(Bearer|Token)\s*/i, "");
}

const getProgress = (): Progress => { try { return JSON.parse(sessionStorage.getItem("hr_progress") || "{}"); } catch { return {}; } };
const markComplete = (key: string) => { try { sessionStorage.setItem("hr_progress", JSON.stringify({ ...getProgress(), [key]: true })); } catch {} };
const isTabUnlocked = (tabId: string): boolean => {
  if (["staff", "rtw", "pension", "auth", "contracts", "financial"].includes(tabId)) return true;
  return !!getProgress().financial;
};
const getTransactionStatus = (ref: string): "ok" | "fail" =>
  NON_COMPLIANT_REFS.some((r) => ref.toLowerCase().includes(r)) ? "fail" : "ok";

const SpinnerIcon = ({ color = "#0852C9" }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ animation: "spin 1s linear infinite", flexShrink: 0 }}>
    <circle cx="10" cy="10" r="8" stroke="#CBD5E1" strokeWidth="2.5" />
    <path d="M10 2a8 8 0 018 8" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
  </svg>
);
const DollarIcon = () => (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}><path d="M10 2v16M6 5.5h5.5a2.5 2.5 0 010 5H8a2.5 2.5 0 000 5H14" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" /></svg>);
const ArrowsIcon = () => (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}><path d="M4 7l3-3 3 3M7 4v12M16 13l-3 3-3-3M13 16V4" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>);
const FileIcon = () => (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}><rect x="3" y="1" width="14" height="18" rx="2" stroke="#374151" strokeWidth="1.4" fill="none" /><path d="M6 7h8M6 10h8M6 13h5" stroke="#374151" strokeWidth="1.3" strokeLinecap="round" /></svg>);
const WarnIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}><path d="M8 2L1 14h14L8 2z" stroke="#D97706" strokeWidth="1.4" fill="none" strokeLinejoin="round" /><path d="M8 7v3M8 12v.5" stroke="#D97706" strokeWidth="1.3" strokeLinecap="round" /></svg>);
const AlertRedIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}><path d="M8 2L1 14h14L8 2z" stroke="#DC2626" strokeWidth="1.4" fill="none" strokeLinejoin="round" /><path d="M8 7v3M8 12v.5" stroke="#DC2626" strokeWidth="1.3" strokeLinecap="round" /></svg>);
const GreenCircleCheck = () => (<svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}><circle cx="9" cy="9" r="8" stroke="#16A34A" strokeWidth="1.4" fill="none" /><path d="M5.5 9l2.5 2.5L12.5 6" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>);

function ErrorBanner({ msg, onDismiss }: { msg: string; onDismiss: () => void }) {
  return (
    <div style={{ marginBottom: "14px", padding: "12px 16px", backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <p style={{ margin: 0, fontSize: "13px", color: "#DC2626" }}>⚠ {msg}</p>
      <button onClick={onDismiss} style={{ background: "none", border: "none", cursor: "pointer", color: "#DC2626", fontSize: "16px" }}>✕</button>
    </div>
  );
}

function RadioRow({ value, selected, onChange, label, desc }: { value: string; selected: string | null; onChange: (v: string) => void; label: string; desc?: string }) {
  const isSelected = selected === value;
  return (
    <div onClick={() => onChange(value)} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "14px 16px", borderRadius: "8px", marginBottom: "8px", border: `1.5px solid ${isSelected ? "#0852C9" : "#E2E8F0"}`, backgroundColor: isSelected ? "#F0F6FF" : "white", cursor: "pointer" }}>
      <div style={{ width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0, marginTop: "2px", border: `2px solid ${isSelected ? "#0852C9" : "#D1D5DB"}`, backgroundColor: isSelected ? "#0852C9" : "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {isSelected && <div style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "white" }} />}
      </div>
      <div>
        <div style={{ fontSize: "13.5px", fontWeight: "600", color: "#0F172A" }}>{label}</div>
        {desc && <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>{desc}</div>}
      </div>
    </div>
  );
}

function TopNav({ onBack, onTabClick }: { onBack: () => void; onTabClick: (id: string) => void }) {
  return (
    <div style={{ backgroundColor: "white", borderBottom: "1px solid #E2E8F0", padding: "0 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingTop: "14px", paddingBottom: "2px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center", flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 15L8 10L13 5" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0F172A" }}>HR Records Validation</h1>
          <div style={{ fontSize: "11px", color: "#94A3B8" }}>V.03</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "6px", marginTop: "10px", paddingBottom: "12px", overflowX: "auto", WebkitOverflowScrolling: "touch" as any }}>
        {tabs.map((tab) => {
          const isActive = tab.id === "financial";
          const unlocked = isTabUnlocked(tab.id);
          return (
            <button key={tab.id} onClick={() => onTabClick(tab.id)} style={{ padding: "5px 12px", borderRadius: "20px", border: isActive ? "none" : "1.5px solid #D1D5DB", cursor: unlocked && !isActive ? "pointer" : "default", fontSize: "12px", fontWeight: isActive ? "600" : "400", color: isActive ? "white" : "#374151", backgroundColor: isActive ? "#0852C9" : "white", whiteSpace: "nowrap", flexShrink: 0 }}>
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepPills({ active, onStepClick, unlockedUpTo }: { active: string; onStepClick: (id: string) => void; unlockedUpTo: number }) {
  return (
    <div style={{ display: "flex", gap: "6px", marginBottom: "20px", overflowX: "auto", WebkitOverflowScrolling: "touch" as any }}>
      {STEPS.map((s, i) => {
        const isActive = s.id === active;
        const clickable = i <= unlockedUpTo;
        return (
          <button key={s.id} onClick={() => clickable && onStepClick(s.id)} style={{ padding: "5px 14px", borderRadius: "20px", border: isActive ? "none" : "1.5px solid #D1D5DB", cursor: clickable && !isActive ? "pointer" : "default", fontSize: "12px", fontWeight: isActive ? "600" : "400", color: isActive ? "white" : "#374151", backgroundColor: isActive ? "#0852C9" : "white", whiteSpace: "nowrap", flexShrink: 0 }}>
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

function BalanceStep({ hrRecordId, onNext }: { hrRecordId: number | null; onNext: (id: number) => void }) {
  const [balance, setBalance] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const num = parseFloat(balance);
  const isCompliant = !isNaN(num) && num >= MIN_BALANCE;
  const isInsufficient = !isNaN(num) && num < MIN_BALANCE && balance !== "";

  const handleNext = async () => {
    if (!balance || !hrRecordId) return;
    setSubmitting(true); setError("");
    const res = await createFinancialRecordAction({ HRValidationRecord_id: hrRecordId, closing_balance_gbp: num.toFixed(2) }, getClientToken());
    if (!res.success) { setError(res.message); setSubmitting(false); return; }
    onNext(res.data!.id);
    setSubmitting(false);
  };

  return (
    <div style={card}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}><DollarIcon /><h3 style={cardTitle}>Step 1: Closing Balance Check</h3></div>
      <p style={cardSub}>Minimum: £{MIN_BALANCE.toLocaleString()} (3 months Skilled Worker salary)</p>
      {error && <ErrorBanner msg={error} onDismiss={() => setError("")} />}
      <div style={{ marginBottom: "16px" }}>
        <label style={lbl}>Current Closing Balance (£)</label>
        <input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="Enter amount" style={{ ...inputStyle, borderColor: isInsufficient ? "#FCA5A5" : "#0852C9" }} />
      </div>
      {isCompliant && (<div style={{ ...alertBox, backgroundColor: "#F0FDF4", border: "1.5px solid #86EFAC", marginBottom: "16px" }}><GreenCircleCheck /><div><div style={{ fontSize: "14px", fontWeight: "600", color: "#166534" }}>Balance Compliant ✓</div><div style={{ fontSize: "13px", color: "#166534" }}>£{num.toLocaleString()} exceeds minimum of £{MIN_BALANCE.toLocaleString()}</div></div></div>)}
      {isInsufficient && (<div style={{ ...alertBox, backgroundColor: "#FFF5F5", border: "1.5px solid #FCA5A5", marginBottom: "16px" }}><AlertRedIcon /><div><div style={{ fontSize: "14px", fontWeight: "600", color: "#DC2626" }}>Insufficient Balance</div><div style={{ fontSize: "13px", color: "#DC2626" }}>£{num.toLocaleString()} is below required £{MIN_BALANCE.toLocaleString()}</div></div></div>)}
      <button onClick={handleNext} disabled={!balance || submitting || !hrRecordId} style={{ ...primaryBtn, width: "100%", opacity: (balance && !submitting) ? 1 : 0.5, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
        {submitting ? <><SpinnerIcon color="#fff" /> Saving…</> : "Continue to Cash Flow Check →"}
      </button>
    </div>
  );
}

function CashFlowStep({ financialRecordId, onNext, onPrev }: { financialRecordId: number | null; onNext: () => void; onPrev: () => void }) {
  const [incoming, setIncoming] = useState("");
  const [outgoing, setOutgoing] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const inNum = parseFloat(incoming) || 0;
  const outNum = parseFloat(outgoing) || 0;
  const net = inNum - outNum;
  const canContinue = !!(incoming && outgoing);

  const handleNext = async () => {
    if (!canContinue || !financialRecordId) return;
    setSubmitting(true); setError("");
    const res = await updateFinancialRecordAction(financialRecordId, { total_incoming_gbp_credits: inNum.toFixed(2), total_outgoing_gbp_debits: outNum.toFixed(2) }, getClientToken());
    if (!res.success) { setError(res.message); setSubmitting(false); return; }
    onNext(); setSubmitting(false);
  };

  return (
    <div style={card}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}><ArrowsIcon /><h3 style={cardTitle}>Step 2: Cash Flow Pattern (Last 3 Months)</h3></div>
      <p style={cardSub}>Incoming must exceed outgoing for positive cash flow</p>
      {error && <ErrorBanner msg={error} onDismiss={() => setError("")} />}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "16px" }}>
        <div><label style={lbl}>↑ Total Incoming (£)</label><input type="number" value={incoming} onChange={(e) => setIncoming(e.target.value)} placeholder="Total credits" style={inputStyle} /></div>
        <div><label style={lbl}>↓ Total Outgoing (£)</label><input type="number" value={outgoing} onChange={(e) => setOutgoing(e.target.value)} placeholder="Total debits" style={inputStyle} /></div>
      </div>
      {inNum > 0 && outNum > 0 && (
        <div style={{ ...alertBox, backgroundColor: net > 0 ? "#F0FDF4" : "#FFF5F5", border: `1.5px solid ${net > 0 ? "#86EFAC" : "#FCA5A5"}`, marginBottom: "16px" }}>
          {net > 0 ? <GreenCircleCheck /> : <AlertRedIcon />}
          <div><div style={{ fontSize: "14px", fontWeight: "600", color: net > 0 ? "#166534" : "#DC2626" }}>{net > 0 ? "Positive Cash Flow" : "Negative Cash Flow"}</div><div style={{ fontSize: "13px", color: net > 0 ? "#166534" : "#DC2626" }}>Net: {net > 0 ? "+" : ""}£{net.toLocaleString()}</div></div>
        </div>
      )}
      <button onClick={handleNext} disabled={!canContinue || submitting} style={{ ...primaryBtn, width: "100%", opacity: (canContinue && !submitting) ? 1 : 0.5, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
        {submitting ? <><SpinnerIcon color="#fff" /> Saving…</> : "Continue to Investment Check →"}
      </button>
    </div>
  );
}

function InvestmentsStep({ hrRecordId, financialRecordId, onNext, onPrev }: { hrRecordId: number | null; financialRecordId: number | null; onNext: () => void; onPrev: () => void }) {
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [type, setType] = useState<"credit" | "debit">("credit");
  const [date, setDate] = useState("");
  const [transactions, setTransactions] = useState<(LargeTransaction & { status: "ok" | "fail" })[]>([]);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num < 2000 || !reference.trim() || !date || !hrRecordId || !financialRecordId) return;
    setAdding(true); setError("");
    const res = await addLargeTransactionAction({ HRValidationRecord_id: hrRecordId, FinancialRecord_id: financialRecordId, transaction_amount_gbp: num.toFixed(2), transaction_description: reference.trim(), transaction_type: type, transaction_date: date }, getClientToken());
    if (!res.success) { setError(res.message); setAdding(false); return; }
    setTransactions((prev) => [...prev, { ...res.data!, status: getTransactionStatus(reference) }]);
    setAmount(""); setReference(""); setDate(""); setType("credit"); setAdding(false);
  };

  const handleDelete = async (id: number) => {
    setDeleting(id);
    const res = await deleteLargeTransactionAction(id, getClientToken());
    if (res.success) setTransactions((prev) => prev.filter((t) => t.id !== id));
    else setError(res.message);
    setDeleting(null);
  };

  return (
    <div style={card}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}><DollarIcon /><h3 style={cardTitle}>Step 3: Large Transaction / Investment Check</h3></div>
      <p style={cardSub}>Transactions ≥ £2,000 require reference verification</p>
      {error && <ErrorBanner msg={error} onDismiss={() => setError("")} />}
      <div style={{ backgroundColor: "#FFFBEB", borderRadius: "8px", border: "1px solid #FDE68A", padding: "12px 16px", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}><WarnIcon /><span style={{ fontSize: "13px", fontWeight: "600", color: "#92400E" }}>Reference Check Rules</span></div>
        <div style={{ fontSize: "12.5px", color: "#78350F" }}>🚩 Non-compliant: Loan, Gift, Director Investment, Director's Loan, Personal</div>
        <div style={{ fontSize: "12.5px", color: "#78350F", marginTop: "3px" }}>✅ Compliant: Business Name, Invoice Number, Client Payment</div>
      </div>
      <div style={{ backgroundColor: "#F8FAFC", borderRadius: "8px", border: "1px solid #E2E8F0", padding: "16px", marginBottom: "16px" }}>
        <p style={{ margin: "0 0 12px", fontSize: "13.5px", fontWeight: "600", color: "#0F172A" }}>Add Large Transaction</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px", marginBottom: "10px" }}>
          <div><label style={lbl}>Amount (£) *</label><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="≥ 2000" style={inputStyle} /></div>
          <div><label style={lbl}>Reference *</label><input type="text" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="e.g. Invoice #123" style={inputStyle} /></div>
          <div><label style={lbl}>Date *</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} /></div>
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "13px", fontWeight: "500", color: "#374151" }}>Type:</span>
          {(["credit", "debit"] as const).map((t) => (
            <label key={t} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", cursor: "pointer" }}>
              <input type="radio" checked={type === t} onChange={() => setType(t)} style={{ accentColor: "#0852C9" }} />{t.charAt(0).toUpperCase() + t.slice(1)}
            </label>
          ))}
        </div>
        <button onClick={handleAdd} disabled={adding || !amount || !reference || !date} style={{ padding: "8px 14px", backgroundColor: "white", border: "1.5px solid #D1D5DB", borderRadius: "6px", fontSize: "13px", cursor: "pointer", color: "#374151", display: "flex", alignItems: "center", gap: "6px" }}>
          {adding ? <><SpinnerIcon color="#374151" /> Adding…</> : "+ Add Transaction"}
        </button>
      </div>
      {transactions.length > 0 && (
        <div style={{ overflowX: "auto", marginBottom: "16px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "420px" }}>
            <thead><tr style={{ borderBottom: "1px solid #E2E8F0" }}>{["Amount", "Type", "Reference", "Status", ""].map((h) => (<th key={h} style={{ padding: "8px 6px", fontSize: "12px", color: "#94A3B8", fontWeight: "500", textAlign: "left" }}>{h}</th>))}</tr></thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "10px 6px", fontSize: "13.5px", fontWeight: "600", color: "#0F172A" }}>£{parseFloat(t.transaction_amount_gbp).toLocaleString()}</td>
                  <td style={{ padding: "10px 6px", fontSize: "13px", color: "#374151", textTransform: "capitalize" }}>{t.transaction_type}</td>
                  <td style={{ padding: "10px 6px", fontSize: "13px", color: "#374151" }}>{t.transaction_description}</td>
                  <td style={{ padding: "10px 6px" }}><span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", backgroundColor: t.status === "ok" ? "#0852C9" : "#DC2626", color: "white" }}>{t.status === "ok" ? "✓ OK" : "✗ Flag"}</span></td>
                  <td style={{ padding: "10px 6px" }}><button onClick={() => handleDelete(t.id)} disabled={deleting === t.id} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "16px" }}>{deleting === t.id ? <SpinnerIcon color="#94A3B8" /> : "✕"}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button onClick={onNext} style={{ ...primaryBtn, width: "100%" }}>Continue to Contract Payment Sync →</button>
    </div>
  );
}

function ContractsSyncStep({ financialRecordId, hrRecordId, onComplete, onPrev }: { financialRecordId: number | null; hrRecordId: number | null; onComplete: () => void; onPrev: () => void }) {
  const [paymentsReflected, setPaymentsReflected] = useState<string | null>(null);
  const [futureEngagement, setFutureEngagement] = useState<string | null>(null);
  const [contracts, setContracts] = useState<ClientContract[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hrRecordId) return;
    listClientContractsAction(hrRecordId, getClientToken()).then((res) => { if (res.success && res.data) setContracts(res.data); });
  }, [hrRecordId]);

  const getStatus = () => {
    if (paymentsReflected === "yes") return { ok: true, label: "Compliant", desc: "Contract payments are visible in bank statements." };
    if (paymentsReflected === "no" && futureEngagement === "yes") return { ok: true, label: "Compliant", desc: "Future engagement — payments expected later." };
    if (paymentsReflected === "no" && futureEngagement === "no") return { ok: false, label: "Non-Compliant", desc: "Expired contract dates with no payments reflected." };
    return null;
  };

  const status = getStatus();
  const canComplete = paymentsReflected === "yes" || (paymentsReflected === "no" && futureEngagement !== null);

  const handleComplete = async () => {
    if (!canComplete || !financialRecordId) return;
    setSubmitting(true); setError("");
    const res = await syncContractPaymentsAction(financialRecordId, paymentsReflected === "yes", paymentsReflected === "no" && futureEngagement === "yes", getClientToken());
    if (!res.success) { setError(res.message); setSubmitting(false); return; }
    onComplete(); setSubmitting(false);
  };

  return (
    <div style={card}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}><FileIcon /><h3 style={cardTitle}>Step 4: Synchronize with Client Agreements</h3></div>
      <p style={cardSub}>Verify contract payments are reflected in bank statements</p>
      {error && <ErrorBanner msg={error} onDismiss={() => setError("")} />}
      {contracts.length > 0 && (
        <div style={{ backgroundColor: "#F8FAFC", borderRadius: "8px", border: "1px solid #E2E8F0", padding: "12px 16px", marginBottom: "16px" }}>
          <p style={{ margin: "0 0 8px", fontSize: "13px", fontWeight: "600", color: "#374151" }}>Contracts on file ({contracts.length}):</p>
          {contracts.map((c) => (<div key={c.id} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}><FileIcon /><span style={{ fontSize: "13px", color: "#374151" }}>{c.client_name}</span><span style={{ fontSize: "11px", color: "#94A3B8", backgroundColor: "#F1F5F9", padding: "1px 8px", borderRadius: "10px" }}>{c.validation_status}</span></div>))}
        </div>
      )}
      <p style={{ margin: "0 0 10px", fontSize: "13.5px", fontWeight: "600", color: "#0F172A" }}>Are contract payments reflected in bank statements?</p>
      <RadioRow value="yes" selected={paymentsReflected} onChange={setPaymentsReflected} label="Yes — Payments reflected" desc="Full payment or initial deposit + monthly payments visible" />
      <RadioRow value="no" selected={paymentsReflected} onChange={(v) => { setPaymentsReflected(v); setFutureEngagement(null); }} label="No — Payments not visible" />
      {paymentsReflected === "no" && (
        <div style={{ marginTop: "14px" }}>
          <p style={{ margin: "0 0 10px", fontSize: "13.5px", fontWeight: "600", color: "#0F172A" }}>Is this for future engagement?</p>
          <RadioRow value="yes" selected={futureEngagement} onChange={setFutureEngagement} label="Yes — Future engagement dates" />
          <RadioRow value="no" selected={futureEngagement} onChange={setFutureEngagement} label="No — Dates have expired" />
        </div>
      )}
      {status && (
        <div style={{ ...alertBox, backgroundColor: status.ok ? "#F0FDF4" : "#FFF5F5", border: `1.5px solid ${status.ok ? "#86EFAC" : "#FCA5A5"}`, marginTop: "14px" }}>
          {status.ok ? <GreenCircleCheck /> : <AlertRedIcon />}
          <div><div style={{ fontSize: "14px", fontWeight: "600", color: status.ok ? "#166534" : "#DC2626" }}>{status.label}</div>{status.desc && <div style={{ fontSize: "13px", color: status.ok ? "#166534" : "#DC2626", marginTop: "2px" }}>{status.desc}</div>}</div>
        </div>
      )}
      <button onClick={handleComplete} disabled={!canComplete || submitting} style={{ ...primaryBtn, width: "100%", marginTop: "16px", opacity: (canComplete && !submitting) ? 1 : 0.5, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
        {submitting ? <><SpinnerIcon color="#fff" /> Saving…</> : "Complete Financial Viability Check ✓"}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// INNER PAGE — uses useSearchParams, must live inside <Suspense>
// ═══════════════════════════════════════════════════════════════════════════════
function FinancialPageInner(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState("balance");
  const [unlockedUpTo, setUnlockedUpTo] = useState(0);
  const [financialRecordId, setFinancialRecordId] = useState<number | null>(null);
  const [hrRecordId, setHrRecordId] = useState<number | null>(null);

  useEffect(() => {
    const fromUrl = searchParams.get("record_id");
    let recordId: number | null = null;
    if (fromUrl && !isNaN(parseInt(fromUrl, 10))) {
      recordId = parseInt(fromUrl, 10);
      try { sessionStorage.setItem("hr_record_id", fromUrl); } catch {}
    } else {
      try { const v = sessionStorage.getItem("hr_record_id"); if (v) recordId = parseInt(v, 10); } catch {}
    }
    setHrRecordId(recordId);
  }, [searchParams]);

  const stepIds = ["balance", "cashflow", "investments", "contracts"];
  const rid = (id: number | null) => id ? `?record_id=${id}` : "";

  const handleTabClick = (tabId: string) => {
    if (tabId === "financial") return;
    const routes: Record<string, string> = {
      staff: `/employer/sections/hr-validation${rid(hrRecordId)}`,
      rtw: `/employer/sections/rtw-compliance${rid(hrRecordId)}`,
      pension: `/employer/sections/pension${rid(hrRecordId)}`,
      auth: `/employer/sections/authorising-officer${rid(hrRecordId)}`,
      contracts: `/employer/sections/contracts${rid(hrRecordId)}`,
      summary: `/employer/sections/summary${rid(hrRecordId)}`,
    };
    if (!isTabUnlocked(tabId)) return;
    if (routes[tabId]) router.push(routes[tabId]);
  };

  const goNext = (current: string) => {
    const idx = stepIds.indexOf(current);
    if (idx < stepIds.length - 1) { setStep(stepIds[idx + 1]); setUnlockedUpTo(Math.max(unlockedUpTo, idx + 1)); }
  };

  const handleComplete = () => {
    markComplete("financial");
    router.push(`/employer/sections/summary${rid(hrRecordId)}`);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", backgroundColor: "#F1F5F9", minHeight: "100vh" }}>
      <TopNav onBack={() => router.back()} onTabClick={handleTabClick} />
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "20px 16px" }}>
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "clamp(16px, 4vw, 22px)", fontWeight: "700", color: "#0F172A" }}>Workflow 5: Bank Balance &amp; Financial Viability</h2>
          <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#64748B" }}>Verify financial health and compliance for sponsor licence</p>
        </div>
        <StepPills active={step} onStepClick={setStep} unlockedUpTo={unlockedUpTo} />
        {step === "balance" && <BalanceStep hrRecordId={hrRecordId} onNext={(id) => { setFinancialRecordId(id); goNext("balance"); }} />}
        {step === "cashflow" && <CashFlowStep financialRecordId={financialRecordId} onNext={() => goNext("cashflow")} onPrev={() => setStep("balance")} />}
        {step === "investments" && <InvestmentsStep hrRecordId={hrRecordId} financialRecordId={financialRecordId} onNext={() => goNext("investments")} onPrev={() => setStep("cashflow")} />}
        {step === "contracts" && <ContractsSyncStep financialRecordId={financialRecordId} hrRecordId={hrRecordId} onComplete={handleComplete} onPrev={() => setStep("investments")} />}
        <div style={{ marginTop: "16px" }}>
          {step === "balance"
            ? <button onClick={() => router.push(`/employer/sections/hr-validation/contracts${rid(hrRecordId)}`)} style={backBtn}>← Back to Contract Validation</button>
            : <button onClick={() => { const idx = stepIds.indexOf(step); setStep(stepIds[idx - 1]); }} style={backBtn}>← Previous Step</button>}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE EXPORT — wraps inner component in Suspense boundary (required by Next.js
// when useSearchParams is used inside a statically rendered page)
// ═══════════════════════════════════════════════════════════════════════════════
export default function FinancialPage(): React.JSX.Element {
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
      <FinancialPageInner />
    </Suspense>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "6px" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #0852C9", fontSize: "14px", outline: "none", boxSizing: "border-box", color: "#0F172A", backgroundColor: "white" };
const primaryBtn: React.CSSProperties = { padding: "13px 20px", borderRadius: "8px", border: "none", backgroundColor: "#0852C9", color: "white", fontSize: "14px", fontWeight: "600", cursor: "pointer" };
const backBtn: React.CSSProperties = { padding: "10px 18px", backgroundColor: "white", color: "#374151", border: "1.5px solid #D1D5DB", borderRadius: "8px", fontSize: "14px", fontWeight: "500", cursor: "pointer" };
const card: React.CSSProperties = { backgroundColor: "white", borderRadius: "10px", border: "1px solid #E2E8F0", padding: "clamp(16px, 4vw, 28px)" };
const cardTitle: React.CSSProperties = { margin: 0, fontSize: "clamp(14px, 3vw, 17px)", fontWeight: "700", color: "#0F172A" };
const cardSub: React.CSSProperties = { margin: "0 0 18px", fontSize: "13px", color: "#64748B" };
const alertBox: React.CSSProperties = { display: "flex", alignItems: "flex-start", gap: "10px", padding: "14px 16px", borderRadius: "8px" };