import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Share,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import Button from '../../components/common/Button';
import { mockDrivers } from '../../data/mockData';

export default function ConfirmRideScreen({ navigation, route }: any) {
  const { destination, estimate, paymentMethod } = route.params;
  const [selectedDriver] = useState(mockDrivers[0]);

  const handleBookRide = () => {
    navigation.navigate('FindingDriver', {
      destination,
      estimate,
      paymentMethod,
      driver: selectedDriver,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Ride</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Driver Info */}
        <View style={styles.driverCard}>
          <View style={styles.driverHeader}>
            <Text style={styles.driverTitle}>Your Driver</Text>
            <View style={styles.etaContainer}>
              <Ionicons name="time" size={16} color={Colors.primary} />
              <Text style={styles.etaText}>{selectedDriver.eta} mins away</Text>
            </View>
          </View>

          <View style={styles.driverInfo}>
            <Image
              source={{ uri: selectedDriver.photo }}
              style={styles.driverPhoto}
            />
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{selectedDriver.name}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color={Colors.accent} />
                <Text style={styles.rating}>{selectedDriver.rating}</Text>
              </View>
              <Text style={styles.vehicleInfo}>
                {selectedDriver.vehicleModel} • {selectedDriver.vehicleNumber}
              </Text>
            </View>
            <TouchableOpacity style={styles.callButton}>
              <Ionicons name="call" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Trip Summary */}
        <View style={styles.tripCard}>
          <Text style={styles.tripTitle}>Trip Summary</Text>
          
          <View style={styles.tripRoute}>
            <View style={styles.routePoint}>
              <View style={styles.pickupDot} />
              <View style={styles.routeInfo}>
                <Text style={styles.routeLabel}>Pickup</Text>
                <Text style={styles.routeAddress}>Your current location</Text>
              </View>
            </View>

            <View style={styles.routeLine} />

            <View style={styles.routePoint}>
              <View style={styles.destinationDot} />
              <View style={styles.routeInfo}>
                <Text style={styles.routeLabel}>Destination</Text>
                <Text style={styles.routeAddress}>{destination.name}</Text>
              </View>
            </View>
          </View>

          <View style={styles.tripStats}>
            <View style={styles.statItem}>
              <Ionicons name="location" size={16} color={Colors.primary} />
              <Text style={styles.statText}>{estimate.distance}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time" size={16} color={Colors.accent} />
              <Text style={styles.statText}>{estimate.duration}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="cash" size={16} color={Colors.success} />
              <Text style={styles.statText}>₹{estimate.fare}</Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.paymentCard}>
          <Text style={styles.paymentTitle}>Payment Method</Text>
          <View style={styles.paymentMethod}>
            <Ionicons
              name={paymentMethod === 'cash' ? 'cash' : 'card'}
              size={20}
              color={Colors.primary}
            />
            <Text style={styles.paymentText}>
              {paymentMethod === 'cash' ? 'Cash' : paymentMethod === 'upi' ? 'UPI' : 'Wallet'}
            </Text>
            <TouchableOpacity>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Safety Features */}
        <View style={styles.safetyCard}>
          <Text style={styles.safetyTitle}>Safety Features</Text>
          <View style={styles.safetyFeatures}>
            <View style={styles.safetyFeature}>
              <Ionicons name="shield-checkmark" size={20} color={Colors.success} />
              <Text style={styles.safetyText}>Live tracking</Text>
            </View>
            <View style={styles.safetyFeature}>
              <TouchableOpacity
                style={styles.safetyFeature}
                onPress={() => {
                  Linking.openURL(`tel:${emergencyPhone}`);
                }}
              >
                <Ionicons name="call" size={20} color={Colors.success} />
                <Text style={styles.safetyText}>Emergency contact</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.safetyFeature}>
              <TouchableOpacity
                style={styles.safetyFeature}
                onPress={async () => {
                  try {
                    await Share.share({
                      message: 'I am sharing my trip with you! Track my ride here: [insert trip link or details]',
                    });
                  } catch (error) {
                    console.log('Error sharing trip:', error);
                  }
                }}
              >
                <Ionicons name="share" size={20} color={Colors.success} />
                <Text style={styles.safetyText}>Share trip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <View style={styles.fareDisplay}>
          <Text style={styles.fareLabel}>Total Fare</Text>
          <Text style={styles.fareValue}>₹{estimate.fare}</Text>
        </View>
        <Button
          title="Book Ride"
          onPress={handleBookRide}
          style={styles.bookButton}
        />
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
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    marginRight: Layout.spacing.md,
  },
  headerTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  content: {
    flex: 1,
  },
  driverCard: {
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
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  driverTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  etaText: {
    marginLeft: Layout.spacing.xs,
    fontSize: Layout.fontSize.sm,
    fontWeight: '600',
    color: Colors.primary,
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
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tripTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  tripRoute: {
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
  routeInfo: {
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
  tripStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: Layout.spacing.xs,
    fontSize: Layout.fontSize.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  paymentCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  paymentTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    flex: 1,
    marginLeft: Layout.spacing.md,
    fontSize: Layout.fontSize.md,
    color: Colors.text,
  },
  changeText: {
    fontSize: Layout.fontSize.sm,
    fontWeight: '600',
    color: Colors.primary,
  },
  safetyCard: {
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
  safetyTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  safetyFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  safetyFeature: {
    alignItems: 'center',
  },
  safetyText: {
    marginTop: Layout.spacing.xs,
    fontSize: Layout.fontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  bottomAction: {
    backgroundColor: Colors.white,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  fareDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  fareLabel: {
    fontSize: Layout.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  fareValue: {
    fontSize: Layout.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  bookButton: {
    marginTop: Layout.spacing.sm,
  },
});
