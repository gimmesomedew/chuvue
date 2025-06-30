export function ProfileDetailsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Profile Header with Image Skeleton */}
      <div className="relative bg-white shadow-md p-4 sm:p-6 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Left Side - Profile Image and Photos Skeleton */}
          <div className="md:w-1/3 flex flex-col gap-4">
            {/* Circular Profile Image Skeleton */}
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg mx-auto md:mx-0 flex-shrink-0 bg-gray-200" />
            
            {/* Additional Photos Skeleton */}
            <div className="mt-4">
              <div className="h-5 bg-gray-200 w-24 rounded mb-2" /> {/* "More Photos" text */}
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((index) => (
                  <div 
                    key={index}
                    className="aspect-square rounded-md overflow-hidden bg-gray-200"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Profile Details Skeleton */}
          <div className="flex-1 md:w-2/3">
            <div className="flex flex-col gap-5">
              {/* Name and Basic Info Skeleton */}
              <div>
                <div className="h-8 bg-gray-200 w-3/4 rounded mb-4" /> {/* Name */}
                <div className="h-5 bg-gray-200 w-1/2 rounded mb-2" /> {/* Location */}
                <div className="h-5 bg-gray-200 w-1/3 rounded" /> {/* Role */}
              </div>
              
              {/* About Section Skeleton */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="h-6 bg-gray-200 w-24 rounded mb-3" /> {/* "About" text */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 w-full rounded" />
                  <div className="h-4 bg-gray-200 w-5/6 rounded" />
                  <div className="h-4 bg-gray-200 w-4/6 rounded" />
                </div>
              </div>
              
              {/* Pet Details Skeleton */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="h-6 bg-gray-200 w-32 rounded mb-3" /> {/* "Pet Details" text */}
                <div className="space-y-4">
                  <div>
                    <div className="h-4 bg-gray-200 w-16 rounded mb-1" /> {/* "Breed" text */}
                    <div className="h-5 bg-gray-200 w-1/3 rounded" />
                  </div>
                  <div>
                    <div className="h-4 bg-gray-200 w-32 rounded mb-1" /> {/* "Favorite Tricks" text */}
                    <div className="h-5 bg-gray-200 w-2/3 rounded" />
                  </div>
                </div>
              </div>
              
              {/* Tags/Interests Skeleton */}
              <div>
                <div className="h-5 bg-gray-200 w-24 rounded mb-2" /> {/* "Interests" text */}
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map((index) => (
                    <div 
                      key={index}
                      className="h-6 bg-gray-200 w-20 rounded-full"
                    />
                  ))}
                </div>
              </div>
              
              {/* Send Message Button Skeleton */}
              <div className="mt-2">
                <div className="h-12 bg-gray-200 w-full rounded-md" />
              </div>
              
              {/* Member Since Skeleton */}
              <div className="h-4 bg-gray-200 w-40 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 