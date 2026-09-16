import Fuse from 'fuse.js';
import { fetchServices } from './servicesApi.js';
import { fetchWorkers } from './workersApi.js';
import { SERVICES_DATA } from '../data/servicesData.js';

/**
 * Common service metadata mapping for canonical categories
 */
const CANONICAL_CATEGORIES = {
  ELECTRICAL: {
    slug: 'electrical',
    profession: 'Electrician',
    synonyms: ['electrician', 'electrical', 'wiring', 'switchboard', 'fan repair', 'mcb', 'fuse', 'socket', 'light fixture', 'short circuit', 'power']
  },
  PLUMBING: {
    slug: 'plumbing',
    profession: 'Plumber',
    synonyms: ['plumber', 'plumbing', 'pipe', 'leak', 'tap', 'drain', 'clog', 'faucet', 'sanitary', 'bathroom fitting', 'water leakage', 'sink', 'toilet']
  },
  CLEANING: {
    slug: 'cleaning',
    profession: 'Cleaner',
    synonyms: ['cleaner', 'cleaning', 'house cleaning', 'home cleaning', 'deep cleaning', 'sanitization', 'hygiene', 'sweeping', 'mopping', 'bathroom cleaning', 'sofa shampooing', 'kitchen cleaning']
  },
  APPLIANCE: {
    slug: 'appliance-repair',
    profession: 'AC Technician / Appliance Specialist',
    synonyms: ['ac repair', 'ac service', 'air conditioner', 'appliance', 'cooling', 'hvac', 'refrigerator', 'washing machine', 'microwave', 'jet servicing']
  },
  CARPENTRY: {
    slug: 'carpentry',
    profession: 'Carpenter',
    synonyms: ['carpenter', 'carpentry', 'woodwork', 'furniture', 'door lock', 'latch', 'hinges', 'drawer', 'modular kitchen', 'shelf mounting']
  },
  PAINTING: {
    slug: 'painting',
    profession: 'Painter',
    synonyms: ['painter', 'painting', 'wall paint', 'whitewash', 'distemper', 'waterproofing', 'surface painting']
  },
  ELDERCARE: {
    slug: 'eldercare',
    profession: 'Elder Care Assistant',
    synonyms: ['eldercare', 'elder care', 'senior assistance', 'home care', 'patient caregiver', 'nurse']
  }
};

let cachedIndexItems = null;
let fuseInstance = null;
let loadPromise = null;

/**
 * Builds the search index from database services, verified workers, and catalog data
 */
export async function buildSearchIndex(forceRefresh = false) {
  if (cachedIndexItems && !forceRefresh) {
    return cachedIndexItems;
  }

  if (loadPromise && !forceRefresh) {
    return loadPromise;
  }

  loadPromise = (async () => {
    try {
      // 1. Fetch live services from backend
      const [backendServices, backendWorkers] = await Promise.all([
        fetchServices().catch(() => []),
        fetchWorkers().catch(() => [])
      ]);

      const items = [];
      const seenKeys = new Set();

      // Helper to add unique item
      const addItem = (item) => {
        const key = `${item.type}:${item.title.toLowerCase()}:${item.serviceId || ''}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          items.push(item);
        }
      };

      // 2. Index Primary Professions (e.g. Electrician, Plumber, Cleaner)
      Object.entries(CANONICAL_CATEGORIES).forEach(([catKey, catMeta]) => {
        addItem({
          id: `prof-${catMeta.slug}`,
          type: 'profession',
          title: catMeta.profession,
          subtitle: `Verified Guild Artisans • ${catKey.replace('_', ' ')}`,
          category: catKey,
          serviceId: catMeta.slug,
          profession: catMeta.profession,
          keywords: [catMeta.profession.toLowerCase(), ...catMeta.synonyms],
          description: `Book verified ${catMeta.profession.toLowerCase()}s for home and office service with guaranteed fair guild rates.`,
          badge: 'Profession',
          url: `/services/${catMeta.slug}/workers`
        });
      });

      // 3. Index Catalog Services (SERVICES_DATA)
      Object.entries(SERVICES_DATA).forEach(([slug, srv]) => {
        const catKey = (srv.catId?.replace('cat-', '') || slug).toUpperCase();
        const catMeta = CANONICAL_CATEGORIES[catKey] || CANONICAL_CATEGORIES[slug.toUpperCase()] || {};
        const allKeywords = [
          srv.name.toLowerCase(),
          slug.toLowerCase(),
          ...(catMeta.synonyms || []),
          ...(srv.includedTasks || []).map((t) => t.toLowerCase())
        ];

        addItem({
          id: `srv-cat-${slug}`,
          type: 'service',
          title: srv.name,
          subtitle: `Starting from ₹${srv.basePrice} • ${srv.rating} ★ (${srv.reviewsCount}+ reviews)`,
          category: catKey,
          serviceId: slug,
          profession: catMeta.profession || srv.name,
          keywords: allKeywords,
          description: srv.description || srv.tagline || '',
          badge: 'Service',
          url: `/services/${slug}`
        });

        // Index specific included tasks as sub-items (e.g. "Ceiling Fan Installation", "MCB Tripping Repair")
        (srv.includedTasks || []).forEach((task, idx) => {
          addItem({
            id: `task-${slug}-${idx}`,
            type: 'task',
            title: task,
            subtitle: `Included under ${srv.name} • ₹${srv.basePrice}`,
            category: catKey,
            serviceId: slug,
            profession: catMeta.profession || srv.name,
            keywords: [task.toLowerCase(), slug.toLowerCase(), ...(catMeta.synonyms || [])],
            description: `Task performed by verified ${catMeta.profession || 'artisans'}.`,
            badge: 'Task',
            url: `/services/${slug}`
          });
        });
      });

      // 4. Index Live Backend Database Services
      const rawDbServices = Array.isArray(backendServices)
        ? backendServices
        : backendServices?.data || [];

      rawDbServices.forEach((dbSrv) => {
        if (!dbSrv || !dbSrv.name) return;
        const cat = (dbSrv.category || 'OTHER').toUpperCase();
        const slug = CANONICAL_CATEGORIES[cat]?.slug || 'electrical';
        const catMeta = CANONICAL_CATEGORIES[cat] || {};

        addItem({
          id: `dbsrv-${dbSrv._id || dbSrv.serviceCode}`,
          type: 'service',
          title: dbSrv.name,
          subtitle: `Cooperative Rate: ₹${dbSrv.baseLaborPrice || 299} • ${cat}`,
          category: cat,
          serviceId: slug,
          profession: catMeta.profession || cat,
          keywords: [
            dbSrv.name.toLowerCase(),
            dbSrv.serviceCode?.toLowerCase() || '',
            ...(catMeta.synonyms || [])
          ],
          description: typeof dbSrv.description === 'string' ? dbSrv.description : '',
          badge: 'Service',
          url: `/services/${slug}`
        });
      });

      // 5. Index Verified Live Workers (respecting privacy and verified status)
      const rawDbWorkers = Array.isArray(backendWorkers)
        ? backendWorkers
        : backendWorkers?.data?.workers || [];

      rawDbWorkers.forEach((worker) => {
        if (!worker || !worker.fullName) return;
        const cat = (worker.primaryServiceCategory || worker.skills?.[0]?.category || 'ELECTRICAL').toUpperCase();
        const catMeta = CANONICAL_CATEGORIES[cat] || CANONICAL_CATEGORIES.ELECTRICAL;
        const slug = catMeta.slug || 'electrical';

        const workerSkills = [
          worker.primarySkill || '',
          ...(worker.servicesOffered || []),
          ...(worker.skills || []).map((s) => s.category || '')
        ].filter(Boolean);

        addItem({
          id: `worker-${worker._id}`,
          type: 'worker',
          workerId: worker._id,
          title: worker.fullName,
          subtitle: `${worker.metrics?.averageRating || 4.9} ★ • ${catMeta.profession || 'Artisan'} • ${worker.city || 'Delhi'}`,
          category: cat,
          serviceId: slug,
          profession: catMeta.profession || 'Artisan',
          keywords: [
            worker.fullName.toLowerCase(),
            catMeta.profession.toLowerCase(),
            ...workerSkills.map((s) => s.toLowerCase()),
            ...(catMeta.synonyms || [])
          ],
          description: worker.aboutMe || `Verified artisan member of ${worker.societyId?.name || 'Worker Cooperative'}.`,
          badge: 'Worker',
          url: `/worker/${worker._id}`
        });
      });

      cachedIndexItems = items;

      // Initialize Fuse.js with balanced weights and misspelling tolerance
      fuseInstance = new Fuse(items, {
        includeScore: true,
        includeMatches: true,
        threshold: 0.4, // Allows typos like 'electrcian' (dist 1) & 'cleanning' (dist 1)
        distance: 100,
        minMatchCharLength: 2,
        ignoreLocation: true,
        keys: [
          { name: 'title', weight: 0.4 },
          { name: 'keywords', weight: 0.3 },
          { name: 'profession', weight: 0.15 },
          { name: 'category', weight: 0.1 },
          { name: 'description', weight: 0.05 }
        ]
      });

      return items;
    } finally {
      loadPromise = null;
    }
  })();

  return loadPromise;
}

/**
 * Normalizes input string (whitespace normalization, lowercase, trimmed)
 */
export function normalizeQuery(query) {
  if (!query || typeof query !== 'string') return '';
  return query.trim().replace(/\s+/g, ' ').toLowerCase();
}

/**
 * Executes a typo-tolerant, ranked fuzzy search against the GigSevak corpus.
 *
 * Exact & strong prefix matches are guaranteed to rank above weak fuzzy matches.
 *
 * @param {string} rawQuery Search input
 * @param {number} maxResults Maximum suggestions to return
 * @returns {Promise<Array>} Ranked results
 */
export async function searchServicesAndWorkers(rawQuery, maxResults = 8) {
  const query = normalizeQuery(rawQuery);
  if (!query || query.length < 2) {
    return [];
  }

  // Ensure index is ready
  let items = cachedIndexItems;
  if (!items || !fuseInstance) {
    items = await buildSearchIndex();
  }

  // 1. Run Fuse.js fuzzy search
  const fuseResults = fuseInstance.search(query);

  // 2. Custom Ranking Engine: Rank exact and prefix matches above fuzzy matches
  const ranked = fuseResults.map((result) => {
    const item = result.item;
    const fuseScore = result.score; // 0 is best, 1 is worst
    const titleLower = item.title.toLowerCase();
    const queryTokens = query.split(' ');

    let rankScore = fuseScore;

    // Check exact title match
    if (titleLower === query) {
      rankScore = -1.0; // Top priority
    }
    // Check title prefix match (e.g. "elec" -> "Electrical Repair")
    else if (titleLower.startsWith(query)) {
      rankScore = -0.6;
    }
    // Check if any keyword matches query exactly (e.g. "electrician" in keywords)
    else if (item.keywords && item.keywords.some((k) => k === query)) {
      rankScore = -0.5;
    }
    // Check if title has any word starting with query (e.g. "house" in "Full Home Deep Sanitization")
    else if (titleLower.split(' ').some((w) => w.startsWith(query))) {
      rankScore = -0.3;
    }
    // Check multi-word query: all tokens appear in title or keywords
    else if (
      queryTokens.length > 1 &&
      queryTokens.every(
        (token) =>
          titleLower.includes(token) ||
          (item.keywords && item.keywords.some((k) => k.includes(token)))
      )
    ) {
      rankScore = -0.2;
    }

    return {
      ...item,
      rankScore,
      matchScore: fuseScore
    };
  });

  // Sort: lowest rankScore first
  ranked.sort((a, b) => a.rankScore - b.rankScore);

  // Return deduplicated top results
  const seenIds = new Set();
  const finalResults = [];

  for (const item of ranked) {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      finalResults.push(item);
      if (finalResults.length >= maxResults) break;
    }
  }

  return finalResults;
}

/**
 * Returns preloaded popular search suggestions when the input is empty/focused
 */
export function getPopularSuggestions() {
  return [
    {
      id: 'pop-electrician',
      type: 'profession',
      title: 'Electrician',
      subtitle: 'Switchboards, Wiring, Fan Repair & Light Installation',
      serviceId: 'electrical',
      badge: 'Popular',
      url: '/services/electrical/workers'
    },
    {
      id: 'pop-plumber',
      type: 'profession',
      title: 'Plumber',
      subtitle: 'Pipe Leaks, Tap Fixing, Clogs & Drainage',
      serviceId: 'plumbing',
      badge: 'Popular',
      url: '/services/plumbing/workers'
    },
    {
      id: 'pop-cleaning',
      type: 'profession',
      title: 'Cleaning & Hygiene',
      subtitle: 'Full House Deep Sanitization & Kitchen Scrubbing',
      serviceId: 'cleaning',
      badge: 'Popular',
      url: '/services/cleaning'
    },
    {
      id: 'pop-ac',
      type: 'service',
      title: 'AC Jet Servicing',
      subtitle: 'Foam wash, Filter Cleaning & Cooling Check',
      serviceId: 'appliance-repair',
      badge: 'Popular',
      url: '/services/appliance-repair'
    }
  ];
}
