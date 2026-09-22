const fs = require('fs');
const path = require('path');

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const workspaces = [
  {
    id: 'ws-executive-suite-1',
    title: 'Executive Botanical Suite',
    slug: 'executive-botanical-suite',
    categoryId: 'private-offices',
    categoryName: 'Private Offices',
    shortDescription: 'Soundproof private suite with courtyard views, custom walnut furnishings, and 24/7 biometric access.',
    longDescription: 'Engineered for executive leadership and expanding boutique teams. This acoustically isolated private suite features floor-to-ceiling panoramic windows overlooking the central botanical sanctuary. Outfitted with motorized ergonomic desks, Herman Miller Cosm chairs, private high-speed VLAN, and dedicated meeting room credits.',
    specifications: JSON.stringify([
      { key: 'Seating', value: '4 - 8 Pax' },
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
    capacity: '4 - 8 Pax',
    location: 'Maruthi Plaza, Khairtabad (Level 2)',
    badge: 'Popular',
    order: 1,
    isActive: true
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
    isActive: true
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
      { key: 'Hours', value: 'Mon - Sat, 8:00 AM - 8:00 PM' }
    ]),
    mediaUrls: JSON.stringify([
      { url: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Courtyard Flex Lounge' },
      { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Collaboration Commons' },
      { url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Cafe Seating' }
    ]),
    price: '₹750 / day',
    capacity: '1 Pax (Flex)',
    location: 'Central Atrium, Ground Floor',
    badge: 'Flexible',
    order: 3,
    isActive: true
  },
  {
    id: 'ws-boardroom-glass-1',
    title: 'The Glass Pavilion Boardroom',
    slug: 'the-glass-pavilion-boardroom',
    categoryId: 'meeting-rooms',
    categoryName: 'Meeting Rooms',
    shortDescription: 'High-spec meeting facility with 85-inch 4K screen, beamforming audio, and barista service.',
    longDescription: 'Designed for high-stakes investor pitches, board reviews, and strategic workshops. Encased in double-glazed acoustic glass, this premier boardroom includes Sony 4K displays, Shure ceiling microphone arrays, and integrated HDMI/wireless casting.',
    specifications: JSON.stringify([
      { key: 'Capacity', value: '12 - 16 Persons' },
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
    capacity: '12 - 16 Pax',
    location: 'Executive Wing, Level 2',
    badge: 'STC 55 Soundproof',
    order: 4,
    isActive: true
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
      { key: 'Team Size', value: '20 - 45 Pax' },
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
    capacity: '20 - 45 Pax',
    location: 'Maruthi Plaza, Level 3 (Private Floor)',
    badge: 'Enterprise HQ',
    order: 5,
    isActive: true
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
    isActive: true
  },
  {
    id: 'ws-podcast-studio-1',
    title: 'Acoustic 4K Broadcast Podcast Studio',
    slug: 'acoustic-4k-broadcast-podcast-studio',
    categoryId: 'podcast-studios',
    categoryName: 'Podcast Studios',
    shortDescription: 'Studio with 4x Shure SM7B microphones, Blackmagic 4K cameras, and sound isolation booth.',
    longDescription: 'Turnkey recording environment tailored for podcasters, interviewers, and webinar creators. Fitted with acoustic double-wall baffling (STC 65 rating), multi-track Rodecaster Pro II mixer, professional LED softbox lighting, and 4K cinema cameras.',
    specifications: JSON.stringify([
      { key: 'Capacity', value: '1 - 4 Speakers' },
      { key: 'Microphones', value: '4x Shure SM7B + Cloudlifters' },
      { key: 'Cameras', value: 'Dual Blackmagic Cinema 4K' },
      { key: 'Console', value: 'Rodecaster Pro II Audio Mixer' },
      { key: 'Isolation', value: 'STC 65 Sound Baffling' }
    ]),
    mediaUrls: JSON.stringify([
      { url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Studio Microphones & Lighting' },
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Audio Mixing Desk' }
    ]),
    price: '₹1,800 / hour',
    capacity: '1 - 4 Pax',
    location: 'Maruthi Plaza, Ground Floor Studio Pod',
    badge: '4K Broadcast',
    order: 7,
    isActive: true
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
      { key: 'Seating', value: '1 - 2 Persons' },
      { key: 'Area', value: '120 sq.ft' },
      { key: 'Access', value: '24/7 Biometric Entry' },
      { key: 'Desk', value: 'Motorized Standing Desk' }
    ]),
    mediaUrls: JSON.stringify([
      { url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Creative Cabin Interior' },
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', type: 'image', name: 'Desk View' }
    ]),
    price: '₹18,000 / month',
    capacity: '1 - 2 Pax',
    location: 'Maruthi Plaza, Level 2',
    badge: 'Deep Work',
    order: 8,
    isActive: true
  }
];

fs.writeFileSync(path.join(dataDir, 'local_workspaces.json'), JSON.stringify(workspaces, null, 2), 'utf-8');
console.log('Successfully wrote', workspaces.length, 'workspaces to local_workspaces.json');
