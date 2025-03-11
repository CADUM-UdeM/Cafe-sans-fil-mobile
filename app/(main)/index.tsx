import React, { useEffect, useState } from "react";
import { Redirect, router } from "expo-router";
import * as Location from "expo-location";
import { Star, Vegan } from "lucide-react-native";
import { View, StyleSheet, Image, Text, FlatList, SafeAreaView} from "react-native";


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

import { useModal } from "@/components/layouts/GlobalModal";
import ScrollableLayout from "@/components/layouts/ScrollableLayout";
import FilterModalLayout from "@/components/layouts/FilterModalLayout";
import { useUser } from "@clerk/clerk-expo";
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
  const [data, setData] = useState<allCafe | any>([]);
  const [isLoading, setIsLoading] = useState(true);

  // fetch cafe list
  useEffect(() => {
    fetch("https://cafesansfil-api-r0kj.onrender.com/api/cafes")
      .then((response) => response.json())
      .then((json) => {
        setData(json.items);
        // console.log(json)
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));;
  }, []);

  // Get the user's current location
  const [location, getCurrentLocation] = useLocation();

  // Execute a callback when the app comes to the foreground
  useOnForegroundBack(getCurrentLocation);

  // Sort pavillons by distance from the user's location
  const sortedPavillons = useSortedItemsByDistance<
    PavillonCoordinate,
    "lat",
    "lng",
    "pavillon"
  >(location, pavillonCoordinates, "lat", "lng", "pavillon");

  // Get the modal context for opening and closing modals.
  const modalContext = useModal();

  // Get the open and close modal functions from the modal context.
  const openModal = modalContext ? modalContext.openModal : () => {};
  const closeModal = modalContext ? modalContext.closeModal : () => {};

  // Mock implementation of search and filter functions.
  // FIXME: Implement actual search and filter functions.
  function handleSearch(text: string): void {
    console.warn("Search `Search` function not implemented.");
  }

  // Mock implementation of search and filter functions.
  // FIXME: Implement actual search and filter functions.
  function handleFilter(): void {
    console.warn("Search `Filter` function not implemented.");
    openModal(
      <FilterModalLayout
        title="Filtrer par"
        handleApplyFilter={() => closeModal()}
        handleResetFilter={() => closeModal()}
      ></FilterModalLayout>
    );
  }

  return (
  <SafeAreaView>
    
    <ScrollableLayout>
      <>
        {/* User Location and Search */}
        <View style={styles.locationAndSearchContainer}>
          <SelectLocalisation
            currentLocalisation={sortedPavillons[0]}
            location={location as Location.LocationObject}
          />
          <Search onSearch={handleSearch} onFilter={handleFilter} />
        </View>

        {/* Announcement Image */}
        {/* <Image
          width={361}
          height={210}
          style={styles.announcementImage}
          source={require("@/assets/images/placeholder/imagexl.png")}
        /> */}

        {/* Quick Search Section with Tooltips */}
        {/* TODO: IMPLEMENT FILTERS USING TOOLTIPS */}
        
        {/* Horizontal Cafe Cards By Categories */}
        <View>
        {/* Tendences du momemt */}
        <Text 
            style={{
              marginVertical: SPACING["xl"], 
              marginHorizontal: SPACING["md"], 
              ...TYPOGRAPHY.heading.small.bold
            }}>Tendances du moment
        </Text>
        <FlatList data={data} renderItem={({item}) =>
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
          horizontal // render honrizontalement
          ItemSeparatorComponent={() => <View style={{ width: SPACING["md"] }} />} // padding
          style={{paddingHorizontal: SPACING["sm"], paddingBottom: SPACING["md"]}}
        />

        <Text 
          style={{
            marginVertical: SPACING["xl"], 
            marginHorizontal: SPACING["md"], 
            ...TYPOGRAPHY.heading.small.bold
          }}>Proches de vous
        </Text>
        <FlatList data={data} renderItem={({item}) =>
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

        <Text 
        style={{
          marginVertical: SPACING["xl"], 
          marginHorizontal: SPACING["md"], 
          ...TYPOGRAPHY.heading.small.bold
        }}>{`${sortedPavillons[0]}`}
        </Text>
        <FlatList data={data} renderItem={({item}) =>
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

        <Text 
        style={{
          marginVertical: SPACING["xl"], 
          marginHorizontal: SPACING["md"], 
          ...TYPOGRAPHY.heading.small.bold
        }}>Promotions en cours
        </Text>
        <FlatList data={data} renderItem={({item}) =>
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

        {/* All Cafes Cards */}
        <Text 
        style={{
          marginVertical: SPACING["xl"], 
          marginHorizontal: SPACING["md"], 
          ...TYPOGRAPHY.heading.small.bold
        }}>Tous les cafés
        </Text>
        <FlatList data={data} renderItem={({item}) =>
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
