import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { FeaturesTickerMarquee } from '@/components/home/FeaturesTickerMarquee';
import { PopularPicksSection } from '@/components/home/PopularPicksSection';
import { PresenceCitySection } from '@/components/home/PresenceCitySection';
import { WorkspaceCategoriesSection } from '@/components/home/WorkspaceCategoriesSection';

import { WhyEnCourtyard } from '@/components/home/WhyEnCourtyard';
import { AmenitiesSection } from '@/components/home/AmenitiesSection';
import { PricingPreview } from '@/components/home/PricingPreview';
import { CommunityGrowthSection } from '@/components/home/CommunityGrowthSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { FAQAndInsightsSection } from '@/components/home/FAQAndInsightsSection';
import { FinalCTA } from '@/components/home/FinalCTA';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const metadata: Metadata = {
  title: 'EnCourtyard | Handcrafted Workspaces & Botanical Sanctuaries',
  description:
    'EnCourtyard: Flexible spaces, meaningful connections, and premium coworking across 79 centres in 8 cities in India. Work. Connect. Grow.',
};

export default function HomePage() {
  return (
    <div className="flex flex-col w-full max-w-full overflow-x-hidden">
      {/* 1. Hero Section - Botanical Sanctuary & Typing Carousel */}
      <Hero />

      {/* 2. Features & Keywords Moving Marquee Ticker - Unique Marquee Curtain Reveal */}
      <ScrollReveal animation="marquee-curtain" duration={1100} threshold={0.04}>
        <FeaturesTickerMarquee />
      </ScrollReveal>

      {/* 3. Popular Picks Workspaces Slider Section - Unique Botanical Bloom 3D Depth Transition */}
      <ScrollReveal animation="botanical-bloom" duration={1300} threshold={0.05}>
        <PopularPicksSection />
      </ScrollReveal>

      {/* 4. City Presence Section - Unique Slide-In from Left with Subtle Angle */}
      {/* <ScrollReveal animation="slide-left" duration={1200} threshold={0.06}>
        <PresenceCitySection />
      </ScrollReveal> */}

      {/* 5. Workspace Categories Section - Unique 3D Depth Scale-Up */}
      <ScrollReveal animation="scale-up" duration={1250} threshold={0.06}>
        <WorkspaceCategoriesSection />
      </ScrollReveal>



      {/* 4. Why EnCourtyard - Unique Slide-In from Right with Dynamic Tilt */}
      <ScrollReveal animation="slide-right" duration={1200} threshold={0.06}>
        <WhyEnCourtyard />
      </ScrollReveal>

      {/* 5. World-Class Amenities - Unique 3D Perspective Flip/Tilt-Up */}
      <ScrollReveal animation="flip-up" duration={1300} threshold={0.06}>
        <AmenitiesSection />
      </ScrollReveal>

      {/* 6. Pricing & Membership Preview - Unique Soft Zoom-In & Focus */}
      <ScrollReveal animation="zoom-in" duration={1200} threshold={0.06}>
        <PricingPreview />
      </ScrollReveal>

      {/* 7. Community Growth & Strategic Stats - Unique Vertical Expansive Reveal */}
      <ScrollReveal animation="expand-y" duration={1250} threshold={0.06}>
        <CommunityGrowthSection />
      </ScrollReveal>

      {/* 8. Google Reviews & Testimonials Marquee - Atmospheric Luxury Blur-In */}
      <ScrollReveal animation="blur-in" duration={1350} threshold={0.06}>
        <TestimonialsSection />
      </ScrollReveal>

      {/* 9. FAQs & Insights Hub - Elegant Skewed Glide-Up */}
      <ScrollReveal animation="glide-up" duration={1200} threshold={0.06}>
        <FAQAndInsightsSection />
      </ScrollReveal>

      {/* 10. Final Botanical Sanctuary CTA - Pure Fixed Background Parallax Scrolling */}
      <FinalCTA />
    </div>
  );
}
