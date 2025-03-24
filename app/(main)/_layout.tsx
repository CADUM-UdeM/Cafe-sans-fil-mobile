import { Redirect, Tabs } from "expo-router";
import { SignedIn, useAuth, useOAuth } from "@clerk/clerk-expo";
import TYPOGRAPHY from "@/constants/Typography";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import HeaderLayout from "@/components/layouts/HeaderLayout";
import { Home, Settings, ShoppingBasket } from "lucide-react-native";

export default function TabLayout() {
    const { isSignedIn } = useAuth();
    if (!isSignedIn) return Redirect({ href: "/first-onboarding" });
  return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "#89898D",
          tabBarStyle: { paddingTop: 6 },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            header: () => <HeaderLayout />,
            tabBarIcon: ({ color }) => <Home size={28} color={color} />,
            tabBarLabelStyle: TYPOGRAPHY.body.small.bold,
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
          }}
        />
        <Tabs.Screen
          name="pannier"
          options={{
            title: "Pannier",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <ShoppingBasket size={28} color={color} />
            ),
            tabBarLabelStyle: TYPOGRAPHY.body.small.bold,
          }}
        />
        <Tabs.Screen
          name="parametre"
          options={{
            title: "Settings",
            headerShown: false,
            tabBarIcon: ({ color }) => <Settings size={28} color={color} />,
            tabBarLabelStyle: TYPOGRAPHY.body.small.bold,
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
          }}
        />
        <Tabs.Screen
          name="cafe/article/[articleId]"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="cafe/[id]/[articleId]"
          options={{
            href: null,
            headerShown: false,
          }}
        />
      </Tabs>
  );
}
