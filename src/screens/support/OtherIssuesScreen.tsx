import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, TITLE_COLOR } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

export default function OtherIssuesScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color={TITLE_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Other Issues</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Other Issues</Text>
        <Text style={styles.description}>
          If you have an issue that doesn't fit other categories, select an option below or contact our support team.
        </Text>
        <TouchableOpacity style={styles.issueButton} onPress={() => {}} accessibilityLabel="App not working as expected">
          <Text style={styles.issueText}>App not working as expected</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.issueButton} onPress={() => {}} accessibilityLabel="Feature request">
          <Text style={styles.issueText}>Feature request</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.issueButton} onPress={() => {}} accessibilityLabel="Feedback or suggestion">
          <Text style={styles.issueText}>Feedback or suggestion</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.issueButton} onPress={() => {}} accessibilityLabel="Other or unlisted issue">
          <Text style={styles.issueText}>Other or unlisted issue</Text>
        </TouchableOpacity>
        <Text style={styles.note}>
          Can't find your issue? Contact our support team for further assistance.
        </Text>
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
    padding: Layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
    color: TITLE_COLOR,
    marginBottom: Layout.spacing.md,
  },
  description: {
    color: Colors.gray700,
    fontSize: Layout.fontSize.md,
    marginBottom: Layout.spacing.lg,
  },
  issueButton: {
    backgroundColor: Colors.gray100,
    padding: Layout.spacing.md,
    borderRadius: 8,
    marginBottom: Layout.spacing.sm,
  },
  issueText: {
    color: TITLE_COLOR,
    fontSize: Layout.fontSize.md,
  },
  note: {
    color: Colors.gray500,
    fontSize: Layout.fontSize.sm,
    marginTop: Layout.spacing.xl,
  },
}); 