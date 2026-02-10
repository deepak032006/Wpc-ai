'use client'

import { useEffect, useState } from 'react';
import { Users2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import PostedRoles from '../_components/PostedRoles';
import EmployerDasboardAction, { EmployerDashboardActionResponse } from '@/app/action/job_role.action';

interface StatsData {
    rolesPosted: number;
    rolesPostedThisMonth: number;
    interviewsConducted: number;
    interviewsThisMonth: number;
    offersSent: number;
    offersThisMonth: number;
}

const StatsBox = ({ data }: { data: StatsData | null }) => {
    return (
        <div className='w-full flex flex-col md:flex-row items-center justify-between gap-6 mb-5'>
            <div className='w-full bg-[#FFFFFF] shadow-md shadow-[#00000014] rounded-md py-4 px-4 flex flex-col items-start justify-center gap-2.5'>
                <div className='w-full flex flex-row items-center justify-between'>
                    <div className='flex flex-col gap-1.5 items-start'>
                        <h2 className='text-[15px] text-[#2E2D2D] font-medium'>
                            Roles Posted
                        </h2>
                        <h1 className='text-[20px] text-[#1D1D1D] font-semibold'>
                            {data?.rolesPosted ?? 0}
                        </h1>
                    </div>
                    <div className='w-11 h-11 rounded-full bg-[#CFE5FE] flex items-center justify-center p-2.5 text-[#0852C9]'>
                        <Users2 size={20} />
                    </div>
                </div>
                <p className='text-[13px] font-medium text-[#33951A]'>
                    +{data?.rolesPostedThisMonth ?? 0} this month
                </p>
            </div>
            <div className='w-full bg-[#FFFFFF] shadow-md shadow-[#00000014] rounded-md py-4 px-4 flex flex-col items-start justify-center gap-2.5'>
                <div className='w-full flex flex-row items-center justify-between'>
                    <div className='flex flex-col gap-1.5 items-start'>
                        <h2 className='text-[15px] text-[#2E2D2D] font-medium'>
                            Interviews Conducted
                        </h2>
                        <h1 className='text-[20px] text-[#1D1D1D] font-semibold'>
                            {data?.interviewsConducted ?? 0}
                        </h1>
                    </div>
                    <div className='w-11 h-11 rounded-full bg-[#CFE5FE] flex items-center justify-center p-2.5 text-[#0852C9]'>
                        <Users2 size={20} />
                    </div>
                </div>
                <p className='text-[13px] font-medium text-[#33951A]'>
                    +{data?.interviewsThisMonth ?? 0} vs last month
                </p>
            </div>
            <div className='w-full bg-[#FFFFFF] shadow-md shadow-[#00000014] rounded-md py-4 px-4 flex flex-col items-start justify-center gap-2.5'>
                <div className='w-full flex flex-row items-center justify-between'>
                    <div className='flex flex-col gap-1.5 items-start'>
                        <h2 className='text-[15px] text-[#2E2D2D] font-medium'>
                            Offers Sent
                        </h2>
                        <h1 className='text-[20px] text-[#1D1D1D] font-semibold'>
                            {data?.offersSent ?? 0}
                        </h1>
                    </div>
                    <div className='w-11 h-11 rounded-full bg-[#CFE5FE] flex items-center justify-center p-2.5 text-[#0852C9]'>
                        <Users2 size={20} />
                    </div>
                </div>
                <p className='text-[13px] font-medium text-[#33951A]'>
                    {data?.offersThisMonth === 0 ? 'Same as last month' : `+${data?.offersThisMonth ?? 0} this month`}
                </p>
            </div>
        </div>
    )
}

export default function EmployerDashboard() {
    const router = useRouter();
    const [dashboardData, setDashboardData] = useState<EmployerDashboardActionResponse['data'] | null>(null);
    const [statsData, setStatsData] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = async() => {
        try {
            setLoading(true);
            const res = await EmployerDasboardAction();
            if (!res.success) {
                toast.error(res.message || "Failed to Get Dashboard");
                return;
            }
            console.log(res);
            if (res.data) {
                setDashboardData(res.data);
                setStatsData({
                    rolesPosted: res.data.total_posted_roles,
                    rolesPostedThisMonth: res.data.roles_posted_this_month,
                    interviewsConducted: res.data.interviews_conducted,
                    interviewsThisMonth: res.data.interviews_conducted_this_month,
                    offersSent: res.data.offers_sent,
                    offersThisMonth: res.data.offers_sent_this_month,
                });
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred while fetching dashboard");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDashboard();
    }, []);

    const handleLogout = () => {
        try {
            const cookies = document.cookie.split(";");

            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i];
                const eqPos = cookie.indexOf("=");
                const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";

                const domain = window.location.hostname;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + domain;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=." + domain;
            }

            toast.success('Logged out successfully');
            router.push('/welcome');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Failed to logout');
        }
    };

    return (
        <div className="bg-[#FDFEFF] p-3 md:p-5 font-inter">
            <div className='w-full flex flex-col items-start justify-center gap-1.5 mb-4'>
                <h1 className='text-[18px] md:text-[20px] text-[#000000] font-semibold'>Employer Dashboard</h1>
                <p className='text-[13px] md:text-[14px] text-[#232323]'>Manage your matched candidates and recruitment pipeline</p>
            </div>
            <StatsBox data={statsData} />
            <PostedRoles 
                postedRoles={dashboardData?.posted_roles || []} 
                pagination={dashboardData?.posted_roles_pagination}
                loading={loading}
            />
        </div>
    )
}