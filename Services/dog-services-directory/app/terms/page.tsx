import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service | Dog Services Directory',
  description: 'Terms and conditions for using the Dog Services Directory platform.',
  other: {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-emerald max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using Dog Park Adventures services directory ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
            <p className="mb-4">
              To access certain features of the Platform, you must register for an account. You agree to provide accurate and complete information during registration and to keep your account information updated.
            </p>
            <p className="mb-4">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Service Provider Listings</h2>
            <p className="mb-4">
              Service providers are responsible for ensuring their listing information is accurate, complete, and up-to-date. The Platform reserves the right to remove or modify listings that violate our policies.
            </p>
            <p className="mb-4">
              Service providers must maintain appropriate licenses, certifications, and insurance as required by local regulations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. User Conduct</h2>
            <p className="mb-4">
              Users agree not to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Post false, misleading, or fraudulent information</li>
              <li>Harass or harm other users</li>
              <li>Use the Platform for illegal activities</li>
              <li>Attempt to gain unauthorized access to the Platform</li>
              <li>Interfere with the Platform's operation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Reviews and Ratings</h2>
            <p className="mb-4">
              Users may submit reviews and ratings for services they have personally used. Reviews must be honest, factual, and not contain offensive or inappropriate content.
            </p>
            <p className="mb-4">
              The Platform reserves the right to remove reviews that violate our policies or appear fraudulent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
            <p className="mb-4">
              The Platform serves as a directory and does not endorse or guarantee any listed services. Users engage with service providers at their own risk.
            </p>
            <p className="mb-4">
              We are not responsible for the quality, safety, or legality of services provided by listed businesses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these terms at any time. Users will be notified of significant changes, and continued use of the Platform constitutes acceptance of modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
            <p className="mb-4">
              For questions about these Terms of Service, please contact us through our support channels.
            </p>
          </section>

          <div className="text-sm text-gray-600 mt-12">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 