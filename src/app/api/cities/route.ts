import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

/**
 * GET /api/cities
 * Returns a list of unique cities from all venues
 * Used to populate the city filter dropdown
 */
export async function GET() {
  try {
    const venues = await prisma.venue.findMany({
      select: {
        city: true,
      },
      distinct: ['city'],
      orderBy: {
        city: 'asc',
      },
    });

    const cities = venues.map((v: { city: string }) => v.city);

    return NextResponse.json({ data: cities });
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    );
  }
}
