import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faArrowRight,
  faChevronLeft,
  faChevronRight,
  faClock,
  faShieldHalved
} from '@fortawesome/free-solid-svg-icons';

const HERO_WORKERS_DATA = [
  {
    id: 'hero-wrk-1',
    fullName: 'Rajesh Kumar',
    profession: 'Master Electrician',
    trustScore: 95.8,
    completedJobs: 142,
    distanceStr: '1.2 km away',
    arrivalStr: '14 min arrival',
    rating: '4.9',
    cooperative: 'Lajpat Nagar Artisans Guild',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'hero-wrk-2',
    fullName: 'Amit Sharma',
    profession: 'Senior Plumber',
    trustScore: 93.4,
    completedJobs: 98,
    distanceStr: '2.1 km away',
    arrivalStr: '18 min arrival',
    rating: '4.8',
    cooperative: 'South Delhi Crafts Guild',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'hero-wrk-3',
    fullName: 'Suresh Verma',
    profession: 'Master Carpenter',
    trustScore: 96.1,
    completedJobs: 115,
    distanceStr: '1.5 km away',
    arrivalStr: '15 min arrival',
    rating: '4.9',
    cooperative: 'Delhi Woodworking Guild',
    avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'hero-wrk-4',
    fullName: 'Ravi Singh',
    profession: 'Deep Cleaning Specialist',
    trustScore: 92.5,
    completedJobs: 84,
    distanceStr: '3.0 km away',
    arrivalStr: '20 min arrival',
    rating: '4.7',
    cooperative: 'Metropolitan Hygiene Guild',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'hero-wrk-5',
    fullName: 'Sunita Devi',
    profession: 'Senior Elder Care Aide',
    trustScore: 97.2,
    completedJobs: 160,
    distanceStr: '0.8 km away',
    arrivalStr: '10 min arrival',
    rating: '4.9',
    cooperative: 'Healthcare Caregiver Guild',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  }
];

export default function HeroWorkerCarousel({ onBookClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_WORKERS_DATA.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + HERO_WORKERS_DATA.length) % HERO_WORKERS_DATA.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % HERO_WORKERS_DATA.length);
  };

  return (
    <div
      className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[20px] p-3.5 sm:p-4 text-[#17233A] shadow-2xs hover:shadow-md transition-all duration-300 relative overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header Row with Verification Pill */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#E8E2D8] text-xs">
        <span className="inline-flex items-center gap-1.5 font-bold text-[#A66666] bg-[#F8F6F2] px-2 py-0.5 rounded-full border border-[#E8E2D8] text-[10px]">
          <FontAwesomeIcon icon={faShieldHalved} className="w-2.5 h-2.5 text-[#A66666]" />
          Verified Cooperative Worker
        </span>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrev}
            className="w-5 h-5 rounded-full bg-[#F8F6F2] border border-[#E8E2D8] hover:bg-[#A66666] hover:text-white text-[#17233A] flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Previous worker"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="w-2 h-2" />
          </button>

          <div className="flex items-center gap-1 mx-0.5">
            {HERO_WORKERS_DATA.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-3.5 bg-[#A66666]' : 'w-1.5 bg-[#E8E2D8]'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="w-5 h-5 rounded-full bg-[#F8F6F2] border border-[#E8E2D8] hover:bg-[#A66666] hover:text-white text-[#17233A] flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Next worker"
          >
            <FontAwesomeIcon icon={faChevronRight} className="w-2 h-2" />
          </button>
        </div>
      </div>

      {/* Sliding Worker Track */}
      <div className="relative overflow-hidden pt-2.5">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {HERO_WORKERS_DATA.map((worker) => (
            <div key={worker.id} className="w-full shrink-0 space-y-2.5">
              
              {/* Photo + Name + Rating */}
              <div className="flex items-center gap-3">
                <img
                  src={worker.avatarUrl}
                  alt={worker.fullName}
                  className="w-10 h-10 rounded-xl object-cover border border-[#E8E2D8] shrink-0 shadow-2xs"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-sm font-bold font-display text-[#17233A] truncate">
                      {worker.fullName}
                    </h4>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#17233A] bg-[#F8F6F2] px-1.5 py-0.5 rounded-full border border-[#E8E2D8]">
                      <FontAwesomeIcon icon={faStar} className="w-2.5 h-2.5 text-[#A66666]" />
                      <span>{worker.rating}</span>
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-[#6B7280] truncate">
                    {worker.profession}
                  </p>
                </div>
              </div>

              {/* Trust Score & Metrics Bar */}
              <div className="flex items-center justify-between text-[11px] text-[#6B7280] font-medium py-1 px-2.5 bg-[#F8F6F2] rounded-lg border border-[#E8E2D8]">
                <span>Trust: <strong className="text-[#17233A] font-bold">{worker.trustScore}%</strong></span>
                <span>•</span>
                <span>{worker.completedJobs} Jobs</span>
                <span>•</span>
                <span className="text-[#17233A] font-semibold flex items-center gap-1">
                  <FontAwesomeIcon icon={faClock} className="w-2.5 h-2.5 text-[#A66666]" />
                  {worker.arrivalStr}
                </span>
              </div>

              {/* Book Service Button */}
              <button
                type="button"
                onClick={() => onBookClick && onBookClick(worker.fullName)}
                className="w-full py-2 rounded-xl bg-[#A66666] hover:bg-[#8F5555] text-white font-bold font-display text-xs active:scale-95 transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book Service</span>
                <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
              </button>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
