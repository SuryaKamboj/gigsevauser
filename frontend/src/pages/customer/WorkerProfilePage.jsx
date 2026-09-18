import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faStar,
  faShieldHalved,
  faLocationDot,
  faPhone,
  faComments,
  faCalendarCheck,
  faBriefcase,
  faLanguage,
  faCircleCheck,
  faXmark,
  faBuilding,
  faUserCheck,
  faCertificate,
  faHandHoldingHeart,
  faChartLine,
  faThumbsUp,
  faImages
} from '@fortawesome/free-solid-svg-icons';
import CustomerHeader from '../../components/customer/CustomerHeader';
import BottomNavigation from '../../components/customer/BottomNavigation';
import { getWorkerById } from '../../data/workersData';
import { SERVICES_DATA, getServiceById } from '../../data/servicesData';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { fetchWorkerById } from '../../services/workersApi';

import TrustScoreEngine from '../../components/customer/TrustScoreEngine';
import CommunityVerifiedBadges from '../../components/customer/CommunityVerifiedBadges';

export default function WorkerProfilePage() {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const { setSelectedWorkerId, setSelectedServiceId } = useBooking();
  const { requireAuth } = useAuth();

  const [worker, setWorker] = useState(() => getWorkerById(workerId));

  useEffect(() => {
    if (workerId && workerId.length === 24) {
      fetchWorkerById(workerId)
        .then((res) => {
          const w = res?.data || res;
          if (w && (w.fullName || w._id)) {
            const rawCat = (w.primaryServiceCategory || w.skills?.[0]?.category || 'ELECTRICAL').toUpperCase();
            const rawImg = w.selfieUrl || w.avatarUrl;
            const validImg =
              rawImg && (rawImg.startsWith('http') || rawImg.startsWith('data:'))
                ? rawImg
                : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';

            let serviceSlug = 'electrical';
            let profession = 'Master Electrician';
            if (rawCat.includes('PLUMB')) {
              serviceSlug = 'plumbing';
              profession = 'Certified Plumber';
            } else if (rawCat.includes('CARP')) {
              serviceSlug = 'carpentry';
              profession = 'Artisan Carpenter';
            } else if (rawCat.includes('PAINT')) {
              serviceSlug = 'painting';
              profession = 'Specialist Surface Painter';
            } else if (rawCat.includes('CLEAN')) {
              serviceSlug = 'cleaning';
              profession = 'Cleaning Expert';
            }

            setWorker((prev) => ({
              ...prev,
              id: w._id,
              backendId: w._id,
              serviceId: serviceSlug,
              fullName: w.fullName || prev.fullName,
              profession,
              avatarUrl: validImg,
              cooperative: w.societyId?.name || w.serviceArea || prev.cooperative,
              skills:
                Array.isArray(w.skills) && w.skills.length > 0
                  ? w.skills.map((s) => (typeof s === 'string' ? s : s.category || 'General Skill'))
                  : prev.skills,
              jobsCompleted: w.metrics?.completedJobsCount || prev.jobsCompleted || 18,
              rating: w.metrics?.averageRating || prev.rating || 4.9,
              trustScore: w.metrics?.trustScore || prev.trustScore || 96.0,
              basePrice: rawCat.includes('PLUMB') ? 350 : 420
            }));
          }
        })
        .catch((err) => console.warn('Worker profile notice:', err));
    }
  }, [workerId]);
  const service = getServiceById(worker?.serviceId);

  const [activeModal, setActiveModal] = useState(null); // 'chat' | 'call' | null
  const [selectedTag, setSelectedTag] = useState('All');

  // Fallback defaults for missing dynamic fields
  const guildInfo = worker.guildDetails || {
    guildName: worker.cooperative || 'Lajpat Nagar Artisan Guild',
    trustScore: 98.4,
    activeWorkers: 148,
    responseTime: '17 mins',
    disputeResolutionRate: '99.1%',
    yearsActive: `${worker.experienceYears || 8}+ Years`
  };

  const workGallery = worker.workGallery || [
    {
      id: 'wg-1',
      title: 'Burnt Switchboard Overhaul & Safety Wiring',
      jobType: 'Emergency Circuit Fix',
      date: '14 Aug 2026',
      rating: 5.0,
      location: 'Lajpat Nagar II, New Delhi',
      beforeImg: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=500&auto=format&fit=crop&q=80',
      afterImg: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'wg-2',
      title: 'Full Apartment Earthing Audit',
      jobType: 'Concealed Line Inspection',
      date: '02 Aug 2026',
      rating: 5.0,
      location: 'Defence Colony, New Delhi',
      beforeImg: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
      afterImg: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80'
    }
  ];

  const whyChoose = worker.whyChoose || [
    { title: `${worker.experienceYears || 8}+ Years Master Expertise`, desc: `Executed over ${worker.jobsCompleted}+ verified jobs with 100% precision.` },
    { title: 'Verified Cooperative Service Assurance', desc: 'Free revisit guarantee backed by local cooperative guild.' },
    { title: '100% Background Checked', desc: 'Aadhaar biometric & police check verified.' },
    { title: 'Transparent Guild Rate Card', desc: 'No middleman fee markup. 100% direct artisan pay.' },
    { title: 'Cooperative Healthcare Backing', desc: 'Your booking supports artisan family health funds.' }
  ];

  const ratingDist = worker.ratingDistribution || {
    totalReviews: worker.jobsCompleted || 142,
    fiveStarPercent: 92,
    fourStarPercent: 6,
    threeStarPercent: 2,
    twoStarPercent: 0,
    oneStarPercent: 0
  };

  const reviewTags = worker.reviewTags || ['All', 'Punctual', 'Clean Work', 'Fair Pricing', 'Expert Level'];

  const reviewsList = worker.reviews || [
    {
      id: 'r1',
      author: 'Ananya Sen',
      location: 'New Delhi',
      date: '3 days ago',
      rating: 5,
      isVerified: true,
      tag: 'Punctual',
      comment: 'The cooperative worker arrived on time and completed the job with total precision.'
    }
  ];

  const filteredReviews = selectedTag === 'All'
    ? reviewsList
    : reviewsList.filter((r) => r.tag?.toLowerCase().includes(selectedTag.toLowerCase()) || selectedTag === 'All');

  const handleBookNow = () => {
    requireAuth(() => {
      setSelectedWorkerId(worker.id);
      setSelectedServiceId(worker.serviceId);
      navigate(`/booking?workerId=${worker.id}&service=${worker.serviceId}`);
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#17233A] relative pb-20 md:pb-12 font-sans selection:bg-[#A66666] selection:text-white">
      <CustomerHeader />

      <main className="w-[95%] max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-10">
        
        {/* BREADCRUMB */}
        <nav aria-label="Breadcrumb" className="text-xs font-medium text-[#6B7280]">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li><Link to="/" className="hover:text-[#17233A] transition-colors">Home</Link></li>
            <li><FontAwesomeIcon icon={faChevronRight} className="w-2 h-2 text-[#A66666]" /></li>
            <li><Link to={`/services/${worker.serviceId}`} className="hover:text-[#17233A] transition-colors">{service.name}</Link></li>
            <li><FontAwesomeIcon icon={faChevronRight} className="w-2 h-2 text-[#A66666]" /></li>
            <li><Link to={`/services/${worker.serviceId}/workers`} className="hover:text-[#17233A] transition-colors">Workers</Link></li>
            <li><FontAwesomeIcon icon={faChevronRight} className="w-2 h-2 text-[#A66666]" /></li>
            <li className="text-[#17233A] font-bold truncate max-w-[150px] sm:max-w-none">{worker.fullName}</li>
          </ol>
        </nav>

        {/* WORKER HERO PROFILE HEADER CARD */}
        <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] sm:rounded-[28px] p-4 sm:p-8 shadow-xs space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Left: Large Photo + Badges */}
            <div className="md:col-span-4 flex flex-col items-center text-center space-y-3">
              <div className="relative w-36 h-36 sm:w-48 sm:h-48 rounded-[24px] overflow-hidden border-2 border-[#E8E2D8] shadow-sm">
                <img src={worker.avatarUrl} alt={worker.fullName} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-[#A66666] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                  <FontAwesomeIcon icon={faCircleCheck} className="w-3 h-3" />
                  <span>Verified</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F6F2] border border-[#E8E2D8] text-xs font-bold text-[#A66666]">
                <FontAwesomeIcon icon={faShieldHalved} className="w-3.5 h-3.5" />
                <span className="truncate max-w-[200px]">{guildInfo.guildName}</span>
              </div>
            </div>

            {/* Right: Info & Primary CTAs */}
            <div className="md:col-span-8 space-y-4 sm:space-y-5">
              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-[#17233A]">
                    {worker.fullName}
                  </h1>
                  <span className="text-xl sm:text-2xl font-extrabold font-display text-[#17233A] bg-[#F8F6F2] px-4 py-1.5 rounded-2xl border border-[#E8E2D8] w-fit">
                    ₹{worker.basePrice} <span className="text-xs font-normal text-[#6B7280]">/ service call</span>
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-[#A66666]">
                  {worker.profession} • {service.name}
                </p>
                <p className="text-[11px] text-[#6B7280] font-mono">
                  Reg ID: {worker.coopRegNo}
                </p>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-[#F8F6F2] border border-[#E8E2D8] p-3 sm:p-4 rounded-2xl text-center">
                <div>
                  <span className="text-[10px] sm:text-xs text-[#6B7280] font-semibold block">Experience</span>
                  <span className="text-sm sm:text-base font-extrabold font-display text-[#17233A] flex items-center justify-center gap-1 mt-0.5">
                    <FontAwesomeIcon icon={faBriefcase} className="w-3.5 h-3.5 text-[#A66666]" />
                    {worker.experienceYears} Yrs
                  </span>
                </div>

                <div>
                  <span className="text-[10px] sm:text-xs text-[#6B7280] font-semibold block">Rating</span>
                  <span className="text-sm sm:text-base font-extrabold font-display text-[#17233A] flex items-center justify-center gap-1 mt-0.5">
                    <FontAwesomeIcon icon={faStar} className="w-3.5 h-3.5 text-[#A66666]" />
                    {worker.rating} ★
                  </span>
                </div>

                <div>
                  <span className="text-[10px] sm:text-xs text-[#6B7280] font-semibold block">Completed</span>
                  <span className="text-sm sm:text-base font-extrabold font-display text-[#17233A] block mt-0.5">
                    {worker.jobsCompleted} Jobs
                  </span>
                </div>
              </div>

              {/* Bio & Languages */}
              <div className="space-y-2 text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                <p>{worker.bio}</p>

                <div className="flex items-center gap-2 pt-1 text-xs text-[#17233A] font-semibold">
                  <FontAwesomeIcon icon={faLanguage} className="w-4 h-4 text-[#A66666]" />
                  <span>Languages: {worker.languages ? worker.languages.join(', ') : 'Hindi, English'}</span>
                </div>
              </div>

              {/* ACTION BUTTONS: BOOK NOW, CHAT, CALL */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={handleBookNow}
                  className="flex-1 min-w-[140px] py-3 sm:py-3.5 rounded-2xl bg-[#A66666] hover:bg-[#8F5555] text-white font-bold font-display text-xs sm:text-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <FontAwesomeIcon icon={faCalendarCheck} className="w-4 h-4" />
                  <span>Book Now</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModal('chat')}
                  className="px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-[#FCFBF8] text-[#17233A] font-bold text-xs hover:bg-[#F8F6F2] active:scale-95 transition-all border border-[#E8E2D8] flex items-center gap-1.5 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faComments} className="w-3.5 h-3.5 text-[#A66666]" />
                  <span>Chat</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModal('call')}
                  className="px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-[#FCFBF8] text-[#17233A] font-bold text-xs hover:bg-[#F8F6F2] active:scale-95 transition-all border border-[#E8E2D8] flex items-center gap-1.5 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faPhone} className="w-3.5 h-3.5 text-[#A66666]" />
                  <span>Call</span>
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* 1. TRUST SCORE ENGINE */}
        <TrustScoreEngine
          overallScore={96.8}
          ratingsScore={98.0}
          completionRate={99.2}
          responseTimeScore={96.0}
          complaintResolution={99.5}
          verificationStatus={100.0}
        />

        {/* 2. PROOF OF WORK SECTION */}
        <section className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-5 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#E8E2D8] pb-3">
            <div className="flex items-center gap-2.5">
              <FontAwesomeIcon icon={faImages} className="w-5 h-5 text-[#A66666]" />
              <div>
                <h2 className="text-lg sm:text-xl font-bold font-display text-[#17233A]">
                  Proof of Work Section
                </h2>
                <p className="text-xs text-[#6B7280]">Photographic evidence & ratings of recent completed projects</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#A66666] bg-[#F8F6F2] px-3 py-1 rounded-full border border-[#E8E2D8]">
              {workGallery.length} Verified Projects
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {workGallery.map((item) => (
              <div key={item.id} className="bg-[#F8F6F2] border border-[#E8E2D8] rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#17233A]">
                  <span className="truncate max-w-[200px]">{item.title}</span>
                  <span className="text-[#A66666] shrink-0">★ {item.rating}</span>
                </div>

                <div className="text-[11px] text-[#6B7280] flex items-center justify-between gap-1">
                  <span>{item.jobType}</span>
                  <span>{item.date}</span>
                </div>

                {/* Before / After Comparison Images */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#A66666] uppercase tracking-wider block">Before Image</span>
                    <div className="h-28 sm:h-36 rounded-xl overflow-hidden border border-[#E8E2D8]">
                      <img src={item.beforeImg} alt="Before work" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#4E8A57] uppercase tracking-wider block">After Image</span>
                    <div className="h-28 sm:h-36 rounded-xl overflow-hidden border border-[#E8E2D8]">
                      <img src={item.afterImg} alt="After work" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-[#6B7280] pt-1 flex items-center gap-1 font-medium">
                  <FontAwesomeIcon icon={faLocationDot} className="text-[#A66666] w-2.5 h-2.5" />
                  Location: {item.location}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. COMMUNITY VERIFIED BADGES */}
        <CommunityVerifiedBadges />

        {/* 4. CUSTOMER REVIEWS SECTION */}
        <section className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-5 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-3 border-b border-[#E8E2D8] pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-[#17233A]">
                Customer Reviews ({ratingDist.totalReviews})
              </h2>
              <p className="text-xs text-[#6B7280]">Authentic feedback from verified householders</p>
            </div>

            <span className="text-lg font-extrabold font-display text-[#17233A] bg-[#F8F6F2] px-4 py-1.5 rounded-2xl border border-[#E8E2D8]">
              {worker.rating} ★★★★★
            </span>
          </div>

          {/* Rating Distribution Bars */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#F8F6F2] border border-[#E8E2D8] p-4 sm:p-6 rounded-2xl">
            <div className="lg:col-span-4 text-center lg:text-left space-y-1">
              <span className="text-4xl font-extrabold font-display text-[#17233A] block">{worker.rating}</span>
              <div className="flex items-center justify-center lg:justify-start gap-1 text-[#A66666] text-sm">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon key={i} icon={faStar} />
                ))}
              </div>
              <span className="text-xs text-[#6B7280] font-medium block">Based on {ratingDist.totalReviews} verified reviews</span>
            </div>

            <div className="lg:col-span-8 space-y-2 text-xs font-semibold">
              {[
                { stars: '5 Star', pct: ratingDist.fiveStarPercent },
                { stars: '4 Star', pct: ratingDist.fourStarPercent },
                { stars: '3 Star', pct: ratingDist.threeStarPercent },
                { stars: '2 Star', pct: ratingDist.twoStarPercent },
                { stars: '1 Star', pct: ratingDist.oneStarPercent }
              ].map((row) => (
                <div key={row.stars} className="flex items-center gap-3">
                  <span className="w-12 text-[#6B7280] shrink-0">{row.stars}</span>
                  <div className="flex-1 h-2 rounded-full bg-[#FCFBF8] border border-[#E8E2D8] overflow-hidden">
                    <div style={{ width: `${row.pct}%` }} className="h-full bg-[#A66666] rounded-full" />
                  </div>
                  <span className="w-8 text-right text-[#17233A] shrink-0">{row.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Filter Tags */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-bold text-[#17233A]">Filter by Tag:</span>
            {reviewTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full border transition-all cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-[#A66666] text-white font-bold border-[#A66666]'
                    : 'bg-[#F8F6F2] text-[#17233A] border-[#E8E2D8] hover:bg-[#E8E2D8]/50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Individual Review Cards */}
          <div className="space-y-4 pt-2">
            {filteredReviews.map((rev) => (
              <div key={rev.id} className="bg-[#F8F6F2] border border-[#E8E2D8] p-4 sm:p-5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#17233A]">{rev.author}</span>
                    {rev.isVerified && (
                      <span className="text-[10px] font-bold text-[#4E8A57] bg-[#4E8A57]/10 px-2 py-0.5 rounded-full border border-[#4E8A57]/20 flex items-center gap-1">
                        <FontAwesomeIcon icon={faCircleCheck} className="w-2.5 h-2.5" />
                        Verified Customer
                      </span>
                    )}
                  </div>
                  <span className="text-[#A66666] text-xs font-bold font-mono">
                    {'★'.repeat(rev.rating)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-[#6B7280]">
                  <span>{rev.location}</span>
                  <span>•</span>
                  <span>{rev.date}</span>
                  {rev.tag && (
                    <>
                      <span>•</span>
                      <span className="text-[#A66666] font-semibold">{rev.tag}</span>
                    </>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-[#17233A] italic font-medium leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>

          {/* BOTTOM BOOK NOW CTA IN REVIEWS SECTION */}
          <div className="pt-4 border-t border-[#E8E2D8] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold font-display text-[#17233A]">Ready to book {worker.fullName}?</h3>
              <p className="text-xs text-[#6B7280]">Backed by Verified Cooperative Service Assurance and upfront fixed pricing.</p>
            </div>
            <button
              type="button"
              onClick={handleBookNow}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#A66666] hover:bg-[#8F5555] text-white font-bold font-display text-xs sm:text-sm active:scale-95 transition-all shadow-md cursor-pointer"
            >
              Book Now (₹{worker.basePrice})
            </button>
          </div>

        </section>

      </main>

      {/* CHAT / CALL MODAL SIMULATION */}
      {activeModal && (
        <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-6 w-full max-w-md space-y-4 shadow-xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-[#6B7280] hover:text-[#17233A]"
            >
              <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
            </button>

            {activeModal === 'chat' ? (
              <div className="space-y-3">
                <h3 className="text-lg font-bold font-display text-[#17233A]">Chat with {worker.fullName}</h3>
                <div className="bg-[#F8F6F2] p-3.5 rounded-xl text-xs text-[#6B7280] min-h-[100px]">
                  <p className="text-[#17233A] font-semibold">{worker.fullName}:</p>
                  <p className="italic">"Hello! I am nearby with {guildInfo.guildName}. How can I assist with your {service.name} today?"</p>
                </div>
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="w-full p-3 rounded-xl border border-[#E8E2D8] text-xs focus:outline-none focus:border-[#A66666]"
                />
                <button
                  onClick={() => handleBookNow()}
                  className="w-full py-3 rounded-xl bg-[#A66666] text-white text-xs font-bold cursor-pointer"
                >
                  Proceed to Book Service
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-center py-4">
                <div className="w-16 h-16 rounded-full bg-[#F8F6F2] border border-[#E8E2D8] text-[#A66666] mx-auto flex items-center justify-center">
                  <FontAwesomeIcon icon={faPhone} className="w-6 h-6 animate-bounce" />
                </div>
                <h3 className="text-lg font-bold font-display text-[#17233A]">Contact {worker.fullName}</h3>
                <p className="text-xs text-[#6B7280]">Direct Guild Dispatch Hotline:</p>
                <p className="text-xl font-bold font-mono text-[#A66666]">+91 98765-43210</p>
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-2 rounded-xl bg-[#17233A] text-white text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
}
