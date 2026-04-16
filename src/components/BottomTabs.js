/**
 * FILE: src/components/BottomTabs.js
 *
 * PURPOSE:
 * The persistent bottom navigation bar rendered at the base of every main
 * screen.  It holds four tabs — Court View, Bookings, Court Location, and
 * Profile — and highlights the currently active one in brand green.
 *
 * HOW IT AFFECTS THE PROJECT:
 * - All four main screens (CourtViewScreen, BookingsScreen, LocationScreen,
 *   ProfileScreen) render <BottomTabs> pinned to the bottom of their layout.
 * - The `onChange` callback wires back to App.js's handleTabChange, which
 *   also clears any selected slot so users always land on a clean list view
 *   when switching tabs.
 * - Tab keys must exactly match the strings App.js checks against activeTab
 *   ('court', 'bookings', 'location', 'profile').
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import styles from '../styles/styles';

// Static tab definitions — label is display text, key is the state value
const TABS = [
  { key: 'court',    label: 'Court View' },
  { key: 'bookings', label: 'Bookings' },
  { key: 'location', label: 'Court Location' },
  { key: 'profile',  label: 'Profile' },
];

/**
 * Bottom navigation bar.
 *
 * @param {{ activeTab: string, onChange: (key: string) => void }} props
 *   activeTab — key string of the currently visible screen
 *   onChange  — called with the tapped tab's key string
 */
export default function BottomTabs({ activeTab, onChange }) {
  return (
    <View style={styles.bottomTabs}>
      {TABS.map((tab) => {
        const active = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            style={({ pressed }) => [styles.bottomTab, pressed && styles.pressed]}
            onPress={() => onChange(tab.key)}
          >
            {/* Label is green when this tab is active, grey otherwise */}
            <Text
              style={[styles.bottomTabLabel, active && styles.bottomTabLabelActive]}
              numberOfLines={2}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
