'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { HiBuildingOffice2 } from 'react-icons/hi2';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signupAction } from '../_action/auth.action';
import toast, { Toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

type RegisterFormData = {
  email: string;
  password: string;
  confirmPassword: string;
  userType: 'candidate' | 'employer';
};

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {currentChoosed, setCurrentChoosed} = useAuth();
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>({
    defaultValues: {
      userType: (!currentChoosed || currentChoosed === '') ? 'candidate' : currentChoosed
    }
  });

  const password = watch('password');
  const userTypeValue = watch('userType');

  useEffect(() => {
    if (userTypeValue) {
      setCurrentChoosed(userTypeValue);
    }
  }, [userTypeValue, setCurrentChoosed]);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    
    try {
      const result = await signupAction({
        email: data.email,
        password: data.password,
        role: data.userType,
      });
      console.log("Response: ",result)
      if (result.success) {
        toast.success(result.message);
        router.push(`/onboarding/${result.data?.role}`);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center px-4 py-6 md:p-12 min-h-screen overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-5 sm:p-6 md:p-8">
        <div className="flex flex-col items-center justify-center mb-4 md:mb-6">
          <Image 
            src="/logo/main.png" 
            alt="WPC Jobs Logo" 
            width={180} 
            height={60}
            className="object-contain h-14 sm:h-16 md:h-20 w-auto"
          />
          <span className='text-[#002B92] font-bold text-sm md:text-base'>WPC JOBS</span>
        </div>

        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 md:mb-2">Create Account</h2>
          <p className="text-gray-600 text-sm md:text-base">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-5">
          <div>
            <label htmlFor="email" className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                placeholder="Enter email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="..........."
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  }
                })}
                className="w-full pl-9 md:pl-10 pr-11 md:pr-12 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
              >
                {showPassword ? (
                  <FiEyeOff className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <FiEye className="w-4 h-4 md:w-5 md:h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="..........."
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                className="w-full pl-9 md:pl-10 pr-11 md:pr-12 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
              >
                {showConfirmPassword ? (
                  <FiEyeOff className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <FiEye className="w-4 h-4 md:w-5 md:h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
              I am a..
            </label>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <label className="relative">
                <input
                  type="radio"
                  value="candidate"
                  {...register('userType')}
                  className="peer sr-only"
                  disabled={isLoading}
                />
                <div className="flex flex-col items-center justify-center p-3 md:p-4 border-2 border-gray-300 rounded-lg cursor-pointer peer-checked:border-primary peer-checked:bg-primary/10 hover:border-gray-400 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                  <FiUser className="w-6 h-6 md:w-8 md:h-8 mb-1.5 md:mb-2 text-primary peer-checked:text-primary" />
                  <span className="text-xs md:text-sm font-medium text-gray-700">Candidate</span>
                </div>
              </label>
              <label className="relative">
                <input
                  type="radio"
                  value="employer"
                  {...register('userType')}
                  className="peer sr-only"
                  disabled={isLoading}
                />
                <div className="flex flex-col items-center justify-center p-3 md:p-4 border-2 border-gray-300 rounded-lg cursor-pointer peer-checked:border-primary peer-checked:bg-primary/10 hover:border-gray-400 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                  <HiBuildingOffice2 className="w-6 h-6 md:w-8 md:h-8 mb-1.5 md:mb-2 text-primary peer-checked:text-primary" />
                  <span className="text-xs md:text-sm font-medium text-gray-700">Employer</span>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0852C9] hover:bg-blue-700 text-white font-semibold py-2.5 md:py-3 text-sm md:text-base rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="text-center text-xs md:text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;