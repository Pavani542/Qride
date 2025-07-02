import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, TITLE_COLOR } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen({ navigation, route }: any) {
  const { name: initialName = '', email: initialEmail = '', phone: initialPhone = '', gender: initialGender = '', emergencyName: initialEmergencyName = '', emergencyPhone: initialEmergencyPhone = '', photo: initialPhoto = '' } = route?.params || {};
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [gender, setGender] = useState(initialGender);
  const [emergencyName, setEmergencyName] = useState(initialEmergencyName);
  const [emergencyPhone, setEmergencyPhone] = useState(initialEmergencyPhone);
  const [photo, setPhoto] = useState(initialPhoto);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhoto(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color={TITLE_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Upload Photo */}
        <TouchableOpacity style={styles.photoContainer} onPress={pickImage} accessibilityLabel="Upload Photo">
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photo} />
          ) : (
            <Ionicons name="camera" size={40} color={Colors.gray400} />
          )}
          <Text style={styles.uploadText}>Upload Photo</Text>
        </TouchableOpacity>
        {/* Name */}
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />
        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        {/* Phone */}
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        {/* Gender */}
        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderRow}>
          {['Male', 'Female', 'Other'].map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.genderButton, gender === g && styles.genderButtonSelected]}
              onPress={() => setGender(g)}
            >
              <Text style={[styles.genderText, gender === g && styles.genderTextSelected]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Emergency Contact Name */}
        <Text style={styles.label}>Emergency Contact Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter emergency contact name"
          value={emergencyName}
          onChangeText={setEmergencyName}
        />
        {/* Emergency Contact Phone */}
        <Text style={styles.label}>Emergency Contact Phone</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter emergency contact phone"
          value={emergencyPhone}
          onChangeText={setEmergencyPhone}
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.saveButton} onPress={() => {
          navigation.navigate('PersonalDetails', {
            name,
            email,
            phone,
            gender,
            emergencyName,
            emergencyPhone,
            photo,
          });
        }}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
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
  uploadText: {
    color: Colors.primary,
    fontSize: Layout.fontSize.sm,
    marginTop: 4,
    marginBottom: 8,
  },
  label: {
    fontSize: Layout.fontSize.md,
    color: TITLE_COLOR,
    marginTop: Layout.spacing.md,
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: Layout.spacing.md,
    fontSize: Layout.fontSize.md,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  genderRow: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.md,
  },
  genderButton: {
    flex: 1,
    padding: Layout.spacing.md,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
  },
  genderButtonSelected: {
    backgroundColor: Colors.primary,
  },
  genderText: {
    color: TITLE_COLOR,
    fontSize: Layout.fontSize.md,
  },
  genderTextSelected: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: Layout.spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: Layout.spacing.xl,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
  },
}); 