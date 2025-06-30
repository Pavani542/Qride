import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';

// Auth Screens
import SplashScreen from '../screens/auth/SplashScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import ProfileSetupScreen from '../screens/auth/ProfileSetupScreen';

// Home Screens
import HomeScreen from '../screens/home/HomeScreen';
import LocationSearchScreen from '../screens/home/LocationSearchScreen';
import RideEstimateScreen from '../screens/home/RideEstimateScreen';
import ConfirmRideScreen from '../screens/home/ConfirmRideScreen';

// Ride Screens
import FindingDriverScreen from '../screens/ride/FindingDriverScreen';
import LiveTrackingScreen from '../screens/ride/LiveTrackingScreen';
import ChatScreen from '../screens/ride/ChatScreen';
import RideSummaryScreen from '../screens/ride/RideSummaryScreen';

// Profile Screens
import ProfileScreen from '../screens/profile/ProfileScreen';
import RideHistoryScreen from '../screens/profile/RideHistoryScreen';
import WalletScreen from '../screens/profile/WalletScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';

import { Colors } from '../constants/Colors';
import { Layout } from '../constants/Layout';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'home-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray400,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          paddingBottom: Layout.spacing.sm,
          paddingTop: Layout.spacing.sm,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: Layout.fontSize.xs,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={RideHistoryScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AuthNavigator() {
  return (
    <Stack.Navigator
      id={undefined}
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    </Stack.Navigator>
  );
}

function MainNavigator() {
  return (
    <Stack.Navigator
      id={undefined}
      initialRouteName="TabNavigator"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      {/* Main App with Tabs */}
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      
      {/* Home Flow */}
      <Stack.Screen name="LocationSearch" component={LocationSearchScreen} />
      <Stack.Screen name="RideEstimate" component={RideEstimateScreen} />
      <Stack.Screen name="ConfirmRide" component={ConfirmRideScreen} />
      
      {/* Ride Flow */}
      <Stack.Screen name="FindingDriver" component={FindingDriverScreen} />
      <Stack.Screen name="LiveTracking" component={LiveTrackingScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="RideSummary" component={RideSummaryScreen} />
      
      {/* Profile Flow */}
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { isSignedIn, isLoaded } = useAuth();

  // Show loading screen while checking auth state
  if (!isLoaded) {
    return null; // or a loading screen component
  }

  return (
    <NavigationContainer>
      {isSignedIn ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
