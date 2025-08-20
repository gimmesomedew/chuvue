import { Metadata } from 'next'
import { headers } from 'next/headers'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SearchResultsPage } from './components/SearchResultsPage'

export const metadata: Metadata = {
  title: 'Search Results - Dog Services Directory',
  description: 'Search results for dog services, products, and more',
  other: {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
}

export default function SearchResults() {
  headers();
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <SearchResultsPage />
      <Footer />
    </main>
  );
}
