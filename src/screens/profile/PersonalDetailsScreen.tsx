import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, TITLE_COLOR } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

export default function PersonalDetailsScreen({ route, navigation }: any) {
  const { name, email, phone, gender, emergencyName, emergencyPhone, photo } = route.params || {};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle" size={32} color={TITLE_COLOR} />
        <Text style={styles.headerTitle}>Personal Details</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.photoContainer}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photo} />
          ) : (
            <Ionicons name="person" size={80} color={Colors.gray400} />
          )}
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{name || '-'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{email || '-'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{phone || '-'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Gender:</Text>
          <Text style={styles.value}>{gender || '-'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Emergency Contact:</Text>
          <Text style={styles.value}>{emergencyName || '-'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Emergency Phone:</Text>
          <Text style={styles.value}>{emergencyPhone || '-'}</Text>
        </View>
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
  photoContainer: {
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: Layout.spacing.md,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontSize: Layout.fontSize.md,
    color: TITLE_COLOR,
    fontWeight: '600',
  },
  value: {
    fontSize: Layout.fontSize.md,
    color: Colors.gray700,
    marginLeft: 8,
    flex: 1,
    textAlign: 'right',
  },
}); 