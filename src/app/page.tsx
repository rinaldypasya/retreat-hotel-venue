'use client';

import { useState, useEffect, useCallback } from 'react';
import { VenueWithAmenities, VenueFilters as VenueFiltersType, PaginatedResponse } from '@/types';
import {
  VenueCard,
  VenueFilters,
  Pagination,
  VenueGridSkeleton,
  EmptyState,
} from '@/components';
import ErrorState from '@/components/ErrorState';

export default function HomePage() {
  const [venues, setVenues] = useState<VenueWithAmenities[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });
  const [filters, setFilters] = useState<VenueFiltersType>({
    page: 1,
    limit: 9,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVenues = useCallback(async (currentFilters: VenueFiltersType) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (currentFilters.city) params.set('city', currentFilters.city);
      if (currentFilters.minCapacity) params.set('minCapacity', String(currentFilters.minCapacity));
      if (currentFilters.maxPrice) params.set('maxPrice', String(currentFilters.maxPrice));
      params.set('page', String(currentFilters.page || 1));
      params.set('limit', String(currentFilters.limit || 9));

      const response = await fetch(`/api/venues?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch venues');
      }

      const data: PaginatedResponse<VenueWithAmenities> = await response.json();
      setVenues(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error fetching venues:', err);
      setError('Failed to load venues. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchVenues(filters);
  }, []);

  // Handle filter changes
  const handleFilterChange = (newFilters: VenueFiltersType) => {
    setFilters(newFilters);
    fetchVenues(newFilters);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    fetchVenues(newFilters);
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            Find the Perfect Venue for Your Team
          </h1>
          <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto mb-8">
            Discover exceptional spaces for offsites, retreats, and corporate events. 
            From mountain lodges to beachfront resorts.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <svg className="w-5 h-5 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Curated Venues</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <svg className="w-5 h-5 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Instant Booking Inquiries</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <svg className="w-5 h-5 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Dedicated Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <VenueFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          isLoading={isLoading}
        />

        {/* Results Count */}
        {!isLoading && !error && (
          <div className="mt-8 mb-6 flex items-center justify-between">
            <p className="text-stone-600">
              {pagination.total === 0 ? (
                'No venues found'
              ) : (
                <>
                  Showing{' '}
                  <span className="font-medium text-stone-900">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>
                  {' '}-{' '}
                  <span className="font-medium text-stone-900">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>
                  {' '}of{' '}
                  <span className="font-medium text-stone-900">{pagination.total}</span>
                  {' '}venues
                </>
              )}
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="mt-8">
            <VenueGridSkeleton count={6} />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="mt-8">
            <ErrorState
              message={error}
              onRetry={() => fetchVenues(filters)}
            />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && venues.length === 0 && (
          <div className="mt-8">
            <EmptyState
              title="No venues match your criteria"
              message="Try adjusting your filters or clearing them to see all available venues."
              actionLabel="Clear Filters"
              onAction={() => handleFilterChange({ page: 1, limit: 9 })}
            />
          </div>
        )}

        {/* Venue Grid */}
        {!isLoading && !error && venues.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
              {venues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  hasMore={pagination.hasMore}
                  onPageChange={handlePageChange}
                  isLoading={isLoading}
                />
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
