import { View, SafeAreaView, FlatList, AppState, TouchableOpacity, Text } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import ScrollableLayout from '@/components/layouts/ScrollableLayout';
import SPACING from '@/constants/Spacing';
import CafeCard from '@/components/common/Cards/CafeCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { fetchSecurely, deleteSecurely } from "@/scripts/storage";
import { sampleFavoris } from '@/constants/type_samples';

export default function FavorisScreen() {
  const [data, setData] = useState<Favoris[]>([]);

  const loadFavorites = async () => {
    try {
      const fetchData = await fetchSecurely('favorites'); // Use fetchSecurely
      if (fetchData) {
        setData(fetchData); // No need to JSON.parse, since fetchSecurely already returns JSON
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  // fetch favorites cafe
  useFocusEffect(
    useCallback(() => {
      const reloadFavorites = async () => {
        try {
          console.log("Reloading favorites..."); // Debugging log
          const fetchData = await fetchSecurely("favorites");
          setData(fetchData || []); // Ensure state updates properly
        } catch (error) {
          console.error("Error loading favorites:", error);
        }
      };
  
      reloadFavorites();
    }, []) // No dependencies needed
  );
  

  return (
    <>
    <HeaderLayout />
      <ScrollableLayout>
        <View>
          <TouchableOpacity onPress={() => { 
            deleteSecurely('favorites');
            setData([]); // Clear the state after deleting
          }}>
            <Text>Wipe</Text>
          </TouchableOpacity>
          <CardScrollableLayout
            title="Vos cafés favoris"
            titleMarginTop={SPACING["xl"]}
            scrollMarginTop={SPACING["lg"]}
            scrollMarginBottom={SPACING["md"]}
            scrollGap={SPACING["2xl"]}
            scroll={false}
          >
            <FlatList
              data={data}
              renderItem={({ item }) => (
                <CafeCard
                  id={item.id}
                  name={item.name}
                  image={item.image_url}
                  location={item.location.pavillon}
                  priceRange="$$"
                  rating={4.8}
                  status={item.is_open}
                  slug={item.slug}
                />
              )}
              keyExtractor={item => item.id}
              horizontal
              ItemSeparatorComponent={() => <View style={{ width: SPACING["md"] }} />}
              scrollEnabled={true}
            />
        </View>
      </ScrollableLayout>
    </>
  );
}