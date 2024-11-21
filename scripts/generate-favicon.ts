const sharp = require('sharp');
const fs = require('fs').promises;

async function generateFavicon() {
  try {
    // Read the SVG file
    const svgBuffer = await fs.readFile('./public/favicon.svg');
    
    // Generate different sizes
    const sizes = [16, 32, 48];
    const buffers = await Promise.all(
      sizes.map(size => 
        sharp(svgBuffer)
          .resize(size, size)
          .toBuffer()
      )
    );

    // Combine into ICO
    await sharp(buffers[1]) // Use 32x32 as base
      .toFile('./public/favicon.ico');

    console.log('Favicon generated successfully!');
  } catch (error) {
    console.error('Error generating favicon:', error);
  }
}

generateFavicon();

// For CommonJS compatibility
module.exports = generateFavicon;