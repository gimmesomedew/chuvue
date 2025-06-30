import { Metadata } from 'next'
import { headers } from 'next/headers'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { HomeContent } from './components/HomeContent'

export const metadata: Metadata = {
  title: 'Dog Services Directory - Home',
  description: 'Find trusted dog services in your area',
  other: {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
}

export default function Home() {
  // Force dynamic rendering
  headers();
  
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <HomeContent />
      <Footer />
    </main>
  );
}
