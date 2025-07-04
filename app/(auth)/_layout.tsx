import React from 'react';
import { View, Text } from 'react-native';
import { getToken } from '@/utils/tokenStorage';
import { Redirect, Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingLayout() {

  

  return ( 
    <SafeAreaView>
        <Slot  />
    </SafeAreaView>
  )
}