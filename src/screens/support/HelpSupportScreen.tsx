import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, PRIMARY_GREEN, TITLE_COLOR, SUBTITLE_COLOR } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

const mockTrip = {
  date: 'Mon 22 Feb, 4:10 PM',
  route: 'Park Ave → Austin, Texas',
  fare: '$8.50',
  map: 'https://maps.googleapis.com/maps/api/staticmap?center=Austin,TX&zoom=13&size=200x80&maptype=roadmap&markers=color:green%7Clabel:A%7CAustin,TX', // placeholder
};

const menuItems = [
  { key: 'ride', label: 'Ride Issues', screen: 'RideIssues' },
  { key: 'payments', label: 'Payments and Refunds', screen: 'PaymentsIssues' },
  { key: 'account', label: 'Account related issues', screen: 'AccountIssues' },
  { key: 'other', label: 'Other Issues', screen: 'OtherIssues' },
];

const extraMenu = [
  { key: 'privacy', label: 'Privacy Policy', screen: 'PersonalInfoUpdate' },
  { key: 'terms', label: 'Terms and conditions', screen: 'TermsCondition' },
];

export default function HelpSupportScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color={TITLE_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Recent Trip Card */}
        <View style={styles.tripCard}>
          <View style={styles.tripCardLeft}>
            <Image source={{ uri: mockTrip.map }} style={styles.mapImage} />
          </View>
          <View style={styles.tripCardRight}>
            <Text style={styles.tripDate}>{mockTrip.date}</Text>
            <Text style={styles.tripRoute}>{mockTrip.route}</Text>
            <Text style={styles.tripFare}>{mockTrip.fare}</Text>
            <TouchableOpacity>
              <Text style={styles.getHelpLink}>Get Help</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.screen, { category: item.key })}
              accessibilityLabel={item.label}
            >
              <Text style={styles.menuText}>{item.label}</Text>
              <Ionicons name="add" size={22} color={PRIMARY_GREEN} />
            </TouchableOpacity>
          ))}
        </View>
        {/* Extra Menu */}
        <View style={styles.menuSection}>
          {extraMenu.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.screen)}
              accessibilityLabel={item.label}
            >
              <Text style={styles.menuText}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={22} color={Colors.gray400} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomButton}
          accessibilityLabel="Call Support"
          onPress={() => Linking.openURL('tel:+1234567890')}
        >
          <Ionicons name="call-outline" size={20} color={PRIMARY_GREEN} />
          <Text style={styles.bottomButtonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomButton}
          accessibilityLabel="Chat with Support"
          onPress={() => navigation.navigate('Chat', { driver: { name: 'Support' } })}
        >
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
  tripCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: Layout.borderRadius.lg,
    marginBottom: Layout.spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  tripCardLeft: {
    width: 90,
    height: 90,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapImage: {
    width: 80,
    height: 80,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.gray200,
  },
  tripCardRight: {
    flex: 1,
    padding: Layout.spacing.md,
    justifyContent: 'center',
  },
  tripDate: {
    fontSize: Layout.fontSize.sm,
    color: SUBTITLE_COLOR,
    marginBottom: 2,
  },
  tripRoute: {
    fontSize: Layout.fontSize.md,
    color: TITLE_COLOR,
    fontWeight: '500',
    marginBottom: 2,
  },
  tripFare: {
    fontSize: Layout.fontSize.md,
    color: PRIMARY_GREEN,
    fontWeight: '700',
    marginBottom: 2,
  },
  getHelpLink: {
    color: PRIMARY_GREEN,
    fontWeight: '600',
    marginTop: 4,
    fontSize: Layout.fontSize.sm,
  },
  menuSection: {
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.sm,
    backgroundColor: 'transparent',
  },
  menuItem: {
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
  menuText: {
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
}); 