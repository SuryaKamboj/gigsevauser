export const WORKERS_DATA = [
  // 1 CANONICAL WORKER CONNECTED TO BACKEND MONGODB
  {
    id: 'el-1',
    _id: '6aa307c9abef287d06eb4213',
    backendId: '6aa307c9abef287d06eb4213',
    workerCode: 'WK-DEL-001',
    serviceId: 'electrical',
    fullName: 'Rajesh Kumar',
    profession: 'Master Electrician',
    trustScore: 96.0,
    distanceKm: 1.2,
    rating: 4.9,
    jobsCompleted: 198,
    experienceYears: 8,
    basePrice: 420,
    availableNow: true,
    languages: ['Hindi', 'English', 'Punjabi'],
    cooperative: 'South Delhi Worker Cooperative Society',
    coopRegNo: 'SOC-SD-001',
    avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400',
    bio: 'Certified master electrician with 8+ years of residential and commercial experience. Specializes in smart switchboard upgrades, emergency trip fixes, and safety wiring.',
    skills: ['MCB Diagnostics', 'Smart Home Wiring', 'Heavy Appliance Lines', 'Safety Audits'],

    // Cooperative Guild Details
    guildDetails: {
      guildName: 'South Delhi Worker Cooperative Society',
      trustScore: 98.4,
      activeWorkers: '140+ Members',
      responseTime: '< 15 mins',
      disputeResolutionRate: '99.8%',
      yearsActive: '8+ Years'
    },

    // Trust Score Breakdown
    trustBreakdown: [
      { label: 'Customer Ratings', score: 98, color: '#A66666' },
      { label: 'Completion Rate', score: 99, color: '#4E8A57' },
      { label: 'Response Time', score: 96, color: '#6B62B8' },
      { label: 'Verification Score', score: 100, color: '#17233A' },
      { label: 'Complaint Resolution', score: 99, color: '#B86A4B' }
    ],

    // Verified Work Gallery (Before & After)
    workGallery: [
      {
        id: 'wg-1',
        title: 'Burnt Switchboard Overhaul',
        jobType: 'Emergency MCB & Wiring Repair',
        date: '14 Aug 2026',
        rating: 5.0,
        location: 'Lajpat Nagar II, New Delhi',
        beforeImg: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=500&auto=format&fit=crop&q=80',
        afterImg: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=80'
      }
    ],

    // Verification Badges
    verificationBadges: [
      { id: 'b1', title: 'Identity Verified', description: 'Aadhaar & Police Background Checked' },
      { id: 'b2', title: 'Guild Verified', description: 'Registered with South Delhi Cooperative' },
      { id: 'b3', title: 'Background Checked', description: 'Zero criminal record verification' },
      { id: 'b4', title: 'Skill Certified', description: 'Level 4 Industrial Electrician Certification' }
    ],

    // Community Impact Metrics
    impactMetrics: {
      totalCoopJobs: 198,
      economicContribution: '₹18.4 Lakhs Direct Income',
      familiesSupported: '4 Family Members',
      customerSatisfaction: '99.4%'
    },

    whyChoose: [
      { title: '8+ Years Master Expertise', desc: 'Over 190+ verified electrical jobs executed safely.' },
      { title: '30-Day Guild Warranty', desc: 'Free revisit guarantee backed by South Delhi Cooperative.' },
      { title: '100% Background Checked', desc: 'Biometric identity & police certificate verified.' },
      { title: 'Transparent Rate Card', desc: 'No middleman fee markup. 100% direct artisan pay.' }
    ],

    ratingDistribution: {
      totalReviews: 142,
      fiveStarPercent: 92,
      fourStarPercent: 6,
      threeStarPercent: 2,
      twoStarPercent: 0,
      oneStarPercent: 0
    },

    reviewTags: ['Punctual', 'Expert Diagnosis', 'Clean Work', 'Polite Behavior', 'Fair Pricing', 'Safety Conscious'],

    reviews: [
      {
        id: 'r1',
        author: 'Surya Dev Kamboj',
        location: 'Lajpat Nagar II',
        date: '3 days ago',
        rating: 5,
        isVerified: true,
        tag: 'Punctual & Expert',
        comment: 'The cooperative electrician arrived within 15 minutes. Extremely transparent pricing, polite behavior, and flawless repair work on our main breaker.'
      }
    ]
  }
];

export const getWorkerById = (id) => {
  return WORKERS_DATA.find((w) => w.id === id || w._id === id || w.backendId === id) || WORKERS_DATA[0];
};

export const getWorkersByService = (serviceId) => {
  const filtered = WORKERS_DATA.filter((w) => w.serviceId === serviceId);
  return filtered.length > 0 ? filtered : WORKERS_DATA;
};

