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

export default function SelectTargetRolesStep() {
  const { formData, updateFormData, nextStep, previousStep } =
    useOnboardingStore();

  // 🔹 UI-only multiple selection
  const [selectedRoles, setSelectedRoles] = useState<TargetRole[]>([]);
  const [roles, setRoles] = useState<TargetRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const { handleSubmit, setValue } = useForm<TargetRolesForm>();

  useEffect(() => {
    const fetchRoles = async () => {
      const res = await get_target_roles();

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      setRoles(res.data);
      setLoading(false);
    };

    fetchRoles();
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
  };

  const onSubmit = (data: TargetRolesForm) => {
    if (selectedRoles.length === 0) {
      toast.error('Please select at least one sector');
      return;
    }

    updateFormData({
      target_roles: data.target_roles,
    });

    nextStep();
  };

  if (loading) {
    return <PrimaryLoader/>;
  }

  const displayedRoles = roles.slice(0, 20);
  const hasMore = roles.length > 20;

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

            <div className="flex flex-wrap gap-3">
              {displayedRoles.map((role) => {
                const isSelected = selectedRoles.some(
                  (r) => r.id === role.id
                );

                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleSelect(role)}
                    className={`px-4 py-2 rounded-full text-[14px] font-medium transition-all ${
                      isSelected
                        ? 'bg-primary text-white'
                        : 'bg-[#EBEEF2] text-[#201E1E] hover:bg-[#E8E4ED]'
                    }`}
                  >
                    {role.name}
                  </button>
                );
              })}
              
              {hasMore && (
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 rounded-full text-[14px] font-medium bg-[#EBEEF2] text-[#201E1E] hover:bg-[#E8E4ED] transition-all"
                >
                  Read more...
                </button>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[14px] shadow-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-[22px] font-bold text-[#111]">All Roles</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-[#4D4D4D] hover:text-[#111] text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex flex-wrap gap-3">
                {roles.map((role) => {
                  const isSelected = selectedRoles.some(
                    (r) => r.id === role.id
                  );

                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => handleSelect(role)}
                      className={`px-4 py-2 rounded-full text-[14px] font-medium transition-all ${
                        isSelected
                          ? 'bg-primary text-white'
                          : 'bg-[#EBEEF2] text-[#201E1E] hover:bg-[#E8E4ED]'
                      }`}
                    >
                      {role.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}