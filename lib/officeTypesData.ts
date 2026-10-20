export interface OfficeTypeItem {
  id: string;
  name: string;
  slug: string;
  categoryName: string; // Exactly matches Supabase categories table
  categorySlug: string;
  image: string;
  image2: string;
  tagline: string;
  descriptionParagraph1: string;
  descriptionParagraph2: string;
  amenitiesHeading: string;
  accordion: {
    advantages: string[];
    membershipBenefits: string[];
    additionalServices: string[];
  };
  capacity?: string;
  startingPrice?: string;
}

export const OFFICE_TYPES: OfficeTypeItem[] = [
  {
    id: 'shared-office',
    name: 'Shared Office',
    slug: 'shared-office',
    categoryName: 'Hot Desk',
    categorySlug: 'hot-desk-1626',
    image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=85',
    image2: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=85',
    tagline: 'Flexible, community-driven shared workstations in our sunlit botanical courtyard.',
    descriptionParagraph1: 'Expand your network and experience the support of a business community. Work next to passionate professionals in our quiet, shared office space. Shared offices are a flexible and cost-effective solution for businesses of all sizes.',
    descriptionParagraph2: 'Shared office spaces are intended to promote community and collaboration among professionals who share similar goals, and small organisations since they frequently include services like high speed internet, conference rooms, and common areas.',
    amenitiesHeading: 'Amenities Shared Office',
    accordion: {
      advantages: [
        'Abundant parking & EV charging stations',
        'Receptionist and Admin Services',
        'Professional Business Services',
        'High-Quality Ergonomic Workstations',
        'Free Reliable High-Speed Wi-Fi',
        'Free mineral water & artisan coffee',
        'Free Daily Maintenance & Housekeeping'
      ],
      membershipBenefits: [
        'Flexible month-to-month and day pass options',
        'Complimentary meeting room reservation credits',
        'Unrestricted access to botanical courtyard & terrace lounges',
        'Weekly founder mixers, networking events, and masterclasses',
        'High-speed cloud printing, copying, and scanning station',
        'Front-desk mail and courier reception handling'
      ],
      additionalServices: [
        'Dedicated multi-level vehicle and two-wheeler parking',
        'Official business address & GST registration documentation support',
        'Private lockable pedestals and personal storage lockers',
        'Gourmet catering and event space rental packages',
        'Dedicated IT support and custom network configuration'
      ]
    },
    // capacity: '1 Person (Flexible Access)',
    // startingPrice: '₹6,999 / month'
  },
  {
    id: 'private-office',
    name: 'Private Offices',
    slug: 'private-office',
    categoryName: 'Private Office',
    categorySlug: 'private-office-4260',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85',
    image2: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=85',
    tagline: 'Acoustically insulated private executive suites designed for confidentiality and deep focus.',
    descriptionParagraph1: 'Experience total confidentiality, acoustic serenity, and bespoke executive luxury. Work in a fully furnished, private office suite designed for leadership teams, founders, and focused professionals requiring an exclusive sanctuary.',
    descriptionParagraph2: 'Private offices offer secure, lockable suites with soundproof acoustic double-glazed glass, solid wood desks, dedicated enterprise fiber subnets, and premium receptionist concierge support without the overhead of long-term commercial leases.',
    amenitiesHeading: 'Amenities Private Offices',
    accordion: {
      advantages: [
        'Acoustic double-glazed glass soundproofing',
        '24/7 Biometric and smart card access security',
        'Dedicated gigabit fiber VLAN & private encrypted IP',
        'Executive ergonomic chairs & motorized standing desks',
        'Complimentary 4K conference hall reservation credits',
        'Daily white-glove cleaning & sanitization',
        'Professional registered office address & GST filing support'
      ],
      membershipBenefits: [
        'All-inclusive utilities, HVAC, and 100% dual-grid power backup',
        'Unrestricted access to courtyard lounges, café, and phone booths',
        'Dedicated on-site community concierge lead',
        'Generous discounted passes for visiting clients and guests',
        'Priority access to podcast studio and executive boardrooms'
      ],
      additionalServices: [
        'Custom entrance door logo signage & interior wall branding',
        'Private server rack hosting in climate-controlled IT closet',
        'Executive in-room butler beverage & catering services',
        'Reserved basement parking bays with EV fast-chargers'
      ]
    },
    // capacity: '1 – 8 Persons',
    // startingPrice: '₹18,000 / month'
  },
  {
    id: 'team-office',
    name: 'Team Offices',
    slug: 'team-office',
    categoryName: 'Team Space',
    categorySlug: 'team-space-1527',
    image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1200&q=85',
    image2: 'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?auto=format&fit=crop&w=1200&q=85',
    tagline: 'Self-contained departmental headquarters with internal meeting pods and custom corporate branding.',
    descriptionParagraph1: 'A dedicated departmental wing engineered for scaling startups, engineering units, and enterprise branch offices. Enjoy your own private, self-contained office suite with collaborative open benching and executive manager cabins.',
    descriptionParagraph2: 'Team offices combine the sovereignty and branding of a traditional corporate headquarters with the flexibility and curated amenities of a luxury botanical coworking sanctuary, all backed by dedicated enterprise facilities management.',
    amenitiesHeading: 'Amenities Team Offices',
    accordion: {
      advantages: [
        'Self-contained private team department wing',
        'Internal 6-person collaboration huddle room',
        'Custom entrance company wall branding',
        'Private high-speed server subnet & firewall',
        'Dedicated account manager & IT support',
        'Unlimited fresh artisan coffee & pantry access',
        'Abundant reserved parking & EV charging'
      ],
      membershipBenefits: [
        'Priority booking across all campus conference halls',
        'Flexible month-to-month scaling as your headcount expands',
        'Full access to courtyard amenities, garden terraces, and event spaces',
        '24/7 secured keycard access with individual employee audit logs'
      ],
      additionalServices: [
        'Customized furniture arrangements and ergonomic accessories',
        'Private corporate pantry or executive kitchenette setup',
        'Dedicated telephone lines and direct reception call routing',
        'Quarterly deep team retreat planning in our courtyard halls'
      ]
    },
    // capacity: '8 – 35+ Persons',
    // startingPrice: 'Custom Enterprise Quotes'
  },
  {
    id: 'meeting-rooms',
    name: 'Meeting Rooms',
    slug: 'meeting-rooms',
    categoryName: 'Meeting Rooms',
    categorySlug: 'meeting-rooms-4650',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=85',
    image2: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=1200&q=85',
    tagline: 'State-of-the-art video conference halls with AI auto-framing, acoustic damping, and catering service.',
    descriptionParagraph1: 'Make an unforgettable impression on clients, partners, and investors. Our high-tech conference rooms and boardrooms are equipped with 4K HDR displays, AI video framing, and acoustic felt treatments.',
    descriptionParagraph2: 'Designed for seamless collaboration, board reviews, and hybrid video conferences, featuring wireless screen casting, studio-grade beamforming microphones, and one-touch refreshment ordering.',
    amenitiesHeading: 'Amenities Meeting Rooms',
    accordion: {
      advantages: [
        'Neat Bar Pro AI auto-framing 4K video camera',
        'Dual 75-inch Sony 4K presentation displays',
        'Ceiling beamforming microphone arrays',
        'Full-wall magnetic tempered glass whiteboard',
        'One-touch wireless casting (AirPlay, Miracast, HDMI)',
        'Acoustic sound absorption & noise dampening',
        'High-speed dedicated guest Wi-Fi network'
      ],
      membershipBenefits: [
        'Hourly, half-day, and full-day flexible booking options',
        'Front-desk receptionist greeting and guest escorting',
        'Complimentary artisan tea, espresso, and infused waters',
        'Technical assistance prior to meeting start'
      ],
      additionalServices: [
        'Curated beverage & gourmet catering lunch platters',
        'Live session recording and podcast AV hookup',
        'Post-meeting event breakout space reservations in garden courtyard'
      ]
    },
    // capacity: '4 – 16 Persons',
    // startingPrice: 'From ₹1,199 / hour'
  }
];

// Helper to look up an office type by slug with fallback aliases
export function getOfficeTypeBySlug(slug: string): OfficeTypeItem | undefined {
  const normalized = (slug || '').toLowerCase().trim();
  return OFFICE_TYPES.find(
    (o) =>
      o.slug === normalized ||
      o.id === normalized ||
      (normalized === 'hot-desk' && o.slug === 'shared-office') ||
      (normalized === 'team-space' && o.slug === 'team-office') ||
      (normalized === 'private-offices' && o.slug === 'private-office') ||
      (normalized === 'team-offices' && o.slug === 'team-office')
  );
}
