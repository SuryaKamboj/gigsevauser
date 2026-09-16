import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faHeart, faBriefcase, faIndianRupeeSign, faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons';

export default function CooperativeImpactPanel({
  workersSupported = '1,284 Workers Supported',
  familiesBenefited = '4,862 Families Benefited',
  jobsCompleted = '52,000+ Jobs Completed',
  incomeGenerated = '₹3.8 Crore Artisan Income Generated',
  compact = false
}) {
  return (
    <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-5 sm:p-7 space-y-4 shadow-xs">
      <div className="flex items-center gap-2.5 border-b border-[#E8E2D8] pb-3">
        <div className="w-8 h-8 rounded-xl bg-[#A66666]/10 text-[#A66666] flex items-center justify-center border border-[#A66666]/20 shrink-0">
          <FontAwesomeIcon icon={faHandHoldingHeart} className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold font-display text-[#17233A]">
            Cooperative Social & Economic Impact
          </h3>
          <p className="text-xs text-[#6B7280]">
            Direct financial uplift generated for local artisan families through GigSave
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Workers Supported */}
        <div className="bg-[#F8F6F2] border border-[#E8E2D8] p-4 rounded-2xl flex flex-col justify-between space-y-2 hover:border-[#A66666]/50 transition-all">
          <div className="flex items-center justify-between text-[#A66666]">
            <FontAwesomeIcon icon={faUsers} className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FCFBF8] px-2 py-0.5 rounded-full border border-[#E8E2D8]">Artisans</span>
          </div>
          <div>
            <span className="text-base sm:text-xl font-extrabold font-display text-[#17233A] block leading-tight">
              {workersSupported}
            </span>
            <span className="text-[11px] text-[#6B7280] font-medium block mt-0.5">Verified Cooperative Members</span>
          </div>
        </div>

        {/* Families Benefited */}
        <div className="bg-[#F8F6F2] border border-[#E8E2D8] p-4 rounded-2xl flex flex-col justify-between space-y-2 hover:border-[#A66666]/50 transition-all">
          <div className="flex items-center justify-between text-[#A66666]">
            <FontAwesomeIcon icon={faHeart} className="w-5 h-5 text-[#A66666]" />
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FCFBF8] px-2 py-0.5 rounded-full border border-[#E8E2D8]">Welfare</span>
          </div>
          <div>
            <span className="text-base sm:text-xl font-extrabold font-display text-[#17233A] block leading-tight">
              {familiesBenefited}
            </span>
            <span className="text-[11px] text-[#6B7280] font-medium block mt-0.5">Healthcare & Pension Covered</span>
          </div>
        </div>

        {/* Jobs Completed */}
        <div className="bg-[#F8F6F2] border border-[#E8E2D8] p-4 rounded-2xl flex flex-col justify-between space-y-2 hover:border-[#A66666]/50 transition-all">
          <div className="flex items-center justify-between text-[#A66666]">
            <FontAwesomeIcon icon={faBriefcase} className="w-5 h-5 text-[#A66666]" />
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FCFBF8] px-2 py-0.5 rounded-full border border-[#E8E2D8]">Track Record</span>
          </div>
          <div>
            <span className="text-base sm:text-xl font-extrabold font-display text-[#17233A] block leading-tight">
              {jobsCompleted}
            </span>
            <span className="text-[11px] text-[#6B7280] font-medium block mt-0.5">Peer Quality Verified</span>
          </div>
        </div>

        {/* Income Generated */}
        <div className="bg-[#F8F6F2] border border-[#E8E2D8] p-4 rounded-2xl flex flex-col justify-between space-y-2 hover:border-[#4E8A57]/50 transition-all">
          <div className="flex items-center justify-between text-[#4E8A57]">
            <FontAwesomeIcon icon={faIndianRupeeSign} className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FCFBF8] px-2 py-0.5 rounded-full border border-[#E8E2D8]">Fair Pay</span>
          </div>
          <div>
            <span className="text-base sm:text-lg font-extrabold font-display text-[#4E8A57] block leading-tight">
              {incomeGenerated}
            </span>
            <span className="text-[11px] text-[#6B7280] font-medium block mt-0.5">100% Direct Member Earnings</span>
          </div>
        </div>

      </div>
    </div>
  );
}
