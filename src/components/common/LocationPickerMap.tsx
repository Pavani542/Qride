import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, MapPressEvent, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface LocationPickerMapProps {
  mode: 'pickup' | 'dropoff';
  initialLocation?: Location;
  onLocationSelected: (location: Location) => void;
}

const DEFAULT_REGION: Region = {
  latitude: 28.6139,
  longitude: 77.2090,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  mode,
  initialLocation,
  onLocationSelected,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>(initialLocation);
  const [region, setRegion] = useState<Region>(
    initialLocation
      ? {
          latitude: initialLocation.latitude,
          longitude: initialLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }
      : DEFAULT_REGION
  );

  const handleMapPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const location = { latitude, longitude };
    setSelectedLocation(location);
    onLocationSelected(location);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        region={region}
        onRegionChangeComplete={setRegion}
        onPress={handleMapPress}
        showsUserLocation
        showsMyLocationButton
      >
        {selectedLocation && (
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }}
            title={mode === 'pickup' ? 'Pickup Location' : 'Dropoff Location'}
            pinColor={mode === 'pickup' ? 'green' : 'red'}
          />
        )}
      </MapView>
      {selectedLocation && (
        <View style={styles.overlay}>
          <Ionicons
            name={mode === 'pickup' ? 'location' : 'flag'}
            size={18}
            color={mode === 'pickup' ? Colors.primary : Colors.coral}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.overlayText}>
            Lat: {selectedLocation.latitude.toFixed(5)}, Lng: {selectedLocation.longitude.toFixed(5)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 24,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overlayText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },
});

export default LocationPickerMap; 