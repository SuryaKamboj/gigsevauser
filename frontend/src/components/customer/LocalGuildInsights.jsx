import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faShieldHalved, faClock, faUsers, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

export default function LocalGuildInsights({
  guildName = 'Lajpat Nagar Artisan Guild',
  trustScore = 98.4,
  activeWorkers = 148,
  avgResponse = '17 mins',
  successRate = 99.1
}) {
  return (
    <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-5 sm:p-7 space-y-4 shadow-xs">
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#E8E2D8] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#A66666]/10 text-[#A66666] flex items-center justify-center border border-[#A66666]/20 shrink-0">
            <FontAwesomeIcon icon={faBuilding} className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold font-display text-[#17233A]">
              Local Guild Insights
            </h3>
            <p className="text-xs text-[#6B7280]">Official regional cooperative chapter stats</p>
          </div>
        </div>

        <span className="text-xs font-extrabold text-[#A66666] bg-[#F8F6F2] px-3.5 py-1 rounded-full border border-[#E8E2D8] flex items-center gap-1.5">
          <FontAwesomeIcon icon={faShieldHalved} />
          {guildName}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Trust Score */}
        <div className="bg-[#F8F6F2] border border-[#E8E2D8] p-3.5 rounded-2xl text-center">
          <span className="text-[11px] text-[#6B7280] font-medium block">Guild Trust Score</span>
          <span className="text-lg sm:text-xl font-extrabold font-display text-[#A66666] block mt-1">
            {trustScore}%
          </span>
        </div>

        {/* Active Workers */}
        <div className="bg-[#F8F6F2] border border-[#E8E2D8] p-3.5 rounded-2xl text-center">
          <span className="text-[11px] text-[#6B7280] font-medium block">Active Workers</span>
          <span className="text-lg sm:text-xl font-extrabold font-display text-[#17233A] block mt-1 flex items-center justify-center gap-1">
            <FontAwesomeIcon icon={faUsers} className="w-3.5 h-3.5 text-[#A66666]" />
            {activeWorkers}
          </span>
        </div>

        {/* Avg Response */}
        <div className="bg-[#F8F6F2] border border-[#E8E2D8] p-3.5 rounded-2xl text-center">
          <span className="text-[11px] text-[#6B7280] font-medium block">Avg Response</span>
          <span className="text-lg sm:text-xl font-extrabold font-display text-[#17233A] block mt-1 flex items-center justify-center gap-1">
            <FontAwesomeIcon icon={faClock} className="w-3.5 h-3.5 text-[#A66666]" />
            {avgResponse}
          </span>
        </div>

        {/* Success Rate */}
        <div className="bg-[#F8F6F2] border border-[#E8E2D8] p-3.5 rounded-2xl text-center">
          <span className="text-[11px] text-[#6B7280] font-medium block">Success Rate</span>
          <span className="text-lg sm:text-xl font-extrabold font-display text-[#4E8A57] block mt-1 flex items-center justify-center gap-1">
            <FontAwesomeIcon icon={faCircleCheck} className="w-3.5 h-3.5 text-[#4E8A57]" />
            {successRate}%
          </span>
        </div>

      </div>
    </div>
  );
}
