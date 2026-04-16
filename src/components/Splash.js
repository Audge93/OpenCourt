/**
 * FILE: src/components/Splash.js
 *
 * PURPOSE:
 * The animated launch screen shown while the app initialises.  It plays a
 * one-time paddle-and-ball animation — a pickleball drops in from off-screen,
 * bounces, gets hit by the paddle, and flies away — then calls onDone so the
 * app can transition to onboarding or the main screen.
 *
 * HOW IT AFFECTS THE PROJECT:
 * - App.js renders <Splash> first (appStage === 'splash') and passes an
 *   onDone callback that advances appStage to 'onboarding' or 'main'.
 * - The animation uses React Native's Animated API with native driver enabled
 *   so it runs on the UI thread without blocking JS.
 * - All visual assets (OC_big_logo.png) must exist in the project's
 *   assets/ folder at the root level for the require() calls to resolve.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, Text, View } from 'react-native';
import styles from '../styles/styles';

/**
 * Splash screen component.
 *
 * @param {{ onDone: () => void }} props
 *   onDone — called after the animation completes and a short pause elapses.
 */
export default function Splash({ onDone }) {
  // ── Animated values ────────────────────────────────────────────────────────
  // ballX / ballY control the pickleball's position on screen.
  const ballX = useRef(new Animated.Value(-185)).current;
  const ballY = useRef(new Animated.Value(-250)).current;

  // paddleRotate drives the swing angle; paddleShiftX adds a slight lunge.
  const paddleRotate = useRef(new Animated.Value(0)).current;
  const paddleShiftX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // ── Phase 1: ball drops in from upper-left ──────────────────────────────
    const incomingDrop = Animated.parallel([
      Animated.timing(ballX, {
        toValue: -72,
        duration: 1470,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(ballY, {
        toValue: 122,
        duration: 1470,
        easing: Easing.in(Easing.cubic), // Accelerates as it falls
        useNativeDriver: true,
      }),
    ]);

    // ── Phase 2: ball bounces upward toward the paddle ─────────────────────
    const bounceUp = Animated.parallel([
      Animated.timing(ballX, {
        toValue: 4,
        duration: 540,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(ballY, {
        toValue: 26,
        duration: 540,
        easing: Easing.out(Easing.cubic), // Decelerates as it rises
        useNativeDriver: true,
      }),
    ]);

    // ── Phase 3a: paddle winds up before contact ───────────────────────────
    const preSwing = Animated.parallel([
      Animated.timing(paddleRotate, {
        toValue: 0.35,
        duration: 165,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(paddleShiftX, {
        toValue: -3,
        duration: 165,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    // ── Phase 3b: paddle follows through; ball launches to upper-right ─────
    const contactAndReturn = Animated.parallel([
      Animated.timing(paddleRotate, {
        toValue: 1,
        duration: 255,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(paddleShiftX, {
        toValue: -10,
        duration: 255,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(ballX, {
        toValue: -255,
        duration: 750,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(ballY, {
        toValue: -78,
        duration: 750,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    // ── Phase 4: paddle returns to rest position ───────────────────────────
    const paddleRecover = Animated.parallel([
      Animated.timing(paddleRotate, {
        toValue: 0,
        duration: 390,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(paddleShiftX, {
        toValue: 0,
        duration: 390,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    // Run all phases in sequence; after the last phase pause 2s then exit
    Animated.sequence([
      incomingDrop,
      Animated.parallel([
        bounceUp,
        Animated.sequence([Animated.delay(345), preSwing]),
      ]),
      contactAndReturn,
      paddleRecover,
    ]).start(() => {
      setTimeout(onDone, 2000);
    });
  }, [ballX, ballY, paddleRotate, paddleShiftX, onDone]);

  // Convert the 0–1 paddleRotate value to a degree string for the transform
  const paddleRotation = paddleRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-24deg'],
  });

  return (
    <View style={styles.splashContainer}>
      {/* Animation stage — fixed-size area where paddle and ball move */}
      <View style={styles.stage}>
        {/* Paddle — translates and rotates during the swing animation */}
        <Animated.View
          style={[
            styles.paddleWrap,
            {
              transform: [{ translateX: paddleShiftX }, { rotate: paddleRotation }],
            },
          ]}
        >
          <View style={styles.paddleFace}>
            <View style={styles.handle} />
          </View>
        </Animated.View>

        {/* Pickleball — moves independently of the paddle */}
        <Animated.View
          style={[
            styles.ball,
            {
              transform: [{ translateX: ballX }, { translateY: ballY }],
            },
          ]}
        />
      </View>

      {/* Brand lockup below the animation */}
      <View style={styles.splashBrandWrap}>
        <Image
          source={require('../../assets/OC_Big_Logo.png')}
          style={styles.splashLogo}
          resizeMode="contain"
        />
        <Text style={styles.splashTagline}>Pickleball Scheduler</Text>
      </View>
    </View>
  );
}
