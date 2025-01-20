import React from 'react';
import { View, Text } from 'react-native';

import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingLayout() {
  return (
    <SafeAreaView>
        <Slot  />
    </SafeAreaView>
  )
}