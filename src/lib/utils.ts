import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to get the correct image URL
export const getImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it starts with a slash, it's a relative path
  if (imageUrl.startsWith('/')) {
    return `https://localhost:7089${imageUrl}`;
  }
  
  // Otherwise, assume it's a relative path and add the base URL
  return `https://localhost:7089/${imageUrl}`;
};
