import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default function HomeCooperativeImpact() {
  const impacts = [
    { label: '1,284 Verified Workers', desc: 'Member-owned artisan guild' },
    { label: '4,862 Families Supported', desc: 'Healthcare & pension safety nets' },
    { label: '52,000+ Jobs Completed', desc: 'Peer quality verified service' },
    { label: '₹3.8 Crore Direct Artisan Income', desc: '0% middleman commission fee' }
  ];

  return (
    <section className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E8E2D8] pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#A66666] uppercase tracking-wider bg-[#F8F6F2] px-3 py-1 rounded-full border border-[#E8E2D8]">
            Cooperative Advantage
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold font-display text-[#17233A] mt-2">
            Why Choose Cooperative Services?
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] font-normal mt-0.5">
            Directly supporting local workers while getting verified home service guarantees
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {impacts.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#F8F6F2] border border-[#E8E2D8] p-4 rounded-2xl flex items-start gap-3 hover:border-[#A66666]/40 transition-all"
          >
            <FontAwesomeIcon icon={faCheckCircle} className="text-[#A66666] w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold font-display text-[#17233A] leading-snug">
                {item.label}
              </h3>
              <p className="text-xs text-[#6B7280] mt-0.5 font-medium">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
