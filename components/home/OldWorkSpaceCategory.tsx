'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Building2,
    Laptop,
    Users,
    Briefcase,
    Layers,
    CheckCircle2,
    Mic,
    CalendarCheck,
    Sparkles
} from 'lucide-react';

interface SubCategoryItem {
    id: string;
    title: string;
    description: string;
    image: string;
    link: string;
    bookLink: string;
}

interface WorkspaceCategoryItem {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    bgFeatureImage: string;
    icon: React.ComponentType<{ className?: string }>;
    link: string;
    detailTitle: string;
    detailDescription: string;
    ctaText: string;
    handwrittenTag: string;
    features: string[];
    subItems: SubCategoryItem[];
}

const CATEGORIES_DATA: WorkspaceCategoryItem[] = [
    {
        id: 'private-offices',
        title: 'Private Offices',
        subtitle: 'A focused space to do your best work',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
        bgFeatureImage: '/images/hero1.png',
        icon: Building2,
        link: '/workspaces',
        detailTitle: 'Private Offices',
        detailDescription: 'Sound-insulated private suites designed for executive focus, privacy, and high-growth leadership teams.',
        ctaText: 'View All Private Offices',
        handwrittenTag: 'More Than An Office',
        features: [
            '24/7 Biometric keyless access',
            'Acoustic soundproofing walls',
            'Dedicated 1Gbps fiber VLAN',
            'Daily executive concierge service'
        ],
        subItems: [
            {
                id: 'single-executive',
                title: 'Single Executive Suite',
                description: 'Private acoustic haven for 1–2 leaders.',
                image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
                link: '/workspaces',
                bookLink: '/book?category=private-offices&item=single-executive'
            },
            {
                id: 'team-office-4-6',
                title: 'Team Office (4–6 Pax)',
                description: 'Furnished modular suite for growing startups.',
                image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
                link: '/workspaces',
                bookLink: '/book?category=private-offices&item=team-office-4-6'
            },
            {
                id: 'director-corner',
                title: 'Director Corner Suite',
                description: 'Sunlit executive suite with panoramic city vista.',
                image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80',
                link: '/workspaces',
                bookLink: '/book?category=private-offices&item=director-corner'
            },
            {
                id: 'enterprise-wing',
                title: 'Enterprise Wing',
                description: 'Custom branded corporate headquarters wing.',
                image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=600&q=80',
                link: '/workspaces',
                bookLink: '/book?category=private-offices&item=enterprise-wing'
            },
            {
                id: 'acoustic-studio-suite',
                title: 'Acoustic Soundproof Suite',
                description: 'Engineered for confidentiality and zero audio leakage.',
                image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
                link: '/workspaces',
                bookLink: '/book?category=private-offices&item=acoustic-studio-suite'
            },
            {
                id: 'boardroom-attached-suite',
                title: 'Boardroom Attached Suite',
                description: 'Executive private office with direct private meeting pod.',
                image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80',
                link: '/workspaces',
                bookLink: '/book?category=private-offices&item=boardroom-attached-suite'
            }
        ]
    },
    {
        id: 'dedicated-desks',
        title: 'Dedicated Desks',
        subtitle: 'Your personal space in a shared environment',
        image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=600&q=80',
        bgFeatureImage: '/images/hero2.png',
        icon: Layers,
        link: '/workspaces',
        detailTitle: 'Dedicated Desks',
        detailDescription: 'Your personal space in a shared environment to stay productive and connected with ergonomic furniture.',
        ctaText: 'View All Dedicated Desks',
        handwrittenTag: 'More Than A Desk',
        features: [
            'High-speed WiFi 6 & LAN drops',
            'Ergonomic seating & motorized standing desk',
            'Access to common botanical lounges & phone booths',
            'Weekly networking masterclasses & community mixer'
        ],
        subItems: [
            {
                id: 'standard-desk',
                title: 'Standard Dedicated Desk',
                description: 'Comfortable and functional for everyday productivity.',
                image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=600&q=80',
                link: '/workspaces',
                bookLink: '/book?category=dedicated-desks&item=standard-desk'
            },
            {
                id: 'premium-window-desk',
                title: 'Premium Window Desk',
                description: 'Natural sunlight, lush courtyard views, and Herman Miller chair.',
                image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
                link: '/workspaces',
                bookLink: '/book?category=dedicated-desks&item=premium-window-desk'
            },
            {
                id: 'executive-ergonomic-desk',
                title: 'Executive Ergonomic Desk',
                description: 'Motorized sit-stand desk with dual 4K display mount.',
                image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80',
                link: '/workspaces',
                bookLink: '/book?category=dedicated-desks&item=executive-ergonomic-desk'
            },
            {
                id: 'quad-team-cluster',
                title: 'Quad Team Cluster (4 Desks)',
                description: 'Dedicated 4-desk pod side-by-side for collaborative squads.',
                image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
                link: '/workspaces',
                bookLink: '/book?category=dedicated-desks&item=quad-team-cluster'
            },
            {
                id: 'quiet-library-desk',
                title: 'Quiet Zone Dedicated Desk',
                description: 'Silent study zone with acoustic privacy dividers.',
                image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=600&q=80',
                link: '/workspaces',
                bookLink: '/book?category=dedicated-desks&item=quiet-library-desk'
            },
            {
                id: 'unlimited-247-desk',
                title: '24/7 Unlimited Access Desk',
                description: 'Round-the-clock secure desk with lockable storage pedestal.',
                image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=600&q=80',
                link: '/workspaces',
                bookLink: '/book?category=dedicated-desks&item=unlimited-247-desk'
            }
        ]
    },
    {
        id: 'hot-desks',
        title: 'Hot Desks',
        subtitle: 'Flexible, affordable and on-demand',
        image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=600&q=80',
        bgFeatureImage: '/images/hero3.png',
        icon: Laptop,
        link: '/pricing',
        detailTitle: 'Hot Desks',
        detailDescription: 'Flexible seating anywhere in our botanical lounges, quiet library zones, and sunlit terrace.',
        ctaText: 'View All Hot Desks',
        handwrittenTag: 'More Than A Seat',
        features: [
            'Unrestricted flex zone seating across all floors',
            'Unlimited artisanal espresso & gourmet tea bar',
            'Access to soundproof phone booths for calls',
            'Exclusive access to community networking events'
        ],
        subItems: [
            {
                id: 'courtyard-flex',
                title: 'Courtyard Botanical Flex Desk',
                description: 'Dynamic seating in our sunlit indoor botanical garden.',
                image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=600&q=80',
                link: '/pricing',
                bookLink: '/book?category=hot-desks&item=courtyard-flex'
            },
            {
                id: 'library-quiet-pass',
                title: 'Library Quiet Pass',
                description: 'Silent focus zone with acoustic soundproofing.',
                image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=600&q=80',
                link: '/pricing',
                bookLink: '/book?category=hot-desks&item=library-quiet-pass'
            },
            {
                id: 'cafe-bench',
                title: 'Café Bench Seating',
                description: 'Vibrant social workspace near the artisanal coffee bar.',
                image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
                link: '/pricing',
                bookLink: '/book?category=hot-desks&item=cafe-bench'
            },
            {
                id: 'weekend-pass',
                title: 'Evening & Weekend Flex',
                description: 'Off-peak flexible access for side-hustlers and builders.',
                image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
                link: '/pricing',
                bookLink: '/book?category=hot-desks&item=weekend-pass'
            },
            {
                id: 'roaming-multi-pass',
                title: '10-Day Roaming Multi-Pass',
                description: 'Use across 30 days whenever you need workspace.',
                image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=600&q=80',
                link: '/pricing',
                bookLink: '/book?category=hot-desks&item=roaming-multi-pass'
            },
            {
                id: 'sunshine-terrace-spot',
                title: 'Sunshine Terrace Spot',
                description: 'Open-air balcony workstation with breezy outdoor views.',
                image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80',
                link: '/pricing',
                bookLink: '/book?category=hot-desks&item=sunshine-terrace-spot'
            }
        ]
    },
    {
        id: 'meeting-rooms',
        title: 'Meeting Rooms',
        subtitle: 'Collaborate, present and create new ideas',
        image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80',
        bgFeatureImage: '/images/categorey.png',
        icon: Users,
        link: '/meeting-rooms',
        detailTitle: 'Meeting Rooms',
        detailDescription: 'High-spec conference suites equipped with 4K displays, AI auto-framing cameras, and beamforming audio.',
        ctaText: 'View All Meeting Rooms',
        handwrittenTag: 'More Than A Room',
        features: [
            'Dual Sony 4K Pro HDR Displays',
            'Neat Bar Pro AI video conferencing auto-tracking',
            'Ceiling-integrated beamforming acoustic mics',
            'Direct butler concierge service for tea & catering'
        ],
        subItems: [
            {
                id: 'oak-boardroom',
                title: 'The Oak Boardroom (16 Pax)',
                description: 'Solid oak table with dual Sony 4K displays & AI audio.',
                image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=600&q=80',
                link: '/meeting-rooms',
                bookLink: '/book?category=meeting-rooms&item=oak-boardroom'
            },
            {
                id: 'cedar-pod',
                title: 'Cedar Creative Pod (6 Pax)',
                description: 'Intimate huddle room with magnetic glass whiteboard.',
                image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=600&q=80',
                link: '/meeting-rooms',
                bookLink: '/book?category=meeting-rooms&item=cedar-pod'
            },
            {
                id: 'workshop-studio',
                title: 'Olive Workshop Studio (24 Pax)',
                description: 'Modular flip-top tables for hackathons & sprint workshops.',
                image: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=600&q=80',
                link: '/meeting-rooms',
                bookLink: '/book?category=meeting-rooms&item=workshop-studio'
            },
            {
                id: 'glass-pavilion',
                title: 'Glass Pavilion (70 Pax)',
                description: '18-ft vaulted ceiling hall for townhalls & investor keynotes.',
                image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
                link: '/meeting-rooms',
                bookLink: '/book?category=meeting-rooms&item=glass-pavilion'
            },
            {
                id: 'hybrid-video-suite',
                title: 'Hybrid AI Video Suite (10 Pax)',
                description: 'Multi-camera Zoom/Teams certified studio room.',
                image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80',
                link: '/meeting-rooms',
                bookLink: '/book?category=meeting-rooms&item=hybrid-video-suite'
            },
            {
                id: 'glass-huddle-room',
                title: 'Brainstorming Glass Pod (4 Pax)',
                description: 'Acoustic glass cube for quick sprints & 1-on-1 interviews.',
                image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80',
                link: '/meeting-rooms',
                bookLink: '/book?category=meeting-rooms&item=glass-huddle-room'
            }
        ]
    },
    {
        id: 'team-spaces',
        title: 'Team Spaces',
        subtitle: 'Customized for growing teams',
        image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
        bgFeatureImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=85',
        icon: Briefcase,
        link: '/workspaces',
        detailTitle: 'Team Spaces',
        detailDescription: 'Self-contained private team suites tailored for scale, corporate privacy, and internal collaboration.',
        ctaText: 'View All Team Spaces',
        handwrittenTag: 'More Than A Space',
        features: [
            'Private internal 6-person meeting pod inside your suite',
            'Dedicated server rack / private subnet VLAN',
            'Custom corporate wall branding & signboards',
            'Dedicated enterprise account & concierge manager'
        ],
        subItems: [
            {
                id: 'startup-wing',
                title: 'Startup Squad Wing (8–12 Pax)',
                description: 'Dedicated internal pod with private huddle zone.',
                image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=600&q=80',
                link: '/workspaces',
                bookLink: '/book?category=team-spaces&item=startup-wing'
            },
            {
                id: 'growth-hub',
                title: 'Growth Hub Suite (15–25 Pax)',
                description: 'Custom corporate suite with private meeting room & pantry.',
                image: 'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?auto=format&fit=crop&w=600&q=80',
                link: '/workspaces',
                bookLink: '/book?category=team-spaces&item=growth-hub'
            },
            {
                id: 'media-lab',
                title: 'Design & Media Production Lab',
                description: 'Color-calibrated drafting stations & acoustic baffles.',
                image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80',
                link: '/workspaces',
                bookLink: '/book?category=team-spaces&item=media-lab'
            },
            {
                id: 'enterprise-floor',
                title: 'Custom Enterprise Floor',
                description: 'Full floor buildout with private reception & executive lounge.',
                image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=600&q=80',
                link: '/workspaces',
                bookLink: '/book?category=team-spaces&item=enterprise-floor'
            },
            {
                id: 'tech-incubator-bay',
                title: 'Tech Incubator Bay (10 Pax)',
                description: 'Optimized for high-compute developers with fiber ports.',
                image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
                link: '/workspaces',
                bookLink: '/book?category=team-spaces&item=tech-incubator-bay'
            },
            {
                id: 'agile-scrum-hq',
                title: 'Agile Scrum Headquarters (30+ Pax)',
                description: 'Open collaborative floor with modular desks and standup walls.',
                image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
                link: '/workspaces',
                bookLink: '/book?category=team-spaces&item=agile-scrum-hq'
            }
        ]
    },
    {
        id: 'virtual-offices',
        title: 'Virtual Offices',
        subtitle: 'Prime business address & mail handling',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
        bgFeatureImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
        icon: Building2,
        link: '/pricing',
        detailTitle: 'Virtual Offices',
        detailDescription: 'Establish a prestigious corporate presence with dedicated mail reception and boardroom access.',
        ctaText: 'View Virtual Office Plans',
        handwrittenTag: 'More Than An Address',
        features: [
            'Prestigious prime commercial address for GST & MCA',
            'Daily mail handling & digital package scanning notifications',
            'Discounted meeting room member rates across all centers',
            'Dedicated local telephone answering with IVR greeting'
        ],
        subItems: [
            {
                id: 'business-address',
                title: 'Official Business Address',
                description: 'GST and company registration verified commercial address.',
                image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
                link: '/pricing',
                bookLink: '/book?category=virtual-offices&item=business-address'
            },
            {
                id: 'mail-concierge',
                title: 'Mail & Courier Concierge',
                description: 'Real-time parcel notifications & secure physical vaulting.',
                image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80',
                link: '/pricing',
                bookLink: '/book?category=virtual-offices&item=mail-concierge'
            },
            {
                id: 'virtual-plus',
                title: 'Virtual Plus Lounge',
                description: 'Address + 4 days of coworking lounge access monthly.',
                image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=600&q=80',
                link: '/pricing',
                bookLink: '/book?category=virtual-offices&item=virtual-plus'
            },
            {
                id: 'executive-virtual',
                title: 'Executive Virtual Suite',
                description: 'Address + 8 monthly boardroom hours included.',
                image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80',
                link: '/pricing',
                bookLink: '/book?category=virtual-offices&item=executive-virtual'
            },
            {
                id: 'global-enterprise-presence',
                title: 'Multi-City Enterprise Presence',
                description: 'Prestigious addresses across Mumbai, Bangalore & Delhi.',
                image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
                link: '/pricing',
                bookLink: '/book?category=virtual-offices&item=global-enterprise-presence'
            },
            {
                id: 'dedicated-phone-line',
                title: 'Dedicated Corporate Phone Line',
                description: 'Custom IVR auto-attendant with call forwarding.',
                image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=600&q=80',
                link: '/pricing',
                bookLink: '/book?category=virtual-offices&item=dedicated-phone-line'
            }
        ]
    },
    {
        id: 'podcast-studios',
        title: 'Podcast Studios',
        subtitle: 'Acoustic studio with 4K broadcast gear',
        image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80',
        bgFeatureImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=85',
        icon: Mic,
        link: '/meeting-rooms',
        detailTitle: 'Podcast & Media Studios',
        detailDescription: 'Broadcast-grade acoustic studios equipped with Shure SM7B microphones and 4K multi-cam setups.',
        ctaText: 'Book Studio Hours',
        handwrittenTag: 'More Than A Mic',
        features: [
            'Acoustic double-wall sound isolation booth (STC 65)',
            '4x Shure SM7B broadcast dynamic microphones with Cloudlifters',
            'Dual Blackmagic Cinema 4K studio cameras & softbox lights',
            'Rødecaster Pro II audio mixing console with instant multi-track'
        ],
        subItems: [
            {
                id: 'solo-cast',
                title: 'Solo Voiceover Pod',
                description: 'Acoustic booth optimized for voiceovers & solo recording.',
                image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80',
                link: '/meeting-rooms',
                bookLink: '/book?category=podcast-studios&item=solo-cast'
            },
            {
                id: 'interview-studio',
                title: '2–4 Person Interview Set',
                description: 'Multi-mic setup with cinematic studio lighting and monitors.',
                image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80',
                link: '/meeting-rooms',
                bookLink: '/book?category=podcast-studios&item=interview-studio'
            },
            {
                id: 'vodcast-lounge',
                title: 'Video Podcast Lounge',
                description: 'Comfortable mid-century lounge set with 4K multi-cameras.',
                image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80',
                link: '/meeting-rooms',
                bookLink: '/book?category=podcast-studios&item=vodcast-lounge'
            },
            {
                id: 'live-stream-booth',
                title: 'Live Stream & Webinar Pod',
                description: 'Low-latency gigabit fiber with teleprompter & stream deck.',
                image: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=600&q=80',
                link: '/meeting-rooms',
                bookLink: '/book?category=podcast-studios&item=live-stream-booth'
            },
            {
                id: 'multicam-vodcast-studio',
                title: '4K Multi-Cam Vodcast Studio',
                description: '3-camera switcher setup for YouTube and Spotify show recordings.',
                image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
                link: '/meeting-rooms',
                bookLink: '/book?category=podcast-studios&item=multicam-vodcast-studio'
            },
            {
                id: 'audio-mastering-suite',
                title: 'Sound Engineering & Mixing Suite',
                description: 'High-end studio monitors with pro DAW editing software suite.',
                image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
                link: '/meeting-rooms',
                bookLink: '/book?category=podcast-studios&item=audio-mastering-suite'
            }
        ]
    }
];

export const OldWorkSpaceCategory: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const subItemsScrollRef = useRef<HTMLDivElement>(null);

    // Top Category Carousel State: Defaults to index 0 ('private-offices')
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('private-offices');
    const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);
    const [featuredIndex, setFeaturedIndex] = useState<number>(3); // 4th card position background tracker

    // Navigation Button State for Top Carousel
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Navigation Button State for Bottom Sub-Items Carousel (Desktop)
    const [canSubScrollLeft, setCanSubScrollLeft] = useState(false);
    const [canSubScrollRight, setCanSubScrollRight] = useState(true);

    // Autoplay Pause state (pauses on user hover / drag)
    const [isPaused, setIsPaused] = useState(false);

    // Mouse Drag / Swipe State for Top Carousel
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftState, setScrollLeftState] = useState(0);
    const [dragDistance, setDragDistance] = useState(0);

    // Mouse Drag / Swipe State for Bottom Sub-Items Carousel (Desktop)
    const [isSubMouseDown, setIsSubMouseDown] = useState(false);
    const [subStartX, setSubStartX] = useState(0);
    const [subScrollLeftState, setSubScrollLeftState] = useState(0);
    const [subDragDistance, setSubDragDistance] = useState(0);

    // Scroll check for top carousel
    const checkScroll = useCallback(() => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

            // Determine 4th card visible in viewport for backdrop image
            const cardWidth = 245;
            const currentFirstIndex = Math.round(scrollLeft / cardWidth);
            const target4thIndex = Math.min(
                CATEGORIES_DATA.length - 1,
                Math.max(0, currentFirstIndex + 3)
            );
            setFeaturedIndex(target4thIndex);
        }
    }, []);

    // Scroll check for bottom sub-items carousel (Desktop)
    const checkSubScroll = useCallback(() => {
        if (subItemsScrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = subItemsScrollRef.current;
            setCanSubScrollLeft(scrollLeft > 10);
            setCanSubScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener('scroll', checkScroll, { passive: true });
        checkScroll();
        return () => el.removeEventListener('scroll', checkScroll);
    }, [checkScroll]);

    useEffect(() => {
        const subEl = subItemsScrollRef.current;
        if (!subEl) return;
        subEl.addEventListener('scroll', checkSubScroll, { passive: true });
        checkSubScroll();
        return () => subEl.removeEventListener('scroll', checkSubScroll);
    }, [checkSubScroll, selectedCategoryId]);

    // Reset sub-items scroll position to start whenever category changes
    useEffect(() => {
        if (subItemsScrollRef.current) {
            subItemsScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
    }, [selectedCategoryId]);

    // =========================================================================
    // AUTOPLAY: Automatically advance category and sync the bottom menu details
    // =========================================================================
    useEffect(() => {
        if (isPaused) return;

        const timer = setInterval(() => {
            setSelectedCategoryId((prevId) => {
                const currentIndex = CATEGORIES_DATA.findIndex((c) => c.id === prevId);
                const nextIndex = (currentIndex + 1) % CATEGORIES_DATA.length;
                const nextCategory = CATEGORIES_DATA[nextIndex];

                // Smoothly scroll the top carousel to keep current card in comfortable view
                if (scrollRef.current) {
                    const cardWidth = 245;
                    scrollRef.current.scrollTo({
                        left: nextIndex * cardWidth,
                        behavior: 'smooth'
                    });
                }

                return nextCategory.id;
            });
        }, 5000);

        return () => clearInterval(timer);
    }, [isPaused]);

    // Manual Top Slide Left / Right
    const slideLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -260, behavior: 'smooth' });
            // Move category selection backward
            const currentIndex = CATEGORIES_DATA.findIndex((c) => c.id === selectedCategoryId);
            const prevIndex = Math.max(0, currentIndex - 1);
            setSelectedCategoryId(CATEGORIES_DATA[prevIndex].id);
        }
    };

    const slideRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 260, behavior: 'smooth' });
            // Move category selection forward
            const currentIndex = CATEGORIES_DATA.findIndex((c) => c.id === selectedCategoryId);
            const nextIndex = Math.min(CATEGORIES_DATA.length - 1, currentIndex + 1);
            setSelectedCategoryId(CATEGORIES_DATA[nextIndex].id);
        }
    };

    // Sub-items Slider Left / Right (Desktop)
    const slideSubLeft = () => {
        if (subItemsScrollRef.current) {
            subItemsScrollRef.current.scrollBy({ left: -240, behavior: 'smooth' });
        }
    };

    const slideSubRight = () => {
        if (subItemsScrollRef.current) {
            subItemsScrollRef.current.scrollBy({ left: 240, behavior: 'smooth' });
        }
    };

    // Mouse Drag Handlers for Top Carousel
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsMouseDown(true);
        setIsPaused(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeftState(scrollRef.current.scrollLeft);
        setDragDistance(0);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isMouseDown || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollRef.current.scrollLeft = scrollLeftState - walk;
        setDragDistance(Math.abs(walk));
    };

    const handleMouseUp = () => {
        setIsMouseDown(false);
    };

    const handleMouseLeave = () => {
        setIsMouseDown(false);
        setIsPaused(false);
    };

    // Mouse Drag Handlers for Bottom Sub-Items Carousel (Desktop)
    const handleSubMouseDown = (e: React.MouseEvent) => {
        if (!subItemsScrollRef.current) return;
        setIsSubMouseDown(true);
        setSubStartX(e.pageX - subItemsScrollRef.current.offsetLeft);
        setSubScrollLeftState(subItemsScrollRef.current.scrollLeft);
        setSubDragDistance(0);
    };

    const handleSubMouseMove = (e: React.MouseEvent) => {
        if (!isSubMouseDown || !subItemsScrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - subItemsScrollRef.current.offsetLeft;
        const walk = (x - subStartX) * 1.5;
        subItemsScrollRef.current.scrollLeft = subScrollLeftState - walk;
        setSubDragDistance(Math.abs(walk));
    };

    const handleSubMouseUp = () => {
        setIsSubMouseDown(false);
    };

    const handleSubMouseLeave = () => {
        setIsSubMouseDown(false);
    };

    const handleCardClick = (e: React.MouseEvent, categoryId: string) => {
        if (dragDistance > 10) {
            e.preventDefault();
            return;
        }
        setSelectedCategoryId(categoryId);
    };

    const currentFeaturedCard = CATEGORIES_DATA[featuredIndex] || CATEGORIES_DATA[3];
    const bgImageToShow = currentFeaturedCard.bgFeatureImage || '/images/categorey.png';

    const activeCategoryId = hoveredCategoryId || selectedCategoryId;
    const currentActiveCategory =
        CATEGORIES_DATA.find((c) => c.id === activeCategoryId) || CATEGORIES_DATA[0];
    const ActiveIcon = currentActiveCategory.icon;

    return (
        <section className="py-14 sm:py-20 lg:py-24 secondary-section-bg border-b border-[#E5E1D8] relative overflow-hidden select-none">

            {/* Background Watermark & Botanical Atmosphere */}
            <div className="hidden lg:block absolute top-10 right-16 select-none pointer-events-none opacity-40 z-0">
                <p className="font-handwriting text-5xl xl:text-6xl text-[#263626]/25 rotate-[-4deg] tracking-wide">
                    Work Connect Grow
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 lg:mb-12 gap-5 relative z-20">
                    <div className="max-w-xl text-left">
                        <span className="text-[11px] font-mono uppercase tracking-widest text-[#738273] font-bold block mb-1.5">
                            SPACES FOR EVERY AMBITION
                        </span>
                        <h2 className="font-serif text-2xl sm:text-4xl lg:text-[42px] font-bold text-[#181F18] tracking-tight">
                            Old Workspace Categories
                        </h2>
                        <p className="text-xs sm:text-base text-[#5C665C] mt-2 font-sans">
                            Whether you're a freelancer, startup or an enterprise, we have a space that fits your style, team size and business goals.
                        </p>
                    </div>

                    {/* Action Links & Top Carousel Controls */}
                    <div className="flex items-center gap-3 sm:gap-4 shrink-0 flex-wrap md:self-start md:pt-1">
                        <Link
                            href="/workspaces"
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#181F18] hover:text-[#263626] group transition-colors"
                        >
                            <span>Explore All Workspaces</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>

                        {/* Top Carousel Arrow Buttons for Swiping */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={slideLeft}
                                disabled={!canScrollLeft}
                                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#D5CEC2] flex items-center justify-center transition-all cursor-pointer shadow-xs ${canScrollLeft
                                    ? 'bg-white text-[#181F18] hover:bg-[#263626] hover:text-white hover:border-[#263626]'
                                    : 'bg-[#EAE5DC] text-[#A3B0A3] opacity-40 cursor-not-allowed'
                                    }`}
                                aria-label="Previous categories"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <button
                                onClick={slideRight}
                                disabled={!canScrollRight}
                                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#D5CEC2] flex items-center justify-center transition-all cursor-pointer shadow-xs ${canScrollRight
                                    ? 'bg-white text-[#181F18] hover:bg-[#263626] hover:text-white hover:border-[#263626]'
                                    : 'bg-[#EAE5DC] text-[#A3B0A3] opacity-40 cursor-not-allowed'
                                    }`}
                                aria-label="Next categories"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Feature Background Image (Good People Great Ideas - categorey.png)
            Spans across the 4th card position taking full height on Desktop */}
                <div className="hidden lg:block absolute top-12 bottom-3 left-[48%] right-[20.5%] rounded-t-[36px] rounded-b-2xl overflow-hidden shadow-2xl border border-[#D5CEC2] z-0 pointer-events-none transition-all duration-500">
                    <img
                        key={bgImageToShow}
                        src={bgImageToShow}
                        alt={currentFeaturedCard.title}
                        className="w-full h-full object-cover object-top transition-opacity duration-700 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
                </div>

                {/* ========================================================================= */}
                {/* TOP CATEGORY CARDS SLIDER (Auto + Manual Swappable, Mouse Drag & Click) */}
                {/* ========================================================================= */}
                <div
                    ref={scrollRef}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={handleMouseLeave}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    className={`flex gap-3.5 sm:gap-4 lg:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 sm:py-3 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 relative z-10 items-end mb-6 sm:mb-8 ${isMouseDown ? 'cursor-grabbing' : 'cursor-grab'
                        }`}
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {CATEGORIES_DATA.map((category, index) => {
                        const isFeatured = index === featuredIndex;
                        const isActive = category.id === selectedCategoryId;
                        const IconComp = category.icon;

                        if (isFeatured) {
                            return (
                                <div
                                    key={category.id}
                                    onMouseEnter={() => {
                                        setHoveredCategoryId(category.id);
                                        setIsPaused(true);
                                    }}
                                    onMouseLeave={() => setHoveredCategoryId(null)}
                                    onClick={(e) => handleCardClick(e, category.id)}
                                    className={`group rounded-2xl border overflow-hidden transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-end w-[200px] sm:w-[230px] lg:w-[230px] shrink-0 snap-start cursor-pointer select-none ${isActive
                                        ? 'bg-[#263626] text-white border-[#263626] shadow-2xl scale-[1.02] ring-2 ring-[#263626]/20'
                                        : 'bg-white text-[#181F18] border-[#E5E1D8] shadow-warm hover:shadow-2xl hover:border-[#263626]'
                                        }`}
                                >
                                    <div className="p-3.5 sm:p-5 flex items-center justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#4ADE80]' : 'text-[#263626]'}`} />
                                                <h3 className={`font-serif text-xs sm:text-base font-bold leading-tight ${isActive ? 'text-white' : 'text-[#181F18]'}`}>
                                                    {category.title}
                                                </h3>
                                            </div>
                                            <p className={`text-[11px] sm:text-xs leading-snug line-clamp-2 ${isActive ? 'text-[#D5E2D5]' : 'text-[#5C665C]'}`}>
                                                {category.subtitle}
                                            </p>
                                        </div>

                                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 ${isActive
                                            ? 'bg-white text-[#263626] shadow-sm'
                                            : 'bg-[#FAF9F5] border border-[#E5E1D8] group-hover:bg-[#263626] group-hover:text-white'
                                            }`}>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div
                                key={category.id}
                                onMouseEnter={() => {
                                    setHoveredCategoryId(category.id);
                                    setIsPaused(true);
                                }}
                                onMouseLeave={() => setHoveredCategoryId(null)}
                                onClick={(e) => handleCardClick(e, category.id)}
                                className={`group rounded-2xl border overflow-hidden transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between w-[205px] sm:w-[240px] lg:w-[240px] shrink-0 snap-start h-full cursor-pointer select-none ${isActive
                                    ? 'bg-[#263626] text-white border-[#263626] shadow-2xl scale-[1.02] ring-2 ring-[#263626]/20'
                                    : 'bg-white text-[#181F18] border-[#E5E1D8] shadow-warm hover:shadow-2xl hover:border-[#263626]'
                                    }`}
                            >
                                {/* Thumbnail Image */}
                                <div className="aspect-[4/3] w-full overflow-hidden bg-[#EAE5DB] relative">
                                    <img
                                        src={category.image}
                                        alt={category.title}
                                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out pointer-events-none"
                                        loading="lazy"
                                    />
                                    {isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#263626]/80 via-transparent to-transparent" />
                                    )}
                                </div>

                                {/* Text & Upward Arrow Button */}
                                <div className="p-3.5 sm:p-5 flex items-center justify-between gap-3 flex-grow">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <IconComp className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#4ADE80]' : 'text-[#263626]'}`} />
                                            <h3 className={`font-serif text-xs sm:text-base font-bold leading-tight ${isActive ? 'text-white' : 'text-[#181F18]'}`}>
                                                {category.title}
                                            </h3>
                                        </div>
                                        <p className={`text-[11px] sm:text-xs leading-snug line-clamp-2 ${isActive ? 'text-[#D5E2D5]' : 'text-[#5C665C]'}`}>
                                            {category.subtitle}
                                        </p>
                                    </div>

                                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 ${isActive
                                        ? 'bg-white text-[#263626] shadow-sm'
                                        : 'bg-[#FAF9F5] border border-[#E5E1D8] group-hover:bg-[#263626] group-hover:text-white'
                                        }`}>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* End-of-Slider Explore All Card */}
                    <Link
                        href="/workspaces"
                        onClick={(e) => {
                            if (dragDistance > 10) e.preventDefault();
                        }}
                        className="group bg-gradient-to-br from-[#263626] to-[#141C14] text-white rounded-2xl border border-[#3A4D3A] p-4 sm:p-5 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between w-[200px] sm:w-[230px] lg:w-[230px] shrink-0 snap-start min-h-[190px] sm:min-h-[220px]"
                    >
                        <div className="space-y-2">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#4ADE80]">
                                <Building2 className="w-4 h-4" />
                            </div>
                            <h3 className="font-serif text-base sm:text-lg font-bold text-white leading-snug">
                                Explore All 79 Centres
                            </h3>
                            <p className="text-[11px] sm:text-xs text-[#E3EBE3]/80 leading-relaxed">
                                Discover bespoke enterprise wings, day passes, dedicated desks & suites.
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-3">
                            <span className="text-xs font-mono text-[#A3D9A5] font-bold">
                                View All →
                            </span>
                            <div className="w-7 h-7 rounded-full bg-white/15 group-hover:bg-[#4ADE80] group-hover:text-[#181F18] flex items-center justify-center transition-all">
                                <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* ========================================================================= */}
                {/* DYNAMIC SUB-ITEMS DETAIL PANEL (Synchronized with top active category)     */}
                {/* ========================================================================= */}
                <div
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className="bg-[#FAF9F5] rounded-2xl sm:rounded-3xl border border-[#E2DDD3] p-4 sm:p-7 lg:p-8 shadow-warm-lg relative z-10 transition-all duration-500"
                >

                    {/* Panel Top Header Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 sm:pb-6 border-b border-[#E5E1D8] gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="flex items-center gap-3 sm:gap-3.5">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#263626] text-white flex items-center justify-center shadow-md shrink-0">
                                <ActiveIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#4ADE80]" />
                            </div>
                            <div>
                                <h3 className="font-serif text-lg sm:text-2xl font-bold text-[#181F18] leading-tight">
                                    {currentActiveCategory.detailTitle}
                                </h3>
                                <p className="text-xs sm:text-sm text-[#5C665C] font-sans mt-0.5 max-w-xl line-clamp-2 sm:line-clamp-none">
                                    {currentActiveCategory.detailDescription}
                                </p>
                            </div>
                        </div>

                        {/* Desktop View All & Sub-item Scroll Controls */}
                        <div className="hidden sm:flex items-center gap-3 self-start sm:self-auto shrink-0 flex-wrap">
                            <Link
                                href={currentActiveCategory.link}
                                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#181F18] hover:text-[#263626] bg-white hover:bg-[#F2EEE7] px-4 py-2 rounded-full border border-[#D5CEC2] shadow-xs transition-all shrink-0"
                            >
                                <span>{currentActiveCategory.ctaText}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>

                            {/* Sub-item Carousel Arrow Buttons */}
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={slideSubLeft}
                                    disabled={!canSubScrollLeft}
                                    className={`w-8 h-8 rounded-full border border-[#D5CEC2] flex items-center justify-center transition-all cursor-pointer shadow-xs ${canSubScrollLeft
                                        ? 'bg-white text-[#181F18] hover:bg-[#263626] hover:text-white hover:border-[#263626]'
                                        : 'bg-[#EAE5DC] text-[#A3B0A3] opacity-40 cursor-not-allowed'
                                        }`}
                                    aria-label="Previous sub items"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                </button>

                                <button
                                    onClick={slideSubRight}
                                    disabled={!canSubScrollRight}
                                    className={`w-8 h-8 rounded-full border border-[#D5CEC2] flex items-center justify-center transition-all cursor-pointer shadow-xs ${canSubScrollRight
                                        ? 'bg-white text-[#181F18] hover:bg-[#263626] hover:text-white hover:border-[#263626]'
                                        : 'bg-[#EAE5DC] text-[#A3B0A3] opacity-40 cursor-not-allowed'
                                        }`}
                                    aria-label="Next sub items"
                                >
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ========================================================================= */}
                    {/* MOBILE VIEW: Scrollable Vertical List (3 rows visible) + View All Button  */}
                    {/* ========================================================================= */}
                    <div className="block md:hidden space-y-4">

                        {/* Scrollable Container showing 3 item rows at a time */}
                        <div
                            className="max-h-[280px] sm:max-h-[300px] overflow-y-auto space-y-2.5 pr-1 py-1 rounded-xl"
                            style={{ scrollbarWidth: 'thin' }}
                        >
                            {currentActiveCategory.subItems.map((subItem) => (
                                <div
                                    key={subItem.id}
                                    className="bg-white rounded-xl border border-[#E5E1D8] p-2.5 sm:p-3 shadow-xs flex items-center gap-3 transition-all hover:border-[#263626]/50 shrink-0"
                                >
                                    {/* Thumbnail Image */}
                                    <div className="w-16 h-16 sm:w-20 sm:h-18 rounded-lg overflow-hidden shrink-0 bg-[#EAE5DB] relative">
                                        <img
                                            src={subItem.image}
                                            alt={subItem.title}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Title & Description */}
                                    <div className="flex-1 min-w-0 pr-1">
                                        <h4 className="font-serif font-bold text-xs sm:text-sm text-[#181F18] leading-tight mb-1 truncate">
                                            {subItem.title}
                                        </h4>
                                        <p className="text-[11px] text-[#5C665C] font-sans leading-snug line-clamp-2">
                                            {subItem.description}
                                        </p>
                                    </div>

                                    {/* Action Group: Book Button + Arrow Mark */}
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <Link
                                            href={subItem.bookLink}
                                            className="bg-[#263626] hover:bg-[#181F18] text-white text-[11px] font-semibold py-1.5 px-2.5 rounded-lg shadow-xs flex items-center gap-1 transition-colors"
                                        >
                                            <CalendarCheck className="w-3 h-3 text-[#4ADE80]" />
                                            <span>Book</span>
                                        </Link>

                                        <Link
                                            href={subItem.link}
                                            className="w-7 h-7 rounded-lg bg-[#FAF9F5] hover:bg-[#263626] text-[#263626] hover:text-white border border-[#E5E1D8] flex items-center justify-center transition-all"
                                            aria-label="View Details"
                                        >
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            ))}

                            {/* In the last row of the menu: View All Button */}
                            <Link
                                href={currentActiveCategory.link}
                                className="w-full bg-[#263626] hover:bg-[#181F18] text-white font-semibold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all shrink-0 mt-3"
                            >
                                <span>View All {currentActiveCategory.title}</span>
                                <ArrowRight className="w-4 h-4 text-[#4ADE80]" />
                            </Link>
                        </div>

                        {/* Mobile Included Highlights */}
                        <div className="pt-3 border-t border-[#E5E1D8] space-y-2">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-[#738273] font-bold block">
                                    INCLUDED HIGHLIGHTS
                                </span>
                                <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {currentActiveCategory.features.map((feat, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#EBE6DC] text-xs text-[#263626] font-medium"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                                        <span className="leading-snug">{feat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ========================================================================= */}
                    {/* DESKTOP VIEW: Swipeable Carousel of 6 Cards + 7th View All Card + Sidebar */}
                    {/* ========================================================================= */}
                    <div className="hidden md:grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

                        {/* Left Swipeable Sub-Item Cards Carousel (6 Cards + 7th View All Card) */}
                        <div className="lg:col-span-8 overflow-hidden">
                            <div
                                ref={subItemsScrollRef}
                                onMouseDown={handleSubMouseDown}
                                onMouseMove={handleSubMouseMove}
                                onMouseUp={handleSubMouseUp}
                                onMouseLeave={handleSubMouseLeave}
                                className={`flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory py-1 no-scrollbar items-stretch ${isSubMouseDown ? 'cursor-grabbing' : 'cursor-grab'
                                    }`}
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {/* 6 Sub-Item Cards */}
                                {currentActiveCategory.subItems.map((subItem) => (
                                    <div
                                        key={subItem.id}
                                        className="group bg-white rounded-2xl border border-[#E5E1D8] hover:border-[#263626] overflow-hidden shadow-warm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between w-[210px] sm:w-[220px] shrink-0 snap-start select-none"
                                    >
                                        {/* Thumbnail Image */}
                                        <div className="aspect-[16/11] w-full overflow-hidden bg-[#EAE5DB] relative">
                                            <img
                                                src={subItem.image}
                                                alt={subItem.title}
                                                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out pointer-events-none"
                                                loading="lazy"
                                            />
                                        </div>

                                        {/* Text Details */}
                                        <div className="p-3.5 flex flex-col justify-between flex-grow">
                                            <div className="mb-3">
                                                <h4 className="font-serif font-bold text-xs sm:text-sm text-[#181F18] group-hover:text-[#263626] transition-colors leading-tight mb-1">
                                                    {subItem.title}
                                                </h4>
                                                <p className="text-[11px] text-[#5C665C] font-sans leading-snug line-clamp-2">
                                                    {subItem.description}
                                                </p>
                                            </div>

                                            {/* Card Footer with BOOK NOW Button & Direct Link */}
                                            <div className="pt-2.5 border-t border-[#F2EEE7] flex items-center justify-between gap-2">
                                                <Link
                                                    href={subItem.bookLink}
                                                    onClick={(e) => {
                                                        if (subDragDistance > 10) e.preventDefault();
                                                    }}
                                                    className="flex-1 bg-[#263626] hover:bg-[#181F18] text-white text-[11px] font-semibold py-1.5 px-3 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                                                >
                                                    <CalendarCheck className="w-3 h-3 text-[#4ADE80]" />
                                                    <span>Book Now</span>
                                                </Link>

                                                <Link
                                                    href={subItem.link}
                                                    onClick={(e) => {
                                                        if (subDragDistance > 10) e.preventDefault();
                                                    }}
                                                    className="w-7 h-7 rounded-lg bg-[#FAF9F5] hover:bg-[#263626] text-[#263626] hover:text-white border border-[#E5E1D8] flex items-center justify-center transition-all shrink-0"
                                                    title="View Details"
                                                >
                                                    <ArrowRight className="w-3 h-3" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* 7th Card: View All / Explore More Card */}
                                <Link
                                    href={currentActiveCategory.link}
                                    onClick={(e) => {
                                        if (subDragDistance > 10) e.preventDefault();
                                    }}
                                    className="group bg-gradient-to-br from-[#263626] to-[#172217] text-white rounded-2xl border border-[#3A4D3A] p-4 shadow-warm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between w-[190px] sm:w-[200px] shrink-0 snap-start select-none min-h-[220px]"
                                >
                                    <div className="space-y-2">
                                        <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-[#4ADE80]">
                                            <ActiveIcon className="w-4 h-4" />
                                        </div>
                                        <h4 className="font-serif font-bold text-sm text-white leading-tight">
                                            View All {currentActiveCategory.title}
                                        </h4>
                                        <p className="text-[11px] text-[#E3EBE3]/80 leading-snug">
                                            Explore our full collection of options & custom setups.
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-white/10 flex items-center justify-between mt-auto">
                                        <span className="text-[11px] font-mono text-[#A3D9A5] font-bold">
                                            View All →
                                        </span>
                                        <div className="w-6 h-6 rounded-full bg-white/15 group-hover:bg-[#4ADE80] group-hover:text-[#181F18] flex items-center justify-center transition-all">
                                            <ArrowRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Right Feature Checklist & Visual Sidebar (4 cols on lg) */}
                        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E5E1D8] p-5 shadow-warm flex flex-col justify-between gap-5 h-full">

                            {/* 4 Feature Checklist Pills with rich interactive hover effects */}
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#738273] font-bold block">
                                        INCLUDED HIGHLIGHTS
                                    </span>
                                    <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
                                </div>

                                {currentActiveCategory.features.map((feat, idx) => (
                                    <div
                                        key={idx}
                                        className="group/pill flex items-center gap-2.5 p-2.5 rounded-xl bg-[#FAF9F5] hover:bg-[#EAE5DC] border border-[#EBE6DC] hover:border-[#263626]/40 text-xs text-[#263626] font-medium transition-all duration-200 cursor-pointer transform hover:scale-[1.02] hover:shadow-xs"
                                    >
                                        <div className="w-5 h-5 rounded-full bg-[#E8F5E9] group-hover/pill:bg-[#263626] flex items-center justify-center transition-colors shrink-0">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32] group-hover/pill:text-[#4ADE80] transition-colors" />
                                        </div>
                                        <span className="group-hover/pill:text-[#181F18] font-semibold transition-colors leading-snug">
                                            {feat}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Bottom Decorative Visual with Handwritten Tag */}
                            <div className="relative rounded-xl overflow-hidden border border-[#E5E1D8] bg-[#F2EEE7] p-4 flex items-center justify-between gap-3">
                                <div className="max-w-[140px]">
                                    <p className="font-handwriting text-xl sm:text-2xl text-[#263626] leading-tight rotate-[-3deg]">
                                        "{currentActiveCategory.handwrittenTag}"
                                    </p>
                                </div>
                                <div className="w-20 h-16 rounded-lg overflow-hidden border border-[#E5E1D8] shadow-sm shrink-0">
                                    <img
                                        src={currentActiveCategory.image}
                                        alt={currentActiveCategory.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
};