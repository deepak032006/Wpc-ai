'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useOnboardingStore } from '@/app/store/onboardingStore';

interface WorkDocumentationForm {
  brp_file?: FileList | null;
  evisa_file?: FileList | null;
  visa_expiry?: string;
  rtw_share_code?: string;
}

export default function WorkDocumentationStep() {
  const { formData, updateFormData, nextStep, previousStep } =
    useOnboardingStore();

  const [brpName, setBrpName] = useState('');
  const [evisaName, setEvisaName] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<WorkDocumentationForm>({
    defaultValues: {
      visa_expiry: formData.visa_expiry || '',
      rtw_share_code: formData.rtw_share_code || '',
    },
  });

  const onSubmit = (data: WorkDocumentationForm) => {
    updateFormData(data);
    nextStep();
  };

  const uploadBox = (
    id: string,
    label: string,
    fileName: string,
    setFileName: (v: string) => void,
    registerKey: 'brp_file' | 'evisa_file',
    optional?: boolean
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">
        {label}{' '}
        {optional && (
          <span className="text-gray-400 font-normal">(Optional)</span>
        )}
      </label>

      <div className="border border-dashed border-gray-300 rounded-lg p-10 text-center hover:border-primary transition">
        <input
          id={id}
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          {...register(registerKey)}
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setFileName(e.target.files[0].name);
              setValue(registerKey, e.target.files);
            }
          }}
        />

        <label htmlFor={id} className="cursor-pointer flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
            <span className="text-primary text-lg">↑</span>
          </div>

          <p className="text-sm font-medium text-gray-700">
            {fileName || 'Upload supporting document'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            PDF, JPG, PNG, DOC up to 10MB each
          </p>
        </label>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-8">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Work Documentation
        </h2>
        <p className="text-gray-500 mb-8">
          Upload documents to verify your right to work
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {uploadBox(
            'brp-upload',
            'BRP Card',
            brpName,
            setBrpName,
            'brp_file',
            true
          )}

          {uploadBox(
            'evisa-upload',
            'eVisa',
            evisaName,
            setEvisaName,
            'evisa_file'
          )}

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Visa / Leave Expiry Date
            </label>
            <input
              type="date"
              {...register('visa_expiry', {
                required: 'Expiry date is required',
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
            {errors.visa_expiry && (
              <p className="text-red-500 text-sm mt-1">
                {errors.visa_expiry.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Right to Work Share Code (Mandatory)
            </label>
            <input
              type="text"
              {...register('rtw_share_code', {
                required: 'Share code is required',
              })}
              placeholder="e.g. 1R3A456y"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-gray-400 mt-1">
              This code allows us to verify your eligibility to work with licensed
              employers
            </p>
            {errors.rtw_share_code && (
              <p className="text-red-500 text-sm mt-1">
                {errors.rtw_share_code.message}
              </p>
            )}
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={previousStep}
              className="flex-1 bg-white border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-blue-50"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
