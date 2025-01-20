import React from 'react';
import {useEffect} from 'react';

import { useFonts } from 'expo-font'; 
import { Slot } from 'expo-router';
import { Stack } from "expo-router/stack";

import * as SplashScreen from 'expo-splash-screen'; 
import COLORS from '@/constants/Colors';
import { GlobalModalProvider } from '@/components/layouts/GlobalModal';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';

import { type TokenCache } from '@/lib/token-cache';
import * as SecureStore from 'expo-secure-store'

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

    // IMPORTANT: Data stored with expo-secure-store may not persist between new builds of your app unless you clear the app data of the previously installed build.
    const tokenCache: TokenCache = {
        async getToken(key: string) {
          try {
            const item = await SecureStore.getItemAsync(key)
            if (item) {
              console.log(`${key} was used 🔐 \n`)
            } else {
              console.log('No values stored under key: ' + key)
            }
            return item
          } catch (error) {
            console.error('SecureStore get item error: ', error)
            await SecureStore.deleteItemAsync(key)
            return null
          }
        },
        async saveToken(key: string, value: string) {
          try {
            return SecureStore.setItemAsync(key, value)
          } catch (err) {
            return
          }
        },
      }

    const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

    const [loaded, error] = useFonts({
        'Inter-Black': require("../assets/fonts/Inter/Inter-Black.ttf"),
        'Inter-BlackItalic': require("../assets/fonts/Inter/Inter-BlackItalic.ttf"),
        'Inter-Bold': require("../assets/fonts/Inter/Inter-Bold.ttf"),
        'Inter-BoldItalic': require("../assets/fonts/Inter/Inter-BoldItalic.ttf"),
        'Inter-ExtraBold': require("../assets/fonts/Inter/Inter-ExtraBold.ttf"),
        'Inter-ExtraBoldItalic': require("../assets/fonts/Inter/Inter-ExtraBoldItalic.ttf"),
        'Inter-ExtraLight': require("../assets/fonts/Inter/Inter-ExtraLight.ttf"),
        'Inter-ExtraLightItalic': require("../assets/fonts/Inter/Inter-ExtraLightItalic.ttf"),
        'Inter-Italic': require("../assets/fonts/Inter/Inter-Italic.ttf"),
        'Inter-Light': require("../assets/fonts/Inter/Inter-Light.ttf"),
        'Inter-LightItalic': require("../assets/fonts/Inter/Inter-LightItalic.ttf"),
        'Inter-Medium': require("../assets/fonts/Inter/Inter-Medium.ttf"),
        'Inter-MediumItalic': require("../assets/fonts/Inter/Inter-MediumItalic.ttf"),
        'Inter-Regular': require("../assets/fonts/Inter/Inter-Regular.ttf"),
        'Inter-SemiBold': require("../assets/fonts/Inter/Inter-SemiBold.ttf"),
        'Inter-SemiBoldItalic': require("../assets/fonts/Inter/Inter-SemiBoldItalic.ttf"),
        'Inter-Thin': require("../assets/fonts/Inter/Inter-Thin.ttf"),
        'Inter-ThinItalic': require("../assets/fonts/Inter/Inter-ThinItalic.ttf"),
        'Poppins-Black': require("../assets/fonts/Poppins/Poppins-Black.ttf"),
        'Poppins-BlackItalic': require("../assets/fonts/Poppins/Poppins-BlackItalic.ttf"),
        'Poppins-Bold': require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
        'Poppins-BoldItalic': require("../assets/fonts/Poppins/Poppins-BoldItalic.ttf"),
        'Poppins-ExtraBold': require("../assets/fonts/Poppins/Poppins-ExtraBold.ttf"),
        'Poppins-ExtraBoldItalic': require("../assets/fonts/Poppins/Poppins-ExtraBoldItalic.ttf"),
        'Poppins-ExtraLight': require("../assets/fonts/Poppins/Poppins-ExtraLight.ttf"),
        'Poppins-ExtraLightItalic': require("../assets/fonts/Poppins/Poppins-ExtraLightItalic.ttf"),
        'Poppins-Italic': require("../assets/fonts/Poppins/Poppins-Italic.ttf"),
        'Poppins-Light': require("../assets/fonts/Poppins/Poppins-Light.ttf"),
        'Poppins-LightItalic': require("../assets/fonts/Poppins/Poppins-LightItalic.ttf"),
        'Poppins-Medium': require("../assets/fonts/Poppins/Poppins-Medium.ttf"),
        'Poppins-MediumItalic': require("../assets/fonts/Poppins/Poppins-MediumItalic.ttf"),
        'Poppins-Regular': require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
        'Poppins-SemiBold': require("../assets/fonts/Poppins/Poppins-SemiBold.ttf"),
        'Poppins-SemiBoldItalic': require("../assets/fonts/Poppins/Poppins-SemiBoldItalic.ttf"),
        'Poppins-Thin': require("../assets/fonts/Poppins/Poppins-Thin.ttf"),
        'Poppins-ThinItalic': require("../assets/fonts/Poppins/Poppins-ThinItalic.ttf"),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, loaded]);

    if (!loaded || error) {
        return null;
    }

    if (!publishableKey) {
        throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file')
    }

    return (
        <ClerkProvider publishableKey={publishableKey}>
            <ClerkLoaded>
                <GlobalModalProvider>
                    <Stack screenOptions={{ 
                        gestureEnabled: false,
                        animation: "none",
                        contentStyle: { backgroundColor: COLORS.white },
                    }}>
                        <Stack.Screen name='(main)' options={{ headerShown: false }} />
                        <Stack.Screen name='(onboarding)' options={{ headerShown: false}} />
                        <Stack.Screen name='(auth)' options={{ headerShown: false}} />
                    </Stack>
                </GlobalModalProvider>
            </ClerkLoaded>
        </ClerkProvider>
    )
}
