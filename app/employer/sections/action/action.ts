'use server';

import { cookies } from 'next/headers';

const BASE_URL = 'http://37.27.113.235:6767';

function clean(raw: any): string {
  if (!raw) return '';
  if (typeof raw !== 'string') {
    if (typeof raw === 'object') {
      const obj = raw as any;
      raw = obj.access ?? obj.token ?? obj.access_token ?? obj.key ?? '';
    } else {
      return '';
    }
  }
  const s = String(raw).replace(/\s+/g, '');
  return s.replace(/^(Bearer|Token)/i, '');
}

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

async function apiFetch(url: string, options: RequestInit = {}, clientToken?: string): Promise<Response> {
  const token = await resolveToken(clientToken);
  const res = await fetch(url, { ...options, headers: makeHeaders(token), cache: 'no-store' });
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

// ─── Types ───────────────────────────────────────────────────────────────────

export type HRValidationRecord = {
  id: number;
  User: number;
  created_at?: string;
  status?: string;
};

export type Employee = {
  id: number;
  employee_full_name: string;
  employment_start_date: string;
  nationality: string;
  HRValidationRecord_id: number;
  rtw_document_url?: string;
  status?: string;
};

export type AddEmployeePayload = {
  employee_full_name: string;
  employment_start_date: string;
  nationality: string;
  HRValidationRecord_id: number;
  rtw_document_url?: string;
};

type AR<T = null> = { success: boolean; message: string; data?: T };

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

// ─── HR Validation Records ───────────────────────────────────────────────────

export async function listHRValidationRecordsAction(clientToken?: string): Promise<AR<HRValidationRecord[]>> {
  try {
    const res = await apiFetch(`${BASE_URL}/api/hr-validation/hr-validation-records/`, {}, clientToken);
    const data = await res.json();
    if (!res.ok) return { success: false, message: errMsg(data) };
    return { success: true, message: 'OK', data: Array.isArray(data) ? data : (data.results ?? []) };
  } catch (e) {
    console.error('[listHRValidationRecordsAction]', e);
    return { success: false, message: 'Network error.' };
  }
}

export async function createHRValidationRecordAction(userId: number, clientToken?: string): Promise<AR<HRValidationRecord>> {
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

// ─── Employees ───────────────────────────────────────────────────────────────

export async function listEmployeesAction(hrValidationRecordId: number, clientToken?: string): Promise<AR<Employee[]>> {
  try {
    const res = await apiFetch(
      `${BASE_URL}/api/hr-validation/employees/?HRValidationRecord_id=${hrValidationRecordId}`,
      {},
      clientToken,
    );
    const data = await res.json();
    if (!res.ok) return { success: false, message: errMsg(data) };
    return { success: true, message: 'OK', data: Array.isArray(data) ? data : (data.results ?? []) };
  } catch (e) {
    console.error('[listEmployeesAction]', e);
    return { success: false, message: 'Network error.' };
  }
}

export async function addEmployeeAction(payload: AddEmployeePayload, clientToken?: string): Promise<AR<Employee>> {
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

// ─── Dashboard ───────────────────────────────────────────────────────────────

export async function getDashboardStatsAction(clientToken?: string): Promise<AR<DashboardStats>> {
  const res = await listHRValidationRecordsAction(clientToken);
  if (!res.success) return { success: false, message: res.message };
  const records = res.data ?? [];

  return {
    success: true,
    message: 'OK',
    data: {
      hrValidation: records.length,
      postComplianceValidation: 0,
      callAgents: 0,
      tasksInProcess: records.filter((r) => r.status === 'in_progress').length,
    },
  };
}

function statusToResult(s?: string): string {
  return (
    ({
      pending: 'Pending',
      in_progress: 'In Review',
      approved: 'Approved',
      rejected: 'Rejected',
      completed: 'Completed',
    } as Record<string, string>)[s?.toLowerCase() ?? ''] ?? 'Pending'
  );
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
        id: r.id,
        type: 'HR Validation',
        dateCreated: r.created_at
          ? new Date(r.created_at).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : new Date().toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
        status: r.status ?? 'Pending',
        result: statusToResult(r.status),
        employeeCount: employees.length,
        employees,
      };
    })
  );

  const PAGE = 10;
  return {
    success: true,
    message: 'OK',
    data: {
      tasks: tasks.slice((page - 1) * PAGE, page * PAGE),
      totalPages: Math.max(1, Math.ceil(tasks.length / PAGE)),
    },
  };
}

export async function getHRValidationTasksAction(page = 1, clientToken?: string) {
  return getAllTasksAction(page, clientToken);
}

export async function getPostComplianceTasksAction(
  page = 1,
  clientToken?: string,
): Promise<AR<{ tasks: TaskItem[]; totalPages: number }>> {
  return { success: true, message: 'OK', data: { tasks: [], totalPages: 1 } };
}

export async function getCallAgentsTasksAction(
  page = 1,
  clientToken?: string,
): Promise<AR<{ tasks: TaskItem[]; totalPages: number }>> {
  return { success: true, message: 'OK', data: { tasks: [], totalPages: 1 } };
}