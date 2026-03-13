import { ReactNode } from "react";

interface WelcomeLayoutProps {
  children: ReactNode;
}

export default function WelcomeLayout({ children }: WelcomeLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden">
      
      {/* Right Panel */}
      <div className="w-full min-h-screen flex items-center justify-center px-4 sm:px-6">
        {children}
      </div>

    </div>
  );
}