'use client';

import { useState } from 'react';
import { seedServices } from '@/lib/seed-data';

export default function SeedPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [message, setMessage] = useState('');
  
  const handleSeed = async () => {
    setIsSeeding(true);
    setMessage('Seeding database...');
    
    try {
      await seedServices();
      setMessage('Database seeded successfully!');
    } catch (error) {
      console.error('Error seeding database:', error);
      setMessage('Error seeding database. Check console for details.');
    } finally {
      setIsSeeding(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Seed Database</h1>
        
        <p className="mb-6 text-gray-600">
          This will add sample service data to the database for testing purposes.
          Only use this if your database is empty or you want to add more sample data.
        </p>
        
        <button
          onClick={handleSeed}
          disabled={isSeeding}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          {isSeeding ? 'Seeding...' : 'Seed Database'}
        </button>
        
        {message && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md text-center">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
