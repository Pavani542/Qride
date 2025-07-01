import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, PRIMARY_GREEN, TITLE_COLOR } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

const issueCategories = [
  'Rude behavior',
  'Unsafe driving',
  'Vehicle condition issues',
  'Route deviation',
  'Inappropriate conduct',
  'Late arrival',
  'Cleanliness issues',
  'Other',
];

export default function DriverUnprofessionalScreen({ navigation }: any) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [otherText, setOtherText] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [rating, setRating] = useState(0);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color={TITLE_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Driver Issue</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Driver Information</Text>
        {/* Driver Info */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Image source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12 }} />
          <View>
            <Text style={{ fontWeight: 'bold' }}>John Doe</Text>
            <Text>Bike: Honda Activa, Plate: AB12CD3456</Text>
          </View>
        </View>

        {/* Issue Categories */}
        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Issue Categories</Text>
        {issueCategories.map((cat) => (
          <TouchableOpacity key={cat} onPress={() => toggleCategory(cat)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <View style={{
              width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#007AFF',
              backgroundColor: selectedCategories.includes(cat) ? '#007AFF' : '#FFF', marginRight: 8
            }} />
            <Text>{cat}</Text>
          </TouchableOpacity>
        ))}
        {selectedCategories.includes('Other') && (
          <TextInput
            placeholder="Please specify"
            value={otherText}
            onChangeText={setOtherText}
            style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginBottom: 8 }}
          />
        )}

        {/* Description */}
        <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Description</Text>
        <TextInput
          placeholder="Describe the incident"
          value={description}
          onChangeText={setDescription}
          multiline
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, minHeight: 60, marginBottom: 8 }}
        />

        {/* Rating */}
        <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Rating</Text>
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Ionicons name={star <= rating ? 'star' : 'star-outline'} size={28} color="#FFD700" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Evidence */}
        <TouchableOpacity style={{ marginBottom: 8 }}>
          <Text style={{ color: '#007AFF' }}>Upload Photo/Video</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginBottom: 8 }}>
          <Text style={{ color: '#007AFF' }}>Record Audio</Text>
        </TouchableOpacity>

        {/* Anonymous Toggle */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
          <Text style={{ marginRight: 8 }}>Report Anonymously</Text>
          <Switch value={isAnonymous} onValueChange={setIsAnonymous} />
        </View>

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
}); 