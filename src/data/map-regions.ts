/**
 * Map Regions Data
 * Course information for the interactive discovery map
 */

export interface Course {
  id: string;
  name: string;
  location: string;
  signatureHole: string;
  signatureHoleImage: string;
  description: string;
  established?: number;
}

export interface MapRegion {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  courses: Course[];
  // SVG path viewBox positioning
  centerX: number;
  centerY: number;
  // Optional ambient sound for hover
  ambientSound?: string;
}

// Scotland courses
const scotlandCourses: Course[] = [
  {
    id: 'st-andrews-old',
    name: 'St Andrews Old Course',
    location: 'St Andrews, Fife',
    signatureHole: '17th - Road Hole',
    signatureHoleImage: 'https://images.unsplash.com/photo-1697846461121-201fde5a4fad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'The Home of Golf. A pilgrimage every golfer must make.',
    established: 1552
  },
  {
    id: 'royal-dornoch',
    name: 'Royal Dornoch',
    location: 'Dornoch, Highlands',
    signatureHole: '14th - Foxy',
    signatureHoleImage: 'https://images.unsplash.com/photo-1639156353290-4dda45b9281a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Tom Watson\'s favorite links. Pure, unspoiled golf.',
    established: 1877
  },
  {
    id: 'muirfield',
    name: 'Muirfield',
    location: 'Gullane, East Lothian',
    signatureHole: '13th',
    signatureHoleImage: 'https://images.unsplash.com/photo-1672871583062-7613925d0734?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Home of The Honourable Company of Edinburgh Golfers.',
    established: 1744
  },
  {
    id: 'turnberry-ailsa',
    name: 'Trump Turnberry (Ailsa)',
    location: 'Turnberry, Ayrshire',
    signatureHole: '9th - Bruce\'s Castle',
    signatureHoleImage: 'https://images.unsplash.com/photo-1642550918683-0196bda8be7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Dramatic clifftop links with iconic lighthouse.',
    established: 1901
  }
];

// Ireland courses
const irelandCourses: Course[] = [
  {
    id: 'ballybunion-old',
    name: 'Ballybunion Old Course',
    location: 'Ballybunion, Co. Kerry',
    signatureHole: '11th',
    signatureHoleImage: 'https://images.unsplash.com/photo-1693113448288-015fb6eed7c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Wild Atlantic links. Simply breathtaking.',
    established: 1893
  },
  {
    id: 'lahinch',
    name: 'Lahinch Golf Club',
    location: 'Lahinch, Co. Clare',
    signatureHole: '5th - Dell',
    signatureHoleImage: 'https://images.unsplash.com/photo-1693113448333-0123750f17f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'The St Andrews of Ireland. Watch for the goats.',
    established: 1892
  },
  {
    id: 'royal-county-down',
    name: 'Royal County Down',
    location: 'Newcastle, Co. Down',
    signatureHole: '9th',
    signatureHoleImage: 'https://images.unsplash.com/photo-1616939472071-a69e775e4d8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Often ranked the world\'s best. Mountains of Mourne sweeping down.',
    established: 1889
  },
  {
    id: 'waterville',
    name: 'Waterville Golf Links',
    location: 'Waterville, Co. Kerry',
    signatureHole: '17th - Mulcahy\'s Peak',
    signatureHoleImage: 'https://images.unsplash.com/photo-1505216128104-44f34619861f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Remote, rugged, and utterly spectacular.',
    established: 1889
  }
];

// Wales courses
const walesCourses: Course[] = [
  {
    id: 'royal-porthcawl',
    name: 'Royal Porthcawl',
    location: 'Porthcawl, Bridgend',
    signatureHole: '18th',
    signatureHoleImage: 'https://images.unsplash.com/photo-1697750783148-a7b6442de5ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Wales\' finest links, overlooking the Bristol Channel.',
    established: 1891
  },
  {
    id: 'pennard',
    name: 'Pennard Golf Club',
    location: 'Swansea, Gower Peninsula',
    signatureHole: '7th',
    signatureHoleImage: 'https://images.unsplash.com/photo-1545244407-25f1617c865b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Hidden gem on the Gower. Castle ruins frame the fairways.',
    established: 1896
  },
  {
    id: 'conwy',
    name: 'Conwy Golf Club',
    location: 'Conwy, North Wales',
    signatureHole: '3rd',
    signatureHoleImage: 'https://images.unsplash.com/photo-1557316655-8715fdecd2d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Links golf with Snowdonia as your backdrop.',
    established: 1890
  }
];

// England courses
const englandCourses: Course[] = [
  {
    id: 'royal-st-georges',
    name: 'Royal St George\'s',
    location: 'Sandwich, Kent',
    signatureHole: '4th',
    signatureHoleImage: 'https://images.unsplash.com/photo-1693572709450-8c1be5b360c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Open Championship venue. Towering dunes, deep bunkers.',
    established: 1887
  },
  {
    id: 'royal-birkdale',
    name: 'Royal Birkdale',
    location: 'Southport, Merseyside',
    signatureHole: '12th',
    signatureHoleImage: 'https://images.unsplash.com/photo-1523982765444-622af25647b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'England\'s finest Open venue. Fair but demanding.',
    established: 1889
  },
  {
    id: 'royal-lytham',
    name: 'Royal Lytham & St Annes',
    location: 'Lytham St Annes, Lancashire',
    signatureHole: '17th',
    signatureHoleImage: 'https://images.unsplash.com/photo-1459548069978-7c1e521d3d22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Historic links surrounded by red-brick houses. Deceptively tough.',
    established: 1886
  },
  {
    id: 'sunningdale-old',
    name: 'Sunningdale Old Course',
    location: 'Sunningdale, Berkshire',
    signatureHole: '5th',
    signatureHoleImage: 'https://images.unsplash.com/photo-1761978503733-54eba581cad4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Heathland perfection. Where Bobby Jones shot 66.',
    established: 1901
  }
];

export const mapRegions: MapRegion[] = [
  {
    id: 'scotland',
    name: 'Scotland',
    slug: 'scotland',
    tagline: 'Home of Golf',
    courses: scotlandCourses,
    centerX: 220,
    centerY: 95,
    ambientSound: '/audio/wind-over-dunes.mp3'
  },
  {
    id: 'ireland',
    name: 'Ireland',
    slug: 'ireland',
    tagline: 'Wild Atlantic Links',
    courses: irelandCourses,
    centerX: 70,
    centerY: 230,
    ambientSound: '/audio/ocean-waves.mp3'
  },
  {
    id: 'wales',
    name: 'Wales',
    slug: 'wales',
    tagline: 'Hidden Treasures',
    courses: walesCourses,
    centerX: 188,
    centerY: 318,
    ambientSound: '/audio/wind-over-dunes.mp3'
  },
  {
    id: 'england',
    name: 'England',
    slug: 'england',
    tagline: 'Royal Heritage',
    courses: englandCourses,
    centerX: 248,
    centerY: 310,
    ambientSound: '/audio/ocean-waves.mp3'
  }
];

// Helper functions
export function getRegionBySlug(slug: string): MapRegion | undefined {
  return mapRegions.find(r => r.slug === slug);
}

export function getAllCourses(): Course[] {
  return mapRegions.flatMap(r => r.courses);
}

export function getCourseById(id: string): Course | undefined {
  return getAllCourses().find(c => c.id === id);
}

export function getRandomCourse(regionSlug?: string): Course {
  const courses = regionSlug
    ? getRegionBySlug(regionSlug)?.courses || []
    : getAllCourses();
  return courses[Math.floor(Math.random() * courses.length)];
}
