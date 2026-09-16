import React from 'react';
import { Users, CheckCircle2, Building2 } from 'lucide-react';

const IMPACT_STATS = [
  {
    id: 'stat-workers',
    value: '7,700+',
    label: 'Workers Supported',
    subtext: 'Organized gig workforce',
    icon: Users
  },
  {
    id: 'stat-jobs',
    value: '45,000+',
    label: 'Jobs Completed',
    subtext: '99.2% satisfaction rate',
    icon: CheckCircle2
  },
  {
    id: 'stat-coops',
    value: '120+',
    label: 'Cooperatives Connected',
    subtext: 'Inter-coop network',
    icon: Building2
  }
];

/**
 * CommunityImpactSection Component for KAIROVA Customer Portal
 * 
 * Features:
 * - Statistics cards highlighting social impact & NCCT cooperative network scale
 * - Styled using KAIROVA design tokens exclusively
 */
export default function CommunityImpactSection() {
  return (
    <section className="w-full bg-kairova-bg-secondary/70 border border-kairova-border rounded-3xl p-5 space-y-4">
      {/* Section Header */}
      <div>
        <h2 className="text-base font-bold text-kairova-text">Cooperative Impact</h2>
        <p className="text-xs text-kairova-text-muted">Strengthening local communities through organized gig work</p>
      </div>

      {/* Grid Statistics Cards */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {IMPACT_STATS.map((stat) => {
          const IconComponent = stat.icon;

          return (
            <div
              key={stat.id}
              className="bg-white border border-kairova-border rounded-2xl p-3 text-center flex flex-col items-center justify-center shadow-2xs"
            >
              {/* Stat Icon */}
              <div className="w-8 h-8 rounded-xl bg-kairova-bg-secondary text-kairova-text flex items-center justify-center mb-1.5 border border-kairova-border">
                <IconComponent className="w-4 h-4 text-kairova-primary" aria-hidden="true" />
              </div>

              {/* Stat Number */}
              <span className="text-base sm:text-lg font-bold font-display text-kairova-text leading-tight">
                {stat.value}
              </span>

              {/* Stat Label */}
              <span className="text-[11px] font-semibold text-kairova-text leading-tight mt-0.5">
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
