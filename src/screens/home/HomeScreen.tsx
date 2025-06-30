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
import { useUser } from '@clerk/clerk-expo';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { mockLocations } from '../../data/mockData';
import { getGreeting } from '../../utils/helpers';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const { user } = useUser();

  const handleLocationSearch = (type: 'pickup' | 'destination') => {
    navigation.navigate('LocationSearch', { type });
  };

  const handleQuickLocation = (location: any) => {
    navigation.navigate('RideEstimate', { destination: location });
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
            <Ionicons name="menu" size={24} color={Colors.text} />
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Map Container */}
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map" size={48} color={Colors.gray400} />
            <Text style={styles.mapText}>Map View</Text>
          </View>
          
          {/* Current Location Button */}
          <TouchableOpacity style={styles.currentLocationButton}>
            <Ionicons name="locate" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Ride Booking Card */}
        <View style={styles.bookingCard}>
          <Text style={styles.cardTitle}>Where to?</Text>
          
          <TouchableOpacity
            style={styles.locationInput}
            onPress={() => handleLocationSearch('pickup')}
          >
            <View style={styles.locationDot} />
            <Text style={styles.locationText}>Your current location</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
          </TouchableOpacity>

          <View style={styles.locationDivider} />

          <TouchableOpacity
            style={styles.locationInput}
            onPress={() => handleLocationSearch('destination')}
          >
            <View style={[styles.locationDot, styles.destinationDot]} />
            <Text style={styles.locationPlaceholder}>Where are you going?</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Ionicons name="time" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.actionText}>Schedule Ride</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('History')}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="receipt" size={24} color={Colors.accent} />
              </View>
              <Text style={styles.actionText}>Ride History</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Ionicons name="gift" size={24} color={Colors.coral} />
              </View>
              <Text style={styles.actionText}>Offers</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Ionicons name="help-circle" size={24} color={Colors.info} />
              </View>
              <Text style={styles.actionText}>Support</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Saved Places */}
        <View style={styles.savedPlaces}>
          <Text style={styles.sectionTitle}>Saved Places</Text>
          {mockLocations.map((location) => (
            <TouchableOpacity
              key={location.id}
              style={styles.savedPlaceItem}
              onPress={() => handleQuickLocation(location)}
            >
              <View style={styles.savedPlaceIcon}>
                <Ionicons
                  name={location.type === 'home' ? 'home' : 'business'}
                  size={20}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.savedPlaceInfo}>
                <Text style={styles.savedPlaceName}>{location.name}</Text>
                <Text style={styles.savedPlaceAddress}>{location.address}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Promotional Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Get 50% Off</Text>
            <Text style={styles.promoSubtitle}>On your next 3 rides</Text>
            <TouchableOpacity style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Claim Now</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.promoIcon}>
            <Ionicons name="gift" size={32} color={Colors.accent} />
          </View>
        </View>
      </ScrollView>
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
    paddingVertical: Layout.spacing.md,
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
  content: {
    flex: 1,
  },
  mapContainer: {
    height: 200,
    backgroundColor: Colors.gray100,
    margin: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: {
    marginTop: Layout.spacing.sm,
    fontSize: Layout.fontSize.md,
    color: Colors.gray400,
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
});
