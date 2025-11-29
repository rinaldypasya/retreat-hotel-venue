'use client';

export function VenueCardSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-stone-200" />
      
      {/* Content skeleton */}
      <div className="p-5 space-y-4">
        {/* Location */}
        <div className="h-4 w-24 bg-stone-200 rounded" />
        
        {/* Title */}
        <div className="h-6 w-3/4 bg-stone-200 rounded" />
        
        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-stone-200 rounded" />
          <div className="h-4 w-2/3 bg-stone-200 rounded" />
        </div>
        
        {/* Capacity */}
        <div className="h-4 w-20 bg-stone-200 rounded" />
        
        {/* Tags */}
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-stone-200 rounded-full" />
          <div className="h-6 w-20 bg-stone-200 rounded-full" />
          <div className="h-6 w-14 bg-stone-200 rounded-full" />
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-stone-100">
          <div className="h-7 w-28 bg-stone-200 rounded" />
          <div className="h-10 w-28 bg-stone-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function VenueGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <VenueCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function VenueDetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero Image */}
      <div className="h-[400px] bg-stone-200 rounded-xl mb-8" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="h-4 w-32 bg-stone-200 rounded" />
          <div className="h-10 w-3/4 bg-stone-200 rounded" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-stone-200 rounded" />
            <div className="h-4 w-full bg-stone-200 rounded" />
            <div className="h-4 w-2/3 bg-stone-200 rounded" />
          </div>
          
          {/* Amenities skeleton */}
          <div className="grid grid-cols-2 gap-3 pt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 bg-stone-200 rounded-lg" />
            ))}
          </div>
        </div>
        
        {/* Booking Form Skeleton */}
        <div className="bg-stone-100 rounded-xl h-[500px]" />
      </div>
    </div>
  );
}

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div className="spinner text-primary-600" />
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <Spinner className="mb-4" />
        <p className="text-stone-500">Loading...</p>
      </div>
    </div>
  );
}
