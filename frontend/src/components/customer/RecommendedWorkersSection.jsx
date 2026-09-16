import React from 'react';
import WorkerMatchCard from './WorkerMatchCard';
import { Sparkles } from 'lucide-react';

const MOCK_RECOMMENDED_WORKERS = [
  {
    id: 'wrk-101',
    fullName: 'Suresh Verma',
    avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    trustScore: 94.5,
    tier: 'Master Artisan',
    cooperativeName: 'South Delhi Skilled Workers Cooperative',
    distanceKm: 1.2,
    completedJobs: 142,
    rating: 4.9,
    basePrice: 350,
    skills: ['Electrical Repair']
  },
  {
    id: 'wrk-102',
    fullName: 'Rajesh Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    trustScore: 89.2,
    tier: 'Senior Technician',
    cooperativeName: 'East Delhi Craftsmen Cooperative',
    distanceKm: 2.8,
    completedJobs: 98,
    rating: 4.8,
    basePrice: 400,
    skills: ['Plumbing']
  }
];

/**
 * RecommendedWorkersSection Component for KAIROVA Customer Portal
 * 
 * Features:
 * - AI Recommended Verified Workers list
 * - Utilizes WorkerMatchCard component
 * - Styled using KAIROVA design tokens exclusively
 * 
 * @param {Object} props
 * @param {Array<Object>} [props.workers] - Worker items array
 * @param {Function} props.onWorkerBookClick - Handler function when a worker is selected
 */
export default function RecommendedWorkersSection({
  workers = MOCK_RECOMMENDED_WORKERS,
  onWorkerBookClick
}) {
  return (
    <section className="w-full space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-kairova-text flex items-center gap-1.5">
            <span>Recommended Workers</span>
          </h2>
          <p className="text-xs text-kairova-text-muted">Matched by Trust Score & Proximity</p>
        </div>

        {/* AI Badge */}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-kairova-bg-secondary border border-kairova-border text-[11px] font-semibold text-kairova-text">
          <Sparkles className="w-3.5 h-3.5 text-kairova-primary" aria-hidden="true" />
          AI Ranked
        </span>
      </div>

      {/* Workers Cards List */}
      <div className="space-y-3">
        {workers.map((worker) => (
          <WorkerMatchCard
            key={worker.id}
            worker={worker}
            onBookClick={(w) => onWorkerBookClick && onWorkerBookClick(w)}
          />
        ))}
      </div>
    </section>
  );
}
