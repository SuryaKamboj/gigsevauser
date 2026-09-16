import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faArrowRight } from '@fortawesome/free-solid-svg-icons';

/**
 * Urgent Booking Card Component for GigSave
 * 
 * Specs:
 * - Positioned as a faster service option (Priority 15-Minute Dispatch)
 * - Soft red outline (#EF4444/30)
 * - Light red background on hover (#FDF2F2)
 * - No warning or danger styling
 * - Premium, service-oriented aesthetic
 */
export default function EmergencySosCard({
  title = 'Need Urgent Priority Booking?',
  subtitle = 'Instant priority dispatch connects you with nearby verified active artisans within 15 minutes.',
  onDispatchClick
}) {
  return (
    <div className="w-full bg-[#FFFFFF] border border-[#EF4444]/25 rounded-[24px] p-5 sm:p-6 transition-all duration-300 hover:bg-[#FDF2F2]/60 hover:border-[#EF4444]/40 group">
      <div className="flex items-start justify-between gap-4">
        {/* Left Side: Priority Speed Icon & Text */}
        <div className="flex items-start gap-3.5">
          <div 
            className="w-10 h-10 rounded-full bg-[#EF4444]/10 text-[#EF4444] shrink-0 flex items-center justify-center border border-[#EF4444]/20 group-hover:bg-[#EF4444] group-hover:text-white transition-colors"
            aria-hidden="true"
          >
            <FontAwesomeIcon icon={faBolt} className="w-4 h-4" />
          </div>

          <div className="flex flex-col">
            <h3 className="text-base font-bold font-display tracking-tight text-[#0F172A] leading-snug">
              {title}
            </h3>
            <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Dispatch Action Button */}
      <div className="mt-4 pt-3.5 border-t border-[#EFEBE4] flex items-center justify-end">
        <button
          type="button"
          onClick={onDispatchClick}
          className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#FFFFFF] text-[#EF4444] border border-[#EF4444]/40 font-bold text-xs tracking-wide hover:bg-[#EF4444] hover:text-white active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          aria-label="Book Urgent Priority Service"
        >
          <FontAwesomeIcon icon={faBolt} className="w-3.5 h-3.5" />
          <span>Request Urgent Booking</span>
          <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5 ml-1" />
        </button>
      </div>
    </div>
  );
}
