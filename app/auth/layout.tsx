import React from "react";
import { FiCheckCircle } from "react-icons/fi";
import { LuClipboard } from "react-icons/lu";
import { MdLock } from "react-icons/md";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 overflow-hidden">
      <div className="w-full flex justify-center px-4 py-8">
        {children}
      </div>
    </div>
  );
}