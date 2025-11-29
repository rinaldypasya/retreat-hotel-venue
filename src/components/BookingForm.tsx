'use client';

import { useState, FormEvent } from 'react';
import { VenueWithAmenities, CreateBookingInquiryInput } from '@/types';
import { formatPrice, getTodayString, getFutureDateString, calculateNights, cn } from '@/lib/utils';

interface BookingFormProps {
  venue: VenueWithAmenities;
  onSuccess?: () => void;
}

interface FormErrors {
  [key: string]: string[];
}

export default function BookingForm({ venue, onSuccess }: BookingFormProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    startDate: getFutureDateString(7), // Default to 1 week from now
    endDate: getFutureDateString(10), // Default to 10 days from now
    attendeeCount: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    setGeneralError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setGeneralError(null);

    try {
      const payload: CreateBookingInquiryInput = {
        venueId: venue.id,
        companyName: formData.companyName,
        email: formData.email,
        startDate: formData.startDate,
        endDate: formData.endDate,
        attendeeCount: parseInt(formData.attendeeCount),
        message: formData.message || undefined,
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          setErrors(data.details);
        } else {
          setGeneralError(data.error || 'Failed to submit booking inquiry');
        }
        return;
      }

      setSuccess(true);
      onSuccess?.();
    } catch (error) {
      console.error('Booking error:', error);
      setGeneralError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate estimated total
  const nights = calculateNights(formData.startDate, formData.endDate);
  const estimatedTotal = nights > 0 ? nights * venue.pricePerNight : 0;

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center animate-fade-in">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          Inquiry Submitted!
        </h3>
        <p className="text-green-700 mb-4">
          Thank you for your interest in {venue.name}. We&apos;ll be in touch within 24-48 hours.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setFormData({
              companyName: '',
              email: '',
              startDate: getFutureDateString(7),
              endDate: getFutureDateString(10),
              attendeeCount: '',
              message: '',
            });
          }}
          className="btn-secondary"
        >
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* General Error */}
      {generalError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm animate-fade-in">
          {generalError}
        </div>
      )}

      {/* Company Name */}
      <div>
        <label htmlFor="companyName" className="label">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className={cn('input', errors.companyName && 'border-red-500 focus:border-red-500 focus:ring-red-500/20')}
          placeholder="Your company name"
          required
          disabled={isSubmitting}
        />
        {errors.companyName && (
          <p className="mt-1 text-sm text-red-600">{errors.companyName[0]}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="label">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={cn('input', errors.email && 'border-red-500 focus:border-red-500 focus:ring-red-500/20')}
          placeholder="team@company.com"
          required
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
        )}
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="label">
            Check-in Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            min={getTodayString()}
            className={cn('input', errors.startDate && 'border-red-500 focus:border-red-500 focus:ring-red-500/20')}
            required
            disabled={isSubmitting}
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="endDate" className="label">
            Check-out Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            min={formData.startDate || getTodayString()}
            className={cn('input', errors.endDate && 'border-red-500 focus:border-red-500 focus:ring-red-500/20')}
            required
            disabled={isSubmitting}
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600">{errors.endDate[0]}</p>
          )}
        </div>
      </div>
      {errors.dates && (
        <p className="text-sm text-red-600">{errors.dates[0]}</p>
      )}

      {/* Attendee Count */}
      <div>
        <label htmlFor="attendeeCount" className="label">
          Number of Attendees <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="attendeeCount"
          name="attendeeCount"
          value={formData.attendeeCount}
          onChange={handleChange}
          min="1"
          max={venue.capacity}
          className={cn('input', errors.attendeeCount && 'border-red-500 focus:border-red-500 focus:ring-red-500/20')}
          placeholder={`1 - ${venue.capacity} attendees`}
          required
          disabled={isSubmitting}
        />
        <p className="mt-1 text-xs text-stone-500">
          Maximum capacity: {venue.capacity} attendees
        </p>
        {errors.attendeeCount && (
          <p className="mt-1 text-sm text-red-600">{errors.attendeeCount[0]}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="label">
          Additional Requirements <span className="text-stone-400">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={3}
          className={cn('input resize-none', errors.message && 'border-red-500 focus:border-red-500 focus:ring-red-500/20')}
          placeholder="Any special requests or requirements..."
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message[0]}</p>
        )}
      </div>

      {/* Price Estimate */}
      {nights > 0 && (
        <div className="bg-stone-50 rounded-lg p-4 border border-stone-200">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-stone-600">
              {formatPrice(venue.pricePerNight)} × {nights} night{nights > 1 ? 's' : ''}
            </span>
            <span className="text-stone-900">{formatPrice(estimatedTotal)}</span>
          </div>
          <div className="flex justify-between items-center font-semibold pt-2 border-t border-stone-200">
            <span className="text-stone-900">Estimated Total</span>
            <span className="text-lg text-primary-700">{formatPrice(estimatedTotal)}</span>
          </div>
          <p className="text-xs text-stone-500 mt-2">
            Final pricing will be confirmed after reviewing your inquiry.
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'btn-primary w-full py-3 text-base',
          isSubmitting && 'opacity-75 cursor-wait'
        )}
      >
        {isSubmitting ? (
          <>
            <span className="spinner mr-2" />
            Submitting...
          </>
        ) : (
          'Submit Booking Inquiry'
        )}
      </button>

      <p className="text-xs text-center text-stone-500">
        By submitting, you agree to our terms of service and privacy policy.
      </p>
    </form>
  );
}
