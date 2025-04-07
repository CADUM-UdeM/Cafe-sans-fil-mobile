import { View, FlatList, Text } from 'react-native';
import React, { useState, useCallback } from 'react';
import TYPOGRAPHY from "@/constants/Typography";
import SPACING from '@/constants/Spacing';
import CafeCard from '@/components/common/Cards/CafeCard';
import { useFocusEffect } from '@react-navigation/native';
import { fetchSecurely } from "@/scripts/storage";
import ScrollableLayout from '@/components/layouts/ScrollableLayout';
import HeaderLayout from '@/components/layouts/HeaderLayout';

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
          <Text
            style={{
              marginVertical: SPACING["xl"],
              marginHorizontal: SPACING["md"],
              ...TYPOGRAPHY.heading.small.bold
            }}> Tous les cafés
          </Text>
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <CafeCard
                id={item.cafe_id}
                name={item.name}
                image={item.image_url}
                location={item.location.pavillon}
                priceRange="$$"
                rating={4.8}
                status={item.is_open}
                slug={item.slug}
              />
            )}
            keyExtractor={item => item.cafe_id}
            horizontal
            ItemSeparatorComponent={() => <View style={{ width: SPACING["md"] }} />}
            style={{paddingHorizontal: SPACING["sm"], paddingBottom: SPACING["md"]}}
            scrollEnabled={true}
          />
        </View>
      </ScrollableLayout>
    </>
  );
}