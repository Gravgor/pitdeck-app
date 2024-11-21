import { z } from 'zod';

export interface RaceEvent {
  id: string;
  series: 'F1' | 'WEC' | 'INDYCAR' | 'NASCAR' | 'FORMULA_E';
  name: string;
  circuit: string;
  circuitId: string;
  date: Date;
  location: string;
  imageUrl: string;
  dropMultiplier: number;
  qualifyingDate?: Date;
  practices?: { date: Date; name: string }[];
  coordinates?: { lat: number; long: number };
}

const SERIES_COLORS = {
  F1: 'from-red-600/40',
  WEC: 'from-blue-600/40',
  INDYCAR: 'from-green-600/40',
  NASCAR: 'from-yellow-600/40',
  FORMULA_E: 'from-purple-600/40',
} as const;

// Schema for F1 API response validation
const F1ResponseSchema = z.object({
  MRData: z.object({
    RaceTable: z.object({
      Races: z.array(z.object({
        round: z.string(),
        raceName: z.string(),
        Circuit: z.object({
          circuitId: z.string(),
          circuitName: z.string(),
          Location: z.object({
            lat: z.string(),
            long: z.string(),
            locality: z.string(),
            country: z.string(),
          }),
        }),
        date: z.string(),
        time: z.string(),
        FirstPractice: z.object({
          date: z.string(),
          time: z.string(),
        }).optional(),
        SecondPractice: z.object({
          date: z.string(),
          time: z.string(),
        }).optional(),
        ThirdPractice: z.object({
          date: z.string(),
          time: z.string(),
        }).optional(),
        Qualifying: z.object({
          date: z.string(),
          time: z.string(),
        }),
        Sprint: z.object({
          date: z.string(),
          time: z.string(),
        }).optional(),
        SprintQualifying: z.object({
          date: z.string(),
          time: z.string(),
        }).optional(),
      })),
    }),
  }),
});

export async function getUpcomingEvents(limit: number = 3): Promise<RaceEvent[]> {
  try {
    // Get current date at start of day for accurate comparison
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Fetch F1 events from Ergast API
    const response = await fetch('https://api.jolpi.ca/ergast/f1/2024/races/?format=json');
    const f1Data = await response.json();
    
    // Validate F1 API response
    const parsedF1Data = F1ResponseSchema.parse(f1Data);
    
    const f1Events: RaceEvent[] = parsedF1Data.MRData.RaceTable.Races
      .filter(race => {
        const raceDate = new Date(race.date);
        return raceDate >= now;
      })
      .map(race => ({
        id: `f1-${race.Circuit.circuitName.toLowerCase().replace(/\s+/g, '-')}`,
        series: 'F1',
        name: race.raceName,
        circuit: race.Circuit.circuitName,
        circuitId: race.Circuit.circuitId,
        date: new Date(`${race.date}T${race.time}`),
        location: `${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`,
        imageUrl: `/events/f1/${race.Circuit.circuitId}.jpg`,
        dropMultiplier: 3,
        qualifyingDate: new Date(`${race.Qualifying.date}T${race.Qualifying.time}`),
        coordinates: {
          lat: parseFloat(race.Circuit.Location.lat),
          long: parseFloat(race.Circuit.Location.long),
        },
        practices: [
          ...(race.FirstPractice ? [{
            name: 'Practice 1',
            date: new Date(`${race.FirstPractice.date}T${race.FirstPractice.time}`),
          }] : []),
          ...(race.SecondPractice ? [{
            name: 'Practice 2',
            date: new Date(`${race.SecondPractice.date}T${race.SecondPractice.time}`),
          }] : []),
          ...(race.ThirdPractice ? [{
            name: 'Practice 3',
            date: new Date(`${race.ThirdPractice.date}T${race.ThirdPractice.time}`),
          }] : []),
        ],
        sprint: race.Sprint ? {
          date: new Date(`${race.Sprint.date}T${race.Sprint.time}`),
          qualifying: race.SprintQualifying 
            ? new Date(`${race.SprintQualifying.date}T${race.SprintQualifying.time}`)
            : undefined,
        } : undefined,
      }));

    // Add other series events
    const otherEvents: RaceEvent[] = [
      {
        id: 'wec-lemans',
        series: 'WEC',
        name: '24 Hours of Le Mans',
        circuit: 'Circuit de la Sarthe',
        circuitId: 'lemans',
        date: new Date('2024-06-15T14:00:00Z'),
        location: 'Le Mans, France',
        imageUrl: '/events/wec/lemans.jpg',
        dropMultiplier: 3,
      },
      {
        id: 'indycar-indy500',
        series: 'INDYCAR',
        name: 'Indianapolis 500',
        circuit: 'Indianapolis Motor Speedway',
        circuitId: 'indy500',
        date: new Date('2024-05-26T16:00:00Z'),
        location: 'Indianapolis, USA',
        imageUrl: '/events/indycar/indy500.jpg',
        dropMultiplier: 3,
      },
    ];

    const allEvents = [...f1Events, ...otherEvents];

    // Sort by date and return nearest events
    return allEvents
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, limit);

  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export function getSeriesColor(series: RaceEvent['series']) {
  return SERIES_COLORS[series];
}

// Helper function to get event status
export function getEventStatus(event: RaceEvent): 'upcoming' | 'live' | 'completed' {
  const now = new Date();
  if (event.date > now) return 'upcoming';
  if (event.date <= now && now <= new Date(event.date.getTime() + 4 * 60 * 60 * 1000)) return 'live';
  return 'completed';
}

// Add this function to fetch F1 races
export async function getF1Races(): Promise<RaceEvent[]> {
  try {
    const response = await fetch('https://api.jolpi.ca/ergast/f1/2024/races/?format=json');
    const data = await response.json();
    
    // Get current date at start of day for accurate comparison
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return data.MRData.RaceTable.Races
      // @ts-ignore
      .filter(race => {
        const raceDate = new Date(race.date);
        return raceDate >= now;
      })
      // @ts-ignore
      .map(race => ({
        id: `f1-${race.Circuit.circuitName.toLowerCase().replace(/\s+/g, '-')}`,
        series: 'F1' as const,
        name: race.raceName,
        circuit: race.Circuit.circuitName,
        date: new Date(race.date + 'T' + race.time),
        location: `${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`,
        imageUrl: `/events/f1/${race.Circuit.circuitId}.jpg`,
        dropMultiplier: 2,
        qualifyingDate: new Date(race.Qualifying.date + 'T' + race.Qualifying.time),
        coordinates: {
          lat: parseFloat(race.Circuit.Location.lat),
          long: parseFloat(race.Circuit.Location.long),
        },
        practices: [
          ...(race.FirstPractice ? [{
            date: new Date(race.FirstPractice.date + 'T' + race.FirstPractice.time),
            name: 'Practice 1'
          }] : []),
          ...(race.SecondPractice ? [{
            date: new Date(race.SecondPractice.date + 'T' + race.SecondPractice.time),
            name: 'Practice 2'
          }] : []),
          ...(race.ThirdPractice ? [{
            date: new Date(race.ThirdPractice.date + 'T' + race.ThirdPractice.time),
            name: 'Practice 3'
          }] : []),
        ],
        sprint: race.Sprint ? {
          date: new Date(race.Sprint.date + 'T' + race.Sprint.time),
          qualifying: new Date(race.SprintQualifying.date + 'T' + race.SprintQualifying.time),
        } : undefined,
      }));
  } catch (error) {
    console.error('Error fetching F1 races:', error);
    return [];
  }
} 