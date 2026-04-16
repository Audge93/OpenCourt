/**
 * FILE: src/utils/playerUtils.js
 *
 * PURPOSE:
 * Tiny helper functions that deal with individual player objects — creating
 * them from raw data and determining their visual skill-level dot color.
 * Centralising these prevents scattered inline object literals and keeps the
 * skill-color logic in one authoritative place.
 *
 * HOW IT AFFECTS THE PROJECT:
 * - seedData.js calls player() to create every seeded demo player object.
 * - PlayerRow component calls skillDotColor() to pick the colored indicator
 *   next to each player's name in the court sections.
 * - updateBooking (in App.js) builds the live user's player object inline
 *   using the same shape that player() would produce.
 */

import { COLORS } from '../constants/colors';

// ─── Player factory ──────────────────────────────────────────────────────────
/**
 * Creates a normalised player object.
 *
 * @param {string} name       - Display name shown in slot detail
 * @param {string} level      - One of 'Beginner' | 'Intermediate' | 'Advanced'
 * @param {string} [userId]   - Optional stable ID; defaults to snake_case of name
 * @returns {{ name, level, userId }}
 */
export function player(name, level, userId) {
  return {
    name,
    level,
    // If no explicit userId is supplied, derive one from the name so it stays
    // stable across renders while still being human-readable.
    userId: userId || name.toLowerCase().replace(/\s+/g, '_'),
  };
}

// ─── Skill dot color ─────────────────────────────────────────────────────────
/**
 * Maps a skill level string to the dot color rendered next to a player's name.
 * - Beginner     → neutral grey  (indicates newest players)
 * - Intermediate → accent green  (mid-level players)
 * - Advanced     → primary green (most experienced players)
 *
 * @param {string} level
 * @returns {string} hex color
 */
export function skillDotColor(level) {
  if (level === 'Beginner') return '#B8BFC7';
  if (level === 'Intermediate') return COLORS.accent;
  return COLORS.primary; // Advanced
}
