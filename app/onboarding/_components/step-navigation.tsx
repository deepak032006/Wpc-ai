'use client';

import React, { useEffect, useState } from 'react';
import { useOnboardingStore, type OnboardingStep, stepOrder } from '@/app/store/onboardingStore';
import { FaCheckCircle, FaCircle, FaUserCircle, FaIdCard, FaBriefcase, FaGlobe, FaFileAlt, FaFolderOpen, FaPaperPlane, FaTrashAlt, FaCheck, FaRegUser } from 'react-icons/fa';
import { HiOutlineBuildingOffice, HiOutlineDocumentCheck, HiOutlineIdentification } from 'react-icons/hi2';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { GrDocumentUser } from 'react-icons/gr';
import { MdWorkOutline } from 'react-icons/md';
import { Briefcase } from 'lucide-react';

const stepIcons: Record<OnboardingStep, React.ReactNode> = {
  location: <FaCheckCircle size={24} />,
  identity: <FaRegUser size={24} />,
  visa: <HiOutlineIdentification size={24} />,
  cv: <MdWorkOutline size={24} />,
  role: <Briefcase size={24}/>,
  domain: <HiOutlineBuildingOffice size={24} />,
  resume: <GrDocumentUser size={24} />,
  documents: <IoDocumentTextOutline size={24} />,
  submit: <HiOutlineDocumentCheck size={24} />
};

const stepLabels: Record<OnboardingStep, string> = {
  location: 'Location',
  identity: 'Identity',
  visa: 'Visa',
  cv: 'CV',
  role: 'Role',
  domain: 'Domain',
  resume: 'Resume',
  documents: 'Documents',
  submit: 'Submit'
};

export default function StepNavigation() {
  const { currentStep, setCurrentStep, isStepCompleted, canAccessStep, _hasHydrated } = useOnboardingStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Wait for hydration to complete
  if (!isClient || !_hasHydrated) {
    return (
      <div className="w-full px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {stepOrder.map((step, index) => {
              const isLast = index === stepOrder.length - 1;
              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div className="flex flex-col items-center justify-center size-12 rounded-full bg-gray-100 text-gray-400">
                      {stepIcons[step] || <FaCircle size={16} />}
                    </div>
                    <span className="mt-1 text-xs font-medium whitespace-nowrap text-gray-400">
                      {stepLabels[step]}
                    </span>
                  </div>
                  {!isLast && <div className="flex-1 h-1 mx-2 rounded bg-gray-200" />}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          
          <div className="flex-1 flex items-center justify-between">
          {stepOrder.map((step, index) => {
            const isActive = currentStep === step;
            const isCompleted = isStepCompleted(step);
            const canAccess = canAccessStep(step);
            const isLast = index === stepOrder.length - 1;

            return (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => canAccess && setCurrentStep(step)}
                    disabled={!canAccess}
                    className={`
                      flex flex-col items-center justify-center size-12 rounded-full transition-all
                      ${isActive 
                        ? 'border-2 border-primary text-primary shadow-lg scale-105' 
                        : isCompleted 
                        ? 'bg-primary text-white hover:bg-primary-dark ' 
                        : canAccess
                        ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                    `}
                  >
                    {isCompleted ? (
                      <FaCheck size={20} />
                    ) : (
                      stepIcons[step] || <FaCircle size={16} />
                    )}
                  </button>
                  
                  <span
                    className={`
                      mt-1 text-xs font-medium whitespace-nowrap
                      ${isActive 
                        ? 'text-blue-600 font-semibold' 
                        : isCompleted 
                        ? 'text-primary' 
                        : canAccess
                        ? 'text-gray-700'
                        : 'text-gray-400'}
                    `}
                  >
                    {stepLabels[step]}
                  </span>
                </div>

                {!isLast && (
                  <div
                    className={`
                      flex-1 h-1 mx-2 rounded transition-all
                      ${isStepCompleted(stepOrder[index + 1]) || (isCompleted && stepOrder.indexOf(currentStep) > index) ? 'bg-primary' : 'bg-gray-200'}
                    `}
                  />
                )}
              </React.Fragment>
            );
          })}
          </div>
        </div>
      </div>

    </div>
  );
}
