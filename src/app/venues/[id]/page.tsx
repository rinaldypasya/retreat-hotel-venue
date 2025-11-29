'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { VenueWithAmenities } from '@/types';
import { formatPrice } from '@/lib/utils';
import { BookingForm, VenueDetailSkeleton } from '@/components';
import ErrorState from '@/components/ErrorState';

interface VenuePageProps {
  params: {
    id: string;
  };
}

export default function VenueDetailPage({ params }: VenuePageProps) {
  const [venue, setVenue] = useState<VenueWithAmenities | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVenue() {
      try {
        const response = await fetch(`/api/venues/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Venue not found');
          }
          throw new Error('Failed to fetch venue');
        }

        const data = await response.json();
        setVenue(data.data);
      } catch (err) {
        console.error('Error fetching venue:', err);
        setError(err instanceof Error ? err.message : 'Failed to load venue');
      } finally {
        setIsLoading(false);
      }
    }

    fetchVenue();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <VenueDetailSkeleton />
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState
          title={error === 'Venue not found' ? 'Venue Not Found' : 'Error Loading Venue'}
          message={error || 'The venue you\'re looking for could not be found.'}
        />
        <div className="text-center mt-6">
          <Link href="/" className="btn-primary">
            Browse All Venues
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px] bg-stone-200">
        {venue.imageUrl ? (
          <img
            src={venue.imageUrl}
            alt={venue.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
            <svg 
              className="w-24 h-24 text-primary-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
              />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        {/* Back button */}
        <Link
          href="/"
          className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2 text-stone-700 hover:bg-white transition-colors shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back to Venues</span>
        </Link>

        {/* Rating badge */}
        {venue.rating && (
          <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm">
            <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-semibold text-stone-900">{venue.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Venue Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-primary-600 mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">{venue.city}</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-900 mb-4">
                {venue.name}
              </h1>
              <p className="text-stone-600 text-lg leading-relaxed">
                {venue.description}
              </p>
            </div>

            {/* Key Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-stone-50 rounded-xl p-4 text-center">
                <svg className="w-8 h-8 mx-auto text-primary-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-2xl font-bold text-stone-900">{venue.capacity}</p>
                <p className="text-sm text-stone-500">Max Attendees</p>
              </div>
              <div className="bg-stone-50 rounded-xl p-4 text-center">
                <svg className="w-8 h-8 mx-auto text-primary-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-2xl font-bold text-stone-900">{formatPrice(venue.pricePerNight)}</p>
                <p className="text-sm text-stone-500">Per Night</p>
              </div>
              <div className="bg-stone-50 rounded-xl p-4 text-center">
                <svg className="w-8 h-8 mx-auto text-primary-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <p className="text-2xl font-bold text-stone-900">{venue.amenities.length}</p>
                <p className="text-sm text-stone-500">Amenities</p>
              </div>
            </div>

            {/* Address */}
            <div className="bg-stone-50 rounded-xl p-6">
              <h2 className="font-semibold text-stone-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Location
              </h2>
              <p className="text-stone-600">{venue.address}</p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="font-semibold text-stone-900 mb-4 text-lg">
                Amenities & Features
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {venue.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-white border border-stone-200 rounded-lg px-4 py-3"
                  >
                    <svg className="w-5 h-5 text-accent-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-stone-700 text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white border border-stone-200 rounded-xl shadow-lg p-6">
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-bold text-stone-900">
                    {formatPrice(venue.pricePerNight)}
                  </span>
                  <span className="text-stone-500">/ night</span>
                </div>
                
                <div className="border-t border-stone-200 pt-6">
                  <h2 className="font-semibold text-stone-900 mb-4">
                    Request a Booking
                  </h2>
                  <BookingForm venue={venue} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
