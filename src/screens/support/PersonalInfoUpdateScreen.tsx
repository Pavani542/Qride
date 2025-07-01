import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, TITLE_COLOR } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

export default function PersonalInfoUpdateScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color={TITLE_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update personal information</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>How to Update Your Personal Information</Text>
        <Text style={styles.description}>
          You can update your name, email, phone number, and other personal details directly in the app. Please follow the steps below:
        </Text>
        <View style={styles.stepsContainer}>
          <Text style={styles.step}>1. Go to your Profile screen.</Text>
          <Text style={styles.step}>2. Tap on the field you want to update (e.g., name, email, phone).</Text>
          <Text style={styles.step}>3. Enter the new information and save your changes.</Text>
        </View>
        <Text style={styles.note}>
          If you are unable to update your information or need further assistance, please contact our support team.
        </Text>
        <TouchableOpacity style={styles.supportButton} onPress={() => {}} accessibilityLabel="Contact Support">
          <Text style={styles.supportButtonText}>Contact Support</Text>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.spacing.lg,
  },
  title: {
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
    color: TITLE_COLOR,
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },
  description: {
    color: Colors.gray700,
    fontSize: Layout.fontSize.md,
    marginBottom: Layout.spacing.lg,
    textAlign: 'center',
  },
  stepsContainer: {
    alignSelf: 'stretch',
    marginBottom: Layout.spacing.lg,
  },
  step: {
    color: TITLE_COLOR,
    fontSize: Layout.fontSize.md,
    marginBottom: Layout.spacing.sm,
  },
  note: {
    color: Colors.gray500,
    fontSize: Layout.fontSize.sm,
    marginBottom: Layout.spacing.lg,
    textAlign: 'center',
  },
  supportButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.xl,
    borderRadius: 8,
  },
  supportButtonText: {
    color: Colors.white,
    fontSize: Layout.fontSize.md,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 