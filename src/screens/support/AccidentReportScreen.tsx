import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, TITLE_COLOR } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import AccidentDetailsScreen from "../../screens/support/AccidentDetailsScreen";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AccidentReportScreen({ navigation }: any) {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState<'Minor' | 'Moderate' | 'Severe' | null>(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!severity) return setError('Please select severity.');
    if (description.length < 20) return setError('Description must be at least 20 characters.');
    // Add more validation as needed
    setError('');
    // Submit logic here
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color={TITLE_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Accident</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Incident Details</Text>
        {/* Date/Time Picker */}
        <Text>Date & Time</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text>{date.toLocaleString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        {/* Location Input */}
        <Text>Location</Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Enter location"
          style={styles.input}
        />
        <TouchableOpacity onPress={() => {/* autofill GPS logic */}}>
          <Text>Use Current Location</Text>
        </TouchableOpacity>

        {/* Severity Selector */}
        <Text>Severity</Text>
        <View style={{ flexDirection: 'row' }}>
          {['Minor', 'Moderate', 'Severe'].map((level) => (
            <TouchableOpacity
              key={level}
              onPress={() => setSeverity(level as any)}
              style={[
                styles.severityBtn,
                severity === level && styles.severityBtnSelected,
              ]}
            >
              <Text>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Description */}
        <Text>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the incident"
          style={[styles.input, { height: 80 }]}
          multiline
        />

        {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}

        {/* Submit */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Submit Report</Text>
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
    padding: Layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
    color: TITLE_COLOR,
    marginBottom: Layout.spacing.md,
  },
  placeholder: {
    color: Colors.gray400,
    fontSize: Layout.fontSize.md,
    marginBottom: Layout.spacing.lg,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  submitBtnText: {
    color: Colors.white,
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
  },
  severityBtn: {
    padding: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.md,
    marginRight: Layout.spacing.md,
  },
  severityBtnSelected: {
    backgroundColor: Colors.primary,
  },
}); 