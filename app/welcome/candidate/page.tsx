"use client";

import Logo from "@/components/logo";
import { useState } from "react";
import { TiTick } from "react-icons/ti";
import HowitWorks from "./_components/howitworks";
import { useRouter } from "next/navigation";

const Candidate = () => {
  const [isIntro, setIsIntro] = useState(true);
  const router = useRouter();

  return isIntro ? (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-[450px] bg-white rounded-[14px] pt-[32px] pr-[32px] pb-[32px] pl-[32px] shadow-[0_12px_40px_rgba(14,58,128,0.12)]">

        <Logo className="object-contain h-32 w-40 mb-3" fontSize={18} />

        <div className="flex flex-col items-center gap-3 font-inter py-3 border-b-2 border-[#C8CED5]">
          <h1 className="text-[19px] font-semibold">
            Welcome to WPC Jobs
          </h1>

          <p className="text-center text-[#4D4D4D] text-[13px] leading-relaxed">
           We{"'"}re glad you{"'"}ve joined WPC Jobs. This platform is designed to help skilled professionals like you build a sponsor-ready profile and gain visibility with licensed UK employers safely and compliantly.
          </p>

          <p className="text-center text-[#4D4D4D] text-[13px] leading-relaxed">
           The next step is to complete your profile. Once your documents are reviewed, our system will match you with licensed employers actively hiring for roles that fit your expertise.
          </p>
        </div>

        <div className="w-full flex items-center justify-between gap-3 pt-5">
          <button
            onClick={() => setIsIntro(false)}
            className="bg-white border border-[#0A65CC] text-[#0A65CC] rounded-lg font-semibold py-2.5 px-6 hover:bg-blue-50 text-[13px]"
          >
            How it work
          </button>

          <button className="bg-[#0852C9] hover:bg-[#0852C9]/90 text-white rounded-lg font-semibold py-2.5 px-7 text-[13px]" onClick={()=>{
            router.push("/auth/login")
          }}>
            Continue
          </button>
        </div>

      </div>
    </div>
  ) : (
    <HowitWorks setIsIntro={setIsIntro} />
  );
};

export default Candidate;