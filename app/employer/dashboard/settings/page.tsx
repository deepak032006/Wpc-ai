'use client'
import React, { useState } from 'react';
import Plan_billing from '../pricing/page';

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <img 
            src="/settingicon.png" 
            alt="Settings" 
            className="w-8 h-8 mt-1"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your account information and preferences</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-4">
          <button
            onClick={() => setActiveTab('account')}
            className={`px-5.75 py-3.75 text-[18px] text-base font-medium transition-colors rounded-lg ${
              activeTab === 'account'
                ? 'bg-[#CFE5FE] text-[#0852C9] font-semibold shadow-sm shadow-[#00000012]'
                : 'text-[#000000A1] hover:text-[#000000A1]'
            }`}
          >
            Account Settings
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-5.75 py-3.75 text-[18px] text-base font-medium transition-colors rounded-lg ${
              activeTab === 'billing'
                ? 'bg-[#CFE5FE] text-[#0852C9] font-semibold shadow-sm shadow-[#00000012]'
                : 'text-[#000000A1] hover:text-[#000000A1]'
            }`}
          >
            Plan&Billing
          </button>
        </div>

        {/* Content */}
        {activeTab !== 'billing' && (<div className="bg-white border border-[#EAECF0] rounded-lg shadow-xs">
          <div className="px-5.5 py-6">
            {/* Profile Information Header */}
            <h2 className="text-lg font-semibold text-[#0852C9] mb-8">Profile Information</h2>

            {/* Profile Picture and Name */}
            <div className="flex items-center gap-4 mb-10">
              <img 
                src="/man.jpg" 
                alt="Profile" 
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
              <div>
                <div className="text-[20px] font-semibold text-[#000000]">Olivia</div>
                <div className="text-[16px] text-[#000000]">olivia123@gmail.com</div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-8">
              {/* Full Name */}
              <div>
                <label className="block text-[18px] font-medium text-[21272A] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="Olivia"
                  className="w-full px-3.5 py-3 border border-[#D0D5DD] rounded-md text-[16px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[18px] font-medium text-[21272A] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="olivia123@gmail.com"
                  className='w-full px-3.5 py-3 border border-[#D0D5DD] rounded-md text-[16px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[18px] font-medium text-[21272A] mb-2">
                  Password
                </label>
                <input
                  type="text"
                  placeholder="Change password"
                 className='w-full px-3.5 py-3 border border-[#D0D5DD] rounded-md text-[16px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
              </div>

              {/* Account Type */}
              <div>
                <label className="block text-[18px] font-medium text-[21272A] mb-2">
                  Account Type
                </label>
                <div className="relative">
                  <select
                    defaultValue="renter"
                   className='w-full px-3.5 py-3 border border-[#D0D5DD] rounded-md text-[16px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                   >
                    <option value="home-owner">Employer</option>
                    <option value="renter">Candidate</option>
                  </select>
             
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-10">
              <button className="px-6.25 py-4 bg-[#0852C9] text-white text-[16px] font-medium rounded-md hover:bg-[#0852C9] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Save Changes
              </button>
            </div>
          </div>
        </div>)}
        {activeTab === 'billing' && <Plan_billing/>}
      </div>
    </div>
  );
}