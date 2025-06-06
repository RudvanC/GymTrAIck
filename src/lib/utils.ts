import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines and merges class names using clsx and tailwind-merge.
 * This utility is essential for conditionally applying Tailwind CSS classes
 * and resolving conflicts between them.
 *
 * @param inputs - A list of class values (strings, objects, arrays) to be combined.
 * @returns A string of merged and optimized class names.
 */
export function cn(...inputs: ClassValue[]): string {
  // First, clsx processes the inputs to generate a single class string based on conditions.
  // Then, twMerge takes that string and resolves any Tailwind CSS class conflicts.
  return twMerge(clsx(inputs));
}
