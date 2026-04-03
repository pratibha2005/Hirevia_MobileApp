import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeFeedScreen from '../screens/main/HomeFeedScreen';
import JobDetailsScreen from '../screens/main/JobDetailsScreen';
import ApplyFlowScreen from '../screens/main/ApplyFlowScreen';
import ApplicationsScreen from '../screens/main/ApplicationsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ─── Design Tokens ────────────────────────────────────────────────────────────
const NAV = {
  primary:     '#4F46E5',
  primaryLight:'rgba(79, 70, 229, 0.15)',
  inactive:    '#9CA3AF',
  surface:     'transparent',
  background:  '#F8FAFC',
};

// ─── Tab icon with badge ──────────────────────────────────────────────────────
function TabIcon({ name, focused, badge }: { name: string; focused: boolean; badge?: number }) {
  return (
    <View style={tabStyles.iconWrapper}>
      {focused && <View style={tabStyles.activePill} />}
      <Ionicons
        name={name as any}
        size={20}
        color={focused ? NAV.primary : NAV.inactive}
      />
      {badge !== undefined && badge > 0 && (
        <View style={tabStyles.badge}>
          <Text style={tabStyles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
        </View>
      )}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconWrapper: { alignItems: 'center', justifyContent: 'center', position: 'relative', width: 36, height: 36 },
  activePill:  { position: 'absolute', width: 36, height: 36, borderRadius: 12, backgroundColor: NAV.primaryLight },
  badge:       { position: 'absolute', top: -2, right: -4, backgroundColor: '#EF4444', width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#FFF' },
  badgeText:   { fontSize: 9, fontWeight: '800', color: '#FFF' },
});

function CustomTabBarBackground() {
  return (
    <BlurView 
      intensity={80} 
      tint="light" 
      style={[StyleSheet.absoluteFill, { borderRadius: 24, overflow: 'hidden' }]} 
    />
  );
}

// ─── Main Tabs ────────────────────────────────────────────────────────────────
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          let iconName = 'help';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Applications') iconName = focused ? 'document-text' : 'document-text-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          const badge = route.name === 'Applications' ? 2 : undefined;
          return <TabIcon name={iconName} focused={focused} badge={badge} />;
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: NAV.primary,
        tabBarInactiveTintColor: NAV.inactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'InterSemiBold',
          marginTop: 4,
        },
        tabBarBackground: CustomTabBarBackground,
        tabBarStyle: {
          position: 'absolute',
          bottom: 24,
          left: 20,
          right: 20,
          height: 72,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: 'rgba(255,255,255,0.4)',
          borderTopWidth: 0,
          borderRadius: 24,
          elevation: 0,
          shadowColor: '#4F46E5',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.8)',
        },
        tabBarItemStyle: {
          paddingTop: 6,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeFeedScreen} options={{ title: 'Discover' }} />
      <Tab.Screen name="Applications" component={ApplicationsScreen} options={{ title: 'Applied' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

// ─── App Navigator ────────────────────────────────────────────────────────────
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
