export interface Workspace {
  id: string;
  name: string;
  category: 'private-office' | 'dedicated-desk' | 'hot-desk' | 'team-suite';
  categoryLabel: string;
  tagline: string;
  description: string;
  capacity: string;
  sqft: string;
  startingPrice: string;
  billingPeriod: string;
  availability: 'available' | 'limited' | 'waitlist';
  availabilityText: string;
  location: string;
  floor: string;
  image: string;
  galleryImages: string[];
  features: string[];
  amenities: string[];
  idealFor: string;
}

export interface MeetingRoom {
  id: string;
  name: string;
  type: 'boardroom' | 'creative-pod' | 'conference-hall' | 'workshop-studio';
  typeLabel: string;
  tagline: string;
  description: string;
  capacity: string;
  hourlyPrice: string;
  halfDayPrice: string;
  fullDayPrice: string;
  availability: 'available' | 'limited';
  availabilitySample: string[];
  image: string;
  galleryImages: string[];
  equipment: string[];
  cateringAvailable: boolean;
  idealFor: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  targetAudience: string;
  priceMonthly: string;
  priceQuarterly?: string;
  priceYearly?: string;
  billingText: string;
  description: string;
  includedFeatures: string[];
  accessHours: string;
  creditsIncluded: string;
  ctaText: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  workspaceUsed: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: 'general' | 'membership' | 'meeting-rooms' | 'billing';
}

export interface Amenity {
  id: string;
  title: string;
  description: string;
  iconName: string;
  highlight?: string;
}

export interface CityPresence {
  id: string;
  name: string;
  centresCount: number;
  image: string;
  tagline: string;
}

export interface InsightArticle {
  id: string;
  title: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  summary: string;
}
