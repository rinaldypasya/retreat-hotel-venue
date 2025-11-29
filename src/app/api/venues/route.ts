import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { venueFiltersSchema } from '@/lib/validations';
import { parseVenueAmenities } from '@/lib/utils';
import { PaginatedResponse, VenueWithAmenities } from '@/types';

/**
 * GET /api/venues
 * Returns a paginated list of venues with optional filtering
 * 
 * Query Parameters:
 * - city: Filter by city name (case-insensitive partial match)
 * - minCapacity: Filter venues with capacity >= this value
 * - maxPrice: Filter venues with pricePerNight <= this value
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10, max: 50)
 */
export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const validationResult = venueFiltersSchema.safeParse(searchParams);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid query parameters',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { city, minCapacity, maxPrice, page, limit } = validationResult.data;

    // Build the where clause for filtering
    // Note: SQLite doesn't support 'mode: insensitive', so we use LOWER() for case-insensitive matching
    // When switching to PostgreSQL, you can use { contains: city, mode: 'insensitive' }
    const where: {
      city?: { contains: string };
      capacity?: { gte: number };
      pricePerNight?: { lte: number };
    } = {};

    if (city) {
      // For SQLite: case-insensitive partial match using contains
      // SQLite's LIKE is case-insensitive by default for ASCII characters
      where.city = {
        contains: city,
      };
    }

    if (minCapacity) {
      where.capacity = {
        gte: minCapacity,
      };
    }

    if (maxPrice) {
      where.pricePerNight = {
        lte: maxPrice,
      };
    }

    // Execute count and data queries in parallel for efficiency
    const [total, venues] = await Promise.all([
      prisma.venue.count({ where }),
      prisma.venue.findMany({
        where,
        orderBy: [
          { rating: 'desc' }, // Higher rated venues first
          { name: 'asc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    // Transform venues to include parsed amenities
    const venuesWithAmenities: VenueWithAmenities[] = venues.map(parseVenueAmenities);

    const response: PaginatedResponse<VenueWithAmenities> = {
      data: venuesWithAmenities,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching venues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch venues. Please try again later.' },
      { status: 500 }
    );
  }
}