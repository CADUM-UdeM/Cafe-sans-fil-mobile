import { View,  Text } from 'react-native';
import React from 'react';
import ScrollableLayout from '@/components/layouts/ScrollableLayout';
import SPACING from '@/constants/Spacing';
import TYPOGRAPHY from "@/constants/Typography";
import HeaderLayout from '@/components/layouts/HeaderLayout';

export default function FavorisScreen() {


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
            }}
            >Vos items favoris</Text>
            
        </View>
      </ScrollableLayout>
    </>
  );
}