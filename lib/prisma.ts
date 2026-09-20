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

if (!globalStore._localWorkspaces) {
  globalStore._localWorkspaces = new Map<string, LocalWorkspace>();
  try {
    if (fs.existsSync(WORKSPACES_FILE)) {
      const data = JSON.parse(fs.readFileSync(WORKSPACES_FILE, 'utf-8'));
      if (Array.isArray(data)) {
        data.forEach((ws: LocalWorkspace) => {
          globalStore._localWorkspaces?.set(ws.id, ws);
          if (ws.slug) globalStore._localWorkspaces?.set(ws.slug, ws);
        });
      }
    }
  } catch (err) {
    console.warn('Could not read local_workspaces.json:', err);
  }
}

// Helper to save categories to disk
export const syncCategoriesToDisk = () => {
  try {
    const catMap = getLocalCategoriesMap();
    const list = Array.from(catMap.values());
    // Deduplicate by ID
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

export const localStore = {
  users: globalStore._localUsers,
  otps: globalStore._localOtps,
  bookings: globalStore._localBookings,
  get categories() {
    return getLocalCategoriesMap();
  },
  workspaces: globalStore._localWorkspaces,
};



