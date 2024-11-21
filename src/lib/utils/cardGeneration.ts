
//@ts-nocheck
function generateSerialNumber({ series, type, rarity, year, currentCount }:any) {
    const config = require('../../config/cardGeneration').CARD_CONFIG;
    
    const prefix = config.SERIAL_NUMBER_FORMAT.PREFIX[series] || 'GEN';
    const yearCode = year.toString().slice(-2);
    const rarityCode = config.SERIAL_NUMBER_FORMAT.RARITY_CODE[rarity];
    const separator = config.SERIAL_NUMBER_FORMAT.SEPARATOR;
    const sequentialNumber = (currentCount + 1)
      .toString()
      .padStart(config.SERIAL_NUMBER_FORMAT.DIGITS, '0');
  
    return `${prefix}${separator}${yearCode}${separator}${rarityCode}${separator}${sequentialNumber}`;
  }
  
  module.exports = { generateSerialNumber };
