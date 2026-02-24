import React from 'react';
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

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: any = 'help';
                    if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'Applications') iconName = focused ? 'document-text' : 'document-text-outline';
                    else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#0F4C5C', // Deep Teal
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: '#F3F4F6',
                    elevation: 0,
                    shadowOpacity: 0,
                    height: 85,
                    paddingBottom: 30,
                    paddingTop: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                }
            })}
        >
            <Tab.Screen name="Home" component={HomeFeedScreen} />
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
                initialRouteName="Login"
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#F9FAFB' }
                }}
            >
                {/* Auth Stack */}
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />

                {/* Main Tab Stack */}
                <Stack.Screen name="Main" component={MainTabs} />

                {/* Detail screens with custom header off (screen handles its own header) */}
                <Stack.Screen
                    name="JobDetails"
                    component={JobDetailsScreen}
                    options={{ gestureEnabled: true, fullScreenGestureEnabled: true }}
                />
                <Stack.Screen
                    name="ApplyFlow"
                    component={ApplyFlowScreen}
                    options={{ gestureEnabled: true, fullScreenGestureEnabled: true }}
                />
            </Stack.Navigator>
        </NavigationContainer>
        </SafeAreaProvider>
    );
}
