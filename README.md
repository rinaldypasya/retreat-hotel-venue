# Hotel Venue API & Dashboard

A full-stack venue management system for team offsites and corporate retreats. Built with Next.js, TypeScript, Prisma, and PostgreSQL.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.22-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-teal)

## Features

### Backend (API)

- **Venues Endpoint** (`GET /api/venues`)
  - Filter by city (case-insensitive partial match)
  - Filter by minimum capacity
  - Filter by maximum price per night
  - Pagination support with configurable page size

- **Single Venue** (`GET /api/venues/[id]`)
  - Get detailed venue information

- **Booking Inquiries** (`POST /api/bookings`)
  - Create booking inquiries with validation
  - Validates attendee count against venue capacity
  - **Bonus**: Availability check to prevent double-booking

- **Cities Endpoint** (`GET /api/cities`)
  - Get unique list of cities for filter dropdown

### Database

- Prisma ORM with PostgreSQL (recommended for Vercel deployment)
- Well-designed schema with proper relationships and indexes
- Database seeded with 10 sample venues

### Frontend

- Responsive venue search/listing page
- Filter panel with city, capacity, and price filters
- Pagination with smooth navigation
- Venue detail page with full information
- Booking inquiry form with real-time validation
- Loading states and error handling
- Clean, accessible UI design

## Project Structure

```
hotel-venue-app/
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seed script
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── bookings/route.ts   # Booking inquiries API
│   │   │   ├── cities/route.ts     # Cities list API
│   │   │   └── venues/
│   │   │       ├── route.ts        # Venues list API
│   │   │       └── [id]/route.ts   # Single venue API
│   │   ├── venues/
│   │   │   └── [id]/page.tsx       # Venue detail page
│   │   ├── globals.css             # Global styles
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Home page
│   ├── components/
│   │   ├── BookingForm.tsx         # Booking inquiry form
│   │   ├── ErrorState.tsx          # Error/empty states
│   │   ├── LoadingState.tsx        # Loading skeletons
│   │   ├── Pagination.tsx          # Pagination controls
│   │   ├── VenueCard.tsx           # Venue card component
│   │   ├── VenueFilters.tsx        # Filter panel
│   │   └── index.ts                # Component exports
│   ├── lib/
│   │   ├── prisma.ts               # Prisma client singleton
│   │   ├── utils.ts                # Utility functions
│   │   └── validations.ts          # Zod validation schemas
│   └── types/
│       └── index.ts                # TypeScript types
├── .env.example                    # Environment variables template
├── next.config.js                  # Next.js configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json
```

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (or use a cloud provider like Vercel Postgres, Neon, or Supabase)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hotel-venue-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your database**
   
   Choose one of these options:
   
   **Option A: Vercel Postgres (recommended for deployment)**
   - Create a project on Vercel
   - Add Vercel Postgres from the Storage tab
   - Copy the `DATABASE_URL` from the environment variables

   **Option B: Neon (free tier available)**
   - Sign up at [neon.tech](https://neon.tech)
   - Create a new project
   - Copy the connection string

   **Option C: Local PostgreSQL**
   - Install PostgreSQL locally
   - Create a database: `createdb hotel_venue_db`
   - Use: `postgresql://user:password@localhost:5432/hotel_venue_db`

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your `DATABASE_URL`.

5. **Initialize the database**
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push schema to database
   npm run db:push

   # Seed the database with sample venues
   npm run db:seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio |

## API Documentation

### GET /api/venues

Returns a paginated list of venues with optional filtering.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `city` | string | Filter by city (case-insensitive partial match) |
| `minCapacity` | number | Filter venues with capacity >= value |
| `maxPrice` | number | Filter venues with price <= value |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10, max: 50) |

**Example Response:**
```json
{
  "data": [
    {
      "id": "clx...",
      "name": "Mountain Vista Lodge",
      "city": "Aspen",
      "capacity": 50,
      "pricePerNight": 850,
      "amenities": ["WiFi", "Conference Room", "Spa"],
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 10,
    "totalPages": 1,
    "hasMore": false
  }
}
```

### POST /api/bookings

Creates a new booking inquiry.

**Request Body:**
```json
{
  "venueId": "clx...",
  "companyName": "Acme Corp",
  "email": "team@acme.com",
  "startDate": "2024-03-15",
  "endDate": "2024-03-18",
  "attendeeCount": 25,
  "message": "Looking forward to our retreat!"
}
```

**Validation:**
- Validates all required fields
- Ensures attendeeCount doesn't exceed venue capacity
- Validates date range (end after start, start in future)
- Checks for date availability (no double-booking)

## Approach & Architecture Decisions

### Tech Stack Choices

1. **Next.js 14 with App Router**: Provides a unified framework for both frontend and API, with excellent TypeScript support and built-in optimizations.

2. **Prisma ORM**: Type-safe database access with excellent DX. Using SQLite for simplicity but the schema is PostgreSQL-compatible.

3. **Zod Validation**: Runtime validation that integrates well with TypeScript for type-safe API input validation.

4. **PostgreSQL**: Production-ready database that works seamlessly with Vercel's serverless architecture. Supports advanced features like case-insensitive search.

### Code Quality

- **Separation of Concerns**: API routes, components, utilities, and types are clearly separated
- **Type Safety**: Full TypeScript coverage with strict mode enabled
- **Input Validation**: Server-side validation with descriptive error messages
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Reusable Components**: Modular components with clear interfaces

### Database Design

- Proper indexing on frequently queried fields (city, capacity, price)
- Cascade delete for related records
- Status field for booking inquiry workflow
- Timestamps for auditing

### UI/UX Considerations

- Loading skeletons for better perceived performance
- Responsive design for all screen sizes
- Clear error states with retry options
- Form validation with inline feedback
- Accessible color contrast and focus states

## What I'd Improve With More Time

1. **Testing**
   - Unit tests for utility functions
   - Integration tests for API endpoints
   - E2E tests with Playwright/Cypress

2. **Features**
   - User authentication system
   - Admin dashboard for managing venues and bookings
   - Image upload for venues
   - Email notifications for booking confirmations
   - Calendar view for availability

3. **Performance**
   - Image optimization with Next.js Image
   - API response caching
   - React Query for client-side caching
   - Database query optimization

4. **DevOps**
   - Docker configuration
   - CI/CD pipeline
   - Monitoring and logging
   - Rate limiting

5. **Code Quality**
   - More comprehensive error types
   - API versioning
   - OpenAPI/Swagger documentation
   - Storybook for component documentation

## Deployment on Vercel

1. **Push your code to GitHub**

2. **Create a Vercel project**
   - Import your repository at [vercel.com/new](https://vercel.com/new)

3. **Add a PostgreSQL database**
   - Go to your project's Storage tab
   - Click "Create Database" → "Postgres"
   - Vercel will automatically add the `DATABASE_URL` environment variable

4. **Deploy**
   - Vercel will automatically deploy on push
   - After deployment, run the seed script (optional):
     ```bash
     vercel env pull .env.local  # Pull env vars locally
     npm run db:push             # Push schema
     npm run db:seed             # Seed data
     ```

### Alternative: Using Neon or Supabase

1. Create a database on [Neon](https://neon.tech) or [Supabase](https://supabase.com)
2. Copy the connection string
3. Add `DATABASE_URL` to your Vercel project's environment variables
4. Deploy!

---

Built with ❤️ for the Retreat take-home assignment.
