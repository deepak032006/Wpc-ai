const page = () => {
  return (
    <div className="bg-[#FDFEFF] min-h-screen p-5 md:p-8 font-inter">
      <div className='w-full flex flex-col items-start justify-center gap-1.5 mb-8'>
        <h1 className='text-[18px] md:text-[20px] text-[#000000] font-semibold'>Candidates</h1>
        <p className='text-[13px] md:text-[14px] text-[#232323]'>All candidates who have applied to your posted roles will appear here.</p>
      </div>

      <div className='w-full flex flex-col items-center justify-center gap-6 md:gap-8 mt-8'>
        <img src="/candidate.png" alt="No candidates found" className='w-full max-w-[350px] md:max-w-[600px] xl:max-w-[750px] h-auto object-contain' />
        
        <div className="w-full max-w-[600px] md:max-w-[700px] px-4 flex flex-col items-center justify-center gap-3 md:gap-4">
          <h2 className='text-[24px] md:text-[28px] xl:text-[30px] text-[#2F2F2F] font-semibold text-center'>
            No candidate matches found
          </h2>
          <p className='text-[16px] md:text-[20px] xl:text-[22px] text-[#373737] text-center leading-relaxed'>
            There are currently no candidates that match your job requirements. New profiles are added regularly.
          </p>
        </div>
      </div>
    </div>
  )
}

export default page