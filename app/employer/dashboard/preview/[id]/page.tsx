"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import clientApi from "@/lib/axios";
import PreviewShimmer from "@/components/PreviewShimmer";
import ReactMarkDown from "react-markdown";

type JobRoleType = {
  id?: number;
  job_title?: { id: number; name: string };
  job_type?: { id: number; name: string };
  job_type_details?: { id: number; name: string };
  company?: string;
  country?: string;
  language?: string;
  min_salary?: string;
  max_salary?: string;
  minimum?: string;
  maximum?: string;
  rate?: string;
  job_rate?: string;
  job_description?: string;
  job_location?: string;
  responsibilities?: string[];
  skills?: string[];
  status?: string;
};

export default function PreviewSubmitPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id;

  const [formData, setFormData] = useState<JobRoleType>({});
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (jobId) {
      loadJobData();
    }
  }, [jobId]);

  const loadJobData = async () => {
    try {
      setIsFetching(true);
      const res = await clientApi.get(`api/employer/role/${jobId}/`);
      if (res.status === 200 || res.status === 201) {
        setFormData(res.data);
        setEditedDescription(res.data.job_description || "");
      } else {
        toast.error("Failed to load job data");
      }
    } catch (error) {
      console.error("Failed to fetch job data:", error);
      toast.error("Failed to load job data");
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        job_description: editedDescription,
        status: "open",
      };

      const res = await clientApi.patch(
        `/api/employer/role/${jobId}/`,
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
      console.error("Error submitting job:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const payload = {
        ...formData,
        job_description: editedDescription,
      };

      const res = await clientApi.patch(
        `/api/employer/role/${jobId}/`,
        payload
      );

      if (res.status === 200 || res.status === 201) {
        setFormData({ ...formData, job_description: editedDescription });
        toast.success("Description updated successfully");
      } else {
        toast.error("Failed to update description");
      }
    } catch (error) {
      console.error("Error updating description:", error);
      toast.error("Failed to update description");
    }
  };

  const handleCancelEdit = () => {
    setEditedDescription(formData.job_description || "");
    setShowPreview(true);
    setShowHelp(false);
  };

  const insertMarkdown = (syntax: string) => {
    const textarea = document.getElementById(
      "markdown-editor"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editedDescription.substring(start, end);

    let newText = "";
    const beforeText = editedDescription.substring(0, start);
    const afterText = editedDescription.substring(end);

    switch (syntax) {
      case "bold":
        newText = `${beforeText}**${selectedText || "bold text"}**${afterText}`;
        break;
      case "italic":
        newText = `${beforeText}*${selectedText || "italic text"}*${afterText}`;
        break;
      case "bullet":
        newText = `${beforeText}\n- ${selectedText || "list item"}${afterText}`;
        break;
      case "number":
        newText = `${beforeText}\n1. ${
          selectedText || "numbered item"
        }${afterText}`;
        break;
      case "heading":
        newText = `${beforeText}\n## ${selectedText || "Heading"}${afterText}`;
        break;
      default:
        return;
    }

    setEditedDescription(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd =
        start + newText.length - afterText.length;
    }, 0);
  };

  if (isFetching) return <PreviewShimmer />;

  return (
    <div className="w-full mx-auto max-w-4xl p-6">
      <div className="flex justify-between items-start mb-6 border-b border-gray-300 pb-4">
        <div className="flex items-center justify-start gap-3">
          <div className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0">
            <img
              className="w-full h-full object-contain"
              src={"/PostJOb.png"}
              alt="Post Job"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Job Post Preview
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              The live post people view may look slightly different.
            </p>
          </div>
        </div>
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="bg-white">
        {/* Job Description Section */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Job Description
            </h3>
          </div>

          <div className="border border-gray-300 rounded-lg overflow-hidden">
            {/* Editor Toolbar - Always Visible */}
            <div className="bg-gray-50 border-b border-gray-300 px-3 py-2">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Formatting Buttons */}
                <button
                  onClick={() => insertMarkdown("bold")}
                  className="p-1.5 hover:bg-gray-200 rounded transition"
                  title="Bold"
                  type="button"
                >
                  <span className="font-bold text-sm">B</span>
                </button>
                <button
                  onClick={() => insertMarkdown("italic")}
                  className="p-1.5 hover:bg-gray-200 rounded transition"
                  title="Italic"
                  type="button"
                >
                  <span className="italic text-sm">I</span>
                </button>
                <div className="w-px h-5 bg-gray-300 mx-1"></div>
                <button
                  onClick={() => insertMarkdown("bullet")}
                  className="p-1.5 hover:bg-gray-200 rounded transition"
                  title="Bullet List"
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
                  onClick={() => insertMarkdown("number")}
                  className="p-1.5 hover:bg-gray-200 rounded transition"
                  title="Numbered List"
                  type="button"
                >
                  <span className="text-sm font-semibold">#</span>
                </button>
                <button
                  onClick={() => insertMarkdown("heading")}
                  className="p-1.5 hover:bg-gray-200 rounded transition"
                  title="Heading"
                  type="button"
                >
                  <span className="font-bold text-sm">H</span>
                </button>

                <div className="w-px h-5 bg-gray-300 mx-1"></div>

                {/* Edit/Preview Toggle Button */}
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`px-3 py-1 text-xs rounded transition ${
                    showPreview
                      ? "bg-[#0852C9]/90  text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  type="button"
                >
                  {showPreview ? "Edit" : "Preview"}
                </button>

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

                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="text-sm bg-[#0852C9]/90 text-white px-3 py-1 rounded hover:bg-[#0852C9]/90"
                    type="button"
                  >
                    Save
                  </button>
                </div>
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

            {/* Content Area - Toggle between Preview and Edit */}
            {showPreview ? (
              <div className="p-4 min-h-[400px] max-h-[500px] overflow-y-auto bg-white">
                <ReactMarkDown
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
                  {editedDescription || "*No content to preview*"}
                </ReactMarkDown>
              </div>
            ) : (
              <textarea
                id="markdown-editor"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full min-h-[400px] max-h-[500px] p-4 text-sm text-gray-700 focus:outline-none resize-none font-mono overflow-y-auto"
                placeholder="Enter job description in markdown format...

Example:
## Job Overview
We are seeking an experienced professional...

**Key Responsibilities**
- Responsibility 1
- Responsibility 2

**Qualifications**
- Qualification 1
- Qualification 2"
              />
            )}
          </div>
        </section>

        {/* Pay Section */}
        <section className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-2">Pay</h3>
          <p className="text-sm text-gray-700">
            {formData.minimum && formData.maximum
              ? `£${formData.minimum} - £${formData.maximum} per ${
                  formData.rate || formData.job_rate || "hour"
                }`
              : "Salary not specified"}
          </p>
        </section>

        {/* Benefits Section */}
        <section className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            Benefits
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            <li className="text-sm text-gray-700">Employee discount</li>
            <li className="text-sm text-gray-700">
              Language training provided
            </li>
            <li className="text-sm text-gray-700">On-site parking</li>
            <li className="text-sm text-gray-700">Sick pay</li>
            <li className="text-sm text-gray-700">UK visa sponsorship</li>
          </ul>
        </section>

        {/* Work Location Section */}
        <section className="mb-8">
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            Work Location
          </h3>
          <p className="text-sm text-gray-700">
            {formData.job_location || "In person"}
          </p>
        </section>
      </div>

      {/* Footer Buttons */}
      <div className="border-t border-gray-300 pt-6 flex justify-end gap-3">
        {/* <button
          onClick={() => router.push(`${formData.id}/matches`)}
          className="px-9 py-3 rounded-[9px] bg-[#0852C9] text-[16px] text-[#FFFFFF] font-semibold hover:bg-[#0852C9]/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          View Matches
        </button> */}
        <button
          onClick={handleSubmit}
          className="px-9 py-3 rounded-[9px] bg-[#0852C9]/90 text-[16px] text-[#FFFFFF] font-semibold hover:bg-[#0852C9]/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publishing..." : "Publish Job"}
        </button>
      </div>
    </div>
  );
}