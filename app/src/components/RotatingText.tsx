import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Easing } from 'react-native';

const CHARS = ['H', 'I', 'R', 'E', 'V', 'I', 'A'];

export default function RotatingText() {
  const animations = useRef(CHARS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animationSequence = CHARS.map((_, i) => {
      return Animated.timing(animations[i], {
        toValue: 1,
        duration: 800,
        delay: i * 120, // Stagger effect
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      });
    });

    Animated.parallel(animationSequence).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.textRow}>
        {CHARS.map((char, i) => (
          <Animated.View
            key={i}
            style={[
              styles.charBox,
              {
                opacity: animations[i],
                transform: [
                  {
                    rotateX: animations[i].interpolate({
                      inputRange: [0, 1],
                      outputRange: ['90deg', '0deg'],
                    }),
                  },
                  {
                    translateY: animations[i].interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={[styles.char, i >= 4 && styles.charBold]}>{char}</Text>
          </Animated.View>
        ))}
      </View>
      <View style={styles.underline} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  charBox: {
    marginHorizontal: 1,
  },
  char: {
    fontSize: 52,
    color: '#1A1A1A',
    fontWeight: '200', // HIRE
    letterSpacing: -1,
  },
  charBold: {
    fontWeight: '900', // VIA
    letterSpacing: -2,
  },
  underline: {
    width: 60,
    height: 1.5,
    backgroundColor: '#1A1A1A',
    marginTop: 12,
    opacity: 0.1,
  },
});
