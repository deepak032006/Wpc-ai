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


// "use client";

// import React, { useState, useEffect } from "react";
// import { JobRoleType } from "../dashboard/post-role/page";

// type FormType = {
//   formData: JobRoleType;
//   setFormData: (val: JobRoleType) => void;
//   step: number;
//   jobTypes: JobType[];
//   setStep: (val: number) => void;
// };

// type JobType = {
//   id: number;
//   name: string;
// };

// const Form2 = ({ formData, setFormData, step, setStep, jobTypes }: FormType) => {
//   const [selectedJobTypes, setSelectedJobTypes] = useState<number[]>(
//     formData.job_type ? (Array.isArray(formData.job_type) ? formData.job_type : [formData.job_type]) : []
//   );
//   const [loader, setLoader] = useState(false);
//   const [showAll, setShowAll] = useState(false);

//   useEffect(() => {
//     if (jobTypes && jobTypes.length > 0) {
//       setLoader(false);
//     } else {
//       setLoader(true);
//     }
//   }, [jobTypes]);

//   // Define mutually exclusive groups and compatibility rules
//   const capacityTypes = ["Full-time", "Part-time"];
//   const statusTypes = ["Permanent", "Temporary", "Fixed term", "Temp to Perm"];
//   const specialPrograms = ["Internship", "Apprenticeship", "Graduate"];

//   // Compatibility mapping based on the table
//   const compatibilityRules: Record<string, string[]> = {
//     "Full-time": ["Permanent", "Temporary", "Fixed term", "Temp to Perm"],
//     "Part-time": ["Permanent", "Temporary", "Fixed term", "Volunteer"],
//     "Freelance": ["Temporary", "Fixed term"],
//     "Internship": ["Temporary", "Fixed term"],
//     "Graduate": ["Permanent", "Full-time"],
//     "Permanent": ["Full-time", "Part-time", "Graduate"],
//     "Temporary": ["Full-time", "Part-time", "Freelance", "Internship"],
//     "Fixed term": ["Full-time", "Part-time", "Freelance", "Internship"],
//     "Temp to Perm": ["Full-time"],
//     "Volunteer": ["Part-time"],
//   };

//   const getTypeNameById = (id: number): string => {
//     return jobTypes.find(t => t.id === id)?.name || "";
//   };

//   const getTypeIdByName = (name: string): number | undefined => {
//     return jobTypes.find(t => t.name === name)?.id;
//   };

//   const toggleJobType = (id: number) => {
//     const clickedTypeName = getTypeNameById(id);
    
//     setSelectedJobTypes(prev => {
//       let updated = [...prev];

//       // If already selected, just deselect it
//       if (updated.includes(id)) {
//         updated = updated.filter(typeId => typeId !== id);
//       } else {
//         // Rule A: Capacity types are mutually exclusive (Full-time vs Part-time)
//         if (capacityTypes.includes(clickedTypeName)) {
//           capacityTypes.forEach(capacityType => {
//             const capacityId = getTypeIdByName(capacityType);
//             if (capacityId && capacityType !== clickedTypeName && updated.includes(capacityId)) {
//               updated = updated.filter(typeId => typeId !== capacityId);
//             }
//           });
//         }

//         // Rule B: Status types are mutually exclusive for Permanent vs (Temporary/Fixed term)
//         if (clickedTypeName === "Permanent") {
//           ["Temporary", "Fixed term"].forEach(statusType => {
//             const statusId = getTypeIdByName(statusType);
//             if (statusId && updated.includes(statusId)) {
//               updated = updated.filter(typeId => typeId !== statusId);
//             }
//           });
//         } else if (["Temporary", "Fixed term"].includes(clickedTypeName)) {
//           const permanentId = getTypeIdByName("Permanent");
//           if (permanentId && updated.includes(permanentId)) {
//             updated = updated.filter(typeId => typeId !== permanentId);
//           }
//         }

//         // Add the newly clicked type
//         updated.push(id);
//       }

//       // Update form data
//       setFormData({
//         ...formData,
//         job_type: updated.length === 1 ? updated[0] : updated,
//       });

//       return updated;
//     });
//   };

//   const isTypeDisabled = (typeId: number, typeName: string): boolean => {
//     // Don't disable if already selected
//     if (selectedJobTypes.includes(typeId)) return false;

//     const selectedNames = selectedJobTypes
//       .map(id => getTypeNameById(id))
//       .filter(Boolean);

//     if (selectedNames.length === 0) return false;

//     // Rule C: Special Programs - If Internship or Apprenticeship is selected, disable Freelance
//     if (typeName === "Freelance") {
//       if (selectedNames.includes("Internship") || selectedNames.includes("Apprenticeship")) {
//         return true;
//       }
//     }

//     // Check compatibility - type must be compatible with ALL currently selected types
//     for (const selectedName of selectedNames) {
//       const allowedPairs = compatibilityRules[selectedName] || [];
//       if (!allowedPairs.includes(typeName)) {
//         return true;
//       }
//     }

//     return false;
//   };

//   const handleContinue = () => {
//     if (selectedJobTypes.length === 0) {
//       alert("Please select at least one job type");
//       return;
//     }
//     setStep(step + 1);
//   };

//   const displayedJobTypes = showAll ? jobTypes : jobTypes.slice(0, 20);

//   return (
//     <div className="w-full">
//       <div className="flex flex-col gap-1 mb-6">
//         <h1 className="text-[#111111] text-[18px] md:text-[20px] font-semibold">
//           Add Job Details
//         </h1>
//       </div>

//       <div className="flex flex-col gap-5">
//         <div className="flex flex-col gap-3">
//           <label className="text-[15px] md:text-[16px] font-medium text-[#111111]">
//             Job type
//           </label>
//           {loader ? (
//             <div className="w-full flex items-center justify-center gap-2 text-gray-500 text-sm py-8">
//               <span className="animate-spin h-9 w-9 border-3 border-[#0852C9] border-t-transparent rounded-full"></span>
//             </div>
//           ) : (
//             <>
//               <div
//                 className={`flex flex-wrap gap-2 ${
//                   showAll
//                     ? "max-h-[400px] overflow-y-auto border border-gray-200 rounded-lg p-4"
//                     : ""
//                 }`}
//               >
//                 {displayedJobTypes.map((type) => {
//                   const isDisabled = isTypeDisabled(type.id, type.name);
//                   const isSelected = selectedJobTypes.includes(type.id);

//                   return (
//                     <button
//                       key={type.id}
//                       onClick={() => !isDisabled && toggleJobType(type.id)}
//                       disabled={isDisabled}
//                       className={`px-3 md:px-4 py-2 rounded-full text-[13px] md:text-[14px] font-light transition ${
//                         isSelected
//                           ? "bg-[#0852C9] text-[#FFFFFF]"
//                           : isDisabled
//                           ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
//                           : "bg-[#EBEEF2] text-[#201E1E] hover:bg-blue-200"
//                       }`}
//                     >
//                       + {type.name}
//                     </button>
//                   );
//                 })}
//               </div>

//               {!showAll && jobTypes.length > 20 && (
//                 <button
//                   onClick={() => setShowAll(true)}
//                   className="mt-2 text-[#0852C9] text-[14px] font-medium hover:underline self-start"
//                 >
//                   Read More ({jobTypes.length - 20} more job types)
//                 </button>
//               )}

//               {showAll && (
//                 <button
//                   onClick={() => setShowAll(false)}
//                   className="mt-2 text-[#0852C9] text-[14px] font-medium hover:underline self-start"
//                 >
//                   Show Less
//                 </button>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       <div className="border-t border-gray-300 mt-8 pt-6 flex flex-col sm:flex-row justify-between gap-[15px]">
//         <button
//           onClick={() => setStep(step - 1)}
//           className="px-6 md:px-9 h-13 w-full sm:w-1/2 lg:w-70 xl:w-90 rounded-[9px] border border-[#0852C9] text-[#0852C9] font-semibold hover:bg-blue-50 transition"
//         >
//           Back
//         </button>
//         <button
//           onClick={handleContinue}
//           className="px-6 md:px-9 h-13 w-full sm:w-1/2 lg:w-70 xl:w-90 rounded-[9px] bg-[#0852C9] text-[15px] md:text-[16px] text-[#FFFFFF] font-semibold hover:bg-[#0852C9]/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
//           disabled={selectedJobTypes.length === 0}
//         >
//           Continue
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Form2;