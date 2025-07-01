import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

const issuesByCategory: Record<string, { key: string; label: string; screen: string }[]> = {
  ride: [
    { key: 'cancel_fee', label: 'Review my cancellation fee', screen: 'CancellationFee' },
    { key: 'accident', label: 'I was involved in an accident', screen: 'AccidentReport' },
    { key: 'driver_unprofessional', label: 'Driver was unprofessional', screen: 'DriverUnprofessional' },
    { key: 'vehicle_unexpected', label: "My vehicle wasn't what I expected", screen: 'VehicleUnexpected' },
    { key: 'lost_item', label: 'I lost something during ride', screen: 'LostItem' },
  ],
  payments: [
    { key: 'refund', label: 'Request a refund', screen: 'PersonalInfoUpdate' },
    { key: 'payment_failed', label: 'Payment failed', screen: 'PersonalInfoUpdate' },
    { key: 'overcharged', label: 'I was overcharged', screen: 'PersonalInfoUpdate' },
  ],
  account: [
    { key: 'update_info', label: 'Update personal information', screen: 'PersonalInfoUpdate' },
    { key: 'login_issue', label: 'Login or verification issue', screen: 'PersonalInfoUpdate' },
  ],
  other: [
    { key: 'other', label: 'Other issue', screen: 'PersonalInfoUpdate' },
  ],
};

type CategoryType = 'ride' | 'payments' | 'account' | 'other';

export default function SupportCategoryScreen({ route, navigation }: any) {
  const { category } = route.params as { category: CategoryType };
  const issues = issuesByCategory[category] || [];
  const categoryTitle = {
    ride: 'Ride Issues',
    payments: 'Payments and Refunds',
    account: 'Account related Issues',
    other: 'Other Issues',
  }[category] || 'Support';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{categoryTitle}</Text>
        <View style={styles.section}>
          {issues.map((issue) => (
            <TouchableOpacity
              key={issue.key}
              style={styles.issueButton}
              onPress={() => navigation.navigate(issue.screen)}
            >
              <Text style={styles.issueText}>{issue.label}</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {/* Call/Chat Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomButton}>
          <Ionicons name="call-outline" size={20} color={Colors.primary} />
          <Text style={styles.bottomButtonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color={Colors.primary} />
          <Text style={styles.bottomButtonText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Layout.spacing.lg },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 24, color: Colors.text },
  section: { marginBottom: 32 },
  issueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 18,
    marginBottom: 14,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  issueText: { fontSize: 16, color: Colors.text, fontWeight: '500' },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  bottomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  bottomButtonText: { marginLeft: 8, fontSize: 16, color: Colors.primary, fontWeight: '600' },
}); 