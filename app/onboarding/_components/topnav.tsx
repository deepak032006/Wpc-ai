import Logo from '@/components/logo';
import { useOnboardingStore } from '@/app/store/onboardingStore';
import React from 'react'
import { FaTrashAlt } from 'react-icons/fa';

const Topnav = ( {text = ""}: {text?: string}) => {

    const { resetOnboarding } = useOnboardingStore();

    const handleClearForm = () => {
        if (window.confirm('Are you sure you want to clear all form data and start over?')) {
            resetOnboarding();
        }
    };

  return (
    <nav className="flex items-center justify-between  p-2 px-4 bg-white shadow-md">

        <div className="flex items-center space-x-2">
            <Logo className='object-contain h-10 w-auto' fontSize={10} />
            <span className='text-black text-xl font-semibold'>{text}</span>
        </div>


        <button
            onClick={handleClearForm}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear all form data"
          >
            <FaTrashAlt size={10} />
            <span className="hidden sm:inline text-xs">Start Over</span>
          </button>

    </nav>
  )
}

export default Topnav;