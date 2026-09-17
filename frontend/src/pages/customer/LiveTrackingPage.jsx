import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faShieldHalved,
  faPhone,
  faComments,
  faClock,
  faCircleCheck,
  faStar,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import CustomerHeader from '../../components/customer/CustomerHeader';
import BottomNavigation from '../../components/customer/BottomNavigation';
import { useBooking } from '../../context/BookingContext';
import { fetchBookingById, fetchTrackingByBookingId } from '../../services/bookingApi';
import GoogleLiveMap from '../../components/common/GoogleLiveMap';

const STATUS_STEPS = [
  { key: 'PENDING', label: 'Requested' },
  { key: 'ACCEPTED', label: 'Assigned' },
  { key: 'IN_TRANSIT', label: 'On The Way' },
  { key: 'ARRIVED', label: 'At Doorstep' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'COMPLETED', label: 'Completed' }
];

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400';

export default function LiveTrackingPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { activeBooking } = useBooking();

  const [liveData, setLiveData] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const idToFetch = (bookingId && bookingId !== 'undefined') ? bookingId : activeBooking?._id || activeBooking?.bookingId;

  const getStepIndex = (status) => {
    if (!status) return 0;
    const s = String(status).toUpperCase();
    if (s === 'COMPLETED') return 5;
    if (s === 'IN_PROGRESS') return 4;
    if (s === 'ARRIVED') return 3;
    if (s === 'IN_TRANSIT') return 2;
    if (s === 'ACCEPTED') return 1;
    return 0; // PENDING, REQUESTED, ALLOCATED
  };

  useEffect(() => {
    if (!idToFetch) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const pollBackend = async () => {
      try {
        const res = await fetchBookingById(idToFetch);
        const b = res?.data || res?.booking || res;
        if (isMounted && b && (b._id || b.bookingCode)) {
          setLiveData(b);
        }

        const trackRes = await fetchTrackingByBookingId(idToFetch).catch(() => null);
        if (isMounted && trackRes?.data?.workerLocation) {
          setTrackingData(trackRes.data);
        } else if (isMounted && trackRes?.workerLocation) {
          setTrackingData(trackRes);
        }
      } catch (e) {
        // quiet poll notice
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    pollBackend();
    const interval = setInterval(pollBackend, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [idToFetch]);

  const booking = liveData || activeBooking;
  const rawStatus = booking?.status || 'PENDING';
  const currentStepIdx = getStepIndex(rawStatus);
  const currentStatusLabel = STATUS_STEPS[currentStepIdx]?.label || 'Pending Confirmation';

  const worker = booking?.workerId || booking?.worker || null;
  const service = booking?.serviceId || booking?.service || null;

  const displayId = booking?.bookingCode || booking?.bookingId || idToFetch || 'Pending';
  const workerName = worker?.fullName || 'Assigned Artisan';
  const workerAvatar = worker?.avatarUrl || worker?.selfieUrl || DEFAULT_AVATAR;
  const workerPhone = worker?.mobileNumber || worker?.userId?.mobileNumber || '+919876543210';
  const workerRating = worker?.metrics?.averageRating || worker?.rating || 4.9;
  const workerJobs = worker?.metrics?.completedJobsCount || worker?.jobsCompleted || 24;
  const coopName = worker?.societyId?.name || worker?.cooperative || 'South Delhi Worker Cooperative Society';

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#17233A] relative pb-20 md:pb-12 font-sans">
      <CustomerHeader />

      <main className="w-[95%] max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs font-medium text-[#6B7280]">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li><Link to="/" className="hover:text-[#17233A]">Home</Link></li>
            <li><FontAwesomeIcon icon={faChevronRight} className="w-2 h-2 text-[#A66666]" /></li>
            <li><Link to="/requests" className="hover:text-[#17233A]">My Bookings</Link></li>
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
                Tracking Booking #{displayId}
              </h1>
              {service?.name && (
                <p className="text-xs text-[#6B7280] mt-0.5">Service: <span className="font-semibold text-[#17233A]">{service.name}</span></p>
              )}
            </div>

            <div className="bg-[#A66666]/10 border border-[#A66666]/30 px-4 py-2 rounded-2xl text-right">
              <span className="text-[11px] font-bold text-[#6B7280] block uppercase">Current Status</span>
              <span className="text-lg font-black text-[#A66666] flex items-center gap-1">
                <FontAwesomeIcon icon={faClock} className="w-4 h-4 animate-pulse" />
                {currentStatusLabel}
              </span>
            </div>
          </div>

          {/* STATUS PROGRESS TIMELINE BAR (REAL MONGODB STATE) */}
          <div className="pt-4 border-t border-[#E8E2D8]">
            <div className="grid grid-cols-6 gap-1 sm:gap-2 text-center relative">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={step.key} className="flex flex-col items-center space-y-2 relative z-10">
                    <div
                      className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border-2 transition-all ${
                        isCurrent
                          ? 'bg-[#A66666] text-white border-[#A66666] shadow-md ring-4 ring-[#A66666]/20'
                          : isPassed
                          ? 'bg-[#17233A] text-white border-[#17233A]'
                          : 'bg-[#F8F6F2] text-[#6B7280] border-[#E8E2D8]'
                      }`}
                    >
                      {isPassed ? <FontAwesomeIcon icon={faCircleCheck} className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : idx + 1}
                    </div>
                    <span className={`text-[10px] sm:text-xs font-bold leading-tight ${isCurrent ? 'text-[#A66666]' : 'text-[#6B7280]'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* OTP Verification Pill */}
          <div className="mt-4 pt-4 border-t border-[#E8E2D8] flex items-center justify-between flex-wrap gap-3 bg-[#A66666]/5 rounded-2xl p-4 border border-[#A66666]/20">
            <div className="max-w-md">
              <div className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Service Start Verification PIN</div>
              <div className="text-xs text-[#17233A] mt-0.5">
                {liveData?.startOtp
                  ? `Share this 4-digit code with ${workerName} to begin work.`
                  : 'Your 4-digit PIN is cryptographically secured and will be revealed here once the worker arrives at your doorstep.'}
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-[#A66666] bg-white px-4 py-1.5 rounded-xl border border-[#A66666]/30 shadow-xs">
              {liveData?.startOtp ? liveData.startOtp : '••••'}
            </div>
          </div>
        </div>

        {/* INTERACTIVE GOOGLE LIVE MAP (DUAL WORKER + CUSTOMER TRACKING) */}
        <section className="space-y-2">
          <GoogleLiveMap
            workerLocation={trackingData?.workerLocation || {
              latitude: worker?.currentLocation?.coordinates?.[1] || 28.5300,
              longitude: worker?.currentLocation?.coordinates?.[0] || 77.2090,
              name: workerName
            }}
            customerLocation={trackingData?.customerLocation || {
              latitude: booking?.serviceAddress?.location?.coordinates?.[1] || 28.5244,
              longitude: booking?.serviceAddress?.location?.coordinates?.[0] || 77.2060,
              address: booking?.serviceAddress?.addressLine1 || 'Customer Destination'
            }}
            status={currentStatusLabel}
            className="h-72 sm:h-80 w-full"
          />
        </section>

        {/* WORKER DETAILS & CONTACT CARD */}
        <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={workerAvatar} alt={workerName} className="w-16 h-16 rounded-2xl object-cover border border-[#E8E2D8]" />
            <div>
              <h3 className="text-base font-bold font-display text-[#17233A]">{workerName}</h3>
              <p className="text-xs text-[#6B7280]">{worker?.profession || worker?.primaryServiceCategory || 'Verified Cooperative Artisan'} • {coopName}</p>
              <div className="flex items-center gap-1 mt-1 text-xs font-bold text-[#A66666]">
                <FontAwesomeIcon icon={faStar} />
                <span>{workerRating} ★</span>
                <span className="text-[#6B7280] font-normal">({workerJobs} Jobs Completed)</span>
              </div>
            </div>
          </div>

          {/* Contact Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={`tel:${workerPhone}`}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-[#F8F6F2] hover:bg-[#E8E2D8]/50 border border-[#E8E2D8] text-xs font-bold text-[#17233A] flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faPhone} className="text-[#A66666]" />
              <span>Call Worker</span>
            </a>
            <button
              type="button"
              onClick={() => alert(`Contacting ${workerName} via Cooperative Dispatch Desk`)}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-[#F8F6F2] hover:bg-[#E8E2D8]/50 border border-[#E8E2D8] text-xs font-bold text-[#17233A] flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faComments} className="text-[#A66666]" />
              <span>Message</span>
            </button>
          </div>
        </div>

        {/* IF COMPLETED: CTA TO REVIEW PAGE */}
        {rawStatus === 'COMPLETED' && (
          <div className="bg-[#A66666]/10 border border-[#A66666]/30 rounded-[24px] p-6 text-center space-y-3">
            <h2 className="text-xl font-bold font-display text-[#17233A]">Service Completed Successfully!</h2>
            <p className="text-xs text-[#6B7280]">Please take a moment to rate and review your experience with {workerName}.</p>
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
