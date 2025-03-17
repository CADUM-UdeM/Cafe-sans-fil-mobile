import { View, SafeAreaView, FlatList, AppState } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import ScrollableLayout from '@/components/layouts/ScrollableLayout';
import CardScrollableLayout from '@/components/layouts/CardScrollableLayout';
import SPACING from '@/constants/Spacing';
import CafeCard from '@/components/common/Cards/CafeCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

let favoritesTest = {};

export function addFavorites(item) {
  if (favoritesTest[item.cafe_id]) {
    console.log("Item already in favorites");
    return;
  }

  favoritesTest[item.cafe_id] = item;
  console.log(`Added to favorites: ${item.name}`);

  AsyncStorage.setItem('favorites', JSON.stringify(favoritesTest))
    .then(() => {
      console.log("Favorites saved");
    })
    .catch((err) => console.error("Error saving favorites", err));
}

export function clearFavorites() {
  favoritesTest = {};
  AsyncStorage.removeItem('favorites')
    .then(() => {
      console.log("Favorites reset");
    })
    .catch((err) => console.error("Error clearing favorites", err));
}

export default function FavorisScreen() {
  const [favoritesObj, setFavorites] = useState([]);

  const loadFavorites = useCallback(() => {
    AsyncStorage.getItem('favorites')
      .then((storedFavorites) => {
        if (storedFavorites) {
          favoritesTest = JSON.parse(storedFavorites);
          setFavorites(Object.values(favoritesTest));
        } else {
          setFavorites([]);
        }
      })
      .catch((err) => console.error("Error loading favorites", err));
  }, []);

  useEffect(() => {
    clearFavorites();  // Clear favorites on app start
    loadFavorites();  // Load favorites after clearing
  }, [loadFavorites]);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const handleAddFavorite = (item) => {
    addFavorites(item);
    setFavorites(Object.values(favoritesTest));
  };

  return (
    <ScrollableLayout>
      <SafeAreaView>
        <View>
          <CardScrollableLayout
            title="Vos cafes favoris"
            titleMarginTop={SPACING["xl"]}
            scrollMarginTop={SPACING["xs"]}
            scrollMarginBottom={SPACING["md"]}
            scrollGap={SPACING["md"]}
            dividerBottom
          >
            <FlatList
              data={favoritesObj}
              renderItem={({ item }) => (
                <CafeCard
                  name={item.name}
                  image={item.image_url}
                  location={item.location.pavillon}
                  priceRange="$$"
                  rating={4.8}
                  status={item.is_open}
                  id={item.cafe_id}
                  addFavorite={handleAddFavorite}
                />
              )}
              keyExtractor={(item) => item.cafe_id}
              horizontal
              ItemSeparatorComponent={() => <View style={{ width: SPACING["md"] }} />}
              scrollEnabled={false}
            />
          </CardScrollableLayout>
        </View>
      </SafeAreaView>
    </ScrollableLayout>
  );
}
