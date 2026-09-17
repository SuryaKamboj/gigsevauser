import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  faArrowRight,
  faRotateRight,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import CustomerHeader from '../../components/customer/CustomerHeader';
import BottomNavigation from '../../components/customer/BottomNavigation';
import { fetchBookingById, fetchTrackingByBookingId } from '../../services/bookingApi';
import GoogleLiveMap from '../../components/common/GoogleLiveMap';

// Backend canonical status order — frontend NEVER derives next step
const STATUS_STEPS = [
  { key: 'PENDING',     label: 'Requested'    },
  { key: 'ACCEPTED',    label: 'Assigned'     },
  { key: 'IN_TRANSIT',  label: 'On The Way'   },
  { key: 'ARRIVED',     label: 'At Doorstep'  },
  { key: 'IN_PROGRESS', label: 'In Progress'  },
  { key: 'COMPLETED',   label: 'Completed'    },
];

const STEP_IDX = Object.fromEntries(STATUS_STEPS.map((s, i) => [s.key, i]));

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400';
const POLL_INTERVAL_MS = 4000; // 4 s — tight enough to feel real-time

export default function LiveTrackingPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking]       = useState(null);
  const [tracking, setTracking]     = useState(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const poll = useCallback(async () => {
    if (!bookingId || bookingId === 'undefined') {
      if (isMounted.current) { setError('No booking ID provided.'); setIsLoading(false); }
      return;
    }
    try {
      const res = await fetchBookingById(bookingId);
      // Backend wraps response as { success, data: { ...booking, startOtp } }
      const b = res?.data || res?.booking || res;
      if (isMounted.current && b && (b._id || b.bookingCode)) {
        setBooking(b);
        setError(null);
        setLastUpdated(new Date());
      }

      // Worker location — graceful if endpoint not yet live
      const trackRes = await fetchTrackingByBookingId(bookingId).catch(() => null);
      if (isMounted.current) {
        const td = trackRes?.data || trackRes;
        if (td?.workerLocation) setTracking(td);
      }
    } catch (e) {
      const msg = e?.response?.data?.error?.message || e?.message || 'Unable to fetch booking.';
      if (isMounted.current && !booking) setError(msg); // Only show error when no prior data
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, [bookingId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [poll]);

  // ── Derived display values ──────────────────────────────────────────────
  const rawStatus      = (booking?.status || 'PENDING').toUpperCase();
  const currentStepIdx = rawStatus === 'COMPLETION_PENDING' ? 4 : (STEP_IDX[rawStatus] ?? 0);
  const currentLabel   = rawStatus === 'COMPLETION_PENDING' ? 'Completion Verification' : (STATUS_STEPS[currentStepIdx]?.label ?? 'Pending');

  const worker     = booking?.workerId || null;
  const service    = booking?.serviceId || null;
  const displayId  = booking?.bookingCode || booking?.bookingId || bookingId || '—';
  const workerName = worker?.fullName || 'Assigned Artisan';
  const workerAvatar  = worker?.avatarUrl || worker?.selfieUrl || DEFAULT_AVATAR;
  const workerPhone   = worker?.mobileNumber || worker?.userId?.mobileNumber || null;
  const workerRating  = worker?.metrics?.averageRating ?? 4.9;
  const workerJobs    = worker?.metrics?.completedJobsCount ?? 0;
  const coopName      = worker?.societyId?.name || 'Worker Cooperative';

  // startOtp is returned by GET /bookings/:id ONLY when status === 'ARRIVED' and caller is the booking owner
  const startOtp = booking?.startOtp || null;
  // completionPin is returned by GET /bookings/:id ONLY when status === 'COMPLETION_PENDING' and caller is the booking owner
  const completionPin = booking?.completionPin || booking?.security?.completionPin || null;

  const workerLocation = tracking?.workerLocation ?? {
    latitude:  worker?.currentLocation?.coordinates?.[1] ?? 28.5300,
    longitude: worker?.currentLocation?.coordinates?.[0] ?? 77.2090,
    name: workerName,
  };
  const customerLocation = {
    latitude:  booking?.serviceAddress?.location?.coordinates?.[1] ?? 28.5244,
    longitude: booking?.serviceAddress?.location?.coordinates?.[0] ?? 77.2060,
    address:   booking?.serviceAddress?.addressLine1 ?? 'Customer Location',
  };

  // ── Render ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#A66666] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-[#6B7280]">Loading booking #{bookingId}…</p>
        </div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <FontAwesomeIcon icon={faTriangleExclamation} className="text-[#A66666] text-4xl" />
        <h2 className="text-lg font-bold text-[#17233A]">Could not load booking</h2>
        <p className="text-sm text-[#6B7280] max-w-xs">{error}</p>
        <button
          type="button"
          onClick={() => { setIsLoading(true); poll(); }}
          className="px-6 py-2.5 rounded-xl bg-[#A66666] text-white font-bold text-sm flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faRotateRight} /> Retry
        </button>
        <Link to="/requests" className="text-xs text-[#6B7280] underline">Back to My Bookings</Link>
      </div>
    );
  }

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
            <li className="text-[#17233A] font-bold">Tracking #{displayId}</li>
          </ol>
        </nav>

        {/* Stale-data banner */}
        {error && booking && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-medium text-amber-700">
            <FontAwesomeIcon icon={faTriangleExclamation} />
            <span>Live update paused — retrying in a moment. Last known status: <strong>{currentLabel}</strong></span>
          </div>
        )}

        {/* Header card */}
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
                <FontAwesomeIcon icon={faClock} className={rawStatus === 'COMPLETED' ? '' : 'animate-pulse'} />
                {currentLabel}
              </span>
              {lastUpdated && (
                <span className="text-[10px] text-[#6B7280]">Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              )}
            </div>
          </div>

          {/* STATUS PROGRESS TIMELINE — driven purely by MongoDB status */}
          <div className="pt-4 border-t border-[#E8E2D8]">
            <div className="grid grid-cols-6 gap-1 sm:gap-2 text-center relative">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed  = idx <= currentStepIdx;
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

          {/* PIN CARD — dynamically shows Completion PIN or Start OTP based on real booking lifecycle */}
          {rawStatus === 'COMPLETION_PENDING' || completionPin ? (
            <div className="mt-4 pt-4 border-t border-[#E8E2D8] flex items-center justify-between flex-wrap gap-4 bg-emerald-50/90 rounded-2xl p-5 border-2 border-emerald-500 shadow-sm">
              <div className="max-w-md">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                  Job Completion Verification PIN
                </div>
                <div className="text-xs sm:text-sm text-emerald-950 font-medium mt-1">
                  {completionPin ? (
                    <>Worker has completed the work! Share this <strong>4-digit PIN</strong> with <span className="font-bold text-emerald-900">{workerName}</span> to confirm completion.</>
                  ) : (
                    <>Worker requested job completion. Generating your 4-digit verification PIN…</>
                  )}
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-black font-mono tracking-widest text-emerald-700 bg-white px-5 py-2 rounded-xl border-2 border-emerald-400 shadow-sm">
                {completionPin ?? '••••'}
              </div>
            </div>
          ) : rawStatus === 'COMPLETED' ? (
            <div className="mt-4 pt-4 border-t border-[#E8E2D8] flex items-center gap-3 bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200 text-emerald-900">
              <FontAwesomeIcon icon={faCircleCheck} className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider">Service Successfully Completed</div>
                <div className="text-xs text-emerald-800 mt-0.5">Your booking has been verified and marked as complete. Thank you for choosing cooperative service!</div>
              </div>
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-[#E8E2D8] flex items-center justify-between flex-wrap gap-3 bg-[#A66666]/5 rounded-2xl p-4 border border-[#A66666]/20">
              <div className="max-w-md">
                <div className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Service Start Verification PIN</div>
                <div className="text-xs text-[#17233A] mt-0.5">
                  {startOtp
                    ? `Share this 4-digit code with ${workerName} to begin work.`
                    : rawStatus === 'IN_PROGRESS'
                    ? 'Work is currently in progress. Completion PIN will appear here when worker finishes.'
                    : 'Your 4-digit PIN will be revealed here once the worker arrives at your doorstep.'}
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-[#A66666] bg-white px-4 py-1.5 rounded-xl border border-[#A66666]/30 shadow-xs">
                {startOtp ?? '••••'}
              </div>
            </div>
          )}
        </div>

        {/* LIVE MAP */}
        <section className="space-y-2">
          <GoogleLiveMap
            workerLocation={workerLocation}
            customerLocation={customerLocation}
            status={currentLabel}
            className="h-72 sm:h-80 w-full"
          />
        </section>

        {/* WORKER DETAILS CARD */}
        {worker && (
          <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={workerAvatar} alt={workerName} className="w-16 h-16 rounded-2xl object-cover border border-[#E8E2D8]" />
              <div>
                <h3 className="text-base font-bold font-display text-[#17233A]">{workerName}</h3>
                <p className="text-xs text-[#6B7280]">
                  {worker?.profession || worker?.primaryServiceCategory || 'Verified Cooperative Artisan'} • {coopName}
                </p>
                <div className="flex items-center gap-1 mt-1 text-xs font-bold text-[#A66666]">
                  <FontAwesomeIcon icon={faStar} />
                  <span>{workerRating.toFixed(1)} ★</span>
                  <span className="text-[#6B7280] font-normal">({workerJobs} Jobs)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {workerPhone ? (
                <a
                  href={`tel:${workerPhone}`}
                  className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-[#F8F6F2] hover:bg-[#E8E2D8]/50 border border-[#E8E2D8] text-xs font-bold text-[#17233A] flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faPhone} className="text-[#A66666]" />
                  <span>Call Worker</span>
                </a>
              ) : null}
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
        )}

        {/* COMPLETED CTA */}
        {rawStatus === 'COMPLETED' && (
          <div className="bg-[#A66666]/10 border border-[#A66666]/30 rounded-[24px] p-6 text-center space-y-3">
            <FontAwesomeIcon icon={faCircleCheck} className="text-[#4E8A57] text-3xl" />
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
