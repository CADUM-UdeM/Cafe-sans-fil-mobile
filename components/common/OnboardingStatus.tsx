import React from 'react';
import { View, Text } from 'react-native';

// Constants
import TYPOGRAPHY from '@/constants/Typography';
import COLORS from '@/constants/Colors';
import SPACING from '@/constants/Spacing';  

/*
    Here we have a OnboardingStatusBar component that renders a OnboardingStatusBar with text.
    The OnboardingStatusBar properties are defined in the OnboardingStatusBarProps Type.
    The OnboardingStatusBar component takes a children property which is a ReactNode.

    The only thing needed to be done here is to design the OnboardingStatusBar component
    according to the design app design. Use the constants provided in the
    constants folder to style the OnboardingStatusBar.

    Make sure you add a property for the onPress event, so that the OnboardingStatusBar
    can be clickable. Also, add a property for the OnboardingStatusBar type. We have 
    two types of OnboardingStatusBars in the app: primary, secondary.
*/

type OnboardingStatusBarProps = {
    id: 1 | 2 | 3,
}

/**
 * OnboardingStatusBar component that renders a OnboardingStatusBar with text.
 *
 * @author Team 1
 * @param {OnboardingStatusBarProps} props - The props for the OnboardingStatusBar component.
 */
export default function OnboardingStatusBar({ id }: OnboardingStatusBarProps) {
  return (
    <View>
      <Text>OnboardingStatusBar</Text>
    </View>
  )
}