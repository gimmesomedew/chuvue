"use client";

import Link from 'next/link';
import { CheckCircle2, Home } from 'lucide-react';

export default function SubmissionConfirmationPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8 text-center">
      <CheckCircle2 className="h-16 w-16 text-emerald-600 mb-4" />
      <h1 className="text-3xl font-bold mb-4">Thank you for your submission!</h1>
      <p className="text-gray-700 max-w-xl mb-8">
        Your listing has been received and is awaiting review by our team. If approved, it will be
        automatically published to the directory and you'll receive an email letting you know.
      </p>
      <Link href="/" className="btn btn-primary flex items-center gap-2">
        <Home className="h-4 w-4" />
        Back to Home
      </Link>
    </div>
  );
} 