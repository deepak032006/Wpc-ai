import Image from "next/image"

const page = () => {
  return (
    <div className="bg-[#FDFEFF] min-h-screen p-5 md:p-8 font-inter">
      <div className='w-full flex flex-col items-start justify-center gap-1.5 mb-8'>
        <h1 className='text-[18px] md:text-[20px] text-[#000000] font-semibold'>Interview</h1>
        <p className='text-[13px] md:text-[14px] text-[#232323]'>Schedule interviews and move candidates forward.</p>
      </div>

      <div className='w-full flex flex-col items-center justify-center gap-3 md:gap-4 mt-8'>
        <Image src="/interview.png" alt="No interviews scheduled" width={600} height={400} className='w-full max-w-[400px] md:max-w-[600px] xl:max-w-[800px] h-[300px] md:h-[400px] xl:h-[500px]' />
        
        <div className="w-full max-w-[600px] px-4 flex flex-col items-center justify-center gap-3 md:gap-4">
          <h2 className='text-[24px] md:text-[28px] xl:text-[30px] text-[#2F2F2F] font-semibold text-center'>
            No interviews scheduled
          </h2>
          <p className='text-[16px] md:text-[20px] xl:text-[22px] text-[#373737] text-center leading-relaxed'>
            You haven{"'"}t scheduled any interviews yet. Once candidates are shortlisted, interviews will appear here.
          </p>

          <div className='flex flex-col sm:flex-row items-center justify-between gap-[26px] mt-4'>
            <button className='px-6 py-3 border-2 border-[#0852C9] text-[#0852C9] rounded-md text-[16px] md:text-[17px] font-semibold hover:bg-[#0852C9] hover:text-white transition-colors'>
              View candidates
            </button>
            <button className='px-6 py-3 bg-[#0852C9] text-white rounded-md text-[16px] md:text-[17px] font-semibold transition-colors'>
              Schedule an interview
            </button>
          </div>

          <p className='text-[14px] md:text-[16px] text-[#424242] text-center mt-2'>
            Shortlist candidates to start scheduling interviews.
          </p>
        </div>
      </div>
    </div>
  )
}

export default page