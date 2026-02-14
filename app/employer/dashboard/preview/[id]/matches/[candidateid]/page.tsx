"use client";
import { useState, useEffect } from "react";
import {
  Play,
  MapPin,
  Calendar,
  Clock,
  Award,
  Briefcase,
  FileText,
  Video,
} from "lucide-react";
import { useParams } from "next/navigation";
import { get_candidate_by_match } from "@/app/action/job_role.action";
import OfferModals from "@/app/employer/_components/OfferModels";
import clientApi from "@/lib/axios";
import toast from "react-hot-toast";

const CandidatePage = () => {
  const { id, candidateid } = useParams();
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [candidateData, setCandidateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jrt, setJRT] = useState(null);
  // temop state for the sciore of the candidate
  const [cnScore, setCnScore] = useState<string>("");

  useEffect(() => {
    const score = localStorage.getItem("score");
    if (score) {
      setCnScore(score);
    }
    async function fetchCandidateDetails() {
      if (!id) return;

      setLoading(true);
      const result = await get_candidate_by_match(Number(candidateid));

      if (result.success && result.data) {
        setCandidateData(result.data);
      } else {
        setError(result.message);
      }
      setLoading(false);
    }

    fetchCandidateDetails();

    if (id) {
      loadJobData();
      console.log('running')
    }
  }, [id]);


  const loadJobData = async () => {
    try {
      const res = await clientApi.get(`api/employer/role/${id}/`);
      console.log(res);
      if (res.status === 200 || res.status === 201) {
        setJRT(res.data.job_title || "");
      } else {
        toast.error("Failed to load job data");
      }
    } catch (error) {
      console.error("Failed to fetch job data:", error);
      toast.error("Failed to load job data");
    } finally {
      //Alo Alo
    }
  };

  const candidate = candidateData
    ? {
        id: candidateData.id.toString(),
        name: candidateData.full_name,
        matchScore: candidateData.profile_percentage,
        yearsExperience: candidateData.cv_parsed_data?.employment_history
          ?.position_start_date
          ? new Date().getFullYear() -
            new Date(
              candidateData.cv_parsed_data.employment_history
                .position_start_date,
            ).getFullYear()
          : 0,
        location: candidateData.location,
        notice: "1 Month Notice",
        visaDaysRemaining: candidateData.expiry_date,
        interviewStatus: "completed",
        interviewDate: "15 January 2024",
        profileImage: null,

        skills: candidateData.cv_parsed_data?.key_skills || [],

        qualifications: candidateData.cv_parsed_data?.education_qualification
          ? [
              {
                name: `${candidateData.cv_parsed_data.education_qualification.degree} - ${candidateData.cv_parsed_data.education_qualification.field_of_study}`,
                year:
                  candidateData.cv_parsed_data.education_qualification
                    .end_date || "N/A",
              },
            ]
          : [],

        experience: candidateData.cv_parsed_data?.employment_history
          ? [
              {
                title:
                  candidateData.cv_parsed_data.employment_history
                    .current_position,
                company:
                  candidateData.cv_parsed_data.employment_history.company_name,
                period: `${candidateData.cv_parsed_data.employment_history.position_start_date || "N/A"} – Present`,
                description:
                  candidateData.cv_parsed_data.professional_summary ||
                  "No description available",
              },
            ]
          : [],

        interviewNotes:
          "Excellent communication skills. Demonstrated strong knowledge of safeguarding procedures. Very personable and caring demeanor.",

        hasRecording: true,
      }
    : {
        id: id || "8842",
        name: "Alexandra Thompson",
        matchScore: 98,
        yearsExperience: 7,
        location: "San Francisco, CA",
        notice: "1 Month Notice",
        visaDaysRemaining: 53,
        interviewStatus: "completed",
        interviewDate: "15 January 2024",
        profileImage: null,

        skills: [
          "Foster Care",
          "Vital Signs Monitoring",
          "Personal Hygiene",
          "Medication Administration",
          "Dementia Care",
          "First Aid Certified",
        ],

        qualifications: [
          { name: "NVQ Level 3 Health & Social Care", year: 2019 },
          { name: "Care Certificate", year: 2018 },
          { name: "First Aid at Work", year: 2023 },
        ],

        experience: [
          {
            title: "Senior Care Assistant",
            company: "Sunrise Care Home",
            period: "2021 – Present",
            description:
              "Leading a team of 5 care assistants, providing person-centered care to 20+ residents.",
          },
          {
            title: "Care Assistant",
            company: "Harmony Healthcare",
            period: "2018 – 2021",
            description:
              "Provided daily care support including personal hygiene, medication, and mobility assistance.",
          },
        ],

        interviewNotes:
          "Excellent communication skills. Demonstrated strong knowledge of safeguarding procedures. Very personable and caring demeanor.",

        hasRecording: true,
      };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] p-6">
        <style>{`
                    * {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                    }
                    @keyframes shimmer {
                        0% {
                            background-position: -1000px 0;
                        }
                        100% {
                            background-position: 1000px 0;
                        }
                    }
                    .shimmer {
                        animation: shimmer 2s infinite linear;
                        background: linear-gradient(to right, #f0f0f0 0%, #e0e0e0 20%, #f0f0f0 40%, #f0f0f0 100%);
                        background-size: 1000px 100%;
                    }
                `}</style>

        <div className="bg-[#0852C9] rounded-t-lg">
          <div className="max-w-[1400px] mx-auto px-6 py-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-5 items-start">
                <div className="w-[194px] h-[110px] rounded-md bg-[#696969] shimmer"></div>
                <div className="flex-1">
                  <div className="h-6 w-48 bg-white/20 rounded shimmer mb-2"></div>
                  <div className="h-4 w-32 bg-white/20 rounded shimmer mb-4"></div>
                  <div className="flex gap-5">
                    <div className="h-4 w-24 bg-white/20 rounded shimmer"></div>
                    <div className="h-4 w-32 bg-white/20 rounded shimmer"></div>
                    <div className="h-4 w-28 bg-white/20 rounded shimmer"></div>
                  </div>
                </div>
              </div>
              <div className="h-8 w-24 bg-white/20 rounded-full shimmer"></div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-5">
          <div className="flex gap-5">
            <div className="h-8 w-40 bg-white rounded-full shimmer"></div>
            <div className="h-8 w-40 bg-white rounded-full shimmer"></div>
          </div>
          <div className="h-8 w-48 bg-white rounded-md shimmer"></div>
        </div>

        <div className="max-w-[1400px] mx-auto mt-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-md p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-9 h-9 rounded-md shimmer"></div>
                  <div className="h-5 w-48 shimmer rounded"></div>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-24 shimmer rounded-full"
                    ></div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-md p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-9 h-9 rounded-md shimmer"></div>
                  <div className="h-5 w-36 shimmer rounded"></div>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 shimmer rounded-md"></div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-md p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-9 h-9 rounded-md shimmer"></div>
                  <div className="h-5 w-40 shimmer rounded"></div>
                </div>
                <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-32 shimmer rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-white rounded-md p-5 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-md shimmer"></div>
                  <div className="h-5 w-32 shimmer rounded"></div>
                </div>
                <div className="h-24 shimmer rounded"></div>
              </div>

              <div className="bg-white rounded-md p-5 shadow-sm">
                <div className="h-6 w-24 shimmer rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-12 shimmer rounded-md"></div>
                  <div className="h-12 shimmer rounded-md"></div>
                </div>
              </div>

              <div className="bg-white rounded-md p-5 shadow-sm">
                <div className="flex flex-col items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-md shimmer"></div>
                  <div className="h-5 w-40 shimmer rounded"></div>
                </div>
                <div className="h-16 shimmer rounded mb-4"></div>
                <div className="h-12 shimmer rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] p-6">
      <style>{`
        * {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
      `}</style>

      <div className="bg-[#0852C9] rounded-t-lg ">
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-5 items-start">
              <div className="relative">
                <div className="w-[194px] h-[110px] rounded-md bg-[#696969] flex items-center justify-center overflow-hidden shadow-sm transition-transform duration-200 ">
                  {candidate.profileImage ? (
                    <img
                      src={candidate.profileImage}
                      alt={candidate.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Play className="w-10 h-10 text-white fill-white" />
                  )}
                </div>
              </div>

              <div className="flex-1 ">
                <h1 className="text-[20px] font-bold text-[#FFFFFF] mb-1 tracking-tight">
                  {candidate.name}
                </h1>
                <p className="text-[15px] text-[#FFFFFF] font-medium mb-4">
                  Candidate #{candidate.id}
                </p>

                <div className="flex flex-wrap gap-5 text-[14px]">
                  <div className="flex items-center gap-2 text-white">
                    <Briefcase className="w-[18px] h-[18px]" />
                    <span>{candidate.yearsExperience} Years</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <MapPin className="w-[18px] h-[18px]" />
                    <span>{candidate.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Clock className="w-[18px] h-[18px]" />
                    <span>{candidate.notice}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#B0D4FD38] bg-opacity-20 backdrop-blur-sm text-white px-4 py-1 rounded-full border border-white border-opacity-30">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-medium">
                  {cnScore}% Match
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between  mt-5">
        <div className="flex gap-[20px]">
          <div className="px-3 py-1.5 rounded-full border border-[#FFBB6D] bg-[#FFEBB4] text-[#532707] text-[13px] font-medium">
            Visa: {candidate.visaDaysRemaining} days remaining
          </div>
          <div className="px-3 py-1.5 rounded-full border border-[#33951A] bg-[#E9FBEF] text-[#33951A] text-[13px] font-medium">
            Interview Not Conducated Yet
          </div>
        </div>
        {/* <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white bg-opacity-20 text-[#1B1A1A] text-[13px] font-medium border border-white border-opacity-30">
                    <Calendar className="w-[14px] h-[14px]" />
                    Interviewed on {candidate.interviewDate}
                </div> */}
      </div>

      <div className="max-w-[1400px] mx-auto mt-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-md p-6 shadow-sm shadow-[#094F9E0F]">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-[6px] bg-[#CFE5FE] flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#0852C9]" />
                </div>
                <h2 className="text-[18px] font-semibold text-[#111827]">
                  Skills & Competencies
                </h2>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {candidate.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-1 rounded-full bg-[#E4F1FF] text-[#0852C9] text-[14px] font-medium transition-all duration-200 hover:bg-[#bfdbfe] hover:shadow-sm cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-md p-6 shadow-sm shadow-[#094F9E0F]">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-lg bg-[#CFE5FE] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#0852C9]" />
                </div>
                <h2 className="text-[18px] font-semibold text-[#111827]">
                  Qualifications
                </h2>
              </div>
              <div className="space-y-3">
                {candidate.qualifications.map((qual, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4.5 bg-[#F1F5FA] rounded-md shadow-[#094F9E0F] transition-colors duration-200 hover:bg-[#F1F5FA]/90"
                  >
                    <span className="font-medium text-[#151515] text-[15px]">
                      {qual.name}
                    </span>
                    <span className=" text-[#494949] font-medium text-[14px] shadow-[#094F9E0F]">
                      {qual.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-md p-6 shadow-sm shadow-[#094F9E0F]">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-lg bg-[#CFE5FE] flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-[#0852C9]" />
                </div>
                <h2 className="text-[18px] font-semibold text-[#111827]">
                  Work Experience
                </h2>
              </div>
              <div className="relative space-y-6 pl-7">
                <div className="absolute left-[9px] top-5 bottom-5 w-[2px] bg-[#e5e7eb]"></div>

                {candidate.experience.map((exp, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-7 top-2 w-5 h-5 rounded-full bg-[#0852C9] border-[3px] border-white shadow-sm"></div>

                    <div className="bg-[#f9fafbmdrounded-lg p-5 shadow-[#094F9E0F] transition-colors duration-200 hover:bg-[#f3f4f6]">
                      <h3 className="font-bold text-[16px] text-[#181818] mb-1">
                        {exp.title}
                      </h3>
                      <div className="flex flex-col items-start gap-3 mb-3">
                        <span className="text-[#0852C9] font-medium text-[14px]">
                          {exp.company}
                        </span>
                        <span className="text-[#3C3A3A] font-medium text-[14px]">
                          {exp.period}
                        </span>
                      </div>
                      <p className="text-[#3C3A3A] leading-relaxed text-[14px]">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-md p-5 shadow-sm shadow-[#094F9E0F]">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-lg bg-[#CFE5FE] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#0852C9]" />
                </div>
                <h3 className="text-[16px] font-semibold text-[#111827]">
                  Interview Notes
                </h3>
              </div>
              <p className="text-[#575757] font-medium leading-relaxed text-[14px]">
                {/* {candidate.interviewNotes} */}
                Interview Not Conducted Yet
              </p>
            </div>

            <div className="bg-white rounded-md p-5 shadow-sm shadow-[#094F9E0F]">
              <h3 className="text-[16px] font-bold text-[#000000] mb-4">
                Decision
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setIsOfferModalOpen(true)}
                  className="w-full py-3 rounded-[6px] bg-[#0852C9] text-white font-medium text-[15px] transition-all duration-200 hover:bg-[#1d4ed8] hover:shadow-md"
                >
                  Make Offer
                </button>
                <button className="w-full py-3 rounded-[6px] bg-[#FFEFED] text-[#FD4343] font-medium text-[15px] border border-[#FF5B5B] transition-all duration-200 hover:bg-[#FD4343]/20">
                  Decline Candidate
                </button>
              </div>
            </div>

            {candidate.hasRecording && (
              <div className="bg-white rounded-md p-5 shadow-sm shadow-[#094F9E0F]">
                <div className="flex flex-col items-center justify-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-[6px] bg-[#CFE5FE] flex items-center justify-center">
                    <Video className="w-5 h-5 text-[#0852C9]" />
                  </div>
                  <h3 className="text-[16px] font-semibold text-[#111827]">
                    Interview Not Conducted
                  </h3>
                </div>
                <p className="text-[14px] text-[#575757] mb-4 leading-relaxed">
                  Interview Not Conducted Yet , After Interview given ,Rewatch
                  the interview to help with your decision
                </p>
                <button className="w-full py-3 rounded-[6px] bg-[#0852C9] text-white font-medium text-[15px] transition-all duration-200 hover:bg-[#1d4ed8] hover:shadow-md">
                  Interview Not Conducted
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <OfferModals
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        candidateName={candidate.name}
        candidateId={id}
        jrt={jrt}
      />
    </div>
  );
};

export default CandidatePage;
