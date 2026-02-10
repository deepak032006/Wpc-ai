import { get_target_roles } from '@/app/action/onboarding.action';
import { update_candidate_profile } from '@/app/action/candidate.action';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export interface careerPreferences {
    interested_roles: TargetRole[];
    preferred_industries: string;
    preferred_worktype: string;
    preferred_locations: string[];
}

interface CareerPreferencesFormProps {
    data: careerPreferences;
    onUpdate: (field: string, value: any) => void;
    onToggleJobRole: (roleId: number) => void;
}

interface TargetRole {
    id: number;
    code: number | null;
    name: string;
    job_related_names: string[];
}

const CareerPreferencesForm = ({
    data,
    onUpdate,
    onToggleJobRole
}: CareerPreferencesFormProps) => {
    const [jobRolesOptions, setJobRolesOptions] = useState<TargetRole[]>([]);
    const [isLoadingRoles, setIsLoadingRoles] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showAllRoles, setShowAllRoles] = useState(false);

    const INITIAL_DISPLAY_COUNT = 20;

    useEffect(() => {
        fetchTargetRoles();
    }, []);

    const fetchTargetRoles = async () => {
        setIsLoadingRoles(true);
        try {
            const result = await get_target_roles();
            if (result.success && result.data) {
                setJobRolesOptions(result.data);
            }
        } catch (error) {
            console.error('Error fetching target roles:', error);
        } finally {
            setIsLoadingRoles(false);
        }
    };

    const handleSave = async () => {
    setIsSaving(true);
    try {
        const updateData = {
            preferred_industries: data.preferred_industries,
            preferred_work_type: data.preferred_worktype,
            preferred_locations: data.preferred_locations.join(', '),
            interested_roles: data.interested_roles, 
        };

        const result = await update_candidate_profile(updateData);

        if (result.success) {
            toast.success(result.message || 'Preferences saved successfully!');
        } else {
            toast.error(result.message || 'Failed to save preferences');
            console.error('Update failed:', result.detail);
        }
    } catch (error) {
        console.error('Error saving preferences:', error);
        toast.error('An error occurred while saving preferences');
    } finally {
        setIsSaving(false);
    }
};

    const displayedRoles = jobRolesOptions.slice(0, INITIAL_DISPLAY_COUNT);
    const hasMoreRoles = jobRolesOptions.length > INITIAL_DISPLAY_COUNT;

    const RoleButton = ({ role }: { role: TargetRole }) => (
        <button
            key={role.id}
            onClick={() => onToggleJobRole(role.id)}
            disabled={isSaving}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${data.interested_job_roles.includes(role.id)
                ? "bg-[#0852C9] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            {role.name}
        </button>
    );

    return (
        <>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Interested Job Roles
                    </label>
                    {isLoadingRoles ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-wrap gap-2">
                                {displayedRoles.map((role) => (
                                    <RoleButton key={role.id} role={role} />
                                ))}
                            </div>
                            {hasMoreRoles && (
                                <button
                                    onClick={() => setShowAllRoles(true)}
                                    disabled={isSaving}
                                    className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Read more... ({jobRolesOptions.length - INITIAL_DISPLAY_COUNT} more roles)
                                </button>
                            )}
                        </>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Industries
                    </label>
                    <select
                        value={data.preferred_industries}
                        onChange={(e) => onUpdate("preferred_industries", e.target.value)}
                        disabled={isSaving}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="">Select industry</option>
                        <option value="Technology">Technology</option>
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Work Type
                    </label>
                    <select
                        value={data.preferred_worktype}
                        onChange={(e) => onUpdate("preferred_worktype", e.target.value)}
                        disabled={isSaving}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="">Select work type</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Remote">Remote</option>
                        <option value="On-site">On-site</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Locations
                    </label>
                    <input
                        type="text"
                        value={data.preferred_locations.join(", ")}
                        onChange={(e) =>
                            onUpdate(
                                "preferred_locations",
                                e.target.value.split(",").map((loc) => loc.trim()).filter(loc => loc !== "")
                            )
                        }
                        disabled={isSaving}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="London, Manchester, Birmingham"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Separate multiple locations with commas
                    </p>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2.5 bg-[#0852C9] hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSaving && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        )}
                        {isSaving ? "Saving..." : "Save Preferences"}
                    </button>
                </div>
            </div>

            {/* Modal for all roles */}
            {/* Modal for all roles */}
            {showAllRoles && (
                <div
                    className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowAllRoles(false)}
                >
                    <div
                        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                All Job Roles ({jobRolesOptions.length})
                            </h3>
                            <button
                                onClick={() => setShowAllRoles(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="px-6 py-4 overflow-y-auto flex-1">
                            {/* Selected Roles Section */}
                            {data.interested_job_roles.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Roles</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {jobRolesOptions
                                            .filter(role => data.interested_job_roles.includes(role.id))
                                            .map((role) => (
                                                <RoleButton key={role.id} role={role} />
                                            ))}
                                    </div>
                                    <div className="border-t border-gray-200 my-4"></div>
                                </div>
                            )}

                            {/* All Other Roles */}
                            <div>
                                {data.interested_job_roles.length > 0 && (
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">All Roles</h4>
                                )}
                                <div className="flex flex-wrap gap-2">
                                    {jobRolesOptions
                                        .filter(role => !data.interested_job_roles.includes(role.id))
                                        .map((role) => (
                                            <RoleButton key={role.id} role={role} />
                                        ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                            <p className="text-sm text-gray-600">
                                {data.interested_job_roles.length} role(s) selected
                            </p>
                            <button
                                onClick={() => setShowAllRoles(false)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CareerPreferencesForm;