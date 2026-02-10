"use client";

import React, { useState } from "react";
import { JobRoleType } from "../dashboard/post-role/page";
import toast from "react-hot-toast";
import clientApi from "@/lib/axios";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

type FormType = {
  formData: JobRoleType;
  setFormData: (val: JobRoleType) => void;
  step: number;
  setStep: (val: number) => void;
};

const PreviewSubmitPage = ({ formData, setFormData, step, setStep }: FormType) => {
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        status: "open",
      };

      const res = await clientApi.patch(
        `/api/employer/role/${formData.id}/`,
        payload
      );

      if (res.data) {
        toast.success("Job Posted Successfully");
        console.log(res);
        router.push("/employer/dashboard");
      } else {
        toast.error("Something went Wrong");
        console.log(res);
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };

  return (
    <div className="w-full mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 pb-4 border-b border-gray-300">
        <div className="flex items-start justify-start gap-3 w-full sm:w-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-25 md:h-25 rounded-lg flex items-center justify-center flex-shrink-0">
            <img className="w-full h-full object-contain" src={"/PostJOb.png"} alt="Job Post" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Job Post Preview
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              The live post people view may look slightly different.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setStep(step - 1);
          }}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0 self-start sm:self-center"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="bg-white">
        <section className="mb-6">
          <h3 className="text-[15px] sm:text-base font-semibold text-gray-900 mb-2">
            Job Description
          </h3>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            {/* Editor Toolbar - Disabled State */}
            <div className="bg-gray-50 border-b border-gray-300 px-3 py-2">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Formatting Buttons - Disabled */}
                <button
                  disabled
                  className="p-1.5 bg-gray-100 rounded opacity-50 cursor-not-allowed"
                  title="Bold (disabled)"
                  type="button"
                >
                  <span className="font-bold text-sm">B</span>
                </button>
                <button
                  disabled
                  className="p-1.5 bg-gray-100 rounded opacity-50 cursor-not-allowed"
                  title="Italic (disabled)"
                  type="button"
                >
                  <span className="italic text-sm">I</span>
                </button>
                <div className="w-px h-5 bg-gray-300 mx-1"></div>
                <button
                  disabled
                  className="p-1.5 bg-gray-100 rounded opacity-50 cursor-not-allowed"
                  title="Bullet List (disabled)"
                  type="button"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <button
                  disabled
                  className="p-1.5 bg-gray-100 rounded opacity-50 cursor-not-allowed"
                  title="Numbered List (disabled)"
                  type="button"
                >
                  <span className="text-sm font-semibold">#</span>
                </button>
                <button
                  disabled
                  className="p-1.5 bg-gray-100 rounded opacity-50 cursor-not-allowed"
                  title="Heading (disabled)"
                  type="button"
                >
                  <span className="font-bold text-sm">H</span>
                </button>

                <div className="w-px h-5 bg-gray-300 mx-1"></div>

                {/* Edit/Preview Toggle Button */}
                {/* <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`px-3 py-1 text-xs rounded transition ${
                    showPreview
                      ? "bg-[#0852C9] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  type="button"
                >
                  {showPreview ? "Edit" : "Preview"}
                </button> */}

                {/* Help Button */}
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="p-1.5 hover:bg-gray-200 rounded transition"
                  title="Formatting Help"
                  type="button"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Help Panel */}
              {showHelp && (
                <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <strong>Headings:</strong> ## Heading
                    </div>
                    <div>
                      <strong>Bold:</strong> **text**
                    </div>
                    <div>
                      <strong>Italic:</strong> *text*
                    </div>
                    <div>
                      <strong>Bullet List:</strong> - item
                    </div>
                    <div>
                      <strong>Numbered List:</strong> 1. item
                    </div>
                    <div>
                      <strong>Link:</strong> [text](url)
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Content Area - Toggle between Preview and Edit (Read-only) */}
            {showPreview ? (
              <div className="p-4 min-h-[300px] max-h-[500px] overflow-y-auto bg-white">
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1
                        className="text-2xl font-bold mt-4 mb-2 text-gray-900"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-xl font-bold mt-3 mb-2 text-gray-900"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-lg font-semibold mt-2 mb-1 text-gray-900"
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p
                        className="text-sm text-gray-700 leading-relaxed mb-3"
                        {...props}
                      />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="list-disc pl-5 space-y-1 mb-3"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="list-decimal pl-5 space-y-1 mb-3"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="text-sm text-gray-700" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong
                        className="font-semibold text-gray-900"
                        {...props}
                      />
                    ),
                    em: ({ node, ...props }) => (
                      <em className="italic" {...props} />
                    ),
                  }}
                >
                  {formData.job_description || "*No job description available.*"}
                </ReactMarkdown>
              </div>
            ) : (
              <textarea
                id="markdown-editor"
                value={formData.job_description || ""}
                readOnly
                className="w-full min-h-[300px] max-h-[500px] p-4 text-sm text-gray-700 focus:outline-none resize-none font-mono overflow-y-auto bg-gray-50 cursor-not-allowed"
                placeholder="No job description available."
              />
            )}
          </div>
        </section>

     

        <section className="mb-6">
          <h3 className="text-[15px] sm:text-base font-semibold text-gray-900 mb-2">
            Pay
          </h3>
          <p className="text-[13px] sm:text-sm text-gray-700">
            £{formData.min_salary} - £{formData.max_salary} per year
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-[15px] sm:text-base font-semibold text-gray-900 mb-2">
            Benefits
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            {formData.benefit_details && formData.benefit_details.length > 0 ? (
              formData.benefit_details.map((benefit: any) => (
                <li key={benefit.id} className="text-[13px] sm:text-sm text-gray-700">
                  {benefit.name}
                </li>
              ))
            ) : (
              <li className="text-[13px] sm:text-sm text-gray-700">No benefits specified</li>
            )}
          </ul>
        </section>

        <section className="mb-8">
          <h3 className="text-[15px] sm:text-base font-semibold text-gray-900 mb-2">
            Work Location
          </h3>
          <p className="text-[13px] sm:text-sm text-gray-700">
            {formData.job_location_type === "on_site" && "In person"}
            {formData.job_location_type === "remote" && "Remote"}
            {formData.job_location_type === "hybrid" && "Hybrid"}
          </p>
          {formData.street_address && (
            <p className="text-[13px] sm:text-sm text-gray-600 mt-1">
              {formData.street_address}
            </p>
          )}
        </section>
      </div>

      <div className="border-t border-gray-300 pt-6 flex flex-col sm:flex-row justify-end gap-3">
        <button
          onClick={() => setStep(step - 1)}
          className="px-6 sm:px-9 h-13 w-full sm:w-auto md:w-70 xl:w-90 rounded-[9px] border border-[#0852C9] text-[#0852C9] text-[15px] sm:text-[16px] font-semibold hover:bg-blue-50 transition"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 sm:px-9 h-13 w-full sm:w-auto md:w-70 xl:w-90 rounded-[9px] bg-[#0852C9] text-[15px] sm:text-[16px] text-[#FFFFFF] font-semibold hover:bg-[#0852C9]/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Publish
        </button>
      </div>
    </div>
  );
};

export default PreviewSubmitPage;