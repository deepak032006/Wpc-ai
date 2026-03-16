'use server';

import { cookies } from 'next/headers';

const BASE_URL = 'http://37.27.113.235:6767';

// ─── Token helpers ────────────────────────────────────────────────────────────

async function resolveToken(clientToken?: any): Promise<string> {
  if (clientToken) {
    if (typeof clientToken === 'object') {
      const extracted =
        clientToken.access ??
        clientToken.token ??
        clientToken.access_token ??
        clientToken.key ??
        '';
      if (typeof extracted === 'string' && extracted.length > 10) return extracted;
    }
    if (typeof clientToken === 'string') {
      const cleaned = clientToken.replace(/\s+/g, '').replace(/^(Bearer|Token)\s*/i, '');
      if (cleaned && cleaned !== 'undefined' && cleaned !== 'null') return cleaned;
    }
  }
  const store = await cookies();
  const raw = store.get('access-token')?.value ?? store.get('access_token')?.value ?? '';
  return raw.replace(/\s+/g, '').replace(/^(Bearer|Token)\s*/i, '');
}

function makeHeaders(token: string): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

async function apiFetch(
  url: string,
  options: RequestInit = {},
  clientToken?: string,
): Promise<Response> {
  const token = await resolveToken(clientToken);
  const res = await fetch(url, {
    ...options,
    headers: makeHeaders(token),
    cache: 'no-store',
  });
  console.log(`[apiFetch] ${options.method ?? 'GET'} ${url} → ${res.status}`);
  return res;
}

function errMsg(data: any): string {
  if (!data) return 'Unexpected error.';
  if (typeof data === 'string') return data;
  if (data.detail) return String(data.detail);
  if (data.non_field_errors) return data.non_field_errors.join(' ');
  const k = Object.keys(data)[0];
  if (k) return Array.isArray(data[k]) ? `${k}: ${data[k][0]}` : String(data[k]);
  return 'Something went wrong.';
}

// ─── Generic Response Type ────────────────────────────────────────────────────

type AR<T = null> = { success: boolean; message: string; data?: T };

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type HRValidationRecord = {
  id: number;
  User: number;
  created_at?: string;
  status?: string;
  [key: string]: any;
};

export type Employee = {
  id: number;
  employee_full_name: string;
  employment_start_date: string;
  nationality: string;
  HRValidationRecord_id: number;
  rtw_document_url?: string;
  status?: string;
  created_at?: string;
  [key: string]: any;
};

export type AddEmployeePayload = {
  employee_full_name: string;
  employment_start_date: string;
  nationality: string;
  HRValidationRecord_id: number;
  rtw_document_url?: string;
};

// ─── Authorising Officer ──────────────────────────────────────────────────────

export type AuthorisingOfficer = {
  id: number;
  HRValidationRecord_id: number;
  Employee_id: number | null;
  selected_from_staff: boolean;
  full_name: string;
  role_in_company: string;
  AO_Credentials_senior_most_employee: boolean;
  AO_Credentials_company_director: boolean;
  AO_Credentials_on_payroll: boolean;
  AO_Credentials_holds_shared: boolean;
  is_acceptable: boolean;
  [key: string]: any;
};

export type AddAuthorisingOfficerPayload = {
  HRValidationRecord_id: number;
  Employee_id: number | null;
  selected_from_staff: boolean;
  full_name: string;
  role_in_company: string;
  AO_Credentials_senior_most_employee: boolean;
  AO_Credentials_company_director: boolean;
  AO_Credentials_on_payroll: boolean;
  AO_Credentials_holds_shared: boolean;
};

// ─── Client Contract ──────────────────────────────────────────────────────────

export type ClientContract = {
  id: number;
  HRValidationRecord_id: number;
  client_name: string;
  contract_with_client: boolean;
  does_contract_align_with_business_activities: boolean;
  contract_start_date: string | null;
  contract_end_date: string | null;
  contract_document_url: string;
  validation_status: string;
  validation_remarks: string;
  [key: string]: any;
};

export type AddClientContractPayload = {
  HRValidationRecord_id: number;
  client_name: string;
  contract_with_client: boolean;
  does_contract_align_with_business_activities: boolean;
  contract_start_date: string | null;
  contract_end_date: string | null;
  contract_document_url: string;
  validation_status: string;
  validation_remarks: string;
};

// ─── Financial Record ─────────────────────────────────────────────────────────

export type FinancialRecord = {
  id: number;
  HRValidationRecord_id: number;
  closing_balance_gbp?: string;
  total_incoming_gbp_credits?: string;
  total_outgoing_gbp_debits?: string;
  payments_reflected_in_bank?: boolean;
  is_future_engagement?: boolean;
  large_transactions?: LargeTransaction[];
  [key: string]: any;
};

export type CreateFinancialRecordPayload = {
  HRValidationRecord_id: number;
  closing_balance_gbp: string;
};

export type UpdateFinancialRecordPayload = {
  total_incoming_gbp_credits?: string;
  total_outgoing_gbp_debits?: string;
  payments_reflected_in_bank?: boolean;
  is_future_engagement?: boolean;
};

// ─── Large Transaction ────────────────────────────────────────────────────────

export type LargeTransaction = {
  id: number;
  HRValidationRecord_id: number;
  FinancialRecord_id: number;
  transaction_amount_gbp: string;
  transaction_description: string;
  transaction_type: 'credit' | 'debit';
  transaction_date: string;
  [key: string]: any;
};

export type AddLargeTransactionPayload = {
  HRValidationRecord_id: number;
  FinancialRecord_id: number;
  transaction_amount_gbp: string;
  transaction_description: string;
  transaction_type: 'credit' | 'debit';
  transaction_date: string;
};

// ─── Dashboard types ──────────────────────────────────────────────────────────

export type DashboardStats = {
  hrValidation: number;
  postComplianceValidation: number;
  callAgents: number;
  tasksInProcess: number;
};

export type TaskItem = {
  id: string | number;
  type: string;
  dateCreated: string;
  status: string;
  result: string;
  employeeCount?: number;
  employees?: Employee[];
};

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 1 — HR VALIDATION RECORDS
// ═══════════════════════════════════════════════════════════════════════════════

export async function listHRValidationRecordsAction(
  clientToken?: string,
): Promise<AR<HRValidationRecord[]>> {
  try {
    const res = await apiFetch(
      `${BASE_URL}/api/hr-validation/hr-validation-records/`,
      {},
      clientToken,
    );
    const data = await res.json();
    if (!res.ok) return { success: false, message: errMsg(data) };
    const records = Array.isArray(data) ? data : (data.results ?? []);
    return { success: true, message: 'OK', data: records };
  } catch (e) {
    console.error('[listHRValidationRecordsAction]', e);
    return { success: false, message: 'Network error.' };
  }
}

export async function createHRValidationRecordAction(
  userId: number,
  clientToken?: string,
): Promise<AR<HRValidationRecord>> {
  try {
    const res = await apiFetch(
      `${BASE_URL}/api/hr-validation/hr-validation-records/`,
      { method: 'POST', body: JSON.stringify({ User: userId }) },
      clientToken,
    );
    const data = await res.json();
    if (!res.ok) return { success: false, message: errMsg(data) };
    return { success: true, message: 'Created.', data };
  } catch (e) {
    console.error('[createHRValidationRecordAction]', e);
    return { success: false, message: 'Network error.' };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 2 — EMPLOYEES (Staff List)
// ═══════════════════════════════════════════════════════════════════════════════

export async function listEmployeesAction(
  hrValidationRecordId: number,
  clientToken?: string,
): Promise<AR<Employee[]>> {
  try {
    const res = await apiFetch(
      `${BASE_URL}/api/hr-validation/employees/?HRValidationRecord_id=${hrValidationRecordId}`,
      {},
      clientToken,
    );
    const data = await res.json();
    if (!res.ok) return { success: false, message: errMsg(data) };
    const employees = Array.isArray(data) ? data : (data.results ?? []);
    return { success: true, message: 'OK', data: employees };
  } catch (e) {
    console.error('[listEmployeesAction]', e);
    return { success: false, message: 'Network error.' };
  }
}

export async function addEmployeeAction(
  payload: AddEmployeePayload,
  clientToken?: string,
): Promise<AR<Employee>> {
  try {
    const res = await apiFetch(
      `${BASE_URL}/api/hr-validation/employees/`,
      { method: 'POST', body: JSON.stringify(payload) },
      clientToken,
    );
    const data = await res.json();
    if (!res.ok) return { success: false, message: errMsg(data) };
    return { success: true, message: 'Employee added.', data };
  } catch (e) {
    console.error('[addEmployeeAction]', e);
    return { success: false, message: 'Network error.' };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 3 — AUTHORISING OFFICER
// POST   /api/hr-validation/authorising-officers/
// ═══════════════════════════════════════════════════════════════════════════════

export async function createAuthorisingOfficerAction(
  payload: AddAuthorisingOfficerPayload,
  clientToken?: string,
): Promise<AR<AuthorisingOfficer>> {
  try {
    const res = await apiFetch(
      `${BASE_URL}/api/hr-validation/authorising-officers/`,
      { method: 'POST', body: JSON.stringify(payload) },
      clientToken,
    );

    
    const contentType = res.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      return { 
        success: false, 
        message: `Server error (${res.status}). Backend issue with Employee_id. Please try "Add New Individual" instead.` 
      };
    }

    const data = await res.json();
    if (!res.ok) return { success: false, message: errMsg(data) };
    return { success: true, message: 'Authorising Officer saved.', data };
  } catch (e) {
    console.error('[createAuthorisingOfficerAction]', e);
    return { success: false, message: 'Network error.' };
  }
}

export async function listAuthorisingOfficersAction(
  hrValidationRecordId: number,
  clientToken?: string,
): Promise<AR<AuthorisingOfficer[]>> {
  try {
    const res = await apiFetch(
      `${BASE_URL}/api/hr-validation/authorising-officers/?HRValidationRecord_id=${hrValidationRecordId}`,
      {},
      clientToken,
    );
    const data = await res.json();
    if (!res.ok) return { success: false, message: errMsg(data) };
    const officers = Array.isArray(data) ? data : (data.results ?? []);
    return { success: true, message: 'OK', data: officers };
  } catch (e) {
    console.error('[listAuthorisingOfficersAction]', e);
    return { success: false, message: 'Network error.' };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 4 — CLIENT CONTRACTS
// POST   /api/hr-validation/contracts/
// GET    /api/hr-validation/contracts/?HRValidationRecord_id=<id>
// ═══════════════════════════════════════════════════════════════════════════════

export async function addClientContractAction(
  payload: AddClientContractPayload,
  clientToken?: string,
): Promise<AR<ClientContract>> {
  try {
    const res = await apiFetch(
      `${BASE_URL}/api/hr-validation/contracts/`,
      { method: 'POST', body: JSON.stringify(payload) },
      clientToken,
    );
    const data = await res.json();
    if (!res.ok) return { success: false, message: errMsg(data) };
    return { success: true, message: 'Contract added.', data };
  } catch (e) {
    console.error('[addClientContractAction]', e);
    return { success: false, message: 'Network error.' };
  }
}

export async function listClientContractsAction(
  hrValidationRecordId: number,
  clientToken?: string,
): Promise<AR<ClientContract[]>> {
  try {
    const res = await apiFetch(
      `${BASE_URL}/api/hr-validation/contracts/?HRValidationRecord_id=${hrValidationRecordId}`,
      {},
      clientToken,
    );
    const data = await res.json();
    if (!res.ok) return { success: false, message: errMsg(data) };
    const contracts = Array.isArray(data) ? data : (data.results ?? []);
    return { success: true, message: 'OK', data: contracts };
  } catch (e) {
    console.error('[listClientContractsAction]', e);
    return { success: false, message: 'Network error.' };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 5 — FINANCIAL RECORDS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Step 5.1 — Create Financial Record (Closing Balance) ─────────────────────
// POST /api/hr-validation/financial-records/
// Body: { HRValidationRecord_id, closing_balance_gbp }

export async function createFinancialRecordAction(
  payload: CreateFinancialRecordPayload,
  clientToken?: string,
): Promise<AR<FinancialRecord>> {
  try {
    const res = await apiFetch(
      `${BASE_URL}/api/hr-validation/financial-records/`,
      { method: 'POST', body: JSON.stringify(payload) },
      clientToken,
    );
    const data = await res.json();
    if (!res.ok) return { success: false, message: errMsg(data) };
    return { success: true, message: 'Financial record created.', data };
  } catch (e) {
    console.error('[createFinancialRecordAction]', e);
    return { success: false, message: 'Network error.' };
  }
}

// ─── Step 5.2 — Update Cash Flow ──────────────────────────────────────────────
// PATCH /api/hr-validation/financial-records/<id>/
// Body: { total_incoming_gbp_credits, total_outgoing_gbp_debits }

export async function updateFinancialRecordAction(
  financialRecordId: number,
  payload: UpdateFinancialRecordPayload,
  clientToken?: string,
): Promise<AR<FinancialRecord>> {
  try {
    const res = await apiFetch(
      `${BASE_URL}/api/hr-validation/financial-records/${financialRecordId}/`,
      { method: 'PATCH', body: JSON.stringify(payload) },
      clientToken,
    );
    const data = await res.json();
    if (!res.ok) return { success: false, message: errMsg(data) };
    return { success: true, message: 'Financial record updated.', data };
  } catch (e) {
    console.error('[updateFinancialRecordAction]', e);
    return { success: false, message: 'Network error.' };
  }
}

// ─── Get Financial Record ──────────────────────────────────────────────────────
// GET /api/hr-validation/financial-records/<id>/

export async function getFinancialRecordAction(
  financialRecordId: number,
  clientToken?: string,
): Promise<AR<FinancialRecord>> {
  try {
    const res = await apiFetch(
      `${BASE_URL}/api/hr-validation/financial-records/${financialRecordId}/`,
      {},
      clientToken,
    );
    const data = await res.json();
    if (!res.ok) return { success: false, message: errMsg(data) };
    return { success: true, message: 'OK', data };
  } catch (e) {
    console.error('[getFinancialRecordAction]', e);
    return { success: false, message: 'Network error.' };
  }
}

// ─── Step 5.3 — Large Transactions ────────────────────────────────────────────
// POST   /api/hr-validation/large-transactions/
// DELETE /api/hr-validation/large-transactions/<id>/

export async function addLargeTransactionAction(
  payload: AddLargeTransactionPayload,
  clientToken?: string,
): Promise<AR<LargeTransaction>> {
  try {
    const res = await apiFetch(
      `${BASE_URL}/api/hr-validation/large-transactions/`,
      { method: 'POST', body: JSON.stringify(payload) },
      clientToken,
    );
    const data = await res.json();
    if (!res.ok) return { success: false, message: errMsg(data) };
    return { success: true, message: 'Transaction added.', data };
  } catch (e) {
    console.error('[addLargeTransactionAction]', e);
    return { success: false, message: 'Network error.' };
  }
}

export async function deleteLargeTransactionAction(
  transactionId: number,
  clientToken?: string,
): Promise<AR<null>> {
  try {
    const res = await apiFetch(
      `${BASE_URL}/api/hr-validation/large-transactions/${transactionId}/`,
      { method: 'DELETE' },
      clientToken,
    );
    if (res.status === 204) return { success: true, message: 'Deleted.' };
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { success: false, message: errMsg(data) };
    return { success: true, message: 'Deleted.' };
  } catch (e) {
    console.error('[deleteLargeTransactionAction]', e);
    return { success: false, message: 'Network error.' };
  }
}

// ─── Step 5.4 — Contract Payment Sync ─────────────────────────────────────────
// PATCH /api/hr-validation/financial-records/<id>/
// Body: { payments_reflected_in_bank, is_future_engagement }

export async function syncContractPaymentsAction(
  financialRecordId: number,
  paymentsReflectedInBank: boolean,
  isFutureEngagement: boolean,
  clientToken?: string,
): Promise<AR<FinancialRecord>> {
  return updateFinancialRecordAction(
    financialRecordId,
    {
      payments_reflected_in_bank: paymentsReflectedInBank,
      is_future_engagement: isFutureEngagement,
    },
    clientToken,
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD — Stats & Tasks
// ═══════════════════════════════════════════════════════════════════════════════

function formatDate(raw?: string | null): string {
  if (!raw) return '—';
  const normalised = raw.includes('T') ? raw : `${raw}T00:00:00`;
  const d = new Date(normalised);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function resolveDateCreated(record: HRValidationRecord, employees: Employee[]): string {
  const recordKeys = ['created_at', 'createdAt', 'date_created', 'dateCreated', 'updated_at', 'updatedAt'];
  for (const key of recordKeys) {
    const formatted = formatDate(record[key]);
    if (formatted !== '—') return formatted;
  }
  const empDates: Date[] = employees
    .map((e) => new Date(e.created_at?.includes('T') ? e.created_at : `${e.created_at}T00:00:00`))
    .filter((d) => !isNaN(d.getTime()));
  if (empDates.length > 0) {
    return formatDate(empDates.sort((a, b) => b.getTime() - a.getTime())[0].toISOString());
  }
  const startDates: Date[] = employees
    .map((e) => new Date(e.employment_start_date?.includes('T') ? e.employment_start_date : `${e.employment_start_date}T00:00:00`))
    .filter((d) => !isNaN(d.getTime()));
  if (startDates.length > 0) {
    return formatDate(startDates.sort((a, b) => b.getTime() - a.getTime())[0].toISOString());
  }
  return '—';
}

function statusToResult(s?: string): string {
  const map: Record<string, string> = {
    pending: 'Pending', in_progress: 'In Review', approved: 'Approved',
    rejected: 'Rejected', completed: 'Completed',
  };
  return map[s?.toLowerCase() ?? ''] ?? 'Pending';
}

export async function getDashboardStatsAction(clientToken?: string): Promise<AR<DashboardStats>> {
  const res = await listHRValidationRecordsAction(clientToken);
  if (!res.success) return { success: false, message: res.message };
  const records = res.data ?? [];
  const tasksInProcess = records.filter(
    (r) => !r.status || ['pending', 'in_progress', 'in progress'].includes(r.status.toLowerCase()),
  ).length;
  return {
    success: true, message: 'OK',
    data: { hrValidation: records.length, postComplianceValidation: 0, callAgents: 0, tasksInProcess },
  };
}

export async function getAllTasksAction(
  page = 1,
  clientToken?: string,
): Promise<AR<{ tasks: TaskItem[]; totalPages: number }>> {
  const res = await listHRValidationRecordsAction(clientToken);
  if (!res.success) return { success: false, message: res.message };
  const records = res.data ?? [];
  const tasks: TaskItem[] = await Promise.all(
    records.map(async (r) => {
      const empRes = await listEmployeesAction(r.id, clientToken);
      const employees = empRes.data ?? [];
      return {
        id: r.id, type: 'HR Validation',
        dateCreated: resolveDateCreated(r, employees),
        status: r.status ?? 'Pending',
        result: statusToResult(r.status),
        employeeCount: employees.length,
        employees,
      };
    }),
  );
  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(tasks.length / PAGE_SIZE));
  const paginated = tasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return { success: true, message: 'OK', data: { tasks: paginated, totalPages } };
}

export async function getHRValidationTasksAction(page = 1, clientToken?: string) {
  return getAllTasksAction(page, clientToken);
}

export async function getPostComplianceTasksAction(
  page = 1, _clientToken?: string,
): Promise<AR<{ tasks: TaskItem[]; totalPages: number }>> {
  return { success: true, message: 'OK', data: { tasks: [], totalPages: 1 } };
}

export async function getCallAgentsTasksAction(
  page = 1, _clientToken?: string,
): Promise<AR<{ tasks: TaskItem[]; totalPages: number }>> {
  return { success: true, message: 'OK', data: { tasks: [], totalPages: 1 } };
}