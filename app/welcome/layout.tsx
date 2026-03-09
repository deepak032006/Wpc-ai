"use client";
import { BiBook, BiLock } from "react-icons/bi";
import { GrSecure } from "react-icons/gr";

export default function WelcomeLayout({ children }) {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden">
      
      {/* Right Panel */}
      <div className="w-full min-h-screen flex items-center justify-center px-4 sm:px-6">
        {children}
      </div>

    </div>
  );
}