import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OnboardingStep =
  | "account"
  | "company"
  | "operations"
  | "support"
  | "complete" | "success";

export const stepOrder: OnboardingStep[] = [
  "account",
  "company",
  "operations",
  "support",
  "complete"
];

export type KeyPosition = {
  title: string;
  name: string;
};
export interface OnboardingFormData {
  company_name?: string;
  company_number?: string;
  registered_address?: string;
  company_type?: string;
  sic_codes?: string[];
  sponsor_license_status?: string;
  sponsor_license_type?: string;

  staff_count?: string;
  company_website?: string;
  key_positions?: KeyPosition[];

  wants_consultation?: boolean;
  consultation_datetime?: string;
  agreeTerms?: boolean;
  is_submitted?: boolean;
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
  completeOnboarding: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      currentStep: "account",
      formData: {},
      completedSteps: [],
      _hasHydrated: false,

      setCurrentStep: (step) => {
        if (get().canAccessStep(step)) {
          set({ currentStep: step });
        }
      },

      nextStep: () => {
        const currentIndex = stepOrder.indexOf(get().currentStep);
        if (currentIndex < stepOrder.length - 1) {
          get().markStepCompleted(get().currentStep);
          set({ currentStep: stepOrder[currentIndex + 1] });
        }
      },

      previousStep: () => {
        const currentIndex = stepOrder.indexOf(get().currentStep);
        if (currentIndex > 0) {
          set({ currentStep: stepOrder[currentIndex - 1] });
        }
      },

      updateFormData: (data) => {
        set((state) => ({
          formData: { ...state.formData, ...data },
        }));
      },

      markStepCompleted: (step) => {
        set((state) =>
          state.completedSteps.includes(step)
            ? state
            : { completedSteps: [...state.completedSteps, step] },
        );
      },

      isStepCompleted: (step) => {
        return get().completedSteps.includes(step);
      },

      canAccessStep: (step) => {
        if (step === get().currentStep) return true;

        const stepIndex = stepOrder.indexOf(step);
        const currentIndex = stepOrder.indexOf(get().currentStep);

        if (get().isStepCompleted(step)) return true;

        return (
          stepIndex === currentIndex + 1 &&
          get().isStepCompleted(get().currentStep)
        );
      },

      resetOnboarding: () => {
        set({
          currentStep: "account",
          formData: {},
          completedSteps: [],
        });
      },

      completeOnboarding: () => {
        set({
          currentStep: "success",
          formData: {},
          completedSteps: [],
        });
      },

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },
    }),
    {
      name: "onboarding-storage",
      partialize: (state) => ({
        currentStep: state.currentStep,
        formData: state.formData,
        completedSteps: state.completedSteps,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
