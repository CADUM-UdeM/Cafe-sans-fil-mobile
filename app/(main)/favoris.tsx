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
  // fetch favorites cafe
  useEffect(() => {
    //console.log('Favorites reloaded!')
    let fetchData = fetchSync('favorites');
    setData(JSON.parse(fetchData));
    //console.log(fetchData, 'Favorites found')
  }, [])

  return (
    <ScrollableLayout>
      <SafeAreaView>
        <View>
        <TouchableOpacity
        onPress={() => deleteSecurely('favorites')}>
              <Text>Wipe</Text>
        </TouchableOpacity>
          <CardScrollableLayout
            title="Vos cafes favoris"
            titleMarginTop={SPACING["xl"]}
            scrollMarginTop={SPACING["xs"]}
            scrollMarginBottom={SPACING["md"]}
            scrollGap={SPACING["md"]}
            dividerBottom
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
              ItemSeparatorComponent={() => <View style={{ width: SPACING["md"] }} />}
              scrollEnabled={false}
            />
          </CardScrollableLayout>
        </View>
      </SafeAreaView>
    </ScrollableLayout>
  );
}
