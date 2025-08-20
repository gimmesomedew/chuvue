import { Metadata } from 'next'
import { headers } from 'next/headers'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { HomeContentV2 } from './components/HomeContentV2'

export const metadata: Metadata = {
  title: 'Dog Services Directory - Home (V2)',
  description: 'Find trusted dog services in your area - Experimental Version',
  other: {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
}

export default function HomeV2() {
  // Force dynamic rendering
  headers();
  
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <HomeContentV2 />
      <Footer />
    </main>
  );
}
