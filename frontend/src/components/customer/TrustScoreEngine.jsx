import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved, faCheckCircle, faChartPie } from '@fortawesome/free-solid-svg-icons';

export default function TrustScoreEngine({
  overallScore = 96.8,
  ratingsScore = 98.0,
  completionRate = 99.2,
  responseTimeScore = 96.0,
  complaintResolution = 99.5,
  verificationStatus = 100.0
}) {
  return (
    <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-5 sm:p-7 space-y-5 shadow-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-[#E8E2D8] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#A66666]/10 text-[#A66666] flex items-center justify-center border border-[#A66666]/20 shrink-0">
            <FontAwesomeIcon icon={faShieldHalved} className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold font-display text-[#17233A]">
              Cooperative Trust Engine™
            </h3>
            <p className="text-xs text-[#6B7280]">Algorithmic composite rating calculated from 5 verified indicators</p>
          </div>
        </div>

        {/* Visual Badge */}
        <div className="bg-[#17233A] text-white px-4 py-1.5 rounded-2xl flex items-center gap-2 shadow-2xs">
          <FontAwesomeIcon icon={faCheckCircle} className="text-[#A66666]" />
          <span className="text-xs font-bold">Composite Grade: A+</span>
        </div>
      </div>

      {/* Main Score Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left: Overall Ring Score (96.8 / 100) */}
        <div className="md:col-span-4 bg-[#F8F6F2] border border-[#E8E2D8] p-5 rounded-2xl text-center space-y-2 flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Overall Trust Score</span>
          
          <div className="relative w-28 h-28 rounded-full border-4 border-[#E8E2D8] bg-[#FCFBF8] flex items-center justify-center shadow-inner my-1">
            <div className="text-center">
              <span className="text-2xl sm:text-3xl font-black font-display text-[#17233A] leading-none block">
                {overallScore}
              </span>
              <span className="text-[10px] text-[#6B7280] font-bold block mt-0.5">/ 100</span>
            </div>
          </div>

          <span className="text-xs font-extrabold text-[#A66666] bg-[#FCFBF8] px-3 py-1 rounded-full border border-[#E8E2D8]">
            Verified Guild Artisan
          </span>
        </div>

        {/* Right: 5 Parameter Breakdown Bars */}
        <div className="md:col-span-8 space-y-3 text-xs font-semibold">
          {[
            { label: 'Customer Ratings', score: ratingsScore, color: '#A66666' },
            { label: 'Job Completion Rate', score: completionRate, color: '#4E8A57' },
            { label: 'Response Time Speed', score: responseTimeScore, color: '#6B62B8' },
            { label: 'Complaint Resolution', score: complaintResolution, color: '#B86A4B' },
            { label: 'Identity & Guild Verification', score: verificationStatus, color: '#17233A' }
          ].map((param) => (
            <div key={param.label} className="space-y-1">
              <div className="flex items-center justify-between text-[#17233A]">
                <span>{param.label}</span>
                <span style={{ color: param.color }} className="font-bold">{param.score}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#F8F6F2] border border-[#E8E2D8] overflow-hidden">
                <div
                  style={{ width: `${param.score}%`, backgroundColor: param.color }}
                  className="h-full rounded-full transition-all duration-500"
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
