import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved, faRotateLeft, faLock, faScaleBalanced, faTag } from '@fortawesome/free-solid-svg-icons';

export default function CooperativeGuarantee() {
  const guarantees = [
    {
      id: 'g1',
      title: 'Verified Cooperative Service Assurance',
      desc: 'Free revisit or labor support backed by regional artisan guild if issues reoccur.',
      icon: faRotateLeft
    },
    {
      id: 'g2',
      title: 'Escrow Protected Payments',
      desc: 'Your payment stays safely in cooperative escrow until you confirm 100% satisfaction.',
      icon: faLock
    },
    {
      id: 'g3',
      title: 'Dispute Resolution Support',
      desc: 'Dedicated regional guild officer available for instant resolution within 2 hours.',
      icon: faScaleBalanced
    },
    {
      id: 'g4',
      title: 'Transparent Rate Card Pricing',
      desc: 'Zero middleman markup. Upfront fixed prices directly benefiting the worker.',
      icon: faTag
    }
  ];

  return (
    <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-5 sm:p-7 space-y-4 shadow-xs">
      <div className="flex items-center gap-2.5 border-b border-[#E8E2D8] pb-3">
        <div className="w-8 h-8 rounded-xl bg-[#A66666]/10 text-[#A66666] flex items-center justify-center border border-[#A66666]/20 shrink-0">
          <FontAwesomeIcon icon={faShieldHalved} className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold font-display text-[#17233A]">
            The 4-Point Cooperative Guarantee
          </h3>
          <p className="text-xs text-[#6B7280]">Consumer protection policies enforced by local worker unions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        {guarantees.map((item) => (
          <div key={item.id} className="bg-[#F8F6F2] border border-[#E8E2D8] p-4 rounded-2xl space-y-2 hover:border-[#A66666]/50 transition-all">
            <div className="w-8 h-8 rounded-xl bg-[#FCFBF8] border border-[#E8E2D8] text-[#A66666] flex items-center justify-center">
              <FontAwesomeIcon icon={item.icon} className="w-3.5 h-3.5" />
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-[#17233A]">{item.title}</h4>
            <p className="text-[11px] text-[#6B7280] leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
