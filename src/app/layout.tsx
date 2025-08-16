import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Knowledge Companion',
  description: 'A browser-based research and summarization app that ingests documents and links, indexes them locally, answers questions with citations, and produces exportable briefings.',
  keywords: ['AI', 'research', 'document analysis', 'knowledge management', 'summarization'],
  authors: [{ name: 'AI Knowledge Companion' }],
  creator: 'AI Knowledge Companion',
  publisher: 'AI Knowledge Companion',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ai-knowledge-companion.netlify.app'),
  openGraph: {
    title: 'AI Knowledge Companion',
    description: 'Transform your documents into actionable insights with AI-powered research and analysis.',
    url: 'https://ai-knowledge-companion.netlify.app',
    siteName: 'AI Knowledge Companion',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Knowledge Companion',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Knowledge Companion',
    description: 'Transform your documents into actionable insights with AI-powered research and analysis.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preload" href="/pdf.worker.min.js" as="script" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
