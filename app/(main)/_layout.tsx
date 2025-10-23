import { Redirect, router, Tabs } from "expo-router";
import TYPOGRAPHY from "@/constants/Typography";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import HeaderLayout from "@/components/layouts/HeaderLayout";
import {
  Home,
  Settings,
  ShoppingBasket,
  UserRound,
  Newspaper,
  UserRoundPen,
} from "lucide-react-native";
import { Platform, View, ActivityIndicator, Dimensions } from "react-native";
import {
  getInfoFromToken,
  getToken,
  getRefreshToken,
  clearTokens,
  updateToken,
} from "@/utils/tokenStorage";
import { useEffect, useState } from "react";
import COLORS from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TabLayout() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const insets = useSafeAreaInsets();

  const getTabBarHeight = () => {
    if (Platform.OS === "android") {
      // If bottom inset is 0, device uses button navigation
      // If bottom inset > 0, device uses gesture navigation
      const hasButtonNavigation = insets.bottom === 0;
      return hasButtonNavigation ? 60 : 55 + insets.bottom;
    }
    return undefined; // Let iOS handle it automatically
  };
  useEffect(() => {
    const checkTokens = async () => {
      try {
        // await clearTokens();
        const accessToken = await getToken();
        const refreshToken = await getRefreshToken();

        console.log("Access Token: loli ", accessToken);
        console.log("Refresh Token: popi ", refreshToken);

        if (accessToken && refreshToken) {
          console.log("Tokens found, user is signed in");
          setIsSignedIn(true);
          const userInfo = await getInfoFromToken(accessToken);
          console.log("User Info: ", userInfo);
          if (userInfo == false) {
            // Token is invalid, try to refresh
            try {
              await updateToken(refreshToken);
              setIsSignedIn(true);
            } catch (refreshError) {
              // Refresh failed, updateToken already cleared all data
              console.log("Token refresh failed, redirecting to onboarding");
              setIsSignedIn(false);
              const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");
              console.log("Has onboarded: de layout", hasOnboarded);
              if (hasOnboarded !== null) {
                router.replace("/"); // Redirect to home if already onboarded
              } else {
                router.replace("/first-onboarding"); // Redirect to onboarding if not onboarded
              }
            }
          }
        } else {
          console.log("Tokens are missing, user not signed in");
          setIsSignedIn(false);
        }
      } catch (error) {
        console.error("Error checking tokens:", error);
        console.log(error);
        setIsSignedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkTokens();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      console.log("isSignedIn: ", isSignedIn);
    }
  }, [isSignedIn, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.black} />
      </View>
    );
  }

  return (
    <Tabs
      detachInactiveScreens={false}
      backBehavior="history"
      screenOptions={{
        tabBarActiveTintColor: COLORS.black,
        tabBarInactiveTintColor: "#89898D",
        tabBarStyle: {
          ...Platform.select({
            ios: { padding: 6, height: "10%" },
            android: {
              padding: 8,
              height: getTabBarHeight(),
              paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
            },
          }),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          header: () => <HeaderLayout />,
          tabBarIcon: ({ color }) => <Home size={28} color={color} />,
          tabBarLabelStyle: TYPOGRAPHY.body.small.bold,
          animation: "shift",
          sceneStyle: { backgroundColor: COLORS.white },
        }}
      />
      <Tabs.Screen
        name="favoris"
        options={{
          title: "Favoris",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="heart" color={color} />
          ),
          tabBarLabelStyle: TYPOGRAPHY.body.small.bold,
          animation: "shift",
        }}
      />

      <Tabs.Screen
        name="pannier"
        options={{
          href: null,
          title: "Pannier",
          headerShown: false,
          tabBarIcon: ({ color }) => <ShoppingBasket size={28} color={color} />,
          tabBarLabelStyle: TYPOGRAPHY.body.small.bold,
          animation: "shift",
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: "Communauté",
          headerShown: false,
          tabBarIcon: ({ color }) => <Newspaper size={28} color={color} />,
          tabBarLabelStyle: TYPOGRAPHY.body.small.bold,
          animation: "shift",
        }}
      />

      <Tabs.Screen
        name="parametre"
        options={{
          title: "Compte",
          headerShown: false,
          tabBarIcon: ({ color }) => <UserRoundPen size={28} color={color} />,
          tabBarLabelStyle: TYPOGRAPHY.body.small.bold,
          animation: "shift",
        }}
      />
      <Tabs.Screen
        name="cafe/[id]"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="cafe/[id]/index"
        options={{
          href: null,
          headerShown: false,
          animation: "shift",
        }}
      />
      <Tabs.Screen
        name="cafe/article/[articleId]"
        options={{
          href: null,
          headerShown: false,
          animation: "shift",
        }}
      />
      <Tabs.Screen
        name="cafe/[id]/[articleId]"
        options={{
          href: null,
          headerShown: false,
          animation: "shift",
        }}
      />
    </Tabs>
  );
}
