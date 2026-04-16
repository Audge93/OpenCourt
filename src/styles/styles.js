/**
 * FILE: src/styles/styles.js
 *
 * PURPOSE:
 * The single source of truth for every StyleSheet used by OpenCourt.
 * All visual styling — layout, typography, color fills, shadows, and spacing —
 * lives here.  Keeping styles in one file prevents duplication, makes
 * design-wide tweaks fast, and ensures every component uses the same tokens.
 *
 * HOW IT AFFECTS THE PROJECT:
 * - Every component and screen imports `styles` from this file.
 * - Color values come from COLORS (constants/colors.js) so a palette change
 *   here will automatically flow into every style rule below.
 * - HEADER_LOGO_SIZE is calculated once from the device width and reused by
 *   both the header layout styles and the HeaderBanner component.
 */

import { Dimensions, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

// ─── Responsive sizing ───────────────────────────────────────────────────────
// The logo in the header scales with the screen width but never goes below 78px.
const { width } = Dimensions.get('window');
export const HEADER_LOGO_SIZE = Math.max(78, width * 0.12);

// ─── Stylesheet ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  // ── Shell / Layout ─────────────────────────────────────────────────────────
  // Top-level flex container used by every screen to fill the safe area
  appShell: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  // Inner wrapper that holds scroll content + bottom nav
  flexContent: {
    flex: 1,
  },
  // ScrollView content padding for screens WITHOUT a bottom tab bar
  screenContent: {
    padding: 16,
    paddingBottom: 24,
  },
  // ScrollView content padding for screens WITH a bottom tab bar
  // (extra bottom padding keeps content above the nav bar)
  scrollContentWithNav: {
    padding: 16,
    paddingBottom: 128,
  },

  // ── Splash screen ───────────────────────────────────────────────────────────
  splashContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Fixed-size stage that anchors the paddle + ball animation
  stage: {
    width: 320,
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashBrandWrap: {
    alignItems: 'center',
    marginTop: 10,
  },
  splashLogo: {
    width: 364,
    height: 130,
  },
  splashTagline: {
    color: '#E8F5E9',
    fontSize: 16,
    marginTop: 6,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // ── Splash paddle ───────────────────────────────────────────────────────────
  paddleWrap: {
    width: 100,
    height: 160,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'absolute',
    left: 165,
    top: 108,
  },
  paddleFace: {
    width: 84,
    height: 104,
    borderRadius: 36,
    backgroundColor: COLORS.paddleGreen,
    borderWidth: 3,
    borderColor: COLORS.paddleBorder,
    alignItems: 'center',
    position: 'relative',
  },
  handle: {
    position: 'absolute',
    bottom: -34,
    width: 20,
    height: 42,
    borderRadius: 10,
    backgroundColor: COLORS.handle,
    borderWidth: 2,
    borderColor: COLORS.handleBorder,
  },
  ball: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.yellow,
    borderWidth: 2,
    borderColor: COLORS.yellowBorder,
    left: 160,
    top: 84,
    zIndex: 2,
  },

  // ── Header banner ───────────────────────────────────────────────────────────
  headerSafe: {
    backgroundColor: COLORS.primary,
  },
  headerWrap: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingBottom: 14,
    paddingTop: 8,
  },
  headerRow: {
    minHeight: HEADER_LOGO_SIZE + 20,
    justifyContent: 'center',
    position: 'relative',
  },
  // Back chevron — positioned absolutely on the left so it doesn't shift the title
  headerBackWrap: {
    position: 'absolute',
    left: 0,
    top: '50%',
    marginTop: -18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  headerBack: {
    color: '#fff',
    fontSize: 34,
    lineHeight: 34,
  },
  // Small logo sits on the left, behind the back button z-order
  headerLogoWrap: {
    position: 'absolute',
    left: 8,
    top: '50%',
    marginTop: -(HEADER_LOGO_SIZE / 2),
    width: HEADER_LOGO_SIZE + 8,
    height: HEADER_LOGO_SIZE,
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 2,
  },
  headerRightSpacer: {
    position: 'absolute',
    right: 0,
    width: 36,
    height: 36,
  },
  // Title + subtitle block is centred with padding to avoid overlapping the logo
  headerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: HEADER_LOGO_SIZE + 30,
  },
  headerLogo: {
    width: HEADER_LOGO_SIZE,
    height: HEADER_LOGO_SIZE,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#E8F5E9',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },

  // ── Form inputs ─────────────────────────────────────────────────────────────
  fieldLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 14,
    height: 52,
    paddingHorizontal: 14,
    color: COLORS.text,
  },

  // ── Radio buttons ───────────────────────────────────────────────────────────
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.card,
  },
  radioOuterActive: {
    borderColor: COLORS.primaryDark,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primaryDark,
  },
  radioText: {
    fontSize: 16,
    color: COLORS.text,
  },

  // ── Buttons ─────────────────────────────────────────────────────────────────
  primaryButton: {
    marginTop: 14,
    height: 50,
    borderRadius: 14,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: COLORS.divider,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.card,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  cancelButton: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.red,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  skipButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    color: COLORS.subtext,
    fontSize: 15,
    fontWeight: '600',
  },

  // ── Day-tab chip bar ────────────────────────────────────────────────────────
  nextAvailable: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 16,
  },
  dayChip: {
    height: 40,
    borderRadius: 12,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEF1F5',
    marginRight: 8,
  },
  dayChipActive: {
    backgroundColor: COLORS.primary,
  },
  dayChipText: {
    color: COLORS.text,
    fontWeight: '600',
  },
  dayChipTextActive: {
    color: '#fff',
  },

  // ── Slot list ───────────────────────────────────────────────────────────────
  sectionHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12,
  },
  slotRow: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  // Full slots appear muted to signal they can't be booked
  slotRowFull: {
    backgroundColor: '#F3F4F6',
    opacity: 0.7,
  },
  // Slots the current user has booked are highlighted in brand green
  slotRowMine: {
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
  },
  slotTime: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  slotMeta: {
    fontSize: 13,
    color: COLORS.subtext,
  },
  slotMineText: {
    color: '#fff',
  },
  slotMineMeta: {
    color: '#E8F5E9',
  },

  // ── Slot detail — section cards ─────────────────────────────────────────────
  helperText: {
    fontSize: 14,
    color: COLORS.subtext,
    marginBottom: 16,
  },
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionCount: {
    fontSize: 14,
    color: COLORS.subtext,
    fontWeight: '600',
  },
  sectionHelper: {
    fontSize: 14,
    color: COLORS.subtext,
    marginBottom: 12,
  },
  sectionEmpty: {
    fontSize: 14,
    color: COLORS.subtext,
    marginBottom: 12,
  },

  // ── Player row ──────────────────────────────────────────────────────────────
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  playerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  playerText: {
    fontSize: 15,
    color: COLORS.text,
  },

  // ── Bookings screen ─────────────────────────────────────────────────────────
  bookingCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  bookingDate: {
    fontSize: 13,
    color: COLORS.subtext,
    marginBottom: 4,
    fontWeight: '600',
  },
  bookingTime: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  bookingMeta: {
    fontSize: 15,
    color: COLORS.subtext,
    marginBottom: 14,
  },
  bookingButtonRow: {
    flexDirection: 'row',
  },

  // ── Profile screen ──────────────────────────────────────────────────────────
  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  profileLabel: {
    fontSize: 14,
    color: COLORS.subtext,
    marginBottom: 10,
  },
  rulesTitle: {
    fontWeight: '800',
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 10,
  },
  profileTextLine: {
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 6,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    paddingRight: 12,
  },

  // ── Location screen ─────────────────────────────────────────────────────────
  locationCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 40,
    minHeight: 260,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  locationPlaceholder: {
    fontSize: 20,
    color: COLORS.subtext,
    textAlign: 'center',
    fontWeight: '600',
  },

  // ── Empty states ────────────────────────────────────────────────────────────
  emptyState: {
    textAlign: 'center',
    color: COLORS.subtext,
    marginTop: 40,
    fontSize: 16,
  },

  // ── Bottom tab bar ──────────────────────────────────────────────────────────
  bottomTabs: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    backgroundColor: '#fff',
    paddingTop: 14,
    paddingBottom: 20,
    minHeight: 84,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  bottomTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  bottomTabLabel: {
    color: '#7B8794',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  bottomTabLabelActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },

  // ── Tips overlay ────────────────────────────────────────────────────────────
  tipsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  tipsCard: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  tipsTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  tipsBody: {
    fontSize: 16,
    color: COLORS.subtext,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  tipsDotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tipsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  tipsDotActive: {
    backgroundColor: COLORS.primary,
  },

  // ── Booking modal ───────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: COLORS.subtext,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalSecondaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: COLORS.card,
  },
  modalSecondaryButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  modalPrimaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  // Single-button variant (info modals with just an OK button)
  modalPrimaryButtonSingle: {
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalPrimaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  // ── Global interaction feedback ─────────────────────────────────────────────
  // Applied to any Pressable while it's held down
  pressed: {
    opacity: 0.82,
  },
});

export default styles;
