'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useOnboardingStore } from '@/app/store/onboardingStore';
import toast from 'react-hot-toast';

interface VisaStatusForm {
  visa_status: string;
  has_dependents: boolean;
}

export default function VisaStatus() {
  const { formData, updateFormData, nextStep, previousStep } = useOnboardingStore();
  const [hasDependents, setHasDependents] = useState<boolean>(formData.has_dependents || false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<VisaStatusForm>({
    defaultValues: {
      visa_status: formData.visa_status || '',
      has_dependents: formData.has_dependents || false
    }
  });

  const visaTypes = [
    { value: 'skilled_worker', label: 'Skilled Worker' },
    { value: 'student', label: 'Student' },
    { value: 'student_dependent', label: 'Student Dependent' },
    { value: 'graduate', label: 'Graduate' },
    { value: 'graduate_dependent', label: 'Graduate Dependent' },
    { value: 'skilled_worker_dependent', label: 'Skilled Worker Dependent' },
  ];

  const onSubmit = (data: VisaStatusForm) => {
    if (!data.visa_status) {
      toast.error('Please select a visa type');
      return;
    }
    updateFormData({ 
      visa_status: data.visa_status,
      has_dependents: hasDependents 
    });
    nextStep();
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-8">
      <div className="max-w-155 w-full bg-white rounded-[14px] shadow-sm shadow-[#0E3A801F] p-8">
        <h2 className="text-[22px] lg:text-[28px] font-bold text-[#111]">Visa Status Declaration</h2>
        <p className="text-[15px] lg:text-[18px] text-[#4D4D4D] mb-6">Tell us about your current visa status</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-[18px] text-[#111111] font-medium mb-2">
              Visa Type
            </label>
            <div className="relative">
              <select
                {...register('visa_status', { required: true })}
                 className="w-full px-4 py-3 border border-[#E8E4ED] text-[#383838] text-[16px] rounded-lg focus:ring-2 focus:ring-[#0852C9] focus:outline-0"
              >
                <option value="">Select visa</option>
                {visaTypes.map((visa) => (
                  <option key={visa.value} value={visa.value}>
                    {visa.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Do you have any dependents?</p>
                <p className="text-xs text-gray-500 mt-0.5">Family members on your visa</p>
              </div>
              <button
                type="button"
                onClick={() => setHasDependents(!hasDependents)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  hasDependents ? 'bg-[#0852C9]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    hasDependents ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex justify-between gap-3 pt-4">
            <button
              type="button"
              onClick={previousStep}
              className="flex-1 border border-[#0A65CC]  text-[#0A65CC] max-w-[200px] py-4 text-[16px] lg:text-[18px] rounded-lg font-semibold"
                >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary text-white max-w-[200px] py-4 text-[16px] lg:text-[18px] rounded-lg font-semibold"
                >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 