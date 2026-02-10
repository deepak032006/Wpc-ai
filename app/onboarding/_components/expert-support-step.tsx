'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useOnboardingStore } from '@/app/store/employerOnboarding';
import { TiTick } from 'react-icons/ti';
import toast from 'react-hot-toast';

interface ExpertSupportForm {
  wants_consultation: boolean;
  consultation_datetime?: string;
}

export default function ExpertSupportStep() {
  const { formData, updateFormData, nextStep, previousStep } =
    useOnboardingStore();

  const [supportMode, setSupportMode] = useState<'none' | 'expert'>(
    formData.wants_consultation ? 'expert' : 'none'
  );

  const initialDateTime = formData.consultation_datetime
    ? new Date(formData.consultation_datetime)
    : null;

  const [date, setDate] = useState(
    initialDateTime ? initialDateTime.toISOString().split('T')[0] : ''
  );
  const [time, setTime] = useState(
    initialDateTime
      ? initialDateTime.toISOString().split('T')[1].slice(0, 5)
      : ''
  );

  const { setValue } = useForm<ExpertSupportForm>();

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const onSubmit = () => {
    if (supportMode === 'expert') {
      if (!date || !time) {
        toast.error('Please select both date and time');
        return;
      }

      const combinedDateTime = `${date}T${time}`;

      updateFormData({
        wants_consultation: true,
        consultation_datetime: combinedDateTime,
      });
    } else {
      updateFormData({
        wants_consultation: false,
        consultation_datetime: undefined,
      });
    }

    nextStep();
  };

  const isSelected = date && time;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] font-inter px-4 py-6 md:px-6 md:py-8">
      <div className="md:max-w-139 w-full bg-white rounded-lg shadow-sm shadow-[#0E3A801F] py-6 px-5 sm:py-8 sm:px-7 md:py-10 md:px-9">
        <h2 className="text-lg sm:text-xl md:text-[22px] lg:text-[25px] 2xl:text-[30px] font-semibold text-[#111111] mb-1">
          Expert Support
        </h2>
        <p className="text-sm sm:text-base md:text-[15px] lg:text-[17px] 2xl:text-[20px] text-[#4D4D4D] mb-6 md:mb-8">
          Choose your preferred support option
        </p>

        <div
          onClick={() => {
            setSupportMode('none');
            setDate('');
            setTime('');
          }}
          className={`border rounded-lg py-4 px-3.5 sm:py-5 sm:px-4 md:px-4.75 mb-6 md:mb-8 cursor-pointer transition border-[#DCE9FF] bg-[#F7FBFF]`}
        >
          <h3 className="font-semibold text-sm sm:text-base md:text-[15px] lg:text-[17px] 2xl:text-[20px] text-[#313030] mb-1.5 md:mb-2">
            No Hire, No Pay Model
          </h3>
          <p className="text-xs sm:text-sm md:text-[13px] lg:text-[15px] 2xl:text-[18px] text-[#676967] mb-3 md:mb-4">
            Transparent, outcome-based pricing. You only pay a fixed success fee
            when your chosen candidate signs the offer letter.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 text-[11px] sm:text-xs md:text-[13px]">
            <div className='border border-[#D4E8FF] rounded-[7px] text-[#0852C9] bg-[#E6F1FF] p-2 flex items-center justify-center text-center'>Zero upfront cost</div>
            <div className='border border-[#D4E8FF] rounded-[7px] text-[#0852C9] bg-[#E6F1FF] p-2 flex items-center justify-center text-center'>Fixed success fee</div>
            <div className='border border-[#D4E8FF] rounded-[7px] text-[#0852C9] bg-[#E6F1FF] p-2 flex items-center justify-center text-center'>Risk-free hiring</div>
          </div>
        </div>

        <div
          className={`border rounded-lg p-4 sm:p-5 md:p-6 transition ${
            supportMode === 'expert'
              ? 'border-[#0852C9]'
              : 'border-[#D0D5DD]'
          }`}
        >
          <h3 className="font-semibold text-sm sm:text-base md:text-[15px] lg:text-[17px] 2xl:text-[20px] text-[#313030] mb-1.5 md:mb-2">
            Expert Support (Optional)
          </h3>
          <p className="text-xs sm:text-sm md:text-[13px] lg:text-[15px] 2xl:text-[18px] text-[#242323] mb-3 md:mb-4">
            Not sure about salary bands or SOC codes? Schedule a free consultation
            with a WPC Recruitment Officer.
          </p>

          {supportMode === 'expert' ? (
            <>
              <p className="text-sm sm:text-base md:text-[15px] lg:text-[17px] 2xl:text-[19px] font-medium text-[#000000] mb-2 md:mb-3">
                Select date and time:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 relative">
                <input
                  type="date"
                  min={getMinDate()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 md:px-4 py-2.5 sm:py-3 md:py-3.5 text-sm md:text-base rounded-md border border-[#D0D5DD] focus:ring-2 focus:ring-[#0852C9] focus:outline-0"
                />

                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 md:px-4 py-2.5 sm:py-3 md:py-3.5 text-sm md:text-base rounded-md border border-[#D0D5DD] focus:ring-2 focus:ring-[#0852C9] focus:outline-0"
                />

                {isSelected && (
                  <span className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-[#33951A] border border-[#33951A] p-0.5 sm:p-1 rounded-full">
                    <TiTick className="w-3 h-3 sm:w-4 sm:h-4" />
                  </span>
                )}
              </div>
            </>
          ) : (
            <div
              className="bg-white shadow-sm border border-[#0852C9] rounded-lg flex items-center justify-center py-2.5 sm:py-3 text-sm md:text-base text-[#0852C9] hover:bg-blue-50 cursor-pointer transition-colors"
              onClick={() => setSupportMode('expert')}
            >
              Schedule Free Consultation
            </div>
          )}
        </div>

        <hr className="border-gray-200 my-6 md:my-8" />

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <button
            type="button"
            onClick={previousStep}
            className="w-full sm:flex-1 bg-white border border-[#0A65CC] text-[#0A65CC] py-2.5 sm:py-3 md:py-3.5 text-sm md:text-base rounded-[9px] font-semibold hover:bg-blue-50 transition-colors"
          >
            Back
          </button>

          <button
            type="button"
            onClick={onSubmit}
            className="w-full sm:flex-1 bg-[#0852C9] text-white py-2.5 sm:py-3 md:py-3.5 text-sm md:text-base rounded-[9px] font-semibold hover:bg-[#0852C9]/90 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}