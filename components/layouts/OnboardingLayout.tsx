import React from 'react';
import { View, Text } from 'react-native';

// Constants
import TYPOGRAPHY from '@/constants/Typography';
import COLORS from '@/constants/Colors';
import SPACING from '@/constants/Spacing';  

// Components
import Button from '@/components/common/Buttons/Button';
import OnboardingStatusBar from '../common/OnboardingStatus';

type OnboardingLayoutProps = {
    id: 1 | 2 | 3,
    title: string,
    description: string,
    // ...
    // Add more props here, like image, etc.
}

/**
 * OnboardingLayout component that renders a OnboardingLayout with text.
 *
 * @author Team 1
 * @param {OnboardingLayoutProps} props - The props for the OnboardingLayout component.
 */
export default function OnboardingLayout({
    id,
    title,
    description
  }: OnboardingLayoutProps) {
  return (
    <View>
      <OnboardingStatusBar id={id} />
      <Text>OnboardingLayout</Text>
      <Button onPress={function (): void {
        throw new Error('Function not implemented.');
      } }>Suivant</Button>
      <Button onPress={function (): void {
        throw new Error('Function not implemented.');
      } }>Sauter</Button>
    </View>
  )
}