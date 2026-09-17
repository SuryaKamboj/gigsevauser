import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faStar,
  faShieldHalved,
  faUpload,
  faCheckCircle,
  faFileImage
} from '@fortawesome/free-solid-svg-icons';
import CustomerHeader from '../../components/customer/CustomerHeader';
import BottomNavigation from '../../components/customer/BottomNavigation';
import { useBooking } from '../../context/BookingContext';
import { fetchBookingById } from '../../services/bookingApi';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400';

export default function ReviewPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { activeBooking, previousBookings } = useBooking();

  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [photo, setPhoto] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [fetchedBooking, setFetchedBooking] = useState(null);

  useEffect(() => {
    if (bookingId && !activeBooking?.worker) {
      fetchBookingById(bookingId)
        .then((res) => {
          const b = res?.data || res?.booking || res;
          if (b) setFetchedBooking(b);
        })
        .catch(() => {});
    }
  }, [bookingId, activeBooking]);

  const worker = activeBooking?.worker || fetchedBooking?.workerId || previousBookings?.[0]?.worker || null;
  const workerName = worker?.fullName || 'Assigned Artisan';
  const workerAvatar = worker?.avatarUrl || worker?.selfieUrl || DEFAULT_AVATAR;
  const workerRole = worker?.profession || worker?.primaryServiceCategory || 'Cooperative Specialist';
  const workerCoop = worker?.cooperative || worker?.societyId?.name || 'Worker Cooperative';

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#17233A] relative pb-20 md:pb-12 font-sans">
      <CustomerHeader />

      <main className="w-[95%] max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs font-medium text-[#6B7280]">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li><Link to="/" className="hover:text-[#17233A]">Home</Link></li>
            <li><FontAwesomeIcon icon={faChevronRight} className="w-2 h-2 text-[#A66666]" /></li>
            <li className="text-[#17233A] font-bold">Leave a Review</li>
          </ol>
        </nav>

        <div className="space-y-1 border-b border-[#E8E2D8] pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCFBF8] border border-[#E8E2D8] text-xs font-bold text-[#A66666]">
            <FontAwesomeIcon icon={faShieldHalved} className="w-3.5 h-3.5" />
            <span>Cooperative Community Feedback</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#17233A]">
            Rate Your Experience
          </h1>
        </div>

        {submitted ? (
          <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[28px] p-10 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#A66666] text-white mx-auto flex items-center justify-center text-2xl">
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <h2 className="text-2xl font-bold font-display text-[#17233A]">Thank You for Your Feedback!</h2>
            <p className="text-xs text-[#6B7280]">Your review supports local cooperative artisans directly. Redirecting to home...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-6 sm:p-8 space-y-6 shadow-xs">
            
            {/* Worker summary header */}
            <div className="flex items-center gap-4 bg-[#F8F6F2] p-4 rounded-2xl border border-[#E8E2D8]">
              <img src={workerAvatar} alt={workerName} className="w-14 h-14 rounded-2xl object-cover border border-[#E8E2D8]" />
              <div>
                <h3 className="text-base font-bold font-display text-[#17233A]">{workerName}</h3>
                <p className="text-xs text-[#6B7280]">{workerRole} • {workerCoop}</p>
              </div>
            </div>

            {/* 1. STAR RATING SELECTOR */}
            <div className="space-y-2 text-center py-2">
              <label className="text-xs font-bold text-[#17233A] block uppercase tracking-wider">
                Overall Service Rating
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-3xl sm:text-4xl transition-transform active:scale-95 cursor-pointer"
                  >
                    <FontAwesomeIcon
                      icon={faStar}
                      className={star <= rating ? 'text-[#A66666]' : 'text-[#E8E2D8]'}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-[#A66666]">
                {rating === 5 ? '★ Outstanding' : rating === 4 ? '★ Very Good' : rating === 3 ? '★ Good' : '★ Needs Improvement'}
              </span>
            </div>

            {/* 2. FEEDBACK TEXTAREA */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#17233A]">
                Written Feedback & Experience Details
              </label>
              <textarea
                rows={4}
                required
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="How was the punctuality, pricing transparency, and work quality?"
                className="w-full p-3.5 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#A66666]"
              />
            </div>

            {/* 3. UPLOAD PHOTO OF COMPLETED WORK */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#17233A] flex items-center gap-1.5">
                <FontAwesomeIcon icon={faFileImage} className="text-[#A66666]" />
                <span>Upload Photo of Finished Work (Optional)</span>
              </label>

              <div className="border-2 border-dashed border-[#E8E2D8] bg-[#F8F6F2] rounded-2xl p-6 text-center hover:border-[#A66666] transition-colors relative cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {photo ? (
                  <div className="flex flex-col items-center space-y-2">
                    <img src={photo} alt="Work completed" className="h-24 rounded-xl object-cover border border-[#E8E2D8]" />
                    <span className="text-xs font-bold text-[#A66666]">Photo Attached</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <FontAwesomeIcon icon={faUpload} className="w-5 h-5 text-[#A66666]" />
                    <p className="text-xs font-bold text-[#17233A]">Upload Photo of Completed Job</p>
                  </div>
                )}
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-[#A66666] hover:bg-[#8F5555] text-white font-bold font-display text-sm active:scale-95 transition-all shadow-md cursor-pointer"
            >
              Submit Review & Complete Order
            </button>

          </form>
        )}

      </main>

      <BottomNavigation activeTab="bookings" />
    </div>
  );
}
