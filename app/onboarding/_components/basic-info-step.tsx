'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useOnboardingStore } from '@/app/store/onboardingStore';
import uk_cities from '@/config/uk_cities';

interface BasicInfoForm {
  uk_postcode: string;
  uk_street: string;
  uk_city: string;
  current_position: string;
  soc_code: string;
  position_start_date: string;
}

export default function BasicInfoStep() {
  const { formData, updateFormData, nextStep, previousStep } = useOnboardingStore();
  
  const { register, handleSubmit, formState: { errors } } = useForm<BasicInfoForm>({
    defaultValues: {
      uk_postcode: formData.uk_postcode || '',
      uk_street: formData.uk_street || '',
      uk_city: formData.uk_city || '',
      current_position: formData.current_position || '',
      soc_code: formData.soc_code || '',
      position_start_date: formData.position_start_date || ''
    }
  });

  const onSubmit = (data: BasicInfoForm) => {
    updateFormData(data);
    nextStep();
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-8">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Basic Information</h2>
        <p className="text-gray-500 mb-8">Please enter your personal details</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Code
            </label>
            <input
              {...register('uk_postcode', { required: 'Post code is required' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              placeholder="Enter your post code"
            />
            {errors.uk_postcode && (
              <p className="text-red-500 text-sm mt-1">{errors.uk_postcode.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street Address
            </label>
            <input
              {...register('uk_street', { required: 'Street address is required' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              placeholder="Enter your street address"
            />
            {errors.uk_street && (
              <p className="text-red-500 text-sm mt-1">{errors.uk_street.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <select
              {...register('uk_city', { required: 'City is required' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-400 appearance-none bg-white"
              defaultValue=""
            >
              <option value="" disabled>Select a city</option>
              {
                uk_cities.map((city) => (
                  <option key={city.code} value={city.code} className="text-gray-900">
                    {city.name}
                  </option>
                ))
              }
            </select>
            {errors.uk_city && (
              <p className="text-red-500 text-sm mt-1">{errors.uk_city.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Position
            </label>
            <input
              {...register('current_position', { required: 'Current position is required' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              placeholder="e.g. Software Developer"
            />
            {errors.current_position && (
              <p className="text-red-500 text-sm mt-1">{errors.current_position.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SOC Code
            </label>
            <input
              {...register('soc_code', { required: 'SOC code is required' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              placeholder="e.g. 2135"
            />
            {errors.soc_code && (
              <p className="text-red-500 text-sm mt-1">{errors.soc_code.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position Start Date
            </label>
            <input
              type="date"
              {...register('position_start_date', { required: 'Position start date is required' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
            {errors.position_start_date && (
              <p className="text-red-500 text-sm mt-1">{errors.position_start_date.message}</p>
            )}
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={previousStep}
              className="flex-1 bg-white border-2 border-primary text-primary py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}