import { Workspace, MeetingRoom, PricingPlan, Testimonial, FAQItem, Amenity, CityPresence, InsightArticle } from '@/types';

export const WORKSPACES: Workspace[] = [
  {
    id: 'private-office-executive',
    name: 'Executive Private Suite',
    category: 'private-office',
    categoryLabel: 'Private Office',
    tagline: 'A private sanctuary for leadership teams requiring confidentiality and bespoke refinement.',
    description: 'Sound-insulated premium suites featuring floor-to-ceiling natural light, acoustic oak paneling, Herman Miller ergonomic chairs, and private biometric access. Complete with dedicated fiber line and configurable executive layout.',
    capacity: '4 – 8 Persons',
    sqft: '350 sq.ft',
    startingPrice: '$1,850',
    billingPeriod: 'per month',
    availability: 'available',
    availabilityText: '2 Suites Available',
    location: 'Building A, 3rd Floor (Courtyard View)',
    floor: 'Floor 3',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'
    ],
    features: [
      '24/7 Biometric Access',
      'Dedicated 1Gbps Fiber VLAN',
      'Acoustically Treated Glass Walls',
      'Custom Walnut Desks & Storage',
      'Daily Concierge Cleaning',
      '20 hrs/mo Meeting Room Credits'
    ],
    amenities: ['Ergonomic Seating', 'High-Speed Fiber', 'Soundproofing', 'Private Lockers', 'Espresso Bar Access'],
    idealFor: 'Growing startup founders, VC partners, boutique agencies, and executive satellite teams.'
  },
  {
    id: 'dedicated-desk-atelier',
    name: 'Atelier Dedicated Desk',
    category: 'dedicated-desk',
    categoryLabel: 'Dedicated Desk',
    tagline: 'Your permanent workstation nestled beside our sunlit botanical courtyard.',
    description: 'A permanent desk reserved exclusively for you in a quiet, design-focused zone. Comes equipped with a motorized standing desk, lockable credenza, dual-monitor arm mounts, and ergonomic lumbar support seating.',
    capacity: '1 Person',
    sqft: '60 sq.ft',
    startingPrice: '$420',
    billingPeriod: 'per month',
    availability: 'available',
    availabilityText: '5 Desks Available',
    location: 'North Wing, 2nd Floor (Garden Vista)',
    floor: 'Floor 2',
    image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'
    ],
    features: [
      'Motorized Standing Desk',
      'Ergonomic Task Chair',
      'Lockable Pedestal Storage',
      '8 hrs/mo Meeting Room Credits',
      'Business Mail Handling',
      '24/7 Keycard Entry'
    ],
    amenities: ['Standing Desk', 'Personal Storage', 'Monitor Arms', 'Mail Service', 'Phone Booths'],
    idealFor: 'Solo founders, senior developers, architects, and remote professionals needing a fixed base.'
  },
  {
    id: 'hot-desk-courtyard',
    name: 'Courtyard Flex Hot Desk',
    category: 'hot-desk',
    categoryLabel: 'Hot Desk',
    tagline: 'Unrestricted access to dynamic shared lounges, botanical terrace, and quiet study rooms.',
    description: 'Work anywhere inspiration strikes. Choose between our sun-drenched central courtyard, sound-softened library tables, or open café benching. Perfect for hybrid workers and independent creators who crave variety.',
    capacity: '1 Person (Flexible)',
    sqft: 'Shared 4,000 sq.ft Commons',
    startingPrice: '$260',
    billingPeriod: 'per month',
    availability: 'available',
    availabilityText: 'Open Enrollment',
    location: 'Central Atrium & Ground Floor Terrace',
    floor: 'Floor 1 & Garden',
    image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80'
    ],
    features: [
      'Access to All Open Workspaces',
      'Ultra-Fast WiFi 6 Network',
      'Unlimited Artisanal Coffee & Tea',
      'Access to Soundproof Phone Booths',
      'Community Events & Masterclasses',
      'Mon–Fri 8am–8pm Access'
    ],
    amenities: ['Terrace Seating', 'Espresso Bar', 'Quiet Zone', 'High-Speed WiFi', 'Phone Booths'],
    idealFor: 'Freelancers, remote innovators, consultants, and teams with hybrid schedules.'
  },
  {
    id: 'team-suite-custom',
    name: 'Enterprise Team Suite',
    category: 'team-suite',
    categoryLabel: 'Team Space',
    tagline: 'A private headquarters with tailored floorplans, private meeting room, and custom branding.',
    description: 'A self-contained corporate wing designed for scale. Includes dedicated internal meeting pod, executive phone rooms, private kitchen/lounge option, and custom IT infrastructure configured to your security specifications.',
    capacity: '12 – 25 Persons',
    sqft: '1,200 sq.ft',
    startingPrice: '$5,200',
    billingPeriod: 'per month',
    availability: 'limited',
    availabilityText: '1 Suite Remaining',
    location: 'Building B, Penthouse Level',
    floor: 'Floor 4',
    image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?auto=format&fit=crop&w=1200&q=80'
    ],
    features: [
      'Private Internal 6-Person Meeting Room',
      'Dedicated Server Rack / Private Subnet',
      'Custom Corporate Wall Branding',
      '40 hrs/mo General Meeting Room Credits',
      'Dedicated Account Manager',
      'Full 24/7 Security & Keycard Management'
    ],
    amenities: ['Private Meeting Room', 'Dedicated Subnet', 'Branding Wall', 'Kitchenette Option', 'Concierge Service'],
    idealFor: 'Scale-ups, engineering teams, regional enterprise headquarters, and consulting firms.'
  },
  {
    id: 'studio-creative-lab',
    name: 'Design & Media Studio',
    category: 'team-suite',
    categoryLabel: 'Team Space',
    tagline: 'A specialized creative lab with color-calibrated lighting, drafting stations, and acoustic baffles.',
    description: 'Tailored for architects, product designers, and digital media teams. Features expansive solid wood pinup walls, drafting surfaces, acoustic damping, and dedicated gear storage.',
    capacity: '6 – 10 Persons',
    sqft: '680 sq.ft',
    startingPrice: '$3,100',
    billingPeriod: 'per month',
    availability: 'available',
    availabilityText: 'Available Next Month',
    location: 'West Wing, 3rd Floor',
    floor: 'Floor 3',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80'
    ],
    features: [
      'Color-Balanced 5000K Lighting',
      'Heavy Duty Solid Oak Layout Tables',
      'High-Speed Media NAS Hookup',
      'Acoustically Isolated Phone Booth',
      '24/7 Access'
    ],
    amenities: ['Drafting Tables', 'Media Storage', 'Acoustic Baffles', 'Color-Calibrated Lights'],
    idealFor: 'Design studios, architecture practices, video production hubs, and creative collectives.'
  }
];

export const MEETING_ROOMS: MeetingRoom[] = [
  {
    id: 'oak-boardroom',
    name: 'The Oak Executive Boardroom',
    type: 'boardroom',
    typeLabel: 'Executive Boardroom',
    tagline: 'High-stakes board meetings, investor pitches, and executive governance.',
    description: 'Centrally anchored by a handcrafted solid oak 14-seat table, this boardroom features dual 4K Sony displays, Neat Bar Pro AI video conferencing, beamforming acoustic ceiling mics, and integrated motorized privacy drapery.',
    capacity: '14 – 16 Persons',
    hourlyPrice: '$95 / hr',
    halfDayPrice: '$340 (4 hrs)',
    fullDayPrice: '$620 (8 hrs)',
    availability: 'available',
    availabilitySample: ['9:00 AM – 11:00 AM', '2:00 PM – 4:00 PM', '4:30 PM – 6:30 PM'],
    image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=1200&q=80'
    ],
    equipment: [
      'Dual 75" 4K Sony Pro Displays',
      'Neat Bar Pro AI Auto-Framing Camera',
      'Ceiling-Integrated Shure Beamforming Mics',
      'Interactive Digital Whiteboard',
      'Wireless Screen Casting (AirPlay, Miracast, HDMI)',
      'Direct Butler Call Button for Refreshments'
    ],
    cateringAvailable: true,
    idealFor: 'Board meetings, VC pitches, client presentations, and hybrid global summits.'
  },
  {
    id: 'courtyard-pod-alpha',
    name: 'The Cedar Collaboration Pod',
    type: 'creative-pod',
    typeLabel: 'Creative Pod',
    tagline: 'Intimate strategy huddles, sprint planning, and team retrospectives.',
    description: 'A cozy, light-filled creative sanctuary overlooking the botanical garden. Outfitted with an expansive magnetic glass whiteboard, acoustic felt walls, and 55" conferencing monitor.',
    capacity: '4 – 6 Persons',
    hourlyPrice: '$45 / hr',
    halfDayPrice: '$160 (4 hrs)',
    fullDayPrice: '$290 (8 hrs)',
    availability: 'available',
    availabilitySample: ['10:00 AM – 1:00 PM', '1:30 PM – 3:30 PM', '5:00 PM – 7:00 PM'],
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80'
    ],
    equipment: [
      '55" 4K Presentation Display',
      'Logitech Rally 4K Video Bar',
      'Full-Wall Magnetic Whiteboard',
      'Natural Daylight with Courtyard View',
      'Wireless One-Touch Conferencing'
    ],
    cateringAvailable: true,
    idealFor: 'Sprint planning, 1-on-1 performance reviews, client discovery workshops.'
  },
  {
    id: 'pavilion-presentation-hall',
    name: 'The Glass Pavilion Hall',
    type: 'conference-hall',
    typeLabel: 'Conference & Event Hall',
    tagline: 'Keynotes, product launches, panel discussions, and corporate all-hands.',
    description: 'An architectural centerpiece with 18-foot vaulted glass ceilings, modular theater seating, laser projection system, stage lighting, and integrated PA with wireless handheld and lapel mics.',
    capacity: '40 – 70 Persons',
    hourlyPrice: '$220 / hr',
    halfDayPrice: '$780 (4 hrs)',
    fullDayPrice: '$1,400 (8 hrs)',
    availability: 'limited',
    availabilitySample: ['Morning Slot (8:30 AM – 12:30 PM)', 'Evening Reception (5:30 PM – 9:30 PM)'],
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'
    ],
    equipment: [
      '4K Laser Projector & 180" Retractable Screen',
      'QSC Multi-Zone Sound System',
      '2x Shure Wireless Handheld + 2x Lapel Mics',
      'Dedicated AV Control Booth',
      'Configurable Stage & Modular Seating',
      'Private Pre-Function Welcome Foyer'
    ],
    cateringAvailable: true,
    idealFor: 'Demo days, industry panel talks, corporate town halls, and private workshops.'
  },
  {
    id: 'workshop-studio-olive',
    name: 'The Olive Workshop Studio',
    type: 'workshop-studio',
    typeLabel: 'Workshop Studio',
    tagline: 'Interactive design sprints, hackathons, and corporate training seminars.',
    description: 'Flexible mobile tables that seamlessly transition from classroom to breakout clusters. Features movable whiteboard partitions, sticky-note brainstorming supplies, and dual side monitors.',
    capacity: '16 – 24 Persons',
    hourlyPrice: '$120 / hr',
    halfDayPrice: '$420 (4 hrs)',
    fullDayPrice: '$760 (8 hrs)',
    availability: 'available',
    availabilitySample: ['9:00 AM – 1:00 PM', '1:30 PM – 5:30 PM'],
    image: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=1200&q=80'
    ],
    equipment: [
      'Dual 65" 4K Mobile Displays',
      '4x Double-Sided Rolling Whiteboards',
      'Full Workshop Toolkits (Post-its, Sharpies, Timer)',
      'Flexible Modular Flip-Top Tables',
      'High-Density Power Strips at Every Station'
    ],
    cateringAvailable: true,
    idealFor: 'Design thinking sessions, hackathons, corporate training, and agile retrospectives.'
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'day-pass',
    name: 'Day Pass & Flex 5',
    targetAudience: 'For occasional visitors, remote travelers, and nomadic professionals.',
    priceMonthly: '$35',
    billingText: 'per day pass / or $150 for 5-Day Pack',
    description: 'Immediate drop-in access to our sunlit commons, high-speed fiber, and premium coffee bar whenever you need focused momentum.',
    includedFeatures: [
      'Access to Ground & Garden Commons (8am – 7pm)',
      'Ultra-Fast 1Gbps WiFi 6',
      'Unlimited Specialty Coffee & Herbal Teas',
      'Access to Quiet Phone Booths',
      'On-Site Concierge Reception Support'
    ],
    accessHours: 'Mon – Fri, 8:00 AM – 7:00 PM',
    creditsIncluded: 'Meeting rooms available at standard rate',
    ctaText: 'Get Day Pass'
  },
  {
    id: 'hot-desk-plan',
    name: 'Courtyard Hot Desk',
    targetAudience: 'For freelancers, consultants, and flexible hybrid workers.',
    priceMonthly: '$260',
    priceQuarterly: '$235',
    priceYearly: '$210',
    billingText: 'billed monthly · cancel anytime',
    description: 'Full unmetered access to our open architectural spaces, quiet library, and community events with flexible monthly terms.',
    includedFeatures: [
      'Unlimited access across all flex zones',
      '24/7 Keycard building access',
      '4 hours of meeting room credits / month',
      'High-speed cloud printing allocation (100 pgs)',
      'Full access to wellness events & workshops',
      'Member portal & community directory'
    ],
    accessHours: '24/7 Unrestricted Access',
    creditsIncluded: '4 Meeting Room Hours / Month',
    ctaText: 'Join Hot Desk'
  },
  {
    id: 'dedicated-desk-plan',
    name: 'Atelier Dedicated Desk',
    badge: 'Most Popular',
    isPopular: true,
    targetAudience: 'For solo founders, developers, and professionals who need a fixed base.',
    priceMonthly: '$420',
    priceQuarterly: '$380',
    priceYearly: '$345',
    billingText: 'billed monthly · minimum 1 month',
    description: 'Your own designated ergonomic standing desk, lockable cabinet, and registered business address in an inspiring sanctuary.',
    includedFeatures: [
      'Dedicated motorized standing desk + ergonomic chair',
      'Permanent lockable credenza storage',
      'Official business address & mail reception service',
      '8 hours of meeting room credits / month',
      'Dual monitor mounting arm included',
      'Priority access to podcast & phone booths',
      '24/7 Secure building access & CCTV'
    ],
    accessHours: '24/7 Dedicated Access',
    creditsIncluded: '8 Meeting Room Hours / Month',
    ctaText: 'Reserve Your Desk'
  },
  {
    id: 'private-office-plan',
    name: 'Executive Private Suite',
    badge: 'Enterprise Grade',
    targetAudience: 'For growing startups, agencies, and enterprise satellite teams (2–25 people).',
    priceMonthly: '$1,850',
    priceQuarterly: '$1,700',
    priceYearly: '$1,550',
    billingText: 'starting price · custom configurations',
    description: 'Fully enclosed, sound-isolated private offices with bespoke furniture, dedicated enterprise VLAN, and concierge service.',
    includedFeatures: [
      'Private lockable office with acoustic glazing',
      'Bespoke solid oak furniture layout',
      'Private 1Gbps fiber subnet & dedicated IP available',
      '20 hours of executive meeting room credits / mo',
      'Custom company logo plaque at office entrance',
      'Daily housekeeping & executive trash removal',
      'Guest reception & conference concierge support'
    ],
    accessHours: '24/7 Exclusive Private Access',
    creditsIncluded: '20+ Meeting Room Hours / Month',
    ctaText: 'Inquire for Team'
  }
];

export const AMENITIES: Amenity[] = [
  {
    id: 'fiber-internet',
    title: 'Dual 1Gbps Fiber & WiFi 6',
    description: 'Redundant enterprise lines with guaranteed 99.9% uptime, low-latency performance, and private VLAN capabilities.',
    iconName: 'Wifi',
    highlight: 'Enterprise Grade'
  },
  {
    id: 'espresso-bar',
    title: 'Artisanal Botanical Café',
    description: 'Complimentary barista-grade specialty coffees, single-origin espressos, organic teas, and fruit-infused waters.',
    iconName: 'Coffee',
    highlight: 'Complimentary'
  },
  {
    id: 'soundproof-booths',
    title: 'Acoustic Phone & Zoom Booths',
    description: 'Custom-built Framery soundproof micro-studios with ventilation and ambient lighting for crystal-clear calls.',
    iconName: 'Phone',
    highlight: '8 Private Booths'
  },
  {
    id: 'concierge-mail',
    title: 'Hospitality & Mail Concierge',
    description: 'Front-desk receptionists to greet your clients, manage courier deliveries, and provide personalized member support.',
    iconName: 'Shield',
    highlight: 'White Glove Service'
  },
  {
    id: 'wellness-courtyard',
    title: 'Botanical Courtyard & Terrace',
    description: 'A serene open-air central garden with mature olive trees, outdoor power hubs, and shaded collaboration tables.',
    iconName: 'Sparkles',
    highlight: 'Signature Space'
  },
  {
    id: 'meeting-suites',
    title: 'Smart 4K Meeting Rooms',
    description: 'Equipped with Sony 4K displays, Neat AI auto-framing cameras, beamforming microphones, and digital whiteboards.',
    iconName: 'Monitor',
    highlight: 'Instant Booking'
  },
  {
    id: 'wellness-shower',
    title: 'Wellness & End-of-Trip Facilities',
    description: 'Secure bicycle storage, luxury rain showers with Aesop toiletries, and wellness meditation lounge.',
    iconName: 'LayoutGrid',
    highlight: 'End-of-Trip'
  },
  {
    id: 'community-network',
    title: 'Curated Member Network',
    description: 'Weekly founder lunches, investor office hours, fireside chats, and masterclasses designed to spark genuine partnerships.',
    iconName: 'Users',
    highlight: '300+ Members'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    quote: "Moving our 8-person team into EnCourtyard completely changed our energy. The architectural balance of quiet focus zones and the sunlit olive courtyard creates an environment our team genuinely loves coming to every single day.",
    author: 'Elena Rostova',
    role: 'Co-Founder & CEO',
    company: 'Vanguard BioTech',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    workspaceUsed: 'Executive Private Suite'
  },
  {
    id: '2',
    quote: "As a boutique architectural consultancy, our clients care deeply about design and atmosphere. Hosting our partner reviews in the Oak Boardroom has consistently impressed clients from Berlin, London, and New York.",
    author: 'Marcus Lindqvist',
    role: 'Principal Architect',
    company: 'Studio Lindqvist & Co',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    workspaceUsed: 'Atelier Dedicated Desk & Boardroom'
  },
  {
    id: '3',
    quote: "The dual fiber reliability and acoustic phone booths are hands down the best in the city. There's zero fluff — just ultra-refined hospitality, great coffee, and brilliant people building serious companies.",
    author: 'Devin Thorne',
    role: 'Head of Product',
    company: 'Kinetix Systems',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    workspaceUsed: 'Team Suite Member'
  }
];

export const INDIAN_CITIES: CityPresence[] = [
  {
    id: 'bangalore',
    name: 'Bangalore',
    centresCount: 12,
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80',
    tagline: 'Silicon Valley of India'
  },
  {
    id: 'delhi',
    name: 'Delhi',
    centresCount: 10,
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80',
    tagline: 'Capital & Central Hub'
  },
  {
    id: 'gurgaon',
    name: 'Gurgaon',
    centresCount: 14,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    tagline: 'Cyber City & DLF'
  },
  {
    id: 'chennai',
    name: 'Chennai',
    centresCount: 9,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
    tagline: 'OMR Tech Corridor'
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    centresCount: 9,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80',
    tagline: 'HITEC City'
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    centresCount: 15,
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80',
    tagline: 'BKC & Nariman Point'
  },
  {
    id: 'noida',
    name: 'Noida',
    centresCount: 7,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    tagline: 'Sector 62 & Expressway'
  },
  {
    id: 'pune',
    name: 'Pune',
    centresCount: 3,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
    tagline: 'Hinjawadi IT Sanctuary'
  }
];

export const WORKSPACE_CATEGORIES_DATA = [
  {
    id: 'private-offices',
    title: 'Private Offices',
    subtitle: 'A focused space to do your best work',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    bgFeatureImage: '/images/hero1.png',
    link: '/workspaces'
  },
  {
    id: 'dedicated-desks',
    title: 'Dedicated Desks',
    subtitle: 'Your personal space in a shared environment',
    image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=600&q=80',
    bgFeatureImage: '/images/hero2.png',
    link: '/workspaces'
  },
  {
    id: 'hot-desks',
    title: 'Hot Desks',
    subtitle: 'Flexible, affordable and on-demand',
    image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=600&q=80',
    bgFeatureImage: '/images/hero3.png',
    link: '/pricing'
  },
  {
    id: 'meeting-rooms',
    title: 'Meeting Rooms',
    subtitle: 'Collaborate, present and create new ideas',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80',
    bgFeatureImage: '/images/categorey.png',
    link: '/meeting-rooms'
  },
  {
    id: 'team-spaces',
    title: 'Team Spaces',
    subtitle: 'Customised for growing teams',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
    bgFeatureImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=85',
    link: '/workspaces'
  },
  {
    id: 'virtual-offices',
    title: 'Virtual Offices',
    subtitle: 'Prime business address & mail handling',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    bgFeatureImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
    link: '/pricing'
  },
  {
    id: 'podcast-studios',
    title: 'Podcast Studios',
    subtitle: 'Acoustic studio with 4K broadcast gear',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80',
    bgFeatureImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=85',
    link: '/meeting-rooms'
  },
  {
    id: 'event-spaces',
    title: 'Event & Townhalls',
    subtitle: '150-person amphitheatre & workshops',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
    bgFeatureImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=85',
    link: '/about'
  },
  {
    id: 'executive-boardrooms',
    title: 'Executive Suites',
    subtitle: 'Ultra-luxury suites with dual 85" screens',
    image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=600&q=80',
    bgFeatureImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85',
    link: '/workspaces'
  }
];

export const CIRCULAR_AMENITIES_DATA = [
  {
    id: 'wifi',
    title: 'High-Speed WiFi',
    subtitle: 'Stay connected always',
    iconName: 'Wifi',
    image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=85',
    description: 'Blazing-fast enterprise grade WiFi 6 network with redundant backup connections.'
  },
  {
    id: 'coffee',
    title: 'Free Coffee & Tea',
    subtitle: 'Fuel your creativity',
    iconName: 'Coffee',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=85',
    description: 'Unlimited artisanal espresso, roasted single-origin coffees, and herbal tea selection.'
  },
  {
    id: 'meetings',
    title: 'Modern Meeting Rooms',
    subtitle: 'Book on demand',
    iconName: 'Monitor',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85',
    description: 'Acoustically treated conference suites equipped with 4K displays and video conferencing.'
  },
  {
    id: 'parking',
    title: 'Parking Facility',
    subtitle: 'Hassle-free parking',
    iconName: 'Car',
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=85',
    description: 'Reserved multi-level vehicle and two-wheeler parking with EV charging stations.'
  },
  {
    id: 'security',
    title: '24/7 Security',
    subtitle: 'Work with peace of mind',
    iconName: 'ShieldCheck',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85',
    description: 'CCTV surveillance, biometric access control, and round-the-clock trained security staff.'
  },
  {
    id: 'relaxation',
    title: 'Relaxation Zones',
    subtitle: 'Recharge & unwind',
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85',
    description: 'Calm botanical lounges, acoustic nap pods, and green terrace areas to decompress.'
  },
  {
    id: 'events',
    title: 'Events & Networking',
    subtitle: 'Learn, connect, grow',
    iconName: 'Users',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=85',
    description: 'Curated weekly founder mixers, investor pitch nights, and industry workshops.'
  },
  {
    id: 'support',
    title: 'On-site Support',
    subtitle: 'Here to help',
    iconName: 'Headphones',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85',
    description: 'Dedicated community managers and technical support team on-site 6 days a week.'
  }
];

export const INR_PRICING_DATA = [
  {
    id: 'hot-desk-inr',
    name: 'Hot Desk',
    priceMonthly: '₹4,999',
    priceYearly: '₹3,999',
    period: '/month',
    features: [
      'Flexible seating',
      'High-speed WiFi',
      'Access to common areas'
    ],
    isPopular: false,
    ctaText: 'Get Started',
    link: '/book?plan=hot-desk'
  },
  {
    id: 'dedicated-desk-inr',
    name: 'Dedicated Desk',
    priceMonthly: '₹7,999',
    priceYearly: '₹6,399',
    period: '/month',
    features: [
      'Fixed personal desk',
      'Secure storage',
      'Access to amenities'
    ],
    isPopular: false,
    ctaText: 'Get Started',
    link: '/book?plan=dedicated-desk'
  },
  {
    id: 'private-office-inr',
    name: 'Private Office',
    badge: 'Most Popular',
    priceMonthly: '₹14,999',
    priceYearly: '₹11,999',
    period: '/month',
    features: [
      'Fully furnished office',
      'Team collaboration',
      'Scalable for growth'
    ],
    isPopular: true,
    ctaText: 'Get Started',
    link: '/book?plan=private-office'
  },
  {
    id: 'meeting-room-inr',
    name: 'Meeting Room',
    priceMonthly: '₹1,499',
    priceYearly: '₹1,499',
    period: '/hour',
    features: [
      'Modern meeting rooms',
      'Video conferencing',
      'Flexible booking'
    ],
    isPopular: false,
    ctaText: 'Book Now',
    link: '/meeting-rooms'
  }
];

export const INSIGHT_ARTICLES: InsightArticle[] = [
  {
    id: '1',
    title: '5 Ways Coworking Boosts Productivity',
    date: 'Aug 12, 2024',
    category: 'Productivity',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    summary: 'Discover how biophilic workspaces and collaborative environments supercharge focus and creative energy.'
  },
  {
    id: '2',
    title: 'How to Choose the Right Workspace',
    date: 'Aug 08, 2024',
    category: 'Guide',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    summary: 'A step-by-step checklist for founders and SMEs comparing private suites, dedicated desks, and hybrid memberships.'
  },
  {
    id: '3',
    title: 'The Future of Work in India',
    date: 'Aug 04, 2024',
    category: 'Industry',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    summary: 'How Tier 1 tech corridors in Bangalore, Gurgaon, and Hyderabad are reshaping enterprise office paradigms.'
  }
];

export const REFERENCE_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    quote: 'EnCourtyard has been the perfect space for our growing team. Great facilities and an amazing community!',
    author: 'Ritika Sharma',
    role: 'Founder',
    company: 'BlinkTech',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    workspaceUsed: 'Private Office Suite'
  },
  {
    id: '2',
    quote: 'A productive, inspiring and well-managed workspace. Highly recommended!',
    author: 'Arjun Mehta',
    role: 'CTO',
    company: 'GrowthLabs',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    workspaceUsed: 'Atelier Dedicated Desk'
  },
  {
    id: '3',
    quote: 'The meeting rooms and amenities are top-notch. It feels like a premium office experience.',
    author: 'Neha Kapoor',
    role: 'HR Manager',
    company: 'ScaleUp',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    workspaceUsed: 'Oak Boardroom'
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How flexible are EnCourtyard membership agreements?',
    answer: 'We believe flexibility is essential for modern business. Our Hot Desk and Dedicated Desk memberships operate on simple month-to-month terms with a 30-day notice. Private Suites are available on flexible 3, 6, or 12-month agreements with built-in upgrade paths as your team scales.',
    category: 'membership'
  },
  {
    id: 'faq-2',
    question: 'Can I schedule a personal tour of the space before committing?',
    answer: 'Absolutely. We encourage prospective members to book a complimentary 30-minute private tour. You will walk through the floorplans, experience the courtyard, test our ergonomic workstations, and enjoy a coffee prepared by our barista.',
    category: 'general'
  },
  {
    id: 'faq-3',
    question: 'Are meeting rooms included in membership plans?',
    answer: 'Yes. Dedicated Desks include 8 monthly meeting room credits, and Private Suites include 20 to 40 monthly credits. Additional hours can be reserved at preferential member discount rates directly through our concierge.',
    category: 'meeting-rooms'
  },
  {
    id: 'faq-4',
    question: 'What are the access hours for members and visitors?',
    answer: 'Dedicated Desk and Private Suite members enjoy 24/7 unmetered biometric keycard access 365 days a year. Hot Desk members have access Monday through Friday from 8:00 AM to 8:00 PM. Front desk concierge support is active weekdays 8:00 AM to 6:00 PM.',
    category: 'general'
  },
  {
    id: 'faq-5',
    question: 'Can I register EnCourtyard as my official business address?',
    answer: 'Yes! Dedicated Desk and Private Suite plans include official commercial business address registration, physical mail sorting, and secure package receipt with email notifications upon arrival.',
    category: 'billing'
  },
  {
    id: 'faq-6',
    question: 'Are there parking and bicycle storage options available?',
    answer: 'Yes. We provide secure indoor bicycle storage with air pumps, EV charging stations, and reserved underground car parking stalls available as an optional monthly add-on.',
    category: 'general'
  }
];
