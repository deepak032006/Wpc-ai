'use client';

import React, { useEffect, useState } from 'react';
import Topnav from '../_components/topnav';
import StepNavigation from '../_components/step-navigation';
import WelcomeStep from '../_components/welcome-step';
import BasicInfoStep from '../_components/basic-info-step';
import { useOnboardingStore } from '@/app/store/onboardingStore';
import { nunitoSans } from '@/fonts';
import VerifyIdentityStep from '../_components/verify-identity-step';
import WorkDocumentationStep from '../_components/work-documentation-form';
import SelectSectorStep from '../_components/select-sector-step';
import UploadResumeStep from '../_components/upload-resume-step';
import AdditionalDocumentsStep from '../_components/additional-documents-form';
import ReviewSubmitStep from '../_components/review-submit-step';
import VisaStatus from '../_components/viss-status';
import toast from 'react-hot-toast';
import { get_target_roles } from '@/app/action/onboarding.action';

interface TargetRole {
  id: number;
  name: string;
}

const OnboardingPage = () => {

  const { currentStep, _hasHydrated } = useOnboardingStore();
  const [isClient, setIsClient] = useState(false);

  const [roles, setRoles] = useState<TargetRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      const res = await get_target_roles();

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      setRoles(res.data);
      setLoading(false);
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const renderStep = () => {
    // Show welcome step during hydration
    if (!isClient || !_hasHydrated) {
      return <WelcomeStep />;
    }

    switch (currentStep) {
      case 'location':
        return <WelcomeStep />;
      case 'identity':
        return <VerifyIdentityStep />;
      case 'visa':
        return <VisaStatus />;
      case 'cv':
        return <UploadResumeStep />;
      case 'role':
        return <SelectSectorStep roles={roles} setRoles={setRoles} loading={loading} setLoading={setLoading} />;
      case 'documents':
        return <AdditionalDocumentsStep />;
      case 'submit':
        return <ReviewSubmitStep />;
      default:
        return <WelcomeStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: nunitoSans.style.fontFamily }}>
      <Topnav text="" />
      <StepNavigation />
      <div className="container mx-auto px-4">
        {renderStep()}
      </div>
    </div>
  );
};

export default OnboardingPage;