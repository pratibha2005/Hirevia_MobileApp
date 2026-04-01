import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
  primaryLight:'#EEF2FF',
  inactive:    '#9CA3AF',
  surface:     '#FFFFFF',
  border:      '#F1F5F9',
  background:  '#F8FAFC',
};

// ─── Tab icon with badge ──────────────────────────────────────────────────────
function TabIcon({ name, focused, badge }: { name: string; focused: boolean; badge?: number }) {
  return (
    <View style={tabStyles.iconWrapper}>
      {focused && <View style={tabStyles.activePill} />}
      <Ionicons
        name={name as any}
        size={22}
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
  iconWrapper: { alignItems: 'center', justifyContent: 'center', position: 'relative', width: 32, height: 32 },
  activePill:  { position: 'absolute', top: -2, left: -6, right: -6, bottom: -2, borderRadius: 10, backgroundColor: NAV.primaryLight },
  badge:       { position: 'absolute', top: -2, right: -6, backgroundColor: '#EF4444', width: 14, height: 14, borderRadius: 7, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: NAV.surface },
  badgeText:   { fontSize: 8, fontWeight: '800', color: '#FFF' },
});

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
          fontWeight: '600',
          marginTop: 2,
          letterSpacing: 0.1,
        },
        tabBarStyle: {
          backgroundColor: NAV.surface,
          borderTopWidth: 1,
          borderTopColor: NAV.border,
          height: 74,
          paddingBottom: 18,
          paddingTop: 8,
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
        },
        tabBarItemStyle: {
          paddingTop: 2,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeFeedScreen} options={{ title: 'Discover' }} />
      <Tab.Screen name="Applications" component={ApplicationsScreen} options={{ title: 'Applications' }} />
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
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: NAV.background },
            animation: 'slide_from_right',
          }}
        >
          {/* Auth */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />

          {/* Main */}
          <Stack.Screen name="Main" component={MainTabs} options={{ animation: 'fade' }} />

          {/* Detail screens */}
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
