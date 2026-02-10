"use client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react"

interface PostedRole {
  id: number;
  job_title: {id:number, name:string};
  soc_codes: string[];
  salary_range: string;
  job_location: string;
  expected_start_date: string;
  visa_sponsor_availability: boolean;
  status: "open" | "closed";
  created_at: string;
  updated_at: string;
  employer_email: string;
  shortlisted: string;
  applied: string;
}

interface DashboardPagination {
  page: number;
  page_size: number;
  total_pages: number;
}

interface PostedRolesProps {
  postedRoles: PostedRole[];
  pagination?: DashboardPagination;
  loading: boolean;
}

const CircularLoader = ({ size = 40 }) => {
  return (
    <div
      className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"
      style={{ width: size, height: size }}
    />
  );
};



const PostedRoles = ({ postedRoles, pagination, loading }: PostedRolesProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const router =useRouter();
  const jobsPerPage = 5;

  //  for the routing 
  
  // Calculate dummy stats for applied and shortlisted (since not in API response)
  const getRandomStat = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Calculate pagination
  const { currentJobs, totalPages, startIndex, endIndex } = useMemo(() => {
    const allJobs = postedRoles || [];
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const jobs = allJobs.slice(indexOfFirstJob, indexOfLastJob);
    const pages = Math.ceil(allJobs.length / jobsPerPage);

    return {
      currentJobs: jobs,
      totalPages: pages,
      startIndex: indexOfFirstJob + 1,
      endIndex: Math.min(indexOfLastJob, allJobs.length)
    };
  }, [postedRoles, currentPage, jobsPerPage]);

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

if (loading) {
  return (
    <div className="w-full flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-[65%] bg-white rounded-lg py-5 px-5 border border-[#E5E7EB]">
        <div className="w-full flex items-center justify-center py-20 flex-col gap-3">
          <CircularLoader size={44} />
          <p className="text-sm text-gray-500">Loading dashboard data</p>
        </div>
      </div>

      <div className="w-full lg:w-[35%] bg-white rounded-lg py-5 px-5 border border-[#E5E7EB]">
        <h2 className="text-[16px] text-black font-semibold mb-4">
          Upcoming Interviews
        </h2>

        <div className="flex items-center justify-center py-16">
          <CircularLoader size={32} />
        </div>
      </div>
    </div>
  );
}


  return (
    <div className="w-full flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-[65%] h-fit bg-[#FFFFFF] rounded-lg py-5 px-5 shadow-sm shadow-[#00000014]">
        <div className="w-full flex items-start justify-between mb-5">
          <h1 className="text-[16px] text-[#000000] font-semibold">Posted Roles</h1>
          <button className="bg-[#0852C9] rounded-md py-1.5 px-3.5 text-[13px] text-[#FFFFFF] font-medium" onClick={()=>{
            router.push("/employer/dashboard/post-role");
          }}>+ Post Job</button>
        </div>

        {postedRoles.length === 0 ? (
          <div className="w-full flex items-center justify-center py-20">
            <p className="text-[14px] text-[#6B7280]">No posted roles found</p>
          </div>
        ) : (
          <>
            <div className="w-full flex flex-col gap-0">
              {currentJobs.map((job) => (
                <div key={job.id} className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-[#D0D5DD] rounded-md px-4 mb-3 last:mb-0 hover:bg-blue-50 gap-3">
                  <div className="flex flex-col gap-1.5 min-w-0 flex-1 overflow-hidden">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-[14px] text-[#000000] font-medium break-words">{job.job_title.name}</h3>
                      <span className={`text-[11px] px-2 py-0.5 rounded whitespace-nowrap ${job.status === "open" ? "bg-[#ECFDF5] text-[#065F46]" : "bg-[#EFF6FF] text-[#1E40AF]"
                        }`}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-start gap-1 text-[12px] text-[#6B7280] flex-wrap">
                      <span className="flex items-start gap-1 min-w-0 max-w-full">
                        <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="break-all min-w-0">{job.job_location}</span>
                      </span>
                      <span className="whitespace-nowrap">{job.shortlisted} Applied</span>
                      <span className="whitespace-nowrap">{job.applied} Shortlisted</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => router.push(`/employer/dashboard/preview/${job.id}`)} className="p-1.5 hover:bg-[#F3F4F6] rounded">
                      <svg className="w-4.5 h-4.5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button onClick={() => router.push(`/employer/dashboard/preview/${job.id}/matches`)} className="p-1.5 hover:bg-[#F3F4F6] rounded">
                      <svg className="w-4.5 h-4.5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
                    </button>
                    <button onClick={() => router.push(`/employer/dashboard/edit/${job.id}`)} className="p-1.5 hover:bg-[#F3F4F6] rounded">
                      <svg className="w-4.5 h-4.5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button className="p-1.5 hover:bg-[#F3F4F6] rounded">
                      <svg className="w-4.5 h-4.5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between mt-5 pt-3.5 border-t border-[#E5E7EB] gap-3">
                <p className="text-[14px] text-[#4E4D4D]">
                  Showing {startIndex} of {postedRoles.length} roles
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-[15px] text-[#0852C9] font-semibold bg-[#FFFFFF] border border-[#0852C9] rounded-md hover:bg-[#0852C9] hover:text-[#FFFFFF] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowLeft/> Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-[15px] text-[#0852C9] font-semibold bg-[#FFFFFF] border border-[#0852C9] rounded-md hover:bg-[#0852C9] hover:text-[#FFFFFF] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
                  >
                    Next <ArrowRight/>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="w-full lg:w-[35%] h-fit bg-[#FFFFFF] rounded-lg py-5 px-5 shadow-sm shadow-[#00000014]">
        <h2 className="text-[16px] text-[#000000] font-semibold mb-4">Upcoming Interviews</h2>
        {/* <div className="flex flex-col gap-3">
          {[
            { name: "Sarah Johnson", role: "Senior Software Engineer", time: "Tue 6 Jan 10:00 AM GMT", type: "Video" },
            { name: "Sarah Johnson", role: "Senior Software Engineer", time: "Tue 6 Jan 10:00 AM GMT", type: "Video" },
            { name: "Sarah Johnson", role: "Senior Software Engineer", time: "Tue 6 Jan 10:00 AM GMT", type: "Video" }
          ].map((interview, index) => (
            <div key={index} className="pb-3 border border-[#E5E7EB] rounded-lg px-3.5 py-3">
              <h3 className="text-[13px] text-[#000000] font-medium mb-0.5">{interview.name}</h3>
              <p className="text-[12px] text-[#6B7280] mb-1">{interview.role}</p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#6B7280]">{interview.time}</span>
                <div className="flex items-center gap-1 text-[13px] text-[#6B7280]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {interview.type}
                </div>
              </div>
            </div>
          ))}
        </div> */}
        <div>No upcoming Interviews</div>
      </div>
    </div>
  )
}

export default PostedRoles