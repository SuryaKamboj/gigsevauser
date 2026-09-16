import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

/**
 * RatingStars Component
 * 
 * Clean, flat, Urban Company / Airbnb style rating display.
 * - Flat Font Awesome stars (#F4B400 for filled, #D1D5DB for empty)
 * - No capsule background / pill border
 * - No 3D, glossy or shadow effects
 * - Inline format: ★★★★★ 4.9 (160 jobs)
 */
export default function RatingStars({
  rating = 4.9,
  showScore = true,
  jobsCount = null,
  starSizeClass = 'w-3.5 h-3.5',
  textColorClass = 'text-[#071A3D]'
}) {
  const numRating = typeof rating === 'number' ? rating : parseFloat(rating) || 4.9;
  const roundedRating = Math.min(5, Math.max(0, numRating));
  const fullStars = Math.floor(roundedRating);
  const hasHalf = roundedRating - fullStars >= 0.5;

  return (
    <div className={`inline-flex items-center gap-1.5 font-bold text-xs ${textColorClass}`}>
      <div className="flex items-center gap-0.5 shrink-0">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = starIndex <= fullStars || (starIndex === fullStars + 1 && hasHalf);
          return (
            <FontAwesomeIcon
              key={starIndex}
              icon={faStar}
              className={`${starSizeClass} ${isFilled ? 'text-[#F4B400]' : 'text-[#D1D5DB]'}`}
              aria-hidden="true"
            />
          );
        })}
      </div>
      {showScore && <span>{roundedRating.toFixed(1)}</span>}
      {jobsCount !== null && jobsCount !== undefined && (
        <span className="text-stone-400 font-normal">({jobsCount} {typeof jobsCount === 'number' ? 'jobs' : ''})</span>
      )}
    </div>
  );
}
