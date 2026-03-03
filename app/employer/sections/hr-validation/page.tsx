'use client';

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

const tabs = [
  { label: "Staff List", id: "staff" },
  { label: "1. RTW Compliance", id: "rtw" },
  { label: "2. Pension", id: "pension" },
  { label: "3. Authorising Officer", id: "auth" },
  { label: "4. Contracts", id: "contracts" },
  { label: "5. Financial", id: "financial" },
  { label: "6. Summary", id: "summary" },
];

const TAB_ROUTES = {
  rtw: "/employer/sections/rtw-compliance",
  pension: "/employer/sections/hr-validation/pension",
  auth: "/employer/sections/hr-validation/authorising-officer",
  contracts: "/employer/sections/hr-validation/contracts",
  financial: "/employer/sections/hr-validation/financial",
  summary: "/employer/sections/hr-validation/summary",
};

const UserAvatar = ({ size = 48, color = "#9CA3AF" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="18" r="9" stroke={color} strokeWidth="2.5" fill="none" />
    <path d="M6 42c0-9.941 8.059-18 18-18s18 8.059 18 18" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginRight: "5px", flexShrink: 0 }}>
    <circle cx="7" cy="7" r="6" stroke="#9CA3AF" strokeWidth="1.4" />
    <path d="M7 4v3.2l2 1.3" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const UploadIcon = ({ color = "#64748B" }) => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
    <path d="M19 27V13M19 13l-7 7M19 13l7 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 29h24" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const SpinnerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ animation: "spin 1s linear infinite" }}>
    <circle cx="10" cy="10" r="8" stroke="#CBD5E1" strokeWidth="2.5" />
    <path d="M10 2a8 8 0 018 8" stroke="#0852C9" strokeWidth="2.5" strokeLinecap="round" />
    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" fill="#10B981" />
    <path d="M5 8l2.5 2.5L11 5.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FileIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="4" y="2" width="16" height="22" rx="2" fill="#EFF6FF" stroke="#0852C9" strokeWidth="1.5" />
    <path d="M4 8h16M8 13h8M8 17h5" stroke="#0852C9" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);



async function extractRTWDataWithAI(file) {
  const toBase64 = (f) =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result.split(",")[1]);
      r.onerror = () => rej(new Error("Read failed"));
      r.readAsDataURL(f);
    });

  const isImage = file.type.startsWith("image/");
  const isPDF = file.type === "application/pdf";

  let messageContent;
  if (isImage) {
    const base64 = await toBase64(file);
    messageContent = [
      { type: "image", source: { type: "base64", media_type: file.type, data: base64 } },
      { type: "text", text: `Extract RTW document details and return ONLY valid JSON:\n{"fullName":"","nationality":"","documentType":"","documentNumber":"","expiryDate":"YYYY-MM-DD","dob":"YYYY-MM-DD"}` },
    ];
  } else if (isPDF) {
    const base64 = await toBase64(file);
    messageContent = [
      { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } },
      { type: "text", text: `Extract RTW document details and return ONLY valid JSON:\n{"fullName":"","nationality":"","documentType":"","documentNumber":"","expiryDate":"YYYY-MM-DD","dob":"YYYY-MM-DD"}` },
    ];
  } else {
    throw new Error("Unsupported file type.");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: messageContent }] }),
  });

  if (!response.ok) throw new Error("AI extraction failed");
  const data = await response.json();
  const text = data.content?.map((b) => b.text || "").join("") || "";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}



function RTWUploadArea({ onExtracted, onFileChange }) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef();

  const processFile = useCallback(async (f) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowed.includes(f.type)) { setErrorMsg("Only PDF, JPG or PNG supported."); setStatus("error"); return; }
    if (f.size > 10 * 1024 * 1024) { setErrorMsg("File must be under 10MB."); setStatus("error"); return; }
    setFile(f); onFileChange(f); setStatus("extracting"); setErrorMsg("");
    try {
      const extracted = await extractRTWDataWithAI(f);
      onExtracted(extracted); setStatus("done");
    } catch (e) {
      setErrorMsg(e.message || "Extraction failed. Fill in details manually."); setStatus("error");
    }
  }, [onExtracted, onFileChange]);

  const removeFile = () => {
    setFile(null); setStatus("idle"); setErrorMsg("");
    onFileChange(null); onExtracted({});
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
      {!file ? (
        <div onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) processFile(f); }}
          style={{ border: `2px dashed ${dragOver ? "#0852C9" : "#CBD5E1"}`, borderRadius: "10px", padding: "28px 20px", textAlign: "center", backgroundColor: dragOver ? "#EFF6FF" : "#F8FAFC", cursor: "pointer", transition: "all 0.2s" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}><UploadIcon color={dragOver ? "#0852C9" : "#64748B"} /></div>
          <p style={{ margin: "0 0 3px", fontSize: "13.5px", fontWeight: "500", color: dragOver ? "#0852C9" : "#334155" }}>Drag and drop or click to upload</p>
          <p style={{ margin: 0, fontSize: "12px", color: "#94A3B8" }}>PDF or Image files · Max 10MB</p>
        </div>
      ) : (
        <div style={{ border: "1.5px solid #E2E8F0", borderRadius: "10px", padding: "14px 16px", backgroundColor: "#F8FAFC", display: "flex", alignItems: "center", gap: "12px" }}>
          <FileIcon />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "13.5px", fontWeight: "600", color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</div>
            <div style={{ fontSize: "11.5px", color: "#94A3B8", marginTop: "2px" }}>{(file.size / 1024).toFixed(1)} KB</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            {status === "extracting" && <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#0852C9" }}><SpinnerIcon /> Extracting…</div>}
            {status === "done" && <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#10B981" }}><CheckIcon /> Extracted</div>}
            {status === "error" && <div style={{ fontSize: "12px", color: "#EF4444" }}>Failed</div>}
            <button onClick={removeFile} style={{ background: "none", border: "1px solid #E2E8F0", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8", fontSize: "12px" }}>✕</button>
          </div>
        </div>
      )}
      {status === "error" && (
        <div style={{ marginTop: "8px", padding: "8px 12px", backgroundColor: "#FEF2F2", borderRadius: "7px", border: "1px solid #FECACA" }}>
          <p style={{ margin: 0, fontSize: "12.5px", color: "#DC2626" }}>{errorMsg}</p>
        </div>
      )}
    </div>
  );
}



export default function HRRecordsValidation() {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState("choose");
  const [manualForm, setManualForm] = useState({ name: "", nationality: "British/Irish", startDate: "" });
  const [rtwForm, setRtwForm] = useState({ name: "", nationality: "", startDate: "", documentType: "", documentNumber: "", expiryDate: "", dob: "", file: null });

  const migrantCount = employees.filter((e) => e.nationality === "Migrant").length;
  const britishIrishCount = employees.filter((e) => e.nationality === "British/Irish").length;

 
  const saveAndSet = (list) => {
    setEmployees(list);
    try { sessionStorage.setItem("hr_employees", JSON.stringify(list)); } catch {}
  };

  const openModal = (step = "choose") => {
    setModalStep(step);
    setManualForm({ name: "", nationality: "British/Irish", startDate: "" });
    setRtwForm({ name: "", nationality: "", startDate: "", documentType: "", documentNumber: "", expiryDate: "", dob: "", file: null });
    setShowModal(true);
  };

  const manualFormValid = manualForm.name.trim() && manualForm.startDate;
  const rtwFormValid = rtwForm.name.trim() && rtwForm.startDate;

  const handleManualAdd = () => {
    if (!manualFormValid) return;
    saveAndSet([...employees, { id: Date.now(), name: manualForm.name, nationality: manualForm.nationality, startDate: manualForm.startDate, status: "Pending" }]);
    setShowModal(false);
  };

  const handleRtwAdd = () => {
    if (!rtwFormValid) return;
    saveAndSet([...employees, { id: Date.now(), name: rtwForm.name, nationality: rtwForm.nationality || "Migrant", startDate: rtwForm.startDate, status: "Pending", documentType: rtwForm.documentType, documentNumber: rtwForm.documentNumber }]);
    setShowModal(false);
  };

  const handleProceed = () => {
    try { sessionStorage.setItem("hr_employees", JSON.stringify(employees)); } catch {}
    router.push("/employer/sections/rtw-compliance");
  };

  
  const staffComplete = employees.length > 0;

  const getTabProgress = () => {
    try {
      const p = sessionStorage.getItem("hr_progress");
      return p ? JSON.parse(p) : {};
    } catch { return {}; }
  };

  const isTabUnlocked = (tabId) => {
    if (tabId === "staff") return true;
    if (tabId === "rtw") return staffComplete;
    const progress = getTabProgress();
    if (tabId === "pension") return progress.rtw;
    if (tabId === "auth") return progress.pension;
    if (tabId === "contracts") return progress.auth;
    if (tabId === "financial") return progress.contracts;
    if (tabId === "summary") return progress.financial;
    return false;
  };

  const handleTabClick = (tabId) => {
    if (tabId === "staff") return; 
    if (!isTabUnlocked(tabId)) return; 
    try { sessionStorage.setItem("hr_employees", JSON.stringify(employees)); } catch {}
    if (TAB_ROUTES[tabId]) router.push(TAB_ROUTES[tabId]);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", backgroundColor: "#F1F5F9", minHeight: "100vh" }}>

      
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E2E8F0", padding: "0 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingTop: "16px", paddingBottom: "2px" }}>
          <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center" }}>
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
            const isActive = tab.id === "staff";
            const unlocked = isTabUnlocked(tab.id);
            return (
              <button key={tab.id} onClick={() => handleTabClick(tab.id)} style={{
                padding: "6px 16px", borderRadius: "20px",
                border: isActive ? "none" : "1.5px solid #D1D5DB",
                cursor: unlocked && !isActive ? "pointer" : "default",
                fontSize: "13px",
                fontWeight: isActive ? "600" : "400",
                color: isActive ? "white" : "#374151",
                backgroundColor: isActive ? "#0852C9" : "white",
                whiteSpace: "nowrap", transition: "all 0.15s",
                boxShadow: isActive ? "none" : "0 1px 2px rgba(0,0,0,0.04)",
              }}>{tab.label}</button>
            );
          })}
        </div>
      </div>

      
      <div style={{ maxWidth: "860px", margin: "30px auto", padding: "0 24px" }}>

        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "#0F172A" }}>Staff List</h2>
            <p style={{ margin: "5px 0 0", fontSize: "13px", color: "#64748B" }}>Add all employees before proceeding to validation workflows</p>
          </div>
          <button onClick={() => openModal("choose")} style={{ display: "flex", alignItems: "center", gap: "7px", backgroundColor: "#0852C9", color: "white", border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
            Add Employee
          </button>
        </div>

        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px", marginBottom: "18px" }}>
          {[{ label: "Total Employees", value: employees.length }, { label: "Migrant Workers", value: migrantCount }, { label: "British/Irish", value: britishIrishCount }].map((s) => (
            <div key={s.label} style={{ backgroundColor: "white", borderRadius: "10px", padding: "22px 26px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: "32px", fontWeight: "700", color: "#0F172A", marginBottom: "4px" }}>{s.value}</div>
              <div style={{ fontSize: "13px", color: "#64748B" }}>{s.label}</div>
            </div>
          ))}
        </div>

        
        <div style={{ backgroundColor: "white", borderRadius: "10px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
          <div style={{ padding: "22px 24px 16px" }}>
            <h3 style={{ margin: 0, fontSize: "15.5px", fontWeight: "600", color: "#0F172A" }}>Employee Records</h3>
          </div>
          {employees.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 24px 60px", gap: "8px" }}>
              <UserAvatar size={52} color="#94A3B8" />
              <p style={{ margin: "6px 0 2px", fontSize: "15px", fontWeight: "600", color: "#334155" }}>No employees added yet</p>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748B" }}>Click the "Add Employee" button to start building your staff list</p>
              <button onClick={() => openModal("choose")} style={{ display: "flex", alignItems: "center", gap: "7px", marginTop: "10px", backgroundColor: "white", color: "#334155", border: "1.5px solid #CBD5E1", borderRadius: "8px", padding: "9px 18px", fontSize: "13.5px", fontWeight: "500", cursor: "pointer" }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v11M1 6.5h11" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" /></svg>
                Add First Employee
              </button>
            </div>
          ) : (
            <div style={{ padding: "0 16px 16px" }}>
              {employees.map((emp, i) => (
                <div key={emp.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", backgroundColor: "#F8FAFC", borderRadius: "8px", marginBottom: "8px", border: "1px solid #E2E8F0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <UserAvatar size={24} color="#0852C9" />
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#0F172A" }}>{emp.name}</div>
                      <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>#{i + 1} • {emp.nationality}{emp.documentType ? ` • ${emp.documentType}` : ""}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", color: "#64748B", fontSize: "13px" }}>
                    <ClockIcon />Pending
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

       
        {employees.length > 0 && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
            <button onClick={handleProceed} style={{ backgroundColor: "#0852C9", color: "white", border: "none", borderRadius: "8px", padding: "12px 26px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
              Proceed to Validation Workflows
            </button>
          </div>
        )}
      </div>

      
      {showModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }} onClick={() => setShowModal(false)}>
          <div style={{ backgroundColor: "white", borderRadius: "14px", padding: "26px 28px 24px", width: "520px", maxWidth: "95vw", boxShadow: "0 25px 60px rgba(0,0,0,0.22)", position: "relative", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>

            <h3 style={{ margin: "0 32px 4px 0", fontSize: "18px", fontWeight: "700", color: "#0F172A" }}>Add New Employee</h3>
            <p style={{ margin: "0 0 20px", fontSize: "13px", color: "#64748B" }}>Choose how you want to add the employee record</p>
            <button onClick={() => setShowModal(false)} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "1.5px solid #CBD5E1", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B", fontSize: "13px" }}>✕</button>

            {modalStep === "choose" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                {[
                  { step: "rtw", title: "RTW-Led Entry", desc: "For Migrant Workers - Upload RTW document for AI extraction", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="2" width="14" height="16" rx="2" stroke="#0852C9" strokeWidth="1.5" /><path d="M6 7h8M6 10h8M6 13h5" stroke="#0852C9" strokeWidth="1.5" strokeLinecap="round" /></svg> },
                  { step: "manual", title: "Manual Entry", desc: "Enter employee details manually", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3.5" stroke="#0852C9" strokeWidth="1.5" /><path d="M3 17c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="#0852C9" strokeWidth="1.5" strokeLinecap="round" /></svg> },
                ].map((opt) => (
                  <button key={opt.step} onClick={() => setModalStep(opt.step)} style={{ border: "1.5px solid #E2E8F0", borderRadius: "10px", padding: "20px 16px", backgroundColor: "white", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}
                    onMouseOver={(e) => { e.currentTarget.style.borderColor = "#0852C9"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(8,82,201,0.08)"; }}
                    onMouseOut={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none"; }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "8px", backgroundColor: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>{opt.icon}</div>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#0F172A", marginBottom: "5px" }}>{opt.title}</div>
                    <div style={{ fontSize: "12px", color: "#64748B", lineHeight: "1.5" }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            )}

            {modalStep === "rtw" && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span style={{ fontSize: "14.5px", fontWeight: "600", color: "#0F172A" }}>RTW-Led Entry</span>
                  <button onClick={() => setModalStep("choose")} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", fontSize: "13px", fontWeight: "500" }}>Change</button>
                </div>
                <div style={{ marginBottom: "14px" }}>
                  <label style={lbl}>Upload RTW Document *</label>
                  <RTWUploadArea
                    onExtracted={(data) => setRtwForm((prev) => ({ ...prev, name: data.fullName || prev.name, nationality: data.nationality || prev.nationality, expiryDate: data.expiryDate || prev.expiryDate, documentType: data.documentType || prev.documentType, documentNumber: data.documentNumber || prev.documentNumber, dob: data.dob || prev.dob }))}
                    onFileChange={(f) => setRtwForm((prev) => ({ ...prev, file: f }))}
                  />
                </div>
                <div style={{ marginBottom: "14px" }}>
                  <label style={lbl}>Employee Full Name *</label>
                  <input type="text" value={rtwForm.name} onChange={(e) => setRtwForm({ ...rtwForm, name: e.target.value })} placeholder="Enter full name" style={inputStyle} />
                </div>
                <div style={{ marginBottom: "22px" }}>
                  <label style={lbl}>Employment Start Date *</label>
                  <input type="date" value={rtwForm.startDate} onChange={(e) => setRtwForm({ ...rtwForm, startDate: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <button onClick={() => setShowModal(false)} style={cancelBtn}>Cancel</button>
                  <button onClick={handleRtwAdd} disabled={!rtwFormValid} style={{ ...primaryBtn, opacity: rtwFormValid ? 1 : 0.5, cursor: rtwFormValid ? "pointer" : "not-allowed" }}>Add Employee</button>
                </div>
              </>
            )}

            {modalStep === "manual" && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                  <span style={{ fontSize: "14.5px", fontWeight: "600", color: "#0F172A" }}>Manual Entry</span>
                  <button onClick={() => setModalStep("choose")} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", fontSize: "13px", fontWeight: "500" }}>Change</button>
                </div>
                <div style={{ marginBottom: "14px" }}>
                  <label style={lbl}>Employee Full Name *</label>
                  <input type="text" value={manualForm.name} onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })} placeholder="Enter full name" style={inputStyle} />
                </div>
                <div style={{ marginBottom: "14px" }}>
                  <label style={lbl}>Nationality *</label>
                  <div style={{ position: "relative" }}>
                    <select value={manualForm.nationality} onChange={(e) => setManualForm({ ...manualForm, nationality: e.target.value })} style={{ ...inputStyle, appearance: "none", paddingRight: "36px" }}>
                      <option value="British/Irish">British/Irish</option>
                      <option value="Migrant">Migrant</option>
                    </select>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                      <path d="M3 5l4 4 4-4" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
                <div style={{ marginBottom: "22px" }}>
                  <label style={lbl}>Employment Start Date</label>
                  <input type="date" value={manualForm.startDate} onChange={(e) => setManualForm({ ...manualForm, startDate: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <button onClick={() => setShowModal(false)} style={cancelBtn}>Cancel</button>
                  <button onClick={handleManualAdd} disabled={!manualFormValid} style={{ ...primaryBtn, opacity: manualFormValid ? 1 : 0.5, cursor: manualFormValid ? "pointer" : "not-allowed" }}>Add Employee</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const lbl = { display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "6px" };
const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #D1D5DB", fontSize: "14px", outline: "none", boxSizing: "border-box", color: "#0F172A", backgroundColor: "white" };
const cancelBtn = { padding: "11px 20px", borderRadius: "8px", border: "1.5px solid #D1D5DB", backgroundColor: "white", fontSize: "14px", fontWeight: "500", cursor: "pointer", color: "#374151" };
const primaryBtn = { padding: "11px 20px", borderRadius: "8px", border: "none", backgroundColor: "#0852C9", color: "white", fontSize: "14px", fontWeight: "600", cursor: "pointer" };