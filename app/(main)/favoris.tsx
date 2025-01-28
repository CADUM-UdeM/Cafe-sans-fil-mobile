import { View, Text, SafeAreaView } from 'react-native';
import React from 'react';
import { useState, useEffect } from 'react';
import ScrollableLayout from '@/components/layouts/ScrollableLayout';
import favorites from "@/static/favorites.json";

export default function FavorisScreen() {
  const [favoritesObj, setFavorites] = useState({});

  useEffect(() => {
    
  }, []);

  return (
    <ScrollableLayout>
      <SafeAreaView>
        <Text>FavorisScreen</Text>
      </SafeAreaView>
    </ScrollableLayout>
  )
}