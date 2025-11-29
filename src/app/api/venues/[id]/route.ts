import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { parseVenueAmenities } from '@/lib/utils';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/venues/[id]
 * Returns a single venue by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const venue = await prisma.venue.findUnique({
      where: { id },
    });

    if (!venue) {
      return NextResponse.json(
        { error: 'Venue not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: parseVenueAmenities(venue),
    });
  } catch (error) {
    console.error('Error fetching venue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch venue. Please try again later.' },
      { status: 500 }
    );
  }
}
