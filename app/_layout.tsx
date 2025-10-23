import React from "react";
import { useEffect, useRef } from "react";

import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { Stack } from "expo-router/stack";

import * as SplashScreen from "expo-splash-screen";
import COLORS from "@/constants/Colors";
import { GlobalModalProvider } from "@/components/layouts/GlobalModal";

import { type TokenCache } from "@/lib/token-cache";
import * as SecureStore from "expo-secure-store";

import { StatusBar } from "react-native";
import * as Notifications from "expo-notifications";
import { initializePushNotifications } from "@/utils/notifications";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const notificationListener = useRef<Notifications.Subscription | undefined>(
    undefined
  );
  const responseListener = useRef<Notifications.Subscription | undefined>(
    undefined
  );

  const [loaded, error] = useFonts({
    "Inter-Black": require("../assets/fonts/Inter/Inter-Black.ttf"),
    "Inter-BlackItalic": require("../assets/fonts/Inter/Inter-BlackItalic.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter/Inter-Bold.ttf"),
    "Inter-BoldItalic": require("../assets/fonts/Inter/Inter-BoldItalic.ttf"),
    "Inter-ExtraBold": require("../assets/fonts/Inter/Inter-ExtraBold.ttf"),
    "Inter-ExtraBoldItalic": require("../assets/fonts/Inter/Inter-ExtraBoldItalic.ttf"),
    "Inter-ExtraLight": require("../assets/fonts/Inter/Inter-ExtraLight.ttf"),
    "Inter-ExtraLightItalic": require("../assets/fonts/Inter/Inter-ExtraLightItalic.ttf"),
    "Inter-Italic": require("../assets/fonts/Inter/Inter-Italic.ttf"),
    "Inter-Light": require("../assets/fonts/Inter/Inter-Light.ttf"),
    "Inter-LightItalic": require("../assets/fonts/Inter/Inter-LightItalic.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter/Inter-Medium.ttf"),
    "Inter-MediumItalic": require("../assets/fonts/Inter/Inter-MediumItalic.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter/Inter-Regular.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter/Inter-SemiBold.ttf"),
    "Inter-SemiBoldItalic": require("../assets/fonts/Inter/Inter-SemiBoldItalic.ttf"),
    "Inter-Thin": require("../assets/fonts/Inter/Inter-Thin.ttf"),
    "Inter-ThinItalic": require("../assets/fonts/Inter/Inter-ThinItalic.ttf"),
    "Poppins-Black": require("../assets/fonts/Poppins/Poppins-Black.ttf"),
    "Poppins-BlackItalic": require("../assets/fonts/Poppins/Poppins-BlackItalic.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
    "Poppins-BoldItalic": require("../assets/fonts/Poppins/Poppins-BoldItalic.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraBoldItalic": require("../assets/fonts/Poppins/Poppins-ExtraBoldItalic.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins/Poppins-ExtraLight.ttf"),
    "Poppins-ExtraLightItalic": require("../assets/fonts/Poppins/Poppins-ExtraLightItalic.ttf"),
    "Poppins-Italic": require("../assets/fonts/Poppins/Poppins-Italic.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins/Poppins-Light.ttf"),
    "Poppins-LightItalic": require("../assets/fonts/Poppins/Poppins-LightItalic.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins/Poppins-Medium.ttf"),
    "Poppins-MediumItalic": require("../assets/fonts/Poppins/Poppins-MediumItalic.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    "Poppins-SemiBoldItalic": require("../assets/fonts/Poppins/Poppins-SemiBoldItalic.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins/Poppins-Thin.ttf"),
    "Poppins-ThinItalic": require("../assets/fonts/Poppins/Poppins-ThinItalic.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, loaded]);

  /*
    useEffect(() => {
    async function registerForPushNotificationsAsync() {
      // Request permissions for notifications
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }

      // Get the native device push token (APNs token for iOS)
      const tokenData = await Notifications.getDevicePushTokenAsync();
      try {
        if (tokenData.data) {
            alert('APNs Device Token:' + tokenData.data);
        }
      } catch (error) {
        alert('Error retrieving APNs token: ' + error);
      }
    }

    registerForPushNotificationsAsync();
  }, []);
  */

  // Initialize push notifications when app loads
  useEffect(() => {
    // Initialize push notifications with error handling
    const setupNotifications = async () => {
      try {
        const token = await initializePushNotifications();
        if (token) {
          console.log("✅ Push notifications initialized successfully");
        } else {
          console.warn("⚠️ Push token not obtained");
        }
      } catch (error) {
        console.error("❌ Error during notification setup:", error);
        alert(
          `Notification Setup Error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    };

    setupNotifications();

    // Listener for notifications received while app is in foreground
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("📬 Notification received:", notification);
        // You can add custom logic here when a notification is received
      });

    // Listener for when user taps on a notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("👆 Notification tapped:", response);
        // You can add navigation logic here based on notification data
        // For example: router.push('/some-screen')
      });

    // Cleanup listeners on unmount
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  if (!loaded || error) {
    return null;
  }

  return (
    <GlobalModalProvider>
      <StatusBar />
      <Stack
        screenOptions={{
          gestureEnabled: false,
          contentStyle: { backgroundColor: COLORS.white },
        }}
      >
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </GlobalModalProvider>
  );
}
