import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, PRIMARY_GREEN, TITLE_COLOR } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

const issueCategories = [
  'Mechanical breakdown',
  'Flat tire/wheel issues',
  'Engine problems',
  'Electrical issues',
  'Accident damage',
  'Fuel/battery issues',
  'Safety equipment malfunction',
  'Other mechanical issues',
];

const assistanceOptions = [
  'Immediate rescue needed',
  'Tow service required',
  'Replacement vehicle needed',
  'Mechanical assistance',
];

export default function VehicleUnexpectedScreen({ navigation }: any) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [severity, setSeverity] = useState<'Critical' | 'Major' | 'Minor' | null>(null);
  const [canContinue, setCanContinue] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedAssistance, setSelectedAssistance] = useState<string[]>([]);

  const toggleAssistance = (option: string) => {
    setSelectedAssistance((prev) =>
      prev.includes(option) ? prev.filter((a) => a !== option) : [...prev, option]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color={TITLE_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Vehicle Issue</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Vehicle & Issue Details</Text>
        {/* Vehicle Info */}
        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Vehicle Information</Text>
        <Text>Bike: Honda Activa, Plate: AB12CD3456</Text>
        <Text>Driver: John Doe</Text>
        <Text>Current Location: 12.9716, 77.5946</Text>

        {/* Issue Category */}
        <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Issue Category</Text>
        {issueCategories.map((cat) => (
          <TouchableOpacity key={cat} onPress={() => setSelectedCategory(cat)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <View style={{
              width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#007AFF',
              backgroundColor: selectedCategory === cat ? '#007AFF' : '#FFF', marginRight: 8
            }} />
            <Text>{cat}</Text>
          </TouchableOpacity>
        ))}

        {/* Severity */}
        <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Severity</Text>
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          {['Critical', 'Major', 'Minor'].map((level) => (
            <TouchableOpacity
              key={level}
              onPress={() => setSeverity(level as any)}
              style={{
                padding: 8,
                borderRadius: 4,
                backgroundColor: severity === level ? '#FF3B30' : '#EEE',
                marginRight: 8,
              }}
            >
              <Text style={{ color: severity === level ? '#FFF' : '#333' }}>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Status */}
        <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Can continue trip?</Text>
        <Switch value={canContinue} onValueChange={setCanContinue} />

        {/* Description */}
        <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Description</Text>
        <TextInput
          placeholder="Describe the problem"
          value={description}
          onChangeText={setDescription}
          multiline
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, minHeight: 60, marginBottom: 8 }}
        />

        {/* Media */}
        <TouchableOpacity style={{ marginBottom: 8 }}>
          <Text style={{ color: '#007AFF' }}>Upload Photo/Video</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginBottom: 8 }}>
          <Text style={{ color: '#007AFF' }}>Record Audio Note</Text>
        </TouchableOpacity>

        {/* Assistance Required */}
        <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Assistance Required</Text>
        {assistanceOptions.map((option) => (
          <TouchableOpacity key={option} onPress={() => toggleAssistance(option)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <View style={{
              width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#007AFF',
              backgroundColor: selectedAssistance.includes(option) ? '#007AFF' : '#FFF', marginRight: 8
            }} />
            <Text>{option}</Text>
          </TouchableOpacity>
        ))}

        {/* Emergency Actions */}
        <TouchableOpacity style={{ marginTop: 16, backgroundColor: '#FF3B30', padding: 12, borderRadius: 4 }}>
          <Text style={{ color: '#FFF', textAlign: 'center' }}>Contact Emergency Services</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 8, backgroundColor: '#007AFF', padding: 12, borderRadius: 4 }}>
          <Text style={{ color: '#FFF', textAlign: 'center' }}>Request Immediate Pickup</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 8, backgroundColor: '#888', padding: 12, borderRadius: 4 }}>
          <Text style={{ color: '#FFF', textAlign: 'center' }}>Cancel Current Trip</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitBtn}>
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
}); 