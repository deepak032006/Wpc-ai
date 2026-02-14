'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useOnboardingStore } from '@/app/store/onboardingStore';
import toast from 'react-hot-toast';
import { get_target_roles } from '@/app/action/onboarding.action';

interface TargetRole {
  id: number;
  name: string;
}

interface TargetRolesForm {
  target_roles: number;
}
function PrimaryLoader() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function SelectTargetRolesStep({roles,setRoles,loading,setLoading}:{roles:TargetRole[],setRoles:(val:TargetRole[])=>void,loading:boolean,setLoading:(val:boolean)=>void}) {
  const { formData, updateFormData, nextStep, previousStep } =
    useOnboardingStore();

  // 🔹 UI-only multiple selection
  const [selectedRoles, setSelectedRoles] = useState<TargetRole[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const { handleSubmit, setValue } = useForm<TargetRolesForm>();

 useEffect(() => {
  const getSelectedRoles = async () => {
    const rolesdata = Array.isArray(formData.target_roles) ? formData.target_roles : [formData.target_roles];
    if (!rolesdata.length || !roles.length) setSelectedRoles([]);
    else {
      const rolemap = roles.filter((value) => 
        rolesdata.includes(value.id)
      );
      setSelectedRoles(rolemap);
    }
  };
  
  getSelectedRoles();
}, []);


  const handleSelect = (role: TargetRole) => {
    let updated: TargetRole[];

    if (selectedRoles.some((r) => r.id === role.id)) {
      updated = selectedRoles.filter((r) => r.id !== role.id);
    } else {
      updated = [...selectedRoles, role];
    }

    setSelectedRoles(updated);
    setValue('target_roles', role.id);
    setSearchQuery('');
  };

  const onSubmit = (data: TargetRolesForm) => {
    if (selectedRoles.length === 0) {
      toast.error('Please select at least one sector');
      return;
    }

    updateFormData({
      target_roles: data.target_roles,
    });

    console.log(formData, data.target_roles)

    nextStep();
  };

  // Filter roles based on search query
  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <PrimaryLoader/>;
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-8">
      <div className="max-w-155 w-full bg-white rounded-[14px] shadow-sm shadow-[#0E3A801F] p-8">
        <h2 className="text-[22px] lg:text-[28px] font-bold text-[#111]">
          Target Roles
        </h2>
        <p className="text-[15px] lg:text-[18px] text-[#4D4D4D] mb-6">
          Select the roles you're interested in Please Choose One
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-[18px] font-medium mb-4">
              Roles
            </label>

            {/* Search Input with Dropdown */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search roles..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => {
                  // Delay to allow click on dropdown items
                  setTimeout(() => setShowDropdown(false), 300);
                }}
                className="w-full px-4 py-3 border border-[#E4E5E8] rounded-lg text-[14px] focus:outline-none focus:border-primary"
              />
              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4D4D4D]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E4E5E8] rounded-lg shadow-lg max-h-[300px] overflow-y-auto z-10">
                  {filteredRoles.length > 0 ? (
                    filteredRoles.map((role) => {
                      const isSelected = selectedRoles.some(
                        (r) => r.id === role.id
                      );

                      return (
                        <button
                          key={role.id}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSelect(role);
                          }}
                          className={`w-full text-left px-4 py-3 text-[14px] hover:bg-[#F5F5F5] transition-all ${
                            isSelected ? 'bg-[#F0F7FF] text-primary font-medium' : 'text-[#201E1E]'
                          }`}
                        >
                          {role.name}
                          {isSelected && (
                            <span className="ml-2 text-primary">✓</span>
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-4 py-3 text-[14px] text-[#4D4D4D]">
                      No roles found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Roles Display */}
            <div className="flex flex-wrap gap-3">
              {selectedRoles.length > 0 ? (
                selectedRoles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleSelect(role)}
                    className="px-4 py-2 rounded-full text-[14px] font-medium transition-all bg-primary text-white"
                  >
                    {role.name}
                  </button>
                ))
              ) : (
                <p className="text-[14px] text-[#4D4D4D]">
                  No roles selected. Use the search bar to find and select roles.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between gap-4 pt-6">
            <button
              type="button"
              onClick={previousStep}
              className="flex-1 border border-[#0A65CC]  text-[#0A65CC] max-w-[200px] py-4 text-[16px] lg:text-[18px] rounded-lg font-semibold"
              >
              Back
            </button>

            <button
              type="submit"
              className="flex-1 bg-primary text-white max-w-[200px] py-4 text-[16px] lg:text-[18px] rounded-lg font-semibold"
                >
              Continue
            </button>
          </div>
        </form>
      </div>
      </div>
  );
}