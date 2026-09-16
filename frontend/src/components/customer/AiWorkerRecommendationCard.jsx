import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faShieldHalved,
  faLocationDot,
  faClock,
  faCheckCircle,
  faArrowRight,
  faWandMagicSparkles,
  faBolt,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';

export default function AiWorkerRecommendationCard({
  matchData,
  onReset
}) {
  const navigate = useNavigate();

  if (!matchData) return null;

  const {
    detectedIssue,
    confidence = 94,
    severity = 'Medium',
    isEmergency = false,
    serviceName = 'Electrical Repair',
    serviceId = 'electrical',
    worker = {
      id: 'el-1',
      fullName: 'Rajesh Kumar',
      profession: 'Master Electrician',
      cooperative: 'Lajpat Nagar Artisan Guild',
      trustScore: 96.8,
      rating: 4.9,
      distanceKm: 1.2,
      basePrice: 420,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
    },
    eta = '14 mins',
    matchReason = 'High electrical specialization, closest verified worker, fastest response time.'
  } = matchData;

  // EMERGENCY MATCH CARD
  if (isEmergency || severity === 'High' || severity === 'Critical') {
    return (
      <div className="bg-[#A66666]/10 border-2 border-[#A66666] rounded-[20px] p-3.5 sm:p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-[#A66666] font-extrabold text-xs sm:text-sm">
            <FontAwesomeIcon icon={faTriangleExclamation} className="w-3.5 h-3.5 animate-bounce text-[#A66666]" />
            <span>Emergency Match Found</span>
          </div>
          <span className="text-[10px] font-extrabold bg-[#A66666] text-white px-2.5 py-0.5 rounded-full shadow-2xs">
            Priority Dispatch Mode
          </span>
        </div>

        <div className="bg-[#FCFBF8] border border-[#E8E2D8] p-3 rounded-xl space-y-2">
          <div className="flex items-start gap-2.5">
            <img src={worker.avatarUrl} alt={worker.fullName} className="w-10 h-10 rounded-xl object-cover border border-[#E8E2D8] shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-[9px] font-bold text-[#A66666] uppercase tracking-wider block">Nearest Artisan</span>
              <h3 className="text-sm font-bold font-display text-[#17233A] truncate">{worker.fullName}</h3>
              <p className="text-[11px] text-[#6B7280] truncate">{worker.cooperative}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-[11px] font-semibold pt-1 border-t border-[#E8E2D8]">
            <div className="bg-[#F8F6F2] p-1.5 rounded-lg text-center">
              <span className="text-[9px] text-[#6B7280] block">ETA</span>
              <span className="text-[11px] font-bold text-[#A66666]">{eta}</span>
            </div>
            <div className="bg-[#F8F6F2] p-1.5 rounded-lg text-center">
              <span className="text-[9px] text-[#6B7280] block">Distance</span>
              <span className="text-[11px] font-bold text-[#17233A]">{worker.distanceKm} km</span>
            </div>
            <div className="bg-[#F8F6F2] p-1.5 rounded-lg text-center">
              <span className="text-[9px] text-[#6B7280] block">Trust</span>
              <span className="text-[11px] font-bold text-[#17233A]">{worker.trustScore}★</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/emergency')}
          className="w-full py-2.5 rounded-xl bg-[#A66666] hover:bg-[#8F5555] text-white font-bold font-display text-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <FontAwesomeIcon icon={faBolt} />
          <span>Dispatch Now (Priority Emergency)</span>
        </button>
      </div>
    );
  }

  // STANDARD AI SMART MATCHING CARD
  return (
    <div className="bg-[#F8F6F2] border border-[#E8E2D8] rounded-[20px] p-3.5 sm:p-4 space-y-3 shadow-xs">
      
      {/* Header Bar: Match Confidence */}
      <div className="flex items-center justify-between flex-wrap gap-1.5 border-b border-[#E8E2D8] pb-2">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#17233A]">
          <FontAwesomeIcon icon={faWandMagicSparkles} className="text-[#A66666] w-3.5 h-3.5" />
          <span>AI Match Result</span>
        </div>

        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#A66666] text-white text-[10px] sm:text-[11px] font-bold shadow-2xs">
          <FontAwesomeIcon icon={faCheckCircle} className="w-2.5 h-2.5" />
          <span>{confidence}% Match</span>
        </div>
      </div>

      {/* Detected Issue Pill */}
      <div className="bg-[#FCFBF8] border border-[#E8E2D8] p-2.5 rounded-xl space-y-0.5">
        <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider block">Diagnosed Issue</span>
        <h3 className="text-xs sm:text-sm font-bold font-display text-[#17233A] leading-tight">{detectedIssue}</h3>
        <span className="text-[10px] text-[#A66666] font-semibold block">Category: {serviceName}</span>
      </div>

      {/* Best Worker Match Profile Box */}
      <div className="bg-[#FCFBF8] border border-[#E8E2D8] p-3 rounded-xl space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-[#A66666] uppercase tracking-wider block">Best Cooperative Match</span>
          <span className="text-xs font-extrabold font-display text-[#17233A]">₹{worker.basePrice}</span>
        </div>
        
        <div className="flex items-start gap-2.5">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shrink-0 border border-[#E8E2D8]">
            <img src={worker.avatarUrl} alt={worker.fullName} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 right-0 bg-[#A66666] text-white p-0.5 rounded-tl-md text-[8px]">
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs sm:text-sm font-bold font-display text-[#17233A] truncate leading-tight">{worker.fullName}</h4>
            <p className="text-[10px] text-[#6B7280] truncate mt-0.5">{worker.profession} • {worker.cooperative}</p>

            <div className="flex items-center gap-1.5 mt-1 text-[10px] font-semibold">
              <span className="inline-flex items-center gap-1 font-bold text-[#A66666]">
                <FontAwesomeIcon icon={faStar} className="w-2.5 h-2.5" />
                <span>{worker.rating}</span>
              </span>
              <span className="text-[#6B7280]">•</span>
              <span className="text-[#17233A]">Trust <strong className="font-extrabold">{worker.trustScore}%</strong></span>
            </div>
          </div>
        </div>

        {/* 4 Factor Badges (ETA, Distance, Trust, Verification) */}
        <div className="grid grid-cols-4 gap-1 pt-1.5 text-center text-[10px] font-semibold border-t border-[#E8E2D8]">
          <div className="bg-[#F8F6F2] p-1 rounded-md border border-[#E8E2D8]">
            <span className="text-[8px] text-[#6B7280] block">ETA</span>
            <span className="text-[10px] font-bold text-[#A66666]">{eta}</span>
          </div>
          <div className="bg-[#F8F6F2] p-1 rounded-md border border-[#E8E2D8]">
            <span className="text-[8px] text-[#6B7280] block">Dist</span>
            <span className="text-[10px] font-bold text-[#17233A]">{worker.distanceKm}km</span>
          </div>
          <div className="bg-[#F8F6F2] p-1 rounded-md border border-[#E8E2D8]">
            <span className="text-[8px] text-[#6B7280] block">Trust</span>
            <span className="text-[10px] font-bold text-[#17233A]">{worker.trustScore}%</span>
          </div>
          <div className="bg-[#F8F6F2] p-1 rounded-md border border-[#E8E2D8]">
            <span className="text-[8px] text-[#6B7280] block">Status</span>
            <span className="text-[10px] font-bold text-[#4E8A57]">Verified</span>
          </div>
        </div>

        {/* Reason Recommended Callout */}
        <div className="bg-[#F8F6F2] p-2 rounded-lg border border-[#E8E2D8] text-[10px] text-[#6B7280] leading-snug">
          <span className="font-bold text-[#17233A]">AI Match: </span>
          <span className="italic">{matchReason}</span>
        </div>
      </div>

      {/* Action CTAs */}
      <div className="pt-0.5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate(`/worker/${worker.id}`)}
          className="flex-1 py-2 rounded-xl bg-[#FCFBF8] text-[#17233A] font-bold text-[11px] hover:bg-[#E8E2D8]/40 border border-[#E8E2D8] cursor-pointer transition-all flex items-center justify-center gap-1"
        >
          <span>Profile</span>
          <FontAwesomeIcon icon={faArrowRight} className="w-2.5 h-2.5 text-[#A66666]" />
        </button>

        <button
          type="button"
          onClick={() => navigate(`/booking?service=${serviceId}&workerId=${worker.id}`)}
          className="flex-1 py-2 rounded-xl bg-[#A66666] hover:bg-[#8F5555] text-white font-bold font-display text-[11px] cursor-pointer transition-all flex items-center justify-center gap-1 shadow-2xs active:scale-95"
        >
          <span>Book Now</span>
          <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3" />
        </button>
      </div>

    </div>
  );
}
