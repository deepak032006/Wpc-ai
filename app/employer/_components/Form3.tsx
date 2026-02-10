"use client";

import React, { useState, useEffect } from "react";
import { JobRoleType } from "../dashboard/post-role/page";
import clientApi from "@/lib/axios";
import toast from "react-hot-toast";
import ShimmerLoader from "@/app/onboarding/_components/Shimmerloader";

type FormType = {
  formData: JobRoleType;
  setFormData: (val: JobRoleType) => void;
  benefits: Benefit[];
  step: number;
  setStep: (val: number) => void;
};

type Benefit = {
  id: number;
  name: string;
};

const formatNumber = (value: string): string => {

  let cleaned = value.replace(/\D/g, '');


  if (cleaned.length > 1 && cleaned[0] === '0') {
    cleaned = cleaned.replace(/^0+/, '');
  }


  if (cleaned === '') {
    return '';
  }

  return cleaned;
};

const Form3 = ({ formData, setFormData, benefits, step, setStep }: FormType) => {
  const [selectedBenefits, setSelectedBenefits] = useState<number[]>(
    formData.benefits || [],
  );
  const [loader, setLoader] = useState<boolean>(false);
  const [showAllBenefits, setShowAllBenefits] = useState(false);

  useEffect(() => {
    setFormData({ ...formData, job_rate: "annual" })

  }, []);

  const toggleBenefit = (id: number) => {
    let updatedBenefits: number[];

    if (selectedBenefits.includes(id)) {
      updatedBenefits = selectedBenefits.filter((b) => b !== id);
    } else {
      updatedBenefits = [...selectedBenefits, id];
    }

    setSelectedBenefits(updatedBenefits);
    setFormData({
      ...formData,
      benefits: updatedBenefits,
    });
  };

  const handleMinSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue === '') {
      setFormData({
        ...formData,
        min_salary: '',
      });
      return;
    }

    const formattedValue = formatNumber(inputValue);

    setFormData({
      ...formData,
      min_salary: formattedValue,
    });
  };

  const handleMaxSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue === '') {
      setFormData({
        ...formData,
        max_salary: '',
      });
      return;
    }

    const formattedValue = formatNumber(inputValue);

    setFormData({
      ...formData,
      max_salary: formattedValue,
    });
  };

  const handleSave = async () => {
    // Validation before API call
    const validationErrors: string[] = [];
    if (!formData.job_title_id) validationErrors.push("Job title is required");
    if (!formData.job_location)
      validationErrors.push("Job location type is required");
    if (!formData.street_address)
      validationErrors.push("Street address is required");
    if (!formData.job_type) validationErrors.push("Job type is required");
    if (!formData.benefits || formData.benefits.length === 0)
      validationErrors.push("At least one benefit is required");
    if (!formData.job_pay_type)
      validationErrors.push("Show pay by is required");
    if (!formData.min_salary)
      validationErrors.push("Minimum salary is required");
    if (!formData.max_salary)
      validationErrors.push("Maximum salary is required");
    if (!formData.job_post_date)
      validationErrors.push("Post date is required");
    if (!formData.job_post_deadline)
      validationErrors.push("End date is required");
    if (
      formData.min_salary &&
      formData.max_salary &&
      Number(formData.max_salary) <= Number(formData.min_salary)
    ) {
      validationErrors.push("Maximum salary must be greater than minimum salary");
    }


    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      return;
    }

    if (
      formData.min_salary &&
      formData.max_salary &&
      Number(formData.max_salary) <= Number(formData.min_salary)
    ) {
      toast.error("Maximum salary must be greater than minimum salary");
      return;
    }
    
    setLoader(true);

    try {
      // payload
      setLoader(true);
      const payload = {
        job_title_id: formData.job_title_id,
        job_location_type: formData.job_location,
        job_location: formData.street_address,
        job_type_id: formData.job_type,
        benefits_ids: formData.benefits,
        show_pay_by: formData.job_pay_type,
        minimum: formData.min_salary,
        maximum: formData.max_salary,
        rate: "annual",
        status: "in_review",
        post_date: formData.job_post_date,
        end_date: formData.job_post_deadline,
      };

      // call the api
      const res = await clientApi.post("api/employer/role/", payload);
      // updating the form data
      const apiData = res.data?.data;

      setFormData({
        ...formData,

        id: apiData.id,

        // Job title
        job_title_id: apiData.job_title?.id,
        job_title: apiData.job_title,

        // Location
        job_location_type: apiData.job_location_type,
        job_location: apiData.job_location,
        country: apiData.country,

        // Job type
        job_type: apiData.job_type?.id,
        job_type_details: apiData.job_type,

        // Dates
        job_post_date: apiData.post_date,
        job_post_deadline: apiData.end_date,

        // Pay
        job_pay_type: apiData.show_pay_by,
        min_salary: apiData.minimum,
        max_salary: apiData.maximum,
        job_rate: apiData.rate,

        // Benefits
        benefits: apiData.benefits?.map((b: any) => b.id),
        benefit_details: apiData.benefits,

        // Content
        job_description: apiData.job_description,

        // Hiring meta
        company: apiData.company,
        number_of_openings: apiData.number_of_openings,
        expected_hours_per_week: apiData.expected_hours_per_week,
        customized_pre_screening: apiData.customized_pre_screening,
        recruitment_timeline: apiData.recruitment_timeline,

        // Status & meta
        status: apiData.status,
        language: apiData.language,
        employer_email: apiData.employer_email,

        // Stats
        shortlisted: apiData.shortlisted,
        applied: apiData.applied,

        // Timestamps
        created_at: apiData.created_at,
        updated_at: apiData.updated_at,
      });

      console.log("form data: ", formData);
      toast.success("Job posted successfully!");
      console.log(res);
      setStep(step + 1);
    } catch (error: any) {
      console.log(error);

      if (error?.response?.data) {
        const errorData = error.response.data;
        if (errorData.detail) {
          if (
            errorData.detail ===
            "Authentication credentials were not provided."
          ) {
            toast.error("Please login to continue");
          } else {
            toast.error(errorData.detail);
          }
          return;
        }
        const fieldErrors = Object.keys(errorData);
        if (fieldErrors.length > 0) {
          const firstField = fieldErrors[0];
          const firstError = errorData[firstField];
          const fieldName = firstField
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
          const errorMessage = Array.isArray(firstError)
            ? firstError[0]
            : firstError;
          toast.error(`${fieldName}: ${errorMessage}`);
          return;
        }
      }
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoader(false);
    }
  };

  const displayedBenefits = showAllBenefits ? benefits : benefits.slice(0, 20);

  if (loader) {
    return <ShimmerLoader />
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-[#111111] text-[18px] md:text-[20px] font-semibold">
          Add Pay and Benefits
        </h1>
      </div>

      <div className="flex flex-col gap-6">
        {/* Job Type Section */}
        <div className="flex flex-col gap-2">
          <label className="text-[15px] md:text-[16px] font-medium text-[#111111]">
            Job type
          </label>
          <p className="text-[13px] md:text-sm text-gray-600">
            Review the pay we estimated for your job and adjust it as needed.
            Check your local minimum wage.
          </p>
        </div>

        {/* Pay Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-[15px] md:text-[16px] font-medium text-[#111111]">
              Show pay by
            </label>
            <select
              value={formData.job_pay_type || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  job_pay_type: e.target.value,
                })
              }
              className="flex-1 h-12.5 py-3.5 px-4 rounded-[9px] border border-[#D0D5DD] shadow-sm shadow-[#1018280D] text-[14px] md:text-[15px] text-[#667085] focus:outline-none focus:ring-2 focus:ring-[#0852C9]"
            >
              <option value="">Select pay type</option>
              <option value="range">Range</option>
              <option value="exact_amount">Exact amount</option>
              <option value="starting_amount">Starting amount</option>
              <option value="maximum_amount">Maximum amount</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[15px] md:text-[16px] font-medium text-[#111111]">
              Minimum
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                £
              </span>
              <input
                type="text"
                value={formData.min_salary || ""}
                onChange={handleMinSalaryChange}
                placeholder="0"
                className="pl-7 pr-3 w-full h-12.5 py-3.5 px-4 rounded-[9px] border border-[#D0D5DD] shadow-sm shadow-[#1018280D] text-[14px] md:text-[15px] text-[#667085] focus:outline-none focus:ring-2 focus:ring-[#0852C9]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[15px] md:text-[16px] font-medium text-[#111111]">
              Maximum
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                £
              </span>
              <input
                type="text"
                value={formData.max_salary || ""}
                onChange={handleMaxSalaryChange}
                placeholder="0"
                className="pl-7 pr-3 w-full h-12.5 py-3.5 px-4 rounded-[9px] border border-[#D0D5DD] shadow-sm shadow-[#1018280D] text-[14px] md:text-[15px] text-[#667085] focus:outline-none focus:ring-2 focus:ring-[#0852C9]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[15px] md:text-[16px] font-medium text-[#111111]">
              Rate
            </label>
            <input
              type="text"
              className="flex-1 h-12.5 py-3.5 px-4 rounded-[9px] border border-[#D0D5DD] shadow-sm shadow-[#1018280D] text-[14px] md:text-[15px] text-[#667085] focus:outline-none focus:ring-2 focus:ring-[#0852C9]"
              value={"Annual"}
              readOnly
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-[15px] md:text-[16px] font-medium text-[#111111]">
            Benefits
          </label>
          <div
            className={`flex flex-wrap gap-2 ${
              showAllBenefits
                ? "max-h-[400px] overflow-y-auto border border-gray-200 rounded-lg p-4"
                : ""
            }`}
          >
            {displayedBenefits.map((benefit) => (
              <button
                key={benefit.id}
                onClick={() => {
                  if (benefit.id !== 1) {
                    toggleBenefit(benefit.id);
                  }
                }}
                className={`px-3 md:px-4 py-2 rounded-full text-[13px] md:text-[14px] font-light transition ${
                  selectedBenefits.includes(benefit.id)
                    ? "bg-[#0852C9] text-[#FFFFFF]"
                    : "bg-[#EBEEF2] text-[#201E1E] hover:bg-blue-200"
                }`}
              >
                + {benefit.name}
              </button>
            ))}
          </div>

          {!showAllBenefits && benefits.length > 20 && (
            <button
              onClick={() => setShowAllBenefits(true)}
              className="mt-2 text-[#0852C9] text-[14px] font-medium hover:underline self-start"
            >
              Read More ({benefits.length - 20} more benefits)
            </button>
          )}

          {showAllBenefits && (
            <button
              onClick={() => setShowAllBenefits(false)}
              className="mt-2 text-[#0852C9] text-[14px] font-medium hover:underline self-start"
            >
              Show Less
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-gray-300 mt-8 pt-6 flex flex-col sm:flex-row justify-between gap-[15px]">
        <button
          onClick={() => setStep(step - 1)}
          className="px-6 md:px-9 h-13 w-full sm:w-1/2 md:w-70 xl:w-90 rounded-[9px] border border-[#0852C9] text-[#0852C9] font-semibold hover:bg-blue-50 transition"
        >
          Back
        </button>
        <button
          onClick={() => {
            handleSave();
          }}
          className="px-6 md:px-9 h-13 w-full sm:w-1/2 md:w-70 xl:w-90 rounded-[9px] bg-[#0852C9] text-[15px] md:text-[16px] text-[#FFFFFF] font-semibold hover:bg-[#0852C9]/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Form3;