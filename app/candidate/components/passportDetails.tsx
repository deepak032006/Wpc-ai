import { Lock, Download, Upload } from "lucide-react";
import { useState } from "react";
import { update_passport, update_candidate_profile } from "@/app/action/candidate.action"; // Update path

export interface passportDetails {
    preferred_industries: string;
    preferred_worktype: string;
    passport_number: string;
    country_of_issue: string;
    expiry_date: string;
    passport: File | null;
}

interface PassportDetailsFormProps {
    data: passportDetails;
    onUpdate: (field: string, value: any) => void;
    onFileUpdate: (field: string, value: File | null) => void;
}

const PassportDetailsForm = ({ data, onUpdate, onFileUpdate }: PassportDetailsFormProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isFileUploaded, setIsFileUploaded] = useState(false);

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        
        if (file) {
            const maxSize = 10 * 1024 * 1024;
            if (file.size > maxSize) {
                setMessage({ type: 'error', text: 'File size must be less than 10MB' });
                return;
            }

            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                setMessage({ type: 'error', text: 'Only PDF, JPG, JPEG, and PNG files are allowed' });
                return;
            }

            setIsUploading(true);
            setMessage(null);
            setIsFileUploaded(false);

            try {
                const result = await update_passport(file);
                console.log(result)

                if (result.success) {
                    setMessage({ type: 'success', text: 'Passport document uploaded successfully' });
                    onFileUpdate("passport", file);
                    setIsFileUploaded(true);
                } else {
                    setMessage({ type: 'error', text: result.message });
                    setIsFileUploaded(false);
                }
            } catch (error) {
                setMessage({ type: 'error', text: 'An unexpected error occurred while uploading' });
                setIsFileUploaded(false);
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleSave = async () => {
        if (!isFileUploaded && data.passport) {
            setMessage({ type: 'error', text: 'Please wait for file upload to complete' });
            return;
        }

        setIsSaving(true);
        setMessage(null);
        
        try {
            const result = await update_candidate_profile({
                preferred_industries: data.preferred_industries,
                preferred_work_type: data.preferred_worktype,
                passport_number: data.passport_number,
                passport_country: data.country_of_issue,
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

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                <Lock className="text-yellow-700 flex-shrink-0 mt-0.5" size={16} />
                <p className="text-sm text-yellow-700">
                    This information is securely encrypted and only visible to authorized parties.
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Industries
                </label>
                <select
                    value={data.preferred_industries}
                    onChange={(e) => onUpdate("preferred_industries", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    disabled={isUploading || isSaving}
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
                    disabled={isUploading || isSaving}
                >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Passport Number
                    </label>
                    <input
                        type="text"
                        value={data.passport_number}
                        onChange={(e) => onUpdate("passport_number", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="AB1234567"
                        disabled={isUploading || isSaving}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country of Issue
                    </label>
                    <select
                        value={data.country_of_issue}
                        onChange={(e) => onUpdate("country_of_issue", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                        disabled={isUploading || isSaving}
                    >
                        <option value="India">India</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                        <option value="Canada">Canada</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                </label>
                <input
                    type="date"
                    value={data.expiry_date}
                    onChange={(e) => onUpdate("expiry_date", e.target.value)}
                    min={getTodayDate()}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isUploading || isSaving}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Document
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                            {isUploading ? (
                                <svg className="animate-spin h-6 w-6 text-[#0852C9]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <Upload className="text-blue-600" size={24} />
                            )}
                        </div>
                        <p className="text-sm text-gray-700 mb-1">
                            {isUploading ? 'Uploading...' : 'Upload a scanned copy of your passport'}
                        </p>
                        <p className="text-xs text-gray-500 mb-4">
                            PDF, JPG, JPEG, PNG (max 10MB)
                        </p>
                        <label 
                            htmlFor="passport-upload"
                            className={`px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium cursor-pointer hover:bg-blue-100 transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Choose File
                        </label>
                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            className="hidden"
                            id="passport-upload"
                            disabled={isUploading || isSaving}
                        />
                        {data.passport && (
                            <p className="text-sm text-gray-600 mt-3">
                                Selected: {data.passport.name}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button 
                    onClick={handleSave}
                    disabled={isSaving || isUploading || (!isFileUploaded && data.passport !== null)}
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

export default PassportDetailsForm;