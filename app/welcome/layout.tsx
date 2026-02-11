"use client";
import { BiBook, BiLock } from "react-icons/bi";
import { GrSecure } from "react-icons/gr";

export default function WelcomeLayout({ children }) {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden">
      {/* Left Panel - Hidden on mobile and small tablets */}
      <div className="hidden overflow-hidden md:flex md:w-[35%] lg:w-[40%] h-screen bg-gradient-to-b from-[#1097F6] to-[#0B4EC2] flex-col items-center justify-center px-6 lg:px-8 py-10">
        <div className="flex flex-col items-start gap-4 lg:gap-6 max-w-[460px]">
          <h1 className="text-white font-semibold text-[20px] lg:text-[24px] leading-tight">
            Sponsor-Ready <br />
            Preparation & <br />
            Compliance Platform
          </h1>

          <p className="text-white/90 text-[13px] lg:text-[15px]">
            We provide preparation, compliance and access support.
          </p>

          <p className="text-white/90 text-[13px] lg:text-[15px]">
            We do not sell jobs.
          </p>

          <ul className="flex flex-col gap-3 lg:gap-4 mt-2">
            <li className="flex items-center gap-3 text-white text-[13px] lg:text-[14px]">
              <span className="w-7 h-7 rounded-full bg-[#0B4EC2] flex items-center justify-center flex-shrink-0">
                <GrSecure size={14} />
              </span>
              UK Sponsor Licence Aligned
            </li>

            <li className="flex items-center gap-3 text-white text-[13px] lg:text-[14px]">
              <span className="w-7 h-7 rounded-full bg-[#0B4EC2] flex items-center justify-center flex-shrink-0">
                <BiBook size={14} />
              </span>
              Ethical & Legal Hiring
            </li>

            <li className="flex items-center gap-3 text-white text-[13px] lg:text-[14px]">
              <span className="w-7 h-7 rounded-full bg-[#0B4EC2] flex items-center justify-center flex-shrink-0">
                <BiLock size={14} />
              </span>
              Data Secure Platform
            </li>
          </ul>
        </div>
      </div>

      {/* Right Panel - Full width on mobile */}
      <div className="w-full  md:w-[65%] lg:w-[60%] h-screen bg-[#FAFAFA] overflow-y-auto px-4 py-6 md:py-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}