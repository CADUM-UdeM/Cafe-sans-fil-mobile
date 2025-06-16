import React, { useEffect, useState } from "react";
import { Redirect, router } from "expo-router";
import * as Location from "expo-location";
import { Activity, Star, Vegan } from "lucide-react-native";
import { View, StyleSheet, Image, Text, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity } from "react-native";

import useLocation from "@/hooks/useLocation";
import useOnForegroundBack from "@/hooks/useOnForegroundBack";
import useSortedItemsByDistance from "@/hooks/useSortedItemsByDistance";

import SPACING from "@/constants/Spacing";
import {
  pavillonCoordinates,
  type PavillonCoordinate,
} from "@/constants/Coordinates";
import TYPOGRAPHY from "@/constants/Typography";
import { allCafe } from "@/constants/types/GET_list_cafe";

import Tooltip from "@/components/common/Tooltip";
import Search from "@/components/common/Inputs/Search";
import CafeCard from "@/components/common/Cards/CafeCard";
import SelectLocalisation from "@/components/common/SelectLocalisation";
import CardScrollableLayout from "@/components/layouts/CardScrollableLayout";

import { useModal } from "@/components/layouts/GlobalModal";
import ScrollableLayout from "@/components/layouts/ScrollableLayout";
import FilterModalLayout from "@/components/layouts/FilterModalLayout";

import COLORS from "@/constants/Colors";
import { Cafe } from "@/constants/types/GET_cafe";

/**
 * Home screen of the app. It allows the user to search for cafes, filter them,
 * and view them. The screen also displays quick search options and cafe cards
 * by categories. It also gets the user's current location. Based on the user's
 * location, it predicts the closests pavillons to the user. This will help to
 * show in which pavillon the user is located.
 *
 * ### For later implementation:
 * - Home screen should also be able to predict the closest cafes to the user
 * based on he's location.
 *
 * @auth User must be authenticated.
 *
 * @hook
 * - `useLocation`: Manages the user's location state.
 * - `useOnForegroundBack`: Executes a callback when the app comes to the foreground.
 * - `useSortedItemsByDistance`: Sorts items based on their distance from the user's location.
 * - `useModal`: Provides modal context for opening and closing modals.
 *
 * @section
 * - Location and Search: Allows the user to select a location and perform a search with optional filters.
 * - Quick Search Section: Displays tooltips for quick access to different categories.
 * - Horizontal Cafe Cards By Categories: Shows cafe cards categorized by trends, proximity, and promotions.
 * - All Cafes Cards: Lists all available cafes.
 */
export default function HomeScreen() {
  const [data, setData] = useState<allCafe | any>();
  const [closest, setClosest] = useState<Cafe[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [showOnlyOrder, setShowOnlyOrder] = useState(false);
  const [showOpen, setShowOpen] = useState(false);
  const [location, getCurrentLocation] = useLocation();
  const [originalData, setOriginalData] = useState<Cafe[]>();
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string,
    coords: { latitude: number, longitude: number }
  } | null>(null);
  // Execute a callback when the app comes to the foreground
  useOnForegroundBack(getCurrentLocation);

  useEffect(() => {
    setIsLoading(true);
    fetch("https://cafesansfil-api-r0kj.onrender.com/api/cafes")
      .then((response) => response.json())
      .then((json) => {
        setOriginalData(json.items);
        
        // Only set data and closest if we don't have a selected location
        if (!selectedLocation) {
          setData(json.items);
          setClosest(sortByDistance(location as Location.LocationObject, json.items));
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setIsLoading(false);
      });
  }, [location]);

  // Add this useEffect to ensure locations are re-sorted when selectedLocation changes
  useEffect(() => {
    if (selectedLocation && originalData) {
      console.log("Selected location changed, re-sorting cafes");
      const sortedCafes = sortByDistance(
        { coords: selectedLocation.coords } as Location.LocationObject, 
        originalData
      );
      setClosest(sortedCafes);
    }
  }, [selectedLocation]); // Only depend on selectedLocation

  /**
   * This function returns the closest cafe based on the user's current location
   * or selected location.
   */
  function sortByDistance(current: Location.LocationObject, cafes: Cafe[]): Cafe[] | undefined {
    if (current && cafes) {
      // If we have a selected location, use that instead of the device location
      const useCoords = selectedLocation
        ? selectedLocation.coords
        : { latitude: current.coords.latitude, longitude: current.coords.longitude };

      let cafeDistances = cafes.map(cafe => {
        if (cafe.location.geometry) {
          let cafeCoords = cafe.location.geometry.coordinates;
          let x = useCoords.latitude - cafeCoords[1];
          let y = useCoords.longitude - cafeCoords[0];
          let distance = Math.sqrt(x ** 2 + y ** 2);
          return { ...cafe, distance };
        }
        return { ...cafe, distance: Infinity };
      });

      cafeDistances.sort((a, b) => a.distance - b.distance);
      return cafeDistances;
    }
  }

  // Function to handle location changes from SelectLocalisation
  const handleLocationChange = (pavilionName: string, coords: { latitude: number, longitude: number }) => {
    console.log("Location change handler called with:", pavilionName, coords);

    setSelectedLocation({
      name: pavilionName,
      coords: coords
    });

    // The re-sorting will happen in the useEffect instead of here
    // This prevents race conditions with state updates
  };

  

  function sortByPavillon(cafes: Cafe[]): Cafe[][] {
    if (!cafes || cafes.length === 0) {
      return [];
    }

    // Create a Map to group cafes by pavillon
    const pavillonMap = new Map<string, Cafe[]>();

    // Group cafes by pavillon
    cafes.forEach(cafe => {
      const pavillon = cafe.location.pavillon;
      if (!pavillonMap.has(pavillon)) {
        pavillonMap.set(pavillon, []);
      }
      pavillonMap.get(pavillon)?.push(cafe);
    });

    // Convert the Map to a list of lists
    return Array.from(pavillonMap.values());
  }
  // Print the pavillon of the first cafe in each group
  if (data) {
    const cafesByPavillon = sortByPavillon(data);
  }

  const filterCafes = (cafes: Cafe[]) => {
    let filteredCafesClose = cafes;

    if (showOnlyOrder) {
      filteredCafesClose = filteredCafesClose.filter(cafe => cafe.features.includes("ORDER"));
    }

    if (showOpen) {
      filteredCafesClose = filteredCafesClose.filter(cafe => cafe.is_open == true);
    }
    return filteredCafesClose;

  };

  // Improved search function that correctly handles text changes
  function handleSearch(text: string): void {

    // Always work with the original data to ensure consistent search results
    if (!originalData) return;

    // If search text is empty, restore original data
    if (text.trim() === "") {
      setData(originalData);
      return;
    }

    // Filter cafes based on the current search text
    const filteredCafes = originalData.filter((cafe: Cafe) =>
      cafe.name.toLowerCase().includes(text.toLowerCase()) ||
      cafe.location.pavillon.toLowerCase().includes(text.toLowerCase()) ||
      cafe.location.local.toLowerCase().includes(text.toLowerCase()) ||
      cafe.affiliation.faculty.toLowerCase().includes(text.toLowerCase())
    );

    setData(filteredCafes);
  }

  if (isLoading || (!data && !closest)) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
        <ActivityIndicator size={'large'} />
      </View>
    )
  }
  else {
    if (!location){
      return (
        <SafeAreaView>
          <ScrollableLayout>
            <>
              {/* User Location and Search */}
              <View style={styles.locationAndSearchContainer}>
                <Search onSearch={handleSearch} />
              </View>
  
              {/* TODO: IMPLEMENT FILTERS USING TOOLTIPS */}
              {/* Quick Search Section with Tooltips */}
              <CardScrollableLayout
                scrollMarginTop={SPACING["md"]}
                scrollMarginBottom={SPACING["sm"]}
                dividerBottom
              >
                <Tooltip
                  label="Ouvert"
                  status="green"
                  onPress={() => setShowOpen(!showOpen)}
                  showChevron={false}
                  changeColorOnPress
                />
                <Tooltip
                  label="Commander en ligne"
                  onPress={() => setShowOnlyOrder(!showOnlyOrder)} // fonction qui va afficher les cafés où on peut order en ligne
                  showChevron={false}
                  changeColorOnPress
                />
              </CardScrollableLayout>
  
              <Text
                style={{
                  marginVertical: SPACING["sm"],
                  marginHorizontal: SPACING["sm"],
                  ...TYPOGRAPHY.heading.small.bold
                }}>Tous les cafés
              </Text>
              <FlatList data={filterCafes(data)} renderItem={({ item }) =>
                <CafeCard
                  name={item.name}
                  image={item.banner_url}
                  location={item.location.pavillon}
                  priceRange="$$"
                  rating={4.8}
                  status={item.is_open}
                  id={item.id}
                />}
                keyExtractor={item => item.id}
                horizontal
                ItemSeparatorComponent={() => <View style={{ width: SPACING["md"] }} />}
                style={{
                  paddingHorizontal: SPACING["sm"],
                  paddingBottom: SPACING["md"],
                }}
              />
              
  
              {/* All Cafes Cards */}
              {/* Cafés groupés par pavillon */}
              {data  && (
                <View style={{ marginTop: SPACING["xl"] }}>
  
                  {sortByPavillon(filterCafes(data)).map((pavillonGroup, index) => {
                    if (pavillonGroup.length === 0) return null;
  
                    const pavillonName = pavillonGroup[0].location.pavillon;
  
                    return (
                      <View key={`pavillon-${index}`} style={{ marginBottom: SPACING["lg"] }}>
                        <Text
                          style={{
                            marginVertical: SPACING["sm"],
                            marginHorizontal: SPACING["md"],
                            marginTop: -SPACING["sm"],
                            ...TYPOGRAPHY.heading.small.bold
                          }}>
                          {pavillonName}
                        </Text>
                        <FlatList
                          data={pavillonGroup}
                          renderItem={({ item }) => (
                            <CafeCard
                              name={item.name}
                              image={item.banner_url}
                              location={'L' + item.location.local.substring(1) || ""}
                              priceRange="$$"
                              rating={4.8}
                              status={item.is_open}
                              id={item.id}
                            />
                          )}
                          keyExtractor={item => item.id}
                          horizontal
                          ItemSeparatorComponent={() => <View style={{ width: SPACING["md"] }} />}
                          style={{
                            paddingHorizontal: SPACING["sm"],
                            paddingBottom: SPACING["md"],
                          }}
                        />
                      </View>
                    );
                  })}
                </View>
              )}
  
            </>
          </ScrollableLayout>
        </SafeAreaView>
      );
    }
    else {
    return (
      <SafeAreaView>
        <ScrollableLayout>
          <>
            {/* User Location and Search */}
            <View style={styles.locationAndSearchContainer}>
              <SelectLocalisation
                currentLocalisation={selectedLocation ? selectedLocation.name : closest ? closest[0].location.pavillon : ""}
                location={location as Location.LocationObject}
                onLocationChange={handleLocationChange}
              />

              <Search onSearch={handleSearch} />
            </View>

            {/* TODO: IMPLEMENT FILTERS USING TOOLTIPS */}
            {/* Quick Search Section with Tooltips */}
            <CardScrollableLayout
              scrollMarginTop={SPACING["md"]}
              scrollMarginBottom={SPACING["sm"]}
              dividerBottom
            >
              <Tooltip
                label="Ouvert"
                status="green"
                onPress={() => setShowOpen(!showOpen)}
                showChevron={false}
                changeColorOnPress
              />
              <Tooltip
                label="Commander en ligne"
                onPress={() => setShowOnlyOrder(!showOnlyOrder)} // fonction qui va afficher les cafés où on peut order en ligne
                showChevron={false}
                changeColorOnPress
              />
            </CardScrollableLayout>

            <Text
              style={{
                marginVertical: SPACING["sm"],
                marginHorizontal: SPACING["sm"],
                ...TYPOGRAPHY.heading.small.bold
              }}>Tous les cafés
            </Text>
            <FlatList data={filterCafes(data)} renderItem={({ item }) =>
              <CafeCard
                name={item.name}
                image={item.banner_url}
                location={item.location.pavillon}
                priceRange="$$"
                rating={4.8}
                status={item.is_open}
                id={item.id}
              />}
              keyExtractor={item => item.id}
              horizontal
              ItemSeparatorComponent={() => <View style={{ width: SPACING["md"] }} />}
              style={{
                paddingHorizontal: SPACING["sm"],
                paddingBottom: SPACING["md"],
              }}
            />
            {/* Tous les cafés classés du plus au moins proche 
            <View>
            {closest && (
              <View>
                <Text 
                  style={{
                    marginVertical: SPACING["xl"], 
                    marginHorizontal: SPACING["md"], 
                    ...TYPOGRAPHY.heading.small.bold
                  }}> Tous les cafés
                  </Text>
                  <FlatList data={closest} renderItem={({item}) =>
                      <CafeCard
                        name={item.name}
                        image={item.banner_url}
                        location={item.location.pavillon}
                        priceRange="$$"
                        rating={4.8}
                        status={item.is_open}
                        id={item.id}
                      /> }
                      keyExtractor={item => item.id}
                      horizontal
                      ItemSeparatorComponent={() => <View style={{ width: SPACING["md"] }} />}
                      style={{paddingHorizontal: SPACING["sm"], paddingBottom: SPACING["md"]}}
                  />
            </View>
            )}
            </View> */}

            {/* All Cafes Cards */}
            {/* Cafés groupés par pavillon */}
            {data && closest && (
              <View style={{ marginTop: SPACING["xl"] }}>

                {sortByPavillon(filterCafes(closest)).map((pavillonGroup, index) => {
                  if (pavillonGroup.length === 0) return null;

                  const pavillonName = pavillonGroup[0].location.pavillon;

                  return (
                    <View key={`pavillon-${index}`} style={{ marginBottom: SPACING["lg"] }}>
                      <Text
                        style={{
                          marginVertical: SPACING["sm"],
                          marginHorizontal: SPACING["md"],
                          marginTop: -SPACING["sm"],
                          ...TYPOGRAPHY.heading.small.bold
                        }}>
                        {pavillonName}
                      </Text>
                      <FlatList
                        data={pavillonGroup}
                        renderItem={({ item }) => (
                          <CafeCard
                            name={item.name}
                            image={item.banner_url}
                            location={'L' + item.location.local.substring(1) || ""}
                            priceRange="$$"
                            rating={4.8}
                            status={item.is_open}
                            id={item.id}
                          />
                        )}
                        keyExtractor={item => item.id}
                        horizontal
                        ItemSeparatorComponent={() => <View style={{ width: SPACING["md"] }} />}
                        style={{
                          paddingHorizontal: SPACING["sm"],
                          paddingBottom: SPACING["md"],
                        }}
                      />
                    </View>
                  );
                })}
              </View>
            )}

          </>
        </ScrollableLayout>
      </SafeAreaView>
    );}
  }
}

const styles = StyleSheet.create({
  locationAndSearchContainer: {
    gap: SPACING["xs"],
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING["md"],
    paddingHorizontal: SPACING["md"],
  },
  announcementImage: {
    marginTop: SPACING["xl"],
    borderRadius: 12,
    marginHorizontal: SPACING["md"],
  },
  tooltipSearch: {
    marginTop: SPACING["md"],
    paddingVertical: SPACING["sm"],
    paddingHorizontal: SPACING["md"],
  },
  tooltipSearchContainer: {
    gap: SPACING["sm"],
    flexDirection: "row",
    paddingRight: SPACING["md"],
  },
  resetLocationButton: {
    alignSelf: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    marginTop: 4,
  },
  resetLocationText: {
    ...TYPOGRAPHY.body.small.base,
    color: COLORS.black,
  },
});
