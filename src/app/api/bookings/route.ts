import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createBookingInquirySchema } from '@/lib/validations';

/**
 * POST /api/bookings
 * Creates a new booking inquiry
 * 
 * Request Body:
 * - venueId: string (required) - The ID of the venue
 * - companyName: string (required) - Name of the company making the inquiry
 * - email: string (required) - Contact email address
 * - startDate: string (required) - ISO date string for start of booking
 * - endDate: string (required) - ISO date string for end of booking
 * - attendeeCount: number (required) - Number of attendees
 * - message: string (optional) - Additional message or requirements
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input
    const validationResult = createBookingInquirySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { venueId, companyName, email, startDate, endDate, attendeeCount, message } = 
      validationResult.data;

    // Check if venue exists
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
    });

    if (!venue) {
      return NextResponse.json(
        { error: 'Venue not found' },
        { status: 404 }
      );
    }

    // Validate attendee count against venue capacity
    if (attendeeCount > venue.capacity) {
      return NextResponse.json(
        {
          error: `Attendee count (${attendeeCount}) exceeds venue capacity (${venue.capacity})`,
          details: {
            attendeeCount: [`Maximum capacity for this venue is ${venue.capacity} attendees`],
          },
        },
        { status: 400 }
      );
    }

    // BONUS: Check for overlapping bookings (simple availability check)
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);

    const overlappingBookings = await prisma.bookingInquiry.findMany({
      where: {
        venueId,
        status: { not: 'cancelled' },
        OR: [
          {
            // New booking starts during existing booking
            startDate: { lte: startDateTime },
            endDate: { gt: startDateTime },
          },
          {
            // New booking ends during existing booking
            startDate: { lt: endDateTime },
            endDate: { gte: endDateTime },
          },
          {
            // New booking completely contains existing booking
            startDate: { gte: startDateTime },
            endDate: { lte: endDateTime },
          },
        ],
      },
    });

    if (overlappingBookings.length > 0) {
      return NextResponse.json(
        {
          error: 'The venue is not available for the selected dates',
          details: {
            dates: ['There is already a booking inquiry for these dates. Please choose different dates.'],
          },
        },
        { status: 409 } // Conflict
      );
    }

    // Create the booking inquiry
    const bookingInquiry = await prisma.bookingInquiry.create({
      data: {
        venueId,
        companyName,
        email,
        startDate: startDateTime,
        endDate: endDateTime,
        attendeeCount,
        message: message || null,
        status: 'pending',
      },
      include: {
        venue: true,
      },
    });

    return NextResponse.json(
      {
        data: bookingInquiry,
        message: 'Booking inquiry submitted successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating booking inquiry:', error);

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create booking inquiry. Please try again later.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bookings
 * Returns all booking inquiries (for admin purposes)
 */
export async function GET() {
  try {
    const bookings = await prisma.bookingInquiry.findMany({
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ data: bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings. Please try again later.' },
      { status: 500 }
    );
  }
}
