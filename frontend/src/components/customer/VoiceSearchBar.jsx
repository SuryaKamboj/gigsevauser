import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faMicrophone } from '@fortawesome/free-solid-svg-icons';

/**
 * VoiceSearchBar Component for GigSave
 * 
 * Palette:
 * - Background: #FCFBF8
 * - Border: #E8E2D8
 * - Primary Accent: #A66666
 * - Text: #17233A
 */
export default function VoiceSearchBar({
  searchQuery = '',
  onSearchChange,
  onVoiceClick,
  placeholder = 'Search electrician, plumber, cleaner...'
}) {
  const handleInputChange = (e) => {
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  return (
    <div className="w-full">
      <div className="relative flex items-center w-full group">
        {/* Search Icon */}
        <div className="absolute left-4 flex items-center pointer-events-none text-[#A66666] transition-transform duration-300 group-focus-within:scale-110">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4 text-[#A66666]" aria-hidden="true" />
        </div>

        {/* Search Input Field */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-11 pr-14 py-3 bg-[#FCFBF8] border border-[#E8E2D8] rounded-[999px] text-xs sm:text-sm text-[#17233A] placeholder-[#6B7280] focus:outline-none focus:border-[#A66666] focus:ring-2 focus:ring-[#A66666]/20 transition-all duration-300 shadow-2xs focus:shadow-sm"
          aria-label="Search for services"
        />

        {/* Mic Button (#A66666 accent) */}
        <button
          type="button"
          onClick={onVoiceClick}
          className="absolute right-1.5 w-8.5 h-8.5 rounded-full bg-[#A66666] text-white hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#A66666] hover:bg-[#8F5555] transition-all duration-200 flex items-center justify-center shrink-0 shadow-2xs cursor-pointer"
          aria-label="Search using voice command"
          title="Search using voice command"
        >
          <FontAwesomeIcon icon={faMicrophone} className="w-3.5 h-3.5 text-white" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
