'use client';

import React, { useEffect, useState } from 'react';
import {
  useOnboardingStore,
  type OnboardingStep,
  stepOrder,
} from '@/app/store/employerOnboarding';

import {
  FaCheck,
  FaCircle,
  FaUserCog,
  FaBuilding,
  FaCogs,
  FaHeadset,
  FaFlagCheckered,
} from 'react-icons/fa';

const stepIcons: Record<OnboardingStep, React.ReactNode> = {
  account: <FaUserCog size={22} />,
  company: <FaBuilding size={22} />,
  operations: <FaCogs size={22} />,
  support: <FaHeadset size={22} />,
  complete: <FaFlagCheckered size={22} />,
};

const stepLabels: Record<OnboardingStep, string> = {
  account: 'Account',
  company: 'Company',
  operations: 'Operations',
  support: 'Support',
  complete: 'Complete',
};

export default function StepNavigation() {
  const {
    currentStep,
    setCurrentStep,
    isStepCompleted,
    canAccessStep,
    _hasHydrated,
  } = useOnboardingStore();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !_hasHydrated) {
    return (
      <div className="w-full px-4 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {stepOrder.map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div className="size-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                  {stepIcons[step]}
                </div>
                <span className="mt-1 text-xs text-gray-400">
                  {stepLabels[step]}
                </span>
              </div>
              {index !== stepOrder.length - 1 && (
                <div className="flex-1 h-1 mx-2 bg-gray-200 rounded" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {stepOrder.map((step, index) => {
            const isActive = currentStep === step;
            const isCompleted = isStepCompleted(step);
            const canAccess = canAccessStep(step);
            const isLast = index === stepOrder.length - 1;

            return (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <button
                    disabled={!canAccess}
                    onClick={() => canAccess && setCurrentStep(step)}
                    className={`
                      size-12 rounded-full flex items-center justify-center transition-all
                      ${
                        isActive
                          ? 'border-2 border-primary text-primary scale-105 shadow-md'
                          : isCompleted
                          ? 'bg-primary text-white'
                          : canAccess
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    {isCompleted ? <FaCheck size={18} /> : stepIcons[step]}
                  </button>

                  <span
                    className={`
                      mt-1 text-xs font-medium
                      ${
                        isActive
                          ? 'text-primary'
                          : isCompleted
                          ? 'text-primary'
                          : canAccess
                          ? 'text-gray-700'
                          : 'text-gray-400'
                      }
                    `}
                  >
                    {stepLabels[step]}
                  </span>
                </div>

                {!isLast && (
                  <div
                    className={`
                      flex-1 h-1 mx-2 rounded transition-all
                      ${
                        isStepCompleted(stepOrder[index + 1]) ||
                        (isCompleted &&
                          stepOrder.indexOf(currentStep) > index)
                          ? 'bg-primary'
                          : 'bg-gray-200'
                      }
                    `}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
