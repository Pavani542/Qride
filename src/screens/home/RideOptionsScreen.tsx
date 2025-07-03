import React, { useRef, useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Mocked pickup/drop and vehicles
const pickup = {
  latitude: 17.444, longitude: 78.382, address: '423, Ayyappa Society',
};
const drop = {
  latitude: 17.4418, longitude: 78.38, address: 'HUDA Techno Enclave',
};
const routeCoords = [pickup, drop];

const mockVehicles = [
  { id: 1, latitude: 17.443, longitude: 78.381, heading: 45 },
  { id: 2, latitude: 17.442, longitude: 78.383, heading: 90 },
  { id: 3, latitude: 17.445, longitude: 78.384, heading: 120 },
  { id: 4, latitude: 17.440, longitude: 78.379, heading: 200 },
  { id: 5, latitude: 17.4435, longitude: 78.378, heading: 300 },
];

const rideOptions = [
  {
    id: 'bike',
    icon: 'motorbike',
    label: 'Bike',
    eta: '2 mins',
    dropTime: 'Drop 9:14 am',
    price: 33,
    tag: 'FASTEST',
    tagColor: '#22c55e',
  },
  {
    id: 'scooty',
    icon: 'scooter',
    label: 'Electric Scooty',
    eta: '3 mins',
    dropTime: 'Drop 9:16 am',
    price: 35,
    tag: 'NEW',
    tagColor: '#3b82f6',
  },
  {
    id: 'auto',
    icon: 'rickshaw',
    label: 'Auto',
    eta: '2 mins',
    dropTime: 'Drop 9:14 am',
    price: 59,
  },
  {
    id: 'cab',
    icon: 'car',
    label: 'Cab Non AC',
    eta: '2 mins',
    dropTime: 'Drop 9:14 am',
    price: 120,
    tag: 'FASTEST',
    tagColor: '#22c55e',
  },
  {
    id: 'cabac',
    icon: 'car-coolant-temperature',
    label: 'Cab AC',
    eta: '2 mins',
    dropTime: 'Drop 9:14 am',
    price: 140,
  },
];

export default function RideOptionsScreen({ navigation }: any) {
  const [selected, setSelected] = useState('bike');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['40%', '80%'], []);

  // Animated vehicle marker (rotation)
  const animatedMarkers = mockVehicles.map((v) => {
    const rotation = useSharedValue(v.heading);
    useEffect(() => {
      rotation.value = withTiming((v.heading + Math.random() * 30) % 360, { duration: 2000 });
    }, []);
    const style = useAnimatedStyle(() => ({
      transform: [{ rotate: `${rotation.value}deg` }],
    }));
    return { ...v, style };
  });

  // Handlers
  const handleEditPickup = () => {
    // navigation.navigate('LocationSearch', { type: 'pickup' });
  };
  const handleEditDrop = () => {
    // navigation.navigate('LocationSearch', { type: 'drop' });
  };
  const handleBook = () => {
    // navigation.navigate('RideSummary', { rideType: selected });
  };

  return (
    <View style={styles.container}>
      {/* Map Section */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: (pickup.latitude + drop.latitude) / 2,
          longitude: (pickup.longitude + drop.longitude) / 2,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
      >
        {/* Route Polyline */}
        <Polyline
          coordinates={routeCoords}
          strokeColor="#222"
          strokeWidth={4}
        />
        {/* Pickup Marker */}
        <Marker coordinate={pickup} pinColor="green">
          <Ionicons name="location" size={32} color="#22c55e" />
        </Marker>
        {/* Drop Marker */}
        <Marker coordinate={drop} pinColor="red">
          <Ionicons name="location" size={32} color="#ef4444" />
        </Marker>
        {/* Animated Vehicle Markers */}
        {animatedMarkers.map((v) => (
          <Marker key={v.id} coordinate={v} anchor={{ x: 0.5, y: 0.5 }}>
            <Animated.View style={v.style}>
              <MaterialCommunityIcons name="motorbike" size={32} color="#fbbf24" />
            </Animated.View>
          </Marker>
        ))}
      </MapView>
      {/* Floating Chips */}
      <View style={styles.chipContainer} pointerEvents="box-none">
        <View style={[styles.chip, { left: width * 0.25, top: 60 }]}> 
          <Text numberOfLines={1} style={styles.chipText}>{pickup.address}</Text>
          <TouchableOpacity onPress={handleEditPickup} style={styles.chipEdit}>
            <Ionicons name="pencil" size={16} color="#222" />
          </TouchableOpacity>
        </View>
        <View style={[styles.chip, { left: width * 0.55, top: 120 }]}> 
          <Text numberOfLines={1} style={styles.chipText}>{drop.address}</Text>
          <TouchableOpacity onPress={handleEditDrop} style={styles.chipEdit}>
            <Ionicons name="pencil" size={16} color="#222" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        style={styles.sheet}
        backgroundStyle={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
        handleIndicatorStyle={{ backgroundColor: '#d1d5db', width: 60 }}
      >
        <View style={styles.sheetContent}>
          {rideOptions.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              style={[styles.rideOption, selected === opt.id && styles.rideOptionSelected]}
              onPress={() => setSelected(opt.id)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name={opt.icon} size={32} color="#222" style={{ marginRight: 16 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.rideLabel}>{opt.label}</Text>
                <Text style={styles.rideMeta}>{opt.eta} • {opt.dropTime}</Text>
              </View>
              {opt.tag && (
                <View style={[styles.tag, { backgroundColor: opt.tagColor || '#fbbf24' }]}> 
                  <Text style={styles.tagText}>{opt.tag}</Text>
                </View>
              )}
              <Text style={styles.ridePrice}>₹{opt.price}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Sticky Bar */}
        <View style={styles.stickyBar}>
          <TouchableOpacity style={styles.stickyBtn}>
            <Ionicons name="cash-outline" size={20} color="#222" style={{ marginRight: 6 }} />
            <Text style={styles.stickyBtnText}>Cash</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.stickyBtn}>
            <Ionicons name="pricetag-outline" size={20} color="#22c55e" style={{ marginRight: 6 }} />
            <Text style={[styles.stickyBtnText, { color: '#22c55e' }]}>% Offers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookBtn} onPress={handleBook}>
            <Text style={styles.bookBtnText}>Book {rideOptions.find(o => o.id === selected)?.label || 'Bike'}</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { flex: 1 },
  chipContainer: { position: 'absolute', width: '100%', zIndex: 10 },
  chip: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 120,
    maxWidth: 180,
  },
  chipText: { fontWeight: '600', color: '#222', flex: 1, marginRight: 8 },
  chipEdit: { padding: 4 },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  sheetContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 80 },
  rideOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  rideOptionSelected: {
    borderColor: '#22c55e',
    backgroundColor: '#f0fdf4',
  },
  rideLabel: { fontWeight: '700', fontSize: 16, color: '#222' },
  rideMeta: { color: '#64748b', fontSize: 13, marginTop: 2 },
  ridePrice: { fontWeight: '700', fontSize: 18, color: '#222', marginLeft: 12 },
  tag: {
    backgroundColor: '#fbbf24',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
    alignSelf: 'flex-start',
  },
  tagText: { color: '#fff', fontWeight: '700', fontSize: 11 },
  stickyBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 20,
  },
  stickyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
  },
  stickyBtnText: { fontWeight: '700', color: '#222', fontSize: 15 },
  bookBtn: {
    flex: 1,
    backgroundColor: '#fde047',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  bookBtnText: { fontWeight: '700', color: '#222', fontSize: 18 },
}); 