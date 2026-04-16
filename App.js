/**
 * FILE: App.js  (project root)
 *
 * PURPOSE:
 * The top-level entry point and state container for the entire OpenCourt app.
 * All global state lives here — the user profile, the full week of booking
 * slots, which screen is active, which slot is selected, and modal/tips
 * visibility.  App.js owns every piece of booking logic (validate, book,
 * cancel) and passes callbacks + derived data down to screen components as
 * props, keeping screens stateless and easy to test or replace.
 *
 * HOW IT AFFECTS THE PROJECT:
 * - React Native's entry point (index.js) registers this component.
 * - appStage ('splash' → 'onboarding' → 'main') drives the top-level render
 *   decision so users always see the right screen on launch.
 * - The global `slots` array (all 7 days × 26 half-hour slots) is mutated
 *   only through setSlots to keep React's reconciler in sync.
 * - The booking modal (confirm/info) is a single shared <Modal> managed here
 *   so any screen can trigger it via showConfirmModal / showInfoModal.
 * - The tips overlay is rendered as an absolute-position layer on top of the
 *   active screen, independent of the screen stack.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

// ── Screen components ────────────────────────────────────────────────────────
import Splash from './src/components/Splash';
import OnboardingScreen from './src/screens/OnboardingScreen';
import CourtViewScreen from './src/screens/CourtViewScreen';
import SlotDetailScreen from './src/screens/SlotDetailScreen';
import BookingsScreen from './src/screens/BookingsScreen';
import LocationScreen from './src/screens/LocationScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// ── Data / utility helpers ───────────────────────────────────────────────────
import { buildDayTabs, getTodayIso } from './src/utils/timeUtils';
import {
  buildWeekSlots,
  getSlotsForDate,
  getSection,
  shouldShowSlot,
  areCourtsFull,
} from './src/utils/slotUtils';

// ── Styles ───────────────────────────────────────────────────────────────────
import styles from './src/styles/styles';

// ─── Tips content ─────────────────────────────────────────────────────────────
// Shown as a paginated overlay after onboarding and optionally from Profile.
const TIPS = [
  {
    title: 'Shared Booking',
    body: 'You are booking into a shared play session, not reserving a private court.',
  },
  {
    title: 'Daily Booking Limit',
    body: 'You can book up to 2 hours of total play per day.',
  },
  {
    title: 'Consecutive Play Limit',
    body: 'You can book up to 1 consecutive hour of play each day.',
  },
  {
    title: 'On Deck',
    body: 'On Deck becomes available only when both courts are full.',
  },
  {
    title: 'Visible Player Info',
    body: 'Other players can see your first name and skill level on booked time slots.',
  },
  {
    title: 'Rotation',
    body: 'Players rotate manually on court after booking.',
  },
];

// ─── Root component ───────────────────────────────────────────────────────────
export default function App() {
  // Build the 7-day tab list once — these dates never change during a session
  const dayTabs = useMemo(() => buildDayTabs(), []);

  // ── App stage ──────────────────────────────────────────────────────────────
  // 'splash' → animated intro | 'onboarding' → new user setup | 'main' → app
  const [appStage, setAppStage] = useState('splash');

  // ── User profile ───────────────────────────────────────────────────────────
  const [user, setUser] = useState({ id: '', firstName: '', skillLevel: '' });

  // ── Slots — the core booking data ─────────────────────────────────────────
  // Initialised lazily from buildWeekSlots so the heavy work only runs once
  const [slots, setSlots] = useState(() => buildWeekSlots(dayTabs));

  // ── Navigation state ───────────────────────────────────────────────────────
  const [selectedDate, setSelectedDate] = useState(dayTabs[0].date);
  const [activeTab, setActiveTab] = useState('court');
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  // ── Onboarding form fields ─────────────────────────────────────────────────
  const [onboardingName, setOnboardingName] = useState('');
  const [onboardingLevel, setOnboardingLevel] = useState('');

  // ── Profile form fields (mirrors user state, edited independently) ─────────
  const [profileName, setProfileName] = useState('');
  const [profileLevel, setProfileLevel] = useState('');

  // ── Tips overlay ───────────────────────────────────────────────────────────
  const [showTips, setShowTips] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [showTipsAgainEnabled, setShowTipsAgainEnabled] = useState(false);

  // ── Booking / info modal ───────────────────────────────────────────────────
  const [bookingModal, setBookingModal] = useState({
    visible: false,
    title: '',
    message: '',
    mode: 'info',      // 'info' (OK only) | 'confirm' (Cancel + Confirm)
    onConfirm: null,
  });

  // ── Live clock — used to hide past slots on today's date ──────────────────
  const [now, setNow] = useState(new Date());

  // Keep the clock fresh; 30 s interval is precise enough for slot filtering
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  // Sync profile form fields whenever the saved user profile changes
  useEffect(() => {
    setProfileName(user.firstName || '');
    setProfileLevel(user.skillLevel || '');
  }, [user.firstName, user.skillLevel]);

  // ─── Derived data (memoised to avoid recomputation on every render) ────────

  // Slots for the selected date, with past today-slots filtered out
  const daySlots = useMemo(() => {
    const filtered = getSlotsForDate(slots, selectedDate);
    if (selectedDate !== getTodayIso()) return filtered;
    return filtered.filter((slot) => shouldShowSlot(slot, now));
  }, [slots, selectedDate, now]);

  // Slots grouped by time section heading for the CourtViewScreen list
  const groupedSlots = useMemo(() => {
    return daySlots.reduce((acc, slot) => {
      const section = getSection(slot);
      if (!acc[section]) acc[section] = [];
      acc[section].push(slot);
      return acc;
    }, {});
  }, [daySlots]);

  // The first slot that still has at least one open spot
  const nextAvailable = useMemo(() => {
    return daySlots.find((slot) => {
      return slot.courtA.length + slot.courtB.length + slot.onDeck.length < 12;
    });
  }, [daySlots]);

  // The full slot object for the currently selected slot ID
  const selectedSlot = useMemo(() => {
    const found = slots.find((s) => s.id === selectedSlotId) || null;
    if (!found) return null;
    // Auto-clear selection if today's slot has since expired
    if (found.date === getTodayIso() && !shouldShowSlot(found, now)) return null;
    return found;
  }, [slots, selectedSlotId, now]);

  // Clear selectedSlotId if the selected slot has expired
  useEffect(() => {
    if (selectedSlotId && !selectedSlot) setSelectedSlotId(null);
  }, [selectedSlotId, selectedSlot]);

  // ─── Modal helpers ─────────────────────────────────────────────────────────

  function showInfoModal(title, message) {
    setBookingModal({ visible: true, title, message, mode: 'info', onConfirm: null });
  }

  function showConfirmModal(title, message, onConfirm) {
    setBookingModal({ visible: true, title, message, mode: 'confirm', onConfirm });
  }

  function closeBookingModal() {
    setBookingModal((prev) => ({ ...prev, visible: false, onConfirm: null }));
  }

  // ─── Navigation helpers ────────────────────────────────────────────────────

  // Switching tabs always clears any open slot detail
  function handleTabChange(tabKey) {
    setSelectedSlotId(null);
    setActiveTab(tabKey);
  }

  // ─── Booking helpers ───────────────────────────────────────────────────────

  /**
   * Returns 'courtA' | 'courtB' | 'onDeck' | null depending on where the
   * logged-in user currently sits in the given slot.
   */
  function getUserLocation(slot) {
    if (!slot || !user.id) return null;
    if (slot.courtA.some((p) => p.userId === user.id)) return 'courtA';
    if (slot.courtB.some((p) => p.userId === user.id)) return 'courtB';
    if (slot.onDeck.some((p) => p.userId === user.id)) return 'onDeck';
    return null;
  }

  /** Returns all slots on `date` where the current user has a booking. */
  function getBookingsForDate(date) {
    return slots.filter((slot) => {
      if (slot.date !== date) return false;
      return (
        slot.courtA.some((p) => p.userId === user.id) ||
        slot.courtB.some((p) => p.userId === user.id) ||
        slot.onDeck.some((p) => p.userId === user.id)
      );
    });
  }

  /**
   * Validates whether the current user can book `destination` in `slot`.
   * Enforces:
   *  - Destination section must have space
   *  - On Deck only unlocks when both courts are full
   *  - Daily max of 4 slots (2 hours)
   *  - Consecutive max of 2 slots (1 hour)
   *
   * @returns {{ valid: boolean, message?: string, warningMessage?: string }}
   */
  function validateBooking(slot, destination) {
    const userLocation = getUserLocation(slot);
    const alreadyBookedThisSlot = !!userLocation;

    // Strip the user out of this slot before checking capacity — a "switch"
    // should not count the user's existing seat against the destination limit
    const cleanedSlot = {
      ...slot,
      courtA: slot.courtA.filter((p) => p.userId !== user.id),
      courtB: slot.courtB.filter((p) => p.userId !== user.id),
      onDeck: slot.onDeck.filter((p) => p.userId !== user.id),
    };

    // Check that the destination section still has an open seat
    const destinationHasSpace =
      (destination === 'courtA' && cleanedSlot.courtA.length < 4) ||
      (destination === 'courtB' && cleanedSlot.courtB.length < 4) ||
      (destination === 'onDeck' && cleanedSlot.onDeck.length < 4);

    if (!destinationHasSpace) {
      return { valid: false, message: 'That section is already full.' };
    }

    // On Deck requires both courts to be full
    if (destination === 'onDeck' && !areCourtsFull(cleanedSlot)) {
      return {
        valid: false,
        message: 'On Deck is only available when both courts are full.',
      };
    }

    const userBookingsToday = getBookingsForDate(slot.date);

    // Daily limit: max 4 slots = 2 hours
    if (!alreadyBookedThisSlot && userBookingsToday.length >= 4) {
      return { valid: false, message: 'You have reached your 2 hour daily booking max.' };
    }

    let warningMessage = null;

    if (!alreadyBookedThisSlot) {
      // Consecutive limit: find the longest run of adjacent slot orders
      const orders = userBookingsToday.map((s) => s.order);
      const merged = [...new Set([...orders, slot.order])].sort((a, b) => a - b);

      let maxRun = 0;
      let currentRun = 0;
      let last = null;

      merged.forEach((order) => {
        if (last === null || order === last + 1) {
          currentRun += 1;
        } else {
          currentRun = 1;
        }
        if (currentRun > maxRun) maxRun = currentRun;
        last = order;
      });

      // Block booking if it would create a run of 3+ consecutive slots (1.5 h)
      if (maxRun > 2) {
        return {
          valid: false,
          message: 'You have reached your 1 hour consecutive booking max.',
        };
      }

      // Build soft warnings for reaching limits after this booking
      const newDailyTotal = userBookingsToday.length + 1;

      if (newDailyTotal === 4 && maxRun === 2) {
        warningMessage =
          'If you confirm this booking, you will reach both your 1 hour consecutive booking limit and your 2 hour daily booking limit.';
      } else if (newDailyTotal === 4) {
        warningMessage =
          'If you confirm this booking, you will not be able to book another slot that day.';
      } else if (maxRun === 2) {
        warningMessage =
          'If you confirm this booking, you will not be able to book another consecutive slot.';
      }
    }

    return { valid: true, warningMessage };
  }

  /**
   * Runs validation then shows a confirm modal.  On confirmation, moves
   * the user's player entry to the chosen destination section.
   */
  function updateBooking(slot, destination) {
    const result = validateBooking(slot, destination);

    if (!result.valid) {
      showInfoModal('Cannot book slot', result.message);
      return;
    }

    const destinationLabel =
      destination === 'courtA' ? 'Court A' :
      destination === 'courtB' ? 'Court B' : 'On Deck';

    let message = `Date: ${slot.date}\nTime: ${slot.timeLabel}\nCourt: ${destinationLabel}`;
    if (result.warningMessage) {
      message += `\n\nWarning:\n${result.warningMessage}`;
    }

    showConfirmModal('Confirm Booking', message, () => {
      setSlots((prev) =>
        prev.map((s) => {
          if (s.id !== slot.id) return s;

          // Remove the user from all sections, then add to the destination
          const cleaned = {
            ...s,
            courtA: s.courtA.filter((p) => p.userId !== user.id),
            courtB: s.courtB.filter((p) => p.userId !== user.id),
            onDeck: s.onDeck.filter((p) => p.userId !== user.id),
          };

          const newPlayer = { userId: user.id, name: user.firstName, level: user.skillLevel };

          if (destination === 'courtA') cleaned.courtA.push(newPlayer);
          if (destination === 'courtB') cleaned.courtB.push(newPlayer);
          if (destination === 'onDeck') cleaned.onDeck.push(newPlayer);

          return cleaned;
        })
      );

      closeBookingModal();
      // Small delay so the confirm modal fully closes before the success toast opens
      setTimeout(() => showInfoModal('Success', 'Your booking has been confirmed.'), 50);
    });
  }

  /** Immediately removes the current user from a slot and shows confirmation. */
  function cancelBooking(slot) {
    setSlots((prev) =>
      prev.map((s) => {
        if (s.id !== slot.id) return s;
        return {
          ...s,
          courtA: s.courtA.filter((p) => p.userId !== user.id),
          courtB: s.courtB.filter((p) => p.userId !== user.id),
          onDeck: s.onDeck.filter((p) => p.userId !== user.id),
        };
      })
    );
    setSelectedSlotId(null);
    showInfoModal('Booking canceled', 'Your spot has been released.');
  }

  /**
   * Validates and saves the profile form.  Updates the user object and
   * rewrites the player entry in every existing booking so name/level
   * stay consistent across the slots array.
   */
  function saveProfile() {
    const trimmed = profileName.trim();
    if (!trimmed || !profileLevel) {
      showInfoModal('Missing information', 'Please enter your name and select a skill level.');
      return;
    }

    const oldId = user.id;
    const newId = `user_${trimmed.toLowerCase().replace(/\s+/g, '_')}`;

    // Propagate name/level/id changes to every booked slot
    setSlots((prev) =>
      prev.map((slot) => ({
        ...slot,
        courtA: slot.courtA.map((p) =>
          p.userId === oldId ? { ...p, userId: newId, name: trimmed, level: profileLevel } : p
        ),
        courtB: slot.courtB.map((p) =>
          p.userId === oldId ? { ...p, userId: newId, name: trimmed, level: profileLevel } : p
        ),
        onDeck: slot.onDeck.map((p) =>
          p.userId === oldId ? { ...p, userId: newId, name: trimmed, level: profileLevel } : p
        ),
      }))
    );

    setUser({ id: newId, firstName: trimmed, skillLevel: profileLevel });
    showInfoModal('Profile saved', 'Your profile has been updated.');
  }

  // ─── Tips overlay renderer ─────────────────────────────────────────────────
  function renderTipsOverlay() {
    const currentTip = TIPS[tipIndex];
    const isLast = tipIndex === TIPS.length - 1;

    return (
      <View style={styles.tipsOverlay}>
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>{currentTip.title}</Text>
          <Text style={styles.tipsBody}>{currentTip.body}</Text>

          {/* Dot pagination indicator */}
          <View style={styles.tipsDotsRow}>
            {TIPS.map((_, idx) => (
              <View key={idx} style={[styles.tipsDot, idx === tipIndex && styles.tipsDotActive]} />
            ))}
          </View>

          {/* Next / Got It button */}
          <Pressable
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
            onPress={() => {
              if (isLast) {
                setShowTips(false);
                setShowTipsAgainEnabled(false);
              } else {
                setTipIndex((prev) => prev + 1);
              }
            }}
          >
            <Text style={styles.primaryButtonText}>{isLast ? 'Got It' : 'Next'}</Text>
          </Pressable>

          {/* Skip link — only shown when not on the last tip */}
          {!isLast && (
            <Pressable
              style={({ pressed }) => [styles.skipButton, pressed && styles.pressed]}
              onPress={() => {
                setShowTips(false);
                setShowTipsAgainEnabled(false);
              }}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  // ─── Stage: Splash ─────────────────────────────────────────────────────────
  if (appStage === 'splash') {
    return (
      <Splash
        onDone={() => setAppStage(user.firstName ? 'main' : 'onboarding')}
      />
    );
  }

  // ─── Stage: Onboarding ─────────────────────────────────────────────────────
  if (appStage === 'onboarding') {
    return (
      <OnboardingScreen
        name={onboardingName}
        setName={setOnboardingName}
        level={onboardingLevel}
        setLevel={setOnboardingLevel}
        onSubmit={() => {
          const trimmed = onboardingName.trim();
          if (!trimmed || !onboardingLevel) return;
          setUser({
            id: `user_${trimmed.toLowerCase().replace(/\s+/g, '_')}`,
            firstName: trimmed,
            skillLevel: onboardingLevel,
          });
          setAppStage('main');
          setTipIndex(0);
          setShowTips(true);
        }}
      />
    );
  }

  // ─── Stage: Main app ───────────────────────────────────────────────────────
  // Determine which screen to render based on navigation state
  let mainScreen;

  if (selectedSlotId && selectedSlot) {
    // Drill-down view for a specific time slot
    mainScreen = (
      <SlotDetailScreen
        slot={selectedSlot}
        user={user}
        getUserLocation={getUserLocation}
        onBack={() => setSelectedSlotId(null)}
        onBook={updateBooking}
        onCancel={cancelBooking}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    );
  } else if (activeTab === 'court') {
    mainScreen = (
      <CourtViewScreen
        user={user}
        dayTabs={dayTabs}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        daySlots={daySlots}
        groupedSlots={groupedSlots}
        nextAvailable={nextAvailable}
        getUserLocation={getUserLocation}
        onSlotPress={(id) => setSelectedSlotId(id)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    );
  } else if (activeTab === 'bookings') {
    mainScreen = (
      <BookingsScreen
        slots={slots}
        user={user}
        selectedDate={selectedDate}
        now={now}
        onViewSlot={(id) => {
          // Switch to Court View and open the slot detail
          setSelectedSlotId(id);
          setActiveTab('court');
        }}
        onCancel={cancelBooking}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    );
  } else if (activeTab === 'location') {
    mainScreen = (
      <LocationScreen
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    );
  } else {
    mainScreen = (
      <ProfileScreen
        profileName={profileName}
        setProfileName={setProfileName}
        profileLevel={profileLevel}
        setProfileLevel={setProfileLevel}
        onSave={saveProfile}
        showTipsAgainEnabled={showTipsAgainEnabled}
        setShowTipsAgainEnabled={setShowTipsAgainEnabled}
        setTipIndex={setTipIndex}
        setShowTips={setShowTips}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Active screen */}
      {mainScreen}

      {/* Tips overlay rendered above the screen when visible */}
      {showTips ? renderTipsOverlay() : null}

      {/* ── Shared booking modal ── */}
      {/* Used for both info (OK only) and confirm (Cancel + Confirm) dialogs */}
      <Modal
        transparent
        visible={bookingModal.visible}
        animationType="fade"
        onRequestClose={closeBookingModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{bookingModal.title}</Text>
            <Text style={styles.modalMessage}>{bookingModal.message}</Text>

            {bookingModal.mode === 'confirm' ? (
              // Two-button layout for actions that need user confirmation
              <View style={styles.modalButtonRow}>
                <Pressable
                  style={({ pressed }) => [styles.modalSecondaryButton, pressed && styles.pressed]}
                  onPress={closeBookingModal}
                >
                  <Text style={styles.modalSecondaryButtonText}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [styles.modalPrimaryButton, pressed && styles.pressed]}
                  onPress={() => { if (bookingModal.onConfirm) bookingModal.onConfirm(); }}
                >
                  <Text style={styles.modalPrimaryButtonText}>Confirm</Text>
                </Pressable>
              </View>
            ) : (
              // Single OK button for informational messages
              <Pressable
                style={({ pressed }) => [styles.modalPrimaryButtonSingle, pressed && styles.pressed]}
                onPress={closeBookingModal}
              >
                <Text style={styles.modalPrimaryButtonText}>OK</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
