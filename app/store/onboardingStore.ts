import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OnboardingStep =
  | 'location'
  | 'identity'
  | 'visa'
  | 'cv'
  | 'role'
  | 'documents'
  | 'submit';

export type CV_PARSED = {
  personal_info?: {
    full_name?: string;
    email?: string;
    phone_number?: string;
    adress?: string;
    nationality?: string;
  };
  professional_summary?: string;
  key_skills?: string[];
  employment_history?: {
    current_position?: string;
    soc_code?: string;
    position_start_date?: string;
    company_name?: string;
  };
  education_qualification?:{
    institute?:string;
    degree?:string;
    field_of_study?:string;
    start_date?:string;
    end_date?:string;
  };
  additional_info?:{
    language?:string[];
    info?:string;
  }
}

export interface OnboardingFormData {
  is_in_uk?: boolean;
  uk_postcode?: string;
  uk_street?: string;
  uk_city?: string;
  passport_expiry?: string;
  passport_file?: File | null;

  brp_file?: File | null;
  evisa_file?: File | null;
  visa_expiry?: string;
  rtw_share_code?: string;
  visa_status?: string;
  has_dependents?: boolean;
  target_roles?: number;
  cv_file?: File | null;
  cv_parsed_data?: CV_PARSED | null;
  qualification_documents?: File | null;
  english_language_documents?: File | null;
  specialized_licenses?: File | null;
  training_certificates?: File | null;
  dbs_certificate?: File | null;
  hcwvisa?:boolean;
  confirmAccuracy?: boolean;
  understandVerification?: boolean;
  agreeTerms?: boolean;
  wpc_community_profile?:boolean;
  sponser_ready?:boolean;
  interview_mastery_bootcamp?:boolean;
  executive_career_suite?:boolean;
}

interface OnboardingStore {
  currentStep: OnboardingStep;
  formData: OnboardingFormData;
  completedSteps: OnboardingStep[];
  _hasHydrated: boolean;

  setCurrentStep: (step: OnboardingStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  updateFormData: (data: Partial<OnboardingFormData>) => void;
  markStepCompleted: (step: OnboardingStep) => void;
  isStepCompleted: (step: OnboardingStep) => boolean;
  canAccessStep: (step: OnboardingStep) => boolean;
  resetOnboarding: () => void;
  setHasHydrated: (state: boolean) => void;
}

const stepOrder: OnboardingStep[] = [
  'location',
  'identity',
  'visa',
  'cv',
  'role',
  'documents',
  'submit'
];

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      currentStep: 'location',
      formData: {},
      completedSteps: [],
      _hasHydrated: false,

      setCurrentStep: (step) => {
        const canAccess = get().canAccessStep(step);
        if (canAccess) {
          set({ currentStep: step });
        }
      },

      nextStep: () => {
        const currentIndex = stepOrder.indexOf(get().currentStep);
        if (currentIndex < stepOrder.length - 1) {
          const nextStep = stepOrder[currentIndex + 1];
          get().markStepCompleted(get().currentStep);
          set({ currentStep: nextStep });
        }
      },

      previousStep: () => {
        const currentIndex = stepOrder.indexOf(get().currentStep);
        if (currentIndex > 0) {
          const prevStep = stepOrder[currentIndex - 1];
          set({ currentStep: prevStep });
        }
      },

      updateFormData: (data) => {
        set((state) => ({
          formData: { ...state.formData, ...data }
        }));
      },

      markStepCompleted: (step) => {
        set((state) => {
          if (!state.completedSteps.includes(step)) {
            return {
              completedSteps: [...state.completedSteps, step]
            };
          }
          return state;
        });
      },

      isStepCompleted: (step) => {
        return get().completedSteps.includes(step);
      },

      canAccessStep: (step) => {
        if (step === 'location') return true;

        const stepIndex = stepOrder.indexOf(step);
        const currentIndex = stepOrder.indexOf(get().currentStep);

        if (step === get().currentStep) return true;
        if (get().isStepCompleted(step)) return true;

        if (stepIndex === currentIndex + 1 && get().isStepCompleted(get().currentStep)) {
          return true;
        }

        return false;
      },

      resetOnboarding: () => {
        set({
          currentStep: 'location',
          formData: {},
          completedSteps: []
        });
      },

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      }
    }),
    {
      name: 'onboarding-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        formData: state.formData,
        completedSteps: state.completedSteps,
        currentStep: state.currentStep
      })
    }
  )
);

export { stepOrder };
