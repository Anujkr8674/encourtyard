import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'EnCourtyard | Architectural Coworking & Executive Workspaces',
    template: '%s | EnCourtyard Workspaces',
  },
  description:
    'EnCourtyard is a modern coworking sanctuary featuring private suites, dedicated desks, executive boardrooms, and botanical courtyards for startups, SMEs, and enterprise teams.',
  keywords: [
    'coworking space',
    'private office',
    'dedicated desk',
    'meeting rooms',
    'executive boardroom',
    'EnCourtyard',
    'botanical workspace'
  ],
  authors: [{ name: 'EnCourtyard Workspaces Inc.' }],
  icons: {
    icon: [
      { url: '/images/site-icon.png', type: 'image/png' },
      { url: '/site-icon.png', type: 'image/png' },
      { url: '/icon.png', type: 'image/png' },
    ],
    shortcut: '/images/site-icon.png',
    apple: [
      { url: '/images/site-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'EnCourtyard | Architectural Coworking & Executive Workspaces',
    description:
      'Discover handcrafted workspaces, soundproof suites, and executive meeting rooms designed for deep focus and collaborative momentum.',
    siteName: 'EnCourtyard',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/images/site-icon.png',
        width: 512,
        height: 512,
        alt: 'EnCourtyard Site Icon',
      },
    ],
  },
};

import { AuthProvider } from '@/context/AuthContext';
import { FeedbackProvider } from '@/context/FeedbackModalContext';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';

import { Suspense } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} h-full antialiased scroll-smooth overflow-x-clip`}
    >
      <head>
        <link rel="icon" href="/images/site-icon.png" type="image/png" />
        <link rel="shortcut icon" href="/images/site-icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/site-icon.png" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#181F18] selection:bg-[#263626] selection:text-white overflow-x-clip w-full max-w-full">
        <AuthProvider>
          <FeedbackProvider>
            <Suspense fallback={<div className="h-24 sm:h-28" />}>
              <Navbar />
            </Suspense>
            <main className="flex-grow w-full max-w-full overflow-x-clip">{children}</main>
            <Footer />
            <WhatsAppButton />
          </FeedbackProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

