"use client";

import { useEffect, useState } from "react";
import JobStepper from "../../_components/Stepper";
import Form1 from "../../_components/Form1";
import Form2 from "../../_components/Form2";
import Form3 from "../../_components/Form3";
import Form4 from "../../_components/Form4";
import PreviewSubmitPage from "../../_components/Submit";
import ReviewPage from "../../_components/EditPage";
import clientApi from "@/lib/axios";

export type JobRoleType = {
  id?: number;
  job_title_id?: number;
  job_title?: {
    id: number;
    name: string;
  };
  job_location_type?: string; 
  job_location?: string;
  street_address?: string;
  country?: string;
  job_post_date?: string;
  job_post_deadline?: string;
  post_date?: string;
  end_date?: string;
  job_type?: number;
  job_type_details?: {
    id: number;
    name: string;
  };
  job_pay_type?: string; 
  show_pay_by?: string;
  min_salary?: string;
  max_salary?: string;
  amount?:string;
  minimum?: string;
  maximum?: string;
  job_rate?: string;
  rate?: string;
  benefits?: number[];
  benefit_details?: {
    id: number;
    name: string;
  }[];
  job_description?: string;
  job_overview?: string;
  responsibilities?: string[];
  skills?: string[];
  company?: any;
  number_of_openings?: number;
  expected_hours_per_week?: number | null;
  customized_pre_screening?: any;
  recruitment_timeline?: string;
  status?: string;
  language?: string;
  employer_email?: string;
  shortlisted?: number;
  applied?: number;
  created_at?: string;
  updated_at?: string;
};

type Benefit = {
  id: number;
  name: string;
};

const PostaRole = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<JobRoleType>({});
  
  const [jobTypes, setJobTypes] = useState<{id:number,name:string;}[]>([]);

  const [benefits, setBenefits] = useState<Benefit[]>([]);

  const renderStep = () => {
    switch (step) {
      case 0:
        return <Form1 formData={formData} setFormData={setFormData} step={step} setStep={setStep}/>;
      case 1:
        return <Form2  formData={formData} setFormData={setFormData} step={step} setStep={setStep} jobTypes={jobTypes}/>;
      case 2:
        return <Form3  formData={formData} setFormData={setFormData} step={step} setStep={setStep} benefits={benefits}/>;
      case 3:
        return <Form4  formData={formData} setFormData={setFormData} step={step} setStep={setStep}/>;
      case 4: 
        return <PreviewSubmitPage formData={formData} setFormData={setFormData} step={step} setStep={setStep}/>
      case 5:
        return <ReviewPage formData={formData} setFormData={setFormData} step={step} setStep={setStep}/>
    }
  };

  useEffect(() => {
    const fetchJobTypes = async () => {
      try {
        const res = await clientApi.get("api/employer/job/types/");
        setJobTypes(res.data);
      } catch (error) {
        console.log("Failed to Fetch Types");
      }
    };

      const fetchBenefits = async () => {
      try {
        const res = await clientApi.get("api/employer/job/benefits/");
        setBenefits(res.data);
      } catch (error) {
        console.log("Failed to Fetch Benefits");
      }
    };

    const initBenefit = [1];
    setFormData({
      ...formData,
      benefits: initBenefit,
    });

    fetchBenefits();

    fetchJobTypes();
  }, []);

  return (
    <div className="bg-[#FDFEFF] p-5 pb-25 font-inter">
      <h1 className="text-[24px] font-bold mb-4">Post a Role</h1>

      {step<4 && <JobStepper currentStep={step} />}

      <div className="bg-[#FFFFFF] shadow-sm shadow-[#0E3A801F] rounded-[14px] px-8.75 py-12 mt-9">
        {renderStep()}
      </div>
    </div>
  );
};

export default PostaRole;
