import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ─── Design Tokens ────────────────────────────────────────────────────────────
const NAV = {
  primary:     '#1e3a5f', // Navy Indigo (Atelier)
  inactive:    '#94a3b8', // Slate clean
  background:  '#F7F9FB', // Surface Bright
};

// ─── Tab icon with high-density minimal styling ──────────────────────────────
function TabIcon({ name, focused, badge }: { name: string; focused: boolean; badge?: number }) {
  return (
    <View style={tabStyles.iconWrapper}>
      <MaterialCommunityIcons
        name={name as any}
        size={22}
        color={focused ? NAV.primary : NAV.inactive}
      />
      {badge !== undefined && badge > 0 && (
        <View style={tabStyles.badge}>
          <Text style={tabStyles.badgeText}>{badge}</Text>
        </View>
      )}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconWrapper: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  badge:       { position: 'absolute', top: -4, right: -6, backgroundColor: '#9e3f4e', // Archive error red
                 minWidth: 14, height: 14, borderRadius: 7, alignItems: 'center', justifyContent: 'center',
                 borderWidth: 1.5, borderColor: '#F7F9FB' },
  badgeText:   { fontSize: 7, fontWeight: '900', color: '#FFF' },
});

function CustomTabBarBackground() {
  return (
    <BlurView 
      intensity={60} 
      tint="light" 
      style={[StyleSheet.absoluteFill, { borderRadius: 40, overflow: 'hidden' }]} 
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
          let iconName = 'help-circle-outline';
          if (route.name === 'Home') iconName = focused ? 'view-grid' : 'view-grid-outline';
          else if (route.name === 'Search') iconName = focused ? 'magnify' : 'magnify';
          else if (route.name === 'Applications') iconName = focused ? 'file-document' : 'file-document-outline';
          else if (route.name === 'Profile') iconName = focused ? 'account' : 'account-outline';
          const badge = route.name === 'Applications' ? 2 : undefined;
          return <TabIcon name={iconName} focused={focused} badge={badge} />;
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: NAV.primary,
        tabBarInactiveTintColor: NAV.inactive,
        tabBarLabelStyle: {
          fontSize: 8,
          fontWeight: '800',
          letterSpacing: 2,
          marginTop: 2,
          textTransform: 'uppercase',
        },
        tabBarBackground: CustomTabBarBackground,
        tabBarStyle: {
          position: 'absolute',
          bottom: 40,
          left: 60,
          right: 60,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
          backgroundColor: 'rgba(255,255,255,0.75)',
          borderTopWidth: 0,
          borderRadius: 40,
          elevation: 0,
          shadowColor: '#2a3439',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.18,
          shadowRadius: 40,
          borderWidth: 1.5,
          borderColor: 'rgba(255,255,255,0.95)',
        },
        tabBarItemStyle: {
          paddingTop: 4,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeFeedScreen} options={{ title: 'Discover' }} />
      <Tab.Screen name="Search" component={JobSearchScreen} options={{ title: 'Search' }} />
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
