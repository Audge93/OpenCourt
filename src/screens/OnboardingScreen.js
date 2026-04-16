/**
 * FILE: src/screens/OnboardingScreen.js
 *
 * PURPOSE:
 * The one-time setup screen shown to new users before they reach the main app.
 * It collects a first name and skill level, then creates the user profile and
 * advances the app to the 'main' stage where the full UI becomes available.
 * After onboarding the tips overlay is triggered automatically so users
 * immediately learn the booking rules.
 *
 * HOW IT AFFECTS THE PROJECT:
 * - App.js renders this screen when appStage === 'onboarding' (i.e. no user
 *   profile exists yet).
 * - On submit it calls setUser (updating global user state), setAppStage to
 *   'main', and setShowTips to true — all passed down as props from App.js.
 * - The user object created here (id, firstName, skillLevel) is the same shape
 *   used everywhere slots are booked and the profile is updated.
 */

import React from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import HeaderBanner from '../components/HeaderBanner';
import { LEVELS } from '../constants/colors';
import styles from '../styles/styles';

/**
 * New-user onboarding screen.
 *
 * @param {{
 *   name: string,
 *   setName: (v: string) => void,
 *   level: string,
 *   setLevel: (v: string) => void,
 *   onSubmit: () => void,
 * }} props
 *   name      — Controlled value for the first-name text input
 *   setName   — Updater for name
 *   level     — Currently selected skill level
 *   setLevel  — Updater for level
 *   onSubmit  — Called when the Continue button is pressed with valid input
 */
export default function OnboardingScreen({ name, setName, level, setLevel, onSubmit }) {
  // The Continue button is only active once both fields have a value
  const canSubmit = name.trim().length > 0 && level.length > 0;

  return (
    <View style={styles.appShell}>
      <HeaderBanner title="Welcome!" subtitle="Enter your details to get started." />

      <View style={styles.flexContent}>
        <ScrollView contentContainerStyle={styles.screenContent}>

          {/* ── First name input ── */}
          <Text style={styles.fieldLabel}>First Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your first name"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />

          {/* ── Skill level radio group ── */}
          <Text style={[styles.fieldLabel, { marginTop: 24 }]}>Skill Level</Text>
          {LEVELS.map((lvl) => {
            const active = level === lvl;
            return (
              <Pressable
                key={lvl}
                style={({ pressed }) => [styles.radioRow, pressed && styles.pressed]}
                onPress={() => setLevel(lvl)}
              >
                {/* Outer ring turns dark green when this option is selected */}
                <View style={[styles.radioOuter, active && styles.radioOuterActive]}>
                  {active ? <View style={styles.radioInner} /> : null}
                </View>
                <Text style={styles.radioText}>{lvl}</Text>
              </Pressable>
            );
          })}

          {/* ── Submit button — disabled until both fields are filled ── */}
          <Pressable
            disabled={!canSubmit}
            onPress={onSubmit}
            style={({ pressed }) => [
              styles.primaryButton,
              !canSubmit && styles.primaryButtonDisabled,
              pressed && canSubmit && styles.pressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
          </Pressable>

        </ScrollView>
      </View>
    </View>
  );
}
