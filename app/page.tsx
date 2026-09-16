import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { PresenceCitySection } from '@/components/home/PresenceCitySection';
import { WorkspaceCategoriesSection } from '@/components/home/WorkspaceCategoriesSection';
import { WhyEnCourtyard } from '@/components/home/WhyEnCourtyard';
import { AmenitiesSection } from '@/components/home/AmenitiesSection';
import { PricingPreview } from '@/components/home/PricingPreview';
import { CommunityGrowthSection } from '@/components/home/CommunityGrowthSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { FAQAndInsightsSection } from '@/components/home/FAQAndInsightsSection';
import { FinalCTA } from '@/components/home/FinalCTA';

export const metadata: Metadata = {
  title: 'EnCourtyard | Handcrafted Workspaces & Botanical Sanctuaries',
  description:
    'EnCourtyard: Flexible spaces, meaningful connections, and premium coworking across 79 centres in 8 cities in India. Work. Connect. Grow.',
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <PresenceCitySection />
      <WorkspaceCategoriesSection />
      <WhyEnCourtyard />
      <AmenitiesSection />
      <PricingPreview />
      <CommunityGrowthSection />
      <TestimonialsSection />
      <FAQAndInsightsSection />
      <FinalCTA />
    </div>
  );
}
