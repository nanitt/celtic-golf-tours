export interface Destination {
  name: string;
  tagline: string;
  courses: string;
  description: string;
  href: string;
  photoId: string;
}

export const destinations: Destination[] = [
  {
    name: 'Scotland',
    tagline: 'Home of Golf',
    courses: 'St Andrews · Turnberry · Royal Troon · Carnoustie',
    description: 'From the hallowed grounds of St Andrews to the rugged beauty of the Highlands, Scotland offers links golf at its most authentic.',
    href: '/destinations/scotland',
    photoId: 'photo-1581265064945-737852e55a53',
  },
  {
    name: 'Ireland',
    tagline: 'Wild Atlantic Links',
    courses: 'Royal Portrush · Lahinch · Ballybunion · Royal County Down',
    description: "Experience the raw beauty of Ireland's western coast with dramatic cliffs, rolling dunes, and legendary hospitality.",
    href: '/destinations/ireland',
    photoId: 'photo-1760294752180-50102c9334ac',
  },
  {
    name: 'Wales',
    tagline: 'Hidden Treasures',
    courses: 'Royal Porthcawl · Harlech · Pennard · Aberdovey',
    description: "Discover Wales' world-class courses set against stunning coastal and mountain backdrops, including Ryder Cup venues.",
    href: '/destinations/wales',
    photoId: 'photo-1549310705-a5cfd4627c06',
  },
  {
    name: 'England',
    tagline: 'Royal Heritage',
    courses: "Royal Birkdale · Royal St George's · Hoylake · Saunton",
    description: "Play the historic venues where Open Championship legends were made, from Royal Birkdale to Royal St George's.",
    href: '/destinations/england',
    photoId: 'photo-1742498626135-67a7d3501eff',
  },
];

export function unsplashUrl(photoId: string, width: number, quality = 80): string {
  return `https://images.unsplash.com/${photoId}?ixlib=rb-4.0.3&auto=format&fit=crop&w=${width}&q=${quality}`;
}
