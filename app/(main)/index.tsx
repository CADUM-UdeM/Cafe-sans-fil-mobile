import React, { useEffect, useState } from "react";
import { Redirect, router } from "expo-router";
import * as Location from "expo-location";
import { Activity, Star, Vegan } from "lucide-react-native";
import { View, StyleSheet, Image, Text, FlatList, SafeAreaView, ActivityIndicator} from "react-native";

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
import { useUser } from "@clerk/clerk-expo";
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
  const [showOpen, setShowOpen] = useState(false)
  const [location, getCurrentLocation] = useLocation();
  // Execute a callback when the app comes to the foreground
  useOnForegroundBack(getCurrentLocation);

  useEffect(() => {
    setIsLoading(true);
    fetch("https://cafesansfil-api-r0kj.onrender.com/api/cafes")
      .then((response) => response.json())
      .then((json) => {
        setData(json.items);
        setClosest(sortByDistance(location as Location.LocationObject, json.items));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setIsLoading(false);
      });
  }, [location]);

/**
 * This function returns the closest cafe based on the user's current location.
 * @param current current location of the user.
 * @param cafe list of all cafes.
 * @returns cafe object
 */
function sortByDistance(current: Location.LocationObject, cafes: Cafe[]): Cafe[] | undefined {
  if (current && cafes){
    let cafeDistances = cafes.map(cafe => {
      if (cafe.location.geometry){
        let cafeCoords = cafe.location.geometry.coordinates;
        let x = current.coords.latitude - cafeCoords[1];
        let y = current.coords.longitude - cafeCoords[0];
        let distance = Math.sqrt(x**2 + y**2);
        return { ...cafe , distance }; // add the calculated distance into cafe object
      }
      return { ...cafe , distance: Infinity }; // for cafes without valid coordinates 
    });
    
    cafeDistances.sort((a, b) => a.distance - b.distance); // sort by ascending distance
    
    return cafeDistances;
  } else {
    console.log('params undefined')
  }
}

  const filterCafes = (cafes : Cafe[]) => {
    let filteredCafesClose = cafes;

    if (showOnlyOrder) {
      filteredCafesClose = filteredCafesClose.filter(cafe => cafe.features.includes("ORDER"));
    }

    if (showOpen) {
      filteredCafesClose = filteredCafesClose.filter(cafe => cafe.is_open == true);
    }
    return filteredCafesClose;
  };
  
  // Mock implementation of search and filter functions.
  function handleSearch(text: string): void {
    // A REFAIRE PAS BIEN PAS BIEN DU TOUT C NUL A CHIER

    // fetch("https://cafesansfil-api-r0kj.onrender.com/api/cafes")
    //   .then((response) => response.json())
    //   .then((json) => {
    //     const allCafes = json.items;

    //     if (text.trim() === "") {
    //       setData(allCafes);
    //       return;
    //     }

    //     const filteredCafes = allCafes.filter((cafe : Cafe) =>
    //       cafe.name.toLowerCase().includes(text.toLowerCase()) || 
    //       cafe.location.pavillon.toLowerCase().includes(text.toLowerCase()) ||
    //       cafe.location.local.toLowerCase().includes(text.toLowerCase()) ||
    //       cafe.affiliation.faculty.toLowerCase().includes(text.toLowerCase())
    //     );
    //     setData(filteredCafes);
    //   })
    //   .catch((error) => console.error(error));
  }

  if (isLoading || (!data && !closest)) {
    return(
      <View style={{ flex:1, justifyContent: 'center', alignContent: 'center'}}>
        <ActivityIndicator size={'large'} />
      </View>
    )
  }
  else {
    return (
      <SafeAreaView>
        <ScrollableLayout>
          <>
            {/* User Location and Search */}
            <View style={styles.locationAndSearchContainer}>
              <SelectLocalisation
                currentLocalisation={closest? closest[0].name : ""}
                location={location as Location.LocationObject}
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
          
          {/* Cafe le plus proche*/}
          {closest && (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text 
                  style={{
                    marginVertical: SPACING["xl"], 
                    marginTop: SPACING["md"], 
                    ...TYPOGRAPHY.heading.small.bold
                  }}>Le plus proche
              </Text>
              <View >
                  <CafeCard
                  name={closest[0].name}
                  image={closest[0].banner_url}
                  location={closest[0].location.pavillon}
                  priceRange="$$"
                  rating={4.8}
                  status={closest[0].is_open}
                  id={closest[0].id}
                  />
              </View>
          </View>
          )}
            
            {/* Tous les cafés classés du plus au moins proche */}
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
            </View>

            {/* All Cafes Cards */}
            <Text 
            style={{
              marginVertical: SPACING["xl"], 
              marginHorizontal: SPACING["md"], 
              ...TYPOGRAPHY.heading.small.bold
            }}>Tous les cafés
            </Text>
            <FlatList data={filterCafes(data)} renderItem={({item}) =>
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
                style={{
                  paddingHorizontal: SPACING["sm"], 
                  paddingBottom: SPACING["md"],
                }}
            />
          </>
        </ScrollableLayout>
        </SafeAreaView>
    );
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
});
