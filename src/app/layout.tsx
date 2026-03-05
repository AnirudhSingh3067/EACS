import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';

import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { TransitionProvider } from '@/components/layout/transition-provider';

export const metadata: Metadata = {
  title: 'MindBridge – AI-Assisted Human Psychological Support',
  description: 'Connecting you with licensed psychologists and providing AI-assisted emotional support.',
  openGraph: {
    title: 'MindBridge – AI-Assisted Human Psychological Support',
    description: 'Connecting you with licensed psychologists and providing AI-assisted emotional support.',
    url: 'https://mindbridge.vercel.app',
    siteName: 'MindBridge',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxzdXBwb3J0fGVufDB8fHx8MTc3MjI3MTAyNnww&ixlib=rb-4.1.0&q=80&w=1200',
        width: 1200,
        height: 630,
        alt: 'Professional therapy session',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MindBridge – AI-Assisted Human Psychological Support',
    description: 'Connecting you with licensed psychologists and providing AI-assisted emotional support.',
    images: ['https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxzdXBwb3J0fGVufDB8fHx8MTc3MjI3MTAyNnww&ixlib=rb-4.1.0&q=80&w=1200'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
        <FirebaseClientProvider>
          <Navbar />
          <main className="flex-grow flex flex-col h-full items-center">
            <TransitionProvider>
              {children}
            </TransitionProvider>
          </main>
          <Footer />
          <Toaster />
          <ScrollToTop />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}