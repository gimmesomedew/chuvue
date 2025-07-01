import type { Metadata } from "next";
import { PT_Sans, PT_Sans_Narrow } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import BackToTopButton from '@/components/ui/BackToTopButton';

const ptSans = PT_Sans({ 
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: '--font-pt-sans',
});

const ptSansNarrow = PT_Sans_Narrow({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: '--font-pt-sans-narrow',
});

export const metadata: Metadata = {
  title: "Dog Park Adventures - Find the Best Dog Services Near You",
  description: "Discover local dog parks, veterinarians, groomers, and daycare services for your furry friend.",
  icons: {
    icon: '/favicon.ico',
  },
  other: {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${ptSans.variable} ${ptSansNarrow.variable} font-sans`}>
        <Providers>
          {children}
          <BackToTopButton />
        </Providers>
      </body>
    </html>
  );
}
