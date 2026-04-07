import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, Animated, Easing } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeFeedScreen from '../screens/main/HomeFeedScreen';
import JobSearchScreen from '../screens/main/JobSearchScreen';
import JobDetailsScreen from '../screens/main/JobDetailsScreen';
import ApplyFlowScreen from '../screens/main/ApplyFlowScreen';
import ApplicationsScreen from '../screens/main/ApplicationsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ─── Design Tokens ────────────────────────────────────────────────────────────
const NAV = {
  primary:     '#1e3a5f', // Navy Indigo
  inactive:    '#94a3b8', // Slate clean
  background:  '#F7F9FB', // Surface Bright
  pill:        'rgba(30, 58, 95, 0.08)', // Tonal liquid background
};

// ─── Custom Tab Bar (Liquid Matte Slider - Native Animated) ─────────────────
function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const tabWidth = (SCREEN_WIDTH - 32) / state.routes.length;
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: state.index * tabWidth,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, [state.index]);

  return (
    <View style={tabStyles.container}>
      <BlurView intensity={80} tint="light" style={tabStyles.blurBackground}>
        <View style={tabStyles.inner}>
          {/* Animated Liquid Pill */}
          <Animated.View 
            style={[
              tabStyles.pill, 
              { width: tabWidth, transform: [{ translateX }] }
            ]} 
          />

          {/* Tab Buttons */}
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
            };

            const iconName = (() => {
              if (route.name === 'Home') return isFocused ? 'view-grid' : 'view-grid-outline';
              if (route.name === 'Search') return 'magnify';
              if (route.name === 'Applications') return isFocused ? 'file-document' : 'file-document-outline';
              if (route.name === 'Profile') return isFocused ? 'account' : 'account-outline';
              return 'help-circle-outline';
            })();

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                activeOpacity={1}
                style={tabStyles.tabItem}
              >
                <TabIcon name={iconName} focused={isFocused} />
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: focused ? 1.15 : 1,
        useNativeDriver: true,
        friction: 5,
      }),
      Animated.timing(opacity, {
        toValue: focused ? 1 : 0.6,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  }, [focused]);

  return (
    <Animated.View style={[tabStyles.iconWrapper, { transform: [{ scale }], opacity }]}>
      <MaterialCommunityIcons name={name as any} size={24} color={focused ? NAV.primary : NAV.inactive} />
      {focused && <View style={tabStyles.activeIndicator} />}
    </Animated.View>
  );
}

const tabStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  blurBackground: { ...StyleSheet.absoluteFillObject },
  inner: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  tabItem: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center' },
  pill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: NAV.pill,
    borderRadius: 32,
  },
  iconWrapper: { alignItems: 'center', justifyContent: 'center' },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: NAV.primary,
  },
});

// ─── Navigator ────────────────────────────────────────────────────────────────
function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeFeedScreen} />
      <Tab.Screen name="Search" component={JobSearchScreen} />
      <Tab.Screen name="Applications" component={ApplicationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Main"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: NAV.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Main" component={MainTabs} options={{ animation: 'fade' }} />
          <Stack.Screen
            name="JobDetails"
            component={JobDetailsScreen}
            options={{ gestureEnabled: true, fullScreenGestureEnabled: true }}
          />
          <Stack.Screen
            name="ApplyFlow"
            component={ApplyFlowScreen}
            options={{ gestureEnabled: true, fullScreenGestureEnabled: true, animation: 'slide_from_bottom' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
