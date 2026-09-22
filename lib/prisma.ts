import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Check if valid PostgreSQL URL is configured
const isLiveDbConfigured = Boolean(
  process.env.DATABASE_URL &&
  !process.env.DATABASE_URL.includes('your_supabase_db_password') &&
  !process.env.DATABASE_URL.includes('your_supabase_project_ref')
);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export { isLiveDbConfigured };

// In-Memory resilient fallback store for development & seamless immediate testing
export interface LocalUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  passwordHash: string;
  company?: string | null;
  role: 'USER' | 'ADMIN' | 'MANAGER';
  isEmailVerified: boolean;
  avatarUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocalOtp {
  id: string;
  email: string;
  otpCode: string;
  purpose: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
}

export interface LocalBooking {
  id: string;
  userId: string;
  locationId: string;
  locationName: string;
  spaceType: string;
  bookingDate: Date;
  startTime: string;
  endTime: string;
  guests: number;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';
  createdAt: Date;
  updatedAt: Date;
}

export interface LocalCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  capacity?: string | null;
  badge?: string | null;
  features?: string | string[]; // JSON string or array of 4 highlights
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocalWorkspace {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  shortDescription: string;
  longDescription?: string | null;
  specifications: string; // JSON
  mediaUrls: string; // JSON
  price?: string | null;
  capacity?: string | null;
  location?: string | null;
  badge?: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

import fs from 'fs';
import path from 'path';

// Load stored categories from file if exists
const CATEGORIES_FILE = path.join(process.cwd(), 'data', 'local_categories.json');
const WORKSPACES_FILE = path.join(process.cwd(), 'data', 'local_workspaces.json');

export const DEFAULT_SEED_CATEGORIES: LocalCategory[] = [
  {
    id: 'private-offices',
    name: 'Private Offices',
    slug: 'private-offices',
    description: 'A focused space to do your best work',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    capacity: '1 - 20 Pax',
    badge: 'Popular',
    features: JSON.stringify([
      '24/7 Biometric keyless access',
      'Acoustic soundproofing walls',
      'Dedicated 1Gbps fiber VLAN',
      'Daily executive concierge service'
    ]),
    order: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'dedicated-desks',
    name: 'Dedicated Desks',
    slug: 'dedicated-desks',
    description: 'Your personal space in a shared environment',
    imageUrl: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=600&q=80',
    capacity: 'Single / Cluster',
    badge: 'Dedicated',
    features: JSON.stringify([
      'High-speed WiFi 6 & LAN drops',
      'Ergonomic seating & motorized standing desk',
      'Access to common botanical lounges & phone booths',
      'Weekly networking masterclasses & community mixer'
    ]),
    order: 2,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'hot-desks',
    name: 'Hot Desks',
    slug: 'hot-desks',
    description: 'Flexible, affordable and on-demand',
    imageUrl: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=600&q=80',
    capacity: 'Flexible Day Pass',
    badge: 'Flex Pass',
    features: JSON.stringify([
      'Unrestricted flex zone seating across all floors',
      'Unlimited artisanal espresso & gourmet tea bar',
      'Access to soundproof phone booths for calls',
      'Exclusive access to community networking events'
    ]),
    order: 3,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'meeting-rooms',
    name: 'Meeting Rooms',
    slug: 'meeting-rooms',
    description: 'Collaborate, present and create new ideas',
    imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80',
    capacity: '4 - 70 Pax',
    badge: '4K AI Ready',
    features: JSON.stringify([
      'Dual Sony 4K Pro HDR Displays',
      'Neat Bar Pro AI video conferencing auto-tracking',
      'Ceiling-integrated beamforming acoustic mics',
      'Direct butler concierge service for tea & catering'
    ]),
    order: 4,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'team-spaces',
    name: 'Team Spaces',
    slug: 'team-spaces',
    description: 'Customized for growing teams',
    imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
    capacity: '8 - 30+ Pax',
    badge: 'Enterprise',
    features: JSON.stringify([
      'Private internal 6-person meeting pod inside your suite',
      'Dedicated server rack / private subnet VLAN',
      'Custom corporate wall branding & signboards',
      'Dedicated enterprise account & concierge manager'
    ]),
    order: 5,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'virtual-offices',
    name: 'Virtual Offices',
    slug: 'virtual-offices',
    description: 'Prime business address & mail handling',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    capacity: 'GST & MCA Verified',
    badge: 'Commercial',
    features: JSON.stringify([
      'Prestigious prime commercial address for GST & MCA',
      'Daily mail handling & digital package scanning notifications',
      'Discounted meeting room member rates across all centers',
      'Dedicated local telephone answering with IVR greeting'
    ]),
    order: 6,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'podcast-studios',
    name: 'Podcast Studios',
    slug: 'podcast-studios',
    description: 'Acoustic studio with 4K broadcast gear',
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80',
    capacity: '1 - 4 Pax Studio',
    badge: 'STC 65 Pro',
    features: JSON.stringify([
      'Acoustic double-wall sound isolation booth (STC 65)',
      '4x Shure SM7B broadcast dynamic microphones with Cloudlifters',
      'Dual Blackmagic Cinema 4K studio cameras & softbox lights',
      'Rødecaster Pro II audio mixing console with instant multi-track'
    ]),
    order: 7,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

// Global in-memory storage fallback
const globalStore = globalThis as unknown as {
  _localUsers?: Map<string, LocalUser>;
  _localOtps?: Map<string, LocalOtp>;
  _localBookings?: Map<string, LocalBooking>;
  _localCategories?: Map<string, LocalCategory>;
  _localWorkspaces?: Map<string, LocalWorkspace>;
};

if (!globalStore._localUsers) {
  globalStore._localUsers = new Map<string, LocalUser>();
}
if (!globalStore._localOtps) {
  globalStore._localOtps = new Map<string, LocalOtp>();
}
if (!globalStore._localBookings) {
  globalStore._localBookings = new Map<string, LocalBooking>();
}

export const getLocalCategoriesMap = (): Map<string, LocalCategory> => {
  if (!globalStore._localCategories || globalStore._localCategories.size === 0) {
    globalStore._localCategories = new Map<string, LocalCategory>();
    let loaded = false;
    try {
      if (fs.existsSync(CATEGORIES_FILE)) {
        const fileContent = fs.readFileSync(CATEGORIES_FILE, 'utf-8');
        const data = JSON.parse(fileContent);
        if (Array.isArray(data) && data.length > 0) {
          data.forEach((cat: LocalCategory) => {
            globalStore._localCategories?.set(cat.id, cat);
            if (cat.slug) globalStore._localCategories?.set(cat.slug, cat);
          });
          loaded = true;
        }
      }
    } catch (err) {
      console.warn('Could not read local_categories.json:', err);
    }

    // Seed defaults if still empty
    if (!loaded || globalStore._localCategories.size === 0) {
      DEFAULT_SEED_CATEGORIES.forEach((cat) => {
        globalStore._localCategories?.set(cat.id, cat);
        if (cat.slug) globalStore._localCategories?.set(cat.slug, cat);
      });
      syncCategoriesToDisk();
    }
  }
  return globalStore._localCategories;
};

// Initialize categories map
getLocalCategoriesMap();

export const DEFAULT_SEED_WORKSPACES: LocalWorkspace[] = [
  {
    id: 'ws-executive-suite-1',
    title: 'Executive Botanical Suite',
    slug: 'executive-botanical-suite',
    categoryId: 'private-offices',
    categoryName: 'Private Offices',
    shortDescription: 'Soundproof private suite with courtyard views, custom walnut furnishings, and 24/7 biometric access.',
    longDescription: 'Engineered for executive leadership and expanding boutique teams. This acoustically isolated private suite features floor-to-ceiling panoramic windows overlooking the central botanical sanctuary. Outfitted with motorized ergonomic desks, Herman Miller Cosm chairs, private high-speed VLAN, and dedicated meeting room credits.',
    specifications: JSON.stringify([
      { key: 'Seating', value: '4 – 8 Pax' },
      { key: 'Area', value: '380 sq.ft' },
      { key: 'Internet', value: '1 Gbps Dedicated Fiber' },
      { key: 'Access', value: '24/7 Biometric Keycard' },
      { key: 'Credits', value: '20 hrs/mo Meeting Rooms' },
      { key: 'Floor', value: 'Level 2, East Wing' }
    ]),
    mediaUrls: JSON.stringify([
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Executive Suite Overview' },
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Private Desk Setup' },
      { url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Lounge Corner' },
      { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Courtyard View' }
    ]),
    price: '₹42,000 / month',
    capacity: '4 – 8 Pax',
    location: 'Maruthi Plaza, Khairtabad (Level 2)',
    badge: 'Popular',
    order: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ws-atelier-dedicated-1',
    title: 'Atelier Fixed Dedicated Desk',
    slug: 'atelier-fixed-dedicated-desk',
    categoryId: 'dedicated-desks',
    categoryName: 'Dedicated Desks',
    shortDescription: 'Your permanent workstation with lockable credenza, dual monitor arms, and ergonomic task chair.',
    longDescription: 'A reserved permanent desk in a calm, design-oriented environment. Ideal for creators, senior engineers, and consultants who need a fixed workstation with 24/7 keycard access, mail handling, and private storage pedestal.',
    specifications: JSON.stringify([
      { key: 'Seating', value: '1 Person Dedicated' },
      { key: 'Desk', value: 'Motorized Height-Adjustable' },
      { key: 'Perks', value: 'Dual Monitor Mount & Storage' },
      { key: 'Internet', value: 'WiFi 6 & Wired LAN' },
      { key: 'Credits', value: '8 hrs/mo Meeting Rooms' },
      { key: 'Access', value: '24/7 Unlimited' }
    ]),
    mediaUrls: JSON.stringify([
      { url: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Dedicated Desk Station' },
      { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Workspace Ambiance' },
      { url: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Common Area View' }
    ]),
    price: '₹12,500 / month',
    capacity: '1 Pax',
    location: 'Maruthi Plaza, Khairtabad (Level 1)',
    badge: 'Best Value',
    order: 2,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ws-courtyard-hotdesk-1',
    title: 'Courtyard Flex Hot Desk',
    slug: 'courtyard-flex-hot-desk',
    categoryId: 'hot-desks',
    categoryName: 'Hot Desks',
    shortDescription: 'Flexible open seating across sun-drenched atrium lounges and tranquil library study commons.',
    longDescription: 'Work anywhere inspiration calls. Enjoy dynamic shared seating in our sunlit botanical courtyard, high-top cafe benching, and quiet library zones. Includes unlimited gourmet espresso bar, soundproof phone booths, and access to all community networking events.',
    specifications: JSON.stringify([
      { key: 'Seating', value: 'Flexible Open Desk' },
      { key: 'Beverages', value: 'Unlimited Espresso & Tea' },
      { key: 'Booths', value: 'Free Soundproof Phone Pods' },
      { key: 'Internet', value: 'Ultra-Fast 500 Mbps WiFi 6' },
      { key: 'Hours', value: 'Mon – Sat, 8:00 AM – 8:00 PM' }
    ]),
    mediaUrls: JSON.stringify([
      { url: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Courtyard Flex Lounge' },
      { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Collaboration Commons' },
      { url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Café Seating' }
    ]),
    price: '₹750 / day (₹7,500/mo)',
    capacity: '1 Pax (Flex)',
    location: 'Central Atrium, Ground Floor',
    badge: 'Flexible',
    order: 3,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ws-boardroom-glass-1',
    title: 'The Glass Pavilion Boardroom',
    slug: 'the-glass-pavilion-boardroom',
    categoryId: 'meeting-rooms',
    categoryName: 'Meeting Rooms',
    shortDescription: 'High-spec meeting facility with 85-inch 4K screen, beamforming audio, and barista service.',
    longDescription: 'Designed for high-stakes investor pitches, board reviews, and strategic workshops. Encased in double-glazed acoustic acoustic glass, this premier boardroom includes Sony 4K displays, Shure ceiling microphone arrays, and integrated HDMI/wireless casting.',
    specifications: JSON.stringify([
      { key: 'Capacity', value: '12 – 16 Persons' },
      { key: 'AV System', value: 'Sony 85" 4K HDR Display' },
      { key: 'Microphones', value: 'Shure Beamforming Array' },
      { key: 'Catering', value: 'Complimentary Barista Service' },
      { key: 'Conferencing', value: 'Zoom & Teams 1-Touch Join' }
    ]),
    mediaUrls: JSON.stringify([
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Boardroom Main View' },
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Display & Seating' },
      { url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Acoustic Glass Walls' }
    ]),
    price: '₹1,500 / hour',
    capacity: '12 – 16 Pax',
    location: 'Executive Wing, Level 2',
    badge: 'STC 55 Soundproof',
    order: 4,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ws-enterprise-wing-1',
    title: 'Custom Enterprise Suite Wing',
    slug: 'custom-enterprise-suite-wing',
    categoryId: 'enterprise-suites',
    categoryName: 'Enterprise Suites',
    shortDescription: 'Turnkey private office wing with dedicated breakout zone, executive manager cabin, and branded entry.',
    longDescription: 'An exclusive entire office wing configured for scaling startups, branch offices, and regional enterprise teams. Fully customizable layout with dedicated meeting pods, private manager cabins, server rack space, and biometric security.',
    specifications: JSON.stringify([
      { key: 'Team Size', value: '20 – 45 Pax' },
      { key: 'Area', value: '1,800 sq.ft' },
      { key: 'IT Infra', value: 'Dedicated Server Rack & Dual ISP' },
      { key: 'Rooms', value: '2 Executive Cabins + 1 Meeting Room' },
      { key: 'Branding', value: 'Custom Corporate Signage Allowed' }
    ]),
    mediaUrls: JSON.stringify([
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Enterprise Office Wing' },
      { url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Private Manager Cabin' },
      { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Team Breakout Zone' }
    ]),
    price: '₹1,85,000 / month',
    capacity: '20 – 45 Pax',
    location: 'Maruthi Plaza, Level 3 (Private Floor)',
    badge: 'Enterprise HQ',
    order: 5,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ws-virtual-prime-1',
    title: 'Prestigious Virtual Office Plan',
    slug: 'prestigious-virtual-office-plan',
    categoryId: 'virtual-offices',
    categoryName: 'Virtual Offices',
    shortDescription: 'Prime Khairtabad commercial address for GST & MCA registration, with mail handling & concierge support.',
    longDescription: 'Establish your brand presence in Hyderabad with our premium commercial address. Includes comprehensive documentation for GST and MCA registration, digital mail scanning, telephone call forwarding, and discounted monthly meeting room credits.',
    specifications: JSON.stringify([
      { key: 'Address', value: 'Maruthi Plaza, Khairtabad, Hyderabad' },
      { key: 'Compliance', value: 'GST & MCA Registration Approved' },
      { key: 'Mail Handling', value: 'Daily Physical & Digital Scan' },
      { key: 'Credits', value: '4 hrs/mo Meeting Room Access' }
    ]),
    mediaUrls: JSON.stringify([
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Prime Commercial Building' },
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Concierge Reception Desk' }
    ]),
    price: '₹2,499 / month',
    capacity: 'Business Address',
    location: 'Khairtabad Commercial Hub',
    badge: 'GST & MCA Verified',
    order: 6,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ws-podcast-studio-1',
    title: 'Acoustic 4K Broadcast Podcast Studio',
    slug: 'acoustic-4k-broadcast-podcast-studio',
    categoryId: 'podcast-studios',
    categoryName: 'Podcast Studios',
    shortDescription: 'Studio with 4x Shure SM7B microphones, Blackmagic 4K cameras, and sound isolation booth.',
    longDescription: 'Turnkey recording environment tailored for podcasters, interviewers, and webinar creators. Fitted with acoustic double-wall baffling (STC 65 rating), multi-track Rødecaster Pro II mixer, professional LED softbox lighting, and 4K cinema cameras.',
    specifications: JSON.stringify([
      { key: 'Capacity', value: '1 – 4 Speakers' },
      { key: 'Microphones', value: '4x Shure SM7B + Cloudlifters' },
      { key: 'Cameras', value: 'Dual Blackmagic Cinema 4K' },
      { key: 'Console', value: 'Rødecaster Pro II Audio Mixer' },
      { key: 'Isolation', value: 'STC 65 Sound Baffling' }
    ]),
    mediaUrls: JSON.stringify([
      { url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Studio Microphones & Lighting' },
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Audio Mixing Desk' }
    ]),
    price: '₹1,800 / hour',
    capacity: '1 – 4 Pax',
    location: 'Maruthi Plaza, Ground Floor Studio Pod',
    badge: '4K Broadcast',
    order: 7,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ws-creative-cabin-1',
    title: 'The Focus Pod & Creative Cabin',
    slug: 'the-focus-pod-creative-cabin',
    categoryId: 'private-offices',
    categoryName: 'Private Offices',
    shortDescription: 'Compact private cabin designed for solo founders, developers, and consultants seeking absolute privacy.',
    longDescription: 'A private sound-insulated mini cabin featuring daylight simulation lighting, motorized desk, white noise acoustic baffling, and dedicated fiber connectivity.',
    specifications: JSON.stringify([
      { key: 'Seating', value: '1 – 2 Persons' },
      { key: 'Area', value: '120 sq.ft' },
      { key: 'Access', value: '24/7 Biometric Entry' },
      { key: 'Desk', value: 'Motorized Standing Desk' }
    ]),
    mediaUrls: JSON.stringify([
      { url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Creative Cabin Interior' },
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Desk View' }
    ]),
    price: '₹18,000 / month',
    capacity: '1 – 2 Pax',
    location: 'Maruthi Plaza, Level 2',
    badge: 'Deep Work',
    order: 8,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

export const getLocalWorkspacesMap = (): Map<string, LocalWorkspace> => {
  if (!globalStore._localWorkspaces || globalStore._localWorkspaces.size === 0) {
    globalStore._localWorkspaces = new Map<string, LocalWorkspace>();
    let loaded = false;
    try {
      if (fs.existsSync(WORKSPACES_FILE)) {
        const fileContent = fs.readFileSync(WORKSPACES_FILE, 'utf-8');
        const data = JSON.parse(fileContent);
        if (Array.isArray(data) && data.length > 0) {
          data.forEach((ws: LocalWorkspace) => {
            globalStore._localWorkspaces?.set(ws.id, ws);
            if (ws.slug) globalStore._localWorkspaces?.set(ws.slug, ws);
          });
          loaded = true;
        }
      }
    } catch (err) {
      console.warn('Could not read local_workspaces.json:', err);
    }

    // Seed defaults if empty
    if (!loaded || globalStore._localWorkspaces.size === 0) {
      DEFAULT_SEED_WORKSPACES.forEach((ws) => {
        globalStore._localWorkspaces?.set(ws.id, ws);
        if (ws.slug) globalStore._localWorkspaces?.set(ws.slug, ws);
      });
      syncWorkspacesToDisk();
    }
  }
  return globalStore._localWorkspaces;
};

// Initialize workspaces map
getLocalWorkspacesMap();

// Helper to save categories to disk
export const syncCategoriesToDisk = () => {
  try {
    const catMap = getLocalCategoriesMap();
    const list = Array.from(catMap.values());
    const uniqueMap = new Map<string, LocalCategory>();
    list.forEach((c) => uniqueMap.set(c.id, c));
    const uniqueList = Array.from(uniqueMap.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
    const dir = path.dirname(CATEGORIES_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(uniqueList, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to sync categories to disk:', err);
  }
};

// Helper to save workspaces to disk
export const syncWorkspacesToDisk = () => {
  try {
    const wsMap = getLocalWorkspacesMap();
    const list = Array.from(wsMap.values());
    const uniqueMap = new Map<string, LocalWorkspace>();
    list.forEach((w) => uniqueMap.set(w.id, w));
    const uniqueList = Array.from(uniqueMap.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
    const dir = path.dirname(WORKSPACES_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(WORKSPACES_FILE, JSON.stringify(uniqueList, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to sync workspaces to disk:', err);
  }
};

export const localStore = {
  users: globalStore._localUsers,
  otps: globalStore._localOtps,
  bookings: globalStore._localBookings,
  get categories() {
    return getLocalCategoriesMap();
  },
  get workspaces() {
    return getLocalWorkspacesMap();
  },
};




