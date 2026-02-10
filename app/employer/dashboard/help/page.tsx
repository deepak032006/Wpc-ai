import Image from "next/image"
import { Search, User, Lock } from "lucide-react"

const page = () => {
  return (
    <div className="bg-[#FDFEFF] min-h-screen p-5 md:p-8 font-inter">
      <div className="w-full  py-2">
        <div className="flex flex-col items-center justify-center gap-6 mb-12">
          <Image 
            src="/help.png" 
            alt="Help" 
            width={200} 
            height={200} 
            className="w-[180px] md:w-[400px] h-auto object-contain"
          />
          
          <div className="text-center">
            <h1 className="text-[24px] md:text-[28px] text-[#313131] font-bold mb-2">
              How can we help you?
            </h1>
            <p className="text-[20px] md:text-[22px] text-[#535353]">
              Find answers, guides, and support for using WPC Jobs.
            </p>
          </div>

          <div className="w-full  relative mt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#686868]" />
            <input
              type="text"
              placeholder="Search help articles..."
              className="w-full pl-12 pr-4 py-4.5 border border-[#D0DAE5] rounded-[14px] shadow-sm shadow-[#0A65CC0F] text-[16px] text-[#686868] focus:outline-none focus:border-[#1976D2] bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto">
          <div className="bg-white border border-[#C2D7F9C4] rounded-lg px-6 py-7.5 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex gap-4">
              <div className="w-15 h-15 bg-[#D8EAFF] rounded-[9px] flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-[#0A65CC]" />
              </div>
              <div>
                <h3 className="text-[16px] md:text-[17px] text-[#1F1E1E] font-semibold mb-2">
                  Update Profile Details
                </h3>
                <p className="text-[13px] md:text-[14px] text-[#747474] leading-relaxed">
                  Guidance for editing your company and user information, including logo, contact details, and company description.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#C2D7F9C4] rounded-lg px-6 py-7.5 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex gap-4">
              <div className="w-15 h-15 bg-[#D8EAFF] rounded-[9px] flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-[#0A65CC]" />
              </div>
              <div>
                <h3 className="text-[16px] md:text-[17px] text-[#1F1E1E] font-semibold mb-2">
                  Change Password
                </h3>
                <p className="text-[13px] md:text-[14px] text-[#747474] leading-relaxed">
                  Steps to securely update your account password and enable two-factor authentication for added security.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page