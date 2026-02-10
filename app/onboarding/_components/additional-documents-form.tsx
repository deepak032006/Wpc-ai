'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useOnboardingStore } from '@/app/store/onboardingStore';
import { Upload, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

interface AdditionalDocumentsForm {
  qualification_documents?: File | null;
  english_language_documents?: File | null;
  specialized_licenses?: File | null;
  training_certificates?: File | null;
  dbs_certificate?: File | null;
}

export default function AdditionalDocuments() {
  const { formData, updateFormData, nextStep, previousStep } = useOnboardingStore();
  
  const [qualificationFileName, setQualificationFileName] = useState<string>('');
  const [englishLangFileName, setEnglishLangFileName] = useState<string>('');
  const [licensesFileName, setLicensesFileName] = useState<string>('');
  const [trainingFileName, setTrainingFileName] = useState<string>('');
  const [dbsFileName, setDbsFileName] = useState<string>('');

  // Track files in useState
  const [qualificationFile, setQualificationFile] = useState<File | null>(formData.qualification_documents || null);
  const [englishLangFile, setEnglishLangFile] = useState<File | null>(formData.english_language_documents || null);
  const [licensesFile, setLicensesFile] = useState<File | null>(formData.specialized_licenses || null);
  const [trainingFile, setTrainingFile] = useState<File | null>(formData.training_certificates || null);
  const [dbsFile, setDbsFile] = useState<File | null>(formData.dbs_certificate || null);
  
  const { register, handleSubmit, setValue } = useForm<AdditionalDocumentsForm>({
    defaultValues: {
      qualification_documents: null,
      english_language_documents: null,
      specialized_licenses: null,
      training_certificates: null,
      dbs_certificate: null
    }
  });

  const onSubmit = (data: AdditionalDocumentsForm) => {
    if (!qualificationFile) {
      toast.error('Qualifications document is required');
      return;
    }
    if (!englishLangFile) {
      toast.error('English Language document is required');
      return;
    }
    if (!dbsFile) {
      toast.error('DBS Certificate is required');
      return;
    }

    const updateData: any = {};
    
    if (qualificationFile) {
      updateData.qualification_documents = qualificationFile;
    }
    if (englishLangFile) {
      updateData.english_language_documents = englishLangFile;
    }
    if (licensesFile) {
      updateData.specialized_licenses = licensesFile;
    }
    if (trainingFile) {
      updateData.training_certificates = trainingFile;
    }
    if (dbsFile) {
      updateData.dbs_certificate = dbsFile;
    }
    
    updateFormData(updateData);
    nextStep();
  };

  const uploadBoxLarge = (
    id: string,
    label: string,
    fileName: string,
    setFileName: React.Dispatch<React.SetStateAction<string>>,
    fileState: File | null,
    setFileState: React.Dispatch<React.SetStateAction<File | null>>,
    registerKey: keyof AdditionalDocumentsForm,
    description?: string
  ) => (
    <div>
      <label className="block text-[18px] text-[#111111] font-medium mb-2">
        {label}
      </label>
      {description && (
        <p className="text-[14px] text-[#636363] mb-2">
          {description}
        </p>
      )}
      
      {fileState && fileState !== null ? (
        <div className="w-full shadow-sm shadow-[#0A65CC14] border border-[#0852C9] rounded-lg py-3 px-5.5 h-fit flex items-center justify-between bg-[#F5FAFF]">
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
                {fileState.name}
              </span>
              <span className="text-[16px] text-[#636363]">
                Uploaded successfully
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setFileName("");
              setFileState(null);
              setValue(registerKey, null);
            }}
            className="text-[16px] text-[#636363] hover:text-[#101828] transition"
            type="button"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-[#C5C6C8] rounded-xl p-12 text-center hover:border-primary transition">
          <input
            id={id}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                console.log('File selected:', file);
                setFileName(file.name);
                setFileState(file);
                setValue(registerKey, file);
                updateFormData({
                  [registerKey]: file
                });
                console.log(file);
              }
            }}
          />
          <label htmlFor={id} className="cursor-pointer flex flex-col items-center">
            <div className="w-12 h-12 bg-[#DFEEFF] rounded-full flex items-center justify-center mb-3">
              <Upload className="text-primary text-xl" />
            </div>
            <p className="text-[18px] text-[#434343] font-medium">
              Click to upload or drag and drop
            </p>
            <p className="text-[16px] text-[#636363] mt-1">
              PDF, JPG, PNG, DOC (max 10MB)
            </p>
          </label>
        </div>
      )}
    </div>
  );

  const uploadBoxSmall = (
    id: string,
    label: string,
    fileName: string,
    setFileName: React.Dispatch<React.SetStateAction<string>>,
    fileState: File | null,
    setFileState: React.Dispatch<React.SetStateAction<File | null>>,
    registerKey: keyof AdditionalDocumentsForm,
    description?: string,
    optional?: boolean
  ) => (
    <div>
      <label className="block text-[18px] text-[#111111] font-medium mb-2">
        {label}{' '}
        {optional && (
          <span className="text-gray-400 font-normal">(Optional)</span>
        )}
      </label>
      {description && (
        <p className="text-[14px] text-[#636363] mb-2">
          {description}
        </p>
      )}
      
      {fileState && fileState !== null ? (
        <div className="w-full shadow-sm shadow-[#0A65CC14] border border-[#0852C9] rounded-lg py-3 px-5.5 h-fit flex items-center justify-between bg-[#F5FAFF]">
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
                {fileState.name}
              </span>
              <span className="text-[16px] text-[#636363]">
                Uploaded successfully
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setFileName("");
              setFileState(null);
              setValue(registerKey, null);
            }}
            className="text-[16px] text-[#636363] hover:text-[#101828] transition"
            type="button"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-[#C5C6C8] rounded-xl p-4 text-center hover:border-primary transition">
          <input
            id={id}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                console.log('File selected:', file);
                setFileName(file.name);
                setFileState(file);
                setValue(registerKey, file);
                updateFormData({
                  [registerKey]: file
                });
                console.log(file);
              }
            }}
          />
          <label htmlFor={id} className="cursor-pointer flex items-center justify-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            <span className="text-primary text-[16px] font-medium">
              Add File
            </span>
          </label>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-8">
      <div className="max-w-155 w-full bg-white rounded-[14px] shadow-sm shadow-[#0E3A801F] p-8">
        <h2 className="text-[22px] lg:text-[28px] font-bold text-[#111]">
          Additional Documents
        </h2>
        <p className="text-[15px] lg:text-[18px] text-[#4D4D4D] mb-6">
          Upload any sector-specific documents that may be required for your role. These are optional but may speed up your onboarding.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {uploadBoxLarge(
            'qualification-upload',
            'Qualifications',
            qualificationFileName,
            setQualificationFileName,
            qualificationFile,
            setQualificationFile,
            'qualification_documents'
          )}

          {uploadBoxLarge(
            'english-upload',
            'English Language',
            englishLangFileName,
            setEnglishLangFileName,
            englishLangFile,
            setEnglishLangFile,
            'english_language_documents',
            'IELTS Results (B1 CEFR) or proof of degree taught in English'
          )}

          {uploadBoxSmall(
            'licenses-upload',
            'Specialized Licenses',
            licensesFileName,
            setLicensesFileName,
            licensesFile,
            setLicensesFile,
            'specialized_licenses',
            'Industry specific licenses (e.g., Driving License, SIA, etc.)',
            true
          )}

          {uploadBoxSmall(
            'training-upload',
            'Training & Compliance Certificates',
            trainingFileName,
            setTrainingFileName,
            trainingFile,
            setTrainingFile,
            'training_certificates',
            undefined,
            true
          )}

          {uploadBoxSmall(
            'dbs-upload',
            'DBS Certificate',
            dbsFileName,
            setDbsFileName,
            dbsFile,
            setDbsFile,
            'dbs_certificate'
          )}

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