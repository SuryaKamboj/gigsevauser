import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faClipboardList, faGrip, faBolt } from '@fortawesome/free-solid-svg-icons';
import { useBooking } from '../../context/BookingContext';

export default function BottomNavigation() {
  const location = useLocation();
  const { activeBooking } = useBooking();
  const hasActiveRequest = !!(activeBooking && activeBooking.status !== 'Completed');

  const TABS = [
    { id: 'home', label: 'Home', icon: faHouse, path: '/' },
    { id: 'services', label: 'Services', icon: faGrip, path: '/services' },
    { id: 'requests', label: 'Requests', icon: faClipboardList, path: '/requests', hasBadge: hasActiveRequest },
    { id: 'emergency', label: 'Urgent', icon: faBolt, path: '/emergency' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FCFBF8]/95 backdrop-blur-md border-t border-[#E8E2D8] text-[#17233A] md:hidden shadow-xs">
      <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-around">
        {TABS.map((tab) => {
          const isActive = location.pathname === tab.path || (tab.path !== '/' && location.pathname.startsWith(tab.path));

          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative group cursor-pointer ${
                isActive
                  ? 'text-[#A66666] font-bold'
                  : 'text-[#6B7280] hover:text-[#17233A]'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-6 h-1 rounded-full bg-[#A66666]" />
              )}

              <div className="relative">
                <FontAwesomeIcon
                  icon={tab.icon}
                  className={`w-4 h-4 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-[#A66666]' : 'text-[#6B7280]'
                  }`}
                />
                {tab.hasBadge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#A66666] animate-pulse ring-2 ring-white" />
                )}
              </div>

              <span className="text-[11px] mt-1 tracking-tight leading-none">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
