import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faStar,
  faShieldHalved,
  faLocationDot,
  faFilter,
  faCircleCheck,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import CustomerHeader from '../../components/customer/CustomerHeader';
import BottomNavigation from '../../components/customer/BottomNavigation';
import { getWorkersByService, WORKERS_DATA } from '../../data/workersData';
import { SERVICES_DATA } from '../../data/servicesData';
import { useBooking } from '../../context/BookingContext';
import { fetchWorkers } from '../../services/workersApi';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';

export default function ServiceListingPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = (searchParams.get('q') || searchParams.get('search') || '').trim().toLowerCase();
  const { setSelectedWorkerId } = useBooking();

  const isGlobalFindWorkers = !serviceId;
  const currentServiceId = serviceId || 'electrical';
  const service = SERVICES_DATA[currentServiceId] || SERVICES_DATA['electrical'];

  // Backend workers state
  const [liveWorkers, setLiveWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Category filter state (primarily for global Find Workers view)
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter States
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedDistance, setSelectedDistance] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');

  // Fetch verified active workers from backend (admin panel workers)
  useEffect(() => {
    let isMounted = true;

    const loadWorkers = async () => {
      try {
        const data = await fetchWorkers();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const mapped = data.map((w) => {
            const rawCat = (w.primaryServiceCategory || w.skills?.[0]?.category || 'ELECTRICAL').toUpperCase();
            
            let serviceSlug = 'electrical';
            let profession = 'Master Electrician';
            let basePrice = 420;

            if (rawCat.includes('PLUMB')) {
              serviceSlug = 'plumbing';
              profession = 'Certified Plumber';
              basePrice = 350;
            } else if (rawCat.includes('CARP')) {
              serviceSlug = 'carpentry';
              profession = 'Master Artisan Carpenter';
              basePrice = 450;
            } else if (rawCat.includes('PAINT')) {
              serviceSlug = 'painting';
              profession = 'Specialist Surface Painter';
              basePrice = 499;
            } else if (rawCat.includes('CLEAN')) {
              serviceSlug = 'cleaning';
              profession = 'Sanitation & Cleaning Expert';
              basePrice = 399;
            } else if (rawCat.includes('AC') || rawCat.includes('APPLIANCE')) {
              serviceSlug = 'appliance-repair';
              profession = 'HVAC & Appliance Specialist';
              basePrice = 450;
            }

            const rawImg = w.selfieUrl || w.avatarUrl;
            const validImg = rawImg && (rawImg.startsWith('http') || rawImg.startsWith('data:'))
              ? rawImg
              : DEFAULT_AVATAR;

            return {
              id: w._id,
              backendId: w._id,
              serviceId: serviceSlug,
              category: rawCat,
              fullName: w.fullName || 'Verified Worker',
              profession: profession,
              trustScore: w.metrics?.trustScore || 96.0,
              distanceKm: 1.2,
              rating: w.metrics?.averageRating || 4.9,
              jobsCompleted: w.metrics?.completedJobsCount || 18,
              basePrice: basePrice,
              availableNow: w.isOnline || w.availabilityStatus === 'AVAILABLE' || true,
              cooperative: w.societyId?.name || w.serviceArea || 'South Delhi Worker Cooperative Society',
              avatarUrl: validImg
            };
          });

          setLiveWorkers(mapped);
        }
      } catch (err) {
        console.warn('Notice loading live workers from backend:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadWorkers();
    const interval = setInterval(loadWorkers, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Compute available worker pool
  const rawWorkers = useMemo(() => {
    if (liveWorkers.length > 0) {
      if (isGlobalFindWorkers) {
        return liveWorkers;
      }
      const filtered = liveWorkers.filter((w) => w.serviceId === currentServiceId);
      return filtered.length > 0 ? filtered : liveWorkers;
    }

    // Fallback to static mock data if backend has no records
    return isGlobalFindWorkers ? WORKERS_DATA : getWorkersByService(currentServiceId);
  }, [liveWorkers, isGlobalFindWorkers, currentServiceId]);

  // Filter Logic
  const filteredWorkers = useMemo(() => {
    return rawWorkers.filter((worker) => {
      // Category filter for Find Workers
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'electrical' && worker.serviceId !== 'electrical') return false;
        if (selectedCategory === 'plumbing' && worker.serviceId !== 'plumbing') return false;
        if (selectedCategory === 'carpentry' && worker.serviceId !== 'carpentry') return false;
        if (selectedCategory === 'painting' && worker.serviceId !== 'painting') return false;
        if (selectedCategory === 'cleaning' && worker.serviceId !== 'cleaning') return false;
      }

      // Price filter
      if (selectedPrice === 'under-450' && worker.basePrice > 450) return false;
      if (selectedPrice === '450-500' && (worker.basePrice < 450 || worker.basePrice > 500)) return false;
      if (selectedPrice === 'above-500' && worker.basePrice < 500) return false;

      // Rating filter
      if (selectedRating === '4.8-plus' && worker.rating < 4.8) return false;
      if (selectedRating === '4.9-plus' && worker.rating < 4.9) return false;

      // Distance filter
      if (selectedDistance === 'within-2' && worker.distanceKm > 2.0) return false;
      if (selectedDistance === 'within-3' && worker.distanceKm > 3.0) return false;

      // Availability filter
      if (selectedAvailability === 'now' && !worker.availableNow) return false;

      // URL search query filter
      if (searchQuery) {
        const matches =
          (worker.fullName && worker.fullName.toLowerCase().includes(searchQuery)) ||
          (worker.profession && worker.profession.toLowerCase().includes(searchQuery)) ||
          (worker.category && worker.category.toLowerCase().includes(searchQuery)) ||
          (worker.serviceId && worker.serviceId.toLowerCase().includes(searchQuery)) ||
          (worker.cooperative && worker.cooperative.toLowerCase().includes(searchQuery));

        if (!matches) return false;
      }

      return true;
    });
  }, [rawWorkers, selectedCategory, selectedPrice, selectedRating, selectedDistance, selectedAvailability, searchQuery]);

  const handleWorkerClick = (workerId) => {
    setSelectedWorkerId(workerId);
    navigate(`/worker/${workerId}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#17233A] relative pb-20 md:pb-12 font-sans">
      <CustomerHeader />

      <main className="w-[95%] max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-4 sm:space-y-5">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs font-medium text-[#6B7280]">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li>
              <Link to="/" className="hover:text-[#17233A] transition-colors">Home</Link>
            </li>
            <li>
              <FontAwesomeIcon icon={faChevronRight} className="w-2 h-2 text-[#A66666]" />
            </li>
            {isGlobalFindWorkers ? (
              <li className="text-[#17233A] font-bold">
                Find Workers
              </li>
            ) : (
              <>
                <li>
                  <Link to="/services" className="hover:text-[#17233A] transition-colors">Services Catalog</Link>
                </li>
                <li>
                  <FontAwesomeIcon icon={faChevronRight} className="w-2 h-2 text-[#A66666]" />
                </li>
                <li>
                  <Link to={`/services/${currentServiceId}`} className="hover:text-[#17233A] transition-colors">
                    {service.name}
                  </Link>
                </li>
                <li>
                  <FontAwesomeIcon icon={faChevronRight} className="w-2 h-2 text-[#A66666]" />
                </li>
                <li className="text-[#17233A] font-bold">
                  Available Workers
                </li>
              </>
            )}
          </ol>
        </nav>

        {/* Title */}
        <div className="space-y-1.5 pb-2.5 border-b border-[#E8E2D8]">
          <div className="flex items-center justify-between flex-wrap gap-2.5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-[#17233A] tracking-tight">
              {isGlobalFindWorkers ? 'Find Verified Workers' : `${service.name} Workers`}
            </h1>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A66666] bg-[#FCFBF8] px-3.5 py-1 rounded-full border border-[#E8E2D8]">
              <FontAwesomeIcon icon={faShieldHalved} className="w-3.5 h-3.5" />
              <span>Verified Cooperative Guild Members ({filteredWorkers.length})</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed max-w-3xl">
            {isGlobalFindWorkers
              ? 'Browse verified, police-cleared cooperative workers across all registered trades in your regional cluster.'
              : 'Choose from top rated local artisans backed by regional cooperative guilds.'}
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-2.5">
          {/* Trade / Category Selector when in Global Find Workers */}
          {isGlobalFindWorkers && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[#6B7280] font-semibold text-[11px] uppercase mr-1">Trade:</span>
              {[
                { id: 'all', label: 'All Trades' },
                { id: 'electrical', label: 'Electricians' },
                { id: 'plumbing', label: 'Plumbers' },
                { id: 'carpentry', label: 'Carpenters' },
                { id: 'painting', label: 'Painters' },
                { id: 'cleaning', label: 'Cleaning' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                    selectedCategory === tab.id
                      ? 'bg-[#17233A] text-white border-[#17233A]'
                      : 'bg-[#FCFBF8] text-[#6B7280] border-[#E8E2D8] hover:border-[#17233A] hover:text-[#17233A]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-2 lg:flex lg:flex-row lg:items-center gap-2.5 text-xs font-semibold">
            <div className="flex items-center gap-2 text-xs font-bold text-[#17233A] mr-1">
              <FontAwesomeIcon icon={faFilter} className="w-3.5 h-3.5 text-[#A66666]" />
              <span>Filter:</span>
            </div>

            {/* Price Filter */}
            <div className="flex items-center gap-1 bg-[#FCFBF8] border border-[#E8E2D8] p-1 rounded-full shrink-0">
              <span className="text-[#6B7280] text-[11px] pl-2 pr-1 font-medium">Price:</span>
              {[
                { id: 'all', label: 'All' },
                { id: 'under-450', label: '<₹450' },
                { id: '450-500', label: '₹450-500' },
                { id: 'above-500', label: '₹500+' }
              ].map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setSelectedPrice(chip.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] transition-all cursor-pointer ${
                    selectedPrice === chip.id
                      ? 'bg-[#A66666] text-white font-bold'
                      : 'text-[#17233A] hover:bg-[#F8F6F2]'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Rating Filter */}
            <div className="flex items-center gap-1 bg-[#FCFBF8] border border-[#E8E2D8] p-1 rounded-full shrink-0">
              <span className="text-[#6B7280] text-[11px] pl-2 pr-1 font-medium">Rating:</span>
              {[
                { id: 'all', label: 'All' },
                { id: '4.8-plus', label: '★ 4.8+' },
                { id: '4.9-plus', label: '★ 4.9+' }
              ].map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setSelectedRating(chip.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] transition-all cursor-pointer ${
                    selectedRating === chip.id
                      ? 'bg-[#A66666] text-white font-bold'
                      : 'text-[#17233A] hover:bg-[#F8F6F2]'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Worker Cards Grid */}
        {filteredWorkers.length === 0 ? (
          <div className="text-center py-16 bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-6 space-y-3">
            <FontAwesomeIcon icon={faShieldHalved} className="w-10 h-10 text-[#BAC7D5] mx-auto" />
            <h3 className="text-base font-bold text-[#17233A]">No cooperative workers found</h3>
            <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
              Try adjusting your category or price filters to see active workers in your cluster.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedPrice('all');
                setSelectedRating('all');
              }}
              className="px-4 py-2 bg-[#A66666] text-white rounded-xl text-xs font-bold hover:bg-[#8F5555] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorkers.map((worker) => (
              <div
                key={worker.id}
                onClick={() => handleWorkerClick(worker.id)}
                className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-4 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-[#E8E2D8] bg-[#E8E2D8]">
                      <img
                        src={worker.avatarUrl}
                        alt={worker.fullName}
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_AVATAR;
                        }}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 right-0 bg-[#A66666] text-white p-0.5 rounded-tl-md">
                        <FontAwesomeIcon icon={faCircleCheck} className="w-2.5 h-2.5" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold font-display text-[#17233A] truncate leading-tight group-hover:text-[#A66666] transition-colors">
                        {worker.fullName}
                      </h3>
                      <p className="text-xs text-[#6B7280] font-medium truncate">
                        {worker.profession}
                      </p>

                      <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold">
                        <span className="inline-flex items-center gap-1 font-bold text-[#A66666]">
                          <FontAwesomeIcon icon={faStar} className="w-3 h-3 text-[#A66666]" />
                          <span>{Number(worker.rating || 4.9).toFixed(1)}</span>
                        </span>
                        <span className="text-[#6B7280]">•</span>
                        <span className="text-[#6B7280]">{worker.jobsCompleted} Jobs</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] font-medium text-[#6B7280] bg-[#F8F6F2] rounded-xl px-3 py-1.5 border border-[#E8E2D8] flex items-center justify-between">
                    <span>Trust <strong className="text-[#17233A]">{worker.trustScore}%</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faLocationDot} className="w-2.5 h-2.5 text-[#A66666]" />
                      {worker.distanceKm} km
                    </span>
                    <span>•</span>
                    <span className="text-[#A66666] font-bold">Available Now</span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-[#E8E2D8] flex items-center justify-between">
                  <div>
                    <span className="text-sm font-extrabold font-display text-[#17233A] block">₹{worker.basePrice}</span>
                    <span className="text-[10px] text-[#6B7280] block font-medium truncate max-w-[120px]">
                      {worker.cooperative}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-[#A66666] text-white font-bold text-xs flex items-center gap-1.5 group-hover:bg-[#8F5555] transition-all"
                  >
                    <span>View Profile</span>
                    <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      <BottomNavigation activeTab="services" />
    </div>
  );
}
