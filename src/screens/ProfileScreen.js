/**
 * FILE: src/screens/ProfileScreen.js
 *
 * PURPOSE:
 * Lets the user update their first name and skill level after onboarding.
 * Also provides a toggle to replay the first-launch tips overlay and a static
 * summary of the app's booking rules.  Saving the profile propagates the new
 * name and level to every existing slot booking so the player list always
 * reflects current profile data.
 *
 * HOW IT AFFECTS THE PROJECT:
 * - App.js renders this screen when activeTab === 'profile'.
 * - onSave is handled in App.js (saveProfile) which updates both the user
 *   state object and rewrites all matching player entries across the slots
 *   array — keeping the user's display name consistent in every booked slot.
 * - The tips toggle wires back to setShowTips in App.js so the overlay can
 *   be replayed without re-running the full onboarding flow.
 * - profileName and profileLevel are controlled locally but seeded from
 *   user.firstName and user.skillLevel via a useEffect in App.js.
 */

import React from 'react';
import { Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import BottomTabs from '../components/BottomTabs';
import HeaderBanner from '../components/HeaderBanner';
import { COLORS, LEVELS } from '../constants/colors';
import styles from '../styles/styles';

/**
 * Profile editing screen.
 *
 * @param {{
 *   profileName: string,
 *   setProfileName: (v: string) => void,
 *   profileLevel: string,
 *   setProfileLevel: (v: string) => void,
 *   onSave: () => void,
 *   showTipsAgainEnabled: boolean,
 *   setShowTipsAgainEnabled: (v: boolean) => void,
 *   setTipIndex: (v: number) => void,
 *   setShowTips: (v: boolean) => void,
 *   activeTab: string,
 *   onTabChange: (key: string) => void,
 * }} props
 */
export default function ProfileScreen({
  profileName,
  setProfileName,
  profileLevel,
  setProfileLevel,
  onSave,
  showTipsAgainEnabled,
  setShowTipsAgainEnabled,
  setTipIndex,
  setShowTips,
  activeTab,
  onTabChange,
}) {
  return (
    <View style={styles.appShell}>
      <HeaderBanner title="Profile" subtitle="Employee pickleball booking" />

      <View style={styles.flexContent}>
        <ScrollView contentContainerStyle={styles.scrollContentWithNav}>

          {/* ── Name field ── */}
          <View style={styles.profileCard}>
            <Text style={styles.profileLabel}>First Name</Text>
            <TextInput
              value={profileName}
              onChangeText={setProfileName}
              placeholder="Enter your first name"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>

          {/* ── Skill level selector ── */}
          <View style={styles.profileCard}>
            <Text style={styles.profileLabel}>Skill Level</Text>
            {LEVELS.map((level) => {
              const active = profileLevel === level;
              return (
                <Pressable
                  key={level}
                  style={({ pressed }) => [styles.radioRow, pressed && styles.pressed]}
                  onPress={() => setProfileLevel(level)}
                >
                  <View style={[styles.radioOuter, active && styles.radioOuterActive]}>
                    {active ? <View style={styles.radioInner} /> : null}
                  </View>
                  <Text style={styles.radioText}>{level}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* ── Save button ── */}
          <Pressable
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
            onPress={onSave}
          >
            <Text style={styles.primaryButtonText}>Save Profile</Text>
          </Pressable>

          {/* ── Show tips toggle ── */}
          <View style={styles.profileCard}>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Show tips again</Text>
              <Switch
                value={showTipsAgainEnabled}
                onValueChange={(value) => {
                  setShowTipsAgainEnabled(value);
                  // If the toggle is turned on, immediately replay the tips overlay
                  if (value) {
                    setTipIndex(0);
                    setShowTips(true);
                  }
                }}
                trackColor={{ false: '#D1D5DB', true: COLORS.primarySoft }}
                thumbColor={showTipsAgainEnabled ? COLORS.primary : '#fff'}
              />
            </View>
          </View>

          {/* ── Booking rules summary ── */}
          <View style={styles.profileCard}>
            <Text style={styles.rulesTitle}>Booking Rules</Text>
            <Text style={styles.profileTextLine}>• Max 2 hours per day</Text>
            <Text style={styles.profileTextLine}>• Max 1 consecutive hour</Text>
            <Text style={styles.profileTextLine}>• On Deck only when both courts are full</Text>
          </View>

        </ScrollView>

        <BottomTabs activeTab={activeTab} onChange={onTabChange} />
      </View>
    </View>
  );
}
