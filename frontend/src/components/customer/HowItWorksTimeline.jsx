import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGrip,
  faWandMagicSparkles,
  faClock,
  faShieldHalved,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

const STEPS_DATA = [
  {
    stepNum: 'Step 1',
    title: 'Select Service',
    desc: 'Browse trade categories or use voice search for quick booking.',
    icon: faGrip
  },
  {
    stepNum: 'Step 2',
    title: 'AI Finds Worker',
    desc: 'Ranks top nearby verified workers by proximity & skill match.',
    icon: faWandMagicSparkles
  },
  {
    stepNum: 'Step 3',
    title: 'Book Instantly',
    desc: 'Receive instant confirmation and live worker arrival tracking.',
    icon: faClock
  },
  {
    stepNum: 'Step 4',
    title: 'Secure Payment',
    desc: 'Transparent digital payout directly to cooperative accounts.',
    icon: faShieldHalved
  }
];

export default function HowItWorksTimeline() {
  return (
    <section id="how-it-works" className="space-y-6 my-12 sm:my-16">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#17233A] tracking-tight">
          How It Works
        </h2>
        <p className="text-xs sm:text-sm font-normal text-[#6B7280] mt-1">
          Simple 4-step booking workflow
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STEPS_DATA.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-6 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xs group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#A66666] bg-[#F8F6F2] px-3 py-1 rounded-full border border-[#E8E2D8]">
                {item.stepNum}
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#F8F6F2] text-[#A66666] flex items-center justify-center group-hover:bg-[#A66666] group-hover:text-white transition-colors border border-[#E8E2D8]">
                <FontAwesomeIcon icon={item.icon} className="w-4 h-4 transition-colors" />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <h3 className="text-lg font-bold font-display text-[#17233A]">
                {item.title}
              </h3>
              <p className="text-xs text-[#6B7280] font-normal leading-relaxed">
                {item.desc}
              </p>
            </div>

            <div className="pt-2 flex items-center text-xs font-semibold text-[#17233A] group-hover:text-[#A66666] transition-colors">
              <span className="mr-1">Next Step</span>
              <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

