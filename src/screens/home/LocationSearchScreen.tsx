import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (searchQuery.length > 2) {
      searchPlaces(searchQuery);
    } else {
      setSearchResults([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const searchPlaces = async (query: string) => {
    setIsSearching(true);
    try {
      // Default to New Delhi if no location
      const location = '28.6139,77.2090';
      const radius = 50000; // 50km
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&location=${location}&radius=${radius}&components=country:in&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.status === 'OK') {
        setSearchResults(data.predictions || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      setSearchResults([]);
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

  const handleLocationSelect = async (item: PlaceResult) => {
    const placeDetails = await getPlaceDetails(item.place_id);
    if (!placeDetails) return;
    const location = {
      latitude: placeDetails.geometry.location.lat,
      longitude: placeDetails.geometry.location.lng,
      address: placeDetails.formatted_address,
    };
    if (type === 'pickup') {
      useLocationStore.getState().setPickupLocation(location);
      navigation.goBack();
    } else if (type === 'destination') {
      useLocationStore.getState().setDropoffLocation(location);
      navigation.navigate('RideEstimate', { destination: location });
    }
  };

  const renderSearchResult = ({ item }: { item: PlaceResult }) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => handleLocationSelect(item)}>
      <Ionicons name="location-outline" size={20} color={Colors.primary} style={{ marginRight: 12 }} />
      <View>
        <Text style={styles.resultMain}>{item.structured_formatting.main_text}</Text>
        <Text style={styles.resultSecondary}>{item.structured_formatting.secondary_text}</Text>
      </View>
    </TouchableOpacity>
  );

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
      {/* Results */}
      <View style={{ flex: 1 }}>
        {isSearching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={Colors.primary} />
          </View>
        ) : (
          <FlatList
            data={searchResults}
            keyExtractor={item => item.place_id}
            renderItem={renderSearchResult}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
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
