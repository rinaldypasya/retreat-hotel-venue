// Type definitions for the Hotel Venue API

// Venue type matching Prisma model
export interface Venue {
  id: string;
  name: string;
  description: string;
  city: string;
  address: string;
  capacity: number;
  pricePerNight: number;
  amenities: string; // JSON string
  imageUrl: string | null;
  rating: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// Parsed venue with amenities as array
export interface VenueWithAmenities extends Omit<Venue, 'amenities'> {
  amenities: string[];
}

// Booking inquiry type matching Prisma model
export interface BookingInquiry {
  id: string;
  venueId: string;
  companyName: string;
  email: string;
  startDate: Date;
  endDate: Date;
  attendeeCount: number;
  message: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  venue?: Venue;
}

// API request/response types
export interface VenueFilters {
  city?: string;
  minCapacity?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface CreateBookingInquiryInput {
  venueId: string;
  companyName: string;
  email: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  attendeeCount: number;
  message?: string;
}

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}

export interface ApiSuccess<T> {
  data: T;
  message?: string;
}
