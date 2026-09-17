import React, { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faChevronLeft,
  faShieldHalved,
  faClock,
  faCheckCircle,
  faUsers,
  faCalendarCheck,
  faStar,
  faChevronDown,
  faChevronUp,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import CustomerHeader from '../../components/customer/CustomerHeader';
import BottomNavigation from '../../components/customer/BottomNavigation';
import CompactTrustStrip from '../../components/customer/CompactTrustStrip';
import { fetchWorkers } from '../../services/workersApi';
import { useBooking } from '../../context/BookingContext';

export default function ServiceDetailPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { setSelectedServiceId } = useBooking();

  const service = SERVICES_DATA[serviceId] || SERVICES_DATA['electrical'];

  const [openFaq, setOpenFaq] = useState(null);
  const scrollRef = useRef(null);
  const [liveWorkers, setLiveWorkers] = useState([]);

  React.useEffect(() => {
    let isMounted = true;
    fetchWorkers().then((data) => {
      if (isMounted && Array.isArray(data) && data.length > 0) {
        setLiveWorkers(data);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const recommendedWorkers = React.useMemo(() => {
    if (liveWorkers.length > 0) {
      return liveWorkers.map((w) => ({
        id: w._id,
        _id: w._id,
        fullName: w.fullName || 'Verified Artisan',
        profession: w.primarySkill || w.primaryServiceCategory || 'Cooperative Artisan',
        cooperative: w.societyId?.name || 'South Delhi Worker Cooperative',
        rating: w.metrics?.averageRating || 4.9,
        trustScore: w.metrics?.trustScore || 96,
        jobsCompleted: w.metrics?.completedJobsCount || 24,
        distanceKm: 1.2,
        basePrice: w.basePrice || service.basePrice || 399,
        avatarUrl: w.selfieUrl || w.avatarUrl || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400'
      }));
    }
    return [];
  }, [liveWorkers, service.basePrice]);

  const scrollCarousel = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleBookService = () => {
    setSelectedServiceId(service.id);
    navigate(`/booking?service=${service.id}`);
  };

  const handleViewWorkers = () => {
    setSelectedServiceId(service.id);
    navigate(`/services/${service.id}/workers`);
  };

  const faqs = [
    {
      q: `What is included in ${service.name}?`,
      a: `Our verified cooperative artisan carries out a complete initial diagnostic check, minor part repairs, load/safety verification, and clean-up. Spare parts are provided at fixed guild rate-card prices.`
    },
    {
      q: 'How does pricing work?',
      a: `You pay an upfront base inspection fee of ₹${service.basePrice}. If additional spare parts or heavy repairs are needed, our artisan provides an itemized quote based on standard cooperative rate cards before starting.`
    },
    {
      q: 'What if I am not satisfied with the repair?',
      a: 'All completed bookings include our Verified Cooperative Service Assurance. If any issue reoccurs, a verified artisan re-visits and fixes it free of charge.'
    },
    {
      q: 'Are the workers background checked?',
      a: 'Yes! 100% of workers on GigSave are police verified, Aadhaar biometric checked, and registered members of government-accredited worker cooperatives.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#17233A] relative pb-24 md:pb-12 font-sans selection:bg-[#A66666] selection:text-white">
      <CustomerHeader />

      <main className="w-[95%] max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs font-medium text-[#6B7280]">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li><Link to="/" className="hover:text-[#17233A] transition-colors">Home</Link></li>
            <li><FontAwesomeIcon icon={faChevronRight} className="w-2 h-2 text-[#A66666]" /></li>
            <li><Link to="/services" className="hover:text-[#17233A] transition-colors">Services Catalog</Link></li>
            <li><FontAwesomeIcon icon={faChevronRight} className="w-2 h-2 text-[#A66666]" /></li>
            <li className="text-[#17233A] font-bold">{service.name}</li>
          </ol>
        </nav>

        {/* 1. HERO SERVICE BANNER */}
        <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] sm:rounded-[28px] overflow-hidden p-5 sm:p-8 lg:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Left Info */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8F6F2] border border-[#E8E2D8] text-xs font-bold text-[#A66666]">
                <FontAwesomeIcon icon={faShieldHalved} className="w-3.5 h-3.5" />
                <span>Verified Cooperative Guild Service</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-display text-[#17233A] tracking-tight">
                {service.name}
              </h1>

              <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed font-normal">
                {service.description}
              </p>

              {/* Key Metrics Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="bg-[#F8F6F2] border border-[#E8E2D8] p-3 rounded-2xl">
                  <span className="text-[10px] sm:text-[11px] font-semibold text-[#6B7280] block">Starting Price</span>
                  <span className="text-base sm:text-lg font-extrabold font-display text-[#17233A]">
                    ₹{service.basePrice}+
                  </span>
                </div>

                <div className="bg-[#F8F6F2] border border-[#E8E2D8] p-3 rounded-2xl">
                  <span className="text-[10px] sm:text-[11px] font-semibold text-[#6B7280] block">Est. Arrival Time</span>
                  <span className="text-xs sm:text-sm font-extrabold font-display text-[#17233A] flex items-center gap-1 mt-0.5">
                    <FontAwesomeIcon icon={faClock} className="w-3 h-3 text-[#A66666]" />
                    {service.estimatedTime}
                  </span>
                </div>

                <div className="bg-[#F8F6F2] border border-[#E8E2D8] p-3 rounded-2xl col-span-2 sm:col-span-1">
                  <span className="text-[10px] sm:text-[11px] font-semibold text-[#6B7280] block">Rating & Reviews</span>
                  <span className="text-xs sm:text-sm font-extrabold font-display text-[#17233A] flex items-center gap-1 mt-0.5">
                    <FontAwesomeIcon icon={faStar} className="w-3 h-3 text-[#A66666]" />
                    {service.rating} ({service.reviewsCount})
                  </span>
                </div>
              </div>

              {/* ACTION CTAs */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleBookService}
                  className="px-6 py-3 sm:py-3.5 rounded-2xl bg-[#A66666] hover:bg-[#8F5555] text-white font-bold font-display text-xs sm:text-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <FontAwesomeIcon icon={faCalendarCheck} className="w-4 h-4" />
                  <span>Book Service Now</span>
                </button>

                <button
                  type="button"
                  onClick={handleViewWorkers}
                  className="px-5 py-3 sm:py-3.5 rounded-2xl bg-transparent text-[#17233A] font-bold font-display text-xs sm:text-sm hover:bg-[#A66666]/10 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#E8E2D8]"
                >
                  <FontAwesomeIcon icon={faUsers} className="w-4 h-4 text-[#A66666]" />
                  <span>View Available Workers</span>
                </button>
              </div>
            </div>

            {/* Right Image Banner */}
            <div className="lg:col-span-5">
              <div className="rounded-[20px] sm:rounded-[24px] overflow-hidden border border-[#E8E2D8] shadow-sm max-h-[300px]">
                <img src={service.bgImg} alt={service.name} className="w-full h-full object-cover" />
              </div>
            </div>

          </div>
        </div>

        {/* 2. COMPACT TRUST STRIP */}
        <CompactTrustStrip
          trustScore="98.4%"
          avgResponse="17 Min"
          warranty="Verified Cooperative Service Assurance"
          activeWorkers="148 Active Guild Workers"
        />

        {/* 3. RECOMMENDED WORKERS FOR YOU (HORIZONTAL CAROUSEL) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-display text-[#17233A] tracking-tight">
                Recommended Workers For You
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280] font-normal mt-0.5">
                Top verified cooperative artisans for this service.
              </p>
            </div>

            {/* Navigation Arrows for Desktop */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollCarousel(-1)}
                className="w-9 h-9 rounded-full bg-[#FCFBF8] border border-[#E8E2D8] text-[#17233A] hover:bg-[#A66666] hover:text-white hover:border-[#A66666] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                aria-label="Previous recommended worker"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel(1)}
                className="w-9 h-9 rounded-full bg-[#FCFBF8] border border-[#E8E2D8] text-[#17233A] hover:bg-[#A66666] hover:text-white hover:border-[#A66666] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                aria-label="Next recommended worker"
              >
                <FontAwesomeIcon icon={faChevronRight} className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Carousel Track */}
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-1 px-0.5"
          >
            {recommendedWorkers.map((wrk) => (
              <div
                key={wrk.id}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 snap-start bg-[#FCFBF8] border border-[#E8E2D8] rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 space-y-3.5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Header: Photo + Name + Specialization */}
                  <div className="flex items-start gap-3.5">
                    <img
                      src={wrk.avatarUrl}
                      alt={wrk.fullName}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border border-[#E8E2D8] shrink-0 shadow-2xs"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-base font-bold font-display text-[#17233A] truncate">
                          {wrk.fullName}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#17233A] bg-[#F8F6F2] px-2 py-0.5 rounded-full border border-[#E8E2D8] shrink-0">
                          <FontAwesomeIcon icon={faStar} className="w-3 h-3 text-[#A66666]" />
                          <span>{wrk.rating}</span>
                        </span>
                      </div>
                      <p className="text-xs font-medium text-[#6B7280] truncate mt-0.5">
                        {wrk.profession}
                      </p>
                      <p className="text-[11px] font-semibold text-[#A66666] truncate mt-0.5">
                        {wrk.cooperative}
                      </p>
                    </div>
                  </div>

                  {/* Metrics Grid: Trust Score, Completed Jobs, ETA, Price */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold pt-1">
                    <div className="bg-[#F8F6F2] border border-[#E8E2D8] p-2.5 rounded-xl">
                      <span className="text-[10px] font-medium text-[#6B7280] block">Trust Score</span>
                      <span className="text-xs font-bold text-[#17233A]">{wrk.trustScore}%</span>
                    </div>

                    <div className="bg-[#F8F6F2] border border-[#E8E2D8] p-2.5 rounded-xl">
                      <span className="text-[10px] font-medium text-[#6B7280] block">Completed Jobs</span>
                      <span className="text-xs font-bold text-[#17233A]">{wrk.jobsCompleted} Jobs</span>
                    </div>

                    <div className="bg-[#F8F6F2] border border-[#E8E2D8] p-2.5 rounded-xl">
                      <span className="text-[10px] font-medium text-[#6B7280] block">Est. Arrival</span>
                      <span className="text-xs font-bold text-[#A66666] flex items-center gap-1">
                        <FontAwesomeIcon icon={faClock} className="w-2.5 h-2.5 text-[#A66666]" />
                        <span>{Math.round(wrk.distanceKm * 10 + 10)} mins</span>
                      </span>
                    </div>

                    <div className="bg-[#F8F6F2] border border-[#E8E2D8] p-2.5 rounded-xl">
                      <span className="text-[10px] font-medium text-[#6B7280] block">Starting Price</span>
                      <span className="text-xs font-bold text-[#17233A]">Starts at ₹{wrk.basePrice}</span>
                    </div>
                  </div>
                </div>

                {/* View Profile Action CTA */}
                <button
                  type="button"
                  onClick={() => navigate(`/worker/${wrk.id}`)}
                  className="w-full py-2.5 rounded-[14px] bg-[#A66666] hover:bg-[#8F5555] text-white font-bold font-display text-xs active:scale-95 transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer mt-1"
                >
                  <span>View Profile</span>
                  <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 4. INCLUDED TASKS */}
        <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-5 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold font-display text-[#17233A] border-b border-[#E8E2D8] pb-3">
            What is Included in {service.name}?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {service.includedTasks.map((task, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#17233A] font-medium bg-[#F8F6F2] border border-[#E8E2D8] p-3.5 rounded-xl">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-[#A66666] shrink-0 mt-0.5" />
                <span>{task}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. RATINGS SUMMARY */}
        <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F8F6F2] border border-[#E8E2D8] text-[#A66666] flex flex-col items-center justify-center shrink-0">
              <span className="text-xl font-black font-display leading-none">{service.rating}</span>
              <span className="text-[10px] text-[#6B7280] font-bold">out of 5</span>
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-[#17233A]">Customer Satisfaction Summary</h3>
              <p className="text-xs text-[#6B7280]">Based on {service.reviewsCount} verified service completions across Delhi NCR</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleViewWorkers}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F8F6F2] hover:bg-[#E8E2D8]/50 border border-[#E8E2D8] text-xs font-bold text-[#17233A] cursor-pointer"
          >
            View Worker Profiles ({service.workersCount})
          </button>
        </div>

        {/* 5. FREQUENTLY ASKED QUESTIONS (FAQs) ACCORDION */}
        <section className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-5 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold font-display text-[#17233A] border-b border-[#E8E2D8] pb-3">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="bg-[#F8F6F2] border border-[#E8E2D8] rounded-2xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-[#17233A] cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} className="w-3.5 h-3.5 text-[#A66666]" />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-[#6B7280] leading-relaxed border-t border-[#E8E2D8]/50 pt-2">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </main>

      <BottomNavigation activeTab="services" />
    </div>
  );
}
