/**
 * FILE: src/screens/CourtViewScreen.js
 *
 * PURPOSE:
 * The main home screen of the app.  It shows a horizontal 7-day tab bar so
 * users can browse future dates, then lists all available 30-minute slots for
 * the selected day grouped into time-of-day sections (Morning, Midday,
 * Afternoon, Evening).  Past slots on today's date are hidden automatically.
 *
 * HOW IT AFFECTS THE PROJECT:
 * - App.js renders this screen when activeTab === 'court' and no slot is
 *   selected (selectedSlotId is null).
 * - Tapping a non-full SlotRow calls onSlotPress, which sets selectedSlotId
 *   in App.js and causes SlotDetailScreen to render instead.
 * - dayTabs, daySlots, groupedSlots, and nextAvailable are all computed in
 *   App.js (via useMemo) and passed as props to keep this screen stateless.
 * - getUserLocation is passed down so SlotRow can highlight slots the user
 *   has already booked.
 */

import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import BottomTabs from '../components/BottomTabs';
import HeaderBanner from '../components/HeaderBanner';
import SlotRow from '../components/SlotRow';
import styles from '../styles/styles';

/**
 * Court schedule screen.
 *
 * @param {{
 *   user: object,
 *   dayTabs: object[],
 *   selectedDate: string,
 *   setSelectedDate: (date: string) => void,
 *   daySlots: object[],
 *   groupedSlots: object,
 *   nextAvailable: object|null,
 *   getUserLocation: (slot: object) => string|null,
 *   onSlotPress: (slotId: string) => void,
 *   activeTab: string,
 *   onTabChange: (key: string) => void,
 * }} props
 */
export default function CourtViewScreen({
  user,
  dayTabs,
  selectedDate,
  setSelectedDate,
  daySlots,
  groupedSlots,
  nextAvailable,
  getUserLocation,
  onSlotPress,
  activeTab,
  onTabChange,
}) {
  return (
    <View style={styles.appShell}>
      <HeaderBanner title="Court View" subtitle={`Welcome back, ${user.firstName}`} />

      <View style={styles.flexContent}>
        <ScrollView contentContainerStyle={styles.scrollContentWithNav}>

          {/* ── Next available slot banner ── */}
          <Text style={styles.nextAvailable}>
            Next Available: {nextAvailable ? nextAvailable.timeLabel : 'No open slots'}
          </Text>

          {/* ── Horizontal 7-day selector ── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 20 }}
          >
            {dayTabs.map((tab) => {
              const active = selectedDate === tab.date;
              return (
                <Pressable
                  key={tab.date}
                  style={({ pressed }) => [
                    styles.dayChip,
                    active && styles.dayChipActive,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => setSelectedDate(tab.date)}
                >
                  <Text style={[styles.dayChipText, active && styles.dayChipTextActive]}>
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* ── Slot list grouped by time of day ── */}
          {daySlots.length === 0 ? (
            // Shown when all of today's slots have passed or the day has no slots
            <Text style={styles.emptyState}>No remaining time slots for this day.</Text>
          ) : (
            Object.entries(groupedSlots).map(([section, sectionSlots]) => (
              <View key={section} style={{ marginBottom: 20 }}>
                {/* Section heading: Morning / Midday / Afternoon / Evening */}
                <Text style={styles.sectionHeading}>{section}</Text>

                {sectionSlots.map((slot) => (
                  <SlotRow
                    key={slot.id}
                    slot={slot}
                    isBookedByMe={!!getUserLocation(slot)}
                    onPress={() => onSlotPress(slot.id)}
                  />
                ))}
              </View>
            ))
          )}

        </ScrollView>

        <BottomTabs activeTab={activeTab} onChange={onTabChange} />
      </View>
    </View>
  );
}
