import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake, faUserCheck, faHouseUser } from '@fortawesome/free-solid-svg-icons';

export default function WhyCooperativesMatter() {
  return (
    <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-5 sm:p-8 space-y-5 shadow-xs">
      <div className="text-center max-w-xl mx-auto space-y-1">
        <span className="text-[10px] font-bold text-[#A66666] uppercase tracking-wider bg-[#F8F6F2] px-3 py-1 rounded-full border border-[#E8E2D8]">
          Ethical Digital Economy
        </span>
        <h3 className="text-xl sm:text-2xl font-extrabold font-display text-[#17233A]">
          Why Cooperatives Matter
        </h3>
        <p className="text-xs text-[#6B7280]">
          How GigSave transforms traditional gig exploitation into member-owned prosperity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
        
        {/* 1. Fair Worker Earnings */}
        <div className="bg-[#F8F6F2] border border-[#E8E2D8] p-5 rounded-2xl space-y-2 text-center flex flex-col items-center">
          <div className="w-10 h-10 rounded-2xl bg-[#FCFBF8] border border-[#E8E2D8] text-[#A66666] flex items-center justify-center mb-1">
            <FontAwesomeIcon icon={faHandshake} className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#17233A]">Fair Worker Earnings</h4>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Traditional corporate platforms extract up to 30% commission. On GigSave, 100% of service labor goes straight to member workers.
          </p>
        </div>

        {/* 2. Verified Service Quality */}
        <div className="bg-[#F8F6F2] border border-[#E8E2D8] p-5 rounded-2xl space-y-2 text-center flex flex-col items-center">
          <div className="w-10 h-10 rounded-2xl bg-[#FCFBF8] border border-[#E8E2D8] text-[#4E8A57] flex items-center justify-center mb-1">
            <FontAwesomeIcon icon={faUserCheck} className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#17233A]">Verified Peer Service</h4>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Cooperative members hold each other accountable through peer quality audits, ensuring skilled, honest, and safe home repairs.
          </p>
        </div>

        {/* 3. Community Enrichment */}
        <div className="bg-[#F8F6F2] border border-[#E8E2D8] p-5 rounded-2xl space-y-2 text-center flex flex-col items-center">
          <div className="w-10 h-10 rounded-2xl bg-[#FCFBF8] border border-[#E8E2D8] text-[#6B62B8] flex items-center justify-center mb-1">
            <FontAwesomeIcon icon={faHouseUser} className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#17233A]">Local Community Uplift</h4>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Platform surpluses are reinvested into healthcare insurance, skill workshops, and pension safety nets for local artisan families.
          </p>
        </div>

      </div>
    </div>
  );
}
