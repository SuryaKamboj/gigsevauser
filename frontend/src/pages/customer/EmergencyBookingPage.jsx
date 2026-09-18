import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faBolt,
  faShieldHalved,
  faLocationDot,
  faClock,
  faPhone,
  faStar,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import CustomerHeader from '../../components/customer/CustomerHeader';
import BottomNavigation from '../../components/customer/BottomNavigation';
import { fetchWorkers } from '../../services/workersApi';
import { SERVICES_DATA, getServiceById } from '../../data/servicesData';
import { useBooking } from '../../context/BookingContext';

export default function EmergencyBookingPage() {
  const navigate = useNavigate();
  const { setSelectedServiceId, setSelectedWorkerId, createNewBooking } = useBooking();
  const [liveWorkers, setLiveWorkers] = useState([]);
  const [selectedUrgentWorker, setSelectedUrgentWorker] = useState(null);

  React.useEffect(() => {
    let isMounted = true;
    fetchWorkers().then((data) => {
      if (isMounted && Array.isArray(data) && data.length > 0) {
        setLiveWorkers(data);
        setSelectedUrgentWorker(data[0]);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const emergencyWorkers = liveWorkers.map((w) => ({
    id: w._id,
    _id: w._id,
    serviceId: (w.primaryServiceCategory || 'ELECTRICAL').toLowerCase(),
    fullName: w.fullName || 'Emergency Artisan',
    profession: w.primarySkill || w.primaryServiceCategory || 'Emergency Specialist',
    distanceKm: 1.2,
    rating: w.metrics?.averageRating || 4.9,
    basePrice: w.basePrice || 499,
    cooperative: w.societyId?.name || 'South Delhi Cooperative',
    avatarUrl: w.selfieUrl || w.avatarUrl || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400'
  }));

  const handleInstantDispatch = async (worker) => {
    const wId = worker?._id || worker?.id;
    const sId = worker?.serviceId || 'electrical';
    setSelectedWorkerId(wId);
    setSelectedServiceId(sId);
    
    try {
      const newBooking = await createNewBooking(sId, wId, {
        isEmergency: true,
        timeSlot: '15-Min Express Dispatch'
      });

      const trackId = newBooking?.bookingCode || newBooking?.bookingId || newBooking?._id;
      navigate(`/tracking/${trackId}`);
    } catch (err) {
      alert(err.message || 'Unable to initiate emergency dispatch. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#17233A] relative pb-20 md:pb-12 font-sans">
      <CustomerHeader />

      <main className="w-[95%] max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs font-medium text-[#6B7280]">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li><Link to="/" className="hover:text-[#17233A]">Home</Link></li>
            <li><FontAwesomeIcon icon={faChevronRight} className="w-2 h-2 text-[#A66666]" /></li>
            <li className="text-[#17233A] font-bold">Priority Emergency Dispatch</li>
          </ol>
        </nav>

        {/* Emergency Header Banner */}
        <div className="bg-[#FCFBF8] border-2 border-[#A66666]/30 rounded-[28px] p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A66666]/10 border border-[#A66666]/30 text-xs font-bold text-[#A66666]">
                <FontAwesomeIcon icon={faBolt} className="animate-pulse" />
                <span>15-Minute Priority Express Dispatch</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-[#17233A]">
                Urgent Household Crisis Response
              </h1>
              <p className="text-xs sm:text-sm text-[#6B7280] max-w-2xl">
                Immediate dispatch of nearest verified cooperative artisans for active water pipe bursts, short circuits, or gas line leaks.
              </p>
            </div>

            <div className="bg-[#F8F6F2] border border-[#E8E2D8] p-4 rounded-2xl text-right">
              <span className="text-xs text-[#6B7280] font-semibold block">Average Response</span>
              <span className="text-xl font-extrabold text-[#A66666]">10 - 15 Mins</span>
            </div>
          </div>
        </div>

        {/* NEAREST AVAILABLE EMERGENCY WORKERS GRID */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-display text-[#17233A] flex items-center gap-2">
            <FontAwesomeIcon icon={faLocationDot} className="text-[#A66666]" />
            <span>Nearest Available Artisans (Instant Dispatch)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {emergencyWorkers.map((worker) => {
              const service = getServiceById(worker.serviceId);

              return (
                <div
                  key={worker.id}
                  className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-5 shadow-xs flex flex-col justify-between hover:border-[#A66666] transition-all space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <img src={worker.avatarUrl} alt={worker.fullName} className="w-14 h-14 rounded-2xl object-cover border border-[#E8E2D8]" />
                      <div>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#A66666]/10 text-[#A66666] border border-[#A66666]/20 inline-block mb-1">
                          {service.name}
                        </span>
                        <h3 className="text-base font-bold font-display text-[#17233A]">{worker.fullName}</h3>
                        <p className="text-xs text-[#6B7280]">{worker.cooperative}</p>
                      </div>
                    </div>

                    <div className="bg-[#F8F6F2] border border-[#E8E2D8] p-3 rounded-xl flex items-center justify-between text-xs font-semibold">
                      <span className="flex items-center gap-1 text-[#A66666] font-bold">
                        <FontAwesomeIcon icon={faClock} />
                        ETA: 12 Mins
                      </span>
                      <span>{worker.distanceKm} km away</span>
                      <span className="text-[#17233A]">★ {worker.rating}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleInstantDispatch(worker)}
                    className="w-full py-3 rounded-xl bg-[#A66666] hover:bg-[#8F5555] text-white text-xs font-bold font-display flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all"
                  >
                    <FontAwesomeIcon icon={faBolt} />
                    <span>Instant Dispatch (₹{worker.basePrice})</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      <BottomNavigation activeTab="home" />
    </div>
  );
}
