import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-expo';

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} mins`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

export const formatDistance = (kilometers: number): string => {
  if (kilometers < 1) {
    return `${Math.round(kilometers * 1000)} m`;
  }
  return `${kilometers.toFixed(1)} km`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatPhoneNumber = (phone: string): string => {
  // Format phone number as +91 XXXXX XXXXX
  if (phone.length === 10) {
    return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
  }
  return phone;
};

export const generateRideId = (): string => {
  return `RIDE${Date.now().toString().slice(-6)}`;
};

export const calculateETA = (distance: number, averageSpeed: number = 25): number => {
  // Calculate ETA in minutes based on distance (km) and average speed (km/h)
  return Math.round((distance / averageSpeed) * 60);
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

/**
 * Custom hook to assign unsafeMetadata.type = "user" to Clerk user if not already set.
 * @param {string} type - The user type to assign (e.g., "user").
 */
export function useAssignUserType(type: string) {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;
    // Only assign if not already set
    if (user.unsafeMetadata?.type !== type) {
      user.update({ unsafeMetadata: { ...user.unsafeMetadata, type } });
    }
  }, [isLoaded, user, type]);
}
