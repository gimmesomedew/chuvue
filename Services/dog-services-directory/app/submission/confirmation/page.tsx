"use client";

import Link from 'next/link';
import { CheckCircle2, Home, Clock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const steps = [
  {
    icon: CheckCircle2,
    title: "Submission Received",
    description: "Your listing has been successfully submitted to our system."
  },
  {
    icon: Clock,
    title: "Under Review",
    description: "Our team will carefully review your submission to ensure it meets our quality standards."
  },
  {
    icon: Mail,
    title: "Email Notification",
    description: "Once approved, you'll receive an email confirmation and your listing will be published."
  }
];

export default function SubmissionConfirmationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
          className="space-y-12"
        >
          {/* Header Section */}
          <motion.div
            variants={fadeIn}
            className="text-center space-y-4"
          >
            <div className="relative inline-block">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="rounded-full bg-emerald-100 p-3"
              >
                <CheckCircle2 className="h-12 w-12 text-emerald-600" />
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-400"
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Thank you for your submission!
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're excited to review your listing and add it to our directory.
            </p>
          </motion.div>

          {/* Process Steps */}
          <motion.div
            variants={fadeIn}
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
          >
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  variants={fadeIn}
                  className="relative"
                >
                  <Card className="h-full p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="rounded-full bg-emerald-50 p-3">
                        <Icon className="h-6 w-6 text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  </Card>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-200" />
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          {/* Action Button */}
          <motion.div
            variants={fadeIn}
            className="text-center"
          >
            <Button
              asChild
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Link href="/" className="inline-flex items-center gap-2">
                <Home className="h-5 w-5" />
                Back to Home
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 