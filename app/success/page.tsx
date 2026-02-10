"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] font-inter">
      <div className="md:max-w-240 w-full flex flex-col items-center justify-center bg-white rounded-lg shadow-sm shadow-[#0E3A801F] py-10 px-9">
        <div className="flex items-center justify-center mb-6">
          <div className="w-32 h-32 rounded-full bg-transparent flex items-center justify-center">
            <Image
              src="/done.png"
              alt="Success"
              width={42}
              height={42}
              className="w-full h-full"
              priority
            />
          </div>
        </div>

        <h2 className="text-[22px] lg:text-[26px] 2xl:text-[30px] font-semibold text-[#000000] mb-2">
          Submit Successfully
        </h2>
        <p className="text-[15px] sm:text-[17px] lg:text-[20px] 2xl:text-[25px] text-[#383737] mb-10">
           Verification successfully.
        </p>

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full bg-[#0A65CC] hover:bg-[#0A65CC]/90 text-white py-3.5 rounded-lg font-semibold text-[15px] sm:text-[16px] transition"
        >
          Go To Dashboard
        </button>
      </div>
    </div>
  );
}
