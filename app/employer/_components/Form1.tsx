"use client";

import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { JobRoleType } from "../dashboard/post-role/page";
import toast from "react-hot-toast";
import clientApi from "@/lib/axios";

type FormType = {
  formData: JobRoleType;
  setFormData: (val: JobRoleType) => void;
  step: number;
  setStep: (val: number) => void;
};

type JobTitle = {
  id: number;
  name: string;
};

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = {
  lat: 51.5074,
  lng: -0.1278,
};

const Form1 = ({ formData, setFormData, step, setStep }: FormType) => {
  const [showMap, setShowMap] = useState(false);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [jobTitleInput, setJobTitleInput] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredTitles, setFilteredTitles] = useState<JobTitle[]>([]);
  const [selectedTitleId, setSelectedTitleId] = useState<number | null>(null);
  const [isCreatingTitle, setIsCreatingTitle] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load job titles on component mount
  useEffect(() => {
    loadJobTitles();
  }, []);

  // Initialize job title input from formData if it exists
  useEffect(() => {
    if (formData.job_title?.name) {
      setJobTitleInput(formData.job_title.name);
      setSelectedTitleId(formData.job_title.id);
    }
  }, [formData.job_title]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadJobTitles = async () => {
    try {
      const res = await clientApi.get(`api/employer/job/titles/`);
      if (res.status === 200 || res.status === 201) {
        setJobTitles(res.data);
      } else {
        toast.error("Failed to load titles");
      }
    } catch (error) {
      toast.error("Failed to load titles");
    }
  };

  const createCustomTitle = async (titleName: string) => {
    try {
      setIsCreatingTitle(true);
      const res = await clientApi.post(`api/employer/job/titles/`, {
        name: titleName,
      });
      if (res.status === 200 || res.status === 201) {
        const newTitle = res.data;
        setJobTitles([...jobTitles, newTitle]);
        setFormData({
          ...formData,
          job_title_id: newTitle.id,
          job_title: { id: newTitle.id, name: newTitle.name }
        });
        setSelectedTitleId(newTitle.id);
        toast.success("Title created successfully");
        return true;
      } else {
        toast.error("Failed to create title");
        return false;
      }
    } catch (error) {
      toast.error("Failed to create title");
      return false;
    } finally {
      setIsCreatingTitle(false);
    }
  };

  const handleJobTitleInput = (value: string) => {
    setJobTitleInput(value);

    if (value.trim() === "") {
      setFilteredTitles(jobTitles);
      setSelectedTitleId(null);
      return;
    }

    const filtered = jobTitles.filter((title) =>
      title.name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredTitles(filtered);

    const exactMatch = jobTitles.find(
      (title) => title.name.toLowerCase() === value.toLowerCase()
    );

    if (exactMatch) {
      setSelectedTitleId(exactMatch.id);
      setFormData({
        ...formData,
        job_title_id: exactMatch.id,
        job_title: { id: exactMatch.id, name: exactMatch.name }
      });
    } else {
      setSelectedTitleId(null);
    }
  };

  const handleSuggestionClick = (title: JobTitle) => {
    setJobTitleInput(title.name);
    setSelectedTitleId(title.id);
    setFormData({
      ...formData,
      job_title_id: title.id,
      job_title: { id: title.id, name: title.name }
    });
    setShowSuggestions(false);
  };

  const handleLocationTypeChange = (value: string) => {
    setFormData({
      ...formData,
      job_location: value,
    });
  };



  const handleContinue = async () => {
    if (!jobTitleInput.trim()) {
      toast.error("Please enter a job title");
      return;
    }

    if (!selectedTitleId) {
      // const success = await createCustomTitle(jobTitleInput.trim());
      return toast.error("Please Enter the Titles from Given Titles");
      //   {
      //     if (!formData.job_location || formData.job_location === "") {
      //   toast.error("Please select a job location type");
      //   return;
      // }

      // if (!formData.street_address || formData.street_address.trim() === "") {
      //   toast.error("Please enter a street address or postcode");
      //   return;
      // }

      // if (!formData.job_post_date || formData.job_post_date === "") {
      //   toast.error("Please select a job post date");
      //   return;
      // }

      // if (!formData.job_post_deadline || formData.job_post_deadline === "") {
      //   toast.error("Please select an ending date (deadline)");
      //   return;
      // }

      // if (formData.job_post_date && formData.job_post_deadline) {
      //   const postDate = new Date(formData.job_post_date);
      //   const deadlineDate = new Date(formData.job_post_deadline);

      //   if (deadlineDate <= postDate) {
      //     toast.error("Ending date must be after the job post date");
      //     return;
      //   }
      // }
      //   }
    } else {
      if (!formData.job_title_id || !formData.job_title) {
        toast.error("Please select or create a job title");
        return;
      }
      if (!formData.job_location || formData.job_location === "") {
        toast.error("Please select a job location type");
        return;
      }

      if (!formData.street_address || formData.street_address.trim() === "") {
        toast.error("Please enter a street address or postcode");
        return;
      }

      if (!formData.job_post_date || formData.job_post_date === "") {
        toast.error("Please select a job post date");
        return;
      }

      if (!formData.job_post_deadline || formData.job_post_deadline === "") {
        toast.error("Please select an ending date (deadline)");
        return;
      }

      if (formData.job_post_date && formData.job_post_deadline) {
        const postDate = new Date(formData.job_post_date);
        const deadlineDate = new Date(formData.job_post_deadline);

        if (deadlineDate <= postDate) {
          toast.error("Ending date must be after the job post date");
          return;
        }
      }
    }



    setStep(step + 1);
  };

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
  });

  return (
    <div className="w-full">
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-[#111111] text-[20px] font-semibold">
          Add Job Basics
        </h1>
        <p className="text-[#4D4D4D] text-[15px]">
          This job will be in{" "}
          <span className="text-[#1F1E1E] font-semibold">UK</span>
        </p>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1 relative" ref={suggestionsRef}>
          <label className="text-[16px] font-medium text-[#111111]">
            Job Title
          </label>
          <input
            type="text"
            placeholder="Type to search job titles..."
            value={jobTitleInput}
            onChange={(e) => handleJobTitleInput(e.target.value)}
            onFocus={() => {
              if (jobTitleInput.trim() === "") {
                setFilteredTitles(jobTitles);
              }
              setShowSuggestions(true);
            }}
            className="flex-1 h-12.5 py-3.5 px-4 rounded-[9px] border border-[#D0D5DD] shadow-sm shadow-[#1018280D] text-[15px] text-[#667085] focus:outline-none focus:ring-2 focus:ring-[#0852C9]"
          />

          {showSuggestions && (filteredTitles.length > 0 || (jobTitleInput.trim() === "" && jobTitles.length > 0)) && (
            <div className="absolute top-full left-0 right-0 bg-white border border-[#D0D5DD] rounded-[4px] shadow-lg max-h-60 overflow-y-auto z-10 mt-0.5">
              {(filteredTitles.length > 0 ? filteredTitles : jobTitles).map((title) => (
                <div
                  key={title.id}
                  onClick={() => handleSuggestionClick(title)}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-[15px] text-[#111111] border-b border-gray-100 last:border-b-0"
                >
                  {title.name}
                </div>
              ))}
            </div>
          )}

          {/* {jobTitleInput.trim() && !selectedTitleId && (
            <p className="text-[13px] text-[#0852C9] ">
              Custom title {"'" + `${jobTitleInput}` + "'"} will be created
            </p>
          )} */}
          {jobTitleInput.trim() && !selectedTitleId && (
            <p className="text-[13px] text-[#0852C9] ">
              Please select Title from given Titles
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[16px] font-medium text-[#111111]">
            Job Location Type
          </label>
          <select
            value={formData.job_location || ""}
            onChange={(e) => handleLocationTypeChange(e.target.value)}
            className="flex-1 h-12.5 py-3.5 px-4 rounded-[9px] border border-[#D0D5DD] shadow-sm shadow-[#1018280D] text-[15px] text-[#667085] focus:outline-none focus:ring-2 focus:ring-[#0852C9]"
          >
            <option value="">Job location types</option>
            <option value="On-site">On-site</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[16px] font-medium text-[#111111]">
            What Is The Job Location?
          </label>
          <input
            type="text"
            placeholder="Enter a street address or postcode"
            value={formData.street_address || ""}
            onChange={(e) => {
              setFormData({
                ...formData,
                street_address: e.target.value,
              });
              setShowMap(e.target.value.length > 3);
            }}
            className="flex-1 h-12.5 py-3.5 px-4 rounded-[9px] border border-[#D0D5DD] shadow-sm shadow-[#1018280D] text-[15px] text-[#667085] focus:outline-none focus:ring-2 focus:ring-[#0852C9]"
          />
        </div>

        {isLoaded && (
          <div className="w-full mt-4 rounded-md overflow-hidden border">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={defaultCenter}
              zoom={14}
            >
              <Marker position={defaultCenter} />
            </GoogleMap>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[16px] font-medium text-[#111111]">
              Job post date
            </label>
            <input
              type="date"
              min={getMinDate()}
              value={formData.job_post_date || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  job_post_date: e.target.value,
                })
              }
              className="flex-1 h-12.5 py-3.5 px-4 rounded-[9px] border border-[#D0D5DD] shadow-sm shadow-[#1018280D] text-[15px] text-[#667085] focus:outline-none focus:ring-2 focus:ring-[#0852C9]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[16px] font-medium text-[#111111]">
              Ending date (deadline)
            </label>
            <input
              type="date"
              min={getMinDate()}
              value={formData.job_post_deadline || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  job_post_deadline: e.target.value,
                })
              }
              className="flex-1 h-12.5 py-3.5 px-4 rounded-[9px] border border-[#D0D5DD] shadow-sm shadow-[#1018280D] text-[15px] text-[#667085] focus:outline-none focus:ring-2 focus:ring-[#0852C9]"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 mt-8 pt-6 flex justify-end">
        <button
          onClick={handleContinue}
          disabled={isCreatingTitle}
          className="px-9 h-13 w-1/2 md:w-70 xl:w-90 rounded-[9px] bg-[#0852C9] text-[16px] text-[#FFFFFF] font-semibold hover:bg-[#0852C9]/90 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isCreatingTitle ? "Creating title..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default Form1;