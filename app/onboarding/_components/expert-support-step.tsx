'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useOnboardingStore } from '@/app/store/employerOnboarding';
import { TiTick } from 'react-icons/ti';
import toast from 'react-hot-toast';
import { EmployerOnboarding } from '@/app/action/onboarding.action';
import { update_User_info } from '@/app/auth/_action/auth.action';
import { ArrowRight } from 'lucide-react';

interface CombinedForm {
  wants_consultation: boolean;
  consultation_datetime?: string;
  agreeTerms: boolean;
}

export default function CombinedStep() {
  const { formData, updateFormData, previousStep, completeOnboarding } =
    useOnboardingStore();

  const [supportMode, setSupportMode] = useState<'none' | 'expert'>(
    formData.wants_consultation ? 'expert' : 'none'
  );

  const initialDateTime = formData.consultation_datetime
    ? new Date(formData.consultation_datetime)
    : null;

  const [date, setDate] = useState(
    initialDateTime ? initialDateTime.toISOString().split('T')[0] : ''
  );
  const [time, setTime] = useState(
    initialDateTime
      ? initialDateTime.toISOString().split('T')[1].slice(0, 5)
      : ''
  );

  const [confirmAccuracy, setConfirmAccuracy] = useState(false);
  const [understandVerification, setUnderstandVerification] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const { handleSubmit } = useForm<CombinedForm>();

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const isSelected = date && time;

  const onSubmit = async () => {
    if (supportMode === 'expert' && (!date || !time)) {
      toast.error('Please select both date and time for consultation');
      return;
    }

    if (!confirmAccuracy || !understandVerification || !agreeTerms) {
      toast.error('Please confirm all checkboxes to continue');
      return;
    }

    const consultationData = supportMode === 'expert' 
      ? {
          wants_consultation: true,
          consultation_datetime: `${date}T${time}`,
        }
      : {
          wants_consultation: false,
          consultation_datetime: undefined,
        };

    updateFormData({ 
      ...consultationData,
      agreeTerms: true 
    });

    const payload = {
      company_name: formData.company_name ?? '',
      company_number: formData.company_number ?? '',
      registered_address: formData.registered_address ?? '',
      sic_codes: formData.sic_codes?.length
        ? formData.sic_codes
        : ['62011', '62012'],
      company_type: formData.company_type ?? '',
      sponsor_license_status: formData.sponsor_license_status ?? '',
      sponsor_license_type: formData.sponsor_license_type ?? '',
      staff_count: formData.staff_count ?? '',
      company_website: formData.company_website ?? '',
      key_positions: formData.key_positions ?? [],
      wants_consultation: supportMode === 'expert',
      consultation_datetime: supportMode === 'expert' ? `${date}T${time}` : null,
      is_submitted: true,
    };

    console.log('EMPLOYER ONBOARDING SUBMISSION DATA:', payload);

    try {
      const res = await EmployerOnboarding(payload);
      if (res.success) {
        console.log('ONBOARDING RESPONSE:', res);
        completeOnboarding();
        const response = await update_User_info();
        if (!response.success) {
          toast.error('Fail to update onboarding');
          return;
        }
        toast.success(res.message);
      } else {
        console.log(res);
        toast.error(res.message);
      }
    } catch (error) {
      console.error('ONBOARDING ERROR:', error);
      toast.error('Internal Server Error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] font-inter px-4 py-6 md:px-6 md:py-8">
      <div className="md:max-w-300 w-full bg-white rounded-lg shadow-sm shadow-[#0E3A801F] py-6 px-5 sm:py-8 sm:px-7 md:py-10 md:px-9">
        {/* Header Section */}
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5  rounded-full mb-3">
            <span className="text-sm font-medium text-[#856404]">Transparent Pricing</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-[35px] lg:text-[40px] font-bold text-[#111111] mb-2">
            No Hire, No Pay Model
          </h2>
          <p className="text-sm sm:text-base md:text-[16px] lg:text-[18px] text-[#4D4D4D]">
            Transparent, outcome-based pricing.
          </p>
          <p className="text-sm sm:text-base md:text-[16px] lg:text-[18px] text-[#4D4D4D]">
            You only pay a fixed success fee when your chosen candidate signs the offer letter.
          </p>
        </div>

        {/* No Hire, No Pay Section - Gradient Background - NOW CLICKABLE */}
        <div 
          onClick={() => {
            setSupportMode('none');
            setDate('');
            setTime('');
          }}
          className="bg-gradient-to-r from-[#1E3A8A] via-[#4b8ffd] to-[#00d9ff] rounded-2xl p-6 md:p-8 mb-6 md:mb-8 cursor-pointer transition hover:opacity-90"
        >
          {/* Pills at the top */}
          <div className="w-full flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2">
              <span className="text-white">✓</span>
              <span className="text-white text-sm font-medium">Zero upfront cost</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2">
              <span className="text-white">✓</span>
              <span className="text-white text-sm font-medium">Fixed success fee</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2">
              <span className="text-white">✓</span>
              <span className="text-white text-sm font-medium">Risk-free hiring</span>
            </div>
          </div>

          {/* What's Included Free Heading */}
          <h3 className="text-xl md:text-2xl font-bold mb-4" style={{ color: '#4ADE80' }}>
            What's Included Free
          </h3>

          {/* Grid of Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="bg-white/10 backdrop-blur-sm border-3 border-white/50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <span className="bg-[#4ADE80] text-black text-xs font-bold px-2 py-1 rounded">Free</span>
                <span className="text-white font-semibold">Job Posting <span className="text-white/80 text-sm">- Unlimited job listings</span></span>
              </div>
              
            </div>

            <div className="bg-white/10 backdrop-blur-sm border-3 border-white/50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <span className="bg-[#4ADE80] text-black text-xs font-bold px-2 py-1 rounded">Free</span>
                <span className="text-white font-semibold">Candidate Search<span className="text-white/80 text-sm">- Browse all verified candidates</span></span>
              </div>
              
            </div>

            <div className="bg-white/10 backdrop-blur-sm border-3 border-white/50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <span className="bg-[#4ADE80] text-black text-xs font-bold px-2 py-1 rounded">Free</span>
                <span className="text-white font-semibold">Candidate Selection <span className="text-white/80 text-sm">- Shortlist and review applications</span></span>
              </div>
              
            </div>

            <div className="bg-white/10 backdrop-blur-sm border-3 border-white/50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <span className="bg-[#4ADE80] text-black text-xs font-bold px-2 py-1 rounded">Free</span>
                <span className="text-white font-semibold">Compliance Checks<span className="text-white/80 text-sm">- SOC code & salary validation</span></span>
              </div>
              
            </div>

            <div className="bg-white/10 backdrop-blur-sm border-3 border-white/50 rounded-lg p-4 md:col-span-2">
              <div className="flex items-center gap-2">
                <span className="bg-[#4ADE80] text-black text-xs font-bold px-2 py-1 rounded">Free</span>
                <span className="text-white font-semibold">Interview Scheduling <span className="text-white/80 text-sm">- Built-in scheduling tools</span></span>
              </div>
              
            </div>
          </div>
        </div>

        {/* Expert Support Section */}
        <div className="bg-gradient-to-r from-[#ffffff] via-blue-50 to-[#f0f7ff] border-2 border-[#3B82F6] rounded-2xl p-6 md:p-8 mb-6 md:mb-8">
          <h3 className="text-xl md:text-2xl font-bold text-[#1E3A8A] mb-2">
            Expert Support (Optional)
          </h3>
          <p className="text-sm md:text-base text-[#475569] mb-4">
            Not sure about salary bands or SOC Codes?
          </p>
          <p className="text-sm md:text-base text-[#475569] mb-6">
            Schedule a free consultation with WPC Recruitment Officer.
          </p>

          {supportMode === 'expert' ? (
            <>
              <p className="text-base md:text-lg font-semibold text-[#1E3A8A] mb-3">
                Select date and time:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 relative">
                <input
                  type="date"
                  min={getMinDate()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 md:px-4 py-2.5 sm:py-3 md:py-3.5 text-sm md:text-base rounded-md border-2 border-[#3B82F6] focus:ring-2 focus:ring-[#0852C9] focus:outline-0"
                />

                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 md:px-4 py-2.5 sm:py-3 md:py-3.5 text-sm md:text-base rounded-md border-2 border-[#3B82F6] focus:ring-2 focus:ring-[#0852C9] focus:outline-0"
                />

                {isSelected && (
                  <span className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-[#33951A] border border-[#33951A] p-0.5 sm:p-1 rounded-full">
                    <TiTick className="w-3 h-3 sm:w-4 sm:h-4" />
                  </span>
                )}
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setSupportMode('expert')}
              className="bg-[#0852C9] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0852C9]/90 transition-colors inline-flex items-center gap-2"
            >
              Schedule Free Consultation
              <span><ArrowRight/></span>
            </button>
          )}
        </div>

        {/* Confirmation Checkboxes */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 md:space-y-2">
          <div
            onClick={() => setConfirmAccuracy(!confirmAccuracy)}
            className={`w-full p-4 md:p-5  cursor-pointer transition `}
          >
            <div className="flex items-start gap-3 md:gap-4">
              <div
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${
                  confirmAccuracy ? 'border-[#0852C9] bg-[#0852C9]' : 'border-[#D0D5DD]'
                }`}
              >
                {confirmAccuracy && (
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white" />
                )}
              </div>
              <p className="flex-1 text-sm md:text-base text-[#1F2937] leading-relaxed">
                I confirm that all information provided in this application is true and accurate to the best of my knowledge. I understand that providing false or misleading information may result in my application being rejected or withdrawn.
              </p>
            </div>
          </div>

          <div
            onClick={() => setUnderstandVerification(!understandVerification)}
            className={`w-full p-4 md:p-5  cursor-pointer transition `}
          >
            <div className="flex items-start gap-3 md:gap-4">
              <div
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${
                  understandVerification ? 'border-[#0852C9] bg-[#0852C9]' : 'border-[#D0D5DD]'
                }`}
              >
                {understandVerification && (
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white" />
                )}
              </div>
              <p className="flex-1 text-sm md:text-base text-[#1F2937] leading-relaxed">
                I understand that WPC does not provide immigration advice. Any verification performed is for application preparation purposes only and does not replace statutory employer Right-to-Work checks.
              </p>
            </div>
          </div>

          <div
            onClick={() => setAgreeTerms(!agreeTerms)}
            className={`w-full p-4 md:p-5  cursor-pointer transition `}
          >
            <div className="flex items-start gap-3 md:gap-4">
              <div
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${
                  agreeTerms ? 'border-[#0852C9] bg-[#0852C9]' : 'border-[#D0D5DD]'
                }`}
              >
                {agreeTerms && (
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white" />
                )}
              </div>
              <p className="flex-1 text-sm md:text-base text-[#1F2937] leading-relaxed">
                I agree to the Terms of Service, Privacy Policy, and consent to the processing of my personal data in accordance with GDPR for the purposes of employment verification and job matching.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 md:pt-6">
            <button
              type="button"
              onClick={previousStep}
              className="w-full sm:flex-1 bg-white border-2 border-[#0852C9] text-[#0852C9] py-3 md:py-4 text-base md:text-lg rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Back
            </button>

            <button
              type="submit"
              className="w-full sm:flex-1 bg-[#0852C9] text-white py-3 md:py-4 text-base md:text-lg rounded-lg font-semibold hover:bg-[#0852C9]/90 transition-colors"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}