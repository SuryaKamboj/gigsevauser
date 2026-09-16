import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWandMagicSparkles,
  faSliders,
  faScrewdriverWrench,
  faShieldHalved,
  faTriangleExclamation,
  faHeartPulse,
  faChevronLeft,
  faChevronRight,
  faShield
} from '@fortawesome/free-solid-svg-icons';

const INNOVATIONS_DATA = [
  {
    id: 'inno-1',
    badgeEmoji: '🛡️',
    faIcon: faShieldHalved,
    title: 'Cooperative Trust Engine',
    description: 'Evaluated using Ratings, Completed Jobs, Response Speed, Guild & Background Checks.',
    highlights: ['Transparent trust score', 'Guild verified artisans'],
    cardBg: '#F8E7E7', // Soft Rose
    cardBorder: '#E8CECE',
    iconBg: '#FFFFFF'
  },
  {
    id: 'inno-2',
    badgeEmoji: '🚨',
    faIcon: faTriangleExclamation,
    title: 'Emergency Priority Dispatch',
    description: 'Critical situations (sparks, leaks, hazards) receive priority express matching.',
    highlights: ['Nearest worker first', 'Priority sub-15 min ETA'],
    cardBg: '#ECE9FA', // Soft Lavender
    cardBorder: '#D5CFF2',
    iconBg: '#FFFFFF'
  },
  {
    id: 'inno-3',
    badgeEmoji: '🏥',
    faIcon: faHeartPulse,
    title: 'Cooperative Welfare & Protection',
    description: 'Workers receive access to cooperative welfare, safety nets and protection systems.',
    highlights: ['Long-term sustainability', '0% middleman fee'],
    cardBg: '#E8F3EC', // Soft Sage Green
    cardBorder: '#C9E2D2',
    iconBg: '#FFFFFF'
  },
  {
    id: 'inno-4',
    badgeEmoji: '🏘️',
    faIcon: faScrewdriverWrench,
    title: 'Community Resource Pool',
    description: 'Request multiple verified cooperative artisans for projects, maintenance and emergencies.',
    highlights: ['Multi-trade dispatch', 'Cooperative pool pricing'],
    cardBg: '#F6EBDD', // Soft Sand
    cardBorder: '#E5D5C2',
    iconBg: '#FFFFFF',
    path: '/community-pool'
  },
  {
    id: 'inno-5',
    badgeEmoji: '☂️',
    faIcon: faShield,
    title: 'Insurance Protection',
    description: 'Comprehensive job protection and safety guarantees backed by cooperative fund.',
    highlights: ['100% Damage protection', 'Zero deductible'],
    cardBg: '#E7F1FA', // Soft Sky Blue
    cardBorder: '#CADDF0',
    iconBg: '#FFFFFF'
  },
  {
    id: 'inno-6',
    badgeEmoji: '📸',
    faIcon: faWandMagicSparkles,
    title: 'AI Problem Diagnosis',
    description: 'Upload a photo and let AI identify the issue instantly.',
    highlights: ['Electrical faults', 'Water leakage', 'Appliance damage'],
    cardBg: '#F8EFEA', // Soft Warm Peach
    cardBorder: '#E6D7CB',
    iconBg: '#FFFFFF'
  },
  {
    id: 'inno-7',
    badgeEmoji: '⚡',
    faIcon: faSliders,
    title: 'AI Smart Matching',
    description: 'AI recommends the best worker based on Trust Score, Distance, ETA & Ratings.',
    highlights: ['No manual searching', 'Composite weighted scoring'],
    cardBg: '#E6F4F1', // Soft Mint
    cardBorder: '#C7E6DF',
    iconBg: '#FFFFFF'
  }
];

export default function InnovationCarousel() {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Optional Auto-Scroll Every 5 Seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const isEnd = scrollLeft + clientWidth >= scrollWidth - 10;
        if (isEnd) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: clientWidth * 0.8, behavior: 'smooth' });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section
      className="space-y-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#F8F6F2] border border-[#E8E2D8] text-[10px] sm:text-[11px] font-bold text-[#A66666] uppercase tracking-wider mb-1">
            <span>Cooperative Innovation Engine</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold font-display text-[#17233A] tracking-tight">
            Why KAIROVA Is Different
          </h2>
          <p className="text-xs sm:text-sm text-[#4B5563] font-normal mt-0.5 sm:mt-1">
            Built for trust, cooperative ownership, AI-powered service discovery and community impact.
          </p>
        </div>

        {/* Desktop Navigation Arrows Only */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="w-9 h-9 rounded-full bg-white border border-[#E8E2D8] text-[#17233A] hover:bg-[#17233A] hover:text-white hover:border-[#17233A] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
            aria-label="Previous innovation feature"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="w-9 h-9 rounded-full bg-white border border-[#E8E2D8] text-[#17233A] hover:bg-[#17233A] hover:text-white hover:border-[#17233A] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
            aria-label="Next innovation feature"
          >
            <FontAwesomeIcon icon={faChevronRight} className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track - Clean carousel with hidden scrollbar */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 px-0.5"
      >
        {INNOVATIONS_DATA.map((item) => {
          const CardContent = (
            <div
              style={{
                backgroundColor: item.cardBg,
                borderColor: item.cardBorder,
              }}
              className="w-full h-full border rounded-[20px] p-4 sm:p-5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-250 ease-in-out hover:-translate-y-1 group"
            >
              {/* Top Content: Icon, Title & Description */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: item.iconBg, border: `1px solid ${item.cardBorder}` }}
                  >
                    <span className="text-base">{item.badgeEmoji}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold font-display text-[#17233A] truncate leading-tight">
                    {item.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-[13px] text-[#374151] leading-relaxed line-clamp-2 font-medium">
                  {item.description}
                </p>
              </div>

              {/* Bottom Highlights Row */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-black/5">
                {item.highlights.map((hl, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderColor: item.cardBorder,
                    }}
                    className="text-[10px] sm:text-[11px] font-semibold text-[#17233A] px-2.5 py-0.5 rounded-full border shadow-2xs"
                  >
                    ✓ {hl}
                  </span>
                ))}
              </div>
            </div>
          );

          if (item.path) {
            return (
              <Link
                key={item.id}
                to={item.path}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 snap-start h-[170px] sm:h-[180px] block"
              >
                {CardContent}
              </Link>
            );
          }

          return (
            <div
              key={item.id}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 snap-start h-[170px] sm:h-[180px]"
            >
              {CardContent}
            </div>
          );
        })}
      </div>
    </section>
  );
}
