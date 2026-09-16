import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import CustomerHomePage from './pages/customer/CustomerHomePage';
import AllServicesPage from './pages/customer/AllServicesPage';
import ServiceDetailPage from './pages/customer/ServiceDetailPage';
import ServiceListingPage from './pages/customer/ServiceListingPage';
import WorkerProfilePage from './pages/customer/WorkerProfilePage';
import BookingPage from './pages/customer/BookingPage';
import PaymentPage from './pages/customer/PaymentPage';
import LiveTrackingPage from './pages/customer/LiveTrackingPage';
import ReviewPage from './pages/customer/ReviewPage';
import EmergencyBookingPage from './pages/customer/EmergencyBookingPage';
import RequestsPage from './pages/customer/RequestsPage';
import CommunityPoolPage from './pages/customer/CommunityPoolPage';
import ScrollToTop from './components/common/ScrollToTop';
import SplashScreen from './components/common/SplashScreen';
import LoginModal from './components/common/LoginModal';

function AppContent() {
  const { showSplash, finishSplash } = useAuth();

  return (
    <>
      {showSplash && <SplashScreen onFinish={finishSplash} />}
      <LoginModal />
      <ScrollToTop />
      <Routes>
        {/* 1. Home Page */}
        <Route path="/" element={<CustomerHomePage />} />

        {/* 2. All Services Catalog */}
        <Route path="/services" element={<AllServicesPage />} />

        {/* 3. Service Detail Page */}
        <Route path="/services/:serviceId" element={<ServiceDetailPage />} />

        {/* 4. Worker Listing Page */}
        <Route path="/services/:serviceId/workers" element={<ServiceListingPage />} />
        <Route path="/workers" element={<ServiceListingPage />} />

        {/* 5. Worker Profile Page */}
        <Route path="/worker/:workerId" element={<WorkerProfilePage />} />

        {/* 6. Booking Page */}
        <Route path="/booking" element={<BookingPage />} />

        {/* 7. Payment Page */}
        <Route path="/payment" element={<PaymentPage />} />

        {/* 8. Requests & Booking Management Hub */}
        <Route path="/requests" element={<RequestsPage />} />

        {/* 9. Community Resource Pool Flagship Module */}
        <Route path="/community-pool" element={<CommunityPoolPage />} />

        {/* 10. Live Tracking Page */}
        <Route path="/tracking/:bookingId" element={<LiveTrackingPage />} />
        <Route path="/tracking" element={<LiveTrackingPage />} />

        {/* 11. Review Page */}
        <Route path="/review/:bookingId" element={<ReviewPage />} />
        <Route path="/review" element={<ReviewPage />} />

        {/* 12. Emergency Booking Page */}
        <Route path="/emergency" element={<EmergencyBookingPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

/**
 * Main App Router Component for GigSeva / KAIROVA
 * Implements Guest Mode, SplashScreen & Progressive OTP Auth Architecture
 */
export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </BookingProvider>
    </AuthProvider>
  );
}

