'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useOnboardingStore } from '@/app/store/onboardingStore';
import { CandidateOnboarding } from '@/app/action/onboarding.action';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { update_User_info } from '@/app/auth/_action/auth.action';

interface ReviewSubmitForm {
  confirmAccuracy: boolean;
  understandVerification: boolean;
  agreeTerms: boolean;
}

export default function ReviewSubmitStep() {
  const router = useRouter();
  const { formData, updateFormData, previousStep, resetOnboarding } = useOnboardingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [checkboxes, setCheckboxes] = useState({
    confirmAccuracy: false,
    understandVerification: false,
    agreeTerms: false
  });

  // State for optional services - initialize from formData
  const [optionalServices, setOptionalServices] = useState({
    wpc_community_profile: formData.wpc_community_profile ?? false,
    sponser_ready: formData.sponser_ready ?? false,
    interview_mastery_bootcamp: formData.interview_mastery_bootcamp ?? false,
    executive_career_suite: formData.executive_career_suite ?? false
  });
  
  const { handleSubmit, setValue } = useForm<ReviewSubmitForm>({
    defaultValues: {
      confirmAccuracy: false,
      understandVerification: false,
      agreeTerms: false
    }
  });

  const handleCheckboxChange = (field: keyof ReviewSubmitForm) => {
    const newValue = !checkboxes[field];
    setCheckboxes({ ...checkboxes, [field]: newValue });
    setValue(field, newValue);
  };

  const handleOptionalServiceToggle = (field: keyof typeof optionalServices) => {
    const newValue = !optionalServices[field];
    setOptionalServices({ ...optionalServices, [field]: newValue });
    // Update formData store immediately
    updateFormData({ [field]: newValue });
  };

  const preparePayload = () => {
    // Helper function to get first file from FileList
    const getFile = (fileList: FileList | null | undefined): File | undefined => {
      return fileList?.[0];
    };

    // Build the payload according to OnboardingFormData interface
    const payload = {
      is_in_uk: formData.is_in_uk ?? false,
      uk_postcode: formData.uk_postcode || '',
      uk_street: formData.uk_street || '',
      uk_city: formData.uk_city || '',
      passport_file: formData.passport_file,
      passport_expiry: formData.passport_expiry || '',
      brp_file:formData.brp_file,
      evisa_file: formData.evisa_file,
      visa_expiry: formData.visa_expiry || '',
      rtw_share_code: formData.rtw_share_code || '',
      visa_status: formData.visa_status || '',
      current_position: formData.cv_parsed_data?.employment_history?.current_position || '',
      soc_code: formData.cv_parsed_data?.employment_history?.soc_code || '',
      position_start_date: formData.cv_parsed_data?.employment_history?.position_start_date || '',
      has_dependents: formData.has_dependents ?? false,
      cv_file: formData.cv_file,
      target_roles: formData.target_roles || 0,
      qualification_documents:formData.qualification_documents,
      english_language_documents:formData.english_language_documents,
      dbs_certificate: formData.dbs_certificate,
      specialized_licenses: formData.specialized_licenses,
      training_certificates:formData.training_certificates,
      is_submitted: true,
      cv_parsed_data: formData.cv_parsed_data || null,
      // Add optional services
      wpc_community_profile: optionalServices.wpc_community_profile,
      sponser_ready: optionalServices.sponser_ready,
      interview_mastery_bootcamp: optionalServices.interview_mastery_bootcamp,
      executive_career_suite: optionalServices.executive_career_suite
    };

    return payload;
  };

  const onSubmit = async (data: ReviewSubmitForm) => {
    // Validate all checkboxes are checked
    if (!checkboxes.confirmAccuracy || !checkboxes.understandVerification || !checkboxes.agreeTerms) {
      toast.error('Please confirm all checkboxes to continue');
      return;
    }

    // Update form data with checkbox values
    updateFormData(data);

    setIsSubmitting(true);
    setLoadingMessage('Submitting Onboarding Data');

    try {
      // Prepare the payload
      const payload = preparePayload();

      console.log(payload)

      // Call the API
      const response = await CandidateOnboarding(payload);

      if (response.success) {
        toast.success(response.message || 'Application submitted successfully!', {
          duration: 5000,
        });

        // Reset the onboarding store
        resetOnboarding();

        // now once the onboarding is done then redirect to the candidate dashboard
        setLoadingMessage('Redirecting to Dashboard');
        const res = await update_User_info();
        if (!res.success) {
          toast.error("Fail to update onboarding");
          setIsSubmitting(false);
          setLoadingMessage('');
          return;
        }

        // Redirect to success page or dashboard
        setTimeout(() => {
          router.push('/candidate/dashboard'); 
        }, 1500);
      } else {
        setIsSubmitting(false);
        setLoadingMessage('');
        toast.error(response.message || 'Failed to submit application', {
          duration: 6000,
        });
      }
    } catch (error: any) {
      setIsSubmitting(false);
      setLoadingMessage('');
      toast.error(error.message || 'An unexpected error occurred', {
        duration: 6000,
      });
      console.error('Submission error:', error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] font-inter">
        <div className="md:max-w-139 w-full bg-[#FFFFFF] rounded-lg shadow-sm shadow-[#0E3A801F] py-10 px-9">
          <h2 className="text-[22px] lg:text-[25px] 2xl:text-[30px] font-semibold text-[#111111] mb-1">
            Review & Submit
          </h2>
          <p className="text-[15px] lg:text-[17px] 2xl:text-[20px] text-[#4D4D4D] mb-8">
            Confirm your entries to complete the process
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div
              onClick={() => !isSubmitting && handleCheckboxChange('confirmAccuracy')}
              className={`w-full p-4 border-2 border-[#D0D5DD] rounded-md cursor-pointer transition hover:bg-blue-50 hover:border-[#0852C9] shadow-sm shadow-[#0000000D] ${
                isSubmitting ? 'cursor-not-allowed opacity-60' : ''
              }`}
            >
              <div className="flex items-center justify-center gap-4">
                <div className="w-[20px] h-[20px] rounded-full border-3 mt-1 flex items-center justify-center border-[#0852C9]">
                  {checkboxes.confirmAccuracy && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0852C9]" />
                  )}
                </div>
                <p className="w-[95%] text-[14px] lg:text-[16px] text-[#3E3E3E] font-medium">
                  I confirm that all information provided in this application is true and accurate to the best of my knowledge. I understand that providing false or misleading information may result in my application being rejected or withdrawn.
                </p>
              </div>
            </div>

            <div
              onClick={() => !isSubmitting && handleCheckboxChange('understandVerification')}
              className={`w-full p-4 border-2 border-[#D0D5DD] rounded-md cursor-pointer transition hover:bg-blue-50 hover:border-[#0852C9] shadow-sm shadow-[#0000000D] ${
                isSubmitting ? 'cursor-not-allowed opacity-60' : ''
              }`}
            >
              <div className="flex items-center justify-center gap-4">
                <div className="w-[20px] h-[20px] rounded-full border-3 mt-1 flex items-center justify-center border-[#0852C9]">
                  {checkboxes.understandVerification && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0852C9]" />
                  )}
                </div>
                <p className="w-[95%] text-[14px] lg:text-[16px] text-[#3E3E3E] font-medium">
                  I understand that WPC does not provide immigration advice. Any verification performed is for application preparation purposes only and does not replace statutory employer Right-to-Work checks.
                </p>
              </div>
            </div>

            <div
              onClick={() => !isSubmitting && handleCheckboxChange('agreeTerms')}
              className={`w-full p-4 border-2 border-[#D0D5DD] rounded-md cursor-pointer transition hover:bg-blue-50 hover:border-[#0852C9] shadow-sm shadow-[#0000000D] ${
                isSubmitting ? 'cursor-not-allowed opacity-60' : ''
              }`}
            >
              <div className="flex items-center justify-center gap-4">
                <div className="w-[20px] h-[20px] rounded-full border-3 mt-1 flex items-center justify-center border-[#0852C9]">
                  {checkboxes.agreeTerms && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0852C9]" />
                  )}
                </div>
                <p className="w-[95%] text-[14px] lg:text-[16px] text-[#3E3E3E] font-medium">
                  I agree to the Terms of Service, Privacy Policy, and consent to the processing of my personal data in accordance with GDPR for the purposes of employment verification and job matching.
                </p>
              </div>
            </div>

            {/* Optional Services Section */}
            <div className="border-t-2 border-dashed border-gray-300 pt-6">
              <label className="block text-sm font-medium text-gray-900 mb-4">
                Optional Services
              </label>

              <div 
                onClick={() => !isSubmitting && handleOptionalServiceToggle('wpc_community_profile')}
                className={`mb-4 p-4 border-2 rounded-lg transition-colors ${
                  optionalServices.wpc_community_profile 
                    ? 'border-primary bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${isSubmitting ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="relative shrink-0 w-5 h-5 mt-0.5">
                      <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                        optionalServices.wpc_community_profile 
                          ? 'border-primary bg-white' 
                          : 'border-gray-300 bg-white'
                      }`}>
                        {optionalServices.wpc_community_profile && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">WPC Community Profile</p>
                      <p className="text-sm text-gray-600">Profile + AI-docks</p>
                    </div>
                  </div>
                  <span className="font-semibold text-primary">£0</span>
                </div>
              </div>

              <div 
                onClick={() => !isSubmitting && handleOptionalServiceToggle('sponser_ready')}
                className={`mb-4 p-4 border-2 rounded-lg transition-colors ${
                  optionalServices.sponser_ready 
                    ? 'border-primary bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${isSubmitting ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="relative shrink-0 w-5 h-5 mt-0.5">
                      <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                        optionalServices.sponser_ready 
                          ? 'border-primary bg-white' 
                          : 'border-gray-300 bg-white'
                      }`}>
                        {optionalServices.sponser_ready && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Sponsor-Ready</p>
                      <p className="text-sm text-gray-600">Manual compliance audit</p>
                    </div>
                  </div>
                  <span className="font-semibold text-primary">£199</span>
                </div>
              </div>

              <div 
                onClick={() => !isSubmitting && handleOptionalServiceToggle('interview_mastery_bootcamp')}
                className={`mb-4 p-4 border-2 rounded-lg transition-colors ${
                  optionalServices.interview_mastery_bootcamp 
                    ? 'border-primary bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${isSubmitting ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="relative shrink-0 w-5 h-5 mt-0.5">
                      <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                        optionalServices.interview_mastery_bootcamp 
                          ? 'border-primary bg-white' 
                          : 'border-gray-300 bg-white'
                      }`}>
                        {optionalServices.interview_mastery_bootcamp && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Interview Mastery Bootcamp</p>
                      <p className="text-sm text-gray-600">Mock interviews + professional video</p>
                    </div>
                  </div>
                  <span className="font-semibold text-primary">£599</span>
                </div>
              </div>

              <div 
                onClick={() => !isSubmitting && handleOptionalServiceToggle('executive_career_suite')}
                className={`mb-4 p-4 border-2 rounded-lg transition-colors ${
                  optionalServices.executive_career_suite 
                    ? 'border-primary bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${isSubmitting ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="relative shrink-0 w-5 h-5 mt-0.5">
                      <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                        optionalServices.executive_career_suite 
                          ? 'border-primary bg-white' 
                          : 'border-gray-300 bg-white'
                      }`}>
                        {optionalServices.executive_career_suite && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Executive Career Suite</p>
                      <p className="text-sm text-gray-600">Career coach + salary negotiation + legal consult</p>
                    </div>
                  </div>
                  <span className="font-semibold text-primary">£1199</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-4 pt-6">
              <button
                type="button"
                onClick={previousStep}
                disabled={isSubmitting}
                className="flex-1 bg-white border border-[#0A65CC] text-[#0A65CC]  max-w-[200px] py-4 text-[16px] lg:text-[18px] rounded-lg font-semibold hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-[2px] bg-primary text-white max-w-[200px] py-4 text-[16px] lg:text-[18px] rounded-lg font-semibold"
                  >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center gap-6 max-w-sm mx-4">
            <div className="relative">
              <svg
                className="animate-spin h-16 w-16 text-[#0852C9]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <p className="text-[18px] lg:text-[20px] font-semibold text-[#111111] text-center">
              {loadingMessage}
            </p>
            <p className="text-[14px] lg:text-[16px] text-[#4D4D4D] text-center">
              Please wait, do not close this window...
            </p>
          </div>
        </div>
      )}
    </>
  );
}