"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useOnboardingStore } from "@/app/store/employerOnboarding";
import { CgSearch } from "react-icons/cg";
import toast from "react-hot-toast";
import { Lookup } from "@/app/action/onboarding.action";

interface CompanyForm {
  company_number: string;
  sponsor_license_status: string;
  sponsor_license_type: string;
}

export default function CompanyStep() {
  const { formData, updateFormData, nextStep, previousStep } =
    useOnboardingStore();

  const [isLookingUp, setIsLookingUp] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CompanyForm>({
    defaultValues: {
      company_number: formData.company_number || "",
      sponsor_license_status: formData.sponsor_license_status || "",
      sponsor_license_type: formData.sponsor_license_type || "",
    },
  });

  const companyNumber = watch("company_number");

  const onSubmit = (data: CompanyForm) => {
    updateFormData(data);
    nextStep();
  };

  const lookup = async () => {
    try {
      setIsLookingUp(true);
      
      if (!companyNumber) {
        toast.error("Please enter a company number");
        return;
      }

      if (companyNumber.length < 6) {
        toast.error("Enter a valid company number");
        return;
      }

      // Save the company number to formData before lookup
      updateFormData({ company_number: companyNumber });

      const res = await Lookup(companyNumber);
      console.log(res);
      updateFormData({
        sic_codes: ["62011", "62012"],
      });

      toast.success("Company details fetched");
    } catch (error) {
      console.error(error);
      toast.error("Failed to lookup company");
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleCompanyNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("company_number", value);
    
    // Save to formData as user types if it's valid length
    if (value.length >= 6) {
      updateFormData({ company_number: value });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] font-inter px-4 py-6 md:px-6 md:py-8">
      <div className="md:max-w-139 w-full bg-[#FFFFFF] rounded-lg shadow-sm shadow-[#0E3A801F] py-6 px-5 sm:py-8 sm:px-7 md:py-10 md:px-9">
        <h2 className="text-lg sm:text-xl md:text-[22px] lg:text-[25px] 2xl:text-[30px] font-semibold text-[#111111] mb-1">
          Company Information
        </h2>
        <p className="text-sm sm:text-base md:text-[15px] lg:text-[17px] 2xl:text-[20px] text-[#4D4D4D] mb-6 md:mb-8">
          Tell us about your organisation
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 md:space-y-8">
          <div>
            <label className="block text-sm sm:text-base md:text-[15px] lg:text-[17px] 2xl:text-[20px] font-medium text-[#111111] mb-1.5 md:mb-2">
              Companies House Number
            </label>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <input
                type="text"
                placeholder="12345678"
                {...register("company_number", {
                  required: "Companies House Number is required",
                  minLength: {
                    value: 6,
                    message: "Enter a valid company number",
                  },
                  onChange: handleCompanyNumberChange,
                })}
                className={`w-full sm:w-7/10 border-2 shadow-sm shadow-[#1018280D] py-2.5 sm:py-3 md:py-3.5 px-3 md:px-4 rounded-[9px] focus:ring-2 focus:outline-0 focus:ring-[#0852C9] text-sm sm:text-base md:text-[15px] lg:text-[17px] 2xl:text-[20px] text-[#4D4D4D] ${
                  errors.company_number ? "border-red-500" : "border-[#D0D5DD]"
                }`}
              />

              <button
                type="button"
                disabled={isLookingUp}
                onClick={lookup}
                className="w-full sm:w-3/10 flex items-center justify-center gap-1.5 md:gap-1.25 border-[#D0D5DD] border-2 shadow-sm shadow-[#1018280D] py-2.5 sm:py-3 md:py-3.5 px-3 md:px-4 rounded-[9px] text-sm sm:text-base md:text-[15px] lg:text-[17px] 2xl:text-[20px] text-[#4D4D4D] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <CgSearch className="text-base md:text-lg" />
                {isLookingUp ? "Looking..." : "Lookup"}
              </button>
            </div>

            {errors.company_number && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {errors.company_number.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm sm:text-base md:text-[15px] lg:text-[17px] 2xl:text-[20px] font-medium text-[#111111] mb-1.5 md:mb-2">
              Sponsor License Status
            </label>
            <select
              {...register("sponsor_license_status", {
                required: "Sponsor license status is required",
              })}
              className={`w-full border-2 py-2.5 sm:py-3 md:py-3.5 px-3 md:px-4 text-sm md:text-base rounded-[9px] bg-white text-[#4D4D4D] focus:ring-2 focus:outline-0 focus:ring-[#0852C9] ${
                errors.sponsor_license_status ? "border-red-500" : "border-[#D0D5DD]"
              }`}
            >
              <option value="">Select status</option>
              <option value="a_rated">A-rated</option>
              <option value="b_rated">B-rated</option>
              <option value="not_licensed">Not licensed</option>
              <option value="unknown">Unknown</option>
            </select>
            {errors.sponsor_license_status && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {errors.sponsor_license_status.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm sm:text-base md:text-[15px] lg:text-[17px] 2xl:text-[20px] font-medium text-[#111111] mb-1.5 md:mb-2">
              Sponsor License Type
            </label>
            <select
              {...register("sponsor_license_type", {
                required: "Sponsor license type is required",
              })}
              className={`w-full border-2 py-2.5 sm:py-3 md:py-3.5 px-3 md:px-4 text-sm md:text-base rounded-[9px] bg-white text-[#4D4D4D] focus:ring-2 focus:outline-0 focus:ring-[#0852C9] ${
                errors.sponsor_license_type ? "border-red-500" : "border-[#D0D5DD]"
              }`}
            >
              <option value="">Select type</option>
              <option value="worker">Skill Worker</option>
              <option value="temporary_worker">Temporary Worker</option>
              <option value="ministry_of_religion">Ministry of Religion</option>
              {/* <option value="graduate">Graduate</option>
              <option value="graduate_dependent">Graduate Dependent</option>
              <option value="skilled_worker">Skilled Worker</option>
              <option value="skilled_worker_dependent">
                Skilled Worker Dependent
              </option> */}
            </select>
            {errors.sponsor_license_type && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {errors.sponsor_license_type.message}
              </p>
            )}
          </div>

          <hr className="border-gray-200" />

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-3 md:pt-4">
            <button
              type="button"
              onClick={previousStep}
              className="w-full sm:flex-1 bg-white border border-[#0A65CC] text-[#0A65CC] py-2.5 sm:py-3 md:py-3.5 px-6 md:px-9.25 text-sm md:text-base rounded-[9px] font-semibold hover:bg-blue-50 transition-colors"
            >
              Back
            </button>

            <button
              type="submit"
              className="w-full sm:flex-1 bg-[#0852C9] text-white py-2.5 sm:py-3 md:py-3.5 px-6 md:px-9.25 text-sm md:text-base rounded-[9px] font-semibold hover:bg-[#0852C9]/90 transition-colors"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}