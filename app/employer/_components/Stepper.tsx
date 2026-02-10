import { Briefcase, FileText, CreditCard, ClipboardList } from "lucide-react";

const steps = [
  { label: "Job Basics", icon: Briefcase },
  { label: "Job Details", icon: FileText },
  { label: "Pay & Benefits", icon: CreditCard },
  { label: "Describe Job", icon: ClipboardList },
];

export default function JobStepper({ currentStep = 0 }) {
  return (
    <div className="flex items-center justify-between w-full max-w-4xl mx-auto">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div key={step.label} className="flex items-center w-full">
            <div className="flex flex-col items-center relative z-10">
              <div
                className={`flex items-center justify-center  text-[18px] font-medium w-13.25 h-13.25 rounded-full border-2
                  ${
                    isActive
                      ? "border-[#0A65CC] bg-[#E9EBEC] text-[#0A65CC]"
                      : isCompleted
                      ? "border-[#0A65CC] bg-[#0A65CC] text-white"
                      : "border-transparent bg-[#E9EBEC] text-[#565454]"
                  }
                `}
              >
                <Icon size={18} />
              </div>
              <span
                className={`mt-2 text-[16px] 2xl:text-[18px] ${
                  isActive ? "text-[#0A65CC]  font-medium" : "text-[#565454]"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index !== steps.length - 1 && (
              <div
                className={`flex-1 h-[2px] rounded-xs mx-2 ${
                  isCompleted ? "bg-blue-600" : "bg-[#E1E3E5]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
