import { User } from "lucide-react";
import { useState } from "react";
import { update_candidate_profile } from "@/app/action/candidate.action";

export interface personalInfo {
    preferred_industries: string;
    preferred_worktype: string;
    full_name: string;
    email_address: string;
    phone_number: string;
    nationality: string;
    location: string;
}

interface PersonalInfoFormProps {
    data: personalInfo;
    onUpdate: (field: string, value: any) => void;
}

const PersonalInfoForm = ({ data, onUpdate }: PersonalInfoFormProps) => {
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const sanitized = value.replace(/[^0-9+]/g, '');
        onUpdate("phone_number", sanitized);
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);
        
        try {
            const result = await update_candidate_profile({
                preferred_industries: data.preferred_industries,
                preferred_work_type: data.preferred_worktype,
                preferred_locations: data.location,
                full_name: data.full_name,
                phone_number: data.phone_number,
                nationality: data.nationality,
            });

            if (result.success) {
                setMessage({ type: 'success', text: result.message });
            } else {
                setMessage({ type: 'error', text: result.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An unexpected error occurred' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Industries
                </label>
                <select
                    value={data.preferred_industries}
                    onChange={(e) => onUpdate("preferred_industries", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    disabled={isSaving}
                >
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    disabled={isSaving}
                >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={data.full_name}
                        onChange={(e) => onUpdate("full_name", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Sarah"
                        disabled={isSaving}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={data.email_address}
                        readOnly
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        placeholder="sarah@123.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        value={data.phone_number}
                        onChange={handlePhoneChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+1234567890"
                        disabled={isSaving}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nationality
                    </label>
                    <select
                        value={data.nationality}
                        disabled
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed appearance-none"
                    >
                        <option value="British">British</option>
                        <option value="American">American</option>
                        <option value="French">French</option>
                        <option value="Japanese">Japanese</option>
                        <option value="Australian">Australian</option>
                        <option value="Canadian">Canadian</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                </label>
                <select
                    value={data.location}
                    onChange={(e) => onUpdate("location", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    disabled={isSaving}
                >
                    <option value="London, UK">London, UK</option>
                    <option value="Berlin, Germany">Berlin, Germany</option>
                    <option value="Paris, France">Paris, France</option>
                    <option value="Tokyo, Japan">Tokyo, Japan</option>
                    <option value="Sydney, Australia">Sydney, Australia</option>
                </select>
            </div>

            <div className="flex justify-end pt-4">
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-[#0852C9] hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSaving ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </>
                    ) : (
                        'Save Preferences'
                    )}
                </button>
            </div>
        </div>
    );
};

export default PersonalInfoForm;