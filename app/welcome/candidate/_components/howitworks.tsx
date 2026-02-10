"use client";
import Logo from "@/components/logo";
import { useRouter } from "next/navigation";
import { useState } from "react";

const workingData = [
  {
    heading: "Complete your profile",
    explanation:
      "Fill in your personal, professional, and employment details. Upload your CV and a short introduction video.",
  },
  {
    heading: "Automated profile assessment",
    explanation:
      "Our system analyses your experience, role suitability, and sponsorship eligibility indicators (including SOC alignment).",
  },
  {
    heading: "Readiness & eligibility review",
    explanation:
      "Your documents and information are reviewed for sponsorship readiness.",
  },
  {
    heading: "Employer visibility",
    explanation:
      "Once approved, your profile becomes visible to licensed UK employers searching for suitable candidates.",
  },
  {
    heading: "Receive interview requests",
    explanation:
      "Receive and manage interview requests from employers directly in your dashboard.",
  },
  {
    heading: "Structured onboarding support",
    explanation:
      "If you receive an offer, our system automates the document collection and compliance files for your new role.",
  },
  {
    heading: "Sponsorship transition support",
    explanation:
      "We guide the process required to transfer sponsorship to a new licensed employer.",
  },
  {
    heading: "Ongoing compliance support",
    explanation:
      "We support compliance steps required by employers and sponsors to ensure records remain accurate and up to date.",
  },
  {
    heading: "WPC Career Academy",
    explanation:
      "Access expert coaching, CV rewrites, and mock interviews to boost your sponsor-readiness and interview success rates.",
  },
];


const HowitWorks = ({ setIsIntro }) => {
    const [workings, setWorkings] = useState(workingData);
    const router = useRouter();
    return (
        <div>
            <div className="h-270"></div>
            <div className="w-full max-w-[540px] bg-white rounded-[14px] shadow-[0_12px_40px_rgba(14,58,128,0.12)] px-8.75 py-10 mt-[200px]">
                <Logo className="object-contain h-40 w-48.75 mb-2" fontSize={20} />
                <div className="flex flex-col gap-2 font-inter py-2 border-b-2 border-[#C8CED5]">
                    <h1 className="text-[20px] lg:text-[22px] xl:text-[26px] 2xl:text-[30px] font-semibold">
                        How does WPC Jobs work?
                    </h1>

                    <div className="flex flex-col items-center justify-center gap-3 mt-4">
                        {workings.map((item, index) => (
                            <div
                                key={index}
                                className="
    w-full
    border border-[#E4E4E4]
    bg-white
    rounded-lg
    px-4 py-3
    transition-all duration-300 ease-out
    hover:bg-gray-50
    hover:border-[#0A65CC]/90
    hover:scale-[1.03]
  "
                            >
                                <div className="flex items-start gap-3 px-4 py-3.5">
                                    <div className="flex flex-col gap-[2px]">
                                        <h3 className="font-inter font-medium text-[#010101] text-[15px] lg:text-[16px] 2xl:text-[18px]">
                                            {item.heading}
                                        </h3>

                                        <p className="font-sans text-[#424242] text-[14px] lg:text-[14px] 2xl:text-[16px]">
                                            {item.explanation}
                                        </p>
                                    </div>
                                </div>
                            </div>

                        ))}
                    </div>

                </div>

                <div className="w-full flex items-center justify-between pt-4">
                    <button
                        onClick={() => setIsIntro(true)}
                        className="bg-white border border-[#0A65CC] text-[#0A65CC] rounded-lg font-semibold py-3 px-9 hover:bg-blue-50"
                    >
                        Go Back
                    </button>

                    <button className="bg-[#0852C9] hover:bg-[#0852C9]/90 text-white rounded-lg font-semibold py-3 px-9"onClick={()=>{
                        router.push("/auth/login")
                    }}>
                        Get Started
                    </button>
                </div>
            </div>
            <div className="h-30"></div>
        </div>
    );
};

export default HowitWorks;
