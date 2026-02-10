import clientApi from "@/lib/axios";

// interface 
export interface Role {
  id: number;
  job_title: string;
  soc_codes: string[];
  salary_range: string;
  location: string;
  expected_start_date: string;
  visa_sponsor_availability: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  employer_email: string;
}

export interface RolesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Role[];
}

export interface ActionResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// get roles action
export async function get_roles(): Promise<ActionResponse<RolesResponse>> {
  try {
    const res = await clientApi.get<RolesResponse>('api/employer/role/');

    if (res.status === 200 || res.status === 201) {
      return {
        success: true,
        message: 'Roles fetched successfully',
        data: res.data,
      };
    }

    return {
      success: false,
      message: 'Unexpected response from server',
    };
  } catch (error: any) {
    console.error(error);
    if (error?.response?.data?.detail) {
      return {
        success: false,
        message: error.response.data.detail,
      };
    }
    if (error?.response?.data) {
      return {
        success: false,
        message: JSON.stringify(error.response.data),
      };
    }
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}


// post role / create role aciton
import { AxiosError } from "axios";

export interface CreateRolePayload {
  job_title_id: number;
  job_location_type: string;
  job_location: string;
  job_type_id: number;
  benefits_ids: number[];
  show_pay_by: string;
  minimum: string;
  maximum: string;
  rate: string;
  status: string;
  post_date: string;
  end_date: string;
}

interface RoleData {
  id: number;
  job_title: string;
  soc_codes: string[];
  salary_range: string;
  location: string;
  expected_start_date: string;
  visa_sponsor_availability: boolean;
  status: "open" | "closed";
  created_at: string;
  updated_at: string;
  employer_email: string;
}

interface CreateRoleSuccessResponse {
  messsage: string;
  data: RoleData;
}

type FieldErrorResponse = {
  [field: string]: string[];
};

interface AuthErrorResponse {
  detail: string;
}

export interface CreateRoleActionResponse {
  success: boolean;
  message: string;
}

export async function create_role(
  payload: CreateRolePayload
): Promise<CreateRoleActionResponse> {
  try {
    const res = await clientApi.post<CreateRoleSuccessResponse>(
      "api/employer/role/",
      payload
    );

    return {
      success: true,
      message: res.data.messsage || "Role has been created successfully",
    };
  } catch (error) {
    const axiosError = error as AxiosError<FieldErrorResponse | AuthErrorResponse>;

    const responseData = axiosError.response?.data;

    if (
      axiosError.response?.status === 401 ||
      (responseData && typeof responseData === "object" && responseData !== null && "detail" in responseData)
    ) {
      return {
        success: false,
        message:
          (responseData as AuthErrorResponse)?.detail ||
          "Authentication credentials were not provided.",
      };
    }

    if (responseData && typeof responseData === "object" && responseData !== null) {
      const firstField = Object.keys(responseData)[0];

      if (
        firstField &&
        Array.isArray(responseData[firstField])
      ) {
        return {
          success: false,
          message: responseData[firstField][0],
        };
      }
    }

    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}
// for getting the dashboard of the user 
interface PostedRole {
  id: number;
  job_title: string;
  soc_codes: string[];
  salary_range: string;
  location: string;
  expected_start_date: string;
  visa_sponsor_availability: boolean;
  status: "open" | "closed";
  created_at: string;
  updated_at: string;
  employer_email: string;
  shortlisted: string;
  applied: string;
}

interface DashboardPagination {
  page: number;
  page_size: number;
  total_pages: number;
}

interface EmployerDashboardResponse {
  total_posted_roles: number;
  roles_posted_this_month: number;
  interviews_conducted: number;
  interviews_conducted_this_month: number;
  offers_sent: number;
  offers_sent_this_month: number;
  posted_roles: PostedRole[];
  posted_roles_pagination: DashboardPagination;
  upcoming_interviews: string[];

}

interface AuthErrorResponse {
  detail: string;
}

export interface EmployerDashboardActionResponse {
  success: boolean;
  message: string;
  data?: EmployerDashboardResponse;
}

export default async function EmployerDasboardAction(): Promise<EmployerDashboardActionResponse> {
  try {
    const res = await clientApi.get<EmployerDashboardResponse>(
      "api/employer/dashboard/"
    );

    return {
      success: true,
      message: "Dashboard fetched successfully",
      data: res.data,
    };
  } catch (error) {
    const axiosError = error as AxiosError<AuthErrorResponse>;
    const responseData = axiosError.response?.data;

    if (
      axiosError.response?.status === 401 ||
      (responseData && "detail" in responseData)
    ) {
      return {
        success: false,
        message:
          responseData?.detail ||
          "Authentication credentials were not provided.",
      };
    }

    return {
      success: false,
      message: "Failed to get dashboard",
    };
  }
}

// for the detail  role action
interface RoleDetailResponse {
  id: number;
  job_title: string;
  soc_codes: string[];
  salary_range: string;
  location: string;
  expected_start_date: string;
  visa_sponsor_availability: boolean;
  status: "open" | "closed";
  created_at: string;
  updated_at: string;
  employer_email: string;
}

interface AuthOrNotFoundError {
  detail: string;
}

export interface GetRoleDetailActionResponse {
  success: boolean;
  message: string;
  data?: RoleDetailResponse;
}

export async function get_role_detail(
  id: number
): Promise<GetRoleDetailActionResponse> {
  try {
    const res = await clientApi.get<RoleDetailResponse>(
      `api/employer/role/${id}/`
    );

    return {
      success: true,
      message: "Role fetched successfully",
      data: res.data,
    };
  } catch (error) {
    const axiosError = error as AxiosError<AuthOrNotFoundError>;
    const responseData = axiosError.response?.data;

    if (
      axiosError.response?.status === 401 ||
      (responseData && "detail" in responseData)
    ) {
      return {
        success: false,
        message:
          responseData?.detail ||
          "Authentication credentials were not provided.",
      };
    }

    return {
      success: false,
      message: "Failed to get detailed role",
    };
  }
}

// for delete role

export interface DeleteRoleActionResponse {
  success: boolean;
  message: string;
}

export async function delete_role(
  id: number
): Promise<DeleteRoleActionResponse> {
  try {
    await clientApi.delete(`api/employer/role/${id}/`);

    return {
      success: true,
      message: "Role deleted successfully",
    };
  } catch (error) {
    const axiosError = error as AxiosError;

    return {
      success: false,
      message: "Failed to delete role",
    };
  }
}

// for updating the code valu
export interface UpdateRolePayload {
  job_title?: string;
  soc_code?: string;
  salary_range?: string;
  location?: string;
  expected_start_date?: string;
  visa_sponsor_availability?: boolean;
  is_submitted?: boolean;
}

export interface UpdateRoleActionResponse {
  success: boolean;
  message: string;
}

export async function update_role(
  id: number,
  payload: UpdateRolePayload
): Promise<UpdateRoleActionResponse> {
  try {
    await clientApi.patch(`api/employer/role/${id}/`, payload);

    return {
      success: true,
      message: "Role updated successfully",
    };
  } catch {
    return {
      success: false,
      message: "Failed to update role",
    };
  }
}


// soc code list, put req (remaining)

// exployer action fro the emppoyer
export async function matched_candidates(role: number) {
  try {
    const res = await clientApi.get(`api/employer/role/${role}/matches/`);
    
    if (res.status !== 200 && res.status !== 201) {
      return { success: false, message: "Failed to get the matched candidates" };
    }
    
    const candidates = res.data;
    
    if (!Array.isArray(candidates)) {
      return { success: false, message: "Invalid data format received" };
    }
    
    return { 
      success: true, 
      message: "Fetched successfully", 
      data: candidates,
      count: candidates.length 
    };
    
  } catch (error) {
    console.error("Error fetching matched candidates:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to get the matched candidates" 
    };
  }
}

// fecthing the condidates 
export async function get_candidate_by_match(cond: number) {
  try {
    const res = await clientApi.get(`api/employer/candidates/${cond}/details/`);
    
    if (res.status !== 200 && res.status !== 201) {
      return { success: false, message: "Failed to get the candidate details" };
    }
    
    const candidate = res.data;
    
    if (!candidate || typeof candidate !== 'object') {
      return { success: false, message: "Invalid data format received" };
    }
    
    return { 
      success: true, 
      message: "Candidate fetched successfully", 
      data: candidate
    };
    
  } catch (error) {
    console.error("Error fetching candidate details:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to get the candidate details" 
    };
  }
}

// create offer endpoint
interface ApiErrorResponse {
  role?: string[];
  job_title?: string[];
  proposed_start_date?: string[];
  annual_salary?: string[];
  additional_note?: string[];
  non_field_errors?: string[];
  detail?: string;
  [key: string]: string[] | string | undefined;
}

export async function send_offer(candidateId: number, offerData: {
  role: number;
  job_title: number;
  proposed_start_date: string;
  annual_salary: number;
  additional_note: string;
}) {
  try {
    const res = await clientApi.post(`/api/employer/candidate/${candidateId}/offer/`, offerData);
    
    if (res.status === 200 || res.status === 201) {
      return { 
        success: true, 
        message: "Offer sent successfully", 
        data: res.data 
      };
    }
    
    return { success: false, message: "Failed to send offer" };
    
  } catch (error: any) {
    console.error("send_offer error:", error);
    
    if (error.response?.data) {
      const errorData: ApiErrorResponse = error.response.data;
      
      if (errorData.non_field_errors && errorData.non_field_errors.length > 0) {
        const errorMsg = errorData.non_field_errors[0];
        
        if (errorMsg.includes("already") || errorMsg.includes("duplicate")) {
          return { 
            success: false, 
            message: "An offer has already been sent to this candidate for this role" 
          };
        }
        
        return { success: false, message: errorMsg };
      }
      
      if (errorData.role && errorData.role.length > 0) {
        return { success: false, message: `Role error: ${errorData.role[0]}` };
      }
      
      if (errorData.job_title && errorData.job_title.length > 0) {
        return { success: false, message: `Job title error: ${errorData.job_title[0]}` };
      }
      
      if (errorData.proposed_start_date && errorData.proposed_start_date.length > 0) {
        return { success: false, message: `Start date error: ${errorData.proposed_start_date[0]}` };
      }
      
      if (errorData.annual_salary && errorData.annual_salary.length > 0) {
        return { success: false, message: `Salary error: ${errorData.annual_salary[0]}` };
      }
      
      if (errorData.additional_note && errorData.additional_note.length > 0) {
        return { success: false, message: `Note error: ${errorData.additional_note[0]}` };
      }
      
      if (errorData.detail) {
        return { success: false, message: errorData.detail };
      }
      
      const firstErrorKey = Object.keys(errorData)[0];
      if (firstErrorKey && errorData[firstErrorKey]) {
        const errorValue = errorData[firstErrorKey];
        const errorMessage = Array.isArray(errorValue) ? errorValue[0] : errorValue;
        return { 
          success: false, 
          message: `${firstErrorKey.replace(/_/g, ' ')}: ${errorMessage}` 
        };
      }
    }
    
    if (error.message === "Network Error" || !error.response) {
      return { 
        success: false, 
        message: "Network error. Please check your connection and try again" 
      };
    }
    
    if (error.code === "ECONNABORTED") {
      return { 
        success: false, 
        message: "Request timeout. Please try again" 
      };
    }
    
    return { 
      success: false, 
      message: "Failed to send offer. Please try again" 
    };
  }
}

export async function get_job_titles() {
  try {
    const res = await clientApi.get(`api/employer/job/titles/`);
    
    if (res.status !== 200 && res.status !== 201) {
      return { success: false, message: "Failed to load job titles" };
    }
    
    if (!Array.isArray(res.data)) {
      return { success: false, message: "Invalid data format received" };
    }
    
    return { 
      success: true, 
      message: "Job titles fetched successfully", 
      data: res.data 
    };
    
  } catch (error) {
    console.error("Error fetching job titles:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to load job titles" 
    };
  }
}

// schdule interview
interface Interview {
  candidate: number;
  role: number;
  time_slot_1: string;
  time_slot_2: string;
  time_slot_3: string;
  terms_and_conditions: boolean;
}

interface ApiErrorResponse {
  non_field_errors?: string[];
  candidate?: string[];
  role?: string[];
  time_slot_1?: string[];
  time_slot_2?: string[];
  time_slot_3?: string[];
  terms_and_conditions?: string[];
  detail?: string;
  [key: string]: string[] | string | undefined;
}

export async function CreateInterview(data: Interview) {
  try {
    const res = await clientApi.post('/api/employer/interviews/', data);
    
    if (res.status === 200 || res.status === 201) {
      return { success: true, message: "Interview scheduled successfully" };
    }
    
    return { success: false, message: "Failed to schedule interview" };
    
  } catch (error: any) {
    console.error("CreateInterview error:", error);
    
    if (error.response?.data) {
      const errorData: ApiErrorResponse = error.response.data;
      
      if (errorData.non_field_errors && errorData.non_field_errors.length > 0) {
        const errorMsg = errorData.non_field_errors[0];
        
        if (errorMsg.includes("unique set") || errorMsg.includes("candidate, role")) {
          return { 
            success: false, 
            message: "An interview has already been scheduled for this candidate and role" 
          };
        }
        
        return { success: false, message: errorMsg };
      }
      
      if (errorData.terms_and_conditions && errorData.terms_and_conditions.length > 0) {
        return { 
          success: false, 
          message: "You must accept the terms and conditions to schedule an interview" 
        };
      }
      
      if (errorData.candidate && errorData.candidate.length > 0) {
        return { success: false, message: `Candidate error: ${errorData.candidate[0]}` };
      }
      
      if (errorData.role && errorData.role.length > 0) {
        return { success: false, message: `Role error: ${errorData.role[0]}` };
      }
      
      if (errorData.time_slot_1 && errorData.time_slot_1.length > 0) {
        return { success: false, message: `Time slot 1: ${errorData.time_slot_1[0]}` };
      }
      
      if (errorData.time_slot_2 && errorData.time_slot_2.length > 0) {
        return { success: false, message: `Time slot 2: ${errorData.time_slot_2[0]}` };
      }
      
      if (errorData.time_slot_3 && errorData.time_slot_3.length > 0) {
        return { success: false, message: `Time slot 3: ${errorData.time_slot_3[0]}` };
      }
      
      if (errorData.detail) {
        return { success: false, message: errorData.detail };
      }
      
      const firstErrorKey = Object.keys(errorData)[0];
      if (firstErrorKey && errorData[firstErrorKey]) {
        const errorValue = errorData[firstErrorKey];
        const errorMessage = Array.isArray(errorValue) ? errorValue[0] : errorValue;
        return { 
          success: false, 
          message: `${firstErrorKey.replace(/_/g, ' ')}: ${errorMessage}` 
        };
      }
    }
    
    if (error.message === "Network Error" || !error.response) {
      return { 
        success: false, 
        message: "Network error. Please check your connection and try again" 
      };
    }
    
    if (error.code === "ECONNABORTED") {
      return { 
        success: false, 
        message: "Request timeout. Please try again" 
      };
    }
    
    return { 
      success: false, 
      message: "Failed to schedule interview. Please try again" 
    };
  }
}