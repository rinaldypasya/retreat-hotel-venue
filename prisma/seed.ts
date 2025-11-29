import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample venues data representing diverse retreat locations
const venues = [
  {
    name: 'Mountain Vista Lodge',
    description: 'A stunning mountain retreat with panoramic views, perfect for team building and strategic planning sessions. Features modern conference facilities and outdoor adventure activities.',
    city: 'Aspen',
    address: '1250 Mountain View Road, Aspen, CO 81611',
    capacity: 50,
    pricePerNight: 850,
    amenities: JSON.stringify(['WiFi', 'Conference Room', 'Catering', 'Outdoor Terrace', 'Hiking Trails', 'Spa', 'Fireplace Lounge']),
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    rating: 4.8,
  },
  {
    name: 'Coastal Breeze Resort',
    description: 'A beachfront property offering a relaxed atmosphere for creative workshops and team retreats. Enjoy ocean views from every meeting room.',
    city: 'San Diego',
    address: '4500 Pacific Coast Highway, San Diego, CA 92109',
    capacity: 80,
    pricePerNight: 1200,
    amenities: JSON.stringify(['WiFi', 'Beachfront', 'Conference Center', 'Restaurant', 'Pool', 'Team Sports', 'Sunset Deck']),
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    rating: 4.9,
  },
  {
    name: 'Urban Innovation Hub',
    description: 'A sleek downtown venue designed for tech companies and startups. State-of-the-art AV equipment and flexible workspace configurations.',
    city: 'Austin',
    address: '200 Congress Avenue, Austin, TX 78701',
    capacity: 100,
    pricePerNight: 650,
    amenities: JSON.stringify(['High-Speed WiFi', 'AV Equipment', 'Breakout Rooms', 'Rooftop Bar', 'Catering', 'Parking']),
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    rating: 4.6,
  },
  {
    name: 'Vineyard Estate',
    description: 'An elegant wine country estate perfect for executive retreats and company celebrations. Includes wine tasting experiences and gourmet dining.',
    city: 'Napa',
    address: '8800 Silverado Trail, Napa, CA 94558',
    capacity: 40,
    pricePerNight: 1500,
    amenities: JSON.stringify(['WiFi', 'Wine Cellar', 'Private Chef', 'Garden', 'Meeting Rooms', 'Vineyard Tours', 'Luxury Suites']),
    imageUrl: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800',
    rating: 4.9,
  },
  {
    name: 'Forest Retreat Center',
    description: 'A peaceful woodland sanctuary ideal for mindfulness retreats and focused work sessions. Disconnect from distractions and reconnect with your team.',
    city: 'Portland',
    address: '15000 Forest Park Lane, Portland, OR 97231',
    capacity: 35,
    pricePerNight: 550,
    amenities: JSON.stringify(['WiFi', 'Meditation Room', 'Yoga Studio', 'Nature Trails', 'Organic Catering', 'Bonfire Pit']),
    imageUrl: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800',
    rating: 4.7,
  },
  {
    name: 'Desert Oasis Resort',
    description: 'A luxurious desert escape with stunning sunset views and world-class amenities. Perfect for incentive trips and leadership summits.',
    city: 'Scottsdale',
    address: '7200 E Camelback Road, Scottsdale, AZ 85251',
    capacity: 120,
    pricePerNight: 950,
    amenities: JSON.stringify(['WiFi', 'Golf Course', 'Spa', 'Multiple Pools', 'Conference Facilities', 'Fine Dining', 'Desert Tours']),
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
    rating: 4.8,
  },
  {
    name: 'Historic Manor House',
    description: 'A beautifully restored 19th-century manor offering old-world charm with modern conveniences. Ideal for board meetings and exclusive events.',
    city: 'Charleston',
    address: '350 Meeting Street, Charleston, SC 29403',
    capacity: 30,
    pricePerNight: 1100,
    amenities: JSON.stringify(['WiFi', 'Library', 'Garden Courtyard', 'Private Dining', 'Antique Furnishings', 'Concierge Service']),
    imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    rating: 4.9,
  },
  {
    name: 'Lakeside Conference Center',
    description: 'A modern facility on the shores of a pristine lake. Combine productive meetings with water activities and team bonding experiences.',
    city: 'Lake Tahoe',
    address: '6500 Lakefront Drive, Lake Tahoe, CA 96150',
    capacity: 75,
    pricePerNight: 780,
    amenities: JSON.stringify(['WiFi', 'Lake Access', 'Kayaks', 'Conference Rooms', 'Restaurant', 'Mountain Biking', 'Ski Access']),
    imageUrl: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800',
    rating: 4.7,
  },
  {
    name: 'Sky Tower Business Hotel',
    description: 'A contemporary high-rise venue in the heart of downtown Manhattan. Perfect for client meetings and corporate events with stunning city views.',
    city: 'New York',
    address: '200 Park Avenue, New York, NY 10166',
    capacity: 200,
    pricePerNight: 2000,
    amenities: JSON.stringify(['High-Speed WiFi', 'Business Center', 'Multiple Event Spaces', 'Fine Dining', 'Gym', 'Concierge', 'Valet Parking']),
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    rating: 4.5,
  },
  {
    name: 'Tropical Island Retreat',
    description: 'An exclusive beachfront property offering the ultimate escape for team rewards and strategic planning in paradise.',
    city: 'Miami',
    address: '1800 Collins Avenue, Miami Beach, FL 33139',
    capacity: 60,
    pricePerNight: 1350,
    amenities: JSON.stringify(['WiFi', 'Private Beach', 'Water Sports', 'Spa', 'Multiple Restaurants', 'Tennis Courts', 'Nightclub']),
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    rating: 4.8,
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.bookingInquiry.deleteMany();
  await prisma.venue.deleteMany();
  console.log('✓ Cleared existing data');

  // Create venues
  for (const venue of venues) {
    await prisma.venue.create({
      data: venue,
    });
  }
  console.log(`✓ Created ${venues.length} venues`);

  // Create a sample booking inquiry for demonstration
  const firstVenue = await prisma.venue.findFirst();
  if (firstVenue) {
    await prisma.bookingInquiry.create({
      data: {
        venueId: firstVenue.id,
        companyName: 'Demo Company Inc.',
        email: 'team@democompany.com',
        startDate: new Date('2024-03-15'),
        endDate: new Date('2024-03-18'),
        attendeeCount: 25,
        message: 'Looking forward to our annual team retreat!',
        status: 'pending',
      },
    });
    console.log('✓ Created sample booking inquiry');
  }

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
