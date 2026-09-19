import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapLocationDot,
  faLocationDot,
  faMagnifyingGlass,
  faXmark,
  faLocationCrosshairs,
  faSpinner,
  faCheck,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import {
  loadGoogleMaps,
  isGoogleMapsConfigured
} from '../../services/googleMapsService';

const POPULAR_LOCATIONS = [
  { name: 'Lajpat Nagar II', address: 'B-42 Lajpat Nagar II, New Delhi', lat: 28.5677, lng: 77.2433 },
  { name: 'Connaught Place', address: 'Connaught Place, New Delhi', lat: 28.6315, lng: 77.2167 },
  { name: 'South Extension', address: 'South Extension I, New Delhi', lat: 28.5729, lng: 77.2227 },
  { name: 'Hauz Khas', address: 'Hauz Khas Market, New Delhi', lat: 28.5494, lng: 77.2001 },
  { name: 'Noida Sec 18', address: 'Sector 18, Noida, Uttar Pradesh', lat: 28.5708, lng: 77.3261 },
  { name: 'Cyber City', address: 'DLF Cyber City, Gurugram, Haryana', lat: 28.4950, lng: 77.0895 }
];

export default function ChooseLocationModal({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation
}) {
  const [selectedAddress, setSelectedAddress] = useState(
    currentLocation?.address || 'B-42 Lajpat Nagar II, New Delhi'
  );
  const [selectedCoords, setSelectedCoords] = useState({
    lat: currentLocation?.lat || 28.5677,
    lng: currentLocation?.lng || 77.2433
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapAuthFailed, setMapAuthFailed] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const searchInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const geocoderRef = useRef(null);

  // Sync initial location when modal opens
  useEffect(() => {
    if (isOpen && currentLocation?.address) {
      setSelectedAddress(currentLocation.address);
      if (currentLocation.lat && currentLocation.lng) {
        setSelectedCoords({ lat: currentLocation.lat, lng: currentLocation.lng });
      }
    }
  }, [isOpen, currentLocation]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const reverseGeocode = (lat, lng, geocoderInstance = null) => {
    const geocoder = geocoderInstance || geocoderRef.current;
    if (!geocoder) {
      return;
    }
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const full = results[0].formatted_address;
        setSelectedAddress(full);
        setSearchQuery(full);
      }
    });
  };

  // Initialize Google Maps
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    if (!isGoogleMapsConfigured() || window.__googleMapsAuthFailed) {
      setMapAuthFailed(true);
      return;
    }

    window.__onGoogleMapsAuthFailed = () => {
      if (isMounted) setMapAuthFailed(true);
    };

    loadGoogleMaps()
      .then((google) => {
        if (!isMounted || !mapContainerRef.current) return;
        if (window.__googleMapsAuthFailed) {
          setMapAuthFailed(true);
          return;
        }

        const centerLatLng = new google.maps.LatLng(selectedCoords.lat, selectedCoords.lng);
        const map = new google.maps.Map(mapContainerRef.current, {
          center: centerLatLng,
          zoom: 15,
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          gestureHandling: 'cooperative'
        });
        mapRef.current = map;

        const marker = new google.maps.Marker({
          position: centerLatLng,
          map: map,
          draggable: true,
          animation: google.maps.Animation.DROP,
          title: 'Selected Service Location'
        });
        markerRef.current = marker;

        const geocoder = new google.maps.Geocoder();
        geocoderRef.current = geocoder;

        // Map Click sets location
        map.addListener('click', (e) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          marker.setPosition(e.latLng);
          setSelectedCoords({ lat, lng });
          reverseGeocode(lat, lng, geocoder);
        });

        // Marker Drag sets location
        marker.addListener('dragend', () => {
          const pos = marker.getPosition();
          const lat = pos.lat();
          const lng = pos.lng();
          setSelectedCoords({ lat, lng });
          reverseGeocode(lat, lng, geocoder);
        });

        // Places Autocomplete initialization
        if (searchInputRef.current && google.maps.places) {
          try {
            const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
              componentRestrictions: { country: 'in' },
              fields: ['formatted_address', 'geometry', 'name']
            });
            autocomplete.bindTo('bounds', map);
            autocompleteRef.current = autocomplete;

            autocomplete.addListener('place_changed', () => {
              const place = autocomplete.getPlace();
              if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                map.setCenter(place.geometry.location);
                map.setZoom(16);
                marker.setPosition(place.geometry.location);
                setSelectedCoords({ lat, lng });
                const addr = place.formatted_address || place.name || '';
                setSelectedAddress(addr);
                setSearchQuery(addr);
              }
            });
          } catch (err) {
            console.warn('Google Places Autocomplete init warning:', err);
          }
        }

        setMapLoaded(true);
      })
      .catch((err) => {
        console.warn('Google Maps load error:', err);
        if (isMounted) setMapAuthFailed(true);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Handle Search Input Submission
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    if (geocoderRef.current && mapRef.current) {
      geocoderRef.current.geocode({ address: query }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const loc = results[0].geometry.location;
          const lat = loc.lat();
          const lng = loc.lng();
          mapRef.current.setCenter(loc);
          mapRef.current.setZoom(15);
          if (markerRef.current) {
            markerRef.current.setPosition(loc);
          }
          setSelectedCoords({ lat, lng });
          setSelectedAddress(results[0].formatted_address);
        } else {
          fallbackAddressMatch(query);
        }
      });
    } else {
      fallbackAddressMatch(query);
    }
  };

  const fallbackAddressMatch = (query) => {
    const matched = POPULAR_LOCATIONS.find(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.address.toLowerCase().includes(query.toLowerCase())
    );
    if (matched) {
      handleSelectPreset(matched);
    } else {
      setSelectedAddress(`${query}, New Delhi`);
    }
  };

  // Select a preset popular location
  const handleSelectPreset = (preset) => {
    setSelectedAddress(preset.address);
    setSearchQuery(preset.address);
    setSelectedCoords({ lat: preset.lat, lng: preset.lng });

    if (mapRef.current && window.google?.maps) {
      const latLng = new window.google.maps.LatLng(preset.lat, preset.lng);
      mapRef.current.setCenter(latLng);
      mapRef.current.setZoom(15);
      if (markerRef.current) {
        markerRef.current.setPosition(latLng);
      }
    }
  };

  // Use GPS directly inside modal
  const handleModalGPS = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setSelectedCoords({ lat, lng });

        if (mapRef.current && window.google?.maps) {
          const latLng = new window.google.maps.LatLng(lat, lng);
          mapRef.current.setCenter(latLng);
          mapRef.current.setZoom(16);
          if (markerRef.current) {
            markerRef.current.setPosition(latLng);
          }
        }
        reverseGeocode(lat, lng);
      },
      () => {
        setIsLocating(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleConfirm = () => {
    onSelectLocation({
      address: selectedAddress,
      lat: selectedCoords.lat,
      lng: selectedCoords.lng
    });
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] sm:rounded-[28px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E8E2D8] bg-[#FCFBF8] shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#A66666]/10 text-[#A66666] flex items-center justify-center border border-[#A66666]/20 shrink-0">
              <FontAwesomeIcon icon={faMapLocationDot} className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold font-display text-[#17233A] leading-tight">
                Choose Location on Map
              </h2>
              <p className="text-[11px] text-[#6B7280]">
                Search or drag pin to your exact service address
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F8F6F2] hover:bg-[#E8E2D8] text-[#17233A] flex items-center justify-center transition-colors cursor-pointer border border-[#E8E2D8]"
            aria-label="Close modal"
          >
            <FontAwesomeIcon icon={faXmark} className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1">
          
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] w-3.5 h-3.5"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search area, landmark, street name..."
                className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-[#F8F6F2] border border-[#E8E2D8] text-xs font-semibold text-[#17233A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#A66666] transition-colors shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#17233A] p-0.5"
                >
                  <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#17233A] hover:bg-[#253654] text-white text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0 active:scale-95"
            >
              Search
            </button>
          </form>

          {/* Quick Select Popular Areas */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
              Quick Select Area:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {POPULAR_LOCATIONS.map((loc) => {
                const isSelected = selectedAddress.includes(loc.name);
                return (
                  <button
                    key={loc.name}
                    type="button"
                    onClick={() => handleSelectPreset(loc)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#A66666] text-white border-[#A66666] shadow-2xs'
                        : 'bg-[#F8F6F2] hover:bg-[#E8E2D8] border-[#E8E2D8] text-[#17233A]'
                    }`}
                  >
                    {loc.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Map Container */}
          <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-[#E8E2D8] bg-[#E8E2D8]/40 shadow-inner">
            
            {/* Live Google Map container */}
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Fallback Display if Google Maps fails */}
            {mapAuthFailed && (
              <div className="absolute inset-0 bg-[#F8F6F2] flex flex-col items-center justify-center p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#A66666]/15 text-[#A66666] flex items-center justify-center border border-[#A66666]/20">
                  <FontAwesomeIcon icon={faLocationDot} className="w-5 h-5 animate-bounce" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold font-display text-[#17233A]">
                  Interactive Location Selector
                </h4>
                <p className="text-[11px] text-[#6B7280] max-w-sm">
                  {selectedAddress}
                </p>
                <p className="text-[10px] text-[#A66666] font-semibold bg-[#FCFBF8] border border-[#E8E2D8] px-3 py-1 rounded-full">
                  Coordinates: {selectedCoords.lat.toFixed(4)}, {selectedCoords.lng.toFixed(4)}
                </p>
              </div>
            )}

            {/* Floating GPS Target Button */}
            <button
              type="button"
              onClick={handleModalGPS}
              disabled={isLocating}
              className="absolute bottom-3 right-3 z-10 w-9 h-9 rounded-xl bg-[#FCFBF8] hover:bg-white text-[#17233A] border border-[#E8E2D8] shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-90"
              title="Center on my current location"
            >
              <FontAwesomeIcon
                icon={isLocating ? faSpinner : faLocationCrosshairs}
                className={`w-4 h-4 text-[#A66666] ${isLocating ? 'animate-spin' : ''}`}
              />
            </button>
          </div>

          {/* Selected Address Preview Strip */}
          <div className="p-3 rounded-2xl bg-[#F8F6F2] border border-[#E8E2D8] flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#A66666]/10 text-[#A66666] flex items-center justify-center shrink-0 mt-0.5">
              <FontAwesomeIcon icon={faLocationDot} className="w-3 h-3 text-[#A66666]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
                Selected Address
              </span>
              <p className="text-xs font-bold text-[#17233A] leading-snug break-words">
                {selectedAddress}
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[#E8E2D8] bg-[#FCFBF8] flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#F8F6F2] hover:bg-[#E8E2D8] text-xs font-bold text-[#17233A] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2.5 rounded-xl bg-[#A66666] hover:bg-[#8F5555] text-white text-xs font-bold font-display flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
          >
            <FontAwesomeIcon icon={faCheck} className="w-3.5 h-3.5" />
            <span>Confirm & Apply Location</span>
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
