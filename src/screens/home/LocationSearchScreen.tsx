
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

const mockSearchResults = [
  {
    id: '1',
    name: 'Koramangala 5th Block',
    address: 'Koramangala, Bangalore, Karnataka',
    type: 'location',
  },
  {
    id: '2',
    name: 'Electronic City',
    address: 'Electronic City, Bangalore, Karnataka',
    type: 'location',
  },
  {
    id: '3',
    name: 'Indiranagar',
    address: 'Indiranagar, Bangalore, Karnataka',
    type: 'location',
  },
  {
    id: '4',
    name: 'Whitefield',
    address: 'Whitefield, Bangalore, Karnataka',
    type: 'location',
  },
];

const recentSearches = [
  {
    id: '1',
    name: 'MG Road Metro Station',
    address: 'MG Road, Bangalore',
    type: 'recent',
  },
  {
    id: '2',
    name: 'Forum Mall',
    address: 'Koramangala, Bangalore',
    type: 'recent',
  },
];

export default function LocationSearchScreen({ navigation, route }: any) {
  const { type } = route.params; // 'pickup' or 'destination'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(mockSearchResults);

  const handleLocationSelect = (location: any) => {
    if (type === 'destination') {
      navigation.navigate('RideEstimate', { destination: location });
    } else {
      navigation.goBack();
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Filter results based on query
    const filtered = mockSearchResults.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.address.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const renderLocationItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.locationItem}
      onPress={() => handleLocationSelect(item)}
    >
      <View style={styles.locationIcon}>
        <Ionicons
          name={item.type === 'recent' ? 'time' : 'location'}
          size={20}
          color={Colors.gray400}
        />
      </View>
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{item.name}</Text>
        <Text style={styles.locationAddress}>{item.address}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
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
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={Colors.gray400} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search for ${type} location`}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color={Colors.gray400} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Current Location Option */}
      <TouchableOpacity style={styles.currentLocationOption}>
        <View style={styles.currentLocationIcon}>
          <Ionicons name="locate" size={20} color={Colors.primary} />
        </View>
        <View style={styles.locationInfo}>
          <Text style={styles.locationName}>Use current location</Text>
          <Text style={styles.locationAddress}>Koramangala 5th Block, Bangalore</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
      </TouchableOpacity>

      {/* Recent Searches */}
      {searchQuery.length === 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          <FlatList
            data={recentSearches}
            renderItem={renderLocationItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {/* Search Results */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {searchQuery.length > 0 ? 'Search Results' : 'Popular Places'}
        </Text>
        <FlatList
          data={searchResults}
          renderItem={renderLocationItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
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
  searchContainer: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Layout.fontSize.md,
    color: Colors.text,
    marginLeft: Layout.spacing.sm,
  },
  currentLocationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  currentLocationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  section: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  locationAddress: {
    fontSize: Layout.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
