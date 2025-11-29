import { z } from 'zod';

// Venue filter validation schema
export const venueFiltersSchema = z.object({
  city: z.string().optional(),
  minCapacity: z.coerce.number().int().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

// Booking inquiry creation validation schema
export const createBookingInquirySchema = z.object({
  venueId: z.string().min(1, 'Venue ID is required'),
  companyName: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters'),
  email: z.string()
    .email('Please provide a valid email address'),
  startDate: z.string()
    .refine((date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime()) && parsed >= new Date(new Date().setHours(0, 0, 0, 0));
    }, 'Start date must be a valid date in the future'),
  endDate: z.string()
    .refine((date) => !isNaN(new Date(date).getTime()), 'End date must be a valid date'),
  attendeeCount: z.number()
    .int('Attendee count must be a whole number')
    .positive('Attendee count must be at least 1'),
  message: z.string().max(1000, 'Message must be less than 1000 characters').optional(),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end > start;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

// Type inference from schemas
export type VenueFiltersInput = z.infer<typeof venueFiltersSchema>;
export type CreateBookingInquiryInput = z.infer<typeof createBookingInquirySchema>;
