import { LoginForm } from '@/components/auth/LoginForm';
import { Header } from '@/components/Header';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
