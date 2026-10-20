export interface AmenityItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  iconName: string;
  image: string;
  galleryImages: string[];
  tagline: string;
  description: string;
  overviewParagraph1: string;
  overviewParagraph2: string;
  highlights: string[];
  specifications: { label: string; value: string }[];
  faqs: { question: string; answer: string }[];
}

export const AMENITIES_DATA: AmenityItem[] = [
  {
    id: 'rental-computer',
    slug: 'rental-computer',
    title: 'Rental Computer',
    subtitle: 'High-performance rigs on demand',
    iconName: 'Monitor',
    image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=85'
    ],
    tagline: 'High-spec desktop computers, dual-monitor setups, and developer workstations available on flexible rentals.',
    description: 'High-spec desktop workstations, dual-screen setups, and custom rigs available on flexible hourly, daily, or monthly rentals.',
    overviewParagraph1: 'Eliminate the friction of hardware management and transport. At EnCourtyard Hyderabad, we offer dedicated high-performance desktop computers and Apple/Windows workstations equipped with multi-core processors, rapid NVMe storage, and dual 4K color-accurate displays.',
    overviewParagraph2: 'Whether you are a developer compiling large codebases, a video editor rendering 4K media, a designer building complex Figma prototypes, or a visiting corporate executive, our rental workstations are pre-configured, digitally sanitized, and ready for immediate plug-and-play productivity.',
    highlights: [
      'High-Speed Multi-Core Intel Core i7/i9 & Apple Silicon rigs',
      'Dual 27-inch 4K Color-Accurate displays with ergonomic arms',
      '32GB to 64GB high-bandwidth DDR5 RAM with 1TB NVMe SSDs',
      'Pre-loaded productivity software, developer tools, and Adobe suite',
      'Encrypted user profiles with automated enterprise data wipe',
      'Flexible hourly, daily pass, and monthly dedicated rental options'
    ],
    specifications: [
      { label: 'Processors', value: 'Intel Core i7/i9 14th Gen / Apple M-Series' },
      { label: 'System Memory', value: '32GB - 64GB High-Speed DDR5 RAM' },
      { label: 'Primary Storage', value: '1TB - 2TB NVMe PCIe Gen 4 SSD' },
      { label: 'Display Configuration', value: 'Dual 27" 4K IPS UltraSharp Displays' },
      { label: 'Ergonomic Accessories', value: 'Mechanical Keyboards & Vertical Mice' },
      { label: 'Operating Systems', value: 'Windows 11 Pro / Ubuntu Linux / macOS' }
    ],
    faqs: [
      {
        question: 'Can I rent a computer on a daily or hourly basis?',
        answer: 'Yes! We offer hourly rentals, full-day passes, as well as monthly dedicated computer reservations for regular members.'
      },
      {
        question: 'Can I install my own specialized software?',
        answer: 'Absolutely. You are granted local administrator rights during your reservation to install any IDEs, creative tools, or proprietary software you require.'
      },
      {
        question: 'How is data security handled after my rental session?',
        answer: 'All systems undergo a DoD-compliant automated storage wipe upon checkout, ensuring your project code, credentials, and files remain 100% confidential.'
      }
    ]
  },
  {
    id: 'power-backup',
    slug: 'power-backup',
    title: 'Power Backup',
    subtitle: '100% uninterrupted uptime',
    iconName: 'Zap',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?auto=format&fit=crop&w=1200&q=85'
    ],
    tagline: 'Industrial-grade dual diesel generators and online double-conversion UPS guaranteeing zero downtime.',
    description: 'Dual-grid electricity with industrial online UPS and twin diesel generators ensuring 100% zero-downtime operations for critical work.',
    overviewParagraph1: 'In Hyderabad’s bustling tech corridors, power stability is paramount to professional success. EnCourtyard is built with an enterprise-grade power architecture featuring twin synchronized Cummins diesel generators and true online double-conversion UPS units.',
    overviewParagraph2: 'Our zero-millisecond automatic transfer switches ensure that power grid fluctuations or outages never cause a dropped video conference, server reboot, or lost code change. Every single desk, monitor, and server rack receives pure, isolated, sine-wave electricity 24 hours a day.',
    highlights: [
      '100% Power Uptime Guarantee with SLA-backed infrastructure',
      'Twin Synchronized 250 kVA Cummins Heavy-Duty Diesel Generators',
      'Industrial Double-Conversion Online UPS with zero transfer delay',
      'Surge suppression and voltage stabilization on all workstation sockets',
      'Dedicated power circuits for enterprise server racks and meeting suites',
      'Continuous 24/7 autonomous fuel reserve and telemetry monitoring'
    ],
    specifications: [
      { label: 'Uptime Reliability', value: '100% Continuous Zero-Downtime SLA' },
      { label: 'Generator Backup', value: 'Twin 250 kVA Synchronized Diesel Gensets' },
      { label: 'UPS Architecture', value: 'N+1 Double-Conversion Online Clean Sine' },
      { label: 'Switchover Latency', value: '0 Milliseconds (Phase-Matched Auto Transfer)' },
      { label: 'Socket Protection', value: 'Surge Isolation & Clean Grounding at Desks' },
      { label: 'Fuel Autonomy', value: '72+ Hours Continuous On-Site Reserve' }
    ],
    faqs: [
      {
        question: 'Will my monitors flicker or disconnect during power cuts?',
        answer: 'Not even for a microsecond. Our online double-conversion UPS continuously powers equipment from stored battery reserves, making grid transitions entirely unnoticeable.'
      },
      {
        question: 'Are there power backup plugs at hot desks and lounge areas?',
        answer: 'Yes, every workstation, meeting pod, and private cabin in our facility is connected directly to our uninterrupted power backup grid.'
      }
    ]
  },
  {
    id: 'high-speed-wifi',
    slug: 'high-speed-wifi',
    title: 'High Speed WiFi',
    subtitle: 'Gigabit fiber & WiFi 6',
    iconName: 'Wifi',
    image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=85'
    ],
    tagline: 'Dual-ISP enterprise fiber internet with 1 Gbps symmetric speed and comprehensive WiFi 6 mesh coverage.',
    description: 'Blazing-fast dual-ISP fiber optic internet with WiFi 6 coverage, dedicated IP options, and enterprise firewall security.',
    overviewParagraph1: 'Sluggish internet kills productivity. At EnCourtyard, we provide high-bandwidth, ultra-low latency internet engineered specifically for technical teams, cloud infrastructure management, and flawless 4K video broadcasting.',
    overviewParagraph2: 'Powered by automated multi-homed Tier-1 telecom providers (Airtel Business & Tata Communications) and managed with Cisco Meraki WiFi 6 access points, our network offers seamless roaming across all floors, private team VLANs, and gigabit RJ45 ethernet ports at dedicated desks.',
    highlights: [
      '1 Gbps Symmetric Speed with equal lightning-fast upload & download',
      'Dual Tier-1 ISP automated failover with BGP multi-homing',
      'Next-Gen WiFi 6 (802.11ax) enterprise mesh access points',
      'Sub-5ms ultra-low latency to major cloud data centers in Hyderabad',
      'Dedicated LAN RJ45 gigabit ports available for private cabins',
      'Private VLANs, static IP assignments, and enterprise WPA3 security'
    ],
    specifications: [
      { label: 'Connection Speed', value: 'Up to 1,000 Mbps (1 Gbps) Symmetric' },
      { label: 'ISP Redundancy', value: 'Dual Tier-1 Multi-Homed Auto Failover' },
      { label: 'Wireless Protocol', value: 'WiFi 6 (802.11ax) with MU-MIMO' },
      { label: 'Cloud Latency', value: '< 5ms to AWS/Azure Hyderabad Nodes' },
      { label: 'Wired Connectivity', value: 'Cat6A 1000BASE-T Gigabit RJ45 Jacks' },
      { label: 'Security Firewall', value: 'Enterprise WPA3 with Hardware IPS/IDS' }
    ],
    faqs: [
      {
        question: 'Can our company get a private, dedicated network SSID or VLAN?',
        answer: 'Yes! For private office and enterprise team suite members, our network engineering team can configure an isolated VLAN with custom firewall policies and static IPs.'
      },
      {
        question: 'Is wired LAN available if I do not want to use WiFi?',
        answer: 'Yes, all dedicated desks, private cabins, and conference rooms include direct high-speed gigabit ethernet ports.'
      }
    ]
  },
  {
    id: '24-7-security-and-support',
    slug: '24-7-security-and-support',
    title: '24/7 Security & Support',
    subtitle: 'Round-the-clock peace of mind',
    iconName: 'ShieldCheck',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1200&q=85'
    ],
    tagline: 'Multi-layer security with biometric access, HD CCTV surveillance, and 24/7 on-site technical support.',
    description: 'Multi-tier security with biometric access, HD CCTV coverage, manned surveillance, and on-site community support at all hours.',
    overviewParagraph1: 'Your business operates on your schedule. Whether working late into the evening, handling real-time customer deployments across US/European time zones, or conducting weekend hackathons, EnCourtyard provides an exceptionally safe and fully-staffed workspace around the clock.',
    overviewParagraph2: 'Access is controlled via smart biometric sensors and smartphone RFID credentials. All premises, lounges, and entry gates are continuously monitored by high-definition CCTV cameras with trained on-site security personnel and friendly community managers always ready to help.',
    highlights: [
      '24/7/365 Unrestricted building access for registered members',
      'Touchless biometric facial recognition & RFID smart credential doors',
      '120+ High-Definition CCTV security cameras with 90-day secure archive',
      'Round-the-clock trained security officers and front-desk personnel',
      'On-site technical support helpdesk available day and night',
      'Individual biometric digital locks on private offices and team suites'
    ],
    specifications: [
      { label: 'Access Mechanism', value: 'Touchless Biometric & Encrypted Smartphone NFC' },
      { label: 'CCTV Coverage', value: '120+ 4K Infrared Night-Vision Cameras' },
      { label: 'Security Staffing', value: '24/7 Manned Entry & Perimeter Patrols' },
      { label: 'IT Support Team', value: '24/7 On-Site Network & Hardware Assistance' },
      { label: 'Safety Standards', value: 'Automated Fire Suppression & First-Aid Certified' },
      { label: 'Visitor Policy', value: 'Digital Guest Check-In with Host Notification' }
    ],
    faqs: [
      {
        question: 'Can I safely leave my monitors and belongings overnight?',
        answer: 'Yes. Dedicated desks and private cabins are covered by continuous CCTV surveillance, and we also provide lockable pedestals and storage lockers.'
      },
      {
        question: 'Is someone available to assist me if I encounter technical issues at night?',
        answer: 'Yes! We maintain on-site facility and IT support staff 24 hours a day to assist with network connections, printing, or room access.'
      }
    ]
  },
  {
    id: 'free-tea-and-coffee',
    slug: 'free-tea-and-coffee',
    title: 'Free Tea & Coffee',
    subtitle: 'Unlimited artisanal brews',
    iconName: 'Coffee',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85'
    ],
    tagline: 'Unlimited bean-to-cup espresso, freshly brewed artisanal chai, and refreshing botanical infusions.',
    description: 'Unlimited freshly roasted espresso, organic teas, cappuccino, infused water, and artisan snacks to keep your team energized all day.',
    overviewParagraph1: 'We believe exceptional work deserves exceptional coffee. Our community pantries and café corners are fully stocked with high-grade Italian bean-to-cup espresso machines, single-origin roasts, and traditional freshly brewed Indian chai.',
    overviewParagraph2: 'Enjoy unlimited cups throughout your workday—from an early-morning double espresso to an afternoon green tea or refreshing cucumber-mint infused water. Everything is complimentary for all members and their meeting guests, served in a clean, welcoming pantry space.',
    highlights: [
      'Unlimited Fresh Bean-to-Cup Italian Espresso, Cappuccino, & Latte',
      'Authentic freshly brewed ginger-cardamom Masala Chai & Filter Coffee',
      'Selection of organic green, chamomile, peppermint, and Darjeeling teas',
      'Chilled multi-stage RO purified and natural fruit-infused water stations',
      'Equipped pantries with microwave ovens, refrigerators, and glassware',
      'Maintained with strict hygiene and continuous barista-grade upkeep'
    ],
    specifications: [
      { label: 'Coffee Machines', value: 'Commercial Swiss Bean-to-Cup Espresso Bars' },
      { label: 'Coffee Beans', value: '100% Arabica & Robusta Roasted Beans' },
      { label: 'Tea Selection', value: 'Assam, Darjeeling, Earl Grey, Green, Herbal' },
      { label: 'Water Filtration', value: 'Multi-Stage RO + UV + Essential Minerals' },
      { label: 'Availability', value: 'Unlimited 24/7 Access for All Members' },
      { label: 'Guest Policy', value: 'Complimentary for All Meeting Room Visitors' }
    ],
    faqs: [
      {
        question: 'Is the tea and coffee truly unlimited for all members?',
        answer: 'Yes! Day pass holders, hot desk members, and private cabin teams all enjoy unlimited complimentary coffee, tea, and infused waters all day long.'
      },
      {
        question: 'Can I bring my own lunch and store it in the pantry?',
        answer: 'Yes, our community pantries are equipped with commercial refrigerators, microwave ovens, and dedicated dining counter space.'
      }
    ]
  },
  {
    id: 'relaxing-zone',
    slug: 'relaxing-zone',
    title: 'Relaxing Zone',
    subtitle: 'Recharge & decompress',
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=85'
    ],
    tagline: 'Lush botanical courtyards, acoustic quiet pods, and game zones designed to refresh your mind and spark creativity.',
    description: 'Lush open-air botanical courtyards, ergonomic lounge seating, quiet nap pods, and game zones to refresh your mind.',
    overviewParagraph1: 'Sustained focus requires moments of mindful disconnection. EnCourtyard was architected around living biophilic spaces—featuring sunlit botanical atriums, leafy terrace gardens, and plush ergonomic reading nooks.',
    overviewParagraph2: 'Take a break from screens with a game of foosball or chess, sink into an acoustic acoustic pod for a 15-minute power recharge, or hold casual brainstorming walk-and-talks through our lush courtyard pathways. A refreshed mind produces breakthrough results.',
    highlights: [
      'Central Sunlit Botanical Courtyard with 200+ air-purifying plants',
      'Acoustic nap pods and ergonomic recliners for quiet mental decompression',
      'Recreation lounge with foosball, table tennis, and strategic board games',
      'Open-air terrace lounge with panoramic views of Hyderabad skyline',
      'Curated business & design library for inspiring offline reading',
      'Comfortable modular seating perfect for informal team stand-ups'
    ],
    specifications: [
      { label: 'Greenery Footprint', value: '3,500+ sq.ft Dedicated Biophilic Spaces' },
      { label: 'Seating Types', value: 'Acoustic Pods, Ergonomic Recliners, Lounges' },
      { label: 'Indoor Air Quality', value: 'HEPA Purified + Oxygen-Rich Plant Ecosystem' },
      { label: 'Recreation Amenities', value: 'Table Tennis, Foosball, Chess, Library' },
      { label: 'Sound Environment', value: 'Sound-Damping Baffles for Low Ambient Decibels' },
      { label: 'Accessibility', value: 'Open 24/7 for All EnCourtyard Members' }
    ],
    faqs: [
      {
        question: 'Can I take informal meetings or phone calls in the relaxing zone?',
        answer: 'Yes! While certain corners are designated quiet zones, our main botanical courtyard and terrace lounges are ideal for casual one-on-ones and collaborative discussions.'
      },
      {
        question: 'Are the outdoor terraces accessible throughout the day?',
        answer: 'Yes, our outdoor terrace gardens and indoor atriums are open 24/7 with comfortable shade and ambient evening lighting.'
      }
    ]
  }
];

export function getAmenityBySlug(slug: string): AmenityItem | undefined {
  const normalized = (slug || '').toLowerCase().trim();
  return AMENITIES_DATA.find(
    (item) =>
      item.slug === normalized ||
      item.id === normalized ||
      (normalized === 'wifi' && item.slug === 'high-speed-wifi') ||
      (normalized === 'security' && item.slug === '24-7-security-and-support') ||
      (normalized === 'coffee' && item.slug === 'free-tea-and-coffee') ||
      (normalized === 'tea' && item.slug === 'free-tea-and-coffee') ||
      (normalized === 'relaxation' && item.slug === 'relaxing-zone') ||
      (normalized === 'relax' && item.slug === 'relaxing-zone') ||
      (normalized === 'computer' && item.slug === 'rental-computer') ||
      (normalized === 'power' && item.slug === 'power-backup')
  );
}
