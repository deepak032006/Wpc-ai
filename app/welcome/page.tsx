"use client";
import Logo from "@/components/logo";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { BiUser } from "react-icons/bi";
import { LuBuilding2 } from "react-icons/lu";

export default function WelcomePage() {
  const router = useRouter();
  const { currentChoosed, setCurrentChoosed } = useAuth();

  return (
    <div className="w-full max-w-[540px] bg-white rounded-[10px] md:rounded-[14px] shadow-[0_8px_24px_rgba(14,58,128,0.08)] md:shadow-[0_12px_40px_rgba(14,58,128,0.12)] px-5 py-6 md:px-8 md:py-10 mx-auto">
      
      {/* Logo */}
      <Logo 
        className="object-contain h-24 w-32 md:h-32 lg:h-40 md:w-40 lg:w-48 mb-4 md:mb-2 mx-auto md:mx-0" 
        fontSize={16} 
      />

      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-[20px] md:text-[24px] lg:text-[26px] 2xl:text-[30px] font-semibold text-[#1A1A1A]">
          Welcome to WPC Jobs
        </h1>
        <p className="text-[#4D4D4D] text-[13px] md:text-[14px] mt-1">
          Sign in to your account
        </p>
      </div>

      {/* Selection Label */}
      <p className="font-medium text-[14px] md:text-[15px] mb-3 text-[#1A1A1A]">
        I am a..
      </p>

      {/* Selection Buttons */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <button
          onClick={() => {
            setCurrentChoosed("candidate");
            router.push("/welcome/candidate");
          }}
          className="border-2 border-[#D0D5DD] rounded-[8px] md:rounded-[9.25px] flex flex-col items-center py-5 md:py-6 gap-2 md:gap-3 hover:border-[#0852C9] hover:bg-[#F8FAFF] transition-all duration-200 active:scale-95"
        >
          <BiUser size={22} className="text-[#123EB7] md:w-[25px] md:h-[25px]" />
          <span className="text-[13px] md:text-[14px] font-medium text-[#1A1A1A]">
            Candidate
          </span>
        </button>

        <button
          onClick={() => {
            setCurrentChoosed("employer");
            router.push("/welcome/employer");
          }}
          className="border-2 border-[#D0D5DD] rounded-[8px] md:rounded-[9.25px] flex flex-col items-center py-5 md:py-6 gap-2 md:gap-3 hover:border-[#0852C9] hover:bg-[#F8FAFF] transition-all duration-200 active:scale-95"
        >
          <LuBuilding2 size={22} className="text-[#123EB7] md:w-[25px] md:h-[25px]" />
          <span className="text-[13px] md:text-[14px] font-medium text-[#1A1A1A]">
            Employer
          </span>
        </button>
      </div>
    </div>
  );
}