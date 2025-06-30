import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import BackToTopButton from '@/components/ui/BackToTopButton';

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <Providers>
          {children}
          <BackToTopButton />
        </Providers>
      </body>
    </html>
  );
}
