"use client";
import Image from "next/image";

const ShimmerLoader = () => {
  return (
    <div className="w-full min-h-screen px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 flex flex-col items-center gap-3 xs:gap-4 sm:gap-5 md:gap-6 font-sans">
    
      <div className="w-14 h-14 xs:w-16 xs:h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-22 lg:h-22 flex items-center justify-center rounded-full bg-gradient-to-br from-[#0A65CC] to-[#1EA0E8] via-[#387FF2] shadow-lg">
        <svg className="w-5 h-5 xs:w-6 xs:h-6 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      </div>

      
      <div className="text-center px-2 xs:px-4 sm:px-6 max-w-full">
        <h2 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-[#161616] tracking-tight">
          Almost there… polishing the final details
        </h2>
      </div>
      

      <div className="w-[85%] xs:w-[80%] sm:w-[75%] md:w-[95%] lg:w-[95%] xl:w-[90%] 2xl:w-[85%] xl:max-w-2xl h-2.5 xs:h-3 sm:h-3.5 md:h-4 bg-gray-100 rounded-full overflow-hidden relative">
        <div className="absolute top-0 left-0 h-full w-[75%] bg-gradient-to-r from-[#0A65CC] to-[#1EA0E8] via-[#387FF2] rounded-full animate-pulse" />
      </div>

        <div className="text-center px-2 xs:px-4 sm:px-6 max-w-full">
        <p className="text-xs xs:text-xs sm:text-sm md:text-base lg:text-lg text-[#211F1F] ">
          Generating with AI <span className="mx-1">•</span> This may take a few seconds
        </p>
      </div>

      
      <div className="w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl bg-white rounded-lg xs:rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 mt-2">
        <div className="flex flex-col gap-2.5 xs:gap-3 sm:gap-3.5 md:gap-4 lg:gap-5">
          
          
          <div className="flex items-center gap-2 xs:gap-3 sm:gap-3.5 md:gap-4 lg:gap-5">
            <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-lg skeleton-shimmer flex-shrink-0" />
            <div className="h-2.5 xs:h-3 sm:h-3.5 md:h-4 lg:h-5 rounded-md skeleton-shimmer w-full max-w-[50%] xs:max-w-[55%] sm:max-w-[60%] md:max-w-[65%]" />
          </div>
          <div className="h-2.5 xs:h-3 sm:h-3.5 md:h-4 lg:h-5 rounded-md skeleton-shimmer w-full max-w-[45%] xs:max-w-[50%] sm:max-w-[55%] md:max-w-[60%]" />

          <div className="flex flex-col gap-2 xs:gap-2.5 sm:gap-3 md:gap-3.5 lg:gap-4 mt-2 sm:mt-3 md:mt-4">
            <div className="text-xs xs:text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-0.5 sm:mb-1">Job Overview</div>
            <div className="h-2.5 xs:h-3 sm:h-3.5 md:h-4 lg:h-4.5 rounded-full skeleton-shimmer w-full" />
            <div className="h-2.5 xs:h-3 sm:h-3.5 md:h-4 lg:h-4.5 rounded-full skeleton-shimmer w-[90%] sm:w-[92%] md:w-[90%]" />
            <div className="h-2.5 xs:h-3 sm:h-3.5 md:h-4 lg:h-4.5 rounded-full skeleton-shimmer w-[70%] sm:w-[75%] md:w-[70%]" />
          </div>
          
          
          <div className="flex flex-col gap-2 xs:gap-2.5 sm:gap-3 md:gap-3.5 lg:gap-4 mt-2 sm:mt-3 md:mt-4">
            <div className="text-xs xs:text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-0.5 sm:mb-1">Responsibilities</div>
            <div className="h-2.5 xs:h-3 sm:h-3.5 md:h-4 lg:h-4.5 rounded-full skeleton-shimmer w-full" />
            <div className="h-2.5 xs:h-3 sm:h-3.5 md:h-4 lg:h-4.5 rounded-full skeleton-shimmer w-[85%] sm:w-[87%] md:w-[85%]" />
            <div className="h-2.5 xs:h-3 sm:h-3.5 md:h-4 lg:h-4.5 rounded-full skeleton-shimmer w-[75%] sm:w-[77%] md:w-[75%]" />
            <div className="h-2.5 xs:h-3 sm:h-3.5 md:h-4 lg:h-4.5 rounded-full skeleton-shimmer w-[55%] sm:w-[57%] md:w-[55%]" />
          </div>
          
          <div className="flex flex-col gap-2.5 xs:gap-3 sm:gap-3.5 md:gap-4 lg:gap-5 mt-2 sm:mt-3 md:mt-4">
            <div className="text-xs xs:text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900">Skills</div>
            <div className="flex gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-3 lg:gap-3.5 flex-wrap">
              <div className="h-7 xs:h-8 sm:h-9 md:h-10 lg:h-11 w-16 xs:w-18 sm:w-20 md:w-24 lg:w-28 rounded-full skeleton-shimmer" />
              <div className="h-7 xs:h-8 sm:h-9 md:h-10 lg:h-11 w-20 xs:w-22 sm:w-24 md:w-28 lg:w-32 rounded-full skeleton-shimmer" />
              <div className="h-7 xs:h-8 sm:h-9 md:h-10 lg:h-11 w-16 xs:w-18 sm:w-20 md:w-24 lg:w-28 rounded-full skeleton-shimmer" />
              <div className="h-7 xs:h-8 sm:h-9 md:h-10 lg:h-11 w-24 xs:w-26 sm:w-28 md:w-32 lg:w-36 rounded-full skeleton-shimmer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShimmerLoader;