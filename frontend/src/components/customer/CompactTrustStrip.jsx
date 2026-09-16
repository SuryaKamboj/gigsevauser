import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved, faStar, faClock, faRotateLeft, faUsers } from '@fortawesome/free-solid-svg-icons';

export default function CompactTrustStrip({
  trustScore = '98.4%',
  avgResponse = '17 Min',
  warranty = 'Verified Cooperative Service Assurance',
  activeWorkers = '148 Active Guild Workers'
}) {
  return (
    <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-2xl py-3 px-4 shadow-2xs">
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-semibold text-[#17233A]">
        
        <div className="flex items-center gap-1.5 shrink-0">
          <FontAwesomeIcon icon={faShieldHalved} className="text-[#A66666] w-3.5 h-3.5" />
          <span className="font-bold">Verified Cooperative Service</span>
        </div>

        <span className="hidden sm:inline text-[#E8E2D8]">•</span>

        <div className="flex items-center gap-1.5 shrink-0">
          <FontAwesomeIcon icon={faStar} className="text-[#A66666] w-3.5 h-3.5" />
          <span><strong className="font-extrabold">{trustScore}</strong> Trust Score</span>
        </div>

        <span className="hidden sm:inline text-[#E8E2D8]">•</span>

        <div className="flex items-center gap-1.5 shrink-0">
          <FontAwesomeIcon icon={faClock} className="text-[#A66666] w-3.5 h-3.5" />
          <span><strong className="font-extrabold">{avgResponse}</strong> Avg Response</span>
        </div>

        <span className="hidden md:inline text-[#E8E2D8]">•</span>

        <div className="flex items-center gap-1.5 shrink-0">
          <FontAwesomeIcon icon={faRotateLeft} className="text-[#4E8A57] w-3.5 h-3.5" />
          <span className="text-[#4E8A57] font-bold">{warranty}</span>
        </div>

        <span className="hidden lg:inline text-[#E8E2D8]">•</span>

        <div className="flex items-center gap-1.5 shrink-0">
          <FontAwesomeIcon icon={faUsers} className="text-[#6B7280] w-3.5 h-3.5" />
          <span className="text-[#6B7280] font-medium">{activeWorkers}</span>
        </div>

      </div>
    </div>
  );
}
