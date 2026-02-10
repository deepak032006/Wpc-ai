import { useState } from "react";
import { Github, Linkedin, Trash2 } from "lucide-react";
import { update_candidate_profile } from "@/app/action/candidate.action";

export interface portfolio {
    url: {
        id?: number;
        type: string;
        link: string;
    }[];
    description: string;
}

interface PortfolioManagementFormProps {
    data: portfolio;
    onUpdate: (field: string, value: any) => void;
    onAddLink: (link: { type: string; link: string }) => void;
    onRemoveLink: (index: number) => void;
    onSave?: () => void;
}

const PortfolioManagementForm = ({ 
    data, 
    onUpdate, 
    onAddLink, 
    onRemoveLink,
    onSave
}: PortfolioManagementFormProps) => {
    const [newPortfolioLink, setNewPortfolioLink] = useState({ type: "", link: "" });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleAddLink = () => {
        if (newPortfolioLink.type && newPortfolioLink.link) {
            // Basic URL validation
            try {
                new URL(newPortfolioLink.link);
                onAddLink(newPortfolioLink);
                setNewPortfolioLink({ type: "", link: "" });
                setMessage(null);
            } catch {
                setMessage({ type: 'error', text: 'Please enter a valid URL' });
            }
        } else {
            setMessage({ type: 'error', text: 'Please fill in both type and URL' });
        }
    };

    const handleRemoveLink = async (index: number) => {
        const itemToRemove = data.url[index];
        
        // If the item has an ID, it exists in the database and needs to be deleted
        if (itemToRemove.id) {
            setIsSaving(true);
            setMessage(null);
            
            try {
                // Remove the item from the state first
                onRemoveLink(index);
                
                // Prepare the updated portfolio list (without the removed item)
                const updatedPortfolio = data.url
                    .filter((_, i) => i !== index)
                    .map(item => ({
                        id: item.id,
                        link_type: item.type,
                        url: item.link,
                        description: data.description || undefined
                    }));

                // Send update to backend
                const result = await update_candidate_profile({
                    portfolio: updatedPortfolio
                });

                if (result.success) {
                    setMessage({ type: 'success', text: 'Portfolio link removed successfully' });
                } else {
                    setMessage({ type: 'error', text: result.message || 'Failed to remove link' });
                }
            } catch (error) {
                setMessage({ type: 'error', text: 'An unexpected error occurred' });
            } finally {
                setIsSaving(false);
            }
        } else {
            // If no ID, it's a new item that hasn't been saved yet
            onRemoveLink(index);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);
        
        try {
            // Filter out empty entries and map portfolio data to API format
            const portfolioData = data.url
                .filter(item => item.type && item.link) // Only include items with both type and link
                .map(item => ({
                    ...(item.id && { id: item.id }), // Only include id if it exists
                    link_type: item.type,
                    url: item.link,
                    description: data.description || undefined
                }));

            // Check if there's any valid data to save
            if (portfolioData.length === 0) {
                setMessage({ type: 'error', text: 'Please add at least one valid portfolio link before saving' });
                setIsSaving(false);
                return;
            }

            const result = await update_candidate_profile({
                portfolio: portfolioData
            });

            if (result.success) {
                setMessage({ type: 'success', text: result.message || 'Portfolio updated successfully' });
                // Call parent onSave if provided
                if (onSave) {
                    onSave();
                }
            } else {
                setMessage({ type: 'error', text: result.message || 'Failed to update portfolio' });
            }
        } catch (error) {
            console.error('Portfolio save error:', error);
            setMessage({ type: 'error', text: 'An unexpected error occurred' });
        } finally {
            setIsSaving(false);
        }
    };

    const getIconForType = (type: string) => {
        const lowerType = type.toLowerCase();
        if (lowerType.includes('github')) {
            return <Github className="text-[#0852C9" size={20} />;
        } else if (lowerType.includes('linkedin')) {
            return <Linkedin className="text-[#0852C9]" size={20} />;
        } else {
            // Default icon for other types (Portfolio, Website, etc.)
            return (
                <svg className="text-[#0852C9]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
            );
        }
    };

    return (
        <div className="space-y-4">
            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            {/* Existing Portfolio Links */}
            {data.url && data.url.length > 0 && data.url.map((item, index) => (
                <div
                    key={item.id || index}
                    className="flex items-center justify-between border border-gray-200 rounded-lg p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            {getIconForType(item.type)}
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 text-sm">
                                {item.type}
                            </p>
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-[#0852C9] hover:underline break-all"
                            >
                                {item.link}
                            </a>
                            {data.description && (
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {data.description}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => handleRemoveLink(index)}
                        disabled={isSaving}
                        className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Remove link"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}

            {/* Empty state */}
            {(!data.url || data.url.length === 0) && (
                <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500 text-sm">No portfolio links added yet</p>
                </div>
            )}

            {/* Add New Link */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Link Type
                    </label>
                    <select
                        value={newPortfolioLink.type}
                        onChange={(e) =>
                            setNewPortfolioLink({
                                ...newPortfolioLink,
                                type: e.target.value,
                            })
                        }
                        disabled={isSaving}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="">Select type</option>
                        <option value="GitHub">GitHub</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Portfolio">Portfolio</option>
                        <option value="Website">Website</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL
                    </label>
                    <input
                        type="url"
                        value={newPortfolioLink.link}
                        onChange={(e) =>
                            setNewPortfolioLink({
                                ...newPortfolioLink,
                                link: e.target.value,
                            })
                        }
                        disabled={isSaving}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="https://example.com"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optional)
                </label>
                <textarea
                    value={data.description}
                    onChange={(e) => onUpdate("description", e.target.value)}
                    disabled={isSaving}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    rows={3}
                    placeholder="Brief description of your portfolio"
                />
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button
                    onClick={handleAddLink}
                    disabled={isSaving}
                className="px-6 py-2.5 border border-[#0852C9] text-[#0852C9] hover:bg-blue-50 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Add Link
                </button>
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

export default PortfolioManagementForm;