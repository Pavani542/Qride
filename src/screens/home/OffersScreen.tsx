import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, TITLE_COLOR } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

export default function OffersScreen({ navigation }: any) {
  const offers = [
    {
      id: 1,
      title: '20% Off Your Next Ride',
      description: 'Use code RIDE20 to get 20% off your next ride. Valid for all users.',
      expires: 'Expires: 30 June 2024',
    },
    {
      id: 2,
      title: 'Refer & Earn',
      description: 'Refer a friend and both of you get $5 ride credit after their first trip.',
      expires: 'No expiry',
    },
    {
      id: 3,
      title: 'Weekend Special',
      description: 'Flat $3 off on all rides this weekend. No code needed!',
      expires: 'Expires: Sunday, 11:59 PM',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color={TITLE_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Offers</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.content}>
        {offers.map((offer) => (
          <View key={offer.id} style={styles.offerCard}>
            <Text style={styles.offerTitle}>{offer.title}</Text>
            <Text style={styles.offerDescription}>{offer.description}</Text>
            <Text style={styles.offerExpires}>{offer.expires}</Text>
          </View>
        ))}
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
    justifyContent: 'flex-start',
    padding: Layout.spacing.lg,
    width: '100%',
  },
  placeholder: {
    color: Colors.gray400,
    fontSize: Layout.fontSize.md,
    textAlign: 'center',
  },
  offerCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  offerTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
    color: TITLE_COLOR,
    marginBottom: 4,
  },
  offerDescription: {
    fontSize: Layout.fontSize.md,
    color: Colors.gray700,
    marginBottom: 4,
  },
  offerExpires: {
    fontSize: Layout.fontSize.sm,
    color: Colors.gray500,
  },
}); 