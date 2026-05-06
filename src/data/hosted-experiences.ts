export interface Host {
  name: string;
  title: string;
  photo: string;
}

export interface HostedExperience {
  id: string;
  name: string;
  host: Host;
  dates: string;
  destination: string;
  description: string;
  highlights: string[];
  image: string;
  status: 'open' | 'limited' | 'sold_out';
  price?: string;
  spotsRemaining?: number;
}

export const hostedExperiences: HostedExperience[] = [
  {
    id: 'st-andrews-pilgrimage-2025',
    name: 'The St Andrews Pilgrimage',
    host: {
      name: 'Colin MacLeod',
      title: 'Head Golf Professional',
      photo: '' // TODO: Replace with real host headshot
    },
    dates: 'May 15-22, 2025',
    destination: 'Scotland',
    description: 'Walk in the footsteps of legends on this bucket-list journey through Scottish golf history. Play the Old Course at St Andrews, Carnoustie, and Kingsbarns while enjoying luxury accommodations and exclusive access.',
    highlights: [
      'Old Course at St Andrews',
      'Carnoustie Championship Course',
      'Kingsbarns Golf Links',
      'Fairmont St Andrews stay',
      'Whisky tasting experience'
    ],
    image: 'https://images.unsplash.com/photo-1697846461121-201fde5a4fad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    status: 'limited',
    price: 'From $14,500 CAD',
    spotsRemaining: 4
  },
  {
    id: 'irish-links-adventure-2025',
    name: 'The Wild Atlantic Links',
    host: {
      name: 'Sean O\'Connor',
      title: 'Ireland Golf Director',
      photo: '' // TODO: Replace with real host headshot
    },
    dates: 'June 8-15, 2025',
    destination: 'Ireland',
    description: 'Experience the raw beauty of Ireland\'s western coast with rounds at the world\'s most spectacular links courses. From the towering dunes of Ballybunion to the dramatic cliffs of Lahinch, this is links golf at its finest.',
    highlights: [
      'Ballybunion Old Course',
      'Lahinch Golf Club',
      'Waterville Golf Links',
      'Trump International Doonbeg',
      'Traditional Irish pub evening'
    ],
    image: 'https://images.unsplash.com/photo-1693113448288-015fb6eed7c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    status: 'open',
    price: 'From $12,300 CAD'
  },
  {
    id: 'royal-championship-2025',
    name: 'The Royal Championship Tour',
    host: {
      name: 'James Whitfield',
      title: 'Senior Tour Director',
      photo: '' // TODO: Replace with real host headshot
    },
    dates: 'September 3-10, 2025',
    destination: 'England',
    description: 'Play the courses where Open Championship history was made. This prestigious tour takes you through England\'s finest royal venues, complete with exclusive clubhouse access and championship-quality conditions.',
    highlights: [
      'Royal Birkdale Golf Club',
      'Royal Lytham & St Annes',
      'Royal Liverpool (Hoylake)',
      'Formby Golf Club',
      'Championship dinner experience'
    ],
    image: 'https://images.unsplash.com/photo-1523982765444-622af25647b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    status: 'open',
    price: 'From $16,700 CAD'
  },
  {
    id: 'celtic-manor-retreat-2025',
    name: 'The Ryder Cup Heritage',
    host: {
      name: 'David Evans',
      title: 'Wales Golf Specialist',
      photo: '' // TODO: Replace with real host headshot
    },
    dates: 'July 20-25, 2025',
    destination: 'Wales',
    description: 'Relive Ryder Cup glory at Celtic Manor and discover the hidden gems of Welsh golf. This intimate tour combines world-class courses with the stunning natural beauty of the Welsh countryside.',
    highlights: [
      'Celtic Manor Twenty Ten Course',
      'Royal Porthcawl Golf Club',
      'Pennard Golf Club',
      'Luxury spa experience',
      'Welsh castle dinner'
    ],
    image: 'https://images.unsplash.com/photo-1702912092980-05aca31e5243?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    status: 'sold_out',
    price: 'From $11,100 CAD'
  }
];

export function getExperienceById(id: string): HostedExperience | undefined {
  return hostedExperiences.find(exp => exp.id === id);
}

export function getExperiencesByStatus(status: HostedExperience['status']): HostedExperience[] {
  return hostedExperiences.filter(exp => exp.status === status);
}

export function getExperiencesByDestination(destination: string): HostedExperience[] {
  return hostedExperiences.filter(exp => exp.destination.toLowerCase() === destination.toLowerCase());
}

export function getUpcomingExperiences(): HostedExperience[] {
  return hostedExperiences.filter(exp => exp.status !== 'sold_out');
}

export function getFeaturedExperiences(count: number = 3): HostedExperience[] {
  return hostedExperiences.slice(0, count);
}
