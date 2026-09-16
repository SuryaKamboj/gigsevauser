import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faIdCard,
  faBuilding,
  faUserShield,
  faAward,
  faCertificate,
  faCircleCheck
} from '@fortawesome/free-solid-svg-icons';

export default function CommunityVerifiedBadges() {
  const badges = [
    {
      id: 'b1',
      title: 'Identity Verified',
      subtitle: 'Aadhaar Biometric Check',
      icon: faIdCard,
      color: '#A66666'
    },
    {
      id: 'b2',
      title: 'Guild Verified',
      subtitle: 'Artisan Guild Member',
      icon: faBuilding,
      color: '#4E8A57'
    },
    {
      id: 'b3',
      title: 'Background Checked',
      subtitle: 'Police Record Cleared',
      icon: faUserShield,
      color: '#6B62B8'
    },
    {
      id: 'b4',
      title: 'Skill Certified',
      subtitle: 'Grade 1 Master Trade',
      icon: faAward,
      color: '#B86A4B'
    },
    {
      id: 'b5',
      title: 'Govt Reg. Coop Member',
      subtitle: 'NCCT Union Registered',
      icon: faCertificate,
      color: '#17233A'
    }
  ];

  return (
    <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-5 sm:p-7 space-y-4 shadow-xs">
      <div className="flex items-center gap-2.5 border-b border-[#E8E2D8] pb-3">
        <div className="w-8 h-8 rounded-xl bg-[#A66666]/10 text-[#A66666] flex items-center justify-center border border-[#A66666]/20 shrink-0">
          <FontAwesomeIcon icon={faCircleCheck} className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold font-display text-[#17233A]">
            Community Verified Badges
          </h3>
          <p className="text-xs text-[#6B7280]">Official government & guild safety credentials</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="bg-[#F8F6F2] border border-[#E8E2D8] p-3.5 rounded-2xl flex items-start gap-3 hover:border-[#A66666]/50 transition-all"
          >
            <div
              style={{ color: badge.color }}
              className="w-8 h-8 rounded-xl bg-[#FCFBF8] border border-[#E8E2D8] flex items-center justify-center shrink-0"
            >
              <FontAwesomeIcon icon={badge.icon} className="w-3.5 h-3.5" />
            </div>

            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[#17233A] leading-tight truncate">{badge.title}</h4>
              <p className="text-[10px] text-[#6B7280] font-medium leading-tight mt-0.5">{badge.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
