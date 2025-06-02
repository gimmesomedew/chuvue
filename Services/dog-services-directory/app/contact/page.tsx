import { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';
import { Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | Dog Services Directory',
  description: 'Get in touch with us for any questions, feedback, or support regarding dog services.',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">
        Contact Us
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
        {/* Contact Information */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Get In Touch</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Have questions about our dog services directory? Want to list your service?
              We're here to help! Fill out the form and we'll get back to you as soon as possible.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-medium">Email Us</h3>
                <p className="text-gray-600 dark:text-gray-300">info@dogparkadventures.com</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
