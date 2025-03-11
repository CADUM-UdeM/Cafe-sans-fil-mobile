import { View, SafeAreaView, FlatList, AppState, TouchableOpacity, Text } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import ScrollableLayout from '@/components/layouts/ScrollableLayout';
import SPACING from '@/constants/Spacing';
import CafeCard from '@/components/common/Cards/CafeCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { fetchSync, deleteSecurely } from "@/script/storage";
import { sampleFavoris } from "@/constants/types/type_samples";
import TYPOGRAPHY from "@/constants/Typography";

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
    <SafeAreaView>
      <ScrollableLayout>
        <View>
          <TouchableOpacity onPress={() => { 
            deleteSecurely('favorites');
            setData([]); // Clear the state after deleting
          }}>
            <Text>Wipe</Text>
          </TouchableOpacity>
          <Text 
            style={{
              marginVertical: SPACING["xl"], 
              marginHorizontal: SPACING["md"], 
              ...TYPOGRAPHY.heading.small.bold
            }}
            >Vos cafés favoris</Text>
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
    </SafeAreaView>
  );
}