import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faLocationDot,
  faClock,
  faStar,
  faRotateRight,
  faReceipt,
  faCircleCheck,
  faArrowRight,
  faXmark,
  faClipboardList,
  faShieldHalved,
  faUserGear,
  faPrint,
  faFileCircleExclamation,
  faUpload,
  faCheck,
  faUserCheck,
  faPhone,
  faComments,
  faBolt
} from '@fortawesome/free-solid-svg-icons';
import CustomerHeader from '../../components/customer/CustomerHeader';
import BottomNavigation from '../../components/customer/BottomNavigation';
import { useBooking } from '../../context/BookingContext';

const COMPLAINT_STAGES = [
  'Complaint Filed',
  'Guild Officer Assigned',
  'Investigation In Progress',
  'Resolution Proposed',
  'Resolved'
];

export default function RequestsPage() {
  const navigate = useNavigate();
  const {
    activeBooking,
    previousBookings,
    complaints,
    addComplaint,
    setSelectedServiceId,
    setSelectedWorkerId
  } = useBooking();

  const hasActiveRequest = !!(activeBooking && activeBooking.status !== 'Completed');
  const hasPreviousRequests = previousBookings && previousBookings.length > 0;

  // Active Sub-Tab: 'active' | 'previous' | 'complaints'
  const [requestsTab, setRequestsTab] = useState(hasActiveRequest ? 'active' : 'previous');

  React.useEffect(() => {
    if (hasActiveRequest) {
      setRequestsTab('active');
    }
  }, [hasActiveRequest]);

  // Modal States
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [raisingComplaintOrder, setRaisingComplaintOrder] = useState(null);
  const [submittedComplaintResult, setSubmittedComplaintResult] = useState(null);
  const [viewingComplaint, setViewingComplaint] = useState(null);
  const [activeContactModal, setActiveContactModal] = useState(null); // { type: 'chat' | 'call', worker }

  // Raise Complaint Form Inputs
  const [complaintType, setComplaintType] = useState('Worker Arrived Late');
  const [complaintDescription, setComplaintDescription] = useState('');
  const [evidenceFileName, setEvidenceFileName] = useState('');
  const [complaintPriority, setComplaintPriority] = useState('High');

  const handleBookAgain = (serviceId, workerId) => {
    if (serviceId) setSelectedServiceId(serviceId);
    if (workerId) setSelectedWorkerId(workerId);
    navigate(`/booking?service=${serviceId || 'electrical'}&workerId=${workerId || 'el-1'}`);
  };

  const handleOpenRaiseComplaint = (orderObj) => {
    setRaisingComplaintOrder(orderObj);
    setComplaintType('Worker Arrived Late');
    setComplaintDescription('');
    setEvidenceFileName('');
    setComplaintPriority('High');
  };

  const handleSubmitComplaint = (e) => {
    e.preventDefault();
    if (!raisingComplaintOrder) return;

    const newRecord = addComplaint({
      bookingId: raisingComplaintOrder.bookingId || 'BK-1001',
      serviceTitle: raisingComplaintOrder.service?.title || raisingComplaintOrder.serviceTitle || 'Home Service',
      workerName: raisingComplaintOrder.worker?.fullName || raisingComplaintOrder.workerName || 'Assigned Artisan',
      workerCooperative: raisingComplaintOrder.worker?.cooperative || 'Regional Guild',
      category: complaintType,
      description: complaintDescription || 'No description provided.',
      evidenceName: evidenceFileName || 'supporting_evidence.png',
      priority: complaintPriority
    });

    const expectedResolution = complaintPriority === 'Urgent'
      ? 'Under 6 Hours'
      : complaintPriority === 'High'
      ? 'Under 12 Hours'
      : 'Under 24 Hours';

    setSubmittedComplaintResult({
      ...newRecord,
      expectedResolution
    });

    setRaisingComplaintOrder(null);
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Complaint Filed':
      case 'Submitted':
        return 'bg-[#F6EBDD] text-[#17233A] border-[#E5D5C2]';
      case 'Guild Officer Assigned':
      case 'Under Review':
        return 'bg-[#E7F1FA] text-[#17233A] border-[#CADDF0]';
      case 'Investigation In Progress':
      case 'Guild Investigation':
        return 'bg-[#ECE9FA] text-[#17233A] border-[#D5CFF2]';
      case 'Resolution Proposed':
        return 'bg-[#F8E7E7] text-[#A66666] border-[#E8CECE]';
      case 'Resolved':
        return 'bg-[#E8F3EC] text-[#4E8A57] border-[#C9E2D2]';
      default:
        return 'bg-[#F8F6F2] text-[#17233A] border-[#E8E2D8]';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#17233A] relative pb-20 md:pb-12 font-sans">
      <CustomerHeader />

      <main className="w-[95%] max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs font-medium text-[#6B7280]">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li>
              <Link to="/" className="hover:text-[#17233A]">Home</Link>
            </li>
            <li>
              <FontAwesomeIcon icon={faChevronRight} className="w-2 h-2 text-[#A66666]" />
            </li>
            <li className="text-[#17233A] font-bold">Requests & Governance Hub</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D8] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FCFBF8] border border-[#E8E2D8] text-[10px] sm:text-[11px] font-bold text-[#A66666] uppercase tracking-wider mb-2 shadow-2xs">
              <FontAwesomeIcon icon={faClipboardList} className="w-3 h-3" />
              <span>Centralized Booking & Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-[#17233A] tracking-tight">
              My Service Requests
            </h1>
            <p className="text-xs sm:text-sm text-[#4B5563] mt-1">
              Manage active service dispatches, track live arrivals, rebook artisans, and report issues directly to guild inspectors.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/services"
              className="px-4 py-2.5 rounded-xl bg-[#FCFBF8] border border-[#E8E2D8] text-xs font-bold text-[#17233A] hover:bg-white hover:border-[#A66666] transition-all shadow-2xs flex items-center gap-2"
            >
              <span>+ Book New Service</span>
            </Link>
          </div>
        </div>

        {/* REQUESTS SUB-TAB NAVIGATION */}
        <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-2 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-1.5 w-full sm:w-auto bg-[#F8F6F2] p-1 rounded-2xl border border-[#E8E2D8]">
            <button
              type="button"
              onClick={() => setRequestsTab('active')}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                requestsTab === 'active'
                  ? 'bg-[#17233A] text-white shadow-xs'
                  : 'text-[#6B7280] hover:text-[#17233A]'
              }`}
            >
              <span>Active Requests</span>
              {hasActiveRequest && (
                <span className="w-2 h-2 rounded-full bg-[#A66666] animate-pulse" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setRequestsTab('previous')}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                requestsTab === 'previous'
                  ? 'bg-[#17233A] text-white shadow-xs'
                  : 'text-[#6B7280] hover:text-[#17233A]'
              }`}
            >
              <span>Previous Services</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/20">
                {previousBookings.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setRequestsTab('complaints')}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                requestsTab === 'complaints'
                  ? 'bg-[#17233A] text-white shadow-xs'
                  : 'text-[#6B7280] hover:text-[#17233A]'
              }`}
            >
              <FontAwesomeIcon icon={faFileCircleExclamation} className="w-3.5 h-3.5 text-[#A66666]" />
              <span>Complaints</span>
              {complaints.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#F8E7E7] text-[#A66666] text-[10px] font-extrabold border border-[#E8CECE]">
                  {complaints.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* TAB 1: ACTIVE REQUESTS */}
        {requestsTab === 'active' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A66666] animate-pulse" />
                <h2 className="text-lg sm:text-xl font-bold font-display text-[#17233A]">
                  Active Service Dispatch
                </h2>
              </div>
              <span className="text-xs text-[#6B7280]">Live ETA Updates</span>
            </div>

            {!hasActiveRequest ? (
              <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-8 sm:p-12 text-center space-y-4 shadow-2xs">
                <div className="w-16 h-16 rounded-full bg-[#F8F6F2] border border-[#E8E2D8] text-[#A66666] flex items-center justify-center mx-auto text-2xl shadow-2xs">
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="text-base sm:text-lg font-bold font-display text-[#17233A]">
                    No active dispatches right now
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B7280]">
                    All your ongoing service requests will appear here with live GPS & ETA tracking.
                  </p>
                </div>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#A66666] hover:bg-[#8F5555] text-white font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
                >
                  <span>Book New Service</span>
                  <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              /* Active Request Card with Track, Chat, Call, Raise Complaint buttons */
              <div className="bg-[#FCFBF8] border-2 border-[#A66666] rounded-[24px] p-5 sm:p-6 shadow-md relative overflow-hidden transition-all space-y-5">
                <div className="absolute top-0 right-0 bg-[#A66666] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>Live Dispatch</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#F8F6F2] border border-[#E8E2D8] flex items-center justify-center shrink-0 shadow-2xs relative">
                        {activeBooking.worker?.avatarUrl ? (
                          <img
                            src={activeBooking.worker.avatarUrl}
                            alt={activeBooking.worker.fullName}
                            className="w-full h-full rounded-2xl object-cover"
                          />
                        ) : (
                          <span className="text-2xl">{activeBooking.service?.iconEmoji || '🛠️'}</span>
                        )}
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#4E8A57] text-white flex items-center justify-center text-[10px] border-2 border-white">
                          ✓
                        </span>
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-[#A66666] bg-[#F8E7E7] px-2.5 py-0.5 rounded-full border border-[#E8CECE]">
                            {activeBooking.bookingId || 'BK-1001'}
                          </span>
                          <span className="text-xs text-[#6B7280] font-medium">
                            Booked {activeBooking.bookingDate || 'Today'}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-extrabold font-display text-[#17233A] leading-snug">
                          {activeBooking.service?.title || 'Emergency Electrical Repair'}
                        </h3>

                        <p className="text-xs text-[#4B5563] flex items-center gap-1.5 font-medium">
                          <FontAwesomeIcon icon={faUserGear} className="text-[#A66666] w-3 h-3" />
                          <span>Artisan: <strong>{activeBooking.worker?.fullName || 'Rajesh Kumar'}</strong></span>
                          <span className="text-[#6B7280]">({activeBooking.worker?.cooperative || 'Lajpat Nagar Guild'})</span>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-[#E8E2D8]">
                      <div className="flex items-center gap-2 text-xs text-[#374151] font-medium bg-[#F8F6F2] p-2.5 rounded-xl border border-[#E8E2D8]">
                        <FontAwesomeIcon icon={faClock} className="text-[#A66666] w-3.5 h-3.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-[#6B7280] uppercase font-bold">Status / ETA</p>
                          <p className="font-bold text-[#17233A]">
                            {activeBooking.status || 'Accepted'} ({activeBooking.etaMinutes || 14} min ETA)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#374151] font-medium bg-[#F8F6F2] p-2.5 rounded-xl border border-[#E8E2D8]">
                        <FontAwesomeIcon icon={faLocationDot} className="text-[#A66666] w-3.5 h-3.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] text-[#6B7280] uppercase font-bold">Service Location</p>
                          <p className="font-bold text-[#17233A] truncate">
                            {activeBooking.address || 'B-42 Lajpat Nagar II, New Delhi'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 flex flex-col justify-center items-stretch gap-2.5 bg-[#F8F6F2] p-4 rounded-2xl border border-[#E8E2D8]">
                    <div className="text-left w-full">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#A66666] bg-[#F8E7E7] px-2.5 py-0.5 rounded-full border border-[#E8CECE] inline-block mb-1">
                        Dispatch In Progress
                      </span>
                      <p className="text-xs text-[#4B5563] font-medium">
                        Artisan is assigned and navigating to address.
                      </p>
                    </div>
                  </div>
                </div>

                {/* FAST-ENTRY ACTION BUTTONS FOR ACTIVE REQUEST CARD: [ Track ] [ Chat ] [ Call ] [ Raise Complaint ] */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-[#E8E2D8]">
                  <Link
                    to={`/tracking/${activeBooking.bookingId || 'BK-1001'}`}
                    className="py-3 px-3 rounded-xl bg-[#A66666] hover:bg-[#8F5555] text-white font-bold font-display text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer text-center"
                  >
                    <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
                    <span>Track</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setActiveContactModal({ type: 'chat', worker: activeBooking.worker })}
                    className="py-3 px-3 rounded-xl bg-white hover:bg-[#F8F6F2] text-[#17233A] border border-[#E8E2D8] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <FontAwesomeIcon icon={faComments} className="w-3.5 h-3.5 text-[#A66666]" />
                    <span>Chat</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveContactModal({ type: 'call', worker: activeBooking.worker })}
                    className="py-3 px-3 rounded-xl bg-white hover:bg-[#F8F6F2] text-[#17233A] border border-[#E8E2D8] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <FontAwesomeIcon icon={faPhone} className="w-3.5 h-3.5 text-[#4E8A57]" />
                    <span>Call</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenRaiseComplaint(activeBooking)}
                    className="py-3 px-3 rounded-xl bg-[#F8E7E7] hover:bg-[#F1D6D6] text-[#A66666] border border-[#E8CECE] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <FontAwesomeIcon icon={faFileCircleExclamation} className="w-3.5 h-3.5" />
                    <span>Raise Complaint</span>
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* TAB 2: PREVIOUS SERVICES */}
        {requestsTab === 'previous' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
              <h2 className="text-lg sm:text-xl font-bold font-display text-[#17233A]">
                Previous Services History
              </h2>
              <span className="text-xs text-[#6B7280] font-medium">
                {hasPreviousRequests ? `${previousBookings.length} completed jobs` : '0 completed jobs'}
              </span>
            </div>

            {!hasPreviousRequests ? (
              <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-8 sm:p-12 text-center space-y-4 shadow-2xs">
                <div className="w-16 h-16 rounded-full bg-[#F8F6F2] border border-[#E8E2D8] text-[#A66666] flex items-center justify-center mx-auto text-2xl shadow-2xs">
                  <FontAwesomeIcon icon={faClipboardList} />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="text-base sm:text-lg font-bold font-display text-[#17233A]">
                    No service requests yet
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B7280]">
                    Explore verified local cooperative artisans and book trusted home services.
                  </p>
                </div>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#A66666] hover:bg-[#8F5555] text-white font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
                >
                  <span>Explore Services</span>
                  <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {previousBookings.map((item) => (
                  <div
                    key={item.bookingId}
                    className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[20px] p-5 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md transition-all group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] flex items-center justify-center shrink-0 text-xl shadow-2xs">
                            {item.service?.iconEmoji || '🛠️'}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                              {item.bookingId} • {item.completedDate}
                            </span>
                            <h3 className="text-sm sm:text-base font-bold font-display text-[#17233A] leading-tight group-hover:text-[#A66666] transition-colors">
                              {item.service?.title}
                            </h3>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4E8A57] bg-[#E8F3EC] px-2.5 py-0.5 rounded-full border border-[#C9E2D2]">
                          <FontAwesomeIcon icon={faCircleCheck} className="w-3 h-3" />
                          <span>Completed</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {item.worker?.avatarUrl ? (
                            <img
                              src={item.worker.avatarUrl}
                              alt={item.worker.fullName}
                              className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#E8E2D8]"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#E8E2D8] flex items-center justify-center text-xs font-bold text-[#17233A]">
                              {item.worker?.fullName ? item.worker.fullName[0] : 'W'}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-[#17233A] truncate">{item.worker?.fullName}</p>
                            <p className="text-[10px] text-[#6B7280] truncate">{item.worker?.profession}</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0 pl-2">
                          <p className="text-[10px] text-[#6B7280] font-bold uppercase">Amount Paid</p>
                          <p className="font-extrabold text-[#17233A] text-sm">₹{item.amountPaid}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-[#6B7280] pt-1">
                        <span className="flex items-center gap-1 font-bold text-[#17233A]">
                          <FontAwesomeIcon icon={faStar} className="text-amber-500 w-3 h-3" />
                          <span>{item.ratingGiven || 5.0} Rated</span>
                        </span>
                        <span className="truncate max-w-[200px] text-[11px]">
                          {item.address}
                        </span>
                      </div>
                    </div>

                    {/* FAST-ENTRY ACTION BUTTONS FOR COMPLETED SERVICE CARD: [ Book Again ] [ View Invoice ] [ Raise Complaint ] */}
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#E8E2D8]">
                      <button
                        type="button"
                        onClick={() => handleBookAgain(item.service?.id, item.worker?.id)}
                        className="py-2.5 px-2.5 rounded-xl bg-[#A66666] hover:bg-[#8F5555] text-white text-[11px] sm:text-xs font-bold font-display transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs active:scale-95"
                      >
                        <FontAwesomeIcon icon={faRotateRight} className="w-3 h-3" />
                        <span>Book Again</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedReceipt(item)}
                        className="py-2.5 px-2.5 rounded-xl bg-[#F8F6F2] hover:bg-[#E8E2D8] text-[#17233A] border border-[#E8E2D8] text-[11px] sm:text-xs font-bold font-display transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs active:scale-95"
                      >
                        <FontAwesomeIcon icon={faReceipt} className="w-3 h-3 text-[#6B7280]" />
                        <span>View Invoice</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenRaiseComplaint(item)}
                        className="py-2.5 px-2.5 rounded-xl bg-[#F8F6F2] hover:bg-[#F8E7E7] text-[#A66666] border border-[#E8CECE] text-[11px] sm:text-xs font-bold font-display transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs active:scale-95"
                      >
                        <FontAwesomeIcon icon={faFileCircleExclamation} className="w-3 h-3" />
                        <span>Raise Complaint</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 3: COMPLAINTS */}
        {requestsTab === 'complaints' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
              <div>
                <h2 className="text-lg sm:text-xl font-bold font-display text-[#17233A]">
                  Guild Complaints & Governance Ledger
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Track guild investigations, inspector reviews, and dispute resolutions.
                </p>
              </div>
              <span className="text-xs text-[#6B7280] font-medium">
                {complaints.length} Filed
              </span>
            </div>

            {/* Cooperative Governance Notice Banner */}
            <div className="bg-[#F8F6F2] border border-[#E8E2D8] rounded-2xl p-4 flex items-center gap-3 text-xs text-[#17233A] font-medium shadow-2xs">
              <FontAwesomeIcon icon={faShieldHalved} className="text-[#A66666] w-5 h-5 shrink-0" />
              <div>
                <p className="font-bold text-[#17233A]">Cooperative Guild Protection Guarantee</p>
                <p className="text-[#6B7280]">
                  Your complaint is reviewed by the regional cooperative guild and assigned officer.
                </p>
              </div>
            </div>

            {complaints.length === 0 ? (
              <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-8 sm:p-12 text-center space-y-4 shadow-2xs">
                <div className="w-16 h-16 rounded-full bg-[#F8F6F2] border border-[#E8E2D8] text-[#4E8A57] flex items-center justify-center mx-auto text-2xl shadow-2xs">
                  <FontAwesomeIcon icon={faShieldHalved} />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="text-base sm:text-lg font-bold font-display text-[#17233A]">
                    No filed complaints
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B7280]">
                    All your service experiences are protected with 100% cooperative guild assurance.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {complaints.map((cmp) => (
                  <div
                    key={cmp.complaintId}
                    className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[20px] p-5 space-y-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-[#A66666] bg-[#F8E7E7] px-2 py-0.5 rounded-full border border-[#E8CECE]">
                            {cmp.complaintId} • {cmp.submittedDate}
                          </span>
                          <h3 className="text-sm sm:text-base font-bold font-display text-[#17233A] mt-1">
                            {cmp.category}
                          </h3>
                          <p className="text-xs text-[#6B7280]">Order #{cmp.bookingId} ({cmp.serviceTitle})</p>
                        </div>

                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border shrink-0 ${getStatusBadgeStyle(cmp.currentStatus)}`}>
                          {cmp.currentStatus}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-xs space-y-1">
                        <div className="flex items-center justify-between text-[#17233A] font-bold">
                          <span>Artisan: {cmp.workerName}</span>
                        </div>
                        <p className="text-[10px] text-[#6B7280]">{cmp.workerCooperative}</p>
                        <p className="text-xs text-[#4B5563] pt-1 line-clamp-2">"{cmp.description}"</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E8E2D8] flex items-center justify-between">
                      <span className="text-[10px] text-[#6B7280] font-medium truncate max-w-[200px]">
                        {cmp.assignedOfficer}
                      </span>

                      <button
                        type="button"
                        onClick={() => setViewingComplaint(cmp)}
                        className="py-2 px-3.5 rounded-xl bg-[#17233A] hover:bg-[#0F172A] text-white text-xs font-bold font-display transition-all cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* COMPLAINT MODAL (RAISE A COMPLAINT FORM) */}
      {raisingComplaintOrder && (
        <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[28px] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setRaisingComplaintOrder(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F8F6F2] hover:bg-[#E8E2D8] text-[#17233A] flex items-center justify-center transition-all cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1.5 border-b border-[#E8E2D8] pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#F8E7E7] border border-[#E8CECE] text-[10px] font-bold text-[#A66666] uppercase">
                <FontAwesomeIcon icon={faFileCircleExclamation} />
                <span>Guild Governance Portal</span>
              </div>
              <h3 className="text-xl font-bold font-display text-[#17233A]">
                Raise a Complaint
              </h3>
              <p className="text-xs text-[#6B7280]">
                Report service discrepancies directly to the regional cooperative inspector desk.
              </p>
            </div>

            {/* Auto-filled Order Info Pill */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-xs font-bold text-[#17233A]">
              <div>
                <p className="text-[10px] text-[#6B7280] font-normal">Service</p>
                <p className="truncate">{raisingComplaintOrder.service?.title || raisingComplaintOrder.serviceTitle || 'Home Service'}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#6B7280] font-normal">Order ID</p>
                <p>{raisingComplaintOrder.bookingId || 'BK-1001'}</p>
              </div>
            </div>

            {/* Complaint Form */}
            <form onSubmit={handleSubmitComplaint} className="space-y-4">
              {/* Complaint Type Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#17233A]">Complaint Type</label>
                <select
                  value={complaintType}
                  onChange={(e) => setComplaintType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-xs font-bold text-[#17233A] focus:outline-none focus:border-[#A66666]"
                >
                  <option value="Worker Arrived Late">Worker Arrived Late</option>
                  <option value="Poor Service Quality">Poor Service Quality</option>
                  <option value="Incomplete Work">Incomplete Work</option>
                  <option value="Worker Misbehavior">Worker Misbehavior</option>
                  <option value="Overcharging">Overcharging</option>
                  <option value="Safety Concern">Safety Concern</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Description Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#17233A]">Description of Issue</label>
                <textarea
                  rows="3"
                  required
                  value={complaintDescription}
                  onChange={(e) => setComplaintDescription(e.target.value)}
                  placeholder="Describe the issue experienced during or after service..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-xs text-[#17233A] focus:outline-none focus:border-[#A66666]"
                />
              </div>

              {/* Upload Evidence & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#17233A]">Upload Evidence</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={evidenceFileName}
                      onChange={(e) => setEvidenceFileName(e.target.value)}
                      placeholder="photo_evidence.jpg"
                      className="w-full px-3 py-2 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-xs text-[#17233A] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setEvidenceFileName('attached_evidence.jpg')}
                      className="px-2.5 py-2 rounded-xl bg-[#F8F6F2] hover:bg-[#E8E2D8] text-[#17233A] border border-[#E8E2D8] text-xs font-bold shrink-0 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faUpload} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#17233A]">Priority</label>
                  <select
                    value={complaintPriority}
                    onChange={(e) => setComplaintPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-xs font-bold text-[#17233A] focus:outline-none"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Cooperative Governance Notice Banner */}
              <div className="bg-[#F8F6F2] border border-[#E8E2D8] rounded-xl p-3 flex items-center gap-2.5 text-xs text-[#17233A]">
                <FontAwesomeIcon icon={faShieldHalved} className="text-[#A66666] w-4 h-4 shrink-0" />
                <p className="text-[11px] leading-snug">
                  Your complaint is reviewed by the regional cooperative guild and assigned officer.
                </p>
              </div>

              {/* Actions: Cancel & Submit Complaint */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRaisingComplaintOrder(null)}
                  className="flex-1 py-3 rounded-xl bg-[#F8F6F2] hover:bg-[#E8E2D8] text-[#17233A] font-bold text-xs transition-all border border-[#E8E2D8] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#A66666] hover:bg-[#8F5555] text-white font-bold text-xs transition-all shadow-sm cursor-pointer"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POST SUBMISSION CONFIRMATION MODAL */}
      {submittedComplaintResult && (
        <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FCFBF8] border-2 border-[#4E8A57] rounded-[28px] max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="w-12 h-12 rounded-full bg-[#E8F3EC] text-[#4E8A57] flex items-center justify-center text-xl mx-auto border border-[#C9E2D2]">
              <FontAwesomeIcon icon={faCircleCheck} />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold font-display text-[#17233A]">
                Complaint Successfully Filed
              </h3>
              <p className="text-xs text-[#6B7280]">
                Logged in regional cooperative inspector ledger.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#E8E2D8] space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-[#E8E2D8] pb-2">
                <span className="text-[#6B7280]">Complaint ID:</span>
                <span className="font-bold text-[#A66666]">{submittedComplaintResult.complaintId}</span>
              </div>
              <div className="flex justify-between border-b border-[#E8E2D8] pb-2">
                <span className="text-[#6B7280]">Status:</span>
                <span className="font-bold text-[#4E8A57]">Submitted (Guild Officer Assigned)</span>
              </div>
              <div className="flex justify-between border-b border-[#E8E2D8] pb-2">
                <span className="text-[#6B7280]">Filed Date:</span>
                <span className="font-bold text-[#17233A]">{submittedComplaintResult.submittedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Expected Resolution:</span>
                <span className="font-bold text-[#17233A]">{submittedComplaintResult.expectedResolution}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSubmittedComplaintResult(null);
                setRequestsTab('complaints');
              }}
              className="w-full py-3.5 rounded-xl bg-[#17233A] hover:bg-[#0F172A] text-white font-bold text-xs transition-all shadow-sm cursor-pointer"
            >
              View in Complaints Ledger
            </button>
          </div>
        </div>
      )}

      {/* COMPLAINT DETAILS & 5-STAGE TIMELINE MODAL */}
      {viewingComplaint && (
        <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[28px] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setViewingComplaint(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F8F6F2] hover:bg-[#E8E2D8] text-[#17233A] flex items-center justify-center transition-all cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="space-y-1 border-b border-[#E8E2D8] pb-4">
              <span className="text-[10px] font-bold text-[#A66666] bg-[#F8E7E7] px-2.5 py-0.5 rounded-full border border-[#E8CECE]">
                {viewingComplaint.complaintId} • Order #{viewingComplaint.bookingId}
              </span>
              <h3 className="text-lg font-bold font-display text-[#17233A] mt-2">
                {viewingComplaint.category}
              </h3>
              <p className="text-xs text-[#6B7280]">
                Artisan: <strong>{viewingComplaint.workerName}</strong> ({viewingComplaint.workerCooperative})
              </p>
            </div>

            {/* Governance Officer Notice */}
            <div className="bg-[#F8F6F2] border border-[#E8E2D8] rounded-xl p-3 text-xs text-[#17233A] font-medium flex items-center gap-2.5">
              <FontAwesomeIcon icon={faUserCheck} className="text-[#4E8A57] w-4 h-4 shrink-0" />
              <div>
                <p className="font-bold text-[#17233A]">{viewingComplaint.assignedOfficer}</p>
                <p className="text-[10px] text-[#6B7280]">Assigned regional cooperative guild inspector.</p>
              </div>
            </div>

            {/* 5-STAGE STATUS TIMELINE */}
            <div className="space-y-3 pt-1">
              <h4 className="text-xs font-bold text-[#17233A] uppercase tracking-wider">5-Stage Status Timeline</h4>
              
              <div className="space-y-4 border-l-2 border-[#E8E2D8] ml-2.5 pl-4">
                {COMPLAINT_STAGES.map((stepStatus, sIdx) => {
                  const mappedCurrent = viewingComplaint.currentStatus === 'Submitted' ? 'Complaint Filed' : viewingComplaint.currentStatus === 'Under Review' ? 'Guild Officer Assigned' : viewingComplaint.currentStatus === 'Guild Investigation' ? 'Investigation In Progress' : viewingComplaint.currentStatus;
                  const stepIndex = COMPLAINT_STAGES.indexOf(mappedCurrent) !== -1 ? COMPLAINT_STAGES.indexOf(mappedCurrent) : 1;
                  const isCurrent = mappedCurrent === stepStatus;
                  const isPassed = sIdx <= stepIndex;

                  return (
                    <div key={stepStatus} className="relative space-y-1">
                      <span className={`absolute -left-[24.5px] top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center text-[9px] ${
                        isPassed ? 'border-[#4E8A57] text-[#4E8A57]' : 'border-[#E8E2D8] text-transparent'
                      }`}>
                        {isPassed ? '✓' : ''}
                      </span>

                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-bold ${isCurrent ? 'text-[#A66666]' : isPassed ? 'text-[#17233A]' : 'text-[#6B7280]'}`}>
                          {stepStatus} {isCurrent && '(Current Stage)'}
                        </p>
                      </div>

                      {viewingComplaint.timeline && viewingComplaint.timeline[sIdx] && (
                        <p className="text-[11px] text-[#6B7280] leading-snug">
                          {viewingComplaint.timeline[sIdx].note} ({viewingComplaint.timeline[sIdx].timestamp})
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Description & Evidence Details */}
            <div className="space-y-2 pt-2 border-t border-[#E8E2D8] text-xs">
              <div>
                <p className="font-bold text-[#17233A]">Filed Description:</p>
                <p className="text-[#4B5563] italic mt-0.5 font-medium">"{viewingComplaint.description}"</p>
              </div>

              {viewingComplaint.evidenceName && (
                <div className="flex items-center justify-between bg-[#F8F6F2] p-2.5 rounded-xl border border-[#E8E2D8] text-xs">
                  <span className="text-[#6B7280] font-medium">Attached Evidence:</span>
                  <span className="font-bold text-[#17233A]">{viewingComplaint.evidenceName}</span>
                </div>
              )}
            </div>

            {/* Close CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setViewingComplaint(null)}
                className="w-full py-3 rounded-xl bg-[#17233A] hover:bg-[#0F172A] text-white font-bold text-xs transition-all cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT (CHAT / CALL) ACTION MODAL FOR ACTIVE CARDS */}
      {activeContactModal && (
        <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] max-w-sm w-full p-6 space-y-5 shadow-2xl relative text-center">
            <button
              type="button"
              onClick={() => setActiveContactModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F8F6F2] hover:bg-[#E8E2D8] text-[#17233A] flex items-center justify-center transition-all cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-full bg-[#F8F6F2] border border-[#E8E2D8] text-[#17233A] flex items-center justify-center mx-auto text-xl shadow-2xs">
              <FontAwesomeIcon icon={activeContactModal.type === 'chat' ? faComments : faPhone} className={activeContactModal.type === 'chat' ? 'text-[#A66666]' : 'text-[#4E8A57]'} />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold font-display text-[#17233A]">
                {activeContactModal.type === 'chat' ? 'Direct Artisan Chat' : 'Direct Call Dispatch'}
              </h3>
              <p className="text-xs text-[#6B7280]">
                Contacting <strong>{activeContactModal.worker?.fullName || 'Assigned Artisan'}</strong>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-xs text-[#374151] font-medium">
              {activeContactModal.type === 'chat'
                ? '💬 Live end-to-end encrypted chat channel active with your assigned guild artisan.'
                : '📞 Calling +91 98765-43210 (Masked Cooperative Dispatch Number).'}
            </div>

            <button
              type="button"
              onClick={() => setActiveContactModal(null)}
              className="w-full py-3 rounded-xl bg-[#17233A] text-white font-bold text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] max-w-md w-full p-6 space-y-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F8F6F2] hover:bg-[#E8E2D8] text-[#17233A] flex items-center justify-center transition-all cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1.5 border-b border-[#E8E2D8] pb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F8E7E7] border border-[#E8CECE] text-[#A66666] flex items-center justify-center mx-auto text-xl shadow-2xs mb-2">
                <FontAwesomeIcon icon={faReceipt} />
              </div>
              <h3 className="text-lg font-bold font-display text-[#17233A]">
                Service Invoice Statement
              </h3>
              <p className="text-xs text-[#6B7280]">
                Transaction ID: <span className="font-bold text-[#17233A]">{selectedReceipt.bookingId}</span>
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center bg-[#F8F6F2] p-3 rounded-xl border border-[#E8E2D8]">
                <div>
                  <p className="font-bold text-[#17233A] text-sm">{selectedReceipt.service?.title}</p>
                  <p className="text-[#6B7280]">{selectedReceipt.completedDate}</p>
                </div>
                <span className="text-xs font-bold text-[#4E8A57] bg-[#E8F3EC] px-2 py-0.5 rounded-full border border-[#C9E2D2]">
                  Paid ✓
                </span>
              </div>

              <div className="space-y-1.5 p-3 rounded-xl border border-[#E8E2D8]">
                <p className="text-[10px] font-bold text-[#6B7280] uppercase">Fulfilled By Artisan</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#17233A]">{selectedReceipt.worker?.fullName}</span>
                  <span className="text-[#6B7280]">{selectedReceipt.worker?.profession}</span>
                </div>
                <p className="text-[10px] text-[#6B7280]">{selectedReceipt.worker?.cooperative}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#E8E2D8]">
                <div className="flex justify-between text-[#6B7280]">
                  <span>Base Service Fee</span>
                  <span>₹{(selectedReceipt.amountPaid || 499) - 49}</span>
                </div>
                <div className="flex justify-between text-[#6B7280]">
                  <span>Cooperative Protection & Guarantee</span>
                  <span>₹49</span>
                </div>
                <div className="flex justify-between font-extrabold text-[#17233A] text-sm pt-2 border-t border-[#E8E2D8]">
                  <span>Total Amount Paid</span>
                  <span className="text-[#A66666]">₹{selectedReceipt.amountPaid}</span>
                </div>
              </div>

              <div className="text-[10px] text-[#6B7280] text-center pt-2">
                <FontAwesomeIcon icon={faShieldHalved} className="text-[#4E8A57] mr-1" />
                Protected by 100% Cooperative Escrow Guarantee
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-[#F8F6F2] hover:bg-[#E8E2D8] text-[#17233A] font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-[#E8E2D8] cursor-pointer"
              >
                <FontAwesomeIcon icon={faPrint} />
                <span>Print / PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#17233A] hover:bg-[#0F172A] text-white font-bold text-xs transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
}
