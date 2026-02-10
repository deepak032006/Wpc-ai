import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { LuClipboard } from 'react-icons/lu';
import { MdLock } from 'react-icons/md';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Hidden on mobile and small tablets */}
      <div 
        className="hidden md:flex md:w-[40%] lg:w-[35%] bg-gradient-to-b from-secondary to-primary text-white p-6 lg:p-12 flex-col justify-between fixed left-0 top-0 h-screen"
      >
        <div className='flex flex-col justify-center h-full'>
          <h1 className="text-2xl lg:text-3xl font-bold mb-3 lg:mb-4 leading-tight">
            Sponsor-Ready<br />
            Preparation &<br />
            Compliance Platform
          </h1>
          <p className="text-[15px] lg:text-lg mb-2">
            We provide preparation, compliance and access support.
          </p>
          <p className="text-[15px] lg:text-lg font-semibold">
            We do not sell jobs.
          </p>
          
          <div className="mt-8 lg:mt-12 space-y-3 lg:space-y-4">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="flex bg-primary p-1.5 lg:p-2 rounded-full flex-shrink-0">
                <FiCheckCircle className="size-3.5 lg:size-4 text-white/90" />
              </div>
              <span className="text-[14px] lg:text-base">UK Sponsor Licence Aligned</span>
            </div>
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="flex bg-primary p-1.5 lg:p-2 rounded-full flex-shrink-0">
                <LuClipboard className="size-3.5 lg:size-4 text-white/90" />
              </div>
              <span className="text-[14px] lg:text-base">Ethical & Legal Hiring</span>
            </div>
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="flex bg-primary p-1.5 lg:p-2 rounded-full flex-shrink-0">
                <MdLock className="size-3.5 lg:size-4 text-white/90" />
              </div>
              <span className="text-[14px] lg:text-base">Data Secure Platform</span>
            </div>
          </div>
        </div>

        <div className="text-xs lg:text-sm opacity-80">
          © 2025 WorkPermitCloud. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Full width on mobile */}
      <div className="w-full md:w-[60%] lg:w-[65%] md:ml-[40%] lg:ml-[35%] min-h-screen">
        {children}
      </div>
    </div>
  );
}