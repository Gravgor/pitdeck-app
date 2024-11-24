//@ts-nocheck
const { PrismaClient, CardType, Rarity } = require('@prisma/client');
const { CARD_CONFIG } = require('../src/config/cardGeneration');
const { generateSerialNumber } = require('../src/lib/utils/cardGeneration');

const prisma = new PrismaClient();

// Track card counts for serial numbers
const cardCounts = {
  F1: { COMMON: 0, RARE: 0, EPIC: 0, LEGENDARY: 0 },
  F2: { COMMON: 0, RARE: 0, EPIC: 0, LEGENDARY: 0 },
  WEC: { COMMON: 0, RARE: 0, EPIC: 0, LEGENDARY: 0 },
  INDYCAR: { COMMON: 0, RARE: 0, EPIC: 0, LEGENDARY: 0 },
  NASCAR: { COMMON: 0, RARE: 0, EPIC: 0, LEGENDARY: 0 },
};

async function generateCards(cardTemplate: any, prints: number) {
  const cards = [];
  for (let i = 0; i < prints; i++) {
    const serialNumber = generateSerialNumber({
      series: cardTemplate.series,
      type: cardTemplate.type as CardType,
      rarity: cardTemplate.rarity as Rarity,
      year: cardTemplate.year,
      currentCount: cardCounts[cardTemplate.series][cardTemplate.rarity]
    });

    cards.push({
      ...cardTemplate,
      serialNumber,
    });

    cardCounts[cardTemplate.series][cardTemplate.rarity]++;
  }
  return cards;
}

async function main() {

  const vegas = [
    {
      name: "Max Verstappen: 4th World Championship Victory",
      type: "ICONIC_MOMENT",
      rarity: "LEGENDARY",
      imageUrl: "https://pitdeck-app.s3.eu-north-1.amazonaws.com/cards/events/vegas2024/verstappen-4th-title.png",
      description: "Max Verstappen celebrates his historic fourth Formula 1 World Championship title after the 2024 Las Vegas Grand Prix, solidifying his place among the legends of the sport.",
      series: "F1",
      edition: "2024",
      year: 2024,
      isExclusive: true,
      eventId: "F1-Las Vegas Grand Prix-2024",
      isPromotional: false,
      stats: {
        dominance: 99,
        qualifyingPerformance: 96,
        raceCraft: 97,
        strategyAdaptation: 95,
        overall: 98
      },
      eventDetails: {
        venue: "Las Vegas Street Circuit",
        date: "2024-11-23",
      }
    }
    
  ]


  /* const f1Drivers = [
    {
      name: "Max Verstappen",
      type: "F1_DRIVER",
      rarity: "LEGENDARY",
      imageUrl: "/cards/f1/drivers/verstappen.jpg",
      description: "3-time F1 World Champion, Red Bull Racing's lead driver known for his aggressive racing style and exceptional pace.",
      edition: "2024",
      series: "F1",
      year: 2024,
      stats: {
        pace: 98,
        racecraft: 97,
        experience: 92,
        awareness: 95,
        overtaking: 96
      }
    },
    {
      name: "Lewis Hamilton",
      type: "F1_DRIVER",
      rarity: "LEGENDARY",
      imageUrl: "/cards/f1/drivers/hamilton.jpg",
      description: "7-time F1 World Champion, holds records for most wins and pole positions in F1 history.",
      edition: "2024",
      series: "F1",
      year: 2024,
      stats: {
        pace: 95,
        racecraft: 98,
        experience: 99,
        awareness: 96,
        overtaking: 95
      }
    },
    {
      name: "Charles Leclerc",
      type: "F1_DRIVER",
      rarity: "EPIC",
      imageUrl: "/cards/f1/drivers/leclerc.jpg",
      description: "Ferrari's star driver known for his qualifying prowess and racing intelligence.",
      edition: "2024",
      series: "F1",
      year: 2024,
      stats: {
        pace: 94,
        racecraft: 92,
        experience: 88,
        awareness: 90,
        overtaking: 91
      }
    }
  ];*/

  const LasVegasEvent = [
    {
      name: "Circuit Layout - Las Vegas Strip",
      type: "EVENT",
      rarity: "COMMON",
      imageUrl: "/cards/events/las-vegas.jpg",
      description: "The Las Vegas Strip circuit layout, featuring iconic landmarks and high-speed turns.",
      edition: "2024",
      series: "F1",
      year: 2024,
      eventId: "F1-Las Vegas Grand Prix-2024"
    }
  ]
  

  
  
  const wecCars = [
    {
      name: "Toyota GR010 HYBRID",
      type: "WEC_CAR",
      rarity: "LEGENDARY",
      imageUrl: "/cards/wec/cars/toyota-gr010.jpg",
      description: "Toyota's Le Mans Hypercar, multiple 24 Hours of Le Mans winner.",
      edition: "2024",
      series: "WEC",
      year: 2024,
      stats: {
        speed: 95,
        reliability: 97,
        efficiency: 96,
        handling: 94,
        innovation: 95
      }
    },
    {
      name: "Porsche 963",
      type: "WEC_CAR",
      rarity: "EPIC",
      imageUrl: "/cards/wec/cars/porsche-963.jpg",
      description: "Porsche's LMDh challenger in WEC and IMSA.",
      edition: "2024",
      series: "WEC",
      year: 2024,
      stats: {
        speed: 93,
        reliability: 92,
        efficiency: 94,
        handling: 95,
        innovation: 92
      }
    }
  ];

  // WEC Drivers
const wecDrivers = [
    {
      name: "Kamui Kobayashi",
      type: "WEC_DRIVER",
      rarity: "LEGENDARY",
      imageUrl: "/cards/wec/drivers/kobayashi.jpg",
      description: "Toyota Gazoo Racing ace and former F1 driver.",
      edition: "2024",
      series: "WEC",
      year: 2024,
      stats: { pace: 95, endurance: 96, nightDriving: 97, teamwork: 94, consistency: 95 }
    },
    {
      name: "Brendon Hartley",
      type: "WEC_DRIVER",
      rarity: "EPIC",
      imageUrl: "/cards/wec/drivers/hartley.jpg",
      description: "Multiple Le Mans winner with exceptional endurance racing experience.",
      edition: "2024",
      series: "WEC",
      year: 2024,
      stats: { pace: 93, endurance: 95, nightDriving: 94, teamwork: 96, consistency: 94 }
    },
    {
      name: "Romain Dumas",
      type: "WEC_DRIVER",
      rarity: "EPIC",
      imageUrl: "/cards/wec/drivers/dumas.jpg",
      description: "Versatile endurance racing veteran.",
      edition: "2024",
      series: "WEC",
      year: 2024,
      stats: { pace: 92, endurance: 94, nightDriving: 95, teamwork: 93, consistency: 92 }
    },
    {
      name: "Mike Conway",
      type: "WEC_DRIVER",
      rarity: "EPIC",
      imageUrl: "/cards/wec/drivers/conway.jpg",
      description: "Toyota's reliable endurance specialist.",
      edition: "2024",
      series: "WEC",
      year: 2024,
      stats: { pace: 91, endurance: 93, nightDriving: 92, teamwork: 94, consistency: 93 }
    },
    {
      name: "Kevin Estre",
      type: "WEC_DRIVER",
      rarity: "RARE",
      imageUrl: "/cards/wec/drivers/estre.jpg",
      description: "Porsche factory driver with impressive speed.",
      edition: "2024",
      series: "WEC",
      year: 2024,
      stats: { pace: 90, endurance: 91, nightDriving: 89, teamwork: 92, consistency: 90 }
    },
    {
      name: "Nicklas Nielsen",
      type: "WEC_DRIVER",
      rarity: "RARE",
      imageUrl: "/cards/wec/drivers/nielsen.jpg",
      description: "Rising star in Ferrari's endurance program.",
      edition: "2024",
      series: "WEC",
      year: 2024,
      stats: { pace: 89, endurance: 88, nightDriving: 87, teamwork: 90, consistency: 89 }
    },
    {
      name: "Paul Di Resta",
      type: "WEC_DRIVER",
      rarity: "RARE",
      imageUrl: "/cards/wec/drivers/diresta.jpg",
      description: "Former F1 driver turned successful endurance racer.",
      edition: "2024",
      series: "WEC",
      year: 2024,
      stats: { pace: 88, endurance: 87, nightDriving: 86, teamwork: 89, consistency: 88 }
    },
    {
      name: "Oliver Jarvis",
      type: "WEC_DRIVER",
      rarity: "RARE",
      imageUrl: "/cards/wec/drivers/jarvis.jpg",
      description: "Experienced endurance racing professional.",
      edition: "2024",
      series: "WEC",
      year: 2024,
      stats: { pace: 87, endurance: 89, nightDriving: 88, teamwork: 88, consistency: 87 }
    },
    {
      name: "Filipe Albuquerque",
      type: "WEC_DRIVER",
      rarity: "COMMON",
      imageUrl: "/cards/wec/drivers/albuquerque.jpg",
      description: "Versatile endurance racer with proven success.",
      edition: "2024",
      series: "WEC",
      year: 2024,
      stats: { pace: 86, endurance: 88, nightDriving: 85, teamwork: 87, consistency: 86 }
    },
    {
      name: "Matthieu Vaxiviere",
      type: "WEC_DRIVER",
      rarity: "COMMON",
      imageUrl: "/cards/wec/drivers/vaxiviere.jpg",
      description: "Alpine's promising endurance talent.",
      edition: "2024",
      series: "WEC",
      year: 2024,
      stats: { pace: 85, endurance: 86, nightDriving: 84, teamwork: 86, consistency: 85 }
    }
  ];
  
  // IndyCar Drivers
  const indycarDrivers = [
    {
      name: "Scott Dixon",
      type: "INDYCAR_DRIVER",
      rarity: "LEGENDARY",
      imageUrl: "/cards/indycar/drivers/dixon.jpg",
      description: "Six-time IndyCar champion, known as the 'Iceman'.",
      edition: "2024",
      series: "INDYCAR",
      year: 2024,
      stats: { pace: 97, ovalRacing: 96, roadCourse: 97, consistency: 98, adaptability: 96 }
    },
    {
      name: "Pato O'Ward",
      type: "INDYCAR_DRIVER",
      rarity: "EPIC",
      imageUrl: "/cards/indycar/drivers/oward.jpg",
      description: "Young Mexican star with exceptional talent.",
      edition: "2024",
      series: "INDYCAR",
      year: 2024,
      stats: { pace: 94, ovalRacing: 92, roadCourse: 95, consistency: 91, adaptability: 93 }
    },
  {
    name: "Alex Palou",
    type: "INDYCAR_DRIVER",
    rarity: "EPIC",
    imageUrl: "/cards/indycar/drivers/palou.jpg",
    description: "Reigning IndyCar champion with exceptional race craft.",
    edition: "2024",
    series: "INDYCAR",
    year: 2024,
    stats: { pace: 96, ovalRacing: 93, roadCourse: 96, consistency: 95, adaptability: 94 }
  },
  {
    name: "Colton Herta",
    type: "INDYCAR_DRIVER",
    rarity: "RARE",
    imageUrl: "/cards/indycar/drivers/herta.jpg",
    description: "Young American talent with natural speed.",
    edition: "2024",
    series: "INDYCAR",
    year: 2024,
    stats: { pace: 92, ovalRacing: 89, roadCourse: 94, consistency: 88, adaptability: 91 }
  },
  {
    name: "Marcus Ericsson",
    type: "INDYCAR_DRIVER",
    rarity: "RARE",
    imageUrl: "/cards/indycar/drivers/ericsson.jpg",
    description: "Former F1 driver and Indy 500 winner.",
    edition: "2024",
    series: "INDYCAR",
    year: 2024,
    stats: { pace: 90, ovalRacing: 91, roadCourse: 89, consistency: 92, adaptability: 90 }
  },
  {
    name: "Will Power",
    type: "INDYCAR_DRIVER",
    rarity: "RARE",
    imageUrl: "/cards/indycar/drivers/power.jpg",
    description: "Qualifying specialist and former champion.",
    edition: "2024",
    series: "INDYCAR",
    year: 2024,
    stats: { pace: 91, ovalRacing: 88, roadCourse: 93, consistency: 89, adaptability: 90 }
  },
  {
    name: "Alexander Rossi",
    type: "INDYCAR_DRIVER",
    rarity: "COMMON",
    imageUrl: "/cards/indycar/drivers/rossi.jpg",
    description: "Versatile racer with Indy 500 victory.",
    edition: "2024",
    series: "INDYCAR",
    year: 2024,
    stats: { pace: 88, ovalRacing: 87, roadCourse: 89, consistency: 86, adaptability: 88 }
  },
  {
    name: "Felix Rosenqvist",
    type: "INDYCAR_DRIVER",
    rarity: "COMMON",
    imageUrl: "/cards/indycar/drivers/rosenqvist.jpg",
    description: "Swedish talent with diverse racing background.",
    edition: "2024",
    series: "INDYCAR",
    year: 2024,
    stats: { pace: 87, ovalRacing: 86, roadCourse: 88, consistency: 85, adaptability: 87 }
  },
  {
    name: "Kyle Kirkwood",
    type: "INDYCAR_DRIVER",
    rarity: "COMMON",
    imageUrl: "/cards/indycar/drivers/kirkwood.jpg",
    description: "Rising American star with championship pedigree.",
    edition: "2024",
    series: "INDYCAR",
    year: 2024,
    stats: { pace: 86, ovalRacing: 85, roadCourse: 87, consistency: 84, adaptability: 86 }
  }
];

// F1 Cars
const f1Cars = [
  {
    name: "Aston Martin AMR24",
    type: "F1_CAR",
    rarity: "EPIC",
    imageUrl: "/cards/f1/cars/aston-amr24.jpg",
    description: "Refined design with innovative aerodynamic solutions.",
    edition: "2024",
    series: "F1",
    year: 2024,
    stats: { speed: 93, handling: 92, acceleration: 91, reliability: 93, innovation: 92 }
  },
  {
    name: "Alpine A524",
    type: "F1_CAR",
    rarity: "RARE",
    imageUrl: "/cards/f1/cars/alpine-a524.jpg",
    description: "Complete concept revision targeting improved performance.",
    edition: "2024",
    series: "F1",
    year: 2024,
    stats: { speed: 90, handling: 89, acceleration: 91, reliability: 88, innovation: 89 }
  },
  {
    name: "Williams FW46",
    type: "F1_CAR",
    rarity: "RARE",
    imageUrl: "/cards/f1/cars/williams-fw46.jpg",
    description: "Evolution of Williams' low-drag concept.",
    edition: "2024",
    series: "F1",
    year: 2024,
    stats: { speed: 89, handling: 87, acceleration: 90, reliability: 88, innovation: 86 }
  },
  {
    name: "Kick Sauber C44",
    type: "F1_CAR",
    rarity: "RARE",
    imageUrl: "/cards/f1/cars/sauber-c44.jpg",
    description: "First car under new Stake F1 identity with fresh concepts.",
    edition: "2024",
    series: "F1",
    year: 2024,
    stats: { speed: 88, handling: 86, acceleration: 87, reliability: 89, innovation: 85 }
  },
  {
    name: "VCARB 01",
    type: "F1_CAR",
    rarity: "COMMON",
    imageUrl: "/cards/f1/cars/vcarb-01.jpg",
    description: "Rebranded RB sister team with increased independence.",
    edition: "2024",
    series: "F1",
    year: 2024,
    stats: { speed: 87, handling: 86, acceleration: 85, reliability: 88, innovation: 84 }
  },
  {
    name: "Haas VF-24",
    type: "F1_CAR",
    rarity: "COMMON",
    imageUrl: "/cards/f1/cars/haas-vf24.jpg",
    description: "New design direction under fresh technical leadership.",
    edition: "2024",
    series: "F1",
    year: 2024,
    stats: { speed: 86, handling: 85, acceleration: 84, reliability: 87, innovation: 83 }
  },
  {
    name: "RB20 Testing Spec",
    type: "F1_CAR",
    rarity: "EPIC",
    imageUrl: "/cards/f1/cars/rb20-testing.jpg",
    description: "Special pre-season testing specification with unique features.",
    edition: "2024",
    series: "F1",
    year: 2024,
    stats: { speed: 95, handling: 94, acceleration: 95, reliability: 91, innovation: 96 }
  },
  {
    name: "SF-24 Launch Edition",
    type: "F1_CAR",
    rarity: "EPIC",
    imageUrl: "/cards/f1/cars/sf24-launch.jpg",
    description: "Ferrari's 2024 challenger in special launch specification.",
    edition: "2024",
    series: "F1",
    year: 2024,
    stats: { speed: 94, handling: 93, acceleration: 94, reliability: 90, innovation: 95 }
  }
];
  {
   const indycarCars = [
    {
      name: "Dallara DW12 Chevrolet",
      type: "INDYCAR_CAR",
      rarity: "EPIC",
      imageUrl: "/cards/indycar/cars/dallara-chevy.jpg",
      description: "Chevrolet-powered IndyCar, featuring advanced aerodynamics.",
      edition: "2024",
      series: "INDYCAR",
      year: 2024,
      stats: {
        speed: 92,
        handling: 91,
        reliability: 93,
        efficiency: 90,
        versatility: 94
      }
    }
  ];

  const nascarDrivers = [
    {
      name: "Kyle Larson",
      type: "NASCAR_DRIVER",
      rarity: "LEGENDARY",
      imageUrl: "/cards/nascar/drivers/larson.jpg",
      description: "2021 NASCAR Cup Series Champion, known for versatility across multiple racing disciplines.",
      edition: "2024",
      series: "NASCAR",
      year: 2024,
      stats: {
        speed: 96,
        consistency: 94,
        aggression: 95,
        racecraft: 97,
        adaptability: 98
      }
    },
    {
      name: "Chase Elliott",
      type: "NASCAR_DRIVER",
      rarity: "EPIC",
      imageUrl: "/cards/nascar/drivers/elliott.jpg",
      description: "2020 NASCAR Cup Series Champion and fan favorite.",
      edition: "2024",
      series: "NASCAR",
      year: 2024,
      stats: {
        speed: 93,
        consistency: 92,
        aggression: 90,
        racecraft: 94,
        adaptability: 93
      }
    }
  ];

  const historicMoments = [
    {
      name: "Senna vs Prost 1989",
      type: "HISTORIC_MOMENT",
      rarity: "LEGENDARY",
      imageUrl: "/cards/historic/senna-prost-89.jpg",
      description: "The infamous collision at Suzuka that decided the 1989 World Championship.",
      edition: "Legends",
      series: "F1",
      year: 1989,
      stats: {
        historicalSignificance: 98,
        drama: 99,
        impact: 97,
        memorability: 99,
        controversy: 95
      }
    },
    {
      name: "First Night Race Singapore 2008",
      type: "HISTORIC_MOMENT",
      rarity: "EPIC",
      imageUrl: "/cards/historic/singapore-2008.jpg",
      description: "F1's first night race at Marina Bay Street Circuit.",
      edition: "Legends",
      series: "F1",
      year: 2008,
      stats: {
        historicalSignificance: 94,
        innovation: 96,
        impact: 93,
        memorability: 95,
        spectacle: 97
      }
    }
  ];

  const circuits = [
    {
      name: "Spa-Francorchamps",
      type: "CIRCUIT",
      rarity: "LEGENDARY",
      imageUrl: "/cards/circuits/spa.jpg",
      description: "The legendary Belgian circuit, featuring the iconic Eau Rouge-Raidillon complex.",
      edition: "Classic Tracks",
      series: "F1",
      year: 2024,
      stats: {
        length: 7.004,
        corners: 19,
        difficulty: 95,
        overtaking: 92,
        weather: 88
      }
    },
    {
      name: "Monaco",
      type: "CIRCUIT",
      rarity: "LEGENDARY",
      imageUrl: "/cards/circuits/monaco.jpg",
      description: "The crown jewel of F1, the prestigious street circuit of Monte Carlo.",
      edition: "Classic Tracks",
      series: "F1",
      year: 2024,
      stats: {
        length: 3.337,
        corners: 19,
        difficulty: 98,
        overtaking: 75,
        prestige: 100
      }
    }
  ];
  
  const teams = [
    {
      name: "Red Bull Racing",
      type: "TEAM",
      rarity: "LEGENDARY",
      imageUrl: "/cards/teams/red-bull.jpg",
      description: "Multiple F1 Constructors' Champions, known for aerodynamic innovation.",
      edition: "2024",
      series: "F1",
      year: 2024,
      stats: {
        facilities: 98,
        development: 97,
        strategy: 95,
        personnel: 96,
        resources: 97
      }
    },
    {
      name: "Ferrari",
      type: "TEAM",
      rarity: "LEGENDARY",
      imageUrl: "/cards/teams/ferrari.jpg",
      description: "The most historic and successful F1 team of all time.",
      edition: "2024",
      series: "F1",
      year: 2024,
      stats: {
        facilities: 97,
        development: 94,
        strategy: 90,
        personnel: 95,
        resources: 98
      }
    }
  ];

  // Promotional Cards
  const promotionalCards = [
    {
      name: "Max Verstappen - Las Vegas Launch Edition",
      type: "F1_DRIVER",
      rarity: "LEGENDARY",
      imageUrl: "/cards/promotional/vegas-max.jpg",
      description: "Special edition card celebrating F1's return to Las Vegas",
      edition: "Las Vegas GP Launch",
      series: "F1",
      year: 2023,
      stats: {
        pace: 99,
        racecraft: 98,
        experience: 93,
        awareness: 96,
        overtaking: 97
      },
      isPromotional: true,
      promotionalDetails: {
        event: "Las Vegas GP Launch",
        limitedEdition: true,
        totalPrints: 100
      }
    },
    {
      name: "Ferrari Miami Vice Edition",
      type: "F1_CAR",
      rarity: "LEGENDARY",
      imageUrl: "/cards/promotional/miami-ferrari.jpg",
      description: "Special Miami GP livery edition Ferrari SF-23",
      edition: "Miami GP Special",
      series: "F1",
      year: 2023,
      stats: {
        speed: 96,
        handling: 95,
        acceleration: 97,
        reliability: 93,
        specialLivery: 100
      },
      isPromotional: true,
      promotionalDetails: {
        event: "Miami GP 2023",
        limitedEdition: true,
        totalPrints: 305 // Miami area code
      }
    }
  ];
  
  // Event Specific Cards
  const eventCards = [
    {
      name: "Verstappen - 2023 Suzuka Victory",
      type: "F1_DRIVER",
      rarity: "EPIC",
      imageUrl: "/cards/events/verstappen-suzuka-23.jpg",
      description: "Commemorating Red Bull's Constructor Championship clinching victory",
      edition: "Race Winners",
      series: "F1",
      year: 2023,
      stats: {
        racePerformance: 99,
        qualifyingPace: 98,
        raceStrategy: 97,
        teamwork: 96,
        championshipImpact: 100
      },
      eventDetails: {
        eventName: "2023 Japanese GP",
        achievement: "Constructor's Championship Clinched",
        significance: "Record-breaking earliest championship win"
      }
    }
  ];
  
  // Championship Edition Cards (2021 F1 Season)
  const championship2021Cards = [
    {
      name: "Max Verstappen - 2021 Champion Edition",
      type: "F1_DRIVER",
      rarity: "LEGENDARY",
      imageUrl: "/cards/championship/verstappen-2021.jpg",
      description: "Commemorating Verstappen's first F1 World Championship",
      edition: "2021 Championship",
      series: "F1",
      year: 2021,
      stats: {
        pace: 98,
        racecraft: 97,
        pressure: 99,
        determination: 100,
        championship: 100
      },
      championshipDetails: {
        season: 2021,
        wins: 10,
        podiums: 18,
        points: 395.5,
        decisiveRace: "Abu Dhabi GP"
      }
    },
    {
      name: "Abu Dhabi Showdown - 2021 Final Lap",
      type: "HISTORIC_MOMENT",
      rarity: "LEGENDARY",
      imageUrl: "/cards/championship/abu-dhabi-2021.jpg",
      description: "The dramatic final lap of the 2021 Abu Dhabi GP",
      edition: "Championship Moments",
      series: "F1",
      year: 2021,
      stats: {
        drama: 100,
        significance: 100,
        controversy: 100,
        intensity: 100,
        historicalImpact: 99
      },
      championshipDetails: {
        event: "Abu Dhabi GP 2021",
        lap: "Final Lap",
        significance: "Championship Deciding Moment"
      }
    }
  ];
  
  // Seasonal Variants
  const seasonalCards = [
    {
      name: "Snow Spa Special Edition",
      type: "CIRCUIT",
      rarity: "LEGENDARY",
      imageUrl: "/cards/seasonal/spa-snow.jpg",
      description: "Winter edition of the legendary Spa-Francorchamps circuit",
      edition: "Winter Collection 2023",
      series: "F1",
      year: 2023,
      stats: {
        length: 7.004,
        corners: 19,
        difficulty: 98,
        weather: 100,
        seasonalChallenge: 95
      },
      seasonalDetails: {
        season: "Winter",
        specialConditions: true,
        limitedAvailability: "December 2023"
      }
    }
  ];
  
  // Legendary Historic Cards
  const legendaryHistoricCards = [
    {
      name: "Ayrton Senna - Monaco Mastery",
      type: "HISTORIC_MOMENT",
      rarity: "LEGENDARY",
      imageUrl: "/cards/historic/senna-monaco-88.jpg",
      description: "Senna's legendary qualifying lap at Monaco 1988",
      edition: "Timeless Legends",
      series: "F1",
      year: 1988,
      stats: {
        skill: 100,
        precision: 100,
        concentration: 100,
        achievement: 100,
        legacy: 100
      },
      historicDetails: {
        event: "Monaco GP Qualifying 1988",
        margin: "1.427 seconds",
        significance: "Greatest qualifying lap in F1 history"
      }
    },
    {
      name: "Schumacher's Rain Dance",
      type: "HISTORIC_MOMENT",
      rarity: "LEGENDARY",
      imageUrl: "/cards/historic/schumacher-spain-96.jpg",
      description: "Schumacher's masterclass in the wet at Spain 1996",
      edition: "Timeless Legends",
      series: "F1",
      year: 1996,
      stats: {
        wetWeatherSkill: 100,
        carControl: 99,
        adaptation: 100,
        strategy: 98,
        legacy: 99
      },
      historicDetails: {
        event: "Spanish GP 1996",
        conditions: "Extreme Wet",
        achievement: "Won by 45 seconds in inferior machinery"
      }
    },
    {
      name: "Hunt vs Lauda - 1976",
      type: "HISTORIC_MOMENT",
      rarity: "LEGENDARY",
      imageUrl: "/cards/historic/hunt-lauda-76.jpg",
      description: "The epic 1976 championship battle",
      edition: "Greatest Rivalries",
      series: "F1",
      year: 1976,
      stats: {
        drama: 100,
        rivalry: 100,
        courage: 100,
        determination: 100,
        historicalImpact: 100
      },
      historicDetails: {
        season: 1976,
        champion: "James Hunt",
        margin: "1 point",
        significance: "One of F1's greatest rivalries"
      }
    }
  ];


  // Process each category
  const categories = [
    //{ data: f1Drivers, name: 'F1 Drivers' },
    //{ data: f2Drivers, name: 'F2 Drivers' },
   // { data: f1Cars, name: 'F1 Cars' },
    //{ data: wecDrivers, name: 'WEC Drivers' },
    //{ data: indycarDrivers, name: 'IndyCar Drivers' },
    //{ data: historicMoments, name: 'Historic Moments' },
    //{ data: teams, name: 'Teams' },
    //{ data: circuits, name: 'Circuits' },
    //{ data: promotionalCards, name: 'Promotional Cards' },
    //{ data: eventCards, name: 'Event Cards' },
    //{ data: championship2021Cards, name: 'Championship 2021 Cards' },
    //{ data: seasonalCards, name: 'Seasonal Cards' },
    //{ data: legendaryHistoricCards, name: 'Legendary Historic Cards' },
    { data: vegas, name: 'FORMULA 1 HEINEKEN SILVER LAS VEGAS GRAND PRIX 2024' }
  ];

  for (const category of categories) {
    console.log(`Processing ${category.name}...`);
    for (const template of category.data) {
      const maxPrints = CARD_CONFIG.MAX_PRINTS[template.rarity];
      const cards = await generateCards(template, maxPrints);
      
      for (const card of cards) {
        await prisma.card.create({
          data: card,
        });
      }
      
      console.log(`Generated ${maxPrints} cards for ${template.name}`);
    }
  }

  // Print final statistics
  console.log('\nFinal Card Count Statistics:');
  for (const [series, counts] of Object.entries(cardCounts)) {
    console.log(`\n${series}:`);
    for (const [rarity, count] of Object.entries(counts)) {
      console.log(`  ${rarity}: ${count} cards`);
    }
  }
}
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });