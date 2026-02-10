'use client';

import Navbar from "@/app/employer/_components/Navbar";
import Sidebar from "../components/Sidebar";


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-[#FDFEFF]">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto pb-25 md:p-0">
                    {children}
                </main>
            </div>
        </div>
    );
}