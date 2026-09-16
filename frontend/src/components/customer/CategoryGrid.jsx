import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt,
  faFaucet,
  faHammer,
  faBroom,
  faScrewdriverWrench,
  faHeartPulse,
  faPaintRoller,
  faGrip
} from '@fortawesome/free-solid-svg-icons';

const ICON_MAP = {
  Zap: faBolt,
  Droplet: faFaucet,
  Hammer: faHammer,
  Sparkles: faBroom,
  Wrench: faScrewdriverWrench,
  Heart: faHeartPulse,
  Paintbrush: faPaintRoller,
  Grid: faGrip
};

const DEFAULT_CATEGORIES = [
  { id: 'cat-electrical', name: 'Electrical', iconName: 'Zap' },
  { id: 'cat-plumbing', name: 'Plumbing', iconName: 'Droplet' },
  { id: 'cat-carpentry', name: 'Carpentry', iconName: 'Hammer' },
  { id: 'cat-cleaning', name: 'Cleaning', iconName: 'Sparkles' },
  { id: 'cat-appliance', name: 'Appliance Repair', iconName: 'Wrench' },
  { id: 'cat-eldercare', name: 'Elder Care', iconName: 'Heart' },
  { id: 'cat-painting', name: 'Painting', iconName: 'Paintbrush' },
  { id: 'cat-all', name: 'All Services', iconName: 'Grid' }
];

export default function CategoryGrid({
  categories = DEFAULT_CATEGORIES,
  selectedCategoryId,
  onCategorySelect
}) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4">
        {categories.map((category) => {
          const isSelected = selectedCategoryId === category.id;
          const faIcon = ICON_MAP[category.iconName] || faGrip;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategorySelect && onCategorySelect(category.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 ease-out text-center group transform hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/10 focus:outline-none focus:ring-2 focus:ring-[#F5B700] ${
                isSelected
                  ? 'bg-slate-900 border-[#F5B700] ring-1 ring-[#F5B700] shadow-md -translate-y-1'
                  : 'bg-white border-[#E5E7EB] hover:border-[#F5B700]'
              }`}
              aria-label={`Select ${category.name} category`}
              aria-pressed={isSelected}
            >
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isSelected
                    ? 'bg-[#F5B700] text-[#0F172A] shadow-sm'
                    : 'bg-[#FFF8E7] border border-amber-200 text-[#111827] group-hover:bg-[#F5B700] group-hover:text-[#0F172A]'
                }`}
              >
                <FontAwesomeIcon icon={faIcon} className="w-5 h-5" aria-hidden="true" />
              </div>

              <span
                className={`mt-2 text-xs font-semibold leading-tight truncate w-full ${
                  isSelected
                    ? 'text-[#F5B700]'
                    : 'text-[#111827] group-hover:text-[#D97706]'
                }`}
              >
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
