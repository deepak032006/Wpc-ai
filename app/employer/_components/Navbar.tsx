import Logo from '@/components/logo';
import { FaTrashAlt } from 'react-icons/fa';

const Navbar = () => {

  return (
    <nav className="flex items-center justify-start p-2 px-4 bg-white border-b border-[#E5E7EB]">
      {/* Logo section - hidden on mobile, visible on md and up */}
      <div className="hidden md:flex w-60 items-center space-x-2">
        <Logo className='object-contain h-10 w-auto' fontSize={15} />
      </div>

      {/* Main content - full width on mobile, normal width on md and up */}
      <div className="w-full flex items-center justify-between gap-4 md:pl-5 pl-14">
        <p className="text-[18px] text-[#000000] font-semibold">Welcome back !</p>
        
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors">
            <svg className="w-6 h-6 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          
          <img 
            src="/man.jpg" 
            alt="User profile" 
            width="30" 
            height="30" 
            className="rounded-full w-[50px] h-[50px] object-cover border-2 border-[#E5E7EB]"
          />
        </div>
      </div>
    </nav>
  )
}

export default Navbar;