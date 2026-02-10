'use client';

import { ArrowUpRight, CheckCircle, CreditCard, Save } from "lucide-react";
import { FaBoltLightning } from "react-icons/fa6";

export default function Plan_billing() {
  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 w-full mx-auto px-3 sm:px-4 md:px-0">
      {/* Current Plan */}
      <div className="w-full h-fit flex flex-col items-start border-[1px] border-[#EAECF0] rounded-[8px] p-2 sm:p-3 md:p-4">

        <div className="w-full border-b-[2px] border-[#d9dbdf] p-3 sm:p-4 md:p-6 bg-white">
          <h3 className="text-[#0852C9] text-[16px] sm:text-[18px] md:text-[20px] font-semibold mb-[3px] md:mb-[5px]">Current Plan</h3>
          <p className="text-[#0000009E] text-[12px] sm:text-[14px] md:text-[16px] font-medium mb-2 sm:mb-3 md:mb-4">
            Manage your subscription and billing preferences.
          </p>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-3 lg:space-y-0">
            {/* Left info */}
            <div>
              <div className="flex space-x-2 mb-2">
                <span className="bg-[#0852C9] hover:bg-[#1D4ED8] w-[75px] sm:w-[90px] md:w-[110px] h-[28px] sm:h-[32px] md:h-[36px] cursor-pointer text-white text-[12px] sm:text-[14px] md:text-[16px] font-medium flex items-center justify-center rounded-full">
                  Pro
                </span>
                <span className="border border-[#0852C9] hover:bg-[#0852C9] text-[#0852C9] w-[75px] sm:w-[90px] md:w-[110px] h-[28px] sm:h-[32px] md:h-[36px] cursor-pointer hover:text-white text-[12px] sm:text-[14px] md:text-[16px] font-medium flex items-center justify-center rounded-full">
                  Active
                </span>
              </div>
              <p className="text-[#0000009E] text-[12px] sm:text-[14px] md:text-[16px]">
                Next Billing: March 15, 2024
              </p>
              <p className="text-[#00000099] text-[12px] sm:text-[14px] md:text-[16px]">$19.00/month</p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col xs:flex-row w-full lg:w-auto space-y-2 xs:space-y-0 xs:space-x-2 md:space-x-3">
              <button className="bg-[#EFF6FF] text-[#0852C9] px-2 sm:px-2.5 md:px-4 py-2 sm:py-2.5 md:py-2 rounded-[8px] cursor-pointer flex items-center justify-center space-x-1 text-[11px] xs:text-xs sm:text-sm md:text-base whitespace-nowrap">
                <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Manage Subscription</span>
              </button>
              <button className="bg-[#0852C9] text-white px-2 sm:px-2.5 md:px-4 py-2 sm:py-2.5 md:py-2 rounded-[8px] cursor-pointer flex items-center justify-center space-x-1 text-[11px] xs:text-xs sm:text-sm md:text-base whitespace-nowrap">
                <FaBoltLightning className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Upgrade Plan</span>
              </button>
            </div>
          </div>
        </div>

        {/* Billing Information */}
        <div className="w-full p-3 sm:p-4 md:p-6 bg-white">
          <h3 className="text-[#0852C9] text-[16px] sm:text-[18px] md:text-[20px] font-semibold mb-1">Billing Information</h3>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mt-2 space-y-2 lg:space-y-0">
            <p className="text-[#0000009E] text-[12px] sm:text-[14px] md:text-[16px] flex items-center space-x-2">
              <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              <span>
                Visa •••• 1234
                <br />
                <span className="text-[10px] sm:text-xs md:text-sm text-gray-500">Expires 12/25</span>
              </span>
            </p>
            <button className="bg-[#0852C9] text-white px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-1 md:py-2 rounded-[8px] flex items-center space-x-1 text-[11px] xs:text-xs sm:text-sm md:text-base whitespace-nowrap">
              <FaBoltLightning className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Upgrade Payment Method</span>
            </button>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className="border-[1px] border-[#EAECF0] rounded-[8px] p-3 sm:p-4 md:p-6 bg-white">
        <h3 className="text-[#0852C9] text-[16px] sm:text-[18px] md:text-[20px] font-semibold mb-1">Available Plans</h3>
        <p className="text-[#0000009E] text-[12px] sm:text-[14px] md:text-[16px] mb-4 md:mb-6">
          Choose the plan that best fit your needs.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {/* Free */}
          <div className="border-[1.5px] border-[#0852C94A] rounded-[16px] sm:rounded-[20px] md:rounded-[24px] w-full h-auto p-[20px_16px] sm:p-[24px_18px] md:p-[32px_24px] flex flex-col items-start gap-3 sm:gap-3.5 md:gap-4 shadow-sm transition-all duration-500 ease-in-out hover:bg-gradient-to-b hover:from-[#3371D6] hover:to-[#103CA4] hover:text-white group">
            <h4 className="text-[14px] sm:text-[15px] md:text-[16px] text-[#000000CC] font-semibold transition-colors duration-500 ease-in-out group-hover:text-white">Free</h4>
            <p className="flex items-baseline gap-1 transition-colors duration-500 ease-in-out group-hover:text-white">
              <span className="text-[28px] sm:text-[32px] md:text-[36px] text-[#000000CC] font-extrabold leading-[100%] tracking-[0.02em] transition-colors duration-500 ease-in-out group-hover:text-white">$0</span>
              <span className="text-[12px] sm:text-[13px] md:text-[14px] text-[#000000AB] transition-colors duration-500 ease-in-out group-hover:text-white">per month</span>
            </p>
            <ul className="text-[11px] sm:text-xs md:text-sm text-gray-700 space-y-1.5 sm:space-y-2 w-full flex flex-col items-start transition-colors duration-500 ease-in-out group-hover:text-white">
              <li className="flex items-center justify-start space-x-1">
                <CheckCircle className="text-blue-600 w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors duration-500 ease-in-out group-hover:text-white flex-shrink-0" /> <span>5 projects</span>
              </li>
              <li className="flex items-center justify-start space-x-1">
                <CheckCircle className="text-blue-600 w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors duration-500 ease-in-out group-hover:text-white flex-shrink-0" /> <span>Basic support</span>
              </li>
              <li className="flex items-center justify-start space-x-1">
                <CheckCircle className="text-blue-600 w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors duration-500 ease-in-out group-hover:text-white flex-shrink-0" /> <span>Unlimited storage</span>
              </li>
            </ul>
            <button className="w-full h-[36px] sm:h-[38px] md:h-[40px] bg-[#EFF6FF] text-blue-700 rounded-[8px] text-[12px] sm:text-[14px] md:text-base transition-all duration-500 ease-in-out group-hover:bg-white group-hover:text-blue-700">
              Free Plan
            </button>
          </div>

          {/* Pro */}
          <div className="border-[1.5px] border-[#60A5FA] rounded-[16px] sm:rounded-[20px] md:rounded-[24px] w-full h-auto p-[20px_16px] sm:p-[24px_18px] md:p-[32px_24px] flex flex-col items-start gap-3 sm:gap-3.5 md:gap-4 shadow-sm relative bg-gradient-to-b from-[#3371D6] to-[#103CA4] text-white transition-all duration-500 ease-in-out">
            <h4 className="text-[14px] sm:text-[15px] md:text-[16px] font-semibold">Pro</h4>
            <p className="flex items-baseline gap-1">
              <span className="text-[28px] sm:text-[32px] md:text-[36px] font-extrabold leading-[100%] tracking-[0.02em]">$19</span>
              <span className="text-[12px] sm:text-[13px] md:text-[14px]">per month</span>
            </p>
            <span className="absolute top-[20px] sm:top-[24px] md:top-[32px] right-[16px] sm:right-[18px] md:right-[24px] w-[85px] sm:w-[90px] md:w-[95px] h-[24px] sm:h-[26px] md:h-[27px] bg-white text-blue-600 text-[10px] sm:text-[11px] md:text-xs font-medium flex items-center justify-center px-2 py-[6px] rounded-[8px]">
              Most Popular
            </span>
            <ul className="text-[11px] sm:text-xs md:text-sm space-y-1.5 sm:space-y-2 w-full flex flex-col items-start">
              <li className="flex items-center justify-start space-x-1">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" /> <span>Unlimited projects</span>
              </li>
              <li className="flex items-center justify-start space-x-1">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" /> <span>Priority support</span>
              </li>
              <li className="flex items-center justify-start space-x-1">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" /> <span>100GB storage</span>
              </li>
            </ul>
            <button className="w-full h-[36px] sm:h-[38px] md:h-[40px] bg-white text-blue-700 rounded-[8px] font-medium text-[12px] sm:text-[14px] md:text-base transition-all duration-500 ease-in-out">
              Pro Plan
            </button>
          </div>

          {/* Enterprise */}
          <div className="border-[1.5px] border-[#0852C94A] rounded-[16px] sm:rounded-[20px] md:rounded-[24px] w-full h-auto p-[20px_16px] sm:p-[24px_18px] md:p-[32px_24px] flex flex-col items-start gap-3 sm:gap-3.5 md:gap-4 shadow-sm transition-all duration-500 ease-in-out hover:bg-gradient-to-b hover:from-[#3371D6] hover:to-[#103CA4] hover:text-white group">
            <h4 className="text-[14px] sm:text-[15px] md:text-[16px] text-[#000000CC] font-semibold transition-colors duration-500 ease-in-out group-hover:text-white">Enterprise</h4>
            <p className="flex items-baseline gap-1 transition-colors duration-500 ease-in-out group-hover:text-white">
              <span className="text-[28px] sm:text-[32px] md:text-[36px] text-[#000000CC] font-extrabold leading-[100%] tracking-[0.02em] transition-colors duration-500 ease-in-out group-hover:text-white">$99</span>
              <span className="text-[12px] sm:text-[13px] md:text-[14px] text-[#000000AB] transition-colors duration-500 ease-in-out group-hover:text-white">per month</span>
            </p>
            <ul className="text-[11px] sm:text-xs md:text-sm text-gray-700 space-y-1.5 sm:space-y-2 w-full flex flex-col items-start transition-colors duration-500 ease-in-out group-hover:text-white">
              <li className="flex items-center justify-start space-x-1">
                <CheckCircle className="text-blue-600 w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors duration-500 ease-in-out group-hover:text-white flex-shrink-0" /> <span>Everything in Pro</span>
              </li>
              <li className="flex items-center justify-start space-x-1">
                <CheckCircle className="text-blue-600 w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors duration-500 ease-in-out group-hover:text-white flex-shrink-0" /> <span>24/7 phone support</span>
              </li>
              <li className="flex items-center justify-start space-x-1">
                <CheckCircle className="text-blue-600 w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors duration-500 ease-in-out group-hover:text-white flex-shrink-0" /> <span>Unlimited storage</span>
              </li>
            </ul>
            <button className="w-full h-[36px] sm:h-[38px] md:h-[40px] bg-[#EFF6FF] text-blue-700 rounded-[8px] text-[12px] sm:text-[14px] md:text-base transition-all duration-500 ease-in-out group-hover:bg-white group-hover:text-blue-700">
              Upgrade To Enterprise
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}