import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';
import RotatingText from './RotatingText';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashProps {
  onAnimationFinish: () => void;
}

export default function AnimatedSplash({ onAnimationFinish }: AnimatedSplashProps) {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start fading out after a short duration
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        onAnimationFinish();
      });
    }, 2800); // Extended duration slightly to allow flip animation to settle

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Animated.View style={[styles.content]}>
        <RotatingText />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F3F3F3', // Matches app.json
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ scale: 0.85 }], // Architectural sizing
  },
});
