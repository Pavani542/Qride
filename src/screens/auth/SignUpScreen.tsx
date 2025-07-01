import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Modal, 
  FlatList, 
  TextInput, 
  Image, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSignUp, useUser } from '@clerk/clerk-expo';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

// Types
interface NameStepProps {
  firstName: string;
  lastName: string;
  setFirstName: (v: string) => void;
  setLastName: (v: string) => void;
  onNext: () => void;
}

interface PhoneStepProps {
  phoneNumber: string;
  setPhoneNumber: (v: string) => void;
  countryCode: string;
  setCountryCode: (v: string) => void;
  countryModalVisible: boolean;
  setCountryModalVisible: (v: boolean) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
}

interface OtpStepProps {
  otp: string[];
  setOtp: (v: string[]) => void;
  onVerify: () => void;
  onBack: () => void;
  isLoading: boolean;
  error: string;
  resendOtp: () => void;
  canResend: boolean;
  timer: number;
}

interface PhotoStepProps {
  profileImage: string | null;
  setProfileImage: (v: string | null) => void;
  onComplete: () => void;
  onSkip: () => void;
  onBack: () => void;
  isLoading: boolean;
}

interface CountryItem {
  code: string;
  name: string;
}

// Step 1: Name Entry
function NameStep({ firstName, lastName, setFirstName, setLastName, onNext }: NameStepProps) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.progress}>Step 1 of 4</Text>
      <Text style={styles.stepTitle}>What's your name?</Text>
      <Input
        label="First Name"
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
      <Button
        title="Next"
        onPress={onNext}
        fullWidth
        disabled={!firstName.trim()}
        style={{ marginTop: 24 }}
      />
    </View>
  );
}

// Step 2: Phone Number Entry
function PhoneStep({ 
  phoneNumber, 
  setPhoneNumber, 
  countryCode, 
  setCountryCode, 
  countryModalVisible, 
  setCountryModalVisible, 
  onNext, 
  onBack, 
  isLoading 
}: PhoneStepProps) {
  const countryList: CountryItem[] = [
    { code: '+91', name: 'India' },
    { code: '+1', name: 'USA' },
    { code: '+44', name: 'UK' },
    { code: '+86', name: 'China' },
    { code: '+49', name: 'Germany' },
    { code: '+33', name: 'France' },
    { code: '+81', name: 'Japan' },
    { code: '+82', name: 'South Korea' },
    { code: '+61', name: 'Australia' },
    { code: '+55', name: 'Brazil' },
  ];

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.progress}>Step 2 of 4</Text>
      <Text style={styles.stepTitle}>What's your mobile number?</Text>
      <Input
        label="Mobile Number"
        placeholder="Enter your 10-digit mobile number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        maxLength={10}
        leftElement={
          <TouchableOpacity
            onPress={() => setCountryModalVisible(true)}
            style={styles.countryCodeButton}
          >
            <Text style={styles.countryCodeText}>{countryCode}</Text>
            <Ionicons name="chevron-down" size={18} color={Colors.gray400} />
          </TouchableOpacity>
        }
      />
      
      {/* Country Code Modal */}
      <Modal
        visible={countryModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCountryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity
                onPress={() => setCountryModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={countryList}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => {
                    setCountryCode(item.code);
                    setCountryModalVisible(false);
                  }}
                >
                  <Text style={styles.countryItemText}>
                    {item.name} ({item.code})
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
      
      <Button
        title="Send OTP"
        onPress={onNext}
        fullWidth
        loading={isLoading}
        disabled={phoneNumber.length !== 10}
        style={{ marginTop: 24 }}
      />
      <Button
        title="Back"
        onPress={onBack}
        fullWidth
        variant="secondary"
        style={{ marginTop: 12 }}
      />
    </View>
  );
}

// Step 3: OTP Entry
function OtpStep({ 
  otp, 
  setOtp, 
  onVerify, 
  onBack, 
  isLoading, 
  error, 
  resendOtp, 
  canResend, 
  timer 
}: OtpStepProps) {
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    // Only allow single digit
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (nativeEvent: any, index: number) => {
    if (nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.progress}>Step 3 of 4</Text>
      <Text style={styles.stepTitle}>Enter 6-digit verification code</Text>
      <Text style={styles.otpSubtitle}>
        We've sent a verification code to your mobile number
      </Text>
      
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => { inputRefs.current[index] = ref; }}
            style={[styles.otpInput, digit && styles.otpInputFilled]}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent, index)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
            selectTextOnFocus
          />
        ))}
      </View>
      
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
      
      <View style={styles.resendContainer}>
        {canResend ? (
          <TouchableOpacity onPress={resendOtp}>
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.timerText}>Resend OTP in {timer}s</Text>
        )}
      </View>
      
      <Button
        title="Verify"
        onPress={onVerify}
        fullWidth
        loading={isLoading}
        disabled={otp.join('').length !== 6}
        style={{ marginTop: 24 }}
      />
      <Button
        title="Back"
        onPress={onBack}
        fullWidth
        variant="secondary"
        style={{ marginTop: 12 }}
      />
    </View>
  );
}

// Step 4: Photo Upload
function PhotoStep({ 
  profileImage, 
  setProfileImage, 
  onComplete, 
  onSkip, 
  onBack, 
  isLoading 
}: PhotoStepProps) {
  const handleImagePicker = () => {
    Alert.alert(
      'Select Photo',
      'Choose how you want to add your photo',
      [
        { text: 'Camera', onPress: () => console.log('Open Camera') },
        { text: 'Gallery', onPress: () => console.log('Open Gallery') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.progress}>Step 4 of 4</Text>
      <Text style={styles.stepTitle}>Upload your photo</Text>
      <Text style={styles.photoSubtitle}>
        Add a profile photo to help others recognize you
      </Text>
      
      <TouchableOpacity
        onPress={handleImagePicker}
        style={styles.profileImageContainer}
      >
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="camera" size={32} color={Colors.gray400} />
          </View>
        )}
      </TouchableOpacity>
      
      <Text style={styles.imageHint}>Tap to upload</Text>
      
      <Button
        title="Complete"
        onPress={onComplete}
        fullWidth
        loading={isLoading}
        style={{ marginTop: 24 }}
      />
      <Button
        title="I'll do it later"
        onPress={onSkip}
        fullWidth
        variant="secondary"
        style={{ marginTop: 12 }}
      />
      <Button
        title="Back"
        onPress={onBack}
        fullWidth
        variant="ghost"
        style={{ marginTop: 12 }}
      />
    </View>
  );
}

// Main SignUp Screen Component
export default function SignUpScreen({ navigation }: { navigation: any }) {
  const [step, setStep] = useState<number>(1);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+91');
  const [countryModalVisible, setCountryModalVisible] = useState<boolean>(false);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string>('');
  const [timer, setTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [signUpCreated, setSignUpCreated] = useState<boolean>(false);
  const { signUp, isLoaded } = useSignUp();
  const { user } = useUser();

  // Timer for OTP resend
  useEffect(() => {
    if (step !== 3) return;
    
    setTimer(30);
    setCanResend(false);
    
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [step]);

  // Reset signUpCreated if phone number changes
  useEffect(() => {
    setSignUpCreated(false);
  }, [phoneNumber, countryCode]);

  // Step navigation
  const goToNextStep = () => setStep((s) => s + 1);
  const goToPrevStep = () => setStep((s) => s - 1);

  // Step 2: Send OTP
  const handleSendOTP = async () => {
    if (!isLoaded) return;
    if (phoneNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }
    setIsLoading(true);
    try {
      const formattedPhone = `${countryCode}${phoneNumber.replace(/^0+/, '')}`;
      if (!signUpCreated) {
        await signUp.create({ phoneNumber: formattedPhone });
        setSignUpCreated(true);
      }
      await signUp.preparePhoneNumberVerification({ strategy: 'phone_code' });
      goToNextStep();
    } catch (err: unknown) {
      if (typeof err === 'object' && err && 'errors' in err) {
        // @ts-ignore
        Alert.alert('Error', err.errors?.[0]?.message || 'Failed to send OTP');
      } else {
        Alert.alert('Error', 'Failed to send OTP');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Verify OTP
  const handleVerifyOTP = async () => {
    setIsLoading(true);
    setOtpError('');
    try {
      const otpString = otp.join('');
      if (otpString.length !== 6) {
        setOtpError('Please enter complete OTP');
        setIsLoading(false);
        return;
      }
      const completeSignUp = await signUp?.attemptPhoneNumberVerification({ code: otpString });
      if (completeSignUp?.status === 'complete') {
        // Clerk's setActive may not be typed, so use type assertion
        if (signUp && (signUp as any).setActive) {
          await (signUp as any).setActive({ session: completeSignUp.createdSessionId });
        }
        goToNextStep();
      } else {
        setOtpError('Invalid OTP. Please try again.');
      }
    } catch (err: any) {
      const errorMessage = err?.errors?.[0]?.message || 'Invalid OTP. Please try again.';
      setOtpError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Resend OTP
  const handleResendOTP = async () => {
    try {
      await signUp?.preparePhoneNumberVerification({ strategy: 'phone_code' });
      setTimer(30);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      setOtpError('');
      Alert.alert('Success', 'OTP sent successfully');
    } catch (err: any) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
  };

  // Step 4: Complete Profile
  const handleCompleteProfile = async () => {
    setIsLoading(true);
    try {
      await user?.update({ 
        firstName: firstName.trim(), 
        lastName: lastName.trim() 
      });
      
      // TODO: Handle profile image upload if needed
      // if (profileImage) {
      //   await user?.setProfileImage({ file: profileImage });
      // }
      
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => {
          // Navigate to app home or wherever needed
          // navigation.replace('Home');
        }}
      ]);
    } catch (err: any) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 4: Skip profile
  const handleSkipProfile = () => {
    Alert.alert(
      'Profile Setup', 
      'You can complete your profile later from the settings.',
      [
        { text: 'OK', onPress: () => {
          // Navigate to app home or wherever needed
          // navigation.replace('Home');
        }}
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            {step > 1 && (
              <TouchableOpacity onPress={goToPrevStep} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={Colors.text} />
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.content}>
            {step === 1 && (
              <NameStep
                firstName={firstName}
                lastName={lastName}
                setFirstName={setFirstName}
                setLastName={setLastName}
                onNext={goToNextStep}
              />
            )}
            
            {step === 2 && (
              <PhoneStep
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                countryCode={countryCode}
                setCountryCode={setCountryCode}
                countryModalVisible={countryModalVisible}
                setCountryModalVisible={setCountryModalVisible}
                onNext={handleSendOTP}
                onBack={goToPrevStep}
                isLoading={isLoading}
              />
            )}
            
            {step === 3 && (
              <OtpStep
                otp={otp}
                setOtp={setOtp}
                onVerify={handleVerifyOTP}
                onBack={goToPrevStep}
                isLoading={isLoading}
                error={otpError}
                resendOtp={handleResendOTP}
                canResend={canResend}
                timer={timer}
              />
            )}
            
            {step === 4 && (
              <PhotoStep
                profileImage={profileImage}
                setProfileImage={setProfileImage}
                onComplete={handleCompleteProfile}
                onSkip={handleSkipProfile}
                onBack={goToPrevStep}
                isLoading={isLoading}
              />
            )}
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
  },
  header: {
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: Layout.spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
  },
  stepContainer: {
    marginTop: 40,
  },
  progress: {
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  stepTitle: {
    fontSize: Layout.fontSize.xxl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 32,
    textAlign: 'center',
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  countryCodeText: {
    fontWeight: '600',
    fontSize: 16,
    marginRight: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '85%',
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  modalCloseButton: {
    padding: 4,
  },
  countryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  countryItemText: {
    fontSize: 16,
    color: Colors.text,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 8,
    marginHorizontal: 6,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: Colors.gray50,
  },
  otpInputFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  otpSubtitle: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 14,
  },
  errorText: {
    color: Colors.error,
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  resendText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  timerText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  photoSubtitle: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    fontSize: 14,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  imageHint: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 14,
  },
});