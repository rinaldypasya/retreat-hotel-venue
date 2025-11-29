'use client';

import { VenueWithAmenities } from '@/types';
import { formatPrice, cn } from '@/lib/utils';
import Link from 'next/link';

interface VenueCardProps {
  venue: VenueWithAmenities;
}

export default function VenueCard({ venue }: VenueCardProps) {
  return (
    <article className="card overflow-hidden group animate-fade-in">
      {/* Image Section */}
      <div className="relative h-48 bg-stone-200 overflow-hidden">
        {venue.imageUrl ? (
          <img
            src={venue.imageUrl}
            alt={venue.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
            <svg 
              className="w-16 h-16 text-primary-400" 
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
        
        {/* Rating Badge */}
        {venue.rating && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1 shadow-sm">
            <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold text-stone-900">{venue.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-stone-500 text-sm mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{venue.city}</span>
        </div>

        {/* Name */}
        <h3 className="font-display text-xl font-semibold text-stone-900 mb-2 line-clamp-1">
          {venue.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-stone-600 mb-4 line-clamp-2">
          {venue.description}
        </p>

        {/* Capacity & Amenities */}
        <div className="flex items-center gap-4 text-sm text-stone-500 mb-4">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Up to {venue.capacity}</span>
          </div>
        </div>

        {/* Amenities Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {venue.amenities.slice(0, 3).map((amenity, index) => (
            <span key={index} className="badge-neutral">
              {amenity}
            </span>
          ))}
          {venue.amenities.length > 3 && (
            <span className="badge-neutral">
              +{venue.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Footer: Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <div>
            <span className="text-xl font-semibold text-stone-900">
              {formatPrice(venue.pricePerNight)}
            </span>
            <span className="text-sm text-stone-500"> / night</span>
          </div>
          <Link
            href={`/venues/${venue.id}`}
            className="btn-primary text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
