'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useOnboardingStore } from '@/app/store/onboardingStore';
import { CandidateOnboarding } from '@/app/action/onboarding.action';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { update_User_info } from '@/app/auth/_action/auth.action';
import ServiceCard from './ServiceCard';

interface ReviewSubmitForm {
  confirmAccuracy: boolean;
  understandVerification: boolean;
  agreeTerms: boolean;
}

// Define service data
const SERVICES = [
  {
    id: 'wpc_community_profile',
    title: 'WPC Community Profile',
    price: 'Free',
    badge: 'Basic',
    features: ['Profile', 'AI-docks']
  },
  {
    id: 'sponser_ready',
    title: 'Skilled Worker<br />Career Prep',
    price: '£199',
    badge: 'Popular',
    features: [
      'Document compliance audit',
      'CV rewrite for sponsored roles',
      'Multiple role-specific CV versions'
    ]
  },
  {
    id: 'interview_mastery_bootcamp',
    title: 'Interview Coaching<br />Package',
    price: '£599',
    badge: 'Most Effective',
    features: [
      'Skilled Worker Career Prep Package +',
      '3x 1-on-1 mock interviews',
      'Industry interview guidance',
      'Professionally recorded intro video'
    ]
  },
  {
    id: 'executive_career_suite',
    title: 'Premium<br />Career Suite',
    price: '£1,199',
    badge: 'Premium',
    features: [
      'Interview Coaching Package +',
      'Skilled Worker Career Prep',
      'Dedicated career coach',
      'Salary negotiation training',
      'Legal consultation (via WPC Lawyers)'
    ]
  }
];

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
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] font-['Nunito_Sans',sans-serif]">
        <div className="md:max-w-[1200px] w-full bg-[#FFFFFF] rounded-lg  shadow-[#0E3A801F] py-10 px-9">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-[12px] lg:text-[10px] text-[#6B7280] mb-2 tracking-wide">
              Optional Career Preparation
            </p>
            <h2 className="text-[28px] lg:text-[32px] 2xl:text-[36px] font-bold text-[#111111] mb-2">
              WPC Career Academy
            </h2>
            <p className="text-[10px] lg:text-[16px] text-[#4D4D4D] max-w-2xl mx-auto">
              For candidates who want expert support preparing for competitive roles.<br />
              These services improve readiness, not access to employers.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Optional Services Cards */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-8"
            >

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-80 bg-gradient-to-b from-blue-100 via-blue-300 to-blue-100 rounded-full blur-xl opacity-70">
</div>
              {SERVICES.map((service) => (
                <ServiceCard
                  key={service.id}
                  title={service.title}
                  price={service.price}
                  badge={service.badge}
                  features={service.features}
                  isSelected={optionalServices[service.id as keyof typeof optionalServices]}
                  isDisabled={isSubmitting}
                  onToggle={() => handleOptionalServiceToggle(service.id as keyof typeof optionalServices)}
                />
              ))}
            </div>

            {/* Checkboxes Section */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <div
                onClick={() => !isSubmitting && handleCheckboxChange('confirmAccuracy')}
                className={`flex items-start gap-3 ${isSubmitting ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    checkboxes.confirmAccuracy 
                      ? 'border-[#111111] bg-[#111111]' 
                      : 'border-[#D1D5DB] bg-white'
                  }`}>
                    {checkboxes.confirmAccuracy && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </div>
                <p className="text-[14px] text-[#111111] leading-relaxed">
                  I confirm that all information provided in this application is true and accurate to the best of my knowledge. I understand that providing false or misleading information may result in my application being rejected or withdrawn.
                </p>
              </div>

              <div
                onClick={() => !isSubmitting && handleCheckboxChange('understandVerification')}
                className={`flex items-start gap-3 ${isSubmitting ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    checkboxes.understandVerification 
                      ? 'border-[#111111] bg-[#111111]' 
                      : 'border-[#D1D5DB] bg-white'
                  }`}>
                    {checkboxes.understandVerification && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </div>
                <p className="text-[14px] text-[#111111] leading-relaxed">
                  I understand that WPC does not provide immigration advice. Any verification performed is for application preparation purposes only and does not replace statutory employer Right-to-Work checks.
                </p>
              </div>

              <div
                onClick={() => !isSubmitting && handleCheckboxChange('agreeTerms')}
                className={`flex items-start gap-3 ${isSubmitting ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    checkboxes.agreeTerms 
                      ? 'border-[#111111] bg-[#111111]' 
                      : 'border-[#D1D5DB] bg-white'
                  }`}>
                    {checkboxes.agreeTerms && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </div>
                <p className="text-[14px] text-[#111111] leading-relaxed">
                  I agree to the Terms of Service, Privacy Policy, and consent to the processing of my personal data in accordance with GDPR for the purposes of employment verification and job matching.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-8">
              <button
                type="button"
                onClick={previousStep}
                disabled={isSubmitting}
                className="px-12 py-3 bg-white border-2 border-[#0A65CC] text-[#0A65CC] text-[16px] rounded-lg font-semibold hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-12 py-3 flex items-center justify-center gap-2 bg-[#2563EB] text-white text-[16px] rounded-lg font-semibold hover:bg-[#1D4ED8] transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="animate-spin h-16 w-16 text-[#2563EB]"
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
            <p className="text-[10px] lg:text-[16px] text-[#4D4D4D] text-center">
              Please wait, do not close this window...
            </p>
          </div>
        </div>
      )}
    </>
  );
}