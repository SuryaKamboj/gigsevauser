import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faArrowRight } from '@fortawesome/free-solid-svg-icons';

/**
 * HeroBanner Component for KAIROVA Customer Portal
 * 
 * Features:
 * - Premium hero section
 * - NCCT Cooperative verification badge
 * - Primary call-to-action button
 * - Direct worker payout text, FontAwesome icons only
 */
export default function HeroBanner({ onCtaClick }) {
  return (
    <section className="w-full bg-[#0F172A] border border-[#F5B700]/30 rounded-[20px] p-6 sm:p-8 text-white transition-all shadow-xl relative overflow-hidden">
      {/* Verification Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5B700]/10 border border-[#F5B700]/40 text-xs font-bold text-[#F5B700] mb-3">
        <FontAwesomeIcon icon={faCircleCheck} className="w-3.5 h-3.5 text-[#10B981]" aria-hidden="true" />
        <span>Verified Cooperative Workforce</span>
      </div>

      {/* Hero Heading */}
      <h1 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight tracking-tight text-white">
        Trusted Cooperative Workers Near You
      </h1>

      {/* Hero Subheading */}
      <p className="text-sm text-slate-300 mt-2 leading-relaxed max-w-lg">
        Book verified professionals backed by NCCT cooperatives with transparent pricing and direct worker payout.
      </p>

      {/* Hero Action Button */}
      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={onCtaClick}
          className="px-6 py-3 rounded-[14px] bg-[#F5B700] text-[#0F172A] font-bold text-sm hover:bg-[#E0A700] active:scale-95 transition-all flex items-center gap-2 shadow-md"
          aria-label="Book a cooperative service now"
        >
          <span>Book Service</span>
          <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

