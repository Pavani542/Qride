import React, { useRef, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const PRIMARY_GREEN = '#219C7E';
const TITLE_COLOR = '#111827';
const SUBTITLE_COLOR = '#6B7280';

const screens = [
  {
    key: 'booking',
    illustration: (
      <View style={{ width: 300, height: 300, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
        <Image source={require('../../../assets/images/appacella-logo-blue.png')} style={{ width: 270, height: 270, resizeMode: 'contain' }} />
      </View>
    ),
    title: 'Quick & Easy Booking',
    subtitle: 'Book your bike taxi in just a few taps. Fast, simple, and convenient rides at your fingertips.',
  },
  {
    key: 'affordable',
    illustration: (
      <View style={{ width: 300, height: 300, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
        <Image source={require('../../../assets/images/appacella-logo-blue.png')} style={{ width: 270, height: 270, resizeMode: 'contain' }} />
      </View>
    ),
    title: 'Affordable Rides',
    subtitle: 'Save money on every trip. Enjoy budget-friendly rides without compromising on quality and comfort.',
  },
  {
    key: 'safe',
    illustration: (
      <View style={{ width: 300, height: 300, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
        <Image source={require('../../../assets/images/appacella-logo-blue.png')} style={{ width: 270, height: 270, resizeMode: 'contain' }} />
      </View>
    ),
    title: 'Safe & Reliable',
    subtitle: 'Verified drivers, tracked rides, and 24/7 support. Your safety is our top priority on every journey.',
  },
  {
    key: 'eco',
    illustration: (
      <View style={{ width: 300, height: 300, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
        <Image source={require('../../../assets/images/appacella-logo-blue.png')} style={{ width: 270, height: 270, resizeMode: 'contain' }} />
      </View>
    ),
    title: 'she-to-she',
    subtitle: 'Reduce your carbon footprint while getting around the city. Choose sustainable transportation for a greener future.',
  },
];

export default function OnboardingSwiper({ navigation }: { navigation?: any }) {
  const [index, setIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (index < screens.length - 1) {
      flatListRef.current?.scrollToIndex({ index: index + 1 });
    } else {
      navigation?.replace?.('Login');
    }
  };

  const handleSkip = () => {
    navigation?.replace?.('Login');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <FlatList
        ref={flatListRef}
        data={screens}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.key}
        onMomentumScrollEnd={e => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(newIndex);
        }}
        renderItem={({ item }) => (
          <View style={{ width, height, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            {item.illustration}
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: TITLE_COLOR, marginTop: 32, textAlign: 'center' }}>{item.title}</Text>
            <Text style={{ fontSize: 16, color: SUBTITLE_COLOR, marginTop: 16, textAlign: 'center' }}>{item.subtitle}</Text>
          </View>
        )}
      />

      {/* Pagination Dots */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 32 }}>
        {screens.map((_, i) => (
          <View
            key={i}
            style={{
              marginHorizontal: 4,
              borderRadius: 9999,
              width: i === index ? 20 : 10,
              height: 10,
              backgroundColor: i === index ? PRIMARY_GREEN : '#E5E7EB',
              opacity: i === index ? 1 : 0.5,
            }}
          />
        ))}
      </View>

      {/* Buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 32, marginBottom: 40 }}>
        {index < screens.length - 1 ? (
          <>
            <TouchableOpacity onPress={handleSkip} style={{ paddingVertical: 12, paddingHorizontal: 24 }}>
              <Text style={{ color: PRIMARY_GREEN, fontSize: 16, fontWeight: '600' }}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNext}
              style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: PRIMARY_GREEN, borderRadius: 9999, paddingVertical: 14, paddingHorizontal: 32 }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', marginRight: 8 }}>Next</Text>
              <Text style={{ color: '#fff', fontSize: 18 }}>→</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            onPress={handleNext}
            style={{ flex: 1, backgroundColor: PRIMARY_GREEN, borderRadius: 9999, paddingVertical: 14, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
