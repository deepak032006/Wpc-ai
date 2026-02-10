"use client";

import { matched_candidates } from "@/app/action/job_role.action";
import { CreateInterview } from "@/app/action/job_role.action";
import { Clock, X, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdDone } from "react-icons/md";
import toast from "react-hot-toast";

type Candidate = {
    percentMatched: number;
    rank: number;
    name: string;
    id: string;
    days: number;
    skills: string[];
    image: string;
};

type InterviewSlot = {
    date: Date;
    time: string;
};

const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-[12px] shadow-2xl md:max-w-[500px] w-full max-h-[90vh] overflow-y-auto animate-slideUp">
                {children}
            </div>
        </div>
    );
};

const RecruitmentAgreement = ({ candidateName, onCancel, onAccept }: { candidateName: string; onCancel: () => void; onAccept: () => void }) => {
    const [agreed, setAgreed] = useState<boolean>(false);

    return (
        <div className="px-7 py-11">
            <button onClick={onCancel} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
            </button>

            <h2 className="text-[#0852C9] text-[20px] font-bold mb-2">Recruitment Agreement</h2>
            <h3 className="text-[#111111] text-[16px] font-bold mb-2">Request Interview with {candidateName}</h3>
            <p className="text-[#4D4D4D] text-[15px] mb-6">Please review and accept our terms before proceeding.</p>

            <div className="bg-gray-50 rounded-md p-5 mb-6 border border-[#D0D5DD]">
                <p className="text-[#232222] font-medium text-sm mb-4">By requesting this interview, you agree to WPC{"'"}s recruitment terms:</p>
                <ul className="space-y-2 text-sm text-[#525252]">
                    <li className="flex items-start">
                        <span className="text-[#111111] mr-2">•</span>
                        <span>A success fee of £1,500 – £3,000 applies upon successful hire of this candidate.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-[#111111] mr-2">•</span>
                        <span>You agree not to contact this candidate outside the WPC platform during the recruitment process.</span>
                    </li>
                </ul>
            </div>

            <label className="flex items-center p-4 border border-[#D0D5DD] rounded-lg cursor-pointer hover:bg-gray-50 transition-colors mb-6">
                <div className="relative flex items-center justify-center w-5 h-5 mt-0.5">
                    <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="appearance-none w-5 h-5 border-2 border-[#D0D5DD] rounded-full cursor-pointer checked:bg-[#0A65CC] checked:border-[2px] transition-all focus:outline-none focus:ring-2 focus:ring-[#0852C9] "
                    />
                </div>
                <span className="ml-3 text-[15px] text-[#344054] leading-relaxed">
                    I agree to WPC's success fee if I hire this candidate through the platform.
                </span>
            </label>

            <div className="flex gap-3">
                <button
                    onClick={onCancel}
                    className="flex-1 px-6 py-2.5 border border-gray-300 text-[#3E3E3E] font-medium rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={onAccept}
                    disabled={!agreed}
                    className="flex-1 px-6 py-2.5 bg-[#0852C9] text-white rounded-lg font-medium hover:bg-[#0740A3] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    Agree & Continue
                </button>
            </div>
        </div>
    );
};

const ScheduleInterview = ({ candidateName, candidateId, roleId, onBack, onSubmit }: { candidateName: string; candidateId: number; roleId: number; onBack: () => void; onSubmit: () => void }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedSlots, setSelectedSlots] = useState<InterviewSlot[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [timeInput, setTimeInput] = useState("");
    const [loading, setLoading] = useState(false);

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const isSameDay = (date1: Date | null, date2: Date | null) => {
        if (!date1 || !date2) return false;
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
    };

    const isPastDate = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const compareDate = new Date(date);
        compareDate.setHours(0, 0, 0, 0);
        return compareDate < today;
    };

    const addTimeSlot = () => {
        if (selectedDate && timeInput && selectedSlots.length < 3) {
            const newSlot = { date: selectedDate, time: timeInput };
            setSelectedSlots([...selectedSlots, newSlot]);
            setTimeInput("");
            setSelectedDate(null);
        }
    };

    const removeSlot = (index: number) => {
        setSelectedSlots(selectedSlots.filter((_, i) => i !== index));
    };

    const formatToISO = (slot: InterviewSlot) => {
        const year = slot.date.getFullYear();
        const month = String(slot.date.getMonth() + 1).padStart(2, '0');
        const day = String(slot.date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}T${slot.time}:00Z`;
    };

    const handleScheduleSubmit = async () => {
        if (selectedSlots.length === 0) {
            toast.error("Please select at least one time slot");
            return;
        }

        setLoading(true);

        try {
            const interviewData = {
                candidate: candidateId,
                role: roleId,
                time_slot_1: formatToISO(selectedSlots[0]),
                time_slot_2: selectedSlots[1] ? formatToISO(selectedSlots[1]) : formatToISO(selectedSlots[0]),
                time_slot_3: selectedSlots[2] ? formatToISO(selectedSlots[2]) : formatToISO(selectedSlots[0]),
                terms_and_conditions: true
            };

            const result = await CreateInterview(interviewData);

            if (result.success) {
                toast.success(result.message);
                onSubmit();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error("Schedule interview error:", error);
            toast.error("Failed to schedule interview");
        } finally {
            setLoading(false);
        }
    };

    const days = getDaysInMonth(currentDate);

    return (
        <div className="px-7 py-11">
            <h2 className="text-[#0852C9] text-[22px] font-semibold mb-4">Schedule Interview</h2>
            <h3 className="text-[#000000] text-[18px] font-semibold mb-2">Select Available Times</h3>
            <p className="text-[#667085] text-[14px] mb-6 leading-relaxed">
                Choose up to 3 time slots. The candidate will confirm their preferred time.
            </p>

            <div className="bg-white rounded-t-[12px] shadow-xs shadow-[#00000014] overflow-hidden border-t-[4px] border-[#0852C9] mb-6">
                <div className="flex items-center gap-2 px-6 py-5">
                    <div className="relative">
                        <select
                            value={currentDate.getMonth()}
                            onChange={(e) => setCurrentDate(new Date(currentDate.getFullYear(), parseInt(e.target.value), 1))}
                            className="appearance-none text-[13px] font-medium text-[#000000] bg-transparent border-none outline-none cursor-pointer pr-6"
                        >
                            {monthNames.map((month, i) => (
                                <option key={i} value={i}>{month}</option>
                            ))}
                        </select>
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                            <path d="M1 1.5L6 6.5L11 1.5" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    <div className="relative">
                        <select
                            value={currentDate.getFullYear()}
                            onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth(), 1))}
                            className="appearance-none text-[13px] font-medium text-[#000000] bg-transparent border-none outline-none cursor-pointer pr-6"
                        >
                            {[2024, 2025, 2026].map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                            <path d="M1 1.5L6 6.5L11 1.5" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                <div className="grid grid-cols-7 px-4 mb-4">
                    {dayNames.map(day => (
                        <div key={day} className="text-center text-[13px] font-medium text-[#667085] py-2">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-y-3 px-4 pb-6">
                    {days.map((day, index) => {
                        const isDisabled = !day || isPastDate(day);
                        return (
                            <button
                                key={index}
                                onClick={() => !isDisabled && setSelectedDate(day)}
                                disabled={isDisabled}
                                className={`
                                    flex items-center justify-center h-9 text-[12px] font-normal transition-all
                                    ${!day ? 'invisible' : ''}
                                    ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                                    ${isSameDay(day, selectedDate)
                                        ? ''
                                        : !isDisabled ? 'hover:bg-gray-50 text-[#000000]' : ''}
                                `}
                            >
                                {day && (
                                    <span className={`
                                        flex items-center justify-center min-w-[48px] px-5 h-10 rounded-full transition-all
                                        ${isSameDay(day, selectedDate)
                                            ? 'border-2 border-[#0852C9] text-[#0852C9] font-medium'
                                            : isPastDate(day)
                                                ? 'text-[#D0D5DD]'
                                                : 'text-[#000000]'}
                                    `}>
                                        {day.getDate()}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-[16px] font-semibold text-[#000000] mb-3">Select Time</label>
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#98A2B3]" size={20} />
                        <input
                            type="time"
                            value={timeInput}
                            onChange={(e) => setTimeInput(e.target.value)}
                            className="w-full pl-12 pr-4 py-1.5 border border-[#DED8E1] rounded-[15px] text-[14px] text-[#667085] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#0852C9] focus:border-[#0852C9]"
                            placeholder="hh:mm"
                        />
                    </div>
                    {selectedDate && timeInput && selectedSlots.length < 3 && (
                        <button
                            onClick={addTimeSlot}
                            className="px-6 py-1.5 bg-[#0852C9] text-white text-[14px] font-semibold rounded-lg hover:bg-[#0740A3] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Add
                        </button>
                    )}
                </div>
            </div>

            {selectedSlots.length > 0 && (
                <div className="mb-6">
                    <label className="block text-[14px] font-medium text-[#344054] mb-2">
                        Selected Time Slots ({selectedSlots.length}/3)
                    </label>
                    <div className="space-y-2">
                        {selectedSlots.map((slot, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-[12px]">
                                <span className="text-[14px] text-[#344054]">
                                    {slot.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {slot.time}
                                </span>
                                <button onClick={() => removeSlot(index)} className="text-black transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                    onClick={onBack}
                    disabled={loading}
                    className="flex-1 px-6 py-3 border border-[#D0D5DD] text-[#344054] text-[15px] font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Back
                </button>
                <button
                    onClick={handleScheduleSubmit}
                    disabled={selectedSlots.length === 0 || loading}
                    className="flex-1 px-6 py-3 bg-[#0852C9] text-white text-[15px] font-semibold rounded-lg hover:bg-[#0740A3] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Sending...
                        </>
                    ) : (
                        'Send Request'
                    )}
                </button>
            </div>
        </div>
    );
};

const SuccessModal = ({ candidateName, onClose }: { candidateName: string; onClose: () => void }) => {
    return (
        <div className="px-7 py-11 text-center">
            <div className="mx-auto w-25 h-25 bg-[#E9FBEF] rounded-full flex items-center justify-center mb-6 animate-scaleIn">
                <MdDone size={40} className="w-[70px] h-[70px] text-[#33951A]" />
            </div>
            <h2 className="text-[#000000] text-[20px] font-semibold mb-3">Interview Request Sent!</h2>
            <p className="text-[#000000] text-sm mb-8 max-w-sm mx-auto">
                {candidateName} will be notified and can select their preferred time slot. Youll receive a confirmation once they respond.
            </p>
            <button
                onClick={onClose}
                className="w-full bg-[#0852C9] hover:bg-[#0740A3] text-white text-base font-medium py-2.5 px-4 rounded-lg transition-all hover:shadow-md active:scale-[0.98]"
            >
                Done
            </button>
        </div>
    );
};

const MatchedCandidates = ({ candidate, roleId }: { candidate: Candidate; roleId: number }) => {
    const [modalStep, setModalStep] = useState<'closed' | 'agreement' | 'schedule' | 'success'>('closed');
    const router = useRouter();

    const getMatchColor = (percent: number) => {
        if (percent >= 85) return "bg-[#33951A]";
        if (percent >= 70) return "bg-[#F0A10E]";
        return "bg-[#F35856]";
    };

    const getDaysColor = (days: number) => {
        if (days <= 30) return "bg-[#F35856]";
        if (days <= 90) return "bg-[#F0A10E]";
        return "bg-[#33951A]";
    };

    const handleRequestInterview = () => {
        setModalStep('agreement');
    };

    const handleAgreementAccept = () => {
        setModalStep('schedule');
    };

    const handleScheduleSubmit = () => {
        setModalStep('success');
    };

    const closeModal = () => {
        setModalStep('closed');
    };
    const [showAllSkills, setShowAllSkills] = useState(false);
    const displayedSkills = showAllSkills ? candidate.skills : candidate.skills.slice(0, 5);
    const hasMoreSkills = candidate.skills.length > 5;

    return (
        <>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden w-full mx-auto hover:shadow-lg transition-shadow h-full flex flex-col">
                <div className="relative hover:cursor-pointer" onClick={() => {
                    localStorage.setItem("score",`${candidate.percentMatched}`)
                    router.push(`matches/${candidate.id}`)
                }}>
                    <img
                        src="https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/fd35c-no-user-image-icon-27.png?fit=500%2C500&ssl=1"
                        alt={candidate.name}
                        className="w-full h-[240px] object-cover"
                    />
                    <div className="absolute top-3 left-3">
                        <div
                            className={`${getMatchColor(
                                candidate.percentMatched
                            )} text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg`}
                        >
                            <span className="text-[10px]">●</span>
                            <span>{candidate.percentMatched}% Match</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white py-4 px-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-gray-900 text-lg font-semibold mb-0.5 truncate">
                                {candidate.name}
                            </h3>
                            <p className="text-gray-500 text-sm">#{candidate.id}</p>
                        </div>
                        <span
                            className={`${getDaysColor(
                                candidate.days
                            )} text-white text-xs font-medium px-2.5 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-sm whitespace-nowrap ml-2`}
                        >
                            <Clock size={12} /> {candidate.days} Days
                        </span>
                    </div>

                    <div className="flex gap-2 mb-4 flex-wrap min-h-[80px]">
                        {displayedSkills.map((skill, index) => (
                            <span
                                key={index}
                                className="text-[#0852C9] text-xs font-medium bg-[#E4F1FF] px-3 py-1.5 rounded-full h-fit"
                            >
                                {skill}
                            </span>
                        ))}
                        {hasMoreSkills && (
                            <button
                                onClick={() => setShowAllSkills(!showAllSkills)}
                                className="text-[#0852C9] text-xs font-medium bg-transparent px-3 py-1.5 rounded-full border border-[#0852C9] hover:bg-[#E4F1FF] transition-colors h-fit"
                            >
                                {showAllSkills ? 'Show less' : `+${candidate.skills.length - 5} more`}
                            </button>
                        )}
                    </div>

                    <button
                        onClick={handleRequestInterview}
                        className="w-full bg-[#0852C9] hover:bg-[#0740A3] text-white text-base font-medium py-2.5 px-4 rounded-lg transition-all hover:shadow-md active:scale-[0.98] mt-auto"
                    >
                        Request Interview
                    </button>
                </div>
            </div>

            <Modal isOpen={modalStep === 'agreement'} onClose={closeModal}>
                <RecruitmentAgreement
                    candidateName={candidate.name}
                    onCancel={closeModal}
                    onAccept={handleAgreementAccept}
                />
            </Modal>

            <Modal isOpen={modalStep === 'schedule'} onClose={closeModal}>
                <ScheduleInterview
                    candidateName={candidate.name}
                    candidateId={Number(candidate.id)}
                    roleId={roleId}
                    onBack={() => setModalStep('agreement')}
                    onSubmit={handleScheduleSubmit}
                />
            </Modal>

            <Modal isOpen={modalStep === 'success'} onClose={closeModal}>
                <SuccessModal candidateName={candidate.name} onClose={closeModal} />
            </Modal>
        </>
    );
};


const Matches = () => {
    const { id } = useParams();
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCandidate() {
            if (!id) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const result = await matched_candidates(Number(id));

                if (result.success && result.data) {
                    const formattedCandidates = result.data.map((item: any, index: number) => {
                        // Calculate days from visa expiry or use a default
                        const calculateDays = () => {
                            if (item.condidate?.visa_expiry) {
                                const expiryDate = new Date(item.condidate.visa_expiry);
                                const today = new Date();
                                const diffTime = expiryDate.getTime() - today.getTime();
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                return diffDays > 0 ? diffDays : 0;
                            }
                            return 0;
                        };

                        return {
                            percentMatched: Math.round(item.score),
                            rank: index + 1,
                            name: item.condidate?.cv_parsed_data?.personal_info?.full_name || "Unknown Candidate",
                            id: item.condidate?.id?.toString() || item.id?.toString() || "",
                            days: calculateDays(),
                            skills: item.condidate?.cv_parsed_data?.key_skills || [],
                            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.condidate?.cv_parsed_data?.personal_info?.full_name || "Unknown")}&background=random`,
                        };
                    });
                    setCandidates(formattedCandidates);
                } else {
                    setError(result.message || "Failed to fetch candidates");
                }
            } catch (err) {
                setError("An error occurred while fetching candidates");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchCandidate();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading candidates...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    if (candidates.length === 0) {
        return (
            <div className="bg-[#FDFEFF] min-h-screen p-5 md:p-8 font-inter">

                <div className='w-full flex flex-col items-center justify-center gap-6 md:gap-8 mt-8'>
                    <img src="/candidate.png" alt="No candidates found" className='w-full max-w-[350px] md:max-w-[600px] xl:max-w-[750px] h-auto object-contain' />

                    <div className="w-full max-w-[600px] md:max-w-[700px] px-4 flex flex-col items-center justify-center gap-3 md:gap-4">
                        <h2 className='text-[24px] md:text-[28px] xl:text-[30px] text-[#2F2F2F] font-semibold text-center'>
                            No candidate matches found
                        </h2>
                        <p className='text-[16px] md:text-[20px] xl:text-[22px] text-[#373737] text-center leading-relaxed'>
                            There are currently no candidates that match your job requirements. New profiles are added regularly.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes scaleIn {
                    from { 
                        transform: scale(0);
                    }
                    to { 
                        transform: scale(1);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
            `}</style>
            <div className="mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
                    {candidates.map((candidate) => (
                        <MatchedCandidates key={candidate.id} candidate={candidate} roleId={Number(id)} />
                    ))}
                </div>
            </div>
        </div>
    );
};


export default Matches;