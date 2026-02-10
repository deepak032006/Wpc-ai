'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useOnboardingStore } from '@/app/store/onboardingStore';
import { Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import clientApi from '@/lib/axios';

interface VerifyIdentityForm {
  passport_file: File | null;
  passport_expiry: string;

  brp_file?: File | null;
  evisa_file?: File | null;

  visa_expiry: string;
  rtw_share_code: string;
}

export default function VerifyIdentityStep() {
  const { formData, updateFormData, nextStep, previousStep } =
    useOnboardingStore();

  const [passportName, setPassportName] = useState('');
  const [brpName, setBrpName] = useState('');
  const [evisaName, setEvisaName] = useState('');
  const [passportFile, setPassportFile] = useState<File | null>(formData.passport_file || null);
  const [brpFile, setBrpFile] = useState<File | null>(formData.brp_file || null);
  const [evisaFile, setEvisaFile] = useState<File | null>(formData.evisa_file || null);
  const [passportExpiry, setPassportExpiry] = useState(formData.passport_expiry || '');
  const [visaExpiry, setVisaExpiry] = useState(formData.visa_expiry || '');
  const [rtwShareCode, setRtwShareCode] = useState(formData.rtw_share_code || '');
  const [isParsingPassport, setIsParsingPassport] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<VerifyIdentityForm>({
    defaultValues: {
      passport_expiry: formData.passport_expiry || '',
      visa_expiry: formData.visa_expiry || '',
      rtw_share_code: formData.rtw_share_code || '',
    },
  });



  // for extracting the passport exp date
  const passportExp = async (file: File) => {
    setIsParsingPassport(true);
    try {
      const pasport = new FormData();
      pasport.append('file', file);

      const response = await clientApi.post(
        "/api/candidate/passport/parse/",
        pasport,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);

      if (!response.data) {
        setPassportFile(null);
        setPassportName("");
        setValue('passport_file', null);
        updateFormData({
          passport_file: null
        })
        setIsParsingPassport(false);
        toast.error("Error parsing the CV");
        return false;
      }
      if (response.data.file) {
        setPassportFile(null);
        setPassportName("");
        setValue('passport_file', null);
        updateFormData({
          passport_file: null
        })
        setIsParsingPassport(false);
        toast.error(response.data.file || "Invalid image");
        return false;
      }
      if (response.data.expiry_date === null) {
        setPassportFile(null);
        setPassportName("");
        setValue('passport_file', null);
        updateFormData({
          passport_file: null
        })
        setIsParsingPassport(false);
        toast.error("Please Upload Valid Passport");
        return false;
      }
      if (response.data.expiry_date && response.data.expiry_date !== null) {
        setValue('passport_expiry', response.data.expiry_date);
        updateFormData({
          passport_expiry: response.data.expiry_date
        })
        setPassportExpiry(response.data.expiry_date)
      }
      setIsParsingPassport(false);
      return true;
    } catch (error: any) {
      console.log("Error", error)
      setPassportFile(null);
      setPassportName("");
      setValue('passport_file', null);
      updateFormData({
        passport_file: null
      })
      setIsParsingPassport(false);
      if (error.response && error.response.status === 400) {
        if (error.response.data.file) {
          toast.error(error.response.data.file || "Invalid Image");
          return false;
        }
      }
      toast.error("Error parsing passport");
      return false;
    }
  }

  const onSubmit = (data: VerifyIdentityForm) => {
    if (!passportFile) {
      toast.error('Passport document is required');
      return;
    }
    if (!passportExpiry) {
      toast.error('Passport expiry date is required');
      return;
    }
    if (!visaExpiry) {
      toast.error('Visa/Leave expiry date is required');
      return;
    }
    if (!rtwShareCode) {
      toast.error('Right-to-Work share code is required');
      return;
    }

    updateFormData({
      passport_file: passportFile,
      passport_expiry: passportExpiry,
      brp_file: brpFile,
      evisa_file: evisaFile,
      visa_expiry: visaExpiry,
      rtw_share_code: rtwShareCode,
    });
    nextStep();
  };

  const uploadBox = (
    id: string,
    label: string,
    fileName: string,
    setFileName: (v: string) => void,
    registerKey: keyof VerifyIdentityForm,
    fileState: File | null,
    setFileState: (f: File | null) => void,
    required?: string,
    optional?: boolean
  ) => (
    <div>
      <label className="block text-[18px] text-[#111111] font-medium mb-2">
        {label}{' '}
        {optional && (
          <span className="text-gray-400 font-normal">(Optional)</span>
        )}
      </label>

      {isParsingPassport && registerKey === 'passport_file' ? (
        <div className="w-full shadow-sm shadow-[#0A65CC14] border border-[#0852C9] rounded-lg py-3 px-5.5 h-fit flex items-center justify-between bg-[#F5FAFF]">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-[#0A65CC] border-t-transparent animate-spin"></div>
            <div className="flex flex-col gap-[3px]">
              <span className="text-sm font-medium text-[18px] text-[#373737]">
                Parsing passport...
              </span>
              <span className="text-[16px] text-[#636363]">
                Please wait
              </span>
            </div>
          </div>
        </div>
      ) : fileState && fileState !== null ? (
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
              setValue(registerKey, null as any);
              updateFormData({
                [registerKey]: null
              });
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
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                console.log('File selected:', file);

                // calling logic for passport
                if (registerKey === "passport_file") {
                  setFileName(file.name);
                  setFileState(file);
                  setValue(registerKey, file as any);
                  updateFormData({
                    [registerKey]: file
                  });

                  const isValid = await passportExp(file);
                  
                  // If parsing failed, the passportExp function already cleared the state
                  // So we don't need to do anything here
                  if (!isValid) {
                    // Reset the file input
                    e.target.value = '';
                  }
                } else {
                  // For other files (BRP, eVisa), just set them normally
                  setFileName(file.name);
                  setFileState(file);
                  setValue(registerKey, file as any);
                  updateFormData({
                    [registerKey]: file
                  });
                }
                
                console.log(file)
              }
            }}
          />

          <label htmlFor={id} className="cursor-pointer flex flex-col items-center">
            <div className="w-12 h-12 bg-[#DFEEFF] rounded-full flex items-center justify-center mb-3">
              <span className="text-primary text-xl"><Upload /></span>
            </div>
            <p className="text-[18px] text-[#434343] font-medium">
              Upload supporting document
            </p>
            <p className="text-[16px] text-[#636363] mt-1">
              PDF, JPG, PNG, DOC up to 10MB
            </p>
          </label>
        </div>
      )}

      {errors[registerKey] && (
        <p className="text-red-500 text-sm mt-1">
          {(errors[registerKey] as any)?.message}
        </p>
      )}
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-8">
      <div className="max-w-155 w-full bg-white rounded-[14px] shadow-sm shadow-[#0E3A801F] p-8">
        <h2 className="text-[22px] lg:text-[28px] font-bold text-[#111]">
          Verify Your Identity & Right-to-Work
        </h2>
        <p className="text-[15px] lg:text-[18px] text-[#4D4D4D] mb-6">
          Upload documents to verify your eligibility to work in the UK
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {uploadBox(
            'passport-upload',
            'Passport (Mandatory)',
            passportName,
            setPassportName,
            'passport_file',
            passportFile,
            setPassportFile,
          )}

          <div>
            <label className="block text-[18px] text-[#111111] font-medium mb-2">
              Passport Expiry Date
            </label>
            <input
              type="date"
              {...register('passport_expiry', {
                required: 'Passport expiry date is required',
              })}
              value={passportExpiry}
              onChange={(e) => {
                setPassportExpiry(e.target.value);
                setValue('passport_expiry', e.target.value);
                if (e.target.value) {
                  clearErrors('passport_expiry');
                }
              }}
              className="w-full px-4 py-3 border border-[#E8E4ED] text-[#383838] text-[16px] rounded-lg focus:ring-2 focus:ring-[#0852C9] focus:outline-0"
            />
            {errors.passport_expiry && (
              <p className="text-red-500 text-sm mt-1">
                {errors.passport_expiry.message}
              </p>
            )}
          </div>

          {uploadBox(
            'brp-upload',
            'BRP Card',
            brpName,
            setBrpName,
            'brp_file',
            brpFile,
            setBrpFile,
            undefined,
            true
          )}

          {uploadBox(
            'evisa-upload',
            'eVisa',
            evisaName,
            setEvisaName,
            'evisa_file',
            evisaFile,
            setEvisaFile,
            undefined,
            true
          )}

          <div>
            <label className="block text-[18px] text-[#111111] font-medium mb-2">
              Visa / Leave Expiry Date
            </label>
            <input
              type="date"
              {...register('visa_expiry', {
                required: 'Visa expiry date is required',
              })}
              value={visaExpiry}
              onChange={(e) => {
                setVisaExpiry(e.target.value);
                setValue('visa_expiry', e.target.value);
                if (e.target.value) {
                  clearErrors('visa_expiry');
                }
              }}
              className="w-full px-4 py-3 border border-[#E8E4ED] text-[#383838] text-[16px] rounded-lg focus:ring-2 focus:ring-[#0852C9] focus:outline-0"
            />
            {errors.visa_expiry && (
              <p className="text-red-500 text-sm mt-1">
                {errors.visa_expiry.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[18px] text-[#111111] font-medium mb-2">
              Right-to-Work Share Code
            </label>
            <input
              type="text"
              {...register('rtw_share_code', {
                required: 'Share code is required',
              })}
              value={rtwShareCode}
              onChange={(e) => {
                setRtwShareCode(e.target.value);
                setValue('rtw_share_code', e.target.value);
                if (e.target.value) {
                  clearErrors('rtw_share_code');
                }
              }}
              placeholder="e.g. 1R3A456Y"
              className="w-full px-4 py-3 border border-[#E8E4ED] text-[#383838] text-[16px] rounded-lg focus:ring-2 focus:ring-[#0852C9] focus:outline-0"
            />
            <p className="text-xs text-gray-400 mt-1">
              This code allows employers to verify your eligibility
            </p>
            {errors.rtw_share_code && (
              <p className="text-red-500 text-sm mt-1">
                {errors.rtw_share_code.message}
              </p>
            )}
          </div>

          <div className="flex justify-between  gap-4 pt-6">
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