'use client';

export function SearchFormSkeleton() {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Service Type Field Skeleton */}
        <div className="md:col-span-4">
          <div className="flex items-center mb-2">
            <div className="h-5 w-5 bg-gray-200 rounded-full mr-2 animate-pulse" />
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-[42px] bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Location Field Skeleton */}
        <div className="md:col-span-6">
          <div className="flex items-center mb-2">
            <div className="h-5 w-5 bg-gray-200 rounded-full mr-2 animate-pulse" />
            <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center space-x-2">
            {/* Location Toggle Skeleton */}
            <div className="flex rounded-md overflow-hidden border border-gray-200">
              <div className="w-20 h-[38px] bg-gray-200 animate-pulse" />
              <div className="w-20 h-[38px] bg-gray-200 animate-pulse" />
            </div>
            {/* Location Input Skeleton */}
            <div className="flex-1">
              <div className="h-[42px] bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Search Button Skeleton */}
        <div className="md:col-span-2 flex items-end">
          <div className="w-full h-[42px] bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
} 