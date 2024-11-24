import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines and merges Tailwind CSS classes using clsx and tailwind-merge
 * Handles class conflicts and conditional classes properly
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number with proper suffix (1st, 2nd, 3rd, etc.)
 */
export function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Checks if a serial number is special (e.g., #1, #100)
 */
export function isSpecialSerial(serialNumber: string): boolean {
  const num = parseInt(serialNumber);
  return num <= 100 || num % 1000 === 0;
}

/**
 * Formats a date relative to now (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

/**
 * Formats a number with K/M suffix (e.g., 1.5K, 2.3M)
 */
export function formatCompactNumber(n: number): string {
  if (n < 1000) return n.toString();
  if (n < 1000000) return `${(n / 1000).toFixed(1)}K`;
  return `${(n / 1000000).toFixed(1)}M`;
}

/**
 * Truncates text with ellipsis
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Removes hyphens and trims whitespace from a nickname
 */
export function cleanNickname(nickname: string): string {
  return nickname.replace(/[-_]/g, ' ')
} 
