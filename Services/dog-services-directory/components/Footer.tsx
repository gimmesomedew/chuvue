'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[rgba(9,46,62,1)] text-white py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-4">
              <img src="/images/DPA-white-logo.png" alt="Dog Park Adventures Logo" className="h-12 mr-2" />
            </div>
            <p className="text-white text-sm">Connecting pet owners with trusted local services.</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-[#38eb38]">Quick Links</h3>
            <ul className="space-y-2">
              <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link href="/" className="text-gray hover:text-gray-200">Home</Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link href="/add-listing" className="text-gray hover:text-gray-200">Add Your Service</Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link href="/contact" className="text-gray hover:text-gray-200">Contact Us</Link>
              </motion.li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-[#38eb38]">Connect With Us</h3>
            <div className="flex space-x-4">
              <motion.a 
                href="https://www.facebook.com/TheDogParkAdventures"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }} 
                transition={{ duration: 0.2 }}
                className="text-white hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </motion.a>
              <motion.a 
                href="https://www.instagram.com/gymsfordogs/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }} 
                transition={{ duration: 0.2 }}
                className="text-white hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 4H8C5.79086 4 4 5.79086 4 8V16C4 18.2091 5.79086 20 8 20H16C18.2091 20 20 18.2091 20 16V8C20 5.79086 18.2091 4 16 4Z"></path>
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"></path>
                  <path d="M16.5 7.5C16.5 7.77614 16.2761 8 16 8C15.7239 8 15.5 7.77614 15.5 7.5C15.5 7.22386 15.7239 7 16 7C16.2761 7 16.5 7.22386 16.5 7.5Z"></path>
                </svg>
              </motion.a>
              <motion.a 
                href="https://x.com/GymsForDogs"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }} 
                transition={{ duration: 0.2 }}
                className="text-white hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-sm text-white">© {new Date().getFullYear()} Dog Park Adventures</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Link href="/privacy" className="text-sm text-white hover:text-gray-200">
                Privacy Policy
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Link href="/terms" className="text-sm text-white hover:text-gray-200">
                Terms of Service
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
} 