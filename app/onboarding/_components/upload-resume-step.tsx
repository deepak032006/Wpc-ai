'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useOnboardingStore } from '@/app/store/onboardingStore';
import { Upload, User, Briefcase, Award, GraduationCap, Globe, ChevronDown, ChevronUp, X } from 'lucide-react';
import clientApi from '@/lib/axios';
import toast from 'react-hot-toast';

interface CVForm {
  cv_file: File | null;
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  nationality: string;
  professional_summary: string;
  skills: string[];
  current_position: string;
  soc_code: string;
  position_start_date: string;
  company_name: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  languages: string[];
  additional_info: string;
}

export default function SmartCVBuilder() {
  const { formData, updateFormData, nextStep, previousStep } = useOnboardingStore();
  const [fileName, setFileName] = useState<string>('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [isParsingCV, setIsParsingCV] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isParsed, setIsParsed] = useState(false);

  const [personalOpen, setPersonalOpen] = useState(true);
  const [professionalOpen, setProfessionalOpen] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [employmentOpen, setEmploymentOpen] = useState(false);
  const [educationOpen, setEducationOpen] = useState(false);
  const [additionalOpen, setAdditionalOpen] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm<CVForm>({
    defaultValues: {
      cv_file: formData.cv_file,
      full_name: formData.cv_parsed_data?.personal_info?.full_name || '',
      email: formData.cv_parsed_data?.personal_info?.email || '',
      phone_number: formData.cv_parsed_data?.personal_info?.phone_number || '',
      address: formData.cv_parsed_data?.personal_info?.adress || '',
      nationality: formData.cv_parsed_data?.personal_info?.nationality || '',
      professional_summary: formData.cv_parsed_data?.professional_summary || '',
      skills: formData.cv_parsed_data?.key_skills || [],
      current_position: formData.cv_parsed_data?.employment_history?.current_position || '',
      soc_code: formData.cv_parsed_data?.employment_history?.soc_code || '',
      position_start_date: formData.cv_parsed_data?.employment_history?.position_start_date || '',
      company_name: formData.cv_parsed_data?.employment_history?.company_name || '',
      institution: formData.cv_parsed_data?.education_qualification?.institute || '',
      degree: formData.cv_parsed_data?.education_qualification?.degree || '',
      field_of_study: formData.cv_parsed_data?.education_qualification?.field_of_study || '',
      start_date: formData.cv_parsed_data?.education_qualification?.start_date || '',
      end_date: formData.cv_parsed_data?.education_qualification?.end_date || '',
      languages: formData.cv_parsed_data?.additional_info?.language || [],
      additional_info: formData.cv_parsed_data?.additional_info?.info || ''
    }
  });

  const skills = watch('skills') || [];
  const languages = watch('languages') || [];

  useEffect(() => {
    if (formData.cv_file && formData.cv_parsed_data) {
      setIsParsed(true);
    }
  }, [formData]);

  const handleCVParse = async (file: File) => {
    setIsParsingCV(true);
    setParseError(null);
    setIsParsed(false);

    try {
      const cv = new FormData();
      cv.append('file', file);

      const response = await clientApi.post(
        "/api/candidate/cv/parse/",
        cv,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);

      if (!response.data) {
        setIsParsingCV(false);
        return toast.error("Error parsing the CV");
      }



      const parsedData = response.data;
      if (parsedData.personal_info) {
        setValue('full_name', parsedData.personal_info.full_name || '');
        setValue('email', parsedData.personal_info.email || '');
        setValue('phone_number', parsedData.personal_info.phone_number || '');
        setValue('address', parsedData.personal_info.adress || '');
        setValue('nationality', parsedData.personal_info.nationality || '');
      }

      if (parsedData.professional_summary) {
        setValue('professional_summary', parsedData.professional_summary);
      }

      if (parsedData.key_skills && Array.isArray(parsedData.key_skills)) {
        setValue('skills', parsedData.key_skills);
      }

      if (parsedData.employment_history) {
        setValue('current_position', parsedData.employment_history.current_position || '');
        setValue('soc_code', parsedData.employment_history.soc_code || '');
        setValue('position_start_date', parsedData.employment_history.position_start_date || '');
        setValue('company_name', parsedData.employment_history.company_name || '');
      }

      if (parsedData.education_qualification) {
        setValue('institution', parsedData.education_qualification.institute || '');
        setValue('degree', parsedData.education_qualification.degree || '');
        setValue('field_of_study', parsedData.education_qualification.field_of_study || '');
        setValue('start_date', parsedData.education_qualification.start_date || '');
        setValue('end_date', parsedData.education_qualification.end_date || '');
      }

      if (parsedData.additional_info) {
        if (parsedData.additional_info.language && Array.isArray(parsedData.additional_info.language)) {
          setValue('languages', parsedData.additional_info.language);
        }
        setValue('additional_info', parsedData.additional_info.info || '');
      }

      // Store parsed data in the store
      updateFormData({
        cv_file: file,
        cv_parsed_data: parsedData
      });

      setIsParsed(true);

    } catch (error) {
      console.error('CV parsing error:', error);
      setParseError(error instanceof Error ? error.message : 'Failed to parse CV. Please try again.');
    } finally {
      setIsParsingCV(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const currentSkills = skills;
      setValue('skills', [...currentSkills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    const currentSkills = skills;
    setValue('skills', currentSkills.filter((_, i) => i !== index));
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim()) {
      const currentLanguages = languages;
      setValue('languages', [...currentLanguages, newLanguage.trim()]);
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (index: number) => {
    const currentLanguages = languages;
    setValue('languages', currentLanguages.filter((_, i) => i !== index));
  };

  const onSubmit = (data: CVForm) => {
    if (!formData.cv_file) {
      toast.error('CV file is required');
      return;
    }

    updateFormData({
      cv_file: data.cv_file,
      cv_parsed_data: {
        personal_info: {
          full_name: data.full_name,
          email: data.email,
          phone_number: data.phone_number,
          adress: data.address,
          nationality: data.nationality,
        },
        professional_summary: data.professional_summary,
        key_skills: data.skills,
        employment_history: {
          current_position: data.current_position,
          soc_code: data.soc_code,
          position_start_date: data.position_start_date,
          company_name: data.company_name,
        },
        education_qualification: {
          institute: data.institution,
          degree: data.degree,
          field_of_study: data.field_of_study,
          start_date: data.start_date,
          end_date: data.end_date,
        },
        additional_info: {
          language: data.languages,
          info: data.additional_info,
        }
      }
    });
    nextStep();
  };

  useEffect(() => {
    console.log(
      "Curriculum Vitae:",
      JSON.stringify(formData, null, 2)

    );
    console.log(formData.cv_file)
  }, [formData]);


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-8">
      <div className="max-w-155 w-full bg-white rounded-[14px] shadow-xs shadow-[#0E3A801F] p-8">
        <h2 className="text-[22px] lg:text-[28px] font-bold text-[#111]">
          Smart CV Builder
        </h2>
        <p className="text-[15px] lg:text-[18px] text-[#4D4D4D] mb-6">
          Upload your CV and we'll help organize your professional profile
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {isParsingCV ? (
            <div className="w-full shadow-xs shadow-[#0A65CC14] border border-[#0852C9] rounded-lg py-3 px-5.5 h-fit flex items-center justify-between bg-[#F5FAFF]">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-[#0A65CC] border-t-transparent animate-spin"></div>
                <div className="flex flex-col gap-[3px]">
                  <span className="text-sm font-medium text-[18px] text-[#373737]">
                    Parsing CV...
                  </span>
                  <span className="text-[16px] text-[#636363]">
                    Please wait
                  </span>
                </div>
              </div>
            </div>
          ) : formData.cv_file && formData.cv_file !== null ? (
            <div className="w-full shadow-xs shadow-[#0A65CC14] border border-[#0852C9] rounded-lg py-3 px-5.5 h-fit flex items-center justify-between bg-[#F5FAFF]">

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#0A65CC] flex items-center justify-center">
                  <svg
                    width="12"
                    height="9"
                    viewBox="0 0 12 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 4.5L4.5 8L11 1"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="flex flex-col gap-[3px]">
                  <span className="text-sm font-medium text-[18px] text-[#373737]">
                    {formData.cv_file.name}
                  </span>
                  <span className=" text-[16px] text-[#636363]">
                    Uploaded successfully
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  updateFormData({
                    cv_file: null
                  })
                  setFileName("");
                  setCvFile(null);
                  setIsParsed(false);
                }
                }
                className="text-[16px] text-[#636363] hover:text-[#101828] transition"
                type="button"
              >
                ✕
              </button>
            </div>
          )
            :
            (<div>
              <label className="block text-[18px] text-[#111111] font-medium mb-2">
                Upload Your CV
              </label>

              <div className="border-2 border-dashed border-[#C5C6C8] rounded-xl p-12 text-center hover:border-primary transition">
                <input
                  id="cv-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  disabled={isParsingCV}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      console.log('File selected:', file);
                      setFileName(file.name);
                      setCvFile(file);
                      setValue('cv_file', file);
                      console.log(file);
                      updateFormData({
                        cv_file: file
                      });
                      handleCVParse(file);
                    }
                  }}
                />

                <label htmlFor="cv-upload" className={`cursor-pointer flex flex-col items-center ${isParsingCV ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div className="w-12 h-12 bg-[#DFEEFF] rounded-full flex items-center justify-center mb-3">
                    <Upload className="text-primary text-xl" />
                  </div>
                  <p className="text-[18px] text-[#434343] font-medium">
                    {isParsingCV ? 'Parsing CV...' : (fileName || 'Upload Your CV')}
                  </p>
                  <p className="text-[16px] text-[#636363] mt-1">
                    PDF, JPG, PNG, DOC up to 10MB
                  </p>
                </label>
              </div>

              {parseError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{parseError}</p>
                </div>
              )}

              {isParsingCV && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-600">Analyzing your CV, please wait...</p>
                </div>
              )}
            </div>)}

          <div className="border border-[#D0D5DD] rounded-xl overflow-hidden shadow-xs bg-[#FFFFFF] shadow-[#00418A14]">
            <button
              type="button"
              onClick={() => setPersonalOpen(!personalOpen)}
              className="w-full flex items-center justify-between p-4 border-b border-[#D0D5DD] bg-transparent hover:bg-[#f6f6f6] transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#CFE5FE] rounded-[5px] flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[16px] font-medium text-[#1D1C1C]">Personal Details</span>
              </div>
              {personalOpen ? <ChevronUp className="w-5 h-5 text-[#1D1C1C]" /> : <ChevronDown className="w-5 h-5 text-[#1D1C1C]" />}
            </button>
            {personalOpen && (
              <div className="p-5.5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[16px] text-[#111] font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      {...register('full_name')}
                      placeholder="John Doe"
                      className="w-full p-4.5 border border-[#E8E4ED] text-[#383838] text-[16px] rounded-xl focus:ring-2 focus:ring-[#0852C9] focus:outline-0"
                    />
                  </div>
                  <div>
                    <label className="block text-[16px] text-[#111] font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="email@example.com"
                      className="w-full p-4.5 border border-[#E8E4ED] text-[#383838] text-[16px] rounded-xl focus:ring-2 focus:ring-[#0852C9] focus:outline-0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[16px] text-[#111] font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      {...register('phone_number')}
                      placeholder="898762222"
                      className="w-full p-4.5 border border-[#E8E4ED] text-[#383838] text-[16px] rounded-xl focus:ring-2 focus:ring-[#0852C9] focus:outline-0"
                    />
                  </div>
                  <div>
                    <label className="block text-[16px] text-[#111] font-medium mb-2">Address</label>
                    <input
                      type="text"
                      {...register('address')}
                      placeholder="City, Country"
                      className="w-full p-4.5 border border-[#E8E4ED] text-[#383838] text-[16px] rounded-xl focus:ring-2 focus:ring-[#0852C9] focus:outline-0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[16px] text-[#111] font-medium mb-2">Nationality</label>
                  <input
                    type="text"
                    {...register('nationality')}
                    placeholder="British"
                    className="w-full p-4.5 border border-[#E8E4ED] text-[#383838] text-[16px] rounded-xl focus:ring-2 focus:ring-[#0852C9] focus:outline-0"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="border border-[#D0D5DD] rounded-xl overflow-hidden shadow-xs bg-[#FFFFFF] shadow-[#00418A14]">
            <button
              type="button"
              onClick={() => setProfessionalOpen(!professionalOpen)}
              className="w-full flex items-center justify-between p-4 border-b border-[#D0D5DD] bg-transparent hover:bg-[#f6f6f6] transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#CFE5FE] rounded-[5px] flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[16px] font-medium text-[#1D1C1C]">Professional Profile</span>
              </div>
              {professionalOpen ? <ChevronUp className="w-5 h-5 text-[#1D1C1C]" /> : <ChevronDown className="w-5 h-5 text-[#1D1C1C]" />}
            </button>
            {professionalOpen && (
              <div className="p-4">
                <label className="block text-[16px] text-[#111] font-medium mb-2">Professional Summary</label>
                <textarea
                  {...register('professional_summary')}
                  rows={6}
                  className="w-full p-4.5 border border-[#E8E4ED] bg-[#F5FAFF] text-[#383838] text-[16px] rounded-xl focus:ring-2 focus:ring-[#0852C9] focus:outline-0"
                />
              </div>
            )}
          </div>

          <div className="border border-[#D0D5DD] rounded-xl overflow-hidden shadow-xs bg-[#FFFFFF] shadow-[#00418A14]">
            <button
              type="button"
              onClick={() => setSkillsOpen(!skillsOpen)}
              className="w-full flex items-center justify-between p-4 border-b border-[#D0D5DD] bg-transparent hover:bg-[#f6f6f6] transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#CFE5FE] rounded-[5px] flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[16px] font-medium text-[#1D1C1C]">Key Skills</span>
              </div>
              {skillsOpen ? <ChevronUp className="w-5 h-5 text-[#1D1C1C]" /> : <ChevronDown className="w-5 h-5 text-[#1D1C1C]" />}
            </button>
            {skillsOpen && (
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-[16px] text-[#111] font-medium mb-2">Add Skills</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                      placeholder="Type a skill and press enter"
                      className="flex-1 px-4 py-3 border border-[#0A65CC] bg-[#F4F8FD] text-[#383838] text-[16px] rounded-lg focus:ring-2 focus:ring-[#0852C9] focus:outline-0"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-2 p-2 bg-[#E9F3FF] text-[#0852C9] rounded-full text-[14px] font-medium"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(index)}
                        className="hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border border-[#D0D5DD] rounded-xl overflow-hidden shadow-xs bg-[#FFFFFF] shadow-[#00418A14]">
            <button
              type="button"
              onClick={() => setEmploymentOpen(!employmentOpen)}
              className="w-full flex items-center justify-between p-4 border-b border-[#D0D5DD] bg-transparent hover:bg-[#f6f6f6] transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#CFE5FE] rounded-[5px] flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[16px] font-medium text-[#1D1C1C]">Employment History</span>
              </div>
              {employmentOpen ? <ChevronUp className="w-5 h-5 text-[#1D1C1C]" /> : <ChevronDown className="w-5 h-5 text-[#1D1C1C]" />}
            </button>
            {employmentOpen && (
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-[16px] text-[#111] font-medium mb-2">Current Position</label>
                  <input
                    type="text"
                    {...register('current_position')}
                    placeholder="eg ; software engineer"
                    className="w-full p-4.5 border border-[#E8E4ED] text-[#383838] text-[16px] rounded-xl focus:ring-2 focus:ring-[#0852C9] focus:outline-0"
                  />
                </div>
                <div>
                  <label className="block text-[16px] text-[#111] font-medium mb-2">SOC Code</label>
                  <input
                    type="text"
                    {...register('soc_code')}
                    placeholder="2344"
                    className="w-full p-4.5 border border-[#E8E4ED] text-[#383838] text-[16px] rounded-xl focus:ring-2 focus:ring-[#0852C9] focus:outline-0"
                  />
                </div>
                <div>
                  <label className="block text-[16px] text-[#111] font-medium mb-2">Company Name</label>
                  <input
                    type="text"
                    {...register('company_name')}
                    placeholder="Company Name - City, Country"
                    className="w-full p-4.5 border border-[#E8E4ED] text-[#383838] text-[16px] rounded-xl focus:ring-2 focus:ring-[#0852C9] focus:outline-0"
                  />
                </div>
                <div>
                  <label className="block text-[16px] text-[#111] font-medium mb-2">Position Start Date</label>
                  <input
                    type="date"
                    {...register('position_start_date')}
                    className="w-full p-4.5 border border-[#E8E4ED] text-[#383838] text-[16px] rounded-xl focus:ring-2 focus:ring-[#0852C9] focus:outline-0"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="border border-[#D0D5DD] rounded-xl overflow-hidden shadow-xs bg-[#FFFFFF] shadow-[#00418A14]">
            <button
              type="button"
              onClick={() => setEducationOpen(!educationOpen)}
              className="w-full flex items-center justify-between p-4 border-b border-[#D0D5DD] bg-transparent hover:bg-[#f6f6f6] transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#CFE5FE] rounded-[5px] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[16px] font-medium text-[#1D1C1C]">Education & Qualification</span>
              </div>
              {educationOpen ? <ChevronUp className="w-5 h-5 text-[#1D1C1C]" /> : <ChevronDown className="w-5 h-5 text-[#1D1C1C]" />}
            </button>
            {educationOpen && (
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-[16px] text-[#111] font-medium mb-2">Institution</label>
                  <input
                    type="text"
                    {...register('institution')}
                    placeholder="University Name"
                    className="w-full p-4.5 border border-[#E8E4ED] text-[#383838] text-[16px] rounded-xl focus:ring-2 focus:ring-[#0852C9] focus:outline-0"
                  />
                </div>
                <div>
                  <label className="block text-[16px] text-[#111] font-medium mb-2">Degree</label>
                  <input
                    type="text"
                    {...register('degree')}
                    placeholder="Bachelor's Degree"
                    className="w-full p-4.5 border border-[#E8E4ED] text-[#383838] text-[16px] rounded-xl focus:ring-2 focus:ring-[#0852C9] focus:outline-0"
                  />
                </div>
                <div>
                  <label className="block text-[16px] text-[#111] font-medium mb-2">Field of Study</label>
                  <input
                    type="text"
                    {...register('field_of_study')}
                    placeholder="Computer Science"
                    className="w-full p-4.5 border border-[#E8E4ED] text-[#383838] text-[16px] rounded-xl focus:ring-2 focus:ring-[#0852C9] focus:outline-0"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[16px] text-[#111] font-medium mb-2">Start Date</label>
                    <input
                      type="date"
                      {...register('start_date')}
                      className="w-full p-4.5 border border-[#E8E4ED] text-[#383838] text-[16px] rounded-xl focus:ring-2 focus:ring-[#0852C9] focus:outline-0"
                    />
                  </div>
                  <div>
                    <label className="block text-[16px] text-[#111] font-medium mb-2">End Date</label>
                    <input
                      type="date"
                      {...register('end_date')}
                      className="w-full p-4.5 border border-[#E8E4ED] text-[#383838] text-[16px] rounded-xl focus:ring-2 focus:ring-[#0852C9] focus:outline-0"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border border-[#D0D5DD] rounded-xl overflow-hidden shadow-xs bg-[#FFFFFF] shadow-[#00418A14]">
            <button
              type="button"
              onClick={() => setAdditionalOpen(!additionalOpen)}
              className="w-full flex items-center justify-between p-4 border-b border-[#D0D5DD] bg-transparent hover:bg-[#f6f6f6] transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#CFE5FE] rounded-[5px] flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[16px] font-medium text-[#1D1C1C]">Additional Information</span>
              </div>
              {additionalOpen ? <ChevronUp className="w-5 h-5 text-[#1D1C1C]" /> : <ChevronDown className="w-5 h-5 text-[#1D1C1C]" />}
            </button>
            {additionalOpen && (
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-[16px] text-[#111] font-medium mb-2">Languages</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLanguage())}
                      placeholder="Type a language and press enter"
                      className="flex-1 px-4 py-3 border border-[#E8E4ED] text-[#383838] text-[16px] rounded-lg focus:ring-2 focus:ring-[#0852C9] focus:outline-0"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((language, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#DFEEFF] text-primary rounded-lg text-[14px] font-medium"
                      >
                        {language}
                        <button
                          type="button"
                          onClick={() => handleRemoveLanguage(index)}
                          className="hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[16px] text-[#111] font-medium mb-2">Additional Information</label>
                  <textarea
                    {...register('additional_info')}
                    placeholder="Any other relevant info......"
                    rows={4}
                    className="w-full p-4.5 border border-[#E8E4ED] text-[#383838] text-[16px] rounded-xl focus:ring-2 focus:ring-[#0852C9] focus:outline-0"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between gap-4 pt-6">
            <button
              type="button"
              onClick={previousStep}
              className="flex-1 border border-[#0A65CC]  text-[#0A65CC] max-w-[200px] py-4 text-[16px] lg:text-[18px] rounded-lg font-semibold"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!isParsed || isParsingCV}
              className="flex-1 bg-primary text-white max-w-[200px] py-4 text-[16px] lg:text-[18px] rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}