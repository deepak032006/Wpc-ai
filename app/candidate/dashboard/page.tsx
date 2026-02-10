'use client';

import { Users2, Clock, FileText, Building2, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { get_condidate_dashboard } from '@/app/action/candidate.action';

const TopStats = ({ stats }: { stats: any }) => {
  const statItems = [
    { label: 'Total Applications', value: stats?.total_applications || 0, icon: Users2 },
    { label: 'Active Interviews', value: stats?.active_interviews || 0, icon: Clock },
    { label: 'Offers Received', value: stats?.offers_received || 0, icon: FileText },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
      {statItems.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-md shadow-sm shadow-[#0E347212] px-5 py-3.5 flex items-start justify-between "
        >
          <div className="flex flex-col">
            <div className="w-14 h-14 bg-[#CFE5FE] rounded-md flex items-center justify-center text-[#0A65CC] mb-3">
              <item.icon size={24} strokeWidth={2} />
            </div>
            <p className="text-[18px] text-[#2C2C2C] font-medium">{item.label}</p>
          </div>
          <h2 className="text-[24px] font-semibold text-[#1F1E1E]">
            {item.value}
          </h2>
        </div>
      ))}
    </div>
  );
};


const UpcomingInterviews = ({ interviews }: { interviews: any[] }) => {
  if (!interviews || interviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm shadow-[#00000012] py-6 px-4.5">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="font-semibold text-[#000000] text-[20px]">
              Upcoming Interviews
            </h3>
            <p className="text-[18px] text-[#4D4D4D] mt-1">Your scheduled interview sessions</p>
          </div>
          <Calendar className="text-[#1F1E1E]" size={24} strokeWidth={1.5} />
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <Calendar className="text-gray-300 mb-4" size={48} strokeWidth={1.5} />
          <p className="text-[#4D4D4D] text-base">No upcoming interviews</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm shadow-[#00000012] py-6 px-4.5">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-semibold text-[#000000] text-[20px]">
            Upcoming Interviews
          </h3>
          <p className="text-[18px] text-[#4D4D4D] mt-1">Your scheduled interview sessions</p>
        </div>
        <Calendar className="text-[#1F1E1E]" size={24} strokeWidth={1.5} />
      </div>

      <div className="flex flex-col gap-4">
        {interviews.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-start border border-[#D0D5DDC4] rounded-md p-5 bg-white hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-[#CFE5FE] rounded-md flex items-center justify-center text-[#0A65CC]">
                <Building2 className="text-[#0A65CC]" size={20} strokeWidth={2} />
              </div>
              <div className='flex items-start gap-[6px]'>
                <div>
                  <p className="font-semibold text-[#1F1E1E] text-base">{item.role}</p>
                  <p className="text-sm text-[#4D4D4D] mt-1">{item.company}</p>
                </div>
                <span className="inline-block h-fit text-xs text-blue-700 bg-blue-50 px-3 py-1 rounded-full font-medium border border-blue-200">
                  Scheduled
                </span>
              </div>
            </div>
            <div className="text-sm text-[#1F1E1E] text-right">
              <p className="font-medium">{item.date}</p>
              <p className="text-[#4D4D4D] mt-1">{item.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-6 mt-2 border-t border-gray-200">
        <p className="text-sm text-[#2C2C2C] cursor-pointer hover:text-[#1F1E1E]">
          View All Interviews
        </p>
        <button className="text-sm text-[#0A65CC] font-medium hover:bg-[#0852C9]/5 border border-[#0A65CC] rounded-[6px] px-5 py-2">
          Next →
        </button>
      </div>
    </div>
  );
};


const OffersReceived = ({ offers }: { offers: any[] }) => {
  if (!offers || offers.length === 0) {
    return (
      <div className="h-fit bg-white rounded-lg shadow-sm shadow-[#00000012] py-6 px-4.5">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="font-semibold text-[#000000] text-[20px]">Offers Received</h3>
            <p className="text-[18px] text-[#4D4D4D] mt-1">Review your job offers</p>
          </div>
          <Calendar className="text-[#1F1E1E]" size={24} strokeWidth={1.5} />
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <FileText className="text-gray-300 mb-4" size={48} strokeWidth={1.5} />
          <p className="text-[#4D4D4D] text-base">No offers received</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-fit bg-white rounded-lg shadow-sm shadow-[#00000012] py-6 px-4.5">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-semibold text-[#000000] text-[20px]">Offers Received</h3>
          <p className="text-[18px] text-[#4D4D4D] mt-1">Review your job offers</p>
        </div>
        <Calendar className="text-[#1F1E1E]" size={24} strokeWidth={1.5} />
      </div>

      <div className="flex flex-col gap-4">
        {offers.map((offer, index) => (
          <div key={index} className="border border-[#D0D5DDC4] rounded-md p-5 bg-white hover:bg-blue-50">
            <div className="flex items-start justify-between mb-2">
              <p className="font-medium text-[#1F1E1E] text-base">
                {offer.role}
              </p>
              <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium border ${
                offer.status === 'Pending' 
                  ? 'bg-yellow-50 text-yellow-700 border-yellow-300'
                  : 'bg-green-50 text-green-700 border-green-300'
              }`}>
                {offer.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#4D4D4D]">
              <span>{offer.company}</span>
              <Clock size={16} strokeWidth={2} className="ml-2" />
              <span>{offer.expiry}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-5 bg-[#0A65CC] hover:bg-[#0A65CC]/90 text-white py-3 rounded-md text-base font-medium transition-colors shadow-sm">
        Review Offers
      </button>
    </div>
  );
};


const RecentActivity = ({ activities }: { activities: any[] }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm shadow-[#00000012] py-6 px-4.5 mt-5">
        <h3 className="font-semibold text-[#000000] text-[20px] mb-2">
          Recent Activity
        </h3>
        <div className="flex flex-col items-center justify-center py-12">
          <Clock className="text-gray-300 mb-4" size={48} strokeWidth={1.5} />
          <p className="text-[#4D4D4D] text-base">No recent activity</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm shadow-[#00000012] py-6 px-4.5 mt-5">
      <h3 className="font-semibold text-[#000000] text-[20px] mb-2">
        Recent Activity
      </h3>

      <div className="flex flex-col gap-4">
        {activities.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 bg-[#F4F7FD] rounded-md py-4.5 px-6"
          >
            <div className="w-3 h-3 bg-[#0A65CC] rounded-full flex-shrink-0"></div>
            <div className="flex-1">
              <p className="text-base text-[#1F1E1E]">{item.text}</p>
              <p className="text-sm text-[#4D4D4D] mt-1">{item.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* -------------------- MAIN PAGE -------------------- */

export default function CandidateDashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await get_condidate_dashboard();
        
        if (response.success) {
          setDashboardData(response.data);
        } else {
          if (response.detail === "Authentication credentials were not provided.") {
            toast.error('Session expired. Please login again.');
            router.push('/welcome');
          } else {
            toast.error(response.message || 'Failed to load dashboard');
          }
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  const handleLogout = () => {
    try {
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });

      toast.success('Logged out successfully');
      router.push('/welcome');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 font-sans">
        {/* Top Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-md shadow-sm shadow-[#0E347212] px-5 py-3.5 flex items-start justify-between animate-pulse"
            >
              <div className="flex flex-col">
                <div className="w-14 h-14 bg-gray-200 rounded-md mb-3"></div>
                <div className="h-5 w-32 bg-gray-200 rounded"></div>
              </div>
              <div className="h-7 w-12 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Interviews Skeleton */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm shadow-[#00000012] py-6 px-4.5">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="h-6 w-48 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-5 w-64 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex justify-between items-start border border-[#D0D5DDC4] rounded-md p-5 bg-white animate-pulse"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 bg-gray-200 rounded-md"></div>
                    <div className="flex-1">
                      <div className="h-5 w-48 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Offers Received Skeleton */}
          <div className="h-fit bg-white rounded-lg shadow-sm shadow-[#00000012] py-6 px-4.5">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="h-6 w-36 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="flex flex-col gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="border border-[#D0D5DDC4] rounded-md p-5 bg-white animate-pulse">
                  <div className="flex items-start justify-between mb-2">
                    <div className="h-5 w-40 bg-gray-200 rounded"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="h-4 w-48 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>

            <div className="w-full h-12 bg-gray-200 rounded-md mt-5 animate-pulse"></div>
          </div>
        </div>

        {/* Recent Activity Skeleton */}
        <div className="bg-white rounded-lg shadow-sm shadow-[#00000012] py-6 px-4.5 mt-5">
          <div className="h-6 w-36 bg-gray-200 rounded mb-6 animate-pulse"></div>

          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-[#F4F7FD] rounded-md py-4.5 px-6 animate-pulse"
              >
                <div className="w-3 h-3 bg-gray-300 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6 font-sans">
      <TopStats stats={dashboardData?.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UpcomingInterviews interviews={dashboardData?.upcoming_interviews} />
        </div>
        <OffersReceived offers={dashboardData?.offers} />
      </div>

      <RecentActivity activities={dashboardData?.recent_activity} />
    </div>
  );
}