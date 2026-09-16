import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faBolt,
  faFaucet,
  faHammer,
  faBroom,
  faScrewdriverWrench,
  faHeartPulse,
  faPaintRoller,
  faGrip,
  faUsers,
  faBuilding,
  faShieldHalved,
  faStar,
  faChevronLeft,
  faChevronRight,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import CustomerHeader from '../../components/customer/CustomerHeader';
import VoiceSearchBar from '../../components/customer/VoiceSearchBar';
import WorkerCarousel from '../../components/customer/WorkerCarousel';
import HeroWorkerCarousel from '../../components/customer/HeroWorkerCarousel';
import HowItWorksTimeline from '../../components/customer/HowItWorksTimeline';
import BottomNavigation from '../../components/customer/BottomNavigation';
import HomeCooperativeImpact from '../../components/customer/HomeCooperativeImpact';
import AiDiagnoseCard from '../../components/customer/AiDiagnoseCard';
import InnovationCarousel from '../../components/customer/InnovationCarousel';
import { useAuth } from '../../context/AuthContext';

const REVIEW_CATEGORY_COLORS = {
  'Electrical Repair': { bg: '#FDF2F2', border: '#F8D7D7', star: '#A66666', pillBg: '#F9C6C6', text: '#17233A' },
  'Plumbing Service': { bg: '#F3F2FC', border: '#DEDCF7', star: '#6B62B8', pillBg: '#E3E0F7', text: '#17233A' },
  'Carpentry Work': { bg: '#F0F7F1', border: '#D7EBD9', star: '#4E8A57', pillBg: '#CDE5CF', text: '#17233A' },
  'Cleaning & Hygiene': { bg: '#FFF4EE', border: '#FCE0D2', star: '#B86A4B', pillBg: '#F9D1BD', text: '#17233A' },
  'Wall Painting': { bg: '#F8F5EF', border: '#E7DFCF', star: '#8C7761', pillBg: '#E0D4BE', text: '#17233A' },
  'Appliance Repair': { bg: '#FDF2F2', border: '#F8D7D7', star: '#A66666', pillBg: '#F9C6C6', text: '#17233A' },
  'Elder Care Service': { bg: '#F3F2FC', border: '#DEDCF7', star: '#6B62B8', pillBg: '#E3E0F7', text: '#17233A' }
};

const getReviewColor = (serviceCategory) => {
  return (
    REVIEW_CATEGORY_COLORS[serviceCategory] || {
      bg: '#F8F6F2',
      border: '#E8E2D8',
      star: '#A66666',
      pillBg: '#E8E2D8',
      text: '#17233A'
    }
  );
};

const REVIEWS_DATA = [
  {
    id: 'rev-1',
    customerName: 'Ananya Sen',
    city: 'New Delhi',
    reviewText: 'The cooperative electrician arrived within 15 minutes. Extremely transparent pricing, polite behavior, and flawless repair work.',
    rating: 5.0,
    serviceCategory: 'Electrical Repair'
  },
  {
    id: 'rev-2',
    customerName: 'Rajesh Malhotra',
    city: 'Gurugram',
    reviewText: 'Booking plumbing repair through GigSave supports local artisans directly. Punctual, professional, and zero unexpected charges.',
    rating: 5.0,
    serviceCategory: 'Plumbing Service'
  },
  {
    id: 'rev-3',
    customerName: 'Priya Sharma',
    city: 'Noida',
    reviewText: 'Appliance repair was completed with total precision. Love knowing the worker gets a fair wage through their cooperative guild.',
    rating: 5.0,
    serviceCategory: 'Appliance Repair'
  },
  {
    id: 'rev-4',
    customerName: 'Vikram Mehta',
    city: 'South Delhi',
    reviewText: 'Outstanding carpentry work. Fixed our modular kitchen hinges effortlessly. Verified cooperative workers are truly top-notch.',
    rating: 4.9,
    serviceCategory: 'Carpentry Work'
  },
  {
    id: 'rev-5',
    customerName: 'Sneha Kapur',
    city: 'Faridabad',
    reviewText: 'Deep home cleaning service left our apartment spotless! On-time arrival and utmost care taken with furniture.',
    rating: 5.0,
    serviceCategory: 'Cleaning & Hygiene'
  },
  {
    id: 'rev-6',
    customerName: 'Aman Saxena',
    city: 'Ghaziabad',
    reviewText: 'Wall painting service was completed ahead of schedule with zero paint odor. Highly recommended cooperative team!',
    rating: 4.9,
    serviceCategory: 'Wall Painting'
  }
];

export default function CustomerHomePage() {
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Carousel State for Reviews Section
  const [reviewPage, setReviewPage] = useState(0);
  const reviewsPerPage = 3;
  const totalReviewPages = Math.ceil(REVIEWS_DATA.length / reviewsPerPage);

  const visibleReviews = REVIEWS_DATA.slice(
    reviewPage * reviewsPerPage,
    (reviewPage + 1) * reviewsPerPage
  );

  const handlePrevReview = () => {
    setReviewPage((prev) => (prev - 1 + totalReviewPages) % totalReviewPages);
  };

  const handleNextReview = () => {
    setReviewPage((prev) => (prev + 1) % totalReviewPages);
  };

  const serviceCategories = [
    {
      id: 'electrical',
      name: 'Electrical Repair',
      basePrice: 420,
      icon: faBolt,
      workersCount: '140+ Professionals',
      bgImg: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'plumbing',
      name: 'Plumbing Service',
      basePrice: 480,
      icon: faFaucet,
      workersCount: '115+ Professionals',
      bgImg: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'carpentry',
      name: 'Carpentry Work',
      basePrice: 540,
      icon: faHammer,
      workersCount: '88+ Professionals',
      bgImg: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'cleaning',
      name: 'Cleaning & Hygiene',
      basePrice: 360,
      icon: faBroom,
      workersCount: '160+ Professionals',
      bgImg: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'appliance-repair',
      name: 'Appliance Repair',
      basePrice: 600,
      icon: faScrewdriverWrench,
      workersCount: '95+ Professionals',
      bgImg: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'eldercare',
      name: 'Elder Care Service',
      basePrice: 720,
      icon: faHeartPulse,
      workersCount: '60+ Professionals',
      bgImg: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'wall-painting',
      name: 'Wall Painting',
      basePrice: 960,
      icon: faPaintRoller,
      workersCount: '75+ Professionals',
      bgImg: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'all-catalog',
      name: 'All Services Catalog',
      basePrice: 0,
      icon: faGrip,
      workersCount: '7,700+ Professionals',
      bgImg: ''
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#17233A] relative pb-20 md:pb-12 font-sans selection:bg-[#A66666] selection:text-white">
      <CustomerHeader />

      <main className="w-[95%] max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-16 sm:space-y-20">

        {/* 1. HERO SECTION */}
        <section className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] border border-[#E8E2D8] p-5 sm:p-6 lg:p-7 bg-[#FCFBF8] shadow-2xs">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center relative z-10">

            {/* Left 58%: Headline, Description, Trust Highlights & CTA */}
            <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8F6F2] border border-[#E8E2D8] text-xs font-bold text-[#A66666]">
                <FontAwesomeIcon icon={faShieldHalved} className="w-3.5 h-3.5 text-[#A66666]" />
                <span>Verified Cooperative Network</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-4xl xl:text-[44px] font-extrabold font-display leading-[1.15] tracking-tight text-[#17233A] max-w-xl">
                India's First <span className="text-[#A66666]">Cooperative Gig Network</span>
              </h1>

              <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed max-w-xl font-normal">
                Book trusted workers directly from verified local cooperatives. Fair wages for workers, reliable service for your home.
              </p>

              {/* Trust Highlight Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F6F2] border border-[#E8E2D8] text-[11px] sm:text-xs font-semibold text-[#17233A]">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 text-[#4E8A57]" />
                  <span>Verified Cooperative Workers</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F6F2] border border-[#E8E2D8] text-[11px] sm:text-xs font-semibold text-[#17233A]">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 text-[#4E8A57]" />
                  <span>Fair Wage Model</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F6F2] border border-[#E8E2D8] text-[11px] sm:text-xs font-semibold text-[#17233A]">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 text-[#4E8A57]" />
                  <span>Govt & Guild Verified</span>
                </div>
              </div>

              <div className="pt-1 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/services')}
                  className="px-5 py-2.5 rounded-[14px] bg-[#A66666] hover:bg-[#8F5555] text-white font-bold font-display text-xs sm:text-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <span>Explore Services Catalog</span>
                  <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Desktop Compact Community Pool Card */}
              <div className="hidden lg:block pt-2">
                <div className="bg-[#FCFBF8] border border-[#17233A]/20 rounded-2xl p-4 shadow-2xs space-y-3 max-w-xl">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#A66666]/10 text-[#A66666] text-[10px] font-extrabold uppercase tracking-wider">
                      <FontAwesomeIcon icon={faUsers} className="w-3 h-3" />
                      <span>COMMUNITY POOL</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#17233A] font-medium leading-snug">
                    Need multiple workers at once? Request electricians, plumbers, carpenters, cleaners and mixed trade teams from a single order.
                  </p>

                  <div className="grid grid-cols-2 gap-1.5 text-[11px] text-[#4E8A57] font-semibold">
                    <div className="flex items-center gap-1">
                      <span>✓</span> <span className="text-[#17233A]">Multi-worker dispatch</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>✓</span> <span className="text-[#17233A]">Emergency teams</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>✓</span> <span className="text-[#17233A]">Society maintenance</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>✓</span> <span className="text-[#17233A]">Commercial projects</span>
                    </div>
                  </div>

                  <div className="pt-0.5">
                    <button
                      type="button"
                      onClick={() => navigate('/community-pool')}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#17233A] hover:bg-[#253654] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                    >
                      <span>Explore Community Pool</span>
                      <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 42%: Voice Search + Mobile Community Pool + AI Diagnose Card + Hero Carousel */}
            <div className="lg:col-span-5 mt-5 lg:mt-0 space-y-3">
              <div className="w-full">
                <VoiceSearchBar
                  searchQuery={searchQuery}
                  onSearchChange={(val) => setSearchQuery(val)}
                  onVoiceClick={() => console.log('Voice Search Triggered')}
                  placeholder="Search electrician, plumber, cleaner..."
                />
              </div>

              {/* Mobile Compact Community Pool Card (Below Search, Above AI Diagnosis) */}
              <div className="lg:hidden bg-[#FCFBF8] border border-[#17233A]/20 rounded-xl p-3.5 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#A66666]/10 text-[#A66666] flex items-center justify-center shrink-0">
                      <FontAwesomeIcon icon={faUsers} className="w-3 h-3" />
                    </div>
                    <h3 className="text-xs font-extrabold font-display text-[#17233A] uppercase tracking-wide">
                      Community Pool
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-[#6B7280] font-medium leading-snug">
                  Book entire teams instead of individual workers.
                </p>

                <button
                  type="button"
                  onClick={() => navigate('/community-pool')}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#17233A] hover:bg-[#253654] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  <span>Explore Community Pool</span>
                  <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
                </button>
              </div>

              {/* NEW HERO SECTION FEATURE: AI DIAGNOSE CARD */}
              <AiDiagnoseCard />

              <HeroWorkerCarousel onBookClick={() => requireAuth(() => navigate('/worker/el-1'))} />
            </div>

          </div>
        </section>

        {/* 2. STATS SECTION (COMPACT TRUST STRIP RIBBON) */}
        <section className="-mt-8 -mb-8 sm:-mt-12 sm:-mb-12 bg-[#FCFBF8] border border-[#E8E2D8] rounded-[16px] sm:rounded-[20px] py-2.5 px-3 sm:py-3 sm:px-6 shadow-2xs">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 text-center items-center">
            {/* Metric 1: Coops */}
            <div className="flex flex-col items-center justify-center p-1 space-y-0.5">
              <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-[#F8F6F2] text-[#A66666] flex items-center justify-center border border-[#E8E2D8] mb-0.5 shrink-0">
                <FontAwesomeIcon icon={faBuilding} className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#A66666]" />
              </div>
              <span className="block leading-none text-sm xs:text-base sm:text-lg md:text-xl font-extrabold text-[#17233A] font-display tracking-tight">
                120+
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-[#6B7280] leading-none mt-0.5">
                Coops
              </span>
            </div>

            {/* Metric 2: Workers */}
            <div className="flex flex-col items-center justify-center p-1 space-y-0.5">
              <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-[#F8F6F2] text-[#A66666] flex items-center justify-center border border-[#E8E2D8] mb-0.5 shrink-0">
                <FontAwesomeIcon icon={faUsers} className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#A66666]" />
              </div>
              <span className="block leading-none text-sm xs:text-base sm:text-lg md:text-xl font-extrabold text-[#17233A] font-display tracking-tight">
                7,700+
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-[#6B7280] leading-none mt-0.5">
                Workers
              </span>
            </div>

            {/* Metric 3: Jobs */}
            <div className="flex flex-col items-center justify-center p-1 space-y-0.5">
              <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-[#F8F6F2] text-[#A66666] flex items-center justify-center border border-[#E8E2D8] mb-0.5 shrink-0">
                <FontAwesomeIcon icon={faShieldHalved} className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#A66666]" />
              </div>
              <span className="block leading-none text-sm xs:text-base sm:text-lg md:text-xl font-extrabold text-[#17233A] font-display tracking-tight">
                45,000+
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-[#6B7280] leading-none mt-0.5">
                Jobs
              </span>
            </div>
          </div>
        </section>

        {/* 2.5. KAIROVA UNIQUE INNOVATION CAROUSEL */}
        <InnovationCarousel />

        {/* 3. EXPLORE SERVICES CARDS SECTION */}
        <section id="services" className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-xl sm:text-3xl font-extrabold font-display text-[#17233A] tracking-tight">
              Explore Services
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] font-normal mt-0.5 sm:mt-1">
              Top requested household trades fulfilled by verified local cooperatives
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {serviceCategories.map((cat) => {
              if (cat.id === 'all-catalog') {
                return (
                  <div
                    key={cat.id}
                    onClick={() => navigate('/services')}
                    className="group bg-[#FCFBF8] border border-[#E8E2D8] rounded-[20px] sm:rounded-[24px] p-2.5 sm:p-4 hover:-translate-y-1 hover:shadow-md hover:border-[#A66666]/50 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-2xs"
                  >
                    <div className="w-full h-24 sm:h-28 md:h-32 rounded-[14px] sm:rounded-[16px] border border-[#E8E2D8] bg-[#F8F6F2] flex items-center justify-center group-hover:bg-[#FAF6F2] transition-colors">
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#FCFBF8] border border-[#E8E2D8] text-[#A66666] flex items-center justify-center group-hover:bg-[#A66666] group-hover:text-white transition-all shadow-2xs">
                        <FontAwesomeIcon icon={faGrip} className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    </div>

                    <div className="pt-2 text-center">
                      <h3 className="text-xs sm:text-sm md:text-base font-bold font-display text-[#17233A] tracking-tight group-hover:text-[#A66666] transition-colors">
                        All Services
                      </h3>
                      <p className="text-[10px] sm:text-[11px] text-[#6B7280] font-normal mt-0.5">
                        Explore Complete Catalog
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={cat.id}
                  onClick={() => navigate(`/services/${cat.id}`)}
                  className="group bg-[#FCFBF8] border border-[#E8E2D8] rounded-[20px] sm:rounded-[24px] p-2.5 sm:p-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-2xs"
                >
                  <div className="w-full h-24 sm:h-28 md:h-32 rounded-[14px] sm:rounded-[16px] overflow-hidden relative border border-[#E8E2D8]/60 bg-[#F8F6F2]">
                    <img
                      src={cat.bgImg}
                      alt={cat.name}
                      style={{ filter: 'brightness(1.18) contrast(0.98)' }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    <div className="absolute top-2 left-2 z-10 hidden sm:block">
                      <span className="text-[10px] sm:text-[11px] font-semibold text-white bg-[#17233A]/75 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/20 shadow-2xs">
                        {cat.workersCount}
                      </span>
                    </div>

                    <div className="absolute top-2 right-2 z-10 hidden sm:block">
                      <span className="text-[10px] sm:text-[11px] font-bold text-white bg-[#A66666] px-2 py-0.5 rounded-full shadow-2xs">
                        ₹{cat.basePrice}+
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 text-center">
                    <h3 className="text-xs sm:text-sm md:text-base font-bold font-display text-[#17233A] tracking-tight group-hover:text-[#A66666] transition-colors leading-snug">
                      {cat.name}
                    </h3>

                    <div className="pt-1 flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#A66666] group-hover:translate-x-0.5 transition-transform">
                      <span>View Details</span>
                      <FontAwesomeIcon icon={faArrowRight} className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. WORKER CAROUSEL */}
        <section id="workers">
          <WorkerCarousel onBookClick={() => navigate('/worker/el-1')} />
        </section>

        {/* 5. WHY CHOOSE COOPERATIVE SERVICES? */}
        <HomeCooperativeImpact />

        {/* 6. HOW IT WORKS */}
        <HowItWorksTimeline />

        {/* 7. REVIEWS */}
        <section id="reviews" className="space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FCFBF8] border border-[#E8E2D8] text-xs font-bold text-[#A66666]">
                <FontAwesomeIcon icon={faShieldHalved} className="w-3.5 h-3.5 text-[#A66666]" />
                <span>Verified Customer Feedback</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#17233A] tracking-tight mt-2">
                Trusted in Everyday Homes
              </h2>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrevReview}
                className="w-10 h-10 rounded-full bg-[#FCFBF8] border border-[#E8E2D8] text-[#17233A] hover:bg-[#A66666] hover:text-white transition-all cursor-pointer flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextReview}
                className="w-10 h-10 rounded-full bg-[#FCFBF8] border border-[#E8E2D8] text-[#17233A] hover:bg-[#A66666] hover:text-white transition-all cursor-pointer flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8">
            {visibleReviews.map((rev) => {
              const colorScheme = getReviewColor(rev.serviceCategory);
              return (
                <div
                  key={rev.id}
                  style={{ backgroundColor: colorScheme.bg, borderColor: colorScheme.border }}
                  className="rounded-[24px] border p-7 flex flex-col justify-between shadow-2xs"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, idx) => (
                          <FontAwesomeIcon
                            key={idx}
                            icon={faStar}
                            style={{ color: colorScheme.star }}
                            className="w-3.5 h-3.5"
                          />
                        ))}
                      </div>
                      <span
                        style={{ backgroundColor: colorScheme.pillBg, color: colorScheme.text }}
                        className="text-[11px] font-bold px-3 py-1 rounded-full border border-black/5"
                      >
                        {rev.serviceCategory}
                      </span>
                    </div>
                    <p className="text-sm text-[#17233A] font-medium leading-relaxed italic pt-1">
                      "{rev.reviewText}"
                    </p>
                  </div>
                  <div className="pt-6 mt-4 border-t border-black/10 flex items-center justify-between text-xs text-[#6B7280]">
                    <span className="text-[#17233A] font-extrabold font-display text-sm">{rev.customerName}</span>
                    <span>{rev.city}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      <BottomNavigation />
    </div>
  );
}
