import { getUpcomingEvents } from '@/lib/events';
import { format } from 'date-fns';
import { MapPin, Calendar, Clock, Gift, Trophy, Star, Flag, Users } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Card } from '@/components/cards/Card';
import { prisma } from '@/lib/prisma';

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const events = await getUpcomingEvents(10); 
  const {id} = await params;
  const event = events.find(e => e.id === id);

  if (!event) {
    notFound();
  }

  //create unique event id
  const uniqueEventId = `${event.series}-${event.name}-${event.date.getFullYear()}`;
  console.log(uniqueEventId);

  // Fetch exclusive cards for this event, show only legendary rarity 
  const exclusiveCards = await prisma.card.findMany({
    where: {
      eventId: uniqueEventId,
      isExclusive: true,
      rarity: 'LEGENDARY',
    },
    distinct: ['name'],
    take: 3,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px]">
        <Image
          src={event.imageUrl}
          alt={event.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
            <div className="flex items-center gap-2 mb-4">
              <Flag className="h-5 w-5 text-gray-300" />
              <span className="text-sm text-gray-300">{event.series}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{event.name}</h1>
            <div className="flex flex-wrap gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{format(event.date, 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-red-400" />
                <span className="text-red-400">{event.dropMultiplier}x Drop Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Schedule */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Event Schedule</h2>
              <div className="space-y-4">
                {event.practices?.map((practice) => (
                  <div
                    key={practice.name}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5"
                  >
                    <span className="text-gray-300">{practice.name}</span>
                    <span className="text-gray-400">
                      {format(practice.date, 'MMM d, HH:mm')}
                    </span>
                  </div>
                ))}
                {event.qualifyingDate && (
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <span className="text-gray-300">Qualifying</span>
                    <span className="text-gray-400">
                      {format(event.qualifyingDate, 'MMM d, HH:mm')}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                  <span className="text-gray-300">Race</span>
                  <span className="text-gray-400">
                    {format(event.date, 'MMM d, HH:mm')}
                  </span>
                </div>
              </div>
            </section>

            {/* Exclusive Cards */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Exclusive Event Cards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {exclusiveCards.map((card) => (
                  <Card key={card.id} {...card} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Event Stats */}
            <div className="rounded-xl bg-white/5 p-6 space-y-6">
              <h3 className="text-lg font-semibold text-white">Event Bonuses</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-red-400" />
                    <span className="text-gray-300">Drop Rate</span>
                  </div>
                  <span className="text-red-400">{event.dropMultiplier}x</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="text-gray-300">Exclusive Cards</span>
                  </div>
                  <span className="text-yellow-400">{exclusiveCards.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-purple-400" />
                    <span className="text-gray-300">Special Achievements</span>
                  </div>
                  <span className="text-purple-400">3</span>
                </div>
              </div>
            </div>

            {/* Location Map */}
            {event.coordinates && (
              <div className="rounded-xl overflow-hidden h-64 relative">
                <Image
                  src={`https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/pin-s+ff0000(${event.coordinates.long},${event.coordinates.lat})/${event.coordinates.long},${event.coordinates.lat},12,0/800x400@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`}
                  alt="Event location"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 