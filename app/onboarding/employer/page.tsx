'use client';

import React, { useEffect, useState } from 'react';
import Topnav from '../_components/topnav';
import StepNavigation from '../_components/EmpStepNavigation';
import { useOnboardingStore } from '@/app/store/employerOnboarding';
import { nunitoSans } from '@/fonts';

import AccountStep from '../_components/account-step';
import CompanyStep from '../_components/company-step';
import OperationalRequirementsStep from '../_components/operational-requirements-step';
import ExpertSupportStep from '../_components/expert-support-step';
import CompleteStep from '../_components/complete-step';
import Navbar from '../_components/navbar';
import SuccessPage from '../_components/success';
import clientApi from '@/lib/axios';
import toast from 'react-hot-toast';

const OnboardingPage = () => {
  const { currentStep, _hasHydrated } = useOnboardingStore();
  const [isClient, setIsClient] = useState(false);
  const [allTitles, setAllTitles] = useState([]);

  console.log("Current STep", currentStep)
  useEffect(() => {
     const loadJobTitles = async () => {
    try {
      const res = await clientApi.get(`api/employer/job/titles/`);
      if (res.status === 200 || res.status === 201) {
        setAllTitles(res.data);
      } else {
        toast.error("Failed to load titles");
      }
    } catch (error) {
      toast.error("Failed to load titles");
    }
  };
    loadJobTitles();
    setIsClient(true);
  }, []);

  const renderStep = () => {
    if (!isClient || !_hasHydrated) {
      return <AccountStep />;
    }

    switch (currentStep) {
      case 'account':
        return <AccountStep />;

      case 'company':
        return <CompanyStep />;

      case 'operations':
        return <OperationalRequirementsStep allTitles={allTitles}/>;

      case 'support':
        return <ExpertSupportStep />;

      case 'complete':
        return <CompleteStep />;

      case 'success':
        return <SuccessPage />;

      default:
        return <AccountStep />;
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: nunitoSans.style.fontFamily }}
    >
      <Navbar/>
      {currentStep!=="success" && <StepNavigation />}
      <div className="container mx-auto px-4">
        {renderStep()}
      </div>
    </div>
  );
};

export default OnboardingPage;
