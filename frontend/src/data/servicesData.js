import {
  faBolt,
  faFaucet,
  faHammer,
  faBroom,
  faScrewdriverWrench,
  faHeartPulse,
  faPaintRoller
} from '@fortawesome/free-solid-svg-icons';

export const SERVICES_DATA = {
  'electrical': {
    id: 'electrical',
    _id: '6aa307c8abef287d06eb41fe',
    backendId: '6aa307c8abef287d06eb41fe',
    catId: 'cat-electrical',
    name: 'Electrical Repair',
    tagline: 'Certified local cooperative electricians for home wiring, switchboard setup & power safety.',
    basePrice: 420,
    estimatedTime: '15-20 mins',
    rating: 4.9,
    reviewsCount: 1420,
    workersCount: '140+ Professionals',
    icon: faBolt,
    bgImg: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
    description: 'Get verified, certified electricians from local worker cooperatives for fast, transparent, and safe electrical repairs. All work includes a 30-day cooperative guarantee.',
    includedTasks: [
      'Comprehensive socket & switchboard diagnosis',
      'Short circuit & MCB tripping repair',
      'Ceiling fan, chandelier & light fixture installation',
      'Appliance power line wiring & grounding check',
      'Complete home electrical safety audit'
    ],
    benefits: [
      'Zero Hidden Costs - Upfront fixed labor rates',
      'Verified Artisans - Background checked & guild certified',
      '30-Day Cooperative Warranty on all repair work',
      'Express Arrival in 20 minutes or less'
    ]
  },
  'plumbing': {
    id: 'plumbing',
    catId: 'cat-plumbing',
    name: 'Plumbing Service',
    tagline: 'Expert plumbers for pipe leaks, tap replacements, drainage blockages & bathroom fitting.',
    basePrice: 480,
    estimatedTime: '20-25 mins',
    rating: 4.8,
    reviewsCount: 1150,
    workersCount: '115+ Professionals',
    icon: faFaucet,
    bgImg: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=80',
    description: 'Fast and reliable plumbing solutions directly from local artisan guilds. From minor leaks to full bathroom pipe fitting, our cooperative plumbers bring specialized tools.',
    includedTasks: [
      'Tap, mixer & shower repair or installation',
      'Leaking pipe detection & sealant application',
      'Sink, basin & main drain clog removal',
      'Flush tank & commode fitting maintenance',
      'Water tank filter & pump connection inspection'
    ],
    benefits: [
      'Fair Guild Pricing - No middleman markup',
      'Heavy Duty Equipment - Hydro-jetting & leak sensors',
      'Post-service clean-up included',
      'Emergency Dispatch for major leaks'
    ]
  },
  'carpentry': {
    id: 'carpentry',
    catId: 'cat-carpentry',
    name: 'Carpentry Work',
    tagline: 'Master carpenters for furniture assembly, door locks, hinges & modular woodwork.',
    basePrice: 540,
    estimatedTime: '25-30 mins',
    rating: 4.9,
    reviewsCount: 980,
    workersCount: '88+ Professionals',
    icon: faHammer,
    bgImg: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80',
    description: 'Skilled woodwork, furniture repair, custom fitting, and door restoration performed by seasoned craftsmen from local furniture guilds.',
    includedTasks: [
      'Modular kitchen hinge repair & drawer channel replacement',
      'Door alignment, lock installation & latch fixing',
      'Bed, wardrobe & table furniture assembly',
      'Wooden paneling & shelf mounting',
      'Custom wood trimming & varnish polishing'
    ],
    benefits: [
      'Precision Tools - Laser leveling & heavy duty drills',
      'Custom Solutions - tailored to your exact home layout',
      'Clean Workspace Maintenance',
      'Direct Cooperative Support'
    ]
  },
  'cleaning': {
    id: 'cleaning',
    catId: 'cat-cleaning',
    name: 'Cleaning & Hygiene',
    tagline: 'Deep home cleaning, kitchen sanitation, bathroom scrubbing & sofa shampooing.',
    basePrice: 360,
    estimatedTime: '15-30 mins',
    rating: 4.9,
    reviewsCount: 1850,
    workersCount: '160+ Professionals',
    icon: faBroom,
    bgImg: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',
    description: 'Hygienic deep cleaning solutions using eco-friendly, non-toxic products administered by trained sanitation workers.',
    includedTasks: [
      'Deep kitchen degreasing & chimney cleaning',
      'Bathroom tile scrubbing, stain removal & disinfection',
      'Full house dust vacuuming & floor sanitization',
      'Sofa & mattress deep steam extraction',
      'Balcony & window mesh wash'
    ],
    benefits: [
      '100% Eco-Friendly Non-Toxic Cleaning Agents',
      'Single-use Microfiber Cloths & Hygiene Kits',
      'Trained Cooperative Sanitation Crew',
      'Spotless Guarantee - Re-cleaning if unsatisfied'
    ]
  },
  'appliance-repair': {
    id: 'appliance-repair',
    catId: 'cat-appliance',
    name: 'Appliance Repair',
    tagline: 'Certified technicians for AC service, washing machines, refrigerators & microwaves.',
    basePrice: 600,
    estimatedTime: '20-30 mins',
    rating: 4.8,
    reviewsCount: 920,
    workersCount: '95+ Professionals',
    icon: faScrewdriverWrench,
    bgImg: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    description: 'Expert diagnostics and repair for home appliances. Genuine spare parts sourced directly with transparent guild pricing.',
    includedTasks: [
      'AC foamjet cleaning, gas refill & cooling check',
      'Washing machine drum, motor & pump repair',
      'Refrigerator thermostat & compressor troubleshooting',
      'Microwave magnetron & heating plate fix',
      'Water purifier filter replacement & TDS calibration'
    ],
    benefits: [
      'Genuine OEM Spare Parts Warranty',
      'Transparent Rate Card for all replacement components',
      'Certified Electronics Guild Technicians',
      'Same-Day Service Guarantee'
    ]
  },
  'eldercare': {
    id: 'eldercare',
    catId: 'cat-eldercare',
    name: 'Elder Care Service',
    tagline: 'Compassionate home care assistants, mobility support & daily routine help.',
    basePrice: 720,
    estimatedTime: '30 mins',
    rating: 5.0,
    reviewsCount: 450,
    workersCount: '60+ Professionals',
    icon: faHeartPulse,
    bgImg: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80',
    description: 'Warm, respectful caregiving support for seniors. Trained care assistants provided through vetted community healthcare guilds.',
    includedTasks: [
      'Mobility assistance & light exercise accompaniment',
      'Medication reminders & vital signs check-in',
      'Companionship & reading support',
      'Nutritious meal setup & light assistance',
      'Doctor appointment accompaniment'
    ],
    benefits: [
      'Police Verified & Medical Check Passed Caregivers',
      'Empathetic, Experienced Senior Specialists',
      'Hourly & Full-day flexible slots',
      'Dedicated Supervisor Check-ins'
    ]
  },
  'wall-painting': {
    id: 'wall-painting',
    catId: 'cat-painting',
    name: 'Wall Painting',
    tagline: 'Professional painters for room repainting, waterproof putty & accent walls.',
    basePrice: 960,
    estimatedTime: '1 Hour',
    rating: 4.9,
    reviewsCount: 680,
    workersCount: '75+ Professionals',
    icon: faPaintRoller,
    bgImg: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80',
    description: 'Odourless, mess-free painting services with dustless sanding technology and premium low-VOC paints.',
    includedTasks: [
      'Wall inspection & moisture measurement',
      'Crack filling, sanding & putty application',
      'Primer base coat application',
      '2 coats of premium washable interior/exterior paint',
      'Furniture masking & post-job floor cleanup'
    ],
    benefits: [
      'Laser-accurate Wall Measurement & Instant Quote',
      'Furniture & Floor Plastic Cover Protection',
      'Dustless Sanding Technology',
      '1-Year Paint Guarantee'
    ]
  }
};

// Non-enumerable aliases for slug/ID reconciliation and backward compatibility
// Using non-enumerable properties ensures Object.values(SERVICES_DATA) and Object.keys(SERVICES_DATA)
// only return canonical items without duplicates.
const ALIASES = {
  'painting': 'wall-painting',
  'cat-painting': 'wall-painting',
  'cat-electrical': 'electrical',
  'cat-plumbing': 'plumbing',
  'cat-carpentry': 'carpentry',
  'cat-cleaning': 'cleaning',
  'cat-appliance': 'appliance-repair',
  'appliance': 'appliance-repair',
  'cat-eldercare': 'eldercare'
};

Object.entries(ALIASES).forEach(([aliasKey, targetKey]) => {
  if (SERVICES_DATA[targetKey] && !Object.prototype.hasOwnProperty.call(SERVICES_DATA, aliasKey)) {
    Object.defineProperty(SERVICES_DATA, aliasKey, {
      value: SERVICES_DATA[targetKey],
      enumerable: false,
      writable: true,
      configurable: true
    });
  }
});

/**
 * Resolves a service by id, slug, catId, or fuzzy trade name.
 * Guarantees returning a valid canonical service object from SERVICES_DATA.
 */
export const getServiceById = (id) => {
  if (!id) return SERVICES_DATA['electrical'];
  if (SERVICES_DATA[id]) return SERVICES_DATA[id];

  const lower = String(id).toLowerCase().trim();
  if (SERVICES_DATA[lower]) return SERVICES_DATA[lower];

  const found = Object.values(SERVICES_DATA).find(
    (s) => s && (s.id === id || s.id === lower || s.catId === id || s.catId === lower || s.backendId === id || s._id === id)
  );
  if (found) return found;

  if (lower.includes('electr')) return SERVICES_DATA['electrical'];
  if (lower.includes('plum')) return SERVICES_DATA['plumbing'];
  if (lower.includes('carp')) return SERVICES_DATA['carpentry'];
  if (lower.includes('clean')) return SERVICES_DATA['cleaning'];
  if (lower.includes('appliance') || lower.includes('ac')) return SERVICES_DATA['appliance-repair'];
  if (lower.includes('elder')) return SERVICES_DATA['eldercare'];
  if (lower.includes('paint')) return SERVICES_DATA['wall-painting'];

  return SERVICES_DATA['electrical'];
};
