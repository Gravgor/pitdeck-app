'use client';

import { getUpcomingEvents, getSeriesColor, type RaceEvent, getF1Races } from '@/lib/events';
import { format } from 'date-fns';
import { MapPin, Calendar, Clock, Gift, Search, Flag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from "@/lib/utils";

// Move this to a separate component for better organization
const EventCard = ({ event }: { event: RaceEvent }) => {
  const seriesColor = getSeriesColor(event.series);
  
  return (
    <Link
      href={`/events/${event.id}`}
      className="group relative rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300"
    >
      {/* Multiple gradient layers for better contrast */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent",
        "after:absolute after:inset-0",
        `after:bg-gradient-to-t after:${seriesColor} after:opacity-60`
      )} />
      
      <Image
        src={event.imageUrl}
        alt={event.name}
        width={400}
        height={300}
        className="w-full aspect-[4/3] object-cover"
      />
      
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        {/* Top badge */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 rounded-full text-xs font-medium 
                         bg-black/60 backdrop-blur-sm text-white 
                         border border-white/20 shadow-lg">
            {new Date(event.date) > new Date() ? 'Upcoming' : 'Live'}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-3 relative z-10">
          {/* Drop rate badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 
                         rounded-full bg-black/40 backdrop-blur-sm 
                         border border-white/20">
            <Gift className="h-4 w-4 text-red-300" />
            <span className="text-sm font-medium text-red-300">
              {event.dropMultiplier}x Drop Rate
            </span>
          </div>

          {/* Main content */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-white/80" />
              <span className="text-sm font-medium text-white/80">
                {event.series}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white drop-shadow-md">
              {event.name}
            </h3>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-white/70" />
                <p className="text-sm text-white/70">
                  {event.location}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-white/70" />
                  <p className="text-sm text-white/70">
                    {format(event.date, 'MMMM d, yyyy')}
                  </p>
                </div>

                {event.qualifyingDate && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-white/70" />
                    <p className="text-sm text-white/70">
                      Qualifying: {format(event.qualifyingDate, 'MMM d, HH:mm')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const ITEMS_PER_PAGE = 9;
const SERIES_OPTIONS = ['All', 'F1', 'WEC', 'INDYCAR', 'NASCAR', 'FORMULA_E'] as const;

export default function EventsPage() {
  // State
  const [events, setEvents] = useState<RaceEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<typeof SERIES_OPTIONS[number]>('All');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Debounce search to prevent too many filter operations
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const f1Events = await getF1Races();
        // Add other series events here if needed
        const otherEvents = [
          {
            id: 'wec-lemans',
            series: 'WEC',
            name: '24 Hours of Le Mans',
            circuit: 'Circuit de la Sarthe',
            date: new Date('2024-06-15T14:00:00Z'),
            location: 'Le Mans, France',
            imageUrl: '/events/wec/lemans.jpg',
            dropMultiplier: 3,
          },
          // ... other events ...
        ];
        
        // @ts-ignore
        setEvents([...f1Events, ...otherEvents]);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on search and series
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         event.location.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesSeries = selectedSeries === 'All' || event.series === selectedSeries;
    return matchesSearch && matchesSeries;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedSeries]);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/50 via-blue-600/30 to-slate-900/50" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-white mb-4">Racing Events</h1>
          <p className="text-xl text-gray-400">
            Find exclusive cards and boosted drop rates at racing events worldwide
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Series Filter */}
            <div className="flex flex-wrap gap-2">
              {SERIES_OPTIONS.map((series) => (
                <button
                  key={series}
                  onClick={() => setSelectedSeries(series)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium 
                    transition-colors focus:outline-none focus:ring-2 focus:ring-red-500
                    ${selectedSeries === series 
                      ? 'bg-red-600 text-white' 
                      : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                    }`}
                >
                  {series}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {/* Empty State */}
            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No events found</h3>
                <p className="text-gray-400">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white/5 text-white disabled:opacity-50 
                           hover:bg-white/10 transition-colors"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center
                        ${currentPage === i + 1 
                          ? 'bg-red-600 text-white' 
                          : 'bg-white/5 text-white hover:bg-white/10'
                        } transition-colors`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-white/5 text-white disabled:opacity-50 
                           hover:bg-white/10 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

