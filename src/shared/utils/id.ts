// Utility functions

/**
 * Generate a UUID v4 string for meme IDs.
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Get current UTC timestamp as ISO 8601 string.
 */
export function now(): string {
  return new Date().toISOString();
}