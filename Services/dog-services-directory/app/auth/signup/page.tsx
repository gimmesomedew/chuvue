import { SignUpForm } from '@/components/auth/SignUpForm';
import { Header } from '@/components/Header';

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary via-third to-secondary">
      <Header />
      <div className="pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <SignUpForm />
          </div>
        </div>
      </div>
    </main>
  );
}
