'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useOnboardingStore } from '@/app/store/employerOnboarding';

interface AccountForm {
  company_name: string;
  registered_address: string;
  company_type: string;
}

export default function AccountStep() {
  const { formData, updateFormData, nextStep, previousStep } =
    useOnboardingStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountForm>({
    defaultValues: {
      company_name: formData.company_name || '',
      registered_address: formData.registered_address || '',
      company_type: formData.company_type || '',
    },
  });

  const onSubmit = (data: AccountForm) => {
    updateFormData(data);
    nextStep();
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] font-inter">
      <div className="md:max-w-139 w-full bg-white rounded-lg shadow-sm shadow-[#0E3A801F] py-10 px-9">
        <h2 className="text-[22px] lg:text-[25px] 2xl:text-[30px] font-semibold text-[#111111] mb-1">
          Company Details
        </h2>
        <p className="text-[15px] lg:text-[17px] 2xl:text-[20px] text-[#4D4D4D] mb-8">
          Tell us about your organisation
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-[15px] lg:text-[17px] 2xl:text-[20px] font-medium text-[#111111] mb-2">
              Company Name
            </label>
            <input
              type="text"
              {...register('company_name', {
                required: 'Company name is required',
              })}
              className="w-full border-2 border-[#D0D5DD] py-3.5 px-4 rounded-[9px] focus:ring-2 focus:outline-0 focus:ring-[#0852C9]"
              placeholder="Acme Pvt Ltd"
            />
            {errors.company_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.company_name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[15px] lg:text-[17px] 2xl:text-[20px] font-medium text-[#111111] mb-2">
              Registered Address
            </label>
            <input
              type="text"
              {...register('registered_address', {
                required: 'Registered address is required',
              })}
              className="w-full border-2 border-[#D0D5DD] py-3.5 px-4 rounded-[9px] focus:ring-2 focus:outline-0 focus:ring-[#0852C9]"
              placeholder="Registered office address"
            />
            {errors.registered_address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.registered_address.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[15px] lg:text-[17px] 2xl:text-[20px] font-medium text-[#111111] mb-2">
              Company Type
            </label>
            <select
              {...register('company_type', {
                required: 'Company type is required',
              })}
              className="w-full border-2 border-[#D0D5DD] py-3.5 px-4 rounded-[9px] focus:ring-2 focus:outline-0 focus:ring-[#0852C9] bg-white"
            >
              <option value="">Select company type</option>
              <option value="Sole Trader">Sole Trader</option>
              <option value="Partnership">Partnership</option>
              <option value="LLP">LLP</option>
              <option value="Private Limited Company (Ltd)">Private Limited Company (Ltd)</option>
              <option value="Public Limited Company (PLC)">Public Limited Company (PLC)</option>
              <option value="Charity/Non-profit">Charity/Non-profit</option>
            </select>
            {errors.company_type && (
              <p className="text-red-500 text-sm mt-1">
                {errors.company_type.message}
              </p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={previousStep}
              className="flex-1 bg-white border border-[#0A65CC] text-[#0A65CC] py-3.5 rounded-[9px] font-semibold hover:bg-blue-50"
            >
              Back
            </button>

            <button
              type="submit"
              className="flex-1 bg-[#0852C9] text-white py-3.5 rounded-[9px] font-semibold hover:bg-[#0852C9]/90"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}