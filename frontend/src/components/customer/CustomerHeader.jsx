import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faChevronDown,
  faBars,
  faXmark,
  faUser,
  faClipboardList,
  faUsers,
  faShieldHalved,
  faRightFromBracket,
  faPenToSquare,
  faMapPin,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';

import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';

export default function CustomerHeader({
  userLocation = {
    address: 'B-42 Lajpat Nagar II, New Delhi',
    pincode: '110024'
  },
  hasUnreadNotifications = true
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeBooking } = useBooking();
  const { isAuthenticated, user, setIsAuthModalOpen, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Lock background page scroll when profile modal is open
  useEffect(() => {
    if (profileModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [profileModalOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayUser = user || {
    fullName: 'Surya Dev Kamboj',
    phoneNumber: '6396323790',
    address: 'B-42 Lajpat Nagar II',
    city: 'New Delhi',
    pincode: '110024'
  };

  const initials = isAuthenticated && displayUser?.fullName
    ? displayUser.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
    : 'G';

  const hasActiveRequest = !!(activeBooking && activeBooking.status !== 'Completed');

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'All Services' },
    { path: '/workers', label: 'Find Workers' },
    { path: '/community-pool', label: 'Community Pool' },
    { path: '/requests', label: 'Requests', hasBadge: hasActiveRequest }
  ];

  return (
    <header className="sticky top-0 z-[999] w-full bg-[#FCFBF8]/90 backdrop-blur-[14px] border-b border-[#E8E2D8] text-[#17233A] shadow-2xs transition-all duration-300">
      <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 h-[60px] sm:h-[72px] flex items-center justify-between gap-2 sm:gap-6">

        {/* Left Section: Brand Logo & Location Selector */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link to="/" className="flex items-center gap-1.5 shrink-0 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#A66666] text-white flex items-center justify-center font-black font-display text-sm sm:text-base group-hover:scale-105 transition-transform duration-200 shadow-2xs">
              G
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-extrabold font-display tracking-tight text-[#17233A] leading-none">
                GigSeva
              </span>
              <span className="text-[9px] font-bold text-[#6B7280] tracking-wide mt-0.5 hidden md:inline-block uppercase">
                Cooperative Platform
              </span>
            </div>
          </Link>

          {/* Location Selector */}
          <button
            type="button"
            className="flex items-center gap-1.5 text-left group focus:outline-none rounded-full px-2.5 sm:px-3.5 py-1 transition-all bg-[#F8F6F2] hover:bg-[#E8E2D8]/50 border border-[#E8E2D8] max-w-[110px] min-[380px]:max-w-[150px] sm:max-w-[240px] min-w-0 shadow-2xs cursor-pointer"
            aria-label="Select Location"
          >
            <FontAwesomeIcon icon={faLocationDot} className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#A66666] shrink-0" />
            <div className="flex items-center gap-0.5 min-w-0 flex-1">
              <p className="text-[10px] sm:text-[11px] font-bold text-[#17233A] truncate">
                {user?.address ? `${user.address}, ${user.city || ''}` : userLocation.address}
              </p>
              <FontAwesomeIcon icon={faChevronDown} className="w-2 h-2 text-[#6B7280] shrink-0 hidden min-[360px]:inline-block" />
            </div>
          </button>
        </div>

        {/* Center Section: Navigation Links (Desktop & Tablet) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-semibold text-[#6B7280] font-display">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative py-1 text-xs font-bold transition-colors duration-200 group ${
                  isActive ? 'text-[#17233A]' : 'text-[#6B7280] hover:text-[#17233A]'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span>{item.label}</span>
                  {item.hasBadge && (
                    <span className="w-2 h-2 rounded-full bg-[#A66666] animate-pulse ring-2 ring-[#FCFBF8]" />
                  )}
                </span>
                <span
                  className={`absolute bottom-0 left-0 h-[2.5px] bg-[#A66666] rounded-full transition-all duration-300 ease-out ${
                    isActive ? 'w-full shadow-2xs' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Member Dropdown Menu / Sign In & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          {/* Member Dropdown Menu */}
          {isAuthenticated ? (
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 p-0.5 sm:pl-1 sm:pr-2.5 sm:py-1 rounded-full bg-[#F8F6F2] hover:bg-[#E8E2D8]/60 border border-[#E8E2D8] text-[#17233A] transition-all cursor-pointer shadow-2xs"
                aria-expanded={userDropdownOpen}
                aria-label="Member Menu"
              >
                <div className="w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 rounded-full bg-[#A66666] text-white text-[10px] sm:text-xs font-black flex items-center justify-center shrink-0">
                  {initials}
                </div>
                <span className="text-xs font-bold text-[#17233A] hidden sm:inline-block max-w-[85px] truncate">
                  {displayUser?.fullName ? displayUser.fullName.split(' ')[0] : 'Member'}
                </span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`w-2.5 h-2.5 text-[#6B7280] transition-transform duration-200 ${
                    userDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu Overlay */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#FCFBF8] border border-[#E8E2D8] shadow-xl py-1.5 z-[1000] text-xs font-semibold text-[#17233A] animate-fadeIn">
                  <div className="px-4 py-2.5 border-b border-[#E8E2D8] mb-1">
                    <p className="font-extrabold text-sm text-[#17233A] truncate">
                      {displayUser?.fullName || 'Member Customer'}
                    </p>
                    <p className="text-[11px] text-[#6B7280] font-mono mt-0.5">
                      {displayUser?.phoneNumber ? `+91 ${displayUser.phoneNumber}` : '+91 9876543210'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setProfileModalOpen(true);
                    }}
                    className="w-full px-4 py-2 flex items-center gap-2.5 hover:bg-[#F8F6F2] text-[#17233A] text-left transition-colors cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faUser} className="w-3.5 h-3.5 text-[#A66666]" />
                    <span>My Profile</span>
                  </button>

                  <Link
                    to="/requests"
                    onClick={() => setUserDropdownOpen(false)}
                    className="w-full px-4 py-2 flex items-center gap-2.5 hover:bg-[#F8F6F2] text-[#17233A] text-left transition-colors cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faClipboardList} className="w-3.5 h-3.5 text-[#A66666]" />
                    <span>My Requests</span>
                  </Link>

                  <Link
                    to="/community-pool"
                    onClick={() => setUserDropdownOpen(false)}
                    className="w-full px-4 py-2 flex items-center gap-2.5 hover:bg-[#F8F6F2] text-[#17233A] text-left transition-colors cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faUsers} className="w-3.5 h-3.5 text-[#A66666]" />
                    <span>Community Pool Orders</span>
                  </Link>

                  <Link
                    to="/requests"
                    onClick={() => setUserDropdownOpen(false)}
                    className="w-full px-4 py-2 flex items-center gap-2.5 hover:bg-[#F8F6F2] text-[#17233A] text-left transition-colors cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faShieldHalved} className="w-3.5 h-3.5 text-[#A66666]" />
                    <span>Complaints</span>
                  </Link>

                  <div className="border-t border-[#E8E2D8] mt-1 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full px-4 py-2 flex items-center gap-2.5 hover:bg-red-50 text-red-600 text-left transition-colors cursor-pointer font-bold"
                    >
                      <FontAwesomeIcon icon={faRightFromBracket} className="w-3.5 h-3.5 text-red-600" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#17233A] hover:bg-[#253654] text-white text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              Sign In
            </button>
          )}

          {/* Mobile Hamburger Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-8 h-8 rounded-full bg-[#F8F6F2] hover:bg-[#E8E2D8] text-[#17233A] flex items-center justify-center transition-all cursor-pointer border border-[#E8E2D8]"
            aria-label="Toggle Mobile Menu"
          >
            <FontAwesomeIcon icon={mobileMenuOpen ? faXmark : faBars} className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>

      {/* MOBILE HAMBURGER MENU DRAWER */}
      {mobileMenuOpen && (
        <nav className="lg:hidden border-t border-[#E8E2D8] bg-[#FCFBF8] px-4 py-3 space-y-1 shadow-md animate-fadeIn">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#17233A]'
                    : 'text-[#374151] hover:bg-[#F8F6F2]'
                }`}
              >
                <span>{item.label}</span>
                {item.hasBadge && (
                  <span className="w-2 h-2 rounded-full bg-[#A66666] animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>
      )}

      {/* PROFILE VIEW MODAL */}
      {profileModalOpen && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-md bg-[#FCFBF8] border border-[#E8E2D8] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 my-auto max-h-[90vh] flex flex-col justify-between overflow-y-auto">
            
            <button
              type="button"
              onClick={() => setProfileModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F8F6F2] hover:bg-[#E8E2D8] text-[#17233A] flex items-center justify-center transition-all cursor-pointer z-10"
              aria-label="Close profile modal"
            >
              <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#E8E2D8] pb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#A66666] text-white font-extrabold text-lg flex items-center justify-center shadow-xs shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-extrabold font-display text-[#17233A] truncate">
                  {displayUser?.fullName || 'Member Customer'}
                </h3>
                <p className="text-xs text-[#6B7280] font-mono">
                  +91 {displayUser?.phoneNumber || '9876543210'}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs overflow-y-auto pr-1">
              <div className="p-3 rounded-2xl bg-[#F8F6F2] border border-[#E8E2D8] space-y-1">
                <span className="text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider block">
                  Saved Address
                </span>
                <p className="font-bold text-[#17233A]">
                  {displayUser?.address || 'B-42 Lajpat Nagar II'}
                  {displayUser?.landmark ? `, Near ${displayUser.landmark}` : ''}
                </p>
                <p className="text-[#6B7280]">
                  {displayUser?.city || 'New Delhi'} - {displayUser?.pincode || '110024'}
                </p>
              </div>

              {displayUser?.email && (
                <div className="p-3 rounded-2xl bg-[#F8F6F2] border border-[#E8E2D8] space-y-1">
                  <span className="text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider block">
                    Email Address
                  </span>
                  <p className="font-bold text-[#17233A] truncate">{displayUser.email}</p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setProfileModalOpen(false);
                setIsAuthModalOpen(true);
              }}
              className="w-full py-3 rounded-2xl bg-[#17233A] hover:bg-[#253654] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs mt-2 shrink-0"
            >
              <FontAwesomeIcon icon={faPenToSquare} className="w-3.5 h-3.5" />
              <span>Edit Profile Details</span>
            </button>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
