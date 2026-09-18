import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faCalendar,
  faClock,
  faLocationDot,
  faUpload,
  faFileImage,
  faArrowRight,
  faCircleCheck,
  faShieldHalved
} from '@fortawesome/free-solid-svg-icons';
import CustomerHeader from '../../components/customer/CustomerHeader';
import BottomNavigation from '../../components/customer/BottomNavigation';
import { SERVICES_DATA, getServiceById } from '../../data/servicesData';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { fetchWorkerById } from '../../services/workersApi';
import { fetchServiceById } from '../../services/servicesApi';

export default function BookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { bookingDetails, updateBookingDetails, setSelectedServiceId, setSelectedWorkerId } = useBooking();
  const { requireAuth } = useAuth();

  const serviceId = searchParams.get('service') || 'electrical';
  const workerId = searchParams.get('workerId') || 'WK-DEL-001';

  const [service, setService] = useState(() => getServiceById(serviceId));
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (workerId) {
      fetchWorkerById(workerId).then((res) => {
        const w = res?.data || res;
        if (isMounted && w && (w._id || w.fullName)) setWorker(w);
      }).catch(() => {});
    }
    if (serviceId) {
      fetchServiceById(serviceId).then((res) => {
        const s = res?.data || res;
        if (isMounted && s && (s._id || s.name)) setService(s);
      }).catch(() => {});
    }
    return () => { isMounted = false; };
  }, [workerId, serviceId]);

  const [address, setAddress] = useState(bookingDetails.address);
  const [date, setDate] = useState(bookingDetails.date);
  const [timeSlot, setTimeSlot] = useState(bookingDetails.timeSlot);
  const [specialInstructions, setSpecialInstructions] = useState(bookingDetails.specialInstructions);
  const [previewImage, setPreviewImage] = useState(bookingDetails.uploadedImage);

  const resolvedWorkerName = worker?.fullName || 'Verified Cooperative Artisan';
  const resolvedWorkerAvatar = worker?.avatarUrl || worker?.selfieUrl || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400';
  const resolvedWorkerCoop = worker?.societyId?.name || worker?.cooperative || 'South Delhi Worker Cooperative Society';
  const resolvedWorkerPrice = worker?.basePrice || service?.baseLaborPrice || 399;
  const resolvedServiceName = service?.name || 'Home Maintenance Service';

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    requireAuth(() => {
      updateBookingDetails({
        address,
        date,
        timeSlot,
        specialInstructions,
        uploadedImage: previewImage
      });
      const realServiceId = service?._id || serviceId;
      const realWorkerId = worker?._id || workerId;
      setSelectedServiceId(realServiceId);
      setSelectedWorkerId(realWorkerId);
      navigate(`/payment?service=${realServiceId}&workerId=${realWorkerId}`);
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#17233A] relative pb-20 md:pb-12 font-sans selection:bg-[#A66666] selection:text-white">
      <CustomerHeader />

      <main className="w-[95%] max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs font-medium text-[#6B7280]">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li><Link to="/" className="hover:text-[#17233A]">Home</Link></li>
            <li><FontAwesomeIcon icon={faChevronRight} className="w-2 h-2 text-[#A66666]" /></li>
            <li><Link to={`/services/${service.id}`} className="hover:text-[#17233A]">{service.name}</Link></li>
            <li><FontAwesomeIcon icon={faChevronRight} className="w-2 h-2 text-[#A66666]" /></li>
            <li className="text-[#17233A] font-bold">Booking Details</li>
          </ol>
        </nav>

        {/* Page Title */}
        <div className="space-y-1 border-b border-[#E8E2D8] pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCFBF8] border border-[#E8E2D8] text-xs font-bold text-[#A66666]">
            <FontAwesomeIcon icon={faShieldHalved} className="w-3.5 h-3.5" />
            <span>Cooperative Direct Booking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#17233A]">
            Schedule Service Appointment
          </h1>
        </div>

        {/* Service & Worker Summary Pill */}
        <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <img src={resolvedWorkerAvatar} alt={resolvedWorkerName} className="w-12 h-12 rounded-xl object-cover border border-[#E8E2D8]" />
            <div>
              <h3 className="text-sm font-bold text-[#17233A]">{resolvedServiceName}</h3>
              <p className="text-xs text-[#6B7280]">Assigned Worker: <strong>{resolvedWorkerName}</strong> ({resolvedWorkerCoop})</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#6B7280] block">Service Fee</span>
            <span className="text-base font-extrabold text-[#17233A]">₹{resolvedWorkerPrice}</span>
          </div>
        </div>

        {/* BOOKING FORM */}
        <form onSubmit={handleProceedToPayment} className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-6 sm:p-8 space-y-6 shadow-xs">
          
          {/* 1. ADDRESS FIELD */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#17233A] flex items-center gap-1.5">
              <FontAwesomeIcon icon={faLocationDot} className="text-[#A66666]" />
              <span>Service Location Address</span>
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter full address with house number & pincode"
              className="w-full p-3.5 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#A66666]"
            />
          </div>

          {/* 2. DATE & TIME SLOTS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#17233A] flex items-center gap-1.5">
                <FontAwesomeIcon icon={faCalendar} className="text-[#A66666]" />
                <span>Preferred Date</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#A66666]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#17233A] flex items-center gap-1.5">
                <FontAwesomeIcon icon={faClock} className="text-[#A66666]" />
                <span>Preferred Time Slot</span>
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#A66666]"
              >
                <option>15-Min Express Arrival (Urgent)</option>
                <option>09:00 AM - 10:30 AM</option>
                <option>10:30 AM - 12:00 PM</option>
                <option>01:00 PM - 02:30 PM</option>
                <option>03:00 PM - 04:30 PM</option>
                <option>05:00 PM - 06:30 PM</option>
              </select>
            </div>
          </div>

          {/* 3. SPECIAL INSTRUCTIONS */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#17233A]">
              Special Instructions for Worker
            </label>
            <textarea
              rows={3}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Describe the issue in detail (e.g. leaking pipe near bathroom sink, main fuse box tripping)..."
              className="w-full p-3.5 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#A66666]"
            />
          </div>

          {/* 4. UPLOAD IMAGE FIELD */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#17233A] flex items-center gap-1.5">
              <FontAwesomeIcon icon={faFileImage} className="text-[#A66666]" />
              <span>Upload Image / Photo of Issue (Recommended)</span>
            </label>
            <p className="text-xs text-[#6B7280]">
              Example: Upload photo of leaking pipe or broken switchboard for accurate diagnostic quote.
            </p>

            <div className="border-2 border-dashed border-[#E8E2D8] bg-[#F8F6F2] rounded-2xl p-6 text-center hover:border-[#A66666] transition-colors relative cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {previewImage ? (
                <div className="flex flex-col items-center space-y-2">
                  <img src={previewImage} alt="Uploaded Issue" className="h-28 rounded-xl object-cover border border-[#E8E2D8]" />
                  <span className="text-xs font-bold text-[#A66666] flex items-center gap-1">
                    <FontAwesomeIcon icon={faCircleCheck} /> Image Attached Successfully (Click to Change)
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <FontAwesomeIcon icon={faUpload} className="w-6 h-6 text-[#A66666]" />
                  <p className="text-xs font-bold text-[#17233A]">Click or Drag & Drop Photo Here</p>
                  <p className="text-[10px] text-[#6B7280]">Supports JPG, PNG, WEBP up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          {/* CTA: PROCEED TO PAYMENT */}
          <div className="pt-4 border-t border-[#E8E2D8]">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-[#A66666] hover:bg-[#8F5555] text-white font-bold font-display text-base active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Proceed to Payment</span>
              <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
            </button>
          </div>

        </form>
      </main>

      <BottomNavigation activeTab="bookings" />
    </div>
  );
}
