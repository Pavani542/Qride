import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { useLocationStore } from '../../store/useLocationStore';
import LocationPickerMap from '../../components/common/LocationPickerMap';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDHN3SH_ODlqnHcU9Blvv2pLpnDNkg03lU';

interface PlaceResult {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface PlaceDetails {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  formatted_address: string;
}

export default function LocationSearchScreen({ navigation, route }: any) {
  const { type } = route.params; // 'pickup' or 'destination'
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
  const [noResults, setNoResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { recentLocations } = useLocationStore();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (searchQuery.length > 2) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const searchPlaces = async (query: string) => {
    setIsSearching(true);
    setNoResults(false);
    try {
      // Default to New Delhi if no location
      const location = '28.6139,77.2090';
      const radius = 50000; // 50km
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

  const getPlaceDetails = async (placeId: string): Promise<PlaceDetails | null> => {
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

  const handleLocationSelect = async (item: PlaceResult | any) => {
    let location;
    if (item.place_id) {
      const placeDetails = await getPlaceDetails(item.place_id);
      if (!placeDetails) return;
      location = {
        latitude: placeDetails.geometry.location.lat,
        longitude: placeDetails.geometry.location.lng,
        address: placeDetails.formatted_address,
      };
    } else {
      // Recent location
      location = item;
    }
    if (type === 'pickup') {
      useLocationStore.getState().setPickupLocation(location);
      navigation.goBack();
    } else if (type === 'destination') {
      useLocationStore.getState().setDropoffLocation(location);
      navigation.navigate('RideEstimate', { destination: location });
    }
  };

  const renderRecentLocation = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => handleLocationSelect(item)}>
      <Ionicons name="time-outline" size={20} color={Colors.primary} style={{ marginRight: 12 }} />
      <View>
        <Text style={styles.resultMain}>{item.address || item.name}</Text>
        {item.address && <Text style={styles.resultSecondary}>{item.address}</Text>}
      </View>
    </TouchableOpacity>
  );

  const renderSearchResult = ({ item }: { item: PlaceResult }) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => handleLocationSelect(item)}>
      <Ionicons name="location-outline" size={20} color={Colors.primary} style={{ marginRight: 12 }} />
      <View>
        <Text style={styles.resultMain}>{item.structured_formatting.main_text}</Text>
        <Text style={styles.resultSecondary}>{item.structured_formatting.secondary_text}</Text>
      </View>
    </TouchableOpacity>
  );

  // Combine recent locations and search results for FlatList
  const showRecent = searchQuery.length > 2 && recentLocations.length > 0;
  const combinedData = showRecent
    ? [
        { title: 'Recent Locations', data: recentLocations, isRecent: true },
        { title: 'Suggestions', data: searchResults, isRecent: false },
      ]
    : [{ title: 'Suggestions', data: searchResults, isRecent: false }];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {type === 'pickup' ? 'Pickup Location' : 'Where to?'}
        </Text>
      </View>
      {/* Search Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder={`Search for ${type} location`}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
          clearButtonMode="while-editing"
        />
      </View>
      {/* Map or Results */}
      <View style={{ flex: 1 }}>
        {searchQuery.length === 0 ? (
          <LocationPickerMap
            mode={type}
            onLocationSelected={(location) => {
              if (type === 'pickup') {
                useLocationStore.getState().setPickupLocation(location);
                navigation.goBack();
              } else if (type === 'destination') {
                useLocationStore.getState().setDropoffLocation(location);
                navigation.navigate('RideEstimate', { destination: location });
              }
            }}
          />
        ) : isSearching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={Colors.primary} />
          </View>
        ) : noResults ? (
          <View style={styles.loadingContainer}>
            <Text style={{ color: Colors.textLight }}>No suggestions found</Text>
          </View>
        ) : (
          <FlatList
            data={showRecent ? recentLocations.concat(searchResults) : searchResults}
            keyExtractor={(item, idx) => item.place_id ? item.place_id : item.address + idx}
            renderItem={({ item, index }) =>
              item.place_id
                ? renderSearchResult({ item })
                : renderRecentLocation({ item })
            }
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={
              showRecent && recentLocations.length > 0 ? (
                <Text style={{ fontWeight: '600', color: Colors.text, marginBottom: 8 }}>
                  Recent Locations
                </Text>
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    marginRight: Layout.spacing.md,
  },
  headerTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  inputContainer: {
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
    paddingBottom: Layout.spacing.sm,
  },
  textInput: {
    fontSize: 16,
    backgroundColor: Colors.gray50,
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listContent: {
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: 8,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  resultMain: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  resultSecondary: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
