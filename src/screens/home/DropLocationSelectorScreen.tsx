import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, TextInput, ActivityIndicator, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');

const RECENT_LOCATIONS = [
  {
    id: '1',
    name: 'DSR Tranquil',
    address: '901, KTR Colony, Mega Hills, Madhapur…',
  },
  {
    id: '2',
    name: 'Durgam Cheruvu Metro Station',
    address: 'Hitech City Road, Sri Sai Nagar, Madhapur…',
  },
  {
    id: '3',
    name: 'MIG-59',
    address: 'Dharma Reddy Colony Phase I, Kukatpally…',
  },
  {
    id: '4',
    name: 'Madhapur Metro Station',
    address: 'Road Number 36, Aditya Enclave, Venkatagiri…',
  },
  {
    id: '5',
    name: 'Raju Gari Biryani',
    address: '60 Feet Road, Mega Hills, Madhapur…',
  },
  {
    id: '6',
    name: '6-2-73',
    address: 'Sanjeevaiah Colony, Raju Colony, Bala Nagar…',
  },
  {
    id: '7',
    name: 'Asian Mukta Cinemas A2 (Konark)',
    address: 'Konark Theatre Lane, Madhura Puri Colony…',
  },
  {
    id: '8',
    name: 'Dharma Reddy Colony Phase 1',
    address: 'Kukatpally, Hyderabad, Telangana, India',
  },
];

const GOOGLE_MAPS_API_KEY = 'AIzaSyDHN3SH_ODlqnHcU9Blvv2pLpnDNkg03lU';

export default function DropLocationSelectorScreen({ navigation, route }: any) {
  const [dropLocation, setDropLocation] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [editing, setEditing] = useState<'drop' | 'current' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [noResults, setNoResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (route.params?.destination) {
      setDropLocation(route.params.destination);
      if (editing === 'drop') setSearchQuery(route.params.destination.address || route.params.destination.name || '');
    }
  }, [route.params?.destination]);

  useEffect(() => {
    if (editing && searchQuery.length > 2) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        searchPlaces(searchQuery);
      }, 300);
    } else {
      setSearchResults([]);
      setNoResults(false);
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, editing]);

  const searchPlaces = async (query: string) => {
    setIsSearching(true);
    setNoResults(false);
    try {
      const location = '28.6139,77.2090';
      const radius = 50000;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&location=${location}&radius=${radius}&components=country:in&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.status === 'OK' && data.predictions.length > 0) {
        setSearchResults(data.predictions || []);
        setNoResults(false);
      } else {
        setSearchResults([]);
        setNoResults(true);
      }
    } catch (error) {
      setSearchResults([]);
      setNoResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  const getPlaceDetails = async (placeId: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,formatted_address&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.status === 'OK') {
        return data.result;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  const handleLocationSelect = async (item: any) => {
    let location;
    if (item.place_id) {
      const placeDetails = await getPlaceDetails(item.place_id);
      if (!placeDetails) return;
      location = {
        latitude: placeDetails.geometry.location.lat,
        longitude: placeDetails.geometry.location.lng,
        address: placeDetails.formatted_address,
        name: item.structured_formatting?.main_text || item.description,
      };
    } else {
      location = item;
    }
    if (editing === 'drop') {
      setDropLocation(location);
    } else if (editing === 'current') {
      setCurrentLocation(location);
    }
    setSearchQuery(location.address || location.name || '');
    setEditing(null);
    setSearchResults([]);
    setNoResults(false);
    Keyboard.dismiss();
  };

  const handleSelectOnMap = () => {
    navigation.navigate('DropPinLocation');
  };

  const handleConfirmDrop = () => {
    if (dropLocation) {
      navigation.navigate('RideOptions', {
        pickup: currentLocation,
        drop: dropLocation,
      });
    }
  };

  const renderSearchResult = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.locationItem} onPress={() => handleLocationSelect(item)}>
      <Ionicons name="location-outline" size={22} color={Colors.primary} style={{ marginRight: 14 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.locationName}>{item.structured_formatting?.main_text || item.name || item.description}</Text>
        <Text style={styles.locationAddress} numberOfLines={1}>{item.structured_formatting?.secondary_text || item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderLocation = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.locationItem} onPress={() => handleLocationSelect(item)}>
      <Ionicons name="time-outline" size={22} color={Colors.gray400} style={{ marginRight: 14 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.locationName}>{item.name}</Text>
        <Text style={styles.locationAddress} numberOfLines={1}>{item.address}</Text>
      </View>
      <Ionicons name="heart-outline" size={22} color={Colors.gray400} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navIcon}>
          <Ionicons name="arrow-back" size={26} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Drop</Text>
        <TouchableOpacity style={styles.navDropdown}>
          <Text style={styles.navDropdownText}>For me </Text>
          <Ionicons name="chevron-down" size={18} color={Colors.text} />
        </TouchableOpacity>
      </View>
      {/* Location Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryIcons}>
          <Ionicons name="ellipse" size={18} color={Colors.success} style={styles.iconShadow} />
          <View style={styles.dottedLine} />
          <Ionicons name="ellipse" size={18} color={Colors.coral} style={styles.iconShadow} />
        </View>
        <View style={styles.summaryTextCol}>
          <TouchableOpacity onPress={() => { setEditing('current'); setSearchQuery(currentLocation?.address || currentLocation?.name || ''); }} activeOpacity={0.8}>
            {editing === 'current' ? (
              <TextInput
                style={[styles.summarySubtitle, { color: Colors.text, backgroundColor: Colors.gray50, borderRadius: 8, paddingHorizontal: 8 }]}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Your Current Location"
                autoFocus
                clearButtonMode="while-editing"
              />
            ) : (
              <Text style={styles.summaryTitle}>Your Current Location</Text>
            )}
          </TouchableOpacity>
          <View style={styles.summaryDivider} />
          <TouchableOpacity onPress={() => { setEditing('drop'); setSearchQuery(dropLocation?.address || dropLocation?.name || ''); }} activeOpacity={0.8}>
            {editing === 'drop' ? (
              <TextInput
                style={[styles.summarySubtitle, { color: Colors.text, backgroundColor: Colors.gray50, borderRadius: 8, paddingHorizontal: 8 }]}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Drop location"
                autoFocus
                clearButtonMode="while-editing"
              />
            ) : (
              <Text style={styles.summarySubtitle}>
                {dropLocation ? dropLocation.address || dropLocation.name : 'Drop location'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      {/* Buttons Below Card */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.mapBtn} onPress={handleSelectOnMap}>
          <Ionicons name="navigate" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
          <Text style={styles.mapBtnText}>Select on map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addStopsBtn}>
          <Ionicons name="add" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
          <Text style={styles.mapBtnText}>Add stops</Text>
        </TouchableOpacity>
      </View>
      {/* Suggestions or Recent Locations List */}
      {editing ? (
        isSearching ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color={Colors.primary} />
          </View>
        ) : noResults ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: Colors.textLight }}>No suggestions found</Text>
          </View>
        ) : (
          <FlatList
            data={searchResults}
            keyExtractor={item => item.place_id || item.address || item.name}
            renderItem={renderSearchResult}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
          />
        )
      ) : (
        <FlatList
          data={RECENT_LOCATIONS}
          keyExtractor={item => item.id}
          renderItem={renderLocation}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.listDivider} />}
          showsVerticalScrollIndicator={false}
        />
      )}
      {/* Confirm Drop Button */}
      <TouchableOpacity
        style={[styles.mapBtn, { backgroundColor: Colors.primary, alignSelf: 'center', marginTop: 12 }]}
        onPress={handleConfirmDrop}
        disabled={!dropLocation}
      >
        <Text style={[styles.mapBtnText, { color: '#fff', fontWeight: '700' }]}>Confirm Drop</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: Colors.background,
  },
  navIcon: {
    padding: 4,
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  navDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  navDropdownText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  summaryIcons: {
    alignItems: 'center',
    marginRight: 14,
    height: 60,
    justifyContent: 'space-between',
  },
  iconShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  dottedLine: {
    width: 2,
    flex: 1,
    borderStyle: 'dotted',
    borderWidth: 1,
    borderColor: Colors.gray300,
    marginVertical: 2,
    borderRadius: 1,
  },
  summaryTextCol: {
    flex: 1,
    justifyContent: 'space-between',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginVertical: 2,
    borderRadius: 1,
  },
  summarySubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.coral,
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 8,
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 10,
  },
  addStopsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  mapBtnText: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '600',
    
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 24,
    marginTop: 8,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 14,
    color: Colors.gray400,
    fontWeight: '400',
  },
  listDivider: {
    height: 4,
  },
}); 