import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons';

/**
 * SplashScreen Component
 * Premium minimal splash screen for GigSeva
 * Brand: GigSeva
 * Tagline: India's Cooperative Service Network
 */
export default function SplashScreen({ onFinish }) {
  const [stage, setStage] = useState(0); // 0: init, 1: fade in, 2: fade out

  useEffect(() => {
    // Stage 1: Trigger entry animations after 100ms
    const timer1 = setTimeout(() => {
      setStage(1);
    }, 100);

    // Stage 2: Trigger exit fade out after 2200ms
    const timer2 = setTimeout(() => {
      setStage(2);
    }, 2200);

    // Stage 3: Finish splash after 2600ms
    const timer3 = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onFinish]);

  return (
    <div
      onClick={() => onFinish && onFinish()}
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#F8F6F2] text-[#17233A] px-4 transition-all duration-500 ease-out select-none cursor-pointer ${
        stage === 2 ? 'opacity-0 scale-98 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Soft subtle ambient background radial warmth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#A66666]/5 blur-3xl pointer-events-none" />

      {/* Main Splash Content Wrapper */}
      <div
        className={`flex flex-col items-center text-center space-y-4 max-w-md transition-all duration-700 transform ${
          stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Brand Logo Symbol */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#A66666] text-white flex items-center justify-center font-extrabold font-display text-3xl sm:text-4xl shadow-md tracking-tight">
          G
        </div>

        {/* Brand Title & Tagline */}
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#17233A] tracking-tight">
            GigSeva
          </h1>
          <p className="text-sm sm:text-base font-bold font-display text-[#A66666] tracking-wide">
            India's Cooperative Service Network
          </p>
        </div>

        {/* Supporting Text */}
        <p className="text-xs sm:text-sm text-[#6B7280] font-medium leading-relaxed max-w-xs pt-1">
          Trusted Local Workers. Verified Cooperative Networks.
        </p>

        {/* Trust Badge Pill */}
        <div className="pt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCFBF8] border border-[#E8E2D8] text-[11px] font-semibold text-[#17233A] shadow-2xs">
          <FontAwesomeIcon icon={faShieldHalved} className="w-3 h-3 text-[#4E8A57]" />
          <span>Govt & Guild Verified Cooperatives</span>
        </div>
      </div>

      {/* Minimal Bottom Progress Bar Accent */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#E8E2D8] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#A66666] rounded-full transition-all duration-[2400ms] ease-out"
          style={{ width: stage >= 1 ? '100%' : '0%' }}
        />
      </div>
    </div>
  );
}
