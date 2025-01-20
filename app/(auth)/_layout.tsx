import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '@clerk/clerk-expo'

import { Redirect, Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingLayout() {

  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return Redirect({ href: "/"});
  }

  return ( 
    <SafeAreaView>
        <Slot  />
    </SafeAreaView>
  )
}