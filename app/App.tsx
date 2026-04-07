import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import AnimatedSplash from './src/components/AnimatedSplash';
import { useState } from 'react';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isSplashAnimationFinished, setIsSplashAnimationFinished] = useState(false);
  const [fontsLoaded] = useFonts({
    Inter: Inter_400Regular,
    InterMedium: Inter_500Medium,
    InterSemiBold: Inter_600SemiBold,
    InterBold: Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppNavigator />
      {!isSplashAnimationFinished && (
        <AnimatedSplash onAnimationFinish={() => setIsSplashAnimationFinished(true)} />
      )}
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
