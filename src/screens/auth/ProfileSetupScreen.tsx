import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAssignUserType } from '../../utils/helpers';

export default function ProfileSetupScreen({ navigation }: any) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  useAssignUserType('user');

  const handleImagePicker = () => {
    Alert.alert(
      'Select Profile Photo',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Camera selected') },
        { text: 'Gallery', onPress: () => console.log('Gallery selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleCompleteSetup = async () => {
    if (!firstName.trim()) {
      Alert.alert('Error', 'Please enter your first name');
      return;
    }

    setIsLoading(true);
    
    try {
      // Update user profile with Clerk
      await user?.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      // Add email if provided
      if (email.trim()) {
        await user?.createEmailAddress({ email: email.trim() });
      }

      // Don't navigate manually - the auth state will handle the transition
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (err: any) {
      console.error('Error updating profile:', err);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Don't navigate manually - the auth state will handle the transition
    Alert.alert('Profile Setup', 'You can complete your profile later from the settings.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>
              Help us personalize your experience
            </Text>
          </View>

          <View style={styles.profileImageContainer}>
            <TouchableOpacity
              onPress={handleImagePicker}
              style={styles.imagePickerButton}
            >
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Ionicons name="camera" size={32} color={Colors.gray400} />
                </View>
              )}
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={16} color={Colors.white} />
              </View>
            </TouchableOpacity>
            <Text style={styles.imageHint}>Add Profile Photo</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="First Name *"
              placeholder="Enter your first name"
              value={firstName}
              onChangeText={setFirstName}
              leftIcon="person"
            />

            <Input
              label="Last Name"
              placeholder="Enter your last name"
              value={lastName}
              onChangeText={setLastName}
              leftIcon="person"
            />

            <Input
              label="Email Address"
              placeholder="Enter your email (optional)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              leftIcon="mail"
            />

            <Button
              title="Complete Setup"
              onPress={handleCompleteSetup}
              loading={isLoading}
              fullWidth
              disabled={!firstName.trim()}
            />

            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Layout.spacing.lg,
  },
  header: {
    alignItems: 'center',
    paddingTop: Layout.spacing.xl,
    paddingBottom: Layout.spacing.lg,
  },
  title: {
    fontSize: Layout.fontSize.xxl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
  },
  subtitle: {
    fontSize: Layout.fontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  imagePickerButton: {
    position: 'relative',
    marginBottom: Layout.spacing.sm,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  imageHint: {
    fontSize: Layout.fontSize.sm,
    color: Colors.textSecondary,
  },
  form: {
    flex: 1,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    marginTop: Layout.spacing.md,
  },
  skipText: {
    fontSize: Layout.fontSize.md,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
