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
  openGraph: {
    title: 'EnCourtyard | Architectural Coworking & Executive Workspaces',
    description:
      'Discover handcrafted workspaces, soundproof suites, and executive meeting rooms designed for deep focus and collaborative momentum.',
    siteName: 'EnCourtyard',
    type: 'website',
    locale: 'en_US',
  },
};

import { AuthProvider } from '@/context/AuthContext';
import { FeedbackProvider } from '@/context/FeedbackModalContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} h-full antialiased scroll-smooth overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF9F5] text-[#181F18] selection:bg-[#263626] selection:text-white overflow-x-hidden w-full max-w-full">
        <AuthProvider>
          <FeedbackProvider>
            <Navbar />
            <main className="flex-grow w-full max-w-full overflow-x-hidden">{children}</main>
            <Footer />
          </FeedbackProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

