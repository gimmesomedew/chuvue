'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TestResult {
  id: number;
  name: string;
  distance: number;
  isExactMatch: boolean;
}

export default function TestSortingPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [sortMethod, setSortMethod] = useState<'distance' | 'name' | 'default'>('distance');
  const [sortedResults, setSortedResults] = useState<TestResult[]>([]);

  // Generate test data
  useEffect(() => {
    const testData: TestResult[] = [
      { id: 1, name: "Central Bark Park", distance: 0, isExactMatch: true },
      { id: 2, name: "Riverside Dog Park", distance: 3.2, isExactMatch: false },
      { id: 3, name: "Sunset Meadows", distance: 18.5, isExactMatch: false },
      { id: 4, name: "Oakwood Park", distance: 7.8, isExactMatch: false },
      { id: 5, name: "Maple Street Park", distance: 12.3, isExactMatch: false },
      { id: 6, name: "Pine Valley", distance: 25.1, isExactMatch: false },
      { id: 7, name: "Cedar Grove", distance: 1.5, isExactMatch: false },
      { id: 8, name: "Willow Creek", distance: 9.7, isExactMatch: false },
    ];
    setResults(testData);
  }, []);

  // Sorting functions
  const sortResultsByDistance = (results: TestResult[]) => {
    return [...results].sort((a, b) => {
      if (a.isExactMatch && !b.isExactMatch) return -1;
      if (!a.isExactMatch && b.isExactMatch) return 1;
      if (a.isExactMatch && b.isExactMatch) {
        return a.name.localeCompare(b.name);
      }
      return a.distance - b.distance;
    });
  };

  const sortResultsByName = (results: TestResult[]) => {
    return [...results].sort((a, b) => a.name.localeCompare(b.name));
  };

  const sortResults = (results: TestResult[], method: 'distance' | 'name' | 'default') => {
    switch (method) {
      case 'distance':
        return sortResultsByDistance(results);
      case 'name':
        return sortResultsByName(results);
      default:
        return results;
    }
  };

  // Apply sorting whenever results or sortMethod changes
  useEffect(() => {
    if (results.length > 0) {
      const sorted = sortResults(results, sortMethod);
      setSortedResults(sorted);
    }
  }, [results, sortMethod]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Frontend Sorting Test with Framer Motion</h1>
        
        {/* Sorting Controls */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Sort by:</span>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSortMethod('distance')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      sortMethod === 'distance'
                        ? 'bg-pink-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Distance
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSortMethod('name')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      sortMethod === 'name'
                        ? 'bg-pink-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Name
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSortMethod('default')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      sortMethod === 'default'
                        ? 'bg-pink-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Default
                  </motion.button>
                </div>
              </div>
              
              {/* Sort Method Indicator */}
              <motion.div 
                className="text-sm text-gray-600"
                key={sortMethod}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {sortMethod === 'distance' && '🔄 Sorting by distance (closest first)'}
                {sortMethod === 'name' && '🔤 Sorting alphabetically by name'}
                {sortMethod === 'default' && '📋 Showing in original order'}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Results Display */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {sortedResults.map((result, index) => (
                <motion.div 
                  key={`${result.id}-${sortMethod}`} 
                  className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    delay: index * 0.05, // Staggered effect
                    duration: 0.3,
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                  layout // Framer Motion automatically animates position changes
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{result.name}</h3>
                    {result.isExactMatch && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Exact Match
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Distance: {result.distance === 0 ? '0 miles (exact)' : `${result.distance.toFixed(1)} miles`}</p>
                    <p>ID: {result.id}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Debug Info */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Debug Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Current Sort Method:</strong> {sortMethod}</p>
                <p><strong>Total Results:</strong> {sortedResults.length}</p>
                <p><strong>Exact Matches:</strong> {sortedResults.filter(r => r.isExactMatch).length}</p>
              </div>
              <div>
                <p><strong>First 3 Results:</strong></p>
                <ul className="list-disc list-inside">
                  {sortedResults.slice(0, 3).map((result, index) => (
                    <li key={index}>
                      {result.name} - {result.distance} miles
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
