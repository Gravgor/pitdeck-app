'use client';
import { getSeriesColor } from '@/lib/events';
import { ChevronLeft, ChevronRight, Link, Gift, Flag, MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { useRef } from 'react';
import Image from 'next/image';


export default function EventsSection({ upcomingEvents }: { upcomingEvents: any }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  console.log(upcomingEvents);

  return (
    <div className="relative py-16 sm:py-24 bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">Upcoming Race Events</h2>
          <p className="text-base sm:text-xl text-gray-400">Find exclusive cards at these upcoming races</p>
        </div>

        {/* Mobile Carousel Controls */}
        <div className="relative sm:hidden mb-4">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full backdrop-blur-sm"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full backdrop-blur-sm"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Mobile Carousel / Desktop Grid */}
        <div 
          ref={scrollRef}
          className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {upcomingEvents.map((event: any) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="group relative rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 flex-none w-[80vw] sm:w-auto snap-center"
            >
              <div className={`absolute inset-0 bg-gradient-to-t ${getSeriesColor(event.series)} to-transparent opacity-60 group-hover:opacity-70 transition-opacity`} />
              <Image
                src={`/events/${event.series.toLowerCase()}/${event.circuitId}.jpg`}
                alt={event.name}
                width={400}
                height={300}
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-red-300" />
                    <span className="text-xs sm:text-sm text-red-300">{event.dropMultiplier}x Drop Rate</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Flag className="h-3 w-3 sm:h-4 sm:w-4 text-gray-300" />
                      <span className="text-xs sm:text-sm text-gray-300">{event.series}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">{event.name}</h3>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-300" />
                      <p className="text-xs sm:text-sm text-gray-300">{event.location}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-300" />
                        <p className="text-xs sm:text-sm text-gray-300">
                          {format(event.date, 'MMM d, yyyy')}
                        </p>
                      </div>
                      {event.qualifyingDate && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-300" />
                          <p className="text-xs sm:text-sm text-gray-300">
                            Qualifying: {format(event.qualifyingDate, 'MMM d, HH:mm')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {upcomingEvents.length === 0 && (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-400">
                No upcoming events at the moment.
              </p>
            </div>
          )}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <Link
            href="/events"
            className="inline-flex items-center justify-center px-6 py-2.5 sm:py-3 text-sm font-medium rounded-full text-white border border-white/10 hover:bg-white/10 transition-colors"
          >
            View All Events
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}   