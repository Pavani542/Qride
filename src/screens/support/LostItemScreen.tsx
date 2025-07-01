import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, PRIMARY_GREEN, TITLE_COLOR } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { Picker } from '@react-native-picker/picker';

const itemCategories = [
  'Phone', 'Wallet', 'Bag', 'Jewelry', 'Documents', 'Electronics', 'Clothing', 'Other'
];
const urgencyLevels = ['Low', 'Medium', 'High', 'Emergency'];

export default function LostItemScreen({ navigation }: any) {
  const [tripId, setTripId] = useState('');
  const [itemCategory, setItemCategory] = useState(itemCategories[0]);
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState(urgencyLevels[0]);
  const [reward, setReward] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredContact, setPreferredContact] = useState('Phone');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color={TITLE_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Lost Item</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Trip & Item Details</Text>
        {/* Trip Info */}
        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Trip Information</Text>
        <TextInput
          placeholder="Trip ID"
          value={tripId}
          onChangeText={setTripId}
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginBottom: 8 }}
        />
        <Text>Date/Time: 2024-05-01 14:30</Text>
        <Text>Route: 123 Main St → 456 Park Ave</Text>

        {/* Item Details */}
        <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Item Details</Text>
        <Text>Category</Text>
        <Picker
          selectedValue={itemCategory}
          onValueChange={setItemCategory}
          style={{ marginBottom: 8 }}
        >
          {itemCategories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
        <TextInput
          placeholder="Item Description"
          value={description}
          onChangeText={setDescription}
          multiline
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, minHeight: 40, marginBottom: 8 }}
        />
        <TextInput placeholder="Brand/Model (optional)" style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginBottom: 8 }} />
        <TextInput placeholder="Estimated Value" style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginBottom: 8 }} />
        <TextInput placeholder="Color" style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginBottom: 8 }} />
        <TextInput placeholder="Size" style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginBottom: 8 }} />

        {/* Item Photo */}
        <TouchableOpacity style={{ marginBottom: 8 }}>
          <Text style={{ color: '#007AFF' }}>Upload Item Photo</Text>
        </TouchableOpacity>

        {/* Additional Info */}
        <TextInput placeholder="Last seen location" style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginBottom: 8 }} />
        <TextInput placeholder="Special instructions" style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginBottom: 8 }} />

        {/* Urgency Level */}
        <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Urgency Level</Text>
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          {urgencyLevels.map((level) => (
            <TouchableOpacity
              key={level}
              onPress={() => setUrgency(level)}
              style={{
                padding: 8,
                borderRadius: 4,
                backgroundColor: urgency === level ? '#FF3B30' : '#EEE',
                marginRight: 8,
              }}
            >
              <Text style={{ color: urgency === level ? '#FFF' : '#333' }}>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Reward Offer */}
        <TextInput
          placeholder="Reward Offer (optional)"
          value={reward}
          onChangeText={setReward}
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginBottom: 8 }}
        />

        {/* Contact Info */}
        <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Contact Information</Text>
        <TextInput
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginBottom: 8 }}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginBottom: 8 }}
        />
        <Text>Preferred Contact</Text>
        <Picker
          selectedValue={preferredContact}
          onValueChange={setPreferredContact}
          style={{ marginBottom: 8 }}
        >
          <Picker.Item label="Phone" value="Phone" />
          <Picker.Item label="Email" value="Email" />
        </Picker>

        <TouchableOpacity style={styles.submitBtn}>
          <Text style={styles.submitBtnText}>Submit Report</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() => navigation.navigate('Chat', { driver: { name: 'Support' } })}
      >
        <Ionicons name="chatbubble-ellipses-outline" size={20} color={PRIMARY_GREEN} />
        <Text style={styles.bottomButtonText}>Chat</Text>
      </TouchableOpacity>
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
  bottomButton: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    alignItems: 'center',
    position: 'absolute',
    bottom: Layout.spacing.md,
    right: Layout.spacing.md,
  },
  bottomButtonText: {
    color: PRIMARY_GREEN,
    fontSize: Layout.fontSize.md,
    fontWeight: 'bold',
  },
}); 