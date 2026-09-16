import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faShieldHalved,
  faArrowRight,
  faCircleCheck,
  faChevronLeft,
  faChevronRight,
  faUser
} from '@fortawesome/free-solid-svg-icons';

const WORKERS_CAROUSEL_DATA = [
  {
    id: 'wrk-carousel-1',
    fullName: 'Rajesh Kumar',
    profession: 'Master Electrician',
    trustScore: 95.8,
    distanceKm: 1.2,
    rating: 4.9,
    completedJobs: 142,
    cooperative: 'Lajpat Nagar Artisans Guild',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'wrk-carousel-2',
    fullName: 'Amit Sharma',
    profession: 'Senior Plumber',
    trustScore: 93.4,
    distanceKm: 2.1,
    rating: 4.8,
    completedJobs: 98,
    cooperative: 'South Delhi Crafts Guild',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'wrk-carousel-3',
    fullName: 'Suresh Verma',
    profession: 'Master Carpenter',
    trustScore: 96.1,
    distanceKm: 1.5,
    rating: 4.9,
    completedJobs: 115,
    cooperative: 'Delhi Woodworking Guild',
    avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'wrk-carousel-4',
    fullName: 'Sunita Devi',
    profession: 'Elder Care Specialist',
    trustScore: 97.2,
    distanceKm: 0.8,
    rating: 4.9,
    completedJobs: 160,
    cooperative: 'Healthcare Caregiver Guild',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'wrk-carousel-5',
    fullName: 'Ravi Singh',
    profession: 'Deep Clean Specialist',
    trustScore: 92.5,
    distanceKm: 3.0,
    rating: 4.7,
    completedJobs: 84,
    cooperative: 'Metropolitan Hygiene Guild',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'wrk-carousel-6',
    fullName: 'Deepak Joshi',
    profession: 'Wiring Specialist',
    trustScore: 97.0,
    distanceKm: 1.7,
    rating: 4.9,
    completedJobs: 204,
    cooperative: 'East Delhi Artisans Guild',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'wrk-carousel-7',
    fullName: 'Sunil Sharma',
    profession: 'Appliance Repair Lead',
    trustScore: 94.2,
    distanceKm: 2.4,
    rating: 4.8,
    completedJobs: 118,
    cooperative: 'South Delhi Crafts Guild',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'wrk-carousel-8',
    fullName: 'Vikram Verma',
    profession: 'Industrial Electrician',
    trustScore: 96.5,
    distanceKm: 0.9,
    rating: 4.9,
    completedJobs: 165,
    cooperative: 'Delhi Electricians Guild',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  }
];

export default function WorkerCarousel({ onBookClick, onProfileClick }) {
  const [currentPage, setCurrentPage] = useState(0);
  const cardsPerPage = 4;
  const totalPages = Math.ceil(WORKERS_CAROUSEL_DATA.length / cardsPerPage);

  const visibleWorkers = WORKERS_CAROUSEL_DATA.slice(
    currentPage * cardsPerPage,
    (currentPage + 1) * cardsPerPage
  );

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  return (
    <section className="w-full space-y-6 my-12 sm:my-16">
      {/* Header with Title and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#17233A] tracking-tight">
            Top Rated Workers Near You
          </h2>
          <p className="text-xs sm:text-sm font-normal text-[#6B7280] mt-1">
            Verified local cooperative artisans matched by trust score, skill & proximity
          </p>
        </div>

        {/* Page Navigation Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 mr-2">
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentPage(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentPage === idx ? 'w-6 bg-[#A66666]' : 'w-2 bg-[#E8E2D8]'
                }`}
                aria-label={`Go to page ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handlePrev}
            className="w-9 h-9 rounded-full bg-[#FCFBF8] border border-[#E8E2D8] text-[#17233A] flex items-center justify-center hover:bg-[#F8F6F2] active:scale-95 transition-all cursor-pointer shadow-2xs"
            aria-label="Previous page"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="w-3.5 h-3.5 text-[#17233A]" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="w-9 h-9 rounded-full bg-[#A66666] text-white flex items-center justify-center hover:bg-[#8F5555] active:scale-95 transition-all cursor-pointer shadow-2xs"
            aria-label="Next page"
          >
            <FontAwesomeIcon icon={faChevronRight} className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Cards Grid Layout (Desktop: 4 columns, Tablet: 2 columns, Mobile: 1 column) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {visibleWorkers.map((worker) => (
          <div
            key={worker.id}
            className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-5 sm:p-6 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300 ease-out flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-4">
              
              {/* TOP HEADER: 80px x 80px PHOTO NEXT TO NAME, PROFESSION, RATING BADGE */}
              <div className="flex items-start gap-3.5">
                <div className="relative w-[80px] h-[80px] rounded-2xl overflow-hidden shrink-0 border border-[#E8E2D8]">
                  <img
                    src={worker.avatarUrl}
                    alt={worker.fullName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 bg-[#A66666] text-white p-1 rounded-tl-md">
                    <FontAwesomeIcon icon={faCircleCheck} className="w-3 h-3" />
                  </div>
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                  <h3 className="text-base font-bold font-display text-[#17233A] leading-snug break-words">
                    {worker.fullName}
                  </h3>
                  <p className="text-xs text-[#6B7280] font-normal mt-0.5 leading-tight">
                    {worker.profession}
                  </p>

                  <div className="mt-2">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#17233A] bg-[#F8F6F2] px-2.5 py-0.5 rounded-full border border-[#E8E2D8]">
                      <FontAwesomeIcon icon={faStar} className="w-3 h-3 text-[#A66666]" />
                      <span>{worker.rating.toFixed(1)}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* BELOW: TRUST SCORE, JOBS COMPLETED, DISTANCE IN A SINGLE HORIZONTAL ROW */}
              <div className="text-xs font-normal text-[#6B7280] bg-[#F8F6F2] rounded-xl px-3 py-2 border border-[#E8E2D8] flex items-center justify-between gap-1">
                <span>Trust <strong className="text-[#17233A] font-bold">{worker.trustScore}%</strong></span>
                <span>•</span>
                <span>{worker.completedJobs} Jobs</span>
                <span>•</span>
                <span>{worker.distanceKm} km</span>
              </div>

              {/* BELOW: VERIFIED COOPERATIVE BADGE */}
              <div className="flex items-center justify-center text-[11px] font-bold text-[#A66666] bg-[#F8F6F2] px-3 py-1.5 rounded-full border border-[#E8E2D8]">
                <span className="flex items-center gap-1.5 text-center truncate">
                  <FontAwesomeIcon icon={faShieldHalved} className="w-3 h-3 shrink-0 text-[#A66666]" />
                  <span className="truncate">{worker.cooperative}</span>
                </span>
              </div>

            </div>

            {/* BELOW: PRIMARY CTA (BOOK SERVICE) & SECONDARY CTA (VIEW PROFILE) */}
            <div className="pt-2 border-t border-[#E8E2D8] flex items-center gap-2">
              <button
                type="button"
                onClick={() => onProfileClick ? onProfileClick(worker) : (onBookClick && onBookClick(worker.fullName))}
                className="w-1/2 py-2.5 rounded-[14px] bg-[#F8F6F2] border border-[#E8E2D8] text-[#17233A] font-bold text-xs hover:bg-[#E8E2D8]/50 active:scale-95 transition-all text-center cursor-pointer flex items-center justify-center gap-1"
              >
                <FontAwesomeIcon icon={faUser} className="w-3 h-3 text-[#6B7280]" />
                <span>View Profile</span>
              </button>

              <button
                type="button"
                onClick={() => onBookClick && onBookClick(worker.fullName)}
                className="w-1/2 py-2.5 rounded-[14px] bg-[#A66666] hover:bg-[#8F5555] active:scale-95 text-white font-bold font-display text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>Book Service</span>
                <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

