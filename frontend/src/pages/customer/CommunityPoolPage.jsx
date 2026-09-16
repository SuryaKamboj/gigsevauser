import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faScrewdriverWrench,
  faUsers,
  faBolt,
  faClock,
  faLocationDot,
  faShieldHalved,
  faPlus,
  faTrash,
  faCheck,
  faStar,
  faArrowRight,
  faRotateRight,
  faBuilding,
  faWrench,
  faHouse,
  faStore,
  faCalendarCheck,
  faTriangleExclamation,
  faCircleCheck,
  faClipboardList,
  faHammer,
  faPaintbrush,
  faWandMagicSparkles,
  faSnowflake,
  faSearch,
  faFilter,
  faInfoCircle,
  faEye,
  faXmark,
  faSliders,
  faUserGear,
  faCheckDouble
} from '@fortawesome/free-solid-svg-icons';
import CustomerHeader from '../../components/customer/CustomerHeader';
import BottomNavigation from '../../components/customer/BottomNavigation';
import { WORKERS_DATA } from '../../data/workersData';
import { SERVICES_DATA } from '../../data/servicesData';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';

const AVAILABILITY_DATA = [
  { id: 'el', trade: 'Electricians', faIcon: faBolt, available: 14, guild: 'Lajpat Nagar Guild' },
  { id: 'pl', trade: 'Plumbers', faIcon: faWrench, available: 9, guild: 'South Delhi Crafts Guild' },
  { id: 'cp', trade: 'Carpenters', faIcon: faHammer, available: 7, guild: 'Okhla Woodworkers Co-op' },
  { id: 'pt', trade: 'Painters', faIcon: faPaintbrush, available: 12, guild: 'East Delhi Painters Guild' },
  { id: 'cl', trade: 'Cleaners', faIcon: faWandMagicSparkles, available: 18, guild: 'Delhi Women Co-op Society' },
  { id: 'ac', trade: 'AC Technicians', faIcon: faSnowflake, available: 11, guild: 'West Delhi Climate Guild' }
];

const USE_CASES = [
  {
    icon: faBuilding,
    title: 'Society Maintenance',
    description: 'Monthly electrical, plumbing, and structural audits for residential complexes.'
  },
  {
    icon: faWrench,
    title: 'Building Repairs',
    description: 'Concurrent multi-artisan repairs for water leakage, masonry overhaul, and rewiring.'
  },
  {
    icon: faHouse,
    title: 'Home Renovation',
    description: 'Full multi-trade teams for kitchen, bathroom, or entire apartment remodeling.'
  },
  {
    icon: faStore,
    title: 'Commercial Projects',
    description: 'Rapid workspace, retail store, and restaurant setup with guild-certified experts.'
  },
  {
    icon: faCalendarCheck,
    title: 'Event Setup',
    description: 'Express lighting, sound wiring, staging, and temporary plumbing for community events.'
  },
  {
    icon: faTriangleExclamation,
    title: 'Emergency Response',
    description: 'Sub-15 min express dispatch for storm damage, severe flooding, or power failure.'
  }
];

export default function CommunityPoolPage() {
  const navigate = useNavigate();
  const { setActiveBooking } = useBooking();
  const { requireAuth } = useAuth();

  // Mode: 'single' | 'multi'
  const [requestMode, setRequestMode] = useState('multi');
  const [isEmergency, setIsEmergency] = useState(false);

  // Worker Selection Mode: 'ai' | 'manual'
  const [selectionMode, setSelectionMode] = useState('ai');

  // Single Trade Form State
  const [singleTrade, setSingleTrade] = useState({
    serviceId: 'electrical',
    workerCount: 2,
    date: new Date().toISOString().split('T')[0],
    timeSlot: '10:00 AM - 12:00 PM',
    location: 'B-42 Lajpat Nagar II, New Delhi',
    instructions: 'Need two electricians for complete commercial switchboard overhaul.'
  });

  // Multi Trade Form State (Dynamic Builder)
  const [multiRequirements, setMultiRequirements] = useState([
    { id: 1, serviceId: 'electrical', title: 'Electrician', count: 2 },
    { id: 2, serviceId: 'plumbing', title: 'Plumber', count: 1 },
    { id: 3, serviceId: 'carpentry', title: 'Carpenter', count: 3 },
    { id: 4, serviceId: 'painting', title: 'Painter', count: 1 }
  ]);

  const [multiDetails, setMultiDetails] = useState({
    date: new Date().toISOString().split('T')[0],
    timeSlot: '09:30 AM - 01:30 PM',
    location: 'B-42 Lajpat Nagar II, New Delhi',
    instructions: 'Renovation phase 1: Wiring, pipe laying, framework & initial priming.'
  });

  // AI Matching & Selection State
  const [isMatched, setIsMatched] = useState(false);
  const [matchedTeam, setMatchedTeam] = useState([]);
  const [selectedWorkerIds, setSelectedWorkerIds] = useState([]);
  const [confirmedPoolOrder, setConfirmedPoolOrder] = useState(null);

  // Manual Mode Search, Filter & Profile Modal State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterService, setFilterService] = useState('all');
  const [sortBy, setSortBy] = useState('trustScore');
  const [viewingWorker, setViewingWorker] = useState(null);

  // Add Dynamic Requirement Row
  const handleAddRequirement = () => {
    const newId = Date.now();
    setMultiRequirements((prev) => [
      ...prev,
      { id: newId, serviceId: 'cleaning', title: 'Cleaner', count: 2 }
    ]);
  };

  // Remove Requirement Row
  const handleRemoveRequirement = (id) => {
    if (multiRequirements.length <= 1) return;
    setMultiRequirements((prev) => prev.filter((item) => item.id !== id));
  };

  // Update Requirement Row
  const handleUpdateRequirement = (id, field, value) => {
    setMultiRequirements((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (field === 'serviceId') {
            const sObj = SERVICES_DATA[value];
            return { ...item, serviceId: value, title: sObj ? sObj.title : value };
          }
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  // Run AI Matching Simulation
  const handleRunAiMatching = (e) => {
    e.preventDefault();

    let poolTeam = [];

    if (requestMode === 'single') {
      const availableForService = WORKERS_DATA.filter(
        (w) => w.serviceId === singleTrade.serviceId
      );
      const pool = availableForService.length >= singleTrade.workerCount
        ? availableForService.slice(0, singleTrade.workerCount)
        : WORKERS_DATA.slice(0, singleTrade.workerCount);

      poolTeam = pool.map((w, idx) => ({
        ...w,
        etaMinutes: isEmergency ? 10 + idx * 2 : 15 + idx * 3,
        roleBadge: w.profession || 'Specialist',
        poolItemId: `${w.id}-${idx}`
      }));
    } else {
      multiRequirements.forEach((req) => {
        const workers = WORKERS_DATA.filter((w) => w.serviceId === req.serviceId);
        for (let i = 0; i < req.count; i++) {
          const workerObj = workers[i % workers.length] || WORKERS_DATA[i % WORKERS_DATA.length];
          poolTeam.push({
            ...workerObj,
            poolItemId: `${req.serviceId}-${i}-${Date.now() + i}`,
            roleBadge: req.title,
            etaMinutes: isEmergency ? 9 + (poolTeam.length * 2) : 14 + (poolTeam.length * 3)
          });
        }
      });
    }

    setMatchedTeam(poolTeam);
    setSelectedWorkerIds(poolTeam.map((w) => w.poolItemId || w.id));
    setIsMatched(true);

    setTimeout(() => {
      const resultsEl = document.getElementById('ai-team-results');
      if (resultsEl) resultsEl.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Toggle worker selection (for both AI and Manual modes)
  const toggleSelectWorker = (id) => {
    setSelectedWorkerIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Add Manual Worker to Team
  const handleAddManualWorker = (worker) => {
    const itemKey = `manual-${worker.id}-${Date.now()}`;
    const newEntry = {
      ...worker,
      poolItemId: itemKey,
      roleBadge: worker.profession || 'Artisan',
      etaMinutes: isEmergency ? 11 : 16
    };
    setMatchedTeam((prev) => [...prev, newEntry]);
    setSelectedWorkerIds((prev) => [...prev, itemKey]);
    setIsMatched(true);
  };

  // Select Entire Team
  const handleSelectEntireTeam = () => {
    setSelectedWorkerIds(matchedTeam.map((w) => w.poolItemId || w.id));
  };

  // Filter & Sort Manual Workers List
  const filteredManualWorkers = WORKERS_DATA.filter((worker) => {
    const matchesSearch =
      worker.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.cooperative.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (worker.skills && worker.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesService =
      filterService === 'all' || worker.serviceId === filterService;

    return matchesSearch && matchesService;
  }).sort((a, b) => {
    if (sortBy === 'trustScore') return b.trustScore - a.trustScore;
    if (sortBy === 'rating') return parseFloat(b.rating) - parseFloat(a.rating);
    if (sortBy === 'eta') return (a.distanceKm || 1) - (b.distanceKm || 1);
    if (sortBy === 'price') return (a.basePrice || 400) - (b.basePrice || 400);
    return 0;
  });

  // Calculate Requirement Fulfillment Stats
  const selectedWorkersList = matchedTeam.filter((w) =>
    selectedWorkerIds.includes(w.poolItemId || w.id)
  );

  const getRequirementFulfillment = () => {
    if (requestMode === 'single') {
      const sObj = SERVICES_DATA[singleTrade.serviceId] || { title: singleTrade.serviceId };
      const count = selectedWorkersList.filter((w) => w.serviceId === singleTrade.serviceId).length;
      return [
        {
          label: sObj.title || 'Selected Trade',
          needed: singleTrade.workerCount,
          selected: count,
          isSatisfied: count >= singleTrade.workerCount
        }
      ];
    }

    return multiRequirements.map((req) => {
      const count = selectedWorkersList.filter((w) => w.serviceId === req.serviceId).length;
      return {
        label: req.title,
        needed: req.count,
        selected: count,
        isSatisfied: count >= req.count
      };
    });
  };

  const requirementFulfillments = getRequirementFulfillment();
  const allRequirementsSatisfied = requirementFulfillments.every((f) => f.isSatisfied);

  // Confirm & Create Pool Order
  const handleCreatePoolOrder = () => {
    requireAuth(() => {
      const selectedWorkers = selectedWorkersList;

      const orderId = `POOL-${Math.floor(1000 + Math.random() * 9000)}`;
      const newPoolOrder = {
        orderId,
        status: 'Dispatched & En Route',
        isEmergency,
        workerCount: selectedWorkers.length,
        workers: selectedWorkers,
        date: requestMode === 'single' ? singleTrade.date : multiDetails.date,
        timeSlot: requestMode === 'single' ? singleTrade.timeSlot : multiDetails.timeSlot,
        location: requestMode === 'single' ? singleTrade.location : multiDetails.location,
        totalAmount: selectedWorkers.reduce((acc, w) => acc + (w.basePrice || 450), 0) * 0.9,
        createdAt: new Date().toLocaleTimeString()
      };

      // Set active booking in global context
      setActiveBooking({
        bookingId: orderId,
        status: isEmergency ? 'Express En Route' : 'Accepted',
        etaMinutes: isEmergency ? 12 : 18,
        worker: selectedWorkers[0] || WORKERS_DATA[0],
        service: {
          title: `Community Resource Pool (${selectedWorkers.length} Artisans)`,
          iconEmoji: '🏘️',
          basePrice: newPoolOrder.totalAmount
        },
        address: newPoolOrder.location,
        bookingDate: newPoolOrder.date
      });

      setConfirmedPoolOrder(newPoolOrder);

      setTimeout(() => {
        const confirmedEl = document.getElementById('pool-order-confirmed');
        if (confirmedEl) confirmedEl.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#17233A] relative pb-20 md:pb-12 font-sans">
      <CustomerHeader />

      <main className="w-[95%] max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-10">

        {/* BREADCRUMB */}
        <nav aria-label="Breadcrumb" className="text-xs font-medium text-[#6B7280]">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li><Link to="/" className="hover:text-[#17233A]">Home</Link></li>
            <li><FontAwesomeIcon icon={faChevronRight} className="w-2 h-2 text-[#A66666]" /></li>
            <li className="text-[#17233A] font-bold">Community Resource Pool</li>
          </ol>
        </nav>

        {/* HERO SECTION */}
        <section className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[28px] p-6 sm:p-10 shadow-xs relative overflow-hidden space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F8E7E7] border border-[#E8CECE] text-xs font-bold text-[#A66666] uppercase tracking-wider">
                <FontAwesomeIcon icon={faUsers} className="w-3.5 h-3.5" />
                <span>Flagship Cooperative Capability</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black font-display text-[#17233A] tracking-tight leading-tight">
                Community Resource Pool
              </h1>

              <p className="text-xs sm:text-base text-[#4B5563] leading-relaxed font-normal">
                Request multiple verified cooperative workers from one place for projects, maintenance, emergencies and large jobs.
              </p>
            </div>

            {/* Quick Stat Pill Ribbon */}
            <div className="flex flex-wrap sm:flex-col gap-2 shrink-0 w-full lg:w-auto">
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-xs font-bold text-[#17233A]">
                <span className="w-2 h-2 rounded-full bg-[#4E8A57] animate-pulse" />
                <span>380+ Local Artisans Available</span>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-xs font-bold text-[#17233A]">
                <FontAwesomeIcon icon={faShieldHalved} className="text-[#A66666]" />
                <span>Zero Middleman Commission</span>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE AVAILABILITY PANEL */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-[#17233A]">
                Live Neighborhood Availability Panel
              </h2>
              <p className="text-xs text-[#6B7280]">
                Real-time active cooperative artisans ready for single or multi-trade pool dispatch
              </p>
            </div>
            <span className="text-[10px] font-bold text-[#4E8A57] bg-[#E8F3EC] px-2.5 py-1 rounded-full border border-[#C9E2D2] hidden sm:inline-block">
              Updated Live
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {AVAILABILITY_DATA.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#E8E2D8] rounded-2xl p-4 space-y-3 shadow-2xs hover:shadow-md hover:border-[#17233A]/30 hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-[#17233A] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <FontAwesomeIcon icon={item.faIcon} className="w-3.5 h-3.5 text-[#17233A]" />
                  </div>
                  <span className="text-[10px] font-bold text-[#17233A] bg-[#F8F6F2] border border-[#E8E2D8] px-2 py-0.5 rounded-full">
                    {item.available} Available
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#17233A] truncate">{item.trade}</h3>
                  <p className="text-[10px] text-[#6B7280] truncate font-medium">{item.guild}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* REQUEST MODE & FORM SECTION */}
        <section className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[28px] p-5 sm:p-8 space-y-8 shadow-xs">
          
          {/* Top Controls: Mode Switch & Emergency Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D8] pb-6">
            
            {/* Request Mode Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#17233A] uppercase tracking-wider">
                Select Request Mode
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRequestMode('single')}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    requestMode === 'single'
                      ? 'bg-[#17233A] text-white border-[#17233A] shadow-xs'
                      : 'bg-[#F8F6F2] text-[#6B7280] border-[#E8E2D8] hover:text-[#17233A]'
                  }`}
                >
                  <span>○ Single Trade Request</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRequestMode('multi')}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    requestMode === 'multi'
                      ? 'bg-[#17233A] text-white border-[#17233A] shadow-xs'
                      : 'bg-[#F8F6F2] text-[#6B7280] border-[#E8E2D8] hover:text-[#17233A]'
                  }`}
                >
                  <span>● Multi Trade Team Request</span>
                </button>
              </div>
            </div>

            {/* Emergency Mode Toggle */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#17233A] uppercase tracking-wider">
                Priority Mode
              </label>
              <button
                type="button"
                onClick={() => setIsEmergency(!isEmergency)}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isEmergency
                    ? 'bg-[#F8E7E7] text-[#A66666] border-[#E8CECE] shadow-xs'
                    : 'bg-[#F8F6F2] text-[#4B5563] border-[#E8E2D8] hover:bg-[#E8E2D8]/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faBolt} className={isEmergency ? 'text-[#A66666] animate-pulse' : 'text-[#6B7280]'} />
                  <span>⚡ Emergency Dispatch Mode</span>
                </div>
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                  isEmergency ? 'bg-[#A66666] text-white border-[#A66666]' : 'border-[#6B7280]'
                }`}>
                  {isEmergency ? '✓' : ''}
                </span>
              </button>
            </div>
          </div>

          {/* Emergency Alert Banner if Enabled */}
          {isEmergency && (
            <div className="bg-[#F8E7E7] border border-[#E8CECE] rounded-2xl p-4 flex items-center gap-3 text-xs text-[#A66666] font-medium">
              <FontAwesomeIcon icon={faTriangleExclamation} className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-bold text-[#17233A]">Emergency Mode Active (Target Arrival &lt; 15 Mins)</p>
                <p className="text-[#6B7280]">AI matching will prioritize nearest active artisans with express dispatch protocols.</p>
              </div>
            </div>
          )}

          {/* FORM: SINGLE TRADE MODE */}
          {requestMode === 'single' && (
            <form onSubmit={handleRunAiMatching} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                
                {/* Service Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#17233A]">Service Type</label>
                  <select
                    value={singleTrade.serviceId}
                    onChange={(e) => setSingleTrade({ ...singleTrade, serviceId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-xs font-bold text-[#17233A] focus:outline-none focus:border-[#A66666]"
                  >
                    <option value="electrical">Electrical Repair & Wiring</option>
                    <option value="plumbing">Plumbing & Water Systems</option>
                    <option value="carpentry">Carpentry & Woodwork</option>
                    <option value="painting">Painting & Priming</option>
                    <option value="cleaning">Deep Cleaning & Sanitation</option>
                    <option value="ac">AC Servicing & HVAC</option>
                  </select>
                </div>

                {/* Workers Needed Counter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#17233A]">Workers Needed</label>
                  <div className="flex items-center bg-[#F8F6F2] border border-[#E8E2D8] rounded-xl p-1 justify-between">
                    <button
                      type="button"
                      onClick={() => setSingleTrade({ ...singleTrade, workerCount: Math.max(1, singleTrade.workerCount - 1) })}
                      className="w-8 h-8 rounded-lg bg-white border border-[#E8E2D8] text-xs font-bold text-[#17233A] hover:bg-[#E8E2D8]"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-[#17233A]">
                      {singleTrade.workerCount} Workers
                    </span>
                    <button
                      type="button"
                      onClick={() => setSingleTrade({ ...singleTrade, workerCount: Math.min(10, singleTrade.workerCount + 1) })}
                      className="w-8 h-8 rounded-lg bg-white border border-[#E8E2D8] text-xs font-bold text-[#17233A] hover:bg-[#E8E2D8]"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Target Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#17233A]">Date</label>
                  <input
                    type="date"
                    value={singleTrade.date}
                    onChange={(e) => setSingleTrade({ ...singleTrade, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-xs font-bold text-[#17233A] focus:outline-none focus:border-[#A66666]"
                  />
                </div>

                {/* Time Slot */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#17233A]">Time Slot</label>
                  <select
                    value={singleTrade.timeSlot}
                    onChange={(e) => setSingleTrade({ ...singleTrade, timeSlot: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-xs font-bold text-[#17233A] focus:outline-none focus:border-[#A66666]"
                  >
                    <option value="Immediate Express (Sub-15 min)">Immediate Express (Sub-15 min)</option>
                    <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                    <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                    <option value="05:00 PM - 07:00 PM">05:00 PM - 07:00 PM</option>
                  </select>
                </div>

                {/* Location */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-[#17233A]">Service Address</label>
                  <input
                    type="text"
                    value={singleTrade.location}
                    onChange={(e) => setSingleTrade({ ...singleTrade, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-xs font-bold text-[#17233A] focus:outline-none focus:border-[#A66666]"
                    placeholder="Enter project / service address"
                  />
                </div>
              </div>

              {/* Special Instructions */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#17233A]">Special Instructions / Scope</label>
                <textarea
                  rows="2"
                  value={singleTrade.instructions}
                  onChange={(e) => setSingleTrade({ ...singleTrade, instructions: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-xs text-[#17233A] focus:outline-none focus:border-[#A66666]"
                  placeholder="Describe your job scope..."
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-[#A66666] hover:bg-[#8F5555] text-white font-bold font-display text-sm active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <FontAwesomeIcon icon={faWandMagicSparkles} className="w-4 h-4" />
                <span>Find & AI-Match Cooperative Team ({singleTrade.workerCount} Workers)</span>
                <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* FORM: MULTI TRADE TEAM BUILDER */}
          {requestMode === 'multi' && (
            <form onSubmit={handleRunAiMatching} className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#17233A] uppercase tracking-wider">
                    Dynamic Requirement Builder
                  </label>
                  <span className="text-xs text-[#6B7280]">
                    Combine multiple trades into one coordinated dispatch
                  </span>
                </div>

                {/* Requirements List */}
                <div className="space-y-3">
                  {multiRequirements.map((req, idx) => (
                    <div
                      key={req.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#F8F6F2] border border-[#E8E2D8]"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-[#17233A]">
                        <span className="w-6 h-6 rounded-lg bg-white border border-[#E8E2D8] flex items-center justify-center text-[10px] text-[#A66666]">
                          #{idx + 1}
                        </span>
                        <select
                          value={req.serviceId}
                          onChange={(e) => handleUpdateRequirement(req.id, 'serviceId', e.target.value)}
                          className="px-3 py-1.5 rounded-xl bg-white border border-[#E8E2D8] text-xs font-bold text-[#17233A] focus:outline-none"
                        >
                          <option value="electrical">Electrician</option>
                          <option value="plumbing">Plumber</option>
                          <option value="carpentry">Carpenter</option>
                          <option value="painting">Painter</option>
                          <option value="cleaning">Cleaner</option>
                          <option value="ac">AC Technician</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#6B7280] font-medium">Quantity:</span>
                          <div className="flex items-center bg-white border border-[#E8E2D8] rounded-xl p-0.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateRequirement(req.id, 'count', Math.max(1, req.count - 1))}
                              className="w-7 h-7 rounded-lg bg-[#F8F6F2] text-xs font-bold text-[#17233A]"
                            >
                              -
                            </button>
                            <span className="px-3 text-xs font-bold text-[#17233A]">{req.count}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateRequirement(req.id, 'count', Math.min(10, req.count + 1))}
                              className="w-7 h-7 rounded-lg bg-[#F8F6F2] text-xs font-bold text-[#17233A]"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveRequirement(req.id)}
                          className="w-8 h-8 rounded-xl bg-white border border-[#E8E2D8] text-[#A66666] hover:bg-[#F8E7E7] flex items-center justify-center transition-all cursor-pointer shrink-0"
                          title="Remove requirement"
                        >
                          <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Requirement Button */}
                <button
                  type="button"
                  onClick={handleAddRequirement}
                  className="w-full py-2.5 rounded-xl bg-[#F8F6F2] hover:bg-[#E8E2D8]/50 border border-dashed border-[#A66666] text-[#A66666] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                  <span>Add Trade Requirement</span>
                </button>
              </div>

              {/* Date, Time & Address Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#17233A]">Date</label>
                  <input
                    type="date"
                    value={multiDetails.date}
                    onChange={(e) => setMultiDetails({ ...multiDetails, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-xs font-bold text-[#17233A] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#17233A]">Time Slot</label>
                  <select
                    value={multiDetails.timeSlot}
                    onChange={(e) => setMultiDetails({ ...multiDetails, timeSlot: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-xs font-bold text-[#17233A] focus:outline-none"
                  >
                    <option value="Immediate Express (Sub-15 min)">Immediate Express (Sub-15 min)</option>
                    <option value="09:30 AM - 01:30 PM">09:30 AM - 01:30 PM</option>
                    <option value="02:00 PM - 06:00 PM">02:00 PM - 06:00 PM</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#17233A]">Service Address</label>
                  <input
                    type="text"
                    value={multiDetails.location}
                    onChange={(e) => setMultiDetails({ ...multiDetails, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-xs font-bold text-[#17233A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-[#A66666] hover:bg-[#8F5555] text-white font-bold font-display text-sm active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <FontAwesomeIcon icon={faWandMagicSparkles} className="w-4 h-4" />
                <span>Find & AI-Match Cooperative Team ({multiRequirements.reduce((acc, r) => acc + r.count, 0)} Total Artisans)</span>
                <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
              </button>
            </form>
          )}
        </section>

        {/* WORKER SELECTION MODE TABS & RESULTS SECTION */}
        {isMatched && (
          <section id="ai-team-results" className="space-y-6 pt-4">
            
            {/* WORKER SELECTION MODE SEGMENTED CONTROL TABS */}
            <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-2 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-1.5 w-full sm:w-auto bg-[#F8F6F2] p-1 rounded-2xl border border-[#E8E2D8]">
                <button
                  type="button"
                  onClick={() => setSelectionMode('ai')}
                  className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    selectionMode === 'ai'
                      ? 'bg-[#17233A] text-white shadow-xs'
                      : 'text-[#6B7280] hover:text-[#17233A]'
                  }`}
                >
                  <FontAwesomeIcon icon={faWandMagicSparkles} className="w-3.5 h-3.5 text-[#A66666]" />
                  <span>AI Recommended Team</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectionMode('manual')}
                  className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    selectionMode === 'manual'
                      ? 'bg-[#17233A] text-white shadow-xs'
                      : 'text-[#6B7280] hover:text-[#17233A]'
                  }`}
                >
                  <FontAwesomeIcon icon={faUserGear} className="w-3.5 h-3.5 text-[#A66666]" />
                  <span>Build My Own Team</span>
                </button>
              </div>

              {/* Requirement Satisfaction Indicator Pills */}
              <div className="flex flex-wrap items-center gap-1.5 px-3 py-1 text-xs">
                {requirementFulfillments.map((req, idx) => (
                  <span
                    key={idx}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                      req.isSatisfied
                        ? 'bg-[#E8F3EC] text-[#4E8A57] border-[#C9E2D2]'
                        : 'bg-[#F8E7E7] text-[#A66666] border-[#E8CECE]'
                    }`}
                  >
                    <span>{req.label}:</span>
                    <span>{req.selected}/{req.needed}</span>
                    {req.isSatisfied && <FontAwesomeIcon icon={faCheck} className="w-2.5 h-2.5" />}
                  </span>
                ))}
              </div>
            </div>

            {/* TAB 1: AI RECOMMENDED TEAM MODE */}
            {selectionMode === 'ai' && (
              <div className="space-y-6">
                
                {/* "WHY AI SELECTED THIS TEAM" TRANSPARENCY PANEL */}
                <div className="bg-white border border-[#E8E2D8] rounded-[24px] p-5 space-y-3 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#17233A]">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-[#A66666] w-4 h-4" />
                    <span>Why AI Selected This Team</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-[#374151]">
                    <div className="flex items-center gap-2 bg-[#F8F6F2] p-2.5 rounded-xl border border-[#E8E2D8]">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#4E8A57] w-3.5 h-3.5 shrink-0" />
                      <span className="font-medium">Highest Trust Scores (avg 96.8)</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#F8F6F2] p-2.5 rounded-xl border border-[#E8E2D8]">
                      <FontAwesomeIcon icon={faClock} className="text-[#A66666] w-3.5 h-3.5 shrink-0" />
                      <span className="font-medium">Sub-15 Min Express Arrival</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#F8F6F2] p-2.5 rounded-xl border border-[#E8E2D8]">
                      <FontAwesomeIcon icon={faShieldHalved} className="text-[#17233A] w-3.5 h-3.5 shrink-0" />
                      <span className="font-medium">Same Guild Coordination</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#F8F6F2] p-2.5 rounded-xl border border-[#E8E2D8]">
                      <FontAwesomeIcon icon={faStar} className="text-amber-500 w-3.5 h-3.5 shrink-0" />
                      <span className="font-medium">Optimal Rating-to-Cost Ratio</span>
                    </div>
                  </div>
                </div>

                {/* AI Team Header */}
                <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E8F3EC] border border-[#C9E2D2] text-[10px] font-bold text-[#4E8A57] uppercase tracking-wider mb-1">
                      <span>98.4% Match Accuracy</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black font-display text-[#17233A]">
                      Recommended Cooperative Team
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={handleSelectEntireTeam}
                    className="px-4 py-2 rounded-xl bg-[#F8F6F2] hover:bg-[#E8E2D8] border border-[#E8E2D8] text-xs font-bold text-[#17233A] transition-all cursor-pointer"
                  >
                    Select Entire Team ({matchedTeam.length})
                  </button>
                </div>

                {/* Matched Workers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {matchedTeam.map((worker) => {
                    const itemKey = worker.poolItemId || worker.id;
                    const isSelected = selectedWorkerIds.includes(itemKey);

                    return (
                      <div
                        key={itemKey}
                        className={`bg-[#FCFBF8] border rounded-[24px] p-5 space-y-4 shadow-2xs transition-all relative ${
                          isSelected ? 'border-2 border-[#A66666]' : 'border-[#E8E2D8]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={worker.avatarUrl}
                              alt={worker.fullName}
                              className="w-12 h-12 rounded-full object-cover border border-[#E8E2D8] shadow-2xs shrink-0"
                            />
                            <div>
                              <span className="text-[10px] font-bold text-[#A66666] bg-[#F8E7E7] px-2 py-0.5 rounded-full border border-[#E8CECE]">
                                {worker.roleBadge || worker.profession}
                              </span>
                              <h3 className="text-sm font-bold text-[#17233A] mt-1 leading-tight">{worker.fullName}</h3>
                              <p className="text-[10px] text-[#6B7280]">{worker.cooperative}</p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setViewingWorker(worker)}
                            className="w-8 h-8 rounded-xl bg-[#F8F6F2] hover:bg-[#E8E2D8] text-[#17233A] flex items-center justify-center transition-all cursor-pointer border border-[#E8E2D8]"
                            title="View Worker Profile"
                          >
                            <FontAwesomeIcon icon={faEye} className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-center text-xs">
                          <div>
                            <p className="text-[9px] text-[#6B7280] font-bold uppercase">Trust Score</p>
                            <p className="font-extrabold text-[#17233A]">{worker.trustScore}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-[#6B7280] font-bold uppercase">ETA</p>
                            <p className="font-extrabold text-[#4E8A57]">{worker.etaMinutes} mins</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-[#6B7280] font-bold uppercase">Rating</p>
                            <p className="font-extrabold text-[#17233A]">★ {worker.rating}</p>
                          </div>
                        </div>

                        {/* Footer Select Toggle */}
                        <div className="flex items-center justify-between pt-2 border-t border-[#E8E2D8]">
                          <span className="text-xs font-bold text-[#17233A]">
                            ₹{worker.basePrice || 450} <span className="text-[10px] font-normal text-[#6B7280]">/job</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => toggleSelectWorker(itemKey)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#A66666] text-white border border-[#A66666]'
                                : 'bg-[#F8F6F2] text-[#17233A] border border-[#E8E2D8] hover:bg-[#E8E2D8]'
                            }`}
                          >
                            {isSelected ? '✓ Selected' : 'Select Worker'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: BUILD MY OWN TEAM MODE */}
            {selectionMode === 'manual' && (
              <div className="space-y-6">
                
                {/* Search & Filter Toolbar */}
                <div className="bg-white border border-[#E8E2D8] rounded-[24px] p-4 space-y-4 shadow-2xs">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    
                    {/* Search Input */}
                    <div className="relative flex-1 w-full">
                      <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-3 text-[#6B7280] w-3.5 h-3.5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search artisan by name, skill, or guild..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-xs text-[#17233A] font-medium focus:outline-none focus:border-[#A66666]"
                      />
                    </div>

                    {/* Filter By Service */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <select
                        value={filterService}
                        onChange={(e) => setFilterService(e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-xs font-bold text-[#17233A] focus:outline-none"
                      >
                        <option value="all">All Services</option>
                        <option value="electrical">Electrical</option>
                        <option value="plumbing">Plumbing</option>
                        <option value="carpentry">Carpentry</option>
                        <option value="painting">Painting</option>
                        <option value="cleaning">Cleaning</option>
                        <option value="ac">AC Servicing</option>
                      </select>

                      {/* Sort By */}
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-xs font-bold text-[#17233A] focus:outline-none"
                      >
                        <option value="trustScore">Sort: Trust Score</option>
                        <option value="rating">Sort: Rating</option>
                        <option value="eta">Sort: ETA</option>
                        <option value="price">Sort: Price</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Available Manual Workers Catalog */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredManualWorkers.map((worker) => {
                    const isAlreadyInTeam = matchedTeam.some((w) => w.id === worker.id && selectedWorkerIds.includes(w.poolItemId || w.id));

                    return (
                      <div
                        key={worker.id}
                        className={`bg-white border rounded-[24px] p-5 space-y-4 shadow-2xs hover:shadow-md transition-all relative ${
                          isAlreadyInTeam ? 'border-2 border-[#4E8A57]' : 'border-[#E8E2D8]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={worker.avatarUrl}
                              alt={worker.fullName}
                              className="w-12 h-12 rounded-full object-cover border border-[#E8E2D8] shadow-2xs shrink-0"
                            />
                            <div>
                              <span className="text-[10px] font-bold text-[#17233A] bg-[#F8F6F2] px-2 py-0.5 rounded-full border border-[#E8E2D8]">
                                {worker.profession}
                              </span>
                              <h3 className="text-sm font-bold text-[#17233A] mt-1 leading-tight">{worker.fullName}</h3>
                              <p className="text-[10px] text-[#6B7280]">{worker.cooperative}</p>
                            </div>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-center text-xs">
                          <div>
                            <p className="text-[9px] text-[#6B7280] font-bold uppercase">Trust Score</p>
                            <p className="font-extrabold text-[#17233A]">{worker.trustScore}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-[#6B7280] font-bold uppercase">Rating</p>
                            <p className="font-extrabold text-[#17233A]">★ {worker.rating}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-[#6B7280] font-bold uppercase">Jobs</p>
                            <p className="font-extrabold text-[#17233A]">{worker.jobsCompleted}+</p>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="flex items-center gap-2 pt-2 border-t border-[#E8E2D8]">
                          <button
                            type="button"
                            onClick={() => setViewingWorker(worker)}
                            className="py-2 px-3 rounded-xl bg-[#F8F6F2] hover:bg-[#E8E2D8] text-[#17233A] text-xs font-bold flex items-center gap-1.5 transition-all border border-[#E8E2D8] cursor-pointer"
                          >
                            <FontAwesomeIcon icon={faEye} className="w-3 h-3" />
                            <span>View Profile</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleAddManualWorker(worker)}
                            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                              isAlreadyInTeam
                                ? 'bg-[#4E8A57] text-white border border-[#4E8A57]'
                                : 'bg-[#A66666] hover:bg-[#8F5555] text-white shadow-2xs'
                            }`}
                          >
                            <FontAwesomeIcon icon={isAlreadyInTeam ? faCheck : faPlus} className="w-3 h-3" />
                            <span>{isAlreadyInTeam ? 'In Team ✓' : 'Add To Team'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STICKY / PROMINENT TEAM BUILDER SUMMARY PANEL */}
            <div className="bg-[#FCFBF8] border-2 border-[#17233A] rounded-[24px] p-6 space-y-4 shadow-lg sticky bottom-4 z-30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E8E2D8] pb-4">
                <div>
                  <span className="text-xs font-bold text-[#A66666] uppercase tracking-wider">
                    Community Pool Summary
                  </span>
                  <h3 className="text-lg font-bold font-display text-[#17233A]">
                    {selectedWorkersList.length} Artisans Selected
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Combined Rate: <strong className="text-[#17233A]">₹{Math.round(selectedWorkersList.reduce((acc, w) => acc + (w.basePrice || 450), 0) * 0.9)}</strong> (Includes 10% Pool Discount)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#4E8A57] bg-[#E8F3EC] px-3 py-1.5 rounded-full border border-[#C9E2D2]">
                    Avg ETA: ~{selectedWorkersList.length > 0 ? Math.round(selectedWorkersList.reduce((acc, w) => acc + (w.etaMinutes || 15), 0) / selectedWorkersList.length) : 15} Mins
                  </span>
                </div>
              </div>

              {/* Selected Worker Chips List */}
              <div className="flex flex-wrap items-center gap-2">
                {selectedWorkersList.map((worker) => (
                  <span
                    key={worker.poolItemId || worker.id}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8E2D8] text-xs font-bold text-[#17233A] shadow-2xs"
                  >
                    <span>{worker.fullName}</span>
                    <span className="text-[10px] text-[#6B7280]">({worker.roleBadge || worker.profession})</span>
                    <button
                      type="button"
                      onClick={() => toggleSelectWorker(worker.poolItemId || worker.id)}
                      className="text-[#A66666] hover:text-red-700 ml-1"
                      title="Remove worker"
                    >
                      <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Final Order Confirmation CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleCreatePoolOrder}
                  disabled={selectedWorkersList.length === 0}
                  className="w-full py-4 rounded-xl bg-[#A66666] hover:bg-[#8F5555] text-white font-bold font-display text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>Confirm & Create Community Pool Order</span>
                  <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* POOL ORDER CONFIRMED VIEW */}
        {confirmedPoolOrder && (
          <section id="pool-order-confirmed" className="bg-[#FCFBF8] border-2 border-[#4E8A57] rounded-[28px] p-6 sm:p-10 space-y-6 shadow-lg animate-fadeIn">
            <div className="flex items-center gap-3 text-[#4E8A57]">
              <FontAwesomeIcon icon={faCircleCheck} className="w-8 h-8 shrink-0" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider bg-[#E8F3EC] px-2.5 py-0.5 rounded-full border border-[#C9E2D2]">
                  Order Confirmed • Live Dispatch Active
                </span>
                <h2 className="text-2xl font-black font-display text-[#17233A] mt-1">
                  Community Pool Order #{confirmedPoolOrder.orderId}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#F8F6F2] border border-[#E8E2D8] text-xs">
              <div>
                <p className="text-[10px] text-[#6B7280] font-bold uppercase">Assigned Team Size</p>
                <p className="font-extrabold text-[#17233A] text-sm">{confirmedPoolOrder.workerCount} Cooperative Artisans</p>
              </div>
              <div>
                <p className="text-[10px] text-[#6B7280] font-bold uppercase">Scheduled Time</p>
                <p className="font-extrabold text-[#17233A] text-sm">{confirmedPoolOrder.timeSlot}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#6B7280] font-bold uppercase">Total Pool Rate</p>
                <p className="font-extrabold text-[#A66666] text-sm">₹{Math.round(confirmedPoolOrder.totalAmount)}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                to={`/tracking/${confirmedPoolOrder.orderId}`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#A66666] hover:bg-[#8F5555] text-white font-bold text-xs sm:text-sm text-center transition-all shadow-sm"
              >
                Track Live Dispatch
              </Link>
              <Link
                to="/requests"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#F8F6F2] hover:bg-[#E8E2D8] text-[#17233A] border border-[#E8E2D8] font-bold text-xs sm:text-sm text-center transition-all"
              >
                View in My Requests
              </Link>
            </div>
          </section>
        )}

        {/* USE CASES SECTION */}
        <section className="space-y-6 pt-4 border-t border-[#E8E2D8]">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-xl sm:text-2xl font-black font-display text-[#17233A]">
              Ideal Use Cases for Community Pool
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              From apartment complex maintenance to rapid emergency dispatch
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {USE_CASES.map((useCase, idx) => (
              <div
                key={idx}
                className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[20px] p-5 space-y-3 shadow-2xs hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-[#A66666] flex items-center justify-center text-lg group-hover:scale-105 transition-transform">
                  <FontAwesomeIcon icon={useCase.icon} />
                </div>
                <h3 className="text-sm font-bold font-display text-[#17233A]">{useCase.title}</h3>
                <p className="text-xs text-[#4B5563] leading-relaxed font-medium">{useCase.description}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* WORKER PROFILE PREVIEW MODAL */}
      {viewingWorker && (
        <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[28px] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setViewingWorker(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F8F6F2] hover:bg-[#E8E2D8] text-[#17233A] flex items-center justify-center transition-all cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4 border-b border-[#E8E2D8] pb-5">
              <img
                src={viewingWorker.avatarUrl}
                alt={viewingWorker.fullName}
                className="w-16 h-16 rounded-2xl object-cover border border-[#E8E2D8] shadow-sm shrink-0"
              />
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#A66666] bg-[#F8E7E7] px-2.5 py-0.5 rounded-full border border-[#E8CECE]">
                  {viewingWorker.profession}
                </span>
                <h3 className="text-lg font-bold font-display text-[#17233A]">{viewingWorker.fullName}</h3>
                <p className="text-xs text-[#6B7280]">{viewingWorker.cooperative}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-[#F8F6F2] border border-[#E8E2D8] text-center text-xs">
              <div>
                <p className="text-[10px] text-[#6B7280] font-bold uppercase">Trust Score</p>
                <p className="font-extrabold text-[#17233A] text-sm">{viewingWorker.trustScore}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#6B7280] font-bold uppercase">Rating</p>
                <p className="font-extrabold text-[#17233A] text-sm">★ {viewingWorker.rating}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#6B7280] font-bold uppercase">Completed</p>
                <p className="font-extrabold text-[#17233A] text-sm">{viewingWorker.jobsCompleted}+ Jobs</p>
              </div>
            </div>

            {viewingWorker.bio && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-[#17233A] uppercase tracking-wider">Bio & Experience</h4>
                <p className="text-xs text-[#4B5563] leading-relaxed">{viewingWorker.bio}</p>
              </div>
            )}

            {viewingWorker.skills && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-[#17233A] uppercase tracking-wider">Verified Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {viewingWorker.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="text-[11px] font-semibold text-[#17233A] bg-white px-2.5 py-0.5 rounded-full border border-[#E8E2D8]">
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setViewingWorker(null)}
                className="flex-1 py-3 rounded-xl bg-[#F8F6F2] hover:bg-[#E8E2D8] text-[#17233A] font-bold text-xs transition-all border border-[#E8E2D8] cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAddManualWorker(viewingWorker);
                  setViewingWorker(null);
                }}
                className="flex-1 py-3 rounded-xl bg-[#A66666] hover:bg-[#8F5555] text-white font-bold text-xs transition-all shadow-sm cursor-pointer"
              >
                Add To Team
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
}
