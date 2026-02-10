'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useOnboardingStore } from '@/app/store/employerOnboarding';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

interface OperationalForm {
  staffCount: string;
  companyWebsite?: string;
  keyPositions: {
    id: number;
    name: string;
  }[];
}

const staffOptions = ['1-10', '11-50', '51-250', '250+'];

type PropsType = {
  allTitles:{
    id:number;
    title: string;
    name: string;
  }[];
}

export default function OperationalRequirementsStep({allTitles}: PropsType) {
  const { formData, updateFormData, nextStep, previousStep } =
    useOnboardingStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OperationalForm>({
    defaultValues: {
      staffCount: formData.staff_count || '',
      companyWebsite: formData.company_website || '',
      keyPositions: formData.key_positions || [],
    },
  });

  const [showAddPosition, setShowAddPosition] = useState(false);
  const [positionTitle, setPositionTitle] = useState('');
  const [positionName, setPositionName] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const keyPositions = watch('keyPositions');

  // Filter titles based on input
  const filteredTitles = allTitles.filter(item =>
    item.name.toLowerCase().includes(positionTitle.toLowerCase())
  );

  const addPosition = () => {
    if (!positionTitle.trim()) {
      toast.error('Position title is required');
      return;
    }

    // Check if the title is valid (exists in allTitles)
    const validTitle = allTitles.find(item => item.name === positionTitle.trim());
    if (!validTitle) {
      toast.error('Please select a valid position title from the list');
      return;
    }

    setValue(
      'keyPositions',
      [
        ...(keyPositions || []),
        {
          id: validTitle.id, // Store the ID from the title field
          name: positionName.trim(),
        },
      ],
      { shouldValidate: true }
    );

    setPositionTitle('');
    setPositionName('');
    setShowAddPosition(false);
    setShowSuggestions(false);
  };

  const deletePosition = (index: number) => {
    const updatedPositions = keyPositions.filter((_, i) => i !== index);
    setValue('keyPositions', updatedPositions, { shouldValidate: true });
  };

  const selectTitle = (title: string) => {
    setPositionTitle(title);
    setShowSuggestions(false);
  };

  // Helper function to get position title from ID
  const getPositionTitleById = (id: number) => {
    const position = allTitles.find(item => item.id === id);
    return position ? position.name : id;
  };

  const onSubmit = (data: OperationalForm) => {
    if (!data.keyPositions || data.keyPositions.length === 0) {
      toast.error('Please add at least one key position');
      return;
    }

    updateFormData({
      staff_count: data.staffCount,
      company_website: data.companyWebsite,
      key_positions: data.keyPositions,
    });

    nextStep();
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] font-inter px-4 py-6 md:px-6 md:py-8">
      <div className="md:max-w-139 w-full bg-[#FFFFFF] rounded-lg shadow-sm shadow-[#0E3A801F] py-6 px-5 sm:py-8 sm:px-7 md:py-10 md:px-9">
        <h2 className="text-lg sm:text-xl md:text-[22px] lg:text-[25px] 2xl:text-[30px] font-semibold text-[#111111] mb-1">
          Operational Requirements
        </h2>
        <p className="text-sm sm:text-base md:text-[15px] lg:text-[17px] 2xl:text-[20px] text-[#4D4D4D] mb-6 md:mb-8">
          Help us understand your hiring needs
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 md:space-y-8">
          <div>
            <label className="block text-sm sm:text-base md:text-[15px] lg:text-[17px] 2xl:text-[20px] font-medium text-[#111111] mb-1.5 md:mb-2">
              Current Staff Count
            </label>
            <select
              {...register('staffCount', {
                required: 'Please select your company size',
              })}
              className={`w-full border-2 shadow-sm py-2.5 sm:py-3 md:py-3.5 px-3 md:px-4 text-sm md:text-base rounded-[9px] bg-white focus:ring-2 focus:outline-0 focus:ring-[#0852C9] ${
                errors.staffCount ? 'border-red-500' : 'border-[#D0D5DD]'
              }`}
            >
              <option value="">Select company size</option>
              {staffOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            {errors.staffCount && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {errors.staffCount.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm sm:text-base md:text-[15px] lg:text-[17px] 2xl:text-[20px] font-medium text-[#111111] mb-1.5 md:mb-2">
              Company Website <span className="text-[#98A2B3]">(Optional)</span>
            </label>
            <input
              type="url"
              placeholder="https://website.com"
              {...register('companyWebsite', {
                pattern: {
                  value: /^https?:\/\/.+/i,
                  message: 'Enter a valid URL',
                },
              })}
              className="w-full border-2 border-[#D0D5DD] py-2.5 sm:py-3 md:py-3.5 px-3 md:px-4 text-sm md:text-base rounded-[9px] focus:ring-2 focus:outline-0 focus:ring-[#0852C9]"
            />
            {errors.companyWebsite && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {errors.companyWebsite.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm sm:text-base md:text-[15px] lg:text-[17px] 2xl:text-[20px] font-medium text-[#111111] mb-1.5 md:mb-2">
              Key Positions to Fill
            </label>

            <div className="space-y-2 mb-3">
              {keyPositions?.map((pos, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-2 border-[#D0D5DD] rounded-[9px] px-3 md:px-4 py-2.5 md:py-3 text-xs sm:text-sm"
                >
                  <div className="flex-1 min-w-0 mr-2">
                    <span className="font-medium break-words">{getPositionTitleById(pos.id)}</span>
                    {pos.name && <span className="text-[#667085] text-xs ml-2 break-words">{pos.name}</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => deletePosition(index)}
                    className="text-red-500 hover:text-red-700 flex-shrink-0"
                  >
                    <Trash2 size={14} className="sm:w-4 sm:h-4"/>
                  </button>
                </div>
              ))}
            </div>

            {!showAddPosition && (
              <button
                type="button"
                onClick={() => setShowAddPosition(true)}
                className="text-[#0A65CC] font-medium text-xs sm:text-sm"
              >
                + Add position
              </button>
            )}

            {showAddPosition && (
              <div className="mt-3 md:mt-4 space-y-2.5 md:space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Position title"
                    value={positionTitle}
                    onChange={(e) => {
                      setPositionTitle(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full border-2 border-[#D0D5DD] py-2.5 sm:py-3 md:py-3.5 px-3 md:px-4 text-sm md:text-base rounded-[9px] focus:ring-2 focus:outline-0 focus:ring-[#0852C9]"
                  />
                  {showSuggestions && filteredTitles.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border-2 border-[#D0D5DD] rounded-[9px] max-h-40 sm:max-h-48 overflow-y-auto shadow-lg">
                      {filteredTitles.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => selectTitle(item.name)}
                          className="px-3 md:px-4 py-2 md:py-2.5 hover:bg-gray-100 cursor-pointer text-xs sm:text-sm"
                        >
                          {item.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Position name (optional)"
                  value={positionName}
                  onChange={(e) => setPositionName(e.target.value)}
                  className="w-full border-2 border-[#D0D5DD] py-2.5 sm:py-3 md:py-3.5 px-3 md:px-4 text-sm md:text-base rounded-[9px] focus:ring-2 focus:outline-0 focus:ring-[#0852C9]"
                />

                <div className="flex gap-2.5 md:gap-3">
                  <button
                    type="button"
                    onClick={addPosition}
                    className="bg-[#0852C9] text-white px-4 md:px-5 py-2 text-xs sm:text-sm rounded-[9px] font-semibold hover:bg-[#0852C9]/90 transition-colors"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddPosition(false);
                      setPositionTitle('');
                      setPositionName('');
                      setShowSuggestions(false);
                    }}
                    className="text-[#667085] text-xs sm:text-sm hover:text-[#4D4D4D] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <hr className="border-gray-200" />

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-3 md:pt-4">
            <button
              type="button"
              onClick={previousStep}
              className="w-full sm:flex-1 bg-white border border-[#0A65CC] text-[#0A65CC] py-2.5 sm:py-3 md:py-3.5 text-sm md:text-base rounded-[9px] font-semibold hover:bg-blue-50 transition-colors"
            >
              Back
            </button>

            <button
              type="submit"
              className="w-full sm:flex-1 bg-[#0852C9] text-white py-2.5 sm:py-3 md:py-3.5 text-sm md:text-base rounded-[9px] font-semibold hover:bg-[#0852C9]/90 transition-colors"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}