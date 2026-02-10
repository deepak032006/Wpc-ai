"use client";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, User, FileText, Briefcase, CreditCard, Target } from "lucide-react";
import PersonalInfoForm, { personalInfo } from "../../components/personalInfo";
import ResumeManagementForm, { Resume } from "../../components/resumeUpdate";
import PortfolioManagementForm, { portfolio } from "../../components/portfolioUpdate";
import PassportDetailsForm, { passportDetails } from "../../components/passportDetails";
import CareerPreferencesForm, { careerPreferences } from "../../components/careerPreferences";
import { get_candidate_profile } from "@/app/action/candidate.action";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ProfileType {
    personalInfo: personalInfo;
    resumeFile: Resume;
    portfolio: portfolio;
    passportDetails: passportDetails;
    careerPreferences: careerPreferences;
}

const ProfilePage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [percentage, setPercentage] = useState(0);
    const [formData, setFormData] = useState<ProfileType>({
        personalInfo: {
            preferred_industries: "",
            preferred_worktype: "",
            full_name: "",
            email_address: "",
            phone_number: "",
            nationality: "",
            location: "",
        },
        resumeFile: {
            resume: null,
        },
        portfolio: {
            url: [],
            description: "",
        },
        passportDetails: {
            preferred_industries: "",
            preferred_worktype: "",
            passport_number: "",
            country_of_issue: "",
            expiry_date: "",
            passport: null,
        },
        careerPreferences: {
            interested_job_roles: [],
            preferred_industries: "",
            preferred_worktype: "",
            preferred_locations: [],
        },
    });

    const [expandedSections, setExpandedSections] = useState({
        personalInfo: false,
        resumeManagement: false,
        portfolioManagement: false,
        passportDetails: false,
        careerPreferences: false,
    });

    const calculateProfileCompleteness = (data: any) => {
        const fields = [
            data.full_name,
            data.email,
            data.phone_number,
            data.nationality,
            data.location,
            data.preferred_industries,
            data.preferred_work_type,
            data.preferred_locations,
            data.resume,
            data.passport_number,
            data.passport_country,
            data.passport_expiry,
            data.passport_document,
        ];
        
        const arrayFields = [
            data.portfolio?.length > 0,
            data.interested_roles?.length > 0,
        ];

        const filledFields = fields.filter(field => field && field !== "").length;
        const filledArrayFields = arrayFields.filter(field => field).length;
        const totalFields = fields.length + arrayFields.length;
        
        return Math.round(((filledFields + filledArrayFields) / totalFields) * 100);
    };

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await get_candidate_profile();

            if (response.success) {
                const data = response.data;
                
                // Calculate profile completeness
                const completeness = calculateProfileCompleteness(data);
                setPercentage(completeness);

                // Map API data to form structure
                setFormData({
                    personalInfo: {
                        full_name: data.full_name || "",
                        email_address: data.email || "",
                        phone_number: data.phone_number || "",
                        nationality: data.nationality || "",
                        location: data.location || "",
                        preferred_industries: data.preferred_industries || "",
                        preferred_worktype: data.preferred_work_type || "",
                    },
                    resumeFile: {
                        resume: data.resume || null,
                    },
                    portfolio: {
                        // Map portfolio array to expected format
                        url: Array.isArray(data.portfolio) 
                            ? data.portfolio.map((p: any) => ({
                                type: p.link_type || "",
                                link: p.url || ""
                            }))
                            : [],
                        // Use description from first portfolio item if available
                        description: Array.isArray(data.portfolio) && data.portfolio.length > 0
                            ? data.portfolio[0].description || ""
                            : "",
                    },
                    passportDetails: {
                        passport_number: data.passport_number || "",
                        country_of_issue: data.passport_country || "",
                        expiry_date: data.passport_expiry || "",
                        passport: data.passport_document || null,
                        preferred_industries: data.preferred_industries || "",
                        preferred_worktype: data.preferred_work_type || "",
                    },
                    careerPreferences: {
                        // Extract role names from interested_roles array of objects
                        interested_job_roles: Array.isArray(data.interested_roles)
                            ? data.interested_roles.map((role: any) => role.name || role)
                            : [],
                        preferred_industries: data.preferred_industries || "",
                        preferred_worktype: data.preferred_work_type || "",
                        preferred_locations: Array.isArray(data.preferred_locations) 
                            ? data.preferred_locations 
                            : (data.preferred_locations ? data.preferred_locations.split(',').map((loc: string) => loc.trim()) : []),
                    },
                });
            } else {
                if (response.detail === "Authentication credentials were not provided.") {
                    toast.error('Session expired. Please login again.');
                    router.push('/welcome');
                } else {
                    toast.error(response.message || 'Failed to load profile');
                }
            }
        } catch (error) {
            console.error('Profile fetch error:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleInputChange = (
        section: keyof ProfileType,
        field: string,
        value: any
    ) => {
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    };

    const handleFileChange = (
        section: keyof ProfileType,
        field: string,
        file: File | null
    ) => {
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: file,
            },
        }));
    };

    const addPortfolioLink = (link: { type: string; link: string }) => {
        setFormData((prev) => ({
            ...prev,
            portfolio: {
                ...prev.portfolio,
                url: [...prev.portfolio.url, link],
            },
        }));
    };

    const removePortfolioLink = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            portfolio: {
                ...prev.portfolio,
                url: prev.portfolio.url.filter((_, i) => i !== index),
            },
        }));
    };

    const toggleJobRole = (role: string) => {
        setFormData((prev) => {
            const currentRoles = prev.careerPreferences.interested_job_roles;
            const newRoles = currentRoles.includes(role)
                ? currentRoles.filter((r) => r !== role)
                : [...currentRoles, role];
            return {
                ...prev,
                careerPreferences: {
                    ...prev.careerPreferences,
                    interested_job_roles: newRoles,
                },
            };
        });
    };

    const handleSaveSection = (section: string) => {
        console.log(`Saving ${section}:`, formData);
        // Add your API call here
    };

    if (loading) {
        return (
            <div className="bg-[#FFFFFF] min-h-screen p-9 font-sans">
                <div className="w-full">
                    <div className="bg-white rounded-md border border-[#D0D5DD] py-5.5 px-6 mb-[20px] animate-pulse">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex-1">
                                <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 w-64 bg-gray-200 rounded"></div>
                            </div>
                            <div className="h-8 w-16 bg-gray-200 rounded"></div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mt-5"></div>
                    </div>

                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="bg-white rounded-md border border-[#D0D5DD] mb-[20px] animate-pulse">
                            <div className="w-full flex items-center justify-between py-5.5 px-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-15 h-15 bg-gray-200 rounded-[6px]"></div>
                                    <div>
                                        <div className="h-5 w-48 bg-gray-200 rounded mb-2"></div>
                                    </div>
                                </div>
                                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#FFFFFF] min-h-screen p-9 font-sans">
            <div className="w-full">
                <div className="bg-white rounded-md border border-[#D0D5DD] py-5.5 px-6  mb-[20px]">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h3 className="font-semibold text-[#040404] text-[20px]">
                                Profile Completeness
                            </h3>
                            <p className="text-[16px] font-medium text-[#232222] mt-1">
                                Complete your profile to improve job matching
                            </p>
                        </div>
                        <span className="text-[24px] font-extrabold text-[#0A65CC]">
                            {percentage}%
                        </span>
                    </div>
                    <div className="w-full bg-[#D3E7FE] rounded-full h-3 mt-5">
                        <div
                            className="bg-[#0A65CC] h-3 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-white rounded-md border border-[#D0D5DD]   mb-[20px]">
                    <button
                        onClick={() => toggleSection("personalInfo")}
                        className="w-full flex items-center justify-between py-5.5 px-6  transition-colors rounded-md"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-15 h-15 bg-[#F0F8FF] rounded-[6px] flex items-center justify-center">
                                <User className="text-[#0A65CC]" size={25} />
                            </div>
                            <span className="text-[20px] font-medium text-[#040404]">
                                Personal Information
                            </span>
                        </div>
                        {expandedSections.personalInfo ? (
                            <ChevronUp className="text-[#1A1919]" size={25} />
                        ) : (
                            <ChevronDown className="text-[#1A1919]" size={25} />
                        )}
                    </button>

                    {expandedSections.personalInfo && (
                        <div className="border-t border-[#D0D5DD]  py-5.5 px-6 ">
                            <PersonalInfoForm
                                data={formData.personalInfo}
                                onUpdate={(field, value) =>
                                    handleInputChange("personalInfo", field, value)
                                }
                                onSave={() => handleSaveSection("personalInfo")}
                            />
                        </div>
                    )}
                </div>

                <div  className="bg-white rounded-md border border-[#D0D5DD]   mb-[20px]">
                    <button
                        onClick={() => toggleSection("resumeManagement")}
                        className="w-full flex items-center justify-between py-5.5 px-6  transition-colors rounded-md"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-15 h-15 bg-[#F0F8FF] rounded-[6px] flex items-center justify-center">
                                <FileText className="text-[#0A65CC]" size={25} />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[20px] font-medium text-[#040404]">
                                    Resume Management
                                </span>
                                <span className="text-sm text-gray-500">75% complete</span>
                            </div>
                        </div>
                        {expandedSections.resumeManagement ? (
                            <ChevronUp className="text-[#1A1919]" size={25} />
                        ) : (
                            <ChevronDown className="text-[#1A1919]" size={25} />
                        )}
                    </button>

                    {expandedSections.resumeManagement && (
                        <div className="border-t border-[#D0D5DD]  py-5.5 px-6 ">
                            <ResumeManagementForm
                                data={formData.resumeFile}
                                onUpdate={(field, value) =>
                                    handleFileChange("resumeFile", field, value)
                                }
                                onSave={() => handleSaveSection("resumeFile")}
                            />
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-md border border-[#D0D5DD]   mb-[20px]">
                    <button
                        onClick={() => toggleSection("portfolioManagement")}
                        className="w-full flex items-center justify-between py-5.5 px-6  transition-colors rounded-md"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-15 h-15 bg-[#F0F8FF] rounded-[6px] flex items-center justify-center">
                                <Briefcase className="text-[#0A65CC]" size={25} />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[20px] font-medium text-[#040404]">
                                    Portfolio Management
                                </span>
                                <span className="text-sm text-gray-500">75% complete</span>
                            </div>
                        </div>
                        {expandedSections.portfolioManagement ? (
                            <ChevronUp className="text-[#1A1919]" size={25} />
                        ) : (
                            <ChevronDown className="text-[#1A1919]" size={25} />
                        )}
                    </button>

                    {expandedSections.portfolioManagement && (
                        <div className="border-t border-[#D0D5DD]  py-5.5 px-6 ">
                            <PortfolioManagementForm
                                data={formData.portfolio}
                                onUpdate={(field, value) =>
                                    handleInputChange("portfolio", field, value)
                                }
                                onAddLink={addPortfolioLink}
                                onRemoveLink={removePortfolioLink}
                                onSave={() => handleSaveSection("portfolio")}
                            />
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-md border border-[#D0D5DD]   mb-[20px]">
                    <button
                        onClick={() => toggleSection("passportDetails")}
                        className="w-full flex items-center justify-between py-5.5 px-6  transition-colors rounded-md"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-15 h-15 bg-[#F0F8FF] rounded-[6px] flex items-center justify-center">
                                <CreditCard className="text-[#0A65CC]" size={25} />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[20px] font-medium text-[#040404]">
                                    Passport Details
                                </span>
                                <span className="text-sm text-gray-500">60% complete</span>
                            </div>
                        </div>
                        {expandedSections.passportDetails ? (
                            <ChevronUp className="text-[#1A1919]" size={25} />
                        ) : (
                            <ChevronDown className="text-[#1A1919]" size={25} />
                        )}
                    </button>

                    {expandedSections.passportDetails && (
                        <div className="border-t border-[#D0D5DD]  py-5.5 px-6 ">
                            <PassportDetailsForm
                                data={formData.passportDetails}
                                onUpdate={(field, value) =>
                                    handleInputChange("passportDetails", field, value)
                                }
                                onFileUpdate={(field, value) =>
                                    handleFileChange("passportDetails", field, value)
                                }
                                onSave={() => handleSaveSection("passportDetails")}
                            />
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-md border border-[#D0D5DD]   mb-[20px]">
                    <button
                        onClick={() => toggleSection("careerPreferences")}
                        className="w-full flex items-center justify-between py-5.5 px-6  transition-colors rounded-md"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-15 h-15 bg-[#F0F8FF] rounded-[6px] flex items-center justify-center">
                                <Target className="text-[#0A65CC]" size={25} />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[20px] font-medium text-[#040404]">
                                    Career Preferences
                                </span>
                                <span className="text-sm text-gray-500">80% complete</span>
                            </div>
                        </div>
                        {expandedSections.careerPreferences ? (
                            <ChevronUp className="text-[#1A1919]" size={25} />
                        ) : (
                            <ChevronDown className="text-[#1A1919]" size={25} />
                        )}
                    </button>

                    {expandedSections.careerPreferences && (
                        <div className="border-t border-[#D0D5DD]  py-5.5 px-6 ">
                            <CareerPreferencesForm
                                data={formData.careerPreferences}
                                onUpdate={(field, value) =>
                                    handleInputChange("careerPreferences", field, value)
                                }
                                onToggleJobRole={toggleJobRole}
                                onSave={() => handleSaveSection("careerPreferences")}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;