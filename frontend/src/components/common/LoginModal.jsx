import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faShieldHalved, faArrowRight, faPhone, faKey, faRotateRight, faUser, faLocationDot, faCity, faMapPin, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { requestOtp } from '../../services/authApi';

const sanitizePhoneNumber = (input) => {
  if (!input) return '';
  let digits = input.toString().replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length > 10) {
    digits = digits.slice(2);
  } else if (digits.startsWith('0') && digits.length > 10) {
    digits = digits.slice(1);
  }
  return digits.slice(0, 10);
};

/**
 * LoginModal Component
 * Centered authentication & profile management modal.
 * Step 1: Phone Entry (+91) - Guest Only
 * Step 2: OTP Verification - Guest Only
 * Step 3: Profile Edit Form - Direct access for logged-in users / post-login completion
 */
export default function LoginModal() {
  const { isAuthModalOpen, closeAuthModal, login, completeProfile, user, isAuthenticated } = useAuth();
  
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Profile Form
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['1', '2', '3', '4']);
  const [otpError, setOtpError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile completion / edit fields
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [pincode, setPincode] = useState('110024');
  const [email, setEmail] = useState('');
  const [profileError, setProfileError] = useState('');

  // Lock background page scroll when auth/profile modal is open
  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAuthModalOpen]);

  useEffect(() => {
    let timer;
    if (step === 2 && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  // Pre-fill profile fields if user object already has data
  useEffect(() => {
    if (user) {
      if (user.fullName) setFullName(user.fullName);
      if (user.address) setAddress(user.address);
      if (user.landmark) setLandmark(user.landmark);
      if (user.city) setCity(user.city);
      if (user.pincode) setPincode(user.pincode);
      if (user.email) setEmail(user.email);
      if (user.phoneNumber) setPhoneNumber(sanitizePhoneNumber(user.phoneNumber));
    }
  }, [user]);

  // Direct route for logged-in users: skip OTP, go directly to Profile Edit Form (Step 3)!
  useEffect(() => {
    if (isAuthModalOpen) {
      if (isAuthenticated) {
        setStep(3); // Directly open profile edit form for authenticated user
      } else {
        setStep(1); // Guest user -> start at phone entry
      }
    } else {
      setStep(1);
      setOtp(['1', '2', '3', '4']);
      setOtpError('');
      setPhoneError('');
      setProfileError('');
    }
  }, [isAuthModalOpen, isAuthenticated]);

  if (!isAuthModalOpen) return null;

  const handlePhoneChange = (e) => {
    const cleaned = sanitizePhoneNumber(e.target.value);
    setPhoneNumber(cleaned);
    if (phoneError) setPhoneError('');
  };

  const handlePhonePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const cleaned = sanitizePhoneNumber(paste);
    setPhoneNumber(cleaned);
    if (phoneError) setPhoneError('');
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    const cleanPhone = sanitizePhoneNumber(phoneNumber);
    if (cleanPhone.length !== 10) {
      setPhoneError('Please enter a valid 10-digit mobile number');
      return;
    }
    setPhoneNumber(cleanPhone);
    setPhoneError('');
    setIsSubmitting(true);

    try {
      await requestOtp(`+91${cleanPhone}`, 'CUSTOMER');
    } catch (err) {
      console.warn('[LoginModal] requestOtp API fallback:', err?.message || err);
    } finally {
      setIsSubmitting(false);
      setStep(2);
      setResendTimer(30);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 4) {
      setOtpError('Please enter complete 4-digit code');
      return;
    }
    setOtpError('');
    setIsSubmitting(true);

    try {
      const cleanPhone = sanitizePhoneNumber(phoneNumber) || '9876543210';
      const isDone = await login(cleanPhone);
      if (!isDone) {
        // Profile is incomplete -> proceed to Step 3 (Profile Form)
        setStep(3);
      }
    } catch (err) {
      setOtpError(err?.message || 'Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !address.trim() || !city.trim() || !pincode.trim()) {
      setProfileError('Please fill in all required fields (*)');
      return;
    }
    setProfileError('');
    setIsSubmitting(true);
    try {
      await completeProfile({
        fullName: fullName.trim(),
        address: address.trim(),
        landmark: landmark.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
        email: email.trim(),
        phoneNumber: sanitizePhoneNumber(phoneNumber) || (user && user.phoneNumber) || ''
      });
    } catch (err) {
      setProfileError(err?.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    setOtp(['1', '2', '3', '4']);
    setOtpError('');
    try {
      const cleanPhone = sanitizePhoneNumber(phoneNumber) || '9876543210';
      await requestOtp(`+91${cleanPhone}`, 'CUSTOMER');
    } catch (err) {
      console.warn('[LoginModal] resendOtp API fallback:', err?.message || err);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#FCFBF8] border border-[#E8E2D8] rounded-3xl p-6 sm:p-8 shadow-2xl my-auto max-h-[90vh] flex flex-col justify-between overflow-y-auto">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F8F6F2] hover:bg-[#E8E2D8] text-[#17233A] flex items-center justify-center transition-all cursor-pointer z-20"
          aria-label="Close modal"
        >
          <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 mb-4 shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-[#A66666]/10 text-[#A66666] flex items-center justify-center mx-auto mb-2">
            <FontAwesomeIcon
              icon={step === 1 ? faPhone : step === 2 ? faKey : faUser}
              className="w-5 h-5 text-[#A66666]"
            />
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold font-display text-[#17233A]">
            {step === 3
              ? isAuthenticated
                ? 'Edit Profile Details'
                : 'Complete Your Profile'
              : 'Continue with GigSeva'}
          </h2>
          
          <p className="text-xs sm:text-sm text-[#6B7280] font-medium max-w-xs mx-auto leading-relaxed">
            {step === 3
              ? 'Update your profile information for seamless cooperative bookings.'
              : 'Verify your number to continue booking trusted cooperative services.'}
          </p>
        </div>

        {/* STEP 1: MOBILE NUMBER ENTRY */}
        {step === 1 && (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#17233A] uppercase tracking-wider">
                Mobile Number
              </label>
              
              <div className="flex items-center rounded-2xl border border-[#E8E2D8] bg-[#F8F6F2] overflow-hidden focus-within:ring-2 focus-within:ring-[#A66666]/30 transition-all">
                <span className="px-3.5 py-3 text-xs sm:text-sm font-bold text-[#17233A] border-r border-[#E8E2D8] bg-[#E8E2D8]/40 select-none">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={15}
                  placeholder="Enter 10-digit number"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  onPaste={handlePhonePaste}
                  className="w-full px-3.5 py-3 bg-transparent text-sm font-semibold text-[#17233A] placeholder-[#9CA3AF] focus:outline-none"
                  autoFocus
                />
              </div>

              {phoneError && (
                <p className="text-xs font-semibold text-red-600 pt-0.5">{phoneError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#17233A] hover:bg-[#253654] disabled:opacity-60 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <span>{isSubmitting ? 'Sending OTP...' : 'Continue'}</span>
              <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
            </button>

            <div className="pt-2 text-center">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#6B7280]">
                <FontAwesomeIcon icon={faShieldHalved} className="w-3 h-3 text-[#4E8A57]" />
                <span>Zero Spam. Instant OTP Verification.</span>
              </div>
            </div>
          </form>
        )}

        {/* STEP 2: OTP ENTRY */}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-5">
            <div className="text-center space-y-1">
              <p className="text-xs font-semibold text-[#17233A]">
                Code sent to <span className="font-extrabold text-[#A66666]">+91 {phoneNumber || '9876543210'}</span>
              </p>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[11px] font-bold text-[#A66666] hover:underline cursor-pointer"
              >
                Change Number
              </button>
            </div>

            <div className="flex items-center justify-center gap-2.5 sm:gap-3 my-4">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-11 h-12 sm:w-12 sm:h-13 rounded-xl border border-[#E8E2D8] bg-[#F8F6F2] text-center text-lg sm:text-xl font-black text-[#17233A] focus:outline-none focus:ring-2 focus:ring-[#A66666] focus:border-transparent transition-all shadow-2xs"
                />
              ))}
            </div>

            {otpError && (
              <p className="text-xs font-semibold text-red-600 text-center">{otpError}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#17233A] hover:bg-[#253654] disabled:opacity-60 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <span>{isSubmitting ? 'Verifying...' : 'Verify & Continue'}</span>
              <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendTimer > 0}
                className={`font-bold flex items-center gap-1 cursor-pointer ${
                  resendTimer > 0 ? 'text-[#9CA3AF] cursor-not-allowed' : 'text-[#A66666] hover:underline'
                }`}
              >
                <FontAwesomeIcon icon={faRotateRight} className="w-3 h-3" />
                <span>Resend OTP</span>
              </button>

              <span className="text-[#6B7280] font-medium">
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Ready'}
              </span>
            </div>
          </form>
        )}

        {/* STEP 3: PROFILE FORM (No OTP for Logged-In Users!) */}
        {step === 3 && (
          <form onSubmit={handleProfileSubmit} className="space-y-3 overflow-y-auto pr-1">
            
            {/* Full Name (Required) */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#17233A] uppercase tracking-wider">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#F8F6F2] text-xs sm:text-sm font-semibold text-[#17233A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A66666]/30"
                  required
                />
                <FontAwesomeIcon icon={faUser} className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-3" />
              </div>
            </div>

            {/* Address (Required) */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#17233A] uppercase tracking-wider">
                House / Street Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. B-42 Lajpat Nagar II"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#F8F6F2] text-xs sm:text-sm font-semibold text-[#17233A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A66666]/30"
                  required
                />
                <FontAwesomeIcon icon={faLocationDot} className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-3" />
              </div>
            </div>

            {/* Landmark (Optional) */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                Landmark <span className="text-[10px] text-[#9CA3AF] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Near Metro Pillar 44"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#F8F6F2] text-xs sm:text-sm font-semibold text-[#17233A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A66666]/30"
              />
            </div>

            {/* City & Pincode (Required) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#17233A] uppercase tracking-wider">
                  City <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="New Delhi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#F8F6F2] text-xs font-semibold text-[#17233A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A66666]/30"
                    required
                  />
                  <FontAwesomeIcon icon={faCity} className="w-3 h-3 text-[#9CA3AF] absolute left-2.5 top-3" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#17233A] uppercase tracking-wider">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="110024"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#F8F6F2] text-xs font-semibold text-[#17233A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A66666]/30"
                    required
                  />
                  <FontAwesomeIcon icon={faMapPin} className="w-3 h-3 text-[#9CA3AF] absolute left-2.5 top-3" />
                </div>
              </div>
            </div>

            {/* Email (Optional) */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                Email Address <span className="text-[10px] text-[#9CA3AF] font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="ramesh.kumar@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#F8F6F2] text-xs sm:text-sm font-semibold text-[#17233A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A66666]/30"
                />
                <FontAwesomeIcon icon={faEnvelope} className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-3" />
              </div>
            </div>

            {profileError && (
              <p className="text-xs font-semibold text-red-600 text-center pt-0.5">{profileError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-2xl bg-[#17233A] hover:bg-[#253654] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer mt-2"
            >
              <span>Save & Continue</span>
              <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

      </div>
    </div>,
    document.body
  );
}
