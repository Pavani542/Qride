import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, PRIMARY_GREEN, TITLE_COLOR, SUBTITLE_COLOR } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

const mockRide = {
  pickup: '123 Main St',
  destination: '456 Park Ave',
  rider: 'Amit Kumar',
  eta: '3 min',
  status: 'approaching', // could be 'approaching', 'arrived', 'started'
  bookingTime: Date.now() - 60 * 1000, // 1 min ago
};

const cancellationReasons = [
  'Change of plans',
  'Rider taking too long to arrive',
  'Found alternative transportation',
  'Emergency situation',
  'Incorrect pickup location',
  'Weather conditions',
  'App/booking issues',
  'Other',
];

function getCancellationFee(status: string, bookingTime: number) {
  // Free if within 2 min, else graduated fee
  const now = Date.now();
  const minutes = (now - bookingTime) / 60000;
  if (minutes < 2) return 0;
  if (status === 'arrived') return 2.5;
  if (status === 'started') return 5;
  return 1.5;
}

export default function CancellationFeeScreen({ navigation }: any) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherReason, setOtherReason] = useState('');
  const [step, setStep] = useState<'select' | 'confirm' | 'loading' | 'success' | 'error'>('select');
  const [errorMsg, setErrorMsg] = useState('');

  const fee = getCancellationFee(mockRide.status, mockRide.bookingTime);
  const isOther = selectedReason === 'Other';
  const canContinue = selectedReason && (!isOther || otherReason.trim().length > 0);

  const handleContinue = () => setStep('confirm');
  const handleGoBack = () => setStep('select');

  const handleCancelRide = async () => {
    setStep('loading');
    // Simulate API call
    setTimeout(() => {
      // Simulate random error
      if (Math.random() < 0.1) {
        setErrorMsg('Something went wrong. Please try again.');
        setStep('error');
      } else {
        setStep('success');
      }
    }, 1500);
  };

  // Accessibility: focus management, etc. can be added as needed

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color={TITLE_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cancel Ride</Text>
        <View style={{ width: 24 }} />
      </View>
      {/* Ride Details */}
      <View style={styles.rideCard}>
        <Text style={styles.rideLabel}>Pickup</Text>
        <Text style={styles.rideValue}>{mockRide.pickup}</Text>
        <Text style={styles.rideLabel}>Destination</Text>
        <Text style={styles.rideValue}>{mockRide.destination}</Text>
        <View style={styles.rideRow}>
          <Ionicons name="person" size={18} color={PRIMARY_GREEN} />
          <Text style={styles.rideMeta}>{mockRide.rider}</Text>
          <Ionicons name="time" size={18} color={PRIMARY_GREEN} style={{ marginLeft: 16 }} />
          <Text style={styles.rideMeta}>{mockRide.eta} ETA</Text>
        </View>
      </View>
      {/* Policy & Fee */}
      <View style={styles.policyBox}>
        <Ionicons name="information-circle-outline" size={20} color={PRIMARY_GREEN} style={{ marginRight: 8 }} />
        <Text style={styles.policyText}>
          {fee === 0
            ? 'Free cancellation within 2 minutes of booking.'
            : `A cancellation fee of $${fee.toFixed(2)} will apply.`}
        </Text>
      </View>
      {/* Step 1: Select Reason */}
      {step === 'select' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why are you cancelling?</Text>
          {cancellationReasons.map((reason) => (
            <TouchableOpacity
              key={reason}
              style={styles.reasonRow}
              onPress={() => setSelectedReason(reason)}
              accessibilityRole="radio"
              accessibilityState={{ selected: selectedReason === reason }}
            >
              <View style={[styles.radioOuter, selectedReason === reason && styles.radioOuterSelected]}>
                {selectedReason === reason && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.reasonText}>{reason}</Text>
            </TouchableOpacity>
          ))}
          {isOther && (
            <TextInput
              style={styles.otherInput}
              placeholder="Please specify"
              value={otherReason}
              onChangeText={setOtherReason}
              accessibilityLabel="Other reason"
            />
          )}
          <TouchableOpacity
            style={[styles.continueBtn, !canContinue && { opacity: 0.5 }]}
            onPress={handleContinue}
            disabled={!canContinue}
            accessibilityRole="button"
          >
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Step 2: Confirm */}
      {step === 'confirm' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Confirm Cancellation</Text>
          <Text style={styles.warningText}>
            {fee === 0
              ? 'You are eligible for free cancellation.'
              : `You will be charged a $${fee.toFixed(2)} cancellation fee.`}
          </Text>
          <Text style={styles.warningSubText}>This action cannot be undone.</Text>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={handleCancelRide}
            accessibilityRole="button"
          >
            <Text style={styles.cancelBtnText}>Cancel Ride</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.goBackBtn}
            onPress={handleGoBack}
            accessibilityRole="button"
          >
            <Text style={styles.goBackBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Loading */}
      {step === 'loading' && (
        <View style={styles.section}>
          <ActivityIndicator size="large" color={PRIMARY_GREEN} />
          <Text style={styles.sectionTitle}>Cancelling your ride...</Text>
        </View>
      )}
      {/* Success */}
      {step === 'success' && (
        <View style={styles.section}>
          <Ionicons name="checkmark-circle" size={48} color={PRIMARY_GREEN} style={{ marginBottom: 12 }} />
          <Text style={styles.sectionTitle}>Ride Cancelled</Text>
          <Text style={styles.successText}>Your ride has been cancelled. {fee > 0 ? `A $${fee.toFixed(2)} fee was charged.` : 'No fee was charged.'}</Text>
          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => navigation.navigate('Home')}
            accessibilityRole="button"
          >
            <Text style={styles.homeBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Error */}
      {step === 'error' && (
        <View style={styles.section}>
          <Ionicons name="close-circle" size={48} color={Colors.coral} style={{ marginBottom: 12 }} />
          <Text style={styles.sectionTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => setStep('select')}
            accessibilityRole="button"
          >
            <Text style={styles.homeBtnText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}
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
  rideCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.lg,
    margin: Layout.spacing.lg,
    padding: Layout.spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  rideLabel: {
    color: SUBTITLE_COLOR,
    fontSize: Layout.fontSize.sm,
    marginTop: 2,
  },
  rideValue: {
    color: TITLE_COLOR,
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
    marginBottom: 4,
  },
  rideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  rideMeta: {
    color: PRIMARY_GREEN,
    fontSize: Layout.fontSize.sm,
    marginLeft: 4,
    fontWeight: '500',
  },
  policyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: Layout.borderRadius.md,
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
    padding: Layout.spacing.md,
  },
  policyText: {
    color: PRIMARY_GREEN,
    fontSize: Layout.fontSize.sm,
    flex: 1,
  },
  section: {
    marginHorizontal: Layout.spacing.lg,
    marginTop: Layout.spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
    color: TITLE_COLOR,
    marginBottom: 12,
    textAlign: 'center',
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.gray400,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioOuterSelected: {
    borderColor: PRIMARY_GREEN,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: PRIMARY_GREEN,
  },
  reasonText: {
    fontSize: Layout.fontSize.md,
    color: TITLE_COLOR,
  },
  otherInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: Layout.borderRadius.md,
    padding: 10,
    fontSize: Layout.fontSize.md,
    marginBottom: 10,
    marginTop: -4,
    color: TITLE_COLOR,
  },
  continueBtn: {
    backgroundColor: PRIMARY_GREEN,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  continueBtnText: {
    color: Colors.white,
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
  },
  warningText: {
    color: Colors.coral,
    fontSize: Layout.fontSize.md,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  warningSubText: {
    color: SUBTITLE_COLOR,
    fontSize: Layout.fontSize.sm,
    marginBottom: 16,
    textAlign: 'center',
  },
  cancelBtn: {
    backgroundColor: Colors.coral,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  cancelBtnText: {
    color: Colors.white,
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
  },
  goBackBtn: {
    backgroundColor: Colors.gray100,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  goBackBtnText: {
    color: PRIMARY_GREEN,
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
  },
  successText: {
    color: PRIMARY_GREEN,
    fontSize: Layout.fontSize.md,
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    color: Colors.coral,
    fontSize: Layout.fontSize.md,
    marginBottom: 12,
    textAlign: 'center',
  },
  homeBtn: {
    backgroundColor: PRIMARY_GREEN,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  homeBtnText: {
    color: Colors.white,
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
  },
}); 