import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, PRIMARY_GREEN, TITLE_COLOR } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

const issues = [
  { key: 'cancel_fee', label: 'Review my cancellation fee', screen: 'CancellationFee' },
  { key: 'accident', label: 'I was involved in an accident', screen: 'AccidentReport' },
  { key: 'driver_unprofessional', label: 'Driver was unprofessional', screen: 'DriverUnprofessional' },
  { key: 'vehicle_unexpected', label: "My vehicle wasn't what I expected", screen: 'VehicleUnexpected' },
  { key: 'lost_item', label: 'I lost something during ride', screen: 'LostItem' },
];

export default function RideIssuesScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color={TITLE_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ride Issues</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {issues.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.issueItem}
            onPress={() => navigation.navigate(item.screen)}
            accessibilityLabel={item.label}
          >
            <Text style={styles.issueText}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={22} color={Colors.gray400} />
          </TouchableOpacity>
        ))}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Why was I charged a cancellation fee?</Text>
          <Text style={styles.infoText}>
            Cancellation fees are charged to compensate drivers for their time and effort when a ride is cancelled after a driver has already been assigned.
          </Text>
          <Text style={styles.infoText}>
            If you believe this fee was charged in error, please describe your situation below and our support team will review your request.
          </Text>
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomButton} accessibilityLabel="Call Support">
          <Ionicons name="call-outline" size={20} color={PRIMARY_GREEN} />
          <Text style={styles.bottomButtonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} accessibilityLabel="Chat with Support">
          <Ionicons name="chatbubble-ellipses-outline" size={20} color={PRIMARY_GREEN} />
          <Text style={styles.bottomButtonText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.xl,
    paddingBottom: Layout.spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: Layout.fontSize.xl,
    fontWeight: 'bold',
    color: TITLE_COLOR,
  },
  content: {
    padding: Layout.spacing.lg,
    paddingBottom: 120,
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.sm,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  issueText: {
    fontSize: Layout.fontSize.md,
    color: TITLE_COLOR,
    fontWeight: '500',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 32,
    height: Layout.buttonHeight,
  },
  bottomButtonText: {
    marginLeft: 8,
    fontSize: Layout.fontSize.md,
    color: PRIMARY_GREEN,
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: Layout.spacing.lg,
  },
  infoTitle: {
    fontSize: Layout.fontSize.xl,
    fontWeight: 'bold',
    color: TITLE_COLOR,
    marginBottom: Layout.spacing.sm,
  },
  infoText: {
    fontSize: Layout.fontSize.md,
    color: TITLE_COLOR,
  },
}); 