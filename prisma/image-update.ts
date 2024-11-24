//@ts-nocheck
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * @typedef {Object} CardImageMapping
 * @property {string} name
 * @property {string} imageUrl
 * @property {string} type
 * @property {string} series
 */

/** @type {CardImageMapping[]} */
const cardImages = [
  {
    name: 'Max Verstappen - Las Vegas Launch Edition',
    imageUrl: 'https://pitdeck-app.s3.eu-north-1.amazonaws.com/cards/events/vegas2023/Max Verstappen - Las Vegas Launch Edition.jpg',
    type: 'F1_DRIVER',
    series: 'F1'
  },

];

async function main() {
  console.log('Starting image update...');
  
  let totalUpdated = 0;
  let totalSkipped = 0;
  
  for (const mapping of cardImages) {
    try {
      // Update cards with exact name match and correct type/series
      const updated = await prisma.card.updateMany({
        where: {
          AND: [
            { name: mapping.name }, // Exact name match
            { type: mapping.type }, // Correct card type
            { series: mapping.series } // Correct series
          ]
        },
        data: {
          imageUrl: mapping.imageUrl
        }
      });
      
      if (updated.count > 0) {
        console.log(`✅ Updated ${updated.count} cards for "${mapping.name}" (${mapping.series} ${mapping.type})`);
        totalUpdated += updated.count;
      } else {
        console.log(`⚠️ No cards found for "${mapping.name}" (${mapping.series} ${mapping.type})`);
        totalSkipped++;
      }
    } catch (error) {
      console.error(`❌ Error updating ${mapping.name}:`, error);
      totalSkipped++;
    }
  }

  console.log('\nUpdate Summary:');
  console.log(`✅ Successfully updated: ${totalUpdated} cards`);
  console.log(`⚠️ Skipped/Not found: ${totalSkipped} mappings`);
  console.log('Image update complete!');
}

main()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

module.exports = { main };