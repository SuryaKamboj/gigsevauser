import React from 'react';
import RatingStars from './RatingStars';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faShieldHalved, faLocationDot, faCircleCheck, faArrowRight, faCertificate, faUsers, faClock } from '@fortawesome/free-solid-svg-icons';

/**
 * WorkerMatchCard Component for GigSavek
 * 
 * Urban Company Quality UI:
 * - Profile Image, Name, Profession, Trust Score, Rating, Response Time, Jobs Completed, Distance, Badges, Book Now Button
 */
export default function WorkerMatchCard({
  worker = {
    id: 'wrk-101',
    fullName: 'Suresh Verma',
    avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    trustScore: 94.5,
    tier: 'Master Artisan',
    cooperativeName: 'South Delhi Skilled Workers Cooperative',
    distanceKm: 1.2,
    completedJobs: 142,
    rating: 4.9,
    basePrice: 350,
    responseTime: 'Responds in 3 mins',
    skills: ['Electrical Repair']
  },
  onBookClick
}) {
  const {
    fullName,
    avatarUrl,
    trustScore,
    tier,
    cooperativeName,
    distanceKm,
    rating,
    basePrice,
    completedJobs,
    responseTime = 'Responds in 3 mins',
    skills = ['Electrician']
  } = worker;

  const initials = fullName
    ? fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'WK';

  return (
    <div className="w-full bg-white border border-stone-200/80 rounded-[20px] p-5 shadow-xs hover:border-[#F5B700] hover:-translate-y-1 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Row: Worker Photo + Info + Rating */}
        <div className="flex items-start gap-4">
          <div className="relative w-14 h-14 rounded-2xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full text-[#07152E] font-bold text-sm flex items-center justify-center bg-stone-100">
                {initials}
              </div>
            )}
            <div className="absolute bottom-0 right-0 bg-[#10B981] text-white p-0.5 rounded-tl-lg">
              <FontAwesomeIcon icon={faCircleCheck} className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-bold text-[#07152E] truncate">
                {fullName}
              </h3>
              
              <RatingStars rating={rating} starSizeClass="w-3 h-3" />
            </div>

            <p className="text-xs font-semibold text-stone-500 mt-0.5 truncate">
              {skills[0] || 'Artisan'} • <span className="font-medium text-stone-400">{cooperativeName}</span>
            </p>

            <div className="flex flex-wrap items-center gap-2.5 mt-1.5 text-xs text-stone-500">
              <span className="flex items-center gap-1 font-medium">
                <FontAwesomeIcon icon={faLocationDot} className="w-3 h-3 text-stone-400" aria-hidden="true" />
                {distanceKm} km away
              </span>
              <span>•</span>
              <span className="font-medium">{completedJobs} jobs completed</span>
            </div>
          </div>
        </div>

        {/* Visually Highlighted Trust Score Badge (#ECFDF5 bg, #10B981 text) */}
        <div className="mt-4 bg-[#ECFDF5] border border-[#10B981]/30 rounded-[14px] px-3.5 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faShieldHalved} className="w-4 h-4 text-[#10B981]" aria-hidden="true" />
            <span className="text-xs font-semibold text-[#07152E]">Trust Score:</span>
            <span className="text-sm font-extrabold text-[#10B981]">{trustScore}</span>
          </div>
          
          <span className="text-[11px] font-bold text-[#10B981] bg-white px-2 py-0.5 rounded-md border border-[#10B981]/20 flex items-center gap-1">
            <FontAwesomeIcon icon={faClock} className="w-3 h-3 text-[#10B981]" />
            {responseTime}
          </span>
        </div>

        {/* Badges Row */}
        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#10B981] border border-emerald-200 font-semibold flex items-center gap-1.5">
            <FontAwesomeIcon icon={faCircleCheck} className="w-3 h-3 text-[#10B981]" />
            Aadhaar Verified
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-[#07152E] border border-amber-200/80 font-semibold flex items-center gap-1.5">
            <FontAwesomeIcon icon={faCertificate} className="w-3 h-3 text-[#F5B700]" />
            Skill Certified
          </span>
        </div>
      </div>

      {/* Bottom Row: Starting Price + Book Button */}
      <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-medium text-stone-500 block leading-none">Starting from</span>
          <span className="text-base font-extrabold text-[#07152E]">
            ₹{basePrice} <span className="text-xs font-normal text-stone-500">/ visit</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => onBookClick && onBookClick(worker)}
          className="px-5 py-2.5 rounded-[14px] bg-[#F5B700] hover:bg-[#E0A700] active:scale-95 text-[#07152E] font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
          aria-label={`Book service with ${fullName}`}
        >
          <span>Book Now</span>
          <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

