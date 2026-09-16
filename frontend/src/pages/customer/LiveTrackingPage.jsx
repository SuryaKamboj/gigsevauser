import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faShieldHalved,
  faPhone,
  faComments,
  faLocationDot,
  faClock,
  faCircleCheck,
  faStar,
  faArrowRight,
  faRotateRight
} from '@fortawesome/free-solid-svg-icons';
import CustomerHeader from '../../components/customer/CustomerHeader';
import BottomNavigation from '../../components/customer/BottomNavigation';
import { useBooking } from '../../context/BookingContext';
import { SERVICES_DATA } from '../../data/servicesData';
import { WORKERS_DATA } from '../../data/workersData';
import { fetchBookingById, fetchTrackingByBookingId } from '../../services/bookingApi';
import GoogleLiveMap from '../../components/common/GoogleLiveMap';

const STATUS_STEPS = ['Accepted', 'On The Way', 'Arrived', 'Completed'];

export default function LiveTrackingPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { activeBooking, setActiveBooking } = useBooking();

  const currentBooking = activeBooking || {
    bookingId: bookingId && bookingId !== 'undefined' ? bookingId : 'GS-202609-87459',
    bookingCode: bookingId && bookingId !== 'undefined' ? bookingId : 'GS-202609-87459',
    status: 'Accepted',
    worker: WORKERS_DATA[0],
    service: SERVICES_DATA['electrical'],
    createdAt: new Date().toLocaleTimeString(),
    address: 'B-42 Lajpat Nagar II, New Delhi (110024)'
  };

  const [liveData, setLiveData] = useState(null);

  const worker = liveData?.workerId || currentBooking.worker || WORKERS_DATA[0];
  const service = liveData?.serviceId || currentBooking.service || SERVICES_DATA['electrical'];

  const getStepIndex = (status) => {
    if (!status) return 0;
    const normalized = status.toLowerCase();
    if (normalized === 'completed') return 3;
    if (normalized === 'arrived' || normalized === 'in_progress') return 2;
    if (normalized.includes('way') || normalized === 'in_transit') return 1;
    return 0;
  };

  const [currentStepIdx, setCurrentStepIdx] = useState(() => getStepIndex(currentBooking.status));
  const [trackingData, setTrackingData] = useState(null);

  React.useEffect(() => {
    const idToFetch = currentBooking._id || (bookingId && bookingId !== 'undefined' ? bookingId : null);
    if (!idToFetch) return;

    let isMounted = true;
    const pollBackend = async () => {
      try {
        const res = await fetchBookingById(idToFetch);
        const b = res?.booking || res;
        if (isMounted && b) {
          setLiveData(b);
          if (b.status) {
            const newStep = getStepIndex(b.status);
            setCurrentStepIdx(newStep);
          }
        }

        const trackRes = await fetchTrackingByBookingId(idToFetch).catch(() => null);
        if (isMounted && trackRes?.data?.workerLocation) {
          setTrackingData(trackRes.data);
        } else if (isMounted && trackRes?.workerLocation) {
          setTrackingData(trackRes);
        }
      } catch (e) {
        // silent fallback
      }
    };

    pollBackend();
    const interval = setInterval(pollBackend, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [currentBooking._id, bookingId]);

  const handleNextStep = () => {
    if (currentStepIdx < STATUS_STEPS.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      if (setActiveBooking) {
        setActiveBooking((prev) => ({
          ...(prev || currentBooking),
          status: STATUS_STEPS[nextIdx]
        }));
      }
    }
  };

  const currentStatus = STATUS_STEPS[currentStepIdx];

  const displayId = (bookingId && bookingId !== 'undefined') ? bookingId : (currentBooking.bookingId || currentBooking.bookingCode || 'GS-202609-87459');

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#17233A] relative pb-20 md:pb-12 font-sans">
      <CustomerHeader />

      <main className="w-[95%] max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs font-medium text-[#6B7280]">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li><Link to="/" className="hover:text-[#17233A]">Home</Link></li>
            <li><FontAwesomeIcon icon={faChevronRight} className="w-2 h-2 text-[#A66666]" /></li>
            <li className="text-[#17233A] font-bold">Live Order Tracking ({displayId})</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8F6F2] border border-[#E8E2D8] text-xs font-bold text-[#A66666]">
                <FontAwesomeIcon icon={faShieldHalved} className="w-3.5 h-3.5" />
                <span>Live Cooperative Dispatch</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#17233A] mt-1">
                Tracking Order #{displayId}
              </h1>
            </div>

            <div className="bg-[#A66666]/10 border border-[#A66666]/30 px-4 py-2 rounded-2xl text-right">
              <span className="text-[11px] font-bold text-[#6B7280] block uppercase">Est. Arrival</span>
              <span className="text-lg font-black text-[#A66666] flex items-center gap-1">
                <FontAwesomeIcon icon={faClock} className="w-4 h-4 animate-pulse" />
                {currentStatus === 'Completed' ? 'Service Finished' : currentStatus === 'Arrived' ? 'At Doorstep' : '14 Mins'}
              </span>
            </div>
          </div>

          {/* STATUS PROGRESS TIMELINE BAR */}
          <div className="pt-4 border-t border-[#E8E2D8]">
            <div className="grid grid-cols-4 gap-2 text-center relative">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={step} className="flex flex-col items-center space-y-2 relative z-10">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border-2 transition-all ${
                        isCurrent
                          ? 'bg-[#A66666] text-white border-[#A66666] shadow-md ring-4 ring-[#A66666]/20'
                          : isPassed
                          ? 'bg-[#17233A] text-white border-[#17233A]'
                          : 'bg-[#F8F6F2] text-[#6B7280] border-[#E8E2D8]'
                      }`}
                    >
                      {isPassed ? <FontAwesomeIcon icon={faCircleCheck} className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span className={`text-[11px] sm:text-xs font-bold ${isCurrent ? 'text-[#A66666]' : 'text-[#6B7280]'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* OTP Verification Pill */}
          <div className="mt-4 pt-4 border-t border-[#E8E2D8] flex items-center justify-between flex-wrap gap-3 bg-[#A66666]/5 rounded-2xl p-4 border border-[#A66666]/20">
            <div>
              <div className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Service Start Verification PIN</div>
              <div className="text-xs text-[#17233A] mt-0.5">Share this 4-digit code with {worker.fullName} only after arrival to begin work</div>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-[#A66666] bg-white px-4 py-1.5 rounded-xl border border-[#A66666]/30 shadow-xs">
              {liveData?.startOtp || currentBooking.startOtp || '1234'}
            </div>
          </div>
        </div>

        {/* INTERACTIVE GOOGLE LIVE MAP (DUAL WORKER + CUSTOMER TRACKING) */}
        <section className="space-y-2">
          <GoogleLiveMap
            workerLocation={trackingData?.workerLocation || {
              latitude: 28.5300,
              longitude: 77.2090,
              name: worker?.fullName || 'Rajesh Kumar'
            }}
            customerLocation={trackingData?.customerLocation || {
              latitude: 28.5244,
              longitude: 77.2060,
              address: currentBooking.address || 'B-42 Lajpat Nagar II, New Delhi'
            }}
            status={currentStatus}
            className="h-72 sm:h-80 w-full"
          />

          {/* Quick Demo Step Advancement Controls */}
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleNextStep}
              disabled={currentStatus === 'Completed'}
              className="px-3.5 py-1.5 rounded-xl bg-[#17233A] text-white text-xs font-bold hover:bg-[#A66666] transition-all disabled:opacity-50 flex items-center gap-2 shadow-xs"
            >
              <FontAwesomeIcon icon={faRotateRight} className="w-3 h-3" />
              <span>Simulate Next Step: ({currentStatus})</span>
            </button>
          </div>
        </section>

        {/* WORKER DETAILS & CONTACT CARD */}
        <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={worker.avatarUrl} alt={worker.fullName} className="w-16 h-16 rounded-2xl object-cover border border-[#E8E2D8]" />
            <div>
              <h3 className="text-base font-bold font-display text-[#17233A]">{worker.fullName}</h3>
              <p className="text-xs text-[#6B7280]">{worker.profession} • {worker.cooperative}</p>
              <div className="flex items-center gap-1 mt-1 text-xs font-bold text-[#A66666]">
                <FontAwesomeIcon icon={faStar} />
                <span>{worker.rating} ★</span>
                <span className="text-[#6B7280] font-normal">({worker.jobsCompleted} Jobs Completed)</span>
              </div>
            </div>
          </div>

          {/* Contact Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={`tel:+919876543210`}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-[#F8F6F2] hover:bg-[#E8E2D8]/50 border border-[#E8E2D8] text-xs font-bold text-[#17233A] flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faPhone} className="text-[#A66666]" />
              <span>Call Worker</span>
            </a>
            <button
              type="button"
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-[#F8F6F2] hover:bg-[#E8E2D8]/50 border border-[#E8E2D8] text-xs font-bold text-[#17233A] flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faComments} className="text-[#A66666]" />
              <span>Message</span>
            </button>
          </div>
        </div>

        {/* IF COMPLETED: CTA TO REVIEW PAGE */}
        {currentStatus === 'Completed' && (
          <div className="bg-[#A66666]/10 border border-[#A66666]/30 rounded-[24px] p-6 text-center space-y-3">
            <h2 className="text-xl font-bold font-display text-[#17233A]">Service Completed Successfully!</h2>
            <p className="text-xs text-[#6B7280]">Please take a moment to rate and review your experience with {worker.fullName}.</p>
            <button
              type="button"
              onClick={() => navigate(`/review/${displayId}`)}
              className="px-8 py-3.5 rounded-2xl bg-[#A66666] hover:bg-[#8F5555] text-white font-bold font-display text-sm flex items-center justify-center gap-2 mx-auto shadow-md"
            >
              <span>Leave a Review</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        )}

      </main>

      <BottomNavigation activeTab="bookings" />
    </div>
  );
}
