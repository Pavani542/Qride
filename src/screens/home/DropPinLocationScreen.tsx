import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');
const MAP_HEIGHT = height * 0.60;
const PIN_SIZE = 44;

const DEFAULT_REGION = {
  latitude: 28.6139,
  longitude: 77.2090,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

function parseAddress(address: string): { house: string; rest: string } {
  if (!address) return { house: '', rest: '' };
  const match = address.match(/^\s*(.+?)[,\s]+(.+)$/);
  if (match) {
    return { house: match[1], rest: match[2] };
  }
  return { house: address, rest: '' };
}

export default function DropPinLocationScreen({ navigation }: any) {
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [address, setAddress] = useState('Fetching address...');
  const [locationName, setLocationName] = useState('Address');
  const [isFetching, setIsFetching] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reverse geocode using provided API key
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsFetching(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDHN3SH_ODlqnHcU9Blvv2pLpnDNkg03lU`
      );
      const data = await response.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        // Location name: use locality or first part of formatted_address
        let locName = '';
        const locality = result.address_components?.find((comp: any) =>
          comp.types.includes('locality') || comp.types.includes('sublocality')
        );
        if (locality) {
          locName = locality.long_name;
        } else {
          locName = result.formatted_address.split(',')[0];
        }
        setLocationName(locName);
        setAddress(result.formatted_address);
      } else {
        setLocationName('Address');
        setAddress('not found');
      }
    } catch (e) {
      setLocationName('Address');
      setAddress('not found');
    } finally {
      setIsFetching(false);
    }
  };

  const handleRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      reverseGeocode(newRegion.latitude, newRegion.longitude);
    }, 400);
  };

  // My Location button: get user's real current location
  const handleMyLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setRegion({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  // When user taps Select Drop, pass locationName, address, and coordinates back to HomeScreen
  const handleSelectDrop = () => {
    navigation.navigate('RideOptions', {
      drop: {
        latitude: region.latitude,
        longitude: region.longitude,
        name: locationName,
        address,
      },
    });
  };

  const { house, rest } = parseAddress(address);

  return (
    <View style={styles.screen}>
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFill}
          region={region}
          onRegionChangeComplete={handleRegionChangeComplete}
          showsUserLocation
          showsMyLocationButton={false}
        />
        {/* Floating Center Pin (emoji for Rapido style) */}
        <View pointerEvents="none" style={styles.pinContainer}>
          <Text style={{ fontSize: 44, color: Colors.coral, textAlign: 'center' }}>📍</Text>
        </View>
        {/* My Location Button */}
        <TouchableOpacity style={styles.myLocationBtn} onPress={handleMyLocation}>
          <Ionicons name="locate" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      {/* Bottom Card */}
      <View style={styles.addressCard}>
        <View style={styles.addressRow}>
          <Text style={styles.addressLabel}>Select your location</Text>
          <TouchableOpacity>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.selectedAddressBox}>
          <View style={styles.iconCircle}>
            <Ionicons name="location-sharp" size={20} color="#fff" />
          </View>
          <View>
            <Text style={styles.selectedAddressTitle}>
              {isFetching ? <ActivityIndicator size="small" color={Colors.primary} /> : locationName}
            </Text>
            <Text style={styles.selectedAddressSubtitle} numberOfLines={1}>
              {isFetching ? 'Fetching address...' : address || 'not found'}
            </Text>
          </View>
        </View>
        <View style={styles.divider} />
        <Text style={styles.saveLabel}>Save location as</Text>
        <View style={styles.saveRow}>
          <TouchableOpacity style={styles.saveBtn}><Text style={styles.saveBtnIcon}>🏠</Text><Text style={styles.saveBtnText}> Home</Text></TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn}><Text style={styles.saveBtnIcon}>💼</Text><Text style={styles.saveBtnText}> Work</Text></TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn}><Text style={styles.saveBtnIcon}>➕</Text><Text style={styles.saveBtnText}> Add New</Text></TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.selectDropButton} onPress={handleSelectDrop} activeOpacity={0.8}>
        <Text style={styles.selectDropButtonText}>Select Drop</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  mapContainer: {
    width: width,
    height: MAP_HEIGHT,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#eee',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  pinContainer: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -PIN_SIZE / 2,
    marginTop: -PIN_SIZE,
    zIndex: 10,
    elevation: 10,
  },
  myLocationBtn: {
    position: 'absolute',
    right: 18,
    bottom: 40,
    backgroundColor: '#fff',
    borderRadius: 22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  addressCard: {
    width: width - 32,
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginTop: -32,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: Colors.gray100,
    alignItems: 'stretch',
  },
  addressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addressLabel: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '700',
  },
  changeText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 15,
  },
  selectedAddressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedAddressTitle: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: '700',
    marginBottom: 2,
  },
  selectedAddressSubtitle: {
    fontSize: 14,
    color: Colors.gray400,
    fontWeight: '400',
    width: width - 120,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginVertical: 12,
    borderRadius: 1,
  },
  saveLabel: {
    fontSize: 15,
    color: Colors.gray400,
    marginBottom: 8,
    fontWeight: '500',
  },
  saveRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 2,
    marginBottom: 8,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginRight: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  saveBtnIcon: {
    fontSize: 18,
  },
  saveBtnText: {
    fontSize: 10,
    color: Colors.text,
    fontWeight: '500',
  },
  selectDropButton: {
    width: width - 32,
    backgroundColor: Colors.primary,
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    alignSelf: 'center',
    elevation: 2,
    marginBottom: 18,
  },
  selectDropButtonText: {
    color: '#222',
    fontWeight: '700',
    fontSize: 20,
    letterSpacing: 0.2,
  },
});
