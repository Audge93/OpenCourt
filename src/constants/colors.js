/**
 * FILE: src/constants/colors.js
 *
 * PURPOSE:
 * Central location for all color tokens and skill-level list used across the
 * entire OpenCourt app.  Any time you need a color — in a component, a screen,
 * or a style sheet — import it from here rather than hard-coding a hex value.
 * Keeping every color in one place means a single edit here ripples through
 * the whole UI, making re-theming or accessibility tweaks painless.
 *
 * HOW IT AFFECTS THE PROJECT:
 * - styles/styles.js references COLORS for every StyleSheet rule.
 * - screens and components import COLORS when they need inline color values
 *   (e.g. Switch thumbColor, dynamic dot colors).
 * - LEVELS drives the skill-level radio buttons on both the onboarding screen
 *   and the profile screen.
 */

// ─── Brand palette ───────────────────────────────────────────────────────────
// Primary greens are the dominant brand color; accent is the lighter highlight.
export const COLORS = {
  primary: '#2E7D32',       // Main green — buttons, active states, header bg
  primarySoft: '#E8F5E9',   // Pale green — soft backgrounds, switch track
  primaryDark: '#1B5E20',   // Deep green — CTA button fill, radio dot
  accent: '#6BCB77',        // Bright green — Intermediate skill dot
  bg: '#F7F8FA',            // App background (off-white)
  card: '#FFFFFF',          // Card / modal surface
  text: '#111111',          // Primary body text
  subtext: '#6B7280',       // Secondary / helper text
  border: '#E5E7EB',        // Input and card borders
  divider: '#F0F2F5',       // Subtle section dividers
  red: '#D9534F',           // Cancel / destructive actions
  yellow: '#FFD93D',        // Pickleball — splash ball fill
  yellowBorder: '#FFF3B0',  // Splash ball border highlight
  paddleGreen: '#66BB6A',   // Splash paddle face fill
  paddleBorder: '#C8E6C9',  // Splash paddle face border
  handle: '#C58B5A',        // Splash paddle handle fill
  handleBorder: '#E8C8A8',  // Splash paddle handle border
};

// ─── Skill levels ────────────────────────────────────────────────────────────
// The ordered list of skill levels shown in onboarding and profile screens.
// Order matters: it controls the top-to-bottom rendering of radio buttons.
export const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
