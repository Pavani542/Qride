import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, TITLE_COLOR } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="information-circle-outline" size={28} color={TITLE_COLOR} />
        <Text style={styles.headerTitle}>About This App</Text>
        <View style={{ width: 28 }} />
      </View>
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.appName}>Appacella</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.description}>
          Appacella is a modern ride-sharing application designed to make your daily commute safe, affordable, and convenient. Book rides, schedule trips, view your ride history, and manage your profile all in one place.
        </Text>
        <Text style={styles.sectionTitle}>Contact & Support</Text>
        <Text style={styles.info}>Email: support@appacella.com</Text>
        <Text style={styles.info}>Phone: +1 234 567 8900</Text>
        <Text style={styles.sectionTitle}>Developed by</Text>
        <Text style={styles.info}>Appacella Team</Text>
      </ScrollView>
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
    padding: Layout.spacing.lg,
  },
  appName: {
    fontSize: Layout.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Layout.spacing.sm,
    textAlign: 'center',
  },
  version: {
    fontSize: Layout.fontSize.sm,
    color: Colors.gray500,
    marginBottom: Layout.spacing.lg,
    textAlign: 'center',
  },
  description: {
    fontSize: Layout.fontSize.md,
    color: Colors.gray700,
    marginBottom: Layout.spacing.lg,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: Layout.fontSize.md,
    fontWeight: 'bold',
    color: TITLE_COLOR,
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.sm,
  },
  info: {
    fontSize: Layout.fontSize.md,
    color: Colors.gray700,
    marginBottom: Layout.spacing.sm,
    textAlign: 'center',
  },
}); 