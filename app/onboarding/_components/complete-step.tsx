"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useOnboardingStore } from "@/app/store/employerOnboarding";
import toast from "react-hot-toast";
import { EmployerOnboarding } from "@/app/action/onboarding.action";
import { update_User_info } from "@/app/auth/_action/auth.action";

interface ReviewSubmitForm {
  agreeTerms: boolean;
}

export default function ReviewSubmitStep() {
  const { formData, updateFormData, nextStep, previousStep, completeOnboarding } =
    useOnboardingStore();

  const [confirmAccuracy, setConfirmAccuracy] = useState(false);
  const [understandVerification, setUnderstandVerification] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const { handleSubmit } = useForm<ReviewSubmitForm>();

 const onSubmit = async () => {
  if (!confirmAccuracy || !understandVerification || !agreeTerms) {
    toast.error("Please confirm all checkboxes to continue");
    return;
  }

  updateFormData({ agreeTerms: true });

  const payload = {
    company_name: formData.company_name ?? "",
    company_number: formData.company_number ?? "",
    registered_address: formData.registered_address ?? "",
    sic_codes: formData.sic_codes?.length
      ? formData.sic_codes
      : ["62011", "62012"],
    company_type: formData.company_type ?? "",
    sponsor_license_status: formData.sponsor_license_status ?? "",
    sponsor_license_type: formData.sponsor_license_type ?? "",
    staff_count: formData.staff_count ?? "",
    company_website: formData.company_website ?? "",
    key_positions: formData.key_positions ?? [],
    wants_consultation: Boolean(formData.wants_consultation),
    consultation_datetime: formData.wants_consultation
      ? formData.consultation_datetime
      : null,
    is_submitted: true,
  };

  console.log("EMPLOYER ONBOARDING SUBMISSION DATA:", payload);

  try {
    const res = await EmployerOnboarding(payload);
    if(res.success){
      console.log("ONBOARDING RESPONSE:", res);
      completeOnboarding();
      const response = await update_User_info();
      if (!response.success) {
        toast.error("Fail to update onboarding");
        return;
      }
      toast.success(res.message);
    } else {
      console.log(res);
      toast.error(res.message);
    }
    // nextStep();
  } catch (error) {
    console.error("ONBOARDING ERROR:", error);
    toast.error("Internal Server Error");
  }
};


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] font-inter px-4 py-6 md:px-6 md:py-8">
      <div className="md:max-w-139 w-full bg-[#FFFFFF] rounded-lg shadow-sm shadow-[#0E3A801F] py-6 px-5 sm:py-8 sm:px-7 md:py-10 md:px-9">
        <h2 className="text-lg sm:text-xl md:text-[22px] lg:text-[25px] 2xl:text-[30px] font-semibold text-[#111111] mb-1">
          Review & Submit
        </h2>
        <p className="text-sm sm:text-base md:text-[15px] lg:text-[17px] 2xl:text-[20px] text-[#4D4D4D] mb-6 md:mb-8">
          Confirm your entries to complete the process
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-5">
          <div
            onClick={() => setConfirmAccuracy(!confirmAccuracy)}
            className="w-full p-3 sm:p-3.5 md:p-4 border-2 border-[#D0D5DD] rounded-md cursor-pointer transition hover:bg-blue-50 hover:border-[#0852C9] shadow-sm shadow-[#0000000D]"
          >
            <div className="flex items-start gap-3 sm:gap-3.5 md:gap-4">
              <div
                className={`w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] rounded-full border-2 sm:border-3 mt-0.5 sm:mt-1 flex items-center justify-center border-[#0852C9] flex-shrink-0`}
              >
                {confirmAccuracy && (
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#0852C9]" />
                )}
              </div>
              <p className="flex-1 text-xs sm:text-sm md:text-[14px] lg:text-[16px] text-[#3E3E3E] font-medium leading-relaxed">
                I confirm that all information provided in this application is
                true and accurate to the best of my knowledge. I understand that
                providing false or misleading information may result in my
                application being rejected or withdrawn.
              </p>
            </div>
          </div>

          <div
            onClick={() => setUnderstandVerification(!understandVerification)}
            className="w-full p-3 sm:p-3.5 md:p-4 border-2 border-[#D0D5DD] rounded-md cursor-pointer transition hover:bg-blue-50 hover:border-[#0852C9] shadow-sm shadow-[#0000000D]"
          >
            <div className="flex items-start gap-3 sm:gap-3.5 md:gap-4">
              <div
                className={`w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] rounded-full border-2 sm:border-3 mt-0.5 sm:mt-1 flex items-center justify-center border-[#0852C9] flex-shrink-0`}
              >
                {understandVerification && (
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#0852C9]" />
                )}
              </div>
              <p className="flex-1 text-xs sm:text-sm md:text-[14px] lg:text-[16px] text-[#3E3E3E] font-medium leading-relaxed">
                I understand that WPC does not provide immigration advice. Any
                verification performed is for application preparation purposes
                only and does not replace statutory employer Right-to-Work
                checks.
              </p>
            </div>
          </div>

          <div
            onClick={() => setAgreeTerms(!agreeTerms)}
            className="w-full p-3 sm:p-3.5 md:p-4 border-2 border-[#D0D5DD] rounded-md cursor-pointer transition hover:bg-blue-50 hover:border-[#0852C9] shadow-sm shadow-[#0000000D]"
          >
            <div className="flex items-start gap-3 sm:gap-3.5 md:gap-4">
              <div
                className={`w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] rounded-full border-2 sm:border-3 mt-0.5 sm:mt-1 flex items-center justify-center border-[#0852C9] flex-shrink-0`}
              >
                {agreeTerms && (
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#0852C9]" />
                )}
              </div>
              <p className="flex-1 text-xs sm:text-sm md:text-[14px] lg:text-[16px] text-[#3E3E3E] font-medium leading-relaxed">
                I agree to the Terms of Service, Privacy Policy, and consent to
                the processing of my personal data in accordance with GDPR for
                the purposes of employment verification and job matching.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 md:pt-6">
            <button
              type="button"
              onClick={previousStep}
              className="w-full sm:flex-1 bg-white border border-[#0A65CC] text-[#0A65CC] py-2.5 sm:py-3 md:py-3.5 text-sm md:text-base rounded-[9px] font-semibold hover:bg-blue-50 transition-colors"
            >
              Back
            </button>

            <button
              type="submit"
              className="w-full sm:flex-1 bg-[#0852C9] text-white py-2.5 sm:py-3 md:py-3.5 text-sm md:text-base rounded-[9px] font-semibold hover:bg-[#0852C9]/90 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}