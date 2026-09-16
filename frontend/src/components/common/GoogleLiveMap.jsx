import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faRoute,
  faArrowUpRightFromSquare,
  faPersonWalking,
  faHouseUser
} from '@fortawesome/free-solid-svg-icons';
import {
  loadGoogleMaps,
  isGoogleMapsConfigured,
  calculateDistanceKm
} from '../../services/googleMapsService';

/**
 * GoogleLiveMap Component
 * Interactive Dual-Marker Map showing Worker and Customer locations with routing
 */
export default function GoogleLiveMap({
  workerLocation = { latitude: 28.5300, longitude: 77.2090, name: 'Rajesh Kumar' },
  customerLocation = { latitude: 28.5244, longitude: 77.2060, address: 'B-42 Lajpat Nagar II' },
  status = 'Accepted',
  className = 'h-72 sm:h-80 w-full'
}) {
  const mapContainerRef = useRef(null);
  const [mapError, setMapError] = useState(false);
  const [routeDistance, setRouteDistance] = useState(null);
  const [routeDuration, setRouteDuration] = useState(null);

  const workerLat = workerLocation?.latitude || 28.5300;
  const workerLng = workerLocation?.longitude || 77.2090;
  const customerLat = customerLocation?.latitude || 28.5244;
  const customerLng = customerLocation?.longitude || 77.2060;

  const straightDistance = calculateDistanceKm(workerLat, workerLng, customerLat, customerLng);

  // External Google Maps directions URL between worker and customer
  const googleDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${workerLat},${workerLng}&destination=${customerLat},${customerLng}&travelmode=driving`;

  useEffect(() => {
    let isMounted = true;

    if (!isGoogleMapsConfigured() || window.__googleMapsAuthFailed) {
      setMapError(true);
      return;
    }

    window.__onGoogleMapsAuthFailed = () => {
      if (isMounted) setMapError(true);
    };

    loadGoogleMaps()
      .then((google) => {
        if (!isMounted || !mapContainerRef.current) return;
        if (window.__googleMapsAuthFailed) {
          setMapError(true);
          return;
        }

        const workerLatLng = new google.maps.LatLng(workerLat, workerLng);
        const customerLatLng = new google.maps.LatLng(customerLat, customerLng);

        const map = new google.maps.Map(mapContainerRef.current, {
          center: customerLatLng,
          zoom: 14,
          mapId: 'DEMO_MAP_ID',
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          gestureHandling: 'cooperative',
          styles: [
            { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
            { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'on' }] }
          ]
        });

        // 1 & 2. Modern AdvancedMarkerElement when available (prevents deprecation warnings)
        if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
          const workerPin = document.createElement('div');
          workerPin.className = 'w-6 h-6 rounded-full bg-[#A66666] border-2 border-white shadow-md flex items-center justify-center text-[11px] text-white font-bold cursor-pointer';
          workerPin.innerText = 'W';

          new google.maps.marker.AdvancedMarkerElement({
            position: workerLatLng,
            map,
            title: `${workerLocation?.name || 'Worker'} (${status})`,
            content: workerPin
          });

          const customerPin = document.createElement('div');
          customerPin.className = 'w-6 h-6 rounded-full bg-[#17233A] border-2 border-white shadow-md flex items-center justify-center text-[11px] text-white font-bold cursor-pointer';
          customerPin.innerText = 'C';

          new google.maps.marker.AdvancedMarkerElement({
            position: customerLatLng,
            map,
            title: customerLocation?.address || 'Your Address',
            content: customerPin
          });
        } else {
          // Fallback to legacy Marker
          new google.maps.Marker({
            position: workerLatLng,
            map,
            title: `${workerLocation?.name || 'Worker'} (${status})`,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#A66666',
              fillOpacity: 1,
              strokeWeight: 3,
              strokeColor: '#FFFFFF'
            }
          });

          new google.maps.Marker({
            position: customerLatLng,
            map,
            title: customerLocation?.address || 'Your Address',
            icon: {
              path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              scale: 6,
              fillColor: '#17233A',
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#FFFFFF'
            }
          });
        }

        // 3. Directions & Routing (Safe execution)
        try {
          const directionsService = new google.maps.DirectionsService();
          const directionsRenderer = new google.maps.DirectionsRenderer({
            map,
            suppressMarkers: true, // Keep our custom markers
            polylineOptions: {
              strokeColor: '#A66666',
              strokeWeight: 5,
              strokeOpacity: 0.85
            }
          });

          directionsService.route(
            {
              origin: workerLatLng,
              destination: customerLatLng,
              travelMode: google.maps.TravelMode.DRIVING
            },
            (result, routeStatus) => {
              if (routeStatus === google.maps.DirectionsStatus.OK && result) {
                directionsRenderer.setDirections(result);
                const leg = result.routes[0]?.legs[0];
                if (leg && isMounted) {
                  setRouteDistance(leg.distance?.text || `${straightDistance} km`);
                  setRouteDuration(leg.duration?.text || '12 mins');
                }
              } else {
                // Fallback to straight line polyline if road routing unavailable
                const path = [workerLatLng, customerLatLng];
                new google.maps.Polyline({
                  path,
                  geodesic: true,
                  strokeColor: '#A66666',
                  strokeOpacity: 0.8,
                  strokeWeight: 4,
                  map
                });

                const bounds = new google.maps.LatLngBounds();
                bounds.extend(workerLatLng);
                bounds.extend(customerLatLng);
                map.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 });
              }
            }
          );
        } catch (routeErr) {
          console.warn('[GoogleLiveMap] Routing fallback notice:', routeErr);
          const path = [workerLatLng, customerLatLng];
          new google.maps.Polyline({
            path,
            geodesic: true,
            strokeColor: '#A66666',
            strokeOpacity: 0.8,
            strokeWeight: 4,
            map
          });
        }
      })
      .catch((err) => {
        console.warn('[GoogleLiveMap] Google Maps load notice:', err.message);
        if (isMounted) setMapError(true);
      });

    return () => {
      isMounted = false;
      if (window.__onGoogleMapsAuthFailed) {
        delete window.__onGoogleMapsAuthFailed;
      }
    };
  }, [workerLat, workerLng, customerLat, customerLng, status]);

  return (
    <div className={`relative rounded-[24px] overflow-hidden border border-[#E8E2D8] bg-[#F8F6F2] shadow-xs ${className}`}>
      {/* Top Floating Telemetry Overlay */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none flex-wrap gap-2">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-[#E8E2D8] text-xs font-bold text-[#17233A] shadow-sm flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Worker: {workerLocation?.name || 'Rajesh Kumar'}</span>
          <span className="text-[#6B7280]">•</span>
          <span className="text-[#A66666]">{routeDistance || `${straightDistance} km away`}</span>
        </div>

        <a
          href={googleDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto bg-[#17233A] text-white hover:bg-[#A66666] transition-colors px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5"
        >
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="w-3 h-3" />
          <span>Open in Google Maps</span>
        </a>
      </div>

      {/* Main Map Canvas or Interactive Fallback */}
      {isGoogleMapsConfigured() && !mapError ? (
        <div ref={mapContainerRef} className="w-full h-full" />
      ) : (
        // High quality fallback with interactive OpenStreetMap view & dual pin layout
        <div className="relative w-full h-full bg-[#E8E5DD] flex items-center justify-center overflow-hidden">
          <iframe
            title="Live Service Tracking Map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${Math.min(workerLng, customerLng) - 0.02},${Math.min(workerLat, customerLat) - 0.02},${Math.max(workerLng, customerLng) + 0.02},${Math.max(workerLat, customerLat) + 0.02}&layer=mapnik&marker=${customerLat},${customerLng}`}
          />

          {/* Simulated Floating Worker Marker on Map */}
          <div className="absolute top-1/3 left-1/3 z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none animate-bounce">
            <div className="bg-[#A66666] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border-2 border-white flex items-center gap-1.5">
              <FontAwesomeIcon icon={faPersonWalking} />
              <span>{workerLocation?.name || 'Rajesh Kumar'} ({status})</span>
            </div>
            <div className="w-3 h-3 bg-[#A66666] rotate-45 -mt-1 shadow-md" />
          </div>

          {/* Simulated Customer Destination Marker on Map */}
          <div className="absolute bottom-8 right-12 z-10 flex flex-col items-center pointer-events-none">
            <div className="bg-[#17233A] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border-2 border-white flex items-center gap-1.5">
              <FontAwesomeIcon icon={faHouseUser} />
              <span>{customerLocation?.address || 'Your Location'}</span>
            </div>
            <div className="w-3 h-3 bg-[#17233A] rotate-45 -mt-1 shadow-md" />
          </div>

          {/* Bottom Route Summary Bar */}
          <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-[#E8E2D8] text-xs font-semibold text-[#17233A]">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faRoute} className="text-[#A66666]" />
              <span>Distance to destination: <strong>{straightDistance} km</strong></span>
            </div>
            <span className="text-[#6B7280]">Status: <strong className="text-[#A66666]">{status}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
