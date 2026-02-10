import clientApi from "@/lib/axios";
import { CV_PARSED } from "../store/onboardingStore";
// Types
interface KeyPosition {
  id: number;
  name: string;
}

interface EmployerOnboardingPayload {
  company_name: string;
  company_number: string;
  registered_address: string;
  sic_codes: string[];
  company_type: string;
  sponsor_license_status: string;
  sponsor_license_type: string;
  staff_count: string;
  company_website: string;
  key_positions: KeyPosition[];
  wants_consultation: boolean;
  consultation_datetime?: string | null;
  is_submitted: boolean;
}

interface OnboardingResponse {
  success: boolean;
  message: string;
  data?: any;
}
interface SicCode {
  code: string;
  description: string;
}

interface CompanyData {
  company_number: string;
  company_name: string;
  registered_address: string;
  company_type: string;
  sic_codes: SicCode[];
  company_status: string;
  date_of_creation: string;
}

interface LookupResponse {
  success: boolean;
  message: string;
  data?: CompanyData;
}

// Validation function
function validatePayload(payload: EmployerOnboardingPayload): { valid: boolean; message?: string } {
  if (!payload.company_name?.trim()) {
    return { valid: false, message: "Company name is required" };
  }
  
  if (!payload.company_number?.trim()) {
    return { valid: false, message: "Company number is required" };
  }
  
  if (!payload.registered_address?.trim()) {
    return { valid: false, message: "Registered address is required" };
  }
  
  if (!payload.sic_codes || payload.sic_codes.length === 0) {
    return { valid: false, message: "At least one SIC code is required" };
  }
  
  if (!payload.company_type?.trim()) {
    return { valid: false, message: "Company type is required" };
  }
  
  if (!payload.sponsor_license_status?.trim()) {
    return { valid: false, message: "Sponsor license status is required" };
  }
  
  if (!payload.sponsor_license_type?.trim()) {
    return { valid: false, message: "Sponsor license type is required" };
  }
  
  if (!payload.staff_count?.trim()) {
    return { valid: false, message: "Staff count is required" };
  }
  
  if (!payload.key_positions || payload.key_positions.length === 0) {
    return { valid: false, message: "At least one key position is required" };
  }
  
  // Validate key positions
  for (const position of payload.key_positions) {
    if (!position.id) {
      return { valid: false, message: "Please select at Least one Key Position" };
    }
  }
  
  if (payload.wants_consultation ){
    if(!payload.consultation_datetime) {
    return { valid: false, message: "Consultation datetime is required when consultation is requested" };
  }
}
  
  if (typeof payload.is_submitted !== 'boolean') {
    return { valid: false, message: "Submission status must be a boolean" };
  }
  
  return { valid: true };
}

export async function EmployerOnboarding(
  payload: EmployerOnboardingPayload
): Promise<OnboardingResponse> {
  try {
    // Validate payload
    const validation = validatePayload(payload);
    if (!validation.valid) {
      return {
        success: false,
        message: validation.message || "Validation failed"
      };
    }

    // Make API request
    const response = await clientApi.patch("api/employer/onboarding/", payload);

    // Check if response is successful
    if (response.data) {
      return {
        success: true,
        message: "Employer onboarding completed successfully",
        data: response.data
      };
    }

    return {
      success: false,
      message: "Failed to onboard employer"
    };

  } catch (error: any) {
    // Handle authentication error
    if (error.response?.data?.detail === "Authentication credentials were not provided.") {
      return {
        success: false,
        message: "Authentication credentials were not provided."
      };
    }

    // Handle other API errors
    if (error.response?.data?.detail) {
      return {
        success: false,
        message: error.response.data.detail
      };
    }

    // Handle validation errors
    if (error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message
      };
    }

    // Generic error
    return {
      success: false,
      message: error.message || "Failed to onboard employer"
    };
  }
}

// lookup 


export async function Lookup(
  company_number: string
): Promise<LookupResponse> {
  try {
    // Validate company_number
    if (!company_number || !company_number.trim()) {
      return {
        success: false,
        message: "Company number is required"
      };
    }

    // Make API request with query parameter
    const response = await clientApi.get("/api/employer/lookup", {
      params: {
        company_number: company_number.trim()
      }
    });

    // Check if response contains data
    if (response.data) {
      return {
        success: true,
        message: "Company details retrieved successfully",
        data: response.data as CompanyData
      };
    }

    return {
      success: false,
      message: "Failed to get Lookup"
    };

  } catch (error: any) {
    // Handle authentication error
    if (error.response?.data?.detail === "Authentication credentials were not provided.") {
      return {
        success: false,
        message: "Authentication credentials were not provided."
      };
    }

    // Handle other API errors
    if (error.response?.data?.detail) {
      return {
        success: false,
        message: error.response.data.detail
      };
    }

    // Handle generic errors
    if (error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message
      };
    }

    // Generic error
    return {
      success: false,
      message: error.message || "Failed to get Lookup"
    };
  }
}
// Types
interface OnboardingFormData {
  is_in_uk: boolean;
  uk_postcode?: string;
  uk_street?: string;
  uk_city?: string;
  passport_file?: File;
  passport_expiry: string;
  brp_file?: File;
  evisa_file?: File;
  visa_expiry: string;
  rtw_share_code: string;
  visa_status: string;
  current_position: string;
  soc_code: string;
  position_start_date: string;
  has_dependents: boolean;
  cv_file?: File;
  target_roles: number;
  qualification_documents?: File;
  english_language_documents?: File;
  dbs_certificate?: File;
  is_submitted: boolean;
  specialized_licenses?: File;
  training_certificates?: File;
  cv_parsed_data: CV_PARSED | null;
  wpc_community_profile?: boolean;
  sponser_ready?: boolean;
  interview_mastery_bootcamp?: boolean;
  executive_career_suite?: boolean;
}

interface OnboardingResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    is_in_uk: boolean;
    uk_postcode: string;
    uk_street: string;
    uk_city: string;
    passport_file: string | null;
    passport_expiry: string;
    brp_file: string | null;
    evisa_file: string | null;
    visa_expiry: string;
    rtw_share_code: string;
    visa_status: string;
    current_position: string;
    soc_code: string;
    position_start_date: string;
    has_dependents: boolean;
    cv_file: string | null;
    cv_parsed_data: CV_PARSED | null;
    target_roles: string[];
    qualification_documents: string | null;
    english_language_documents: string | null;
    dbs_certificate: string | null;
    is_submitted: boolean;
    status: string;
    is_terminated: boolean;
    termination_reason: string;
    specialized_licenses: string | null;
    training_certificates: string | null;
    health_declaration_accepted: boolean;
  };
}

// Validation function
function validatePayloadCandidate(data: OnboardingFormData): { valid: boolean; message?: string } {
  // Check required fields
  if (typeof data.is_in_uk !== 'boolean') {
    return { valid: false, message: 'UK residency status is required' };
  }

  // If in UK, validate UK address fields
  if (data.is_in_uk) {
    if (!data.uk_postcode?.trim()) {
      return { valid: false, message: 'UK postcode is required for UK residents' };
    }
    if (data.uk_postcode && data.uk_postcode.length > 20){
      return {valid: false, message: "UK PostCode must be less than 20 chars"}
    }
    if (!data.uk_street?.trim()) {
      return { valid: false, message: 'UK street address is required for UK residents' };
    }
    if (!data.uk_city?.trim()) {
      return { valid: false, message: 'UK city is required for UK residents' };
    }
  }

  if (!data.qualification_documents) return {valid: false, message: "Qualification Document is Required"};
  if (!data.english_language_documents) return {valid: false, message: "English Language Document is Required"};
  if (!data.dbs_certificate) return {valid: false, message: "DBS Certificate Document is Required"};
  
  // Validate passport expiry
  if (!data.passport_expiry?.trim()) {
    return { valid: false, message: 'Passport expiry date is required' };
  }

  // Validate visa information
  if (!data.visa_expiry?.trim()) {
    return { valid: false, message: 'Visa expiry date is required' };
  }

  if (!data.rtw_share_code?.trim()) {
    return { valid: false, message: 'Right to work share code is required' };
  }

  if (!data.visa_status?.trim()) {
    return { valid: false, message: 'Visa status is required' };
  }

  if (!data.cv_file) {
    return {valid: false, message: "CV is Required"}
  }

  // Validate dependents field
  if (typeof data.has_dependents !== 'boolean') {
    return { valid: false, message: 'Dependents information is required' };
  }

  // Validate target roles
  if (!data.target_roles) {
    return { valid: false, message: 'At least one target role is required' };
  }

  // Validate is_submitted field
  if (typeof data.is_submitted !== 'boolean') {
    return { valid: false, message: 'Submission status is required' };
  }

  return { valid: true };
}

export async function CandidateOnboarding(
  payload: OnboardingFormData
): Promise<OnboardingResponse> {
  try {
    // Validate payload
    const validation = validatePayloadCandidate(payload);
    if (!validation.valid) {
      return {
        success: false,
        message: validation.message || "Validation failed"
      };
    }

    // Create FormData for multipart/form-data request
    const formData = new FormData();

    // Append all text fields
    formData.append('is_in_uk', String(payload.is_in_uk));
    
    if (payload.is_in_uk) {
      formData.append('uk_postcode', payload.uk_postcode || '');
      formData.append('uk_street', payload.uk_street || '');
      formData.append('uk_city', payload.uk_city || '');
    }

    formData.append('passport_expiry', payload.passport_expiry);
    formData.append('visa_expiry', payload.visa_expiry);
    formData.append('rtw_share_code', payload.rtw_share_code);
    formData.append('visa_status', payload.visa_status);
    formData.append('current_position', payload.current_position);
    formData.append('soc_code', payload.soc_code);
    formData.append('position_start_date', payload.position_start_date);
    formData.append('has_dependents', String(payload.has_dependents));
    formData.append('is_submitted', String(payload.is_submitted));
    formData.append('cv_parsed_data', JSON.stringify(payload.cv_parsed_data));

    // Append the 4 new boolean fields
    if (payload.wpc_community_profile !== undefined) {
      formData.append('wpc_community_profile', String(payload.wpc_community_profile));
    }
    if (payload.sponser_ready !== undefined) {
      formData.append('sponser_ready', String(payload.sponser_ready));
    }
    if (payload.interview_mastery_bootcamp !== undefined) {
      formData.append('interview_mastery_bootcamp', String(payload.interview_mastery_bootcamp));
    }
    if (payload.executive_career_suite !== undefined) {
      formData.append('executive_career_suite', String(payload.executive_career_suite));
    }

    // Append target roles as JSON string
    formData.append('target_roles', String(payload.target_roles));

    // Append files if they exist
    if (payload.passport_file) {
      formData.append('passport_file', payload.passport_file);
    }
    if (payload.brp_file) {
      formData.append('brp_file', payload.brp_file);
    }
    if (payload.evisa_file) {
      formData.append('evisa_file', payload.evisa_file);
    }
    if (payload.cv_file) {
      formData.append('cv_file', payload.cv_file);
    }
    if (payload.qualification_documents) {
      formData.append('qualification_documents', payload.qualification_documents);
    }
    if (payload.english_language_documents) {
      formData.append('english_language_documents', payload.english_language_documents);
    }
    if (payload.dbs_certificate) {
      formData.append('dbs_certificate', payload.dbs_certificate);
    }
    if (payload.specialized_licenses) {
      formData.append('specialized_licenses', payload.specialized_licenses);
    }
    if (payload.training_certificates) {
      formData.append('training_certificates', payload.training_certificates);
    }

    // Make API request using clientApi
    const response = await clientApi.patch("api/candidate/onboarding/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Check if response is successful
    if (response.data) {
      return {
        success: true,
        message: "Candidate onboarding completed successfully",
        data: response.data
      };
    }

    return {
      success: false,
      message: "Failed to onboard candidate"
    };

  } catch (error: any) {
   if (error.response?.data && typeof error.response.data === 'object') {
    const errorData = error.response.data;

    // pick first field error
    const firstKey = Object.keys(errorData)[0];
    const firstMessage = Array.isArray(errorData[firstKey])
      ? errorData[firstKey][0]
      : errorData[firstKey];

    return {
      success: false,
      message: firstMessage || 'Validation error from server',
    };
  }

  // Authentication error
  if (
    error.response?.data?.detail ===
    'Authentication credentials were not provided.'
  ) {
    return {
      success: false,
      message: 'Authentication credentials were not provided.',
    };
  }

  // Other backend detail error
  if (error.response?.data?.detail) {
    return {
      success: false,
      message: error.response.data.detail,
    };
  }

  // Backend custom message
  if (error.response?.data?.message) {
    return {
      success: false,
      message: error.response.data.message,
    };
  }

  // Generic error
  return {
    success: false,
    message: error.message || 'Failed to onboard candidate',
  };
  }
}

export async function get_target_roles() {
  try {
    const res = await clientApi.get('/api/candidate/target/sectors/');

    if (res.status === 200) {
      return {
        success: true,
        message: 'Target Roles fetched',
        data: res.data, 
      };
    }
    return {
      success: false,
      message: 'Unexpected response from server',
      data: [],
    };
  } catch (err) {
    console.error('get_target_roles error:', err);
    return {
      success: false,
      message: 'Failed to get Target Roles',
      data: [],
    };
  }
}