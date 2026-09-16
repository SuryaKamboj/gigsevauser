import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faMicrophone,
  faXmark,
  faArrowRight,
  faBolt,
  faFaucet,
  faBroom,
  faScrewdriverWrench,
  faHammer,
  faPaintRoller,
  faHeartPulse,
  faUser,
  faSpinner,
  faFire
} from '@fortawesome/free-solid-svg-icons';
import {
  searchServicesAndWorkers,
  getPopularSuggestions,
  buildSearchIndex
} from '../../services/searchService';

/**
 * Returns an icon for a suggestion category or type
 */
function getCategoryIcon(category, type) {
  if (type === 'worker') return faUser;
  const cat = (category || '').toUpperCase();
  if (cat.includes('ELEC')) return faBolt;
  if (cat.includes('PLUMB')) return faFaucet;
  if (cat.includes('CLEAN')) return faBroom;
  if (cat.includes('APP') || cat.includes('AC')) return faScrewdriverWrench;
  if (cat.includes('CARP')) return faHammer;
  if (cat.includes('PAINT')) return faPaintRoller;
  if (cat.includes('ELDER')) return faHeartPulse;
  return faMagnifyingGlass;
}

/**
 * Enhanced VoiceSearchBar with Typo-Tolerant Fuzzy Search (Fuse.js)
 * 
 * Features:
 * - ~250ms debounced live suggestions
 * - Typo tolerance (e.g. electrcian -> Electrician, plumer -> Plumber, cleanning -> Cleaning)
 * - Exact & prefix matches ranked above weak fuzzy matches
 * - Keyboard navigation (ArrowUp, ArrowDown, Enter, Esc)
 * - Enter key, Search Icon, and Suggestion click execution
 * - Mobile responsive dropdown with clean outside-click handling
 * - Real Web Speech API voice search with animated listening state
 * - Palette: #FCFBF8, #E8E2D8, #A66666, #17233A
 */
export default function VoiceSearchBar({
  searchQuery = '',
  onSearchChange,
  onSearchSubmit,
  onVoiceClick,
  placeholder = 'Search electrician, plumber, cleaner...'
}) {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState(null);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const recognitionRef = useRef(null);

  // Sync external searchQuery prop with internal value
  useEffect(() => {
    if (searchQuery !== undefined && searchQuery !== inputValue) {
      setInputValue(searchQuery);
    }
  }, [searchQuery]);

  // Preload search index in the background on mount for instantaneous search
  useEffect(() => {
    buildSearchIndex().catch(() => {});
  }, []);

  // Dismiss dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  // Debounced search effect (250ms)
  const performSearch = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchServicesAndWorkers(trimmed, 8);
      setSuggestions(results);
      setIsOpen(true);
    } catch (err) {
      console.warn('[VoiceSearchBar] Search error:', err);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setActiveIndex(-1);

    if (onSearchChange) {
      onSearchChange(val);
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!val.trim()) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceTimerRef.current = setTimeout(() => {
      performSearch(val);
    }, 250);
  };

  // Execution: Navigate to selected item or general search
  const executeSearch = (targetItem = null) => {
    setIsOpen(false);
    setActiveIndex(-1);

    // 1. If an item was explicitly selected
    if (targetItem && targetItem.url) {
      navigate(targetItem.url);
      if (onSearchSubmit) onSearchSubmit(targetItem.title, targetItem);
      return;
    }

    // 2. If an active index in suggestions is selected
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      const selected = suggestions[activeIndex];
      navigate(selected.url);
      if (onSearchSubmit) onSearchSubmit(selected.title, selected);
      return;
    }

    // 3. Fallback: If suggestions exist, pick top ranked suggestion
    if (suggestions.length > 0) {
      const topMatch = suggestions[0];
      navigate(topMatch.url);
      if (onSearchSubmit) onSearchSubmit(topMatch.title, topMatch);
      return;
    }

    // 4. Default: Navigate to /services with search query
    const q = inputValue.trim();
    if (q) {
      navigate(`/services?q=${encodeURIComponent(q)}`);
      if (onSearchSubmit) onSearchSubmit(q, null);
    }
  };

  // Keyboard navigation handler
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeSearch();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  // Clear input
  const handleClear = () => {
    setInputValue('');
    setSuggestions([]);
    setIsOpen(false);
    if (onSearchChange) onSearchChange('');
    if (inputRef.current) inputRef.current.focus();
  };

  // Web Speech API voice search
  const handleVoiceSearch = () => {
    if (onVoiceClick && typeof onVoiceClick === 'function' && !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      onVoiceClick();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (onVoiceClick) onVoiceClick();
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputValue(transcript);
          if (onSearchChange) onSearchChange(transcript);
          performSearch(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.warn('[VoiceSearchBar] Speech recognition error:', event.error);
        setIsListening(false);
        setVoiceError('Voice input unavailable. Please type instead.');
        setTimeout(() => setVoiceError(null), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('[VoiceSearchBar] Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  const popular = getPopularSuggestions();
  const showDropdown = isOpen && (suggestions.length > 0 || isLoading || inputValue.trim().length >= 2 || !inputValue.trim());

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center w-full group">
        {/* Search Icon (Clickable to trigger search execution) */}
        <button
          type="button"
          onClick={() => executeSearch()}
          className="absolute left-3.5 sm:left-4 flex items-center text-[#A66666] hover:text-[#8F5555] transition-transform duration-200 group-focus-within:scale-110 cursor-pointer focus:outline-none"
          aria-label="Execute search"
          title="Search"
        >
          {isLoading ? (
            <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 text-[#A66666] animate-spin" />
          ) : (
            <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4 text-[#A66666]" aria-hidden="true" />
          )}
        </button>

        {/* Main Search Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? 'Listening... Speak now' : placeholder}
          className={`w-full pl-10 sm:pl-11 pr-20 sm:pr-24 py-3 bg-[#FCFBF8] border ${
            isListening ? 'border-red-400 ring-2 ring-red-400/20' : 'border-[#E8E2D8] focus:border-[#A66666] focus:ring-2 focus:ring-[#A66666]/20'
          } rounded-[999px] text-xs sm:text-sm text-[#17233A] placeholder-[#6B7280] focus:outline-none transition-all duration-300 shadow-2xs focus:shadow-sm`}
          aria-label="Search for services or workers"
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
        />

        {/* Clear Button (Shown when user has entered text) */}
        {inputValue.trim().length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-11 sm:right-13 w-6 h-6 rounded-full text-[#6B7280] hover:text-[#17233A] hover:bg-[#E8E2D8]/50 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Clear search input"
            title="Clear"
          >
            <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
          </button>
        )}

        {/* Mic Button (#A66666 accent with active listening animation) */}
        <button
          type="button"
          onClick={handleVoiceSearch}
          className={`absolute right-1.5 w-8.5 h-8.5 rounded-full ${
            isListening
              ? 'bg-red-500 animate-pulse text-white'
              : 'bg-[#A66666] hover:bg-[#8F5555] text-white hover:scale-105 active:scale-95'
          } focus:outline-none focus:ring-2 focus:ring-[#A66666] transition-all duration-200 flex items-center justify-center shrink-0 shadow-2xs cursor-pointer`}
          aria-label={isListening ? 'Stop voice search' : 'Search using voice command'}
          title={isListening ? 'Listening... Click to stop' : 'Search using voice'}
        >
          <FontAwesomeIcon icon={faMicrophone} className="w-3.5 h-3.5 text-white" aria-hidden="true" />
        </button>
      </div>

      {/* Voice Error Notice */}
      {voiceError && (
        <div className="absolute top-full left-4 mt-1 text-[11px] text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200 z-50 animate-fade-in">
          {voiceError}
        </div>
      )}

      {/* Floating Suggestions Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#FCFBF8] border border-[#E8E2D8] rounded-[20px] shadow-xl overflow-hidden z-[100] max-h-[380px] flex flex-col animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* Header Bar */}
          <div className="px-4 py-2 bg-[#F8F6F2] border-b border-[#E8E2D8] flex items-center justify-between text-[11px] font-bold text-[#6B7280]">
            <span>
              {inputValue.trim().length >= 2
                ? isLoading
                  ? 'Searching verified network...'
                  : `${suggestions.length} matched services & artisans`
                : 'Popular Cooperative Services'}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#A66666]">GigSeva Search</span>
          </div>

          <div className="overflow-y-auto divide-y divide-[#E8E2D8]/50">
            {/* When typing and suggestions are available */}
            {inputValue.trim().length >= 2 && suggestions.length > 0 && (
              suggestions.map((item, idx) => {
                const isSelected = activeIndex === idx;
                const icon = getCategoryIcon(item.category, item.type);

                return (
                  <div
                    key={item.id}
                    onClick={() => executeSearch(item)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`px-4 py-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#F2ECE4]' : 'hover:bg-[#F8F6F2]'
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-[#A66666]/10 text-[#A66666] flex items-center justify-center shrink-0">
                        <FontAwesomeIcon icon={icon} className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs sm:text-sm font-bold text-[#17233A] truncate">
                            {item.title}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            item.badge === 'Worker'
                              ? 'bg-blue-100 text-blue-700'
                              : item.badge === 'Profession'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-[#E8E2D8] text-[#17233A]'
                          }`}>
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6B7280] truncate max-w-xs sm:max-w-md">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className={`w-3 h-3 text-[#A66666] shrink-0 transition-transform ${
                        isSelected ? 'translate-x-1' : 'opacity-40'
                      }`}
                    />
                  </div>
                );
              })
            )}

            {/* When typing and loading state */}
            {inputValue.trim().length >= 2 && isLoading && suggestions.length === 0 && (
              <div className="px-4 py-6 text-center text-xs text-[#6B7280] flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-[#A66666]" />
                <span>Finding verified cooperative matches for "{inputValue}"...</span>
              </div>
            )}

            {/* When typing and NO RESULTS found */}
            {inputValue.trim().length >= 2 && !isLoading && suggestions.length === 0 && (
              <div className="p-4 text-center space-y-3">
                <p className="text-xs text-[#17233A] font-semibold">
                  No direct matches for "<span className="text-[#A66666]">{inputValue}</span>"
                </p>
                <p className="text-[11px] text-[#6B7280]">
                  Try searching for <span className="font-semibold text-[#17233A]">electrician, plumber, cleaner</span>, or explore all services.
                </p>
                <button
                  type="button"
                  onClick={() => executeSearch()}
                  className="px-4 py-1.5 rounded-full bg-[#17233A] hover:bg-[#253654] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                >
                  Explore All Catalog Services
                </button>
              </div>
            )}

            {/* When input is empty / focused: Show popular quick suggestions */}
            {!inputValue.trim() && (
              <div className="p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#A66666] px-1">
                  <FontAwesomeIcon icon={faFire} className="w-3 h-3" />
                  <span>Trending Searches</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {popular.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => executeSearch(item)}
                      className="text-left px-3 py-2 rounded-xl bg-[#F8F6F2] hover:bg-[#F2ECE4] border border-[#E8E2D8]/60 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-bold text-[#17233A] truncate">{item.title}</div>
                        <div className="text-[10px] text-[#6B7280] truncate">{item.subtitle}</div>
                      </div>
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="w-2.5 h-2.5 text-[#A66666] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Footer */}
          {inputValue.trim().length > 0 && (
            <div
              onClick={() => executeSearch()}
              className="px-4 py-2 bg-[#F8F6F2] hover:bg-[#F2ECE4] border-t border-[#E8E2D8] flex items-center justify-between text-xs font-bold text-[#17233A] cursor-pointer transition-colors"
            >
              <span>Press <kbd className="px-1.5 py-0.5 bg-white rounded border border-[#E8E2D8] text-[10px] font-mono">Enter</kbd> to search for "{inputValue}"</span>
              <span className="text-[#A66666] text-xs flex items-center gap-1">
                Search <FontAwesomeIcon icon={faArrowRight} className="w-2.5 h-2.5" />
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
