'use client';

import { useState, useEffect, useCallback } from 'react';
import { VenueFilters as VenueFiltersType } from '@/types';
import { cn } from '@/lib/utils';

interface VenueFiltersProps {
  filters: VenueFiltersType;
  onFilterChange: (filters: VenueFiltersType) => void;
  isLoading?: boolean;
}

export default function VenueFilters({ filters, onFilterChange, isLoading }: VenueFiltersProps) {
  const [cities, setCities] = useState<string[]>([]);
  const [localFilters, setLocalFilters] = useState(filters);

  // Fetch available cities for dropdown
  useEffect(() => {
    async function fetchCities() {
      try {
        const response = await fetch('/api/cities');
        const data = await response.json();
        if (data.data) {
          setCities(data.data);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    }
    fetchCities();
  }, []);

  // Sync local state with props
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Debounced filter application
  const applyFilters = useCallback(() => {
    onFilterChange(localFilters);
  }, [localFilters, onFilterChange]);

  // Handle input changes
  const handleChange = (field: keyof VenueFiltersType, value: string | number | undefined) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value,
      page: 1, // Reset to first page on filter change
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters: VenueFiltersType = {
      city: undefined,
      minCapacity: undefined,
      maxPrice: undefined,
      page: 1,
      limit: filters.limit,
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = filters.city || filters.minCapacity || filters.maxPrice;

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-stone-900">Filter Venues</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* City Filter */}
        <div>
          <label htmlFor="city" className="label">
            Location
          </label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <select
              id="city"
              value={localFilters.city || ''}
              onChange={(e) => handleChange('city', e.target.value || undefined)}
              className="input pl-10 pr-10 appearance-none cursor-pointer"
              disabled={isLoading}
            >
              <option value="">All cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Capacity Filter */}
        <div>
          <label htmlFor="minCapacity" className="label">
            Minimum Capacity
          </label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <input
              id="minCapacity"
              type="number"
              min="1"
              placeholder="Any size"
              value={localFilters.minCapacity || ''}
              onChange={(e) =>
                handleChange('minCapacity', e.target.value ? parseInt(e.target.value) : undefined)
              }
              className="input pl-10"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Price Filter */}
        <div>
          <label htmlFor="maxPrice" className="label">
            Max Price / Night
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">$</span>
            <input
              id="maxPrice"
              type="number"
              min="1"
              placeholder="Any budget"
              value={localFilters.maxPrice || ''}
              onChange={(e) =>
                handleChange('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)
              }
              className="input pl-7"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            onClick={applyFilters}
            disabled={isLoading}
            className={cn(
              'btn-primary w-full',
              isLoading && 'opacity-75 cursor-wait'
            )}
          >
            {isLoading ? (
              <>
                <span className="spinner mr-2" />
                Searching...
              </>
            ) : (
              <>
                <svg 
                  className="w-4 h-4 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
                Search
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
