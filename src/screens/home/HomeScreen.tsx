import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { mockLocations } from '../../data/mockData';
import { getGreeting, useAssignUserType } from '../../utils/helpers';
import MapView, { Marker } from 'react-native-maps';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { useLocationStore } from '../../store/useLocationStore';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation, route }: any) {
  const { user } = useUser();
  const {
    pickupLocation,
    setPickupLocation,
    currentLocation,
    setCurrentLocation,
    dropoffLocation,
    setDropoffLocation,
  } = useLocationStore();
  const { getToken } = useAuth();

  const [region, setRegion] = useState({
    latitude: 28.6139, // Default: New Delhi
    longitude: 77.2090,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [dropLocation, setDropLocation] = useState<any>(null);

  useAssignUserType('user');

  // On mount, get current location and set as pickup if not set
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        address: 'Current Location',
      };
      setCurrentLocation(coords);
      if (!pickupLocation) {
        setPickupLocation(coords);
      }
      setRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When pickup or dropoff location changes, update map region
  useEffect(() => {
    if (dropoffLocation) {
      setRegion((prev) => ({
        ...prev,
        latitude: dropoffLocation.latitude,
        longitude: dropoffLocation.longitude,
      }));
    } else if (pickupLocation) {
      setRegion((prev) => ({
        ...prev,
        latitude: pickupLocation.latitude,
        longitude: pickupLocation.longitude,
      }));
    }
  }, [pickupLocation, dropoffLocation]);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      console.log('Clerk JWT token:', token);
    })();
  }, [getToken]);

  useEffect(() => {
    if (route.params?.destination) {
      setDropLocation(route.params.destination);
    }
  }, [route.params?.destination]);

  const handleLocationSearch = (type: 'pickup' | 'destination') => {
    navigation.navigate('LocationSearch', { type });
  };

  const handleQuickLocation = (location: any) => {
    navigation.navigate('RideEstimate', { destination: location });
  };

  const handleRideHistory = () => {
    // Navigate to the History tab
    navigation.navigate('History');
  };

  const handleSupport = () => {
    navigation.navigate('HelpSupport');
  };

  const getUserName = () => {
    if (user?.firstName) {
      return user.firstName;
    } else if (user?.fullName) {
      return user.fullName.split(' ')[0];
    }
    return 'User';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="map" size={24} color={Colors.text} />
          </TouchableOpacity>
          <View>
            <Text style={styles.greeting}>{getGreeting()}!</Text>
            <Text style={styles.userName}>{getUserName()}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications" size={24} color={Colors.text} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <View style={styles.mapFullScreen}>
        <MapView
          style={StyleSheet.absoluteFill}
          region={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {pickupLocation && (
            <Marker
              coordinate={{
                latitude: pickupLocation.latitude,
                longitude: pickupLocation.longitude,
              }}
              title={pickupLocation.address || 'Pickup Location'}
              pinColor={'green'}
            />
          )}
          {dropoffLocation && (
            <Marker
              coordinate={{
                latitude: dropoffLocation.latitude,
                longitude: dropoffLocation.longitude,
              }}
              title={dropoffLocation.address || 'Destination'}
              pinColor={'red'}
            />
          )}
        </MapView>
        {/* Current Location Button */}
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={async () => {
            let loc = await Location.getCurrentPositionAsync({});
            const coords = {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
              address: 'Current Location',
            };
            setCurrentLocation(coords);
            setPickupLocation(coords);
            setRegion({
              latitude: coords.latitude,
              longitude: coords.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            });
          }}
        >
          <Ionicons name="locate" size={20} color={Colors.primary} />
        </TouchableOpacity>
        {/* Where to? Card Overlay */}
        <View style={styles.whereToCard}>
          <Text style={styles.whereToTitle}>Where to?</Text>
          <TouchableOpacity style={styles.whereToRow} activeOpacity={0.7}>
            <View style={[styles.dot, { backgroundColor: 'green' }]} />
            <Text style={styles.whereToText}>Current Location</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.whereToRow}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('DropLocationSelector')}
          >
            <View style={[styles.dot, { backgroundColor: 'red' }]} />
            <Text style={styles.whereToText}>
              {dropLocation ? dropLocation.name : 'Where are you going?'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#aaa" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginRight: Layout.spacing.md,
  },
  greeting: {
    fontSize: Layout.fontSize.sm,
    color: Colors.textSecondary,
  },
  userName: {
    fontSize: Layout.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.coral,
  },
  mapFullScreen: {
    flex: 1,
    position: 'relative',
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: Layout.spacing.md,
    right: Layout.spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.lg,
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    marginRight: Layout.spacing.md,
  },
  destinationDot: {
    backgroundColor: Colors.coral,
  },
  locationText: {
    flex: 1,
    fontSize: Layout.fontSize.md,
    color: Colors.text,
  },
  locationPlaceholder: {
    flex: 1,
    fontSize: Layout.fontSize.md,
    color: Colors.gray400,
  },
  locationDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginLeft: 24,
    marginVertical: Layout.spacing.xs,
  },
  quickActions: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: (width - Layout.spacing.lg * 3) / 2,
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.spacing.sm,
  },
  actionText: {
    fontSize: Layout.fontSize.sm,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  savedPlaces: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  savedPlaceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  savedPlaceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  savedPlaceInfo: {
    flex: 1,
  },
  savedPlaceName: {
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  savedPlaceAddress: {
    fontSize: Layout.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  promoBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    alignItems: 'center',
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.white,
  },
  promoSubtitle: {
    fontSize: Layout.fontSize.sm,
    color: Colors.white,
    opacity: 0.9,
    marginTop: 2,
    marginBottom: Layout.spacing.md,
  },
  promoButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    fontSize: Layout.fontSize.sm,
    fontWeight: '600',
    color: Colors.primary,
  },
  promoIcon: {
    marginLeft: Layout.spacing.md,
  },
  bookingCardFloating: {
    position: 'absolute',
    left: Layout.spacing.sm,
    right: Layout.spacing.sm,
    bottom: Layout.spacing.sm, // leave space for bottom nav
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  whereToCard: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 24,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
  },
  whereToTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  whereToRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 14,
  },
  whereToText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginVertical: 4,
    borderRadius: 1,
  },
});