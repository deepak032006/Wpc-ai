"use client";

import React, { useState, useEffect } from "react";
import { JobRoleType } from "../dashboard/post-role/page";

type FormType = {
  formData: JobRoleType;
  setFormData: (val: JobRoleType) => void;
  step: number;
  jobTypes: JobType[];
  setStep: (val: number) => void;
};

type JobType = {
  id: number;
  name: string;
};

const Form2 = ({ formData, setFormData, step, setStep, jobTypes }: FormType) => {
  const [selectedJobType, setSelectedJobType] = useState<number | null>(
    formData.job_type || null
  );
  const [loader, setLoader] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (jobTypes && jobTypes.length > 0) {
      setLoader(false);
    } else {
      setLoader(true);
    }
  }, [jobTypes]);

  const toggleJobType = (id: number) => {
    setSelectedJobType(id);
    setFormData({
      ...formData,
      job_type: id,
    });
  };

  const handleContinue = () => {
    if (!selectedJobType) {
      alert("Please select a job type");
      return;
    }
    setStep(step + 1);
  };

  const displayedJobTypes = showAll ? jobTypes : jobTypes.slice(0, 20);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-[#111111] text-[18px] md:text-[20px] font-semibold">
          Add Job Details
        </h1>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <label className="text-[15px] md:text-[16px] font-medium text-[#111111]">
            Job type
          </label>
          {loader ? (
            <div className="w-full flex items-center justify-center gap-2 text-gray-500 text-sm py-8">
              <span className="animate-spin h-9 w-9 border-3 border-[#0852C9] border-t-transparent rounded-full"></span>
            </div>
          ) : (
            <>
              <div
                className={`flex flex-wrap gap-2 ${
                  showAll
                    ? "max-h-[400px] overflow-y-auto border border-gray-200 rounded-lg p-4"
                    : ""
                }`}
              >
                {displayedJobTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => toggleJobType(type.id)}
                    className={`px-3 md:px-4 py-2 rounded-full text-[13px] md:text-[14px] font-light transition ${
                      selectedJobType === type.id
                        ? "bg-[#0852C9] text-[#FFFFFF]"
                        : "bg-[#EBEEF2] text-[#201E1E] hover:bg-blue-200"
                    }`}
                  >
                    + {type.name}
                  </button>
                ))}
              </div>

              {!showAll && jobTypes.length > 20 && (
                <button
                  onClick={() => setShowAll(true)}
                  className="mt-2 text-[#0852C9] text-[14px] font-medium hover:underline self-start"
                >
                  Read More ({jobTypes.length - 20} more job types)
                </button>
              )}

              {showAll && (
                <button
                  onClick={() => setShowAll(false)}
                  className="mt-2 text-[#0852C9] text-[14px] font-medium hover:underline self-start"
                >
                  Show Less
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="border-t border-gray-300 mt-8 pt-6 flex flex-col sm:flex-row justify-between gap-[15px]">
        <button
          onClick={() => setStep(step - 1)}
          className="px-6 md:px-9 h-13 w-full sm:w-1/2 lg:w-70 xl:w-90 rounded-[9px] border border-[#0852C9] text-[#0852C9] font-semibold hover:bg-blue-50 transition"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="px-6 md:px-9 h-13 w-full sm:w-1/2 lg:w-70 xl:w-90 rounded-[9px] bg-[#0852C9] text-[15px] md:text-[16px] text-[#FFFFFF] font-semibold hover:bg-[#0852C9]/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedJobType}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Form2;