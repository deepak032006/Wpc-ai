import React from 'react';

interface ServiceCardProps {
  title: string;
  price: string;
  badge: string;
  features: string[];
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: () => void;
}

export default function ServiceCard({
  title,
  price,
  badge,
  features,
  isSelected,
  isDisabled,
  onToggle
}: ServiceCardProps) {
  return (
    <div 
      onClick={() => !isDisabled && onToggle()}
      className={`relative p-6 rounded-xl transition-all duration-300 ${
        isSelected 
          ? 'bg-white shadow-lg border-[3px] border-[#2563EB] scale-105' 
          : 'bg-white hover:scale-105 hover:shadow-md'
      } ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} hover:bg-[#c9daff]`}
    >
      {/* Badge */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-[#EFF6FF] text-[#2563EB]">
          {badge}
        </span>
      </div>

      {/* Title */}
      <h3 
        className="text-[18px] font-bold mb-2 leading-tight text-[#111827]"
        dangerouslySetInnerHTML={{ __html: title }}
      />

      {/* Price */}
      <div className="mb-6">
        <span className="text-[36px] font-bold text-[#2563EB]">
          {price}
        </span>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-[10px] font-medium text-[#374151]">
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* Button - Changes based on selection */}
      <button 
        type="button"
        className={`w-full py-3 rounded-lg font-semibold text-[14px] transition ${
          isSelected
            ? 'bg-[#2563EB] text-white'
            : 'bg-[#EFF6FF] text-[#2563EB] hover:bg-[#DBEAFE]'
        }`}
      >
        {isSelected ? 'Selected' : 'Learn More'}
      </button>
    </div>
  );
}