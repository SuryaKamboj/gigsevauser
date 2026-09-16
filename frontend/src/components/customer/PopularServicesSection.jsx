import React from 'react';
import { Zap, Droplet, Hammer, Wrench, Sparkles, Heart, ArrowRight } from 'lucide-react';

const POPULAR_SERVICES = [
  { id: 'cat-electrical', name: 'Electrical Repair', basePrice: 350, icon: Zap },
  { id: 'cat-plumbing', name: 'Plumbing Service', basePrice: 400, icon: Droplet },
  { id: 'cat-carpentry', name: 'Carpentry Work', basePrice: 450, icon: Hammer },
  { id: 'cat-appliance', name: 'Appliance Repair', basePrice: 500, icon: Wrench },
  { id: 'cat-cleaning', name: 'Home Cleaning', basePrice: 300, icon: Sparkles },
  { id: 'cat-eldercare', name: 'Elderly Care', basePrice: 600, icon: Heart }
];

/**
 * PopularServicesSection Component for KAIROVA Customer Portal
 * 
 * Features:
 * - Horizontally scrollable service cards
 * - Large service icons & starting price indicators
 * - Uses KAIROVA design tokens exclusively
 * 
 * @param {Object} props
 * @param {Function} props.onServiceSelect - Handler function when a service card is tapped
 */
export default function PopularServicesSection({ onServiceSelect }) {
  return (
    <section className="w-full space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-kairova-text">Popular Services</h2>
          <p className="text-xs text-kairova-text-muted">Top requested household solutions</p>
        </div>
      </div>

      {/* Horizontally Scrollable Container */}
      <div className="flex overflow-x-auto gap-3.5 pb-2 pt-1 snap-x scrollbar-none">
        {POPULAR_SERVICES.map((service) => {
          const IconComponent = service.icon;

          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onServiceSelect && onServiceSelect(service.id)}
              className="snap-start shrink-0 w-36 sm:w-40 bg-white border border-kairova-border hover:border-kairova-primary rounded-2xl p-4 text-left transition-all group focus:outline-none focus:ring-2 focus:ring-kairova-primary shadow-2xs flex flex-col justify-between"
              aria-label={`Book ${service.name}`}
            >
              {/* Service Icon Box */}
              <div className="w-12 h-12 rounded-2xl bg-kairova-bg-secondary text-kairova-text flex items-center justify-center group-hover:scale-105 transition-transform mb-3 border border-kairova-border">
                <IconComponent className="w-6 h-6" aria-hidden="true" />
              </div>

              {/* Service Info */}
              <div>
                <h3 className="text-xs font-bold text-kairova-text group-hover:text-kairova-primary transition-colors leading-tight line-clamp-1">
                  {service.name}
                </h3>
                <p className="text-[11px] text-kairova-text-muted mt-1">
                  Starting at <span className="font-semibold text-kairova-text">₹{service.basePrice}</span>
                </p>
              </div>

              {/* Bottom Action Hint */}
              <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-kairova-text group-hover:translate-x-0.5 transition-transform">
                <span>Book</span>
                <ArrowRight className="w-3 h-3 text-kairova-text-muted" aria-hidden="true" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
