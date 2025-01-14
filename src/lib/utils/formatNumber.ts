export function formatNumber(num: number): string {
  if (num === null || num === undefined) return '0';
  
  if (num < 1000) return num.toString();
  
  const units = ['', 'K', 'M', 'B', 'T'];
  const order = Math.floor(Math.log10(Math.abs(num)) / 3);
  const unitName = units[order];
  const value = num / Math.pow(1000, order);
  
  // Handle decimals based on value
  let decimals = 1;
  if (value >= 100) decimals = 0;
  else if (value >= 10) decimals = 1;
  else decimals = 2;
  
  return value.toFixed(decimals) + unitName;
} 