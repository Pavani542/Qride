import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

export default function LiveTrackingScreen({ navigation, route }: any) {
  const { destination, estimate, driver } = route.params;
  const [rideStatus, setRideStatus] = useState('arriving'); // arriving, picked_up, in_progress
  const [currentETA, setCurrentETA] = useState(driver.eta);

  useEffect(() => {
    // Simulate ride progression
    const timer1 = setTimeout(() => {
      setRideStatus('picked_up');
      setCurrentETA(estimate.duration);
    }, 5000);

    const timer2 = setTimeout(() => {
      setRideStatus('in_progress');
    }, 8000);

    const timer3 = setTimeout(() => {
      handleCompleteRide();
    }, 15000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleChat = () => {
    navigation.navigate('Chat', { driver });
  };

  const handleCall = () => {
    // Handle call functionality
    console.log('Calling driver...');
  };

  const handleSOS = () => {
    // Handle SOS functionality
    console.log('SOS activated');
  };

  const handleCompleteRide = () => {
    navigation.navigate('RideSummary', {
      destination,
      estimate,
      driver,
    });
  };

  const getStatusText = () => {
    switch (rideStatus) {
      case 'arriving':
        return `${driver.name} is arriving in ${currentETA} mins`;
      case 'picked_up':
        return 'Ride started - Heading to destination';
      case 'in_progress':
        return `${currentETA} mins to destination`;
      default:
        return 'Tracking your ride...';
    }
  };

  const getProgressPercentage = () => {
    switch (rideStatus) {
      case 'arriving':
        return '33%';
      case 'picked_up':
        return '66%';
      case 'in_progress':
        return '100%';
      default:
        return '0%';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Map Container */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={48} color={Colors.gray400} />
          <Text style={styles.mapText}>Live Tracking</Text>
          <Text style={styles.statusIndicator}>{rideStatus.replace('_', ' ').toUpperCase()}</Text>
        </View>

        {/* Status Overlay */}
        <View style={styles.statusOverlay}>
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: getProgressPercentage() },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <Ionicons name="call" size={20} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleChat}>
            <Ionicons name="chatbubble" size={20} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.sosButton]} onPress={handleSOS}>
            <Ionicons name="warning" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Driver Info Card */}
      <View style={styles.driverCard}>
        <View style={styles.driverInfo}>
          <Image source={{ uri: driver.photo }} style={styles.driverPhoto} />
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>{driver.name}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={Colors.accent} />
              <Text style={styles.rating}>{driver.rating}</Text>
            </View>
            <Text style={styles.vehicleInfo}>
              {driver.vehicleModel} • {driver.vehicleNumber}
            </Text>
          </View>
          <View style={styles.etaContainer}>
            <Text style={styles.etaText}>{currentETA} min</Text>
            <Text style={styles.etaLabel}>ETA</Text>
          </View>
        </View>
      </View>

      {/* Trip Info */}
      <View style={styles.tripCard}>
        <View style={styles.routeInfo}>
          <View style={styles.routePoint}>
            <View style={styles.pickupDot} />
            <View style={styles.routeDetails}>
              <Text style={styles.routeLabel}>Pickup</Text>
              <Text style={styles.routeAddress}>Your current location</Text>
            </View>
          </View>

          <View style={styles.routeLine} />

          <View style={styles.routePoint}>
            <View style={styles.destinationDot} />
            <View style={styles.routeDetails}>
              <Text style={styles.routeLabel}>Destination</Text>
              <Text style={styles.routeAddress}>{destination.name}</Text>
            </View>
          </View>
        </View>

        <View style={styles.tripActions}>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share" size={16} color={Colors.primary} />
            <Text style={styles.shareText}>Share Trip</Text>
          </TouchableOpacity>
          
          {rideStatus === 'in_progress' && (
            <TouchableOpacity style={styles.completeButton} onPress={handleCompleteRide}>
              <Text style={styles.completeText}>Complete Ride</Text>
            </TouchableOpacity>
          )}
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
  mapContainer: {
    flex: 1,
    backgroundColor: Colors.gray100,
    position: 'relative',
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
  statusIndicator: {
    marginTop: Layout.spacing.sm,
    fontSize: Layout.fontSize.sm,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statusOverlay: {
    position: 'absolute',
    top: Layout.spacing.lg,
    left: Layout.spacing.lg,
    right: Layout.spacing.lg,
  },
  statusContainer: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusText: {
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Layout.spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.gray200,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  actionButtons: {
    position: 'absolute',
    bottom: Layout.spacing.lg,
    right: Layout.spacing.lg,
    flexDirection: 'column',
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.spacing.sm,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sosButton: {
    backgroundColor: Colors.error,
  },
  driverCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Layout.spacing.lg,
    marginTop: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: Layout.spacing.md,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: Layout.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  rating: {
    marginLeft: Layout.spacing.xs,
    fontSize: Layout.fontSize.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  vehicleInfo: {
    fontSize: Layout.fontSize.sm,
    color: Colors.textSecondary,
  },
  etaContainer: {
    alignItems: 'center',
  },
  etaText: {
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  etaLabel: {
    fontSize: Layout.fontSize.xs,
    color: Colors.textSecondary,
  },
  tripCard: {
    backgroundColor: Colors.white,
    margin: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  routeInfo: {
    marginBottom: Layout.spacing.md,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickupDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    marginRight: Layout.spacing.md,
  },
  destinationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.coral,
    marginRight: Layout.spacing.md,
  },
  routeDetails: {
    flex: 1,
    paddingVertical: Layout.spacing.sm,
  },
  routeLabel: {
    fontSize: Layout.fontSize.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  routeAddress: {
    fontSize: Layout.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: Colors.gray300,
    marginLeft: 5,
    marginVertical: 4,
  },
  tripActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.sm,
  },
  shareText: {
    marginLeft: Layout.spacing.xs,
    fontSize: Layout.fontSize.sm,
    fontWeight: '600',
    color: Colors.primary,
  },
  completeButton: {
    backgroundColor: Colors.success,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.sm,
  },
  completeText: {
    fontSize: Layout.fontSize.sm,
    fontWeight: '600',
    color: Colors.white,
  },
});
