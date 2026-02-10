import { Download, Upload, X, ExternalLink } from "lucide-react";
import { useState } from "react";
import { update_candidate_cv } from "@/app/action/candidate.action";

export interface Resume {
    resume: File | string | null;
}

interface ResumeManagementFormProps {
    data: Resume;
    onUpdate: (field: string, value: File | null) => void;
}

const ResumeManagementForm = ({ data, onUpdate }: ResumeManagementFormProps) => {
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        
        if (file) {
            const maxSize = 10 * 1024 * 1024; 
            if (file.size > maxSize) {
                setMessage({ type: 'error', text: 'File size must be less than 10MB' });
                return;
            }

            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                setMessage({ type: 'error', text: 'Only PDF, DOC, and DOCX files are allowed' });
                return;
            }

            setMessage(null);
        }
        
        onUpdate("resume", file);
    };

    const handleRemove = () => {
        onUpdate("resume", null);
    };

    const handleSave = async () => {
        if (!data.resume || typeof data.resume === 'string') {
            setMessage({ type: 'error', text: 'Please select a file to upload' });
            return;
        }

        setIsSaving(true);
        setMessage(null);
        
        try {
            const result = await update_candidate_cv(data.resume);

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

    const isResumeUrl = typeof data.resume === 'string' && data.resume.startsWith('http');
    const isResumeFile = data.resume instanceof File;

    return (
        <div className="space-y-4">
            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            {data.resume ? (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Uploaded Document
                    </label>
                    <div className="border-2 border-blue-500 bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        {isResumeFile ? data.resume.name : 'Resume'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {isResumeFile ? "Uploaded Successfully" : "Already have Resume"}
                                    </p>
                                </div>
                                {isResumeUrl && (
                                    <a
                                        href={data.resume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md font-medium transition-colors flex items-center gap-1.5"
                                    >
                                        View
                                        <ExternalLink size={14} />
                                    </a>
                                )}
                            </div>
                            <button
                                onClick={handleRemove}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-100 transition-colors ml-2"
                                disabled={isSaving}
                            >
                                <X size={18} className="text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Document
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                <Upload className="text-blue-600" size={24} />
                            </div>
                            <p className="text-sm text-gray-700 mb-1">
                                Upload your resume
                            </p>
                            <p className="text-xs text-gray-500 mb-4">
                                PDF, DOC, DOCX (max 10MB)
                            </p>
                            <label 
                                htmlFor="resume-upload"
                                className={`px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium cursor-pointer hover:bg-blue-100 transition-colors ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Choose File
                            </label>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="hidden"
                                id="resume-upload"
                                disabled={isSaving}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-end pt-4">
                <button 
                    onClick={handleSave}
                    disabled={isSaving || !data.resume || isResumeUrl}
                    className="px-6 py-2.5 bg-[#0852C9] hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSaving ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading...
                        </>
                    ) : (
                        'Save Preferences'
                    )}
                </button>
            </div>
        </div>
    );
};

export default ResumeManagementForm;