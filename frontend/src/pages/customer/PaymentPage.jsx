import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faShieldHalved,
  faCreditCard,
  faMoneyBill1,
  faWallet,
  faLock,
  faCircleCheck,
  faArrowRight,
  faQrcode
} from '@fortawesome/free-solid-svg-icons';
import CustomerHeader from '../../components/customer/CustomerHeader';
import BottomNavigation from '../../components/customer/BottomNavigation';
import { SERVICES_DATA } from '../../data/servicesData';
import { getWorkerById } from '../../data/workersData';
import { useBooking } from '../../context/BookingContext';

export default function PaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { bookingDetails, createNewBooking } = useBooking();

  const serviceId = searchParams.get('service') || 'electrical';
  const workerId = searchParams.get('workerId') || 'el-1';

  const service = SERVICES_DATA[serviceId] || SERVICES_DATA['electrical'];
  const worker = getWorkerById(workerId) || WORKERS_DATA[0];

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'wallet' | 'cash'
  const [upiId, setUpiId] = useState('surya@okicici');
  const [isProcessing, setIsProcessing] = useState(false);

  const basePrice = worker?.basePrice || 420;
  const platformFee = 25;
  const taxes = Math.round(basePrice * 0.05);
  const totalPrice = basePrice + platformFee + taxes;

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const newBooking = await createNewBooking(serviceId, workerId, {
        paymentMethod,
        totalPaid: totalPrice
      });

      const trackingId = newBooking?.bookingId || newBooking?.bookingCode || 'GS-202609-87459';
      navigate(`/tracking/${trackingId}`);
    } catch (err) {
      console.error('Payment error:', err);
      navigate('/requests');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#17233A] relative pb-20 md:pb-12 font-sans">
      <CustomerHeader />

      <main className="w-[95%] max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs font-medium text-[#6B7280]">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li><Link to="/" className="hover:text-[#17233A]">Home</Link></li>
            <li><FontAwesomeIcon icon={faChevronRight} className="w-2 h-2 text-[#A66666]" /></li>
            <li><Link to="/booking" className="hover:text-[#17233A]">Booking</Link></li>
            <li><FontAwesomeIcon icon={faChevronRight} className="w-2 h-2 text-[#A66666]" /></li>
            <li className="text-[#17233A] font-bold">Payment Gateway</li>
          </ol>
        </nav>

        <div className="space-y-1 border-b border-[#E8E2D8] pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCFBF8] border border-[#E8E2D8] text-xs font-bold text-[#A66666]">
            <FontAwesomeIcon icon={faShieldHalved} className="w-3.5 h-3.5" />
            <span>Cooperative Escrow Protected</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#17233A]">
            Select Payment Method
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Left 7 Cols: Payment Methods */}
          <form onSubmit={handleConfirmPayment} className="md:col-span-7 bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-6 space-y-6 shadow-xs">
            <h2 className="text-base font-bold font-display text-[#17233A] border-b border-[#E8E2D8] pb-3">
              Payment Method
            </h2>

            {/* Payment Options */}
            <div className="space-y-3">
              
              {/* UPI */}
              <div
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'upi'
                    ? 'border-[#A66666] bg-[#A66666]/5 font-bold'
                    : 'border-[#E8E2D8] bg-[#F8F6F2] hover:bg-[#E8E2D8]/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faQrcode} className="w-5 h-5 text-[#A66666]" />
                  <div>
                    <p className="text-sm font-bold text-[#17233A]">UPI (Google Pay / PhonePe / Paytm)</p>
                    <p className="text-xs text-[#6B7280]">Instant zero-fee transfer</p>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'upi'} readOnly />
              </div>

              {/* CARD */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'card'
                    ? 'border-[#A66666] bg-[#A66666]/5 font-bold'
                    : 'border-[#E8E2D8] bg-[#F8F6F2] hover:bg-[#E8E2D8]/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faCreditCard} className="w-5 h-5 text-[#A66666]" />
                  <div>
                    <p className="text-sm font-bold text-[#17233A]">Credit / Debit Card</p>
                    <p className="text-xs text-[#6B7280]">Visa, MasterCard, RuPay</p>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'card'} readOnly />
              </div>

              {/* WALLET */}
              <div
                onClick={() => setPaymentMethod('wallet')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'wallet'
                    ? 'border-[#A66666] bg-[#A66666]/5 font-bold'
                    : 'border-[#E8E2D8] bg-[#F8F6F2] hover:bg-[#E8E2D8]/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faWallet} className="w-5 h-5 text-[#A66666]" />
                  <div>
                    <p className="text-sm font-bold text-[#17233A]">Digital Wallet</p>
                    <p className="text-xs text-[#6B7280]">Paytm Wallet, Amazon Pay, Mobikwik</p>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'wallet'} readOnly />
              </div>

              {/* CASH */}
              <div
                onClick={() => setPaymentMethod('cash')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'cash'
                    ? 'border-[#A66666] bg-[#A66666]/5 font-bold'
                    : 'border-[#E8E2D8] bg-[#F8F6F2] hover:bg-[#E8E2D8]/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faMoneyBill1} className="w-5 h-5 text-[#A66666]" />
                  <div>
                    <p className="text-sm font-bold text-[#17233A]">Cash on Service Completion</p>
                    <p className="text-xs text-[#6B7280]">Pay worker directly after job completion</p>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'cash'} readOnly />
              </div>

            </div>

            {/* Input detail for UPI */}
            {paymentMethod === 'upi' && (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-[#17233A]">Enter VPA / UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. username@upi"
                  className="w-full p-3 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-xs focus:outline-none focus:border-[#A66666]"
                />
              </div>
            )}

            {/* Confirm CTA */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-[#A66666] hover:bg-[#8F5555] disabled:opacity-60 text-white font-bold font-display text-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <FontAwesomeIcon icon={faLock} className="w-4 h-4" />
              <span>{isProcessing ? 'Securing Escrow Payment...' : `Pay ₹${totalPrice} & Confirm Booking`}</span>
            </button>
          </form>

          {/* Right 5 Cols: Fare Summary */}
          <div className="md:col-span-5 bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] p-6 space-y-4 shadow-xs h-fit">
            <h2 className="text-base font-bold font-display text-[#17233A] border-b border-[#E8E2D8] pb-3">
              Order Summary
            </h2>

            <div className="space-y-2 text-xs text-[#6B7280]">
              <div className="flex justify-between">
                <span>Service ({service.name})</span>
                <span className="font-bold text-[#17233A]">₹{basePrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Worker ({worker.fullName})</span>
                <span className="text-[#A66666] font-bold">Assigned</span>
              </div>
              <div className="flex justify-between">
                <span>Cooperative Platform Fee</span>
                <span className="font-bold text-[#17233A]">₹{platformFee}</span>
              </div>
              <div className="flex justify-between">
                <span>GST & Taxes (5%)</span>
                <span className="font-bold text-[#17233A]">₹{taxes}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8E2D8] flex justify-between items-center text-sm font-extrabold text-[#17233A]">
              <span>Total Payable</span>
              <span className="text-lg text-[#A66666] font-display">₹{totalPrice}</span>
            </div>

            <div className="bg-[#F8F6F2] p-3 rounded-xl text-[11px] text-[#6B7280] space-y-1">
              <span className="font-bold text-[#17233A] flex items-center gap-1">
                <FontAwesomeIcon icon={faCircleCheck} className="text-[#A66666]" />
                100% Cooperative Guarantee
              </span>
              <p>Funds held securely in guild escrow until you confirm job satisfaction.</p>
            </div>
          </div>

        </div>

      </main>

      <BottomNavigation activeTab="bookings" />
    </div>
  );
}
