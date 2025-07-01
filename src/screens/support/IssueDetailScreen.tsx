import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

const mockTrips = [
  { id: '1', date: 'Mon 22 Feb, 4:10 PM', desc: 'Trip to Park Ave, Austin, Texas', price: '$9.50' },
  { id: '2', date: 'Fri 11 Feb, 11:45 AM', desc: 'Trip to 5th St, Austin, Texas', price: '$23.30' },
];

const mockImages = [
  { uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
];

const issueTitles: Record<string, string> = {
  cancel_fee: 'Review my cancellation fee',
  accident: 'I was involved in an accident',
  driver_unprofessional: 'Driver was unprofessional',
  vehicle_unexpected: "My vehicle wasn't what I expected",
  lost_item: 'I lost something during ride',
  refund: 'Request a refund',
  payment_failed: 'Payment failed',
  overcharged: 'I was overcharged',
  update_info: 'Update personal information',
  login_issue: 'Login or verification issue',
  other: 'Other issue',
};

export default function IssueDetailScreen({ route, navigation }: any) {
  const { issue } = route.params;
  const [selectedTrip, setSelectedTrip] = useState(mockTrips[0].id);
  const [details, setDetails] = useState('');
  const [images, setImages] = useState(mockImages);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{issueTitles[issue] || 'Support Issue'}</Text>
        {/* Trip Picker */}
        <Text style={styles.label}>Select the trip when the incident occurred</Text>
        <View style={styles.tripPicker}>
          {mockTrips.map((trip) => (
            <TouchableOpacity
              key={trip.id}
              style={[styles.tripItem, selectedTrip === trip.id && styles.tripItemSelected]}
              onPress={() => setSelectedTrip(trip.id)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.tripDate}>{trip.date}</Text>
                <Text style={styles.tripDesc}>{trip.desc}</Text>
              </View>
              <Text style={styles.tripPrice}>{trip.price}</Text>
              {selectedTrip === trip.id && <Ionicons name="checkmark-circle" size={20} color={Colors.primary} style={{ marginLeft: 8 }} />}
            </TouchableOpacity>
          ))}
        </View>
        {/* Details Input */}
        <Text style={styles.label}>Share all the details about this incident</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Explain everything that happened during trip in detail"
          value={details}
          onChangeText={setDetails}
          multiline
        />
        {/* Photo Upload (mock) */}
        <Text style={styles.label}>Upload photos (if you have any)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
          {images.map((img, idx) => (
            <View key={idx} style={styles.imageWrapper}>
              <Image source={{ uri: img.uri }} style={styles.image} />
              <TouchableOpacity style={styles.deleteImage}>
                <Ionicons name="close-circle" size={20} color={Colors.coral} />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addImage}>
            <Ionicons name="add" size={28} color={Colors.primary} />
          </TouchableOpacity>
        </ScrollView>
        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* Call/Chat Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomButton}>
          <Ionicons name="call-outline" size={20} color={Colors.primary} />
          <Text style={styles.bottomButtonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color={Colors.primary} />
          <Text style={styles.bottomButtonText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Layout.spacing.lg, paddingBottom: 120 },
  backButton: { marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 18, color: Colors.text },
  label: { fontSize: 15, color: Colors.gray400, marginBottom: 8, marginTop: 18 },
  tripPicker: { marginBottom: 12 },
  tripItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tripItemSelected: { borderWidth: 1.5, borderColor: Colors.primary },
  tripDate: { fontSize: 14, color: Colors.gray400 },
  tripDesc: { fontSize: 16, color: Colors.text, fontWeight: '500' },
  tripPrice: { fontSize: 16, color: Colors.primary, fontWeight: '700', marginLeft: 8 },
  textInput: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 14,
    minHeight: 80,
    fontSize: 16,
    color: Colors.text,
    marginBottom: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  imageRow: { flexDirection: 'row', marginVertical: 12 },
  imageWrapper: { position: 'relative', marginRight: 12 },
  image: { width: 64, height: 64, borderRadius: 8 },
  deleteImage: { position: 'absolute', top: -8, right: -8, backgroundColor: Colors.white, borderRadius: 10 },
  addImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  submitButtonText: { color: Colors.white, fontSize: 18, fontWeight: '700' },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  bottomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  bottomButtonText: { marginLeft: 8, fontSize: 16, color: Colors.primary, fontWeight: '600' },
}); 