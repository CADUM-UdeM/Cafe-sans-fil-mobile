import { View, SafeAreaView, FlatList, AppState, TouchableOpacity, Text } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import ScrollableLayout from '@/components/layouts/ScrollableLayout';
import CardScrollableLayout from '@/components/layouts/CardScrollableLayout';
import SPACING from '@/constants/Spacing';
import CafeCard from '@/components/common/Cards/CafeCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { fetchSync, deleteSecurely } from "@/scripts/storage";
import { sampleFavoris } from '@/constants/type_samples';

export default function FavorisScreen() {
  const [data, setData] = useState<Favoris[]>([]);

  const loadFavorites = () => {
    let fetchData = fetchSync('favorites');
    if (fetchData) {
      setData(JSON.parse(fetchData));
    }
  };

  // fetch favorites cafe
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  return (
    <ScrollableLayout>
      <SafeAreaView>
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
                  name={item.name}
                  image={item.image_url}
                  location={item.location.pavillon}
                  priceRange="$$"
                  rating={4.8}
                  status={item.is_open}
                  slug={item.slug}
                />
              )}
              keyExtractor={(item) => item.cafe_id}
              horizontal
              ItemSeparatorComponent={() => <View style={{ width: SPACING["md"] }} />}
              scrollEnabled={true}
            />
          </CardScrollableLayout>
        </View>
      </SafeAreaView>
    </ScrollableLayout>
  );
}
