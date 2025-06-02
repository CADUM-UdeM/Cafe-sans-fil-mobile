import { Redirect, Tabs } from "expo-router";
import { SignedIn, useAuth, useOAuth } from "@clerk/clerk-expo";
import TYPOGRAPHY from "@/constants/Typography";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import HeaderLayout from "@/components/layouts/HeaderLayout";
import { Home, Settings, ShoppingBasket, UserRound} from "lucide-react-native";
import { SafeAreaView } from "react-native";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "#89898D",
          tabBarStyle: {
            ...Platform.select({
              ios:{padding: 6, height:"9%"},
              android:{padding: 8, height:"13%"}
            })},
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            header: () => <HeaderLayout />,
            tabBarIcon: ({ color }) => <Home size={28} color={color} />,
            tabBarLabelStyle: TYPOGRAPHY.body.small.bold,
            animation: 'shift'
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
            animation: 'shift'
          }}
        />
        <Tabs.Screen
          name="pannier"
          options={{
            title: "Panier",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <ShoppingBasket size={28} color={color} />
            ),
            tabBarLabelStyle: TYPOGRAPHY.body.small.bold,
            animation: 'shift'
          }}
        />
        <Tabs.Screen
          name="parametre"
          options={{
            title: "Compte",
            headerShown: false,
            tabBarIcon: ({ color }) => <UserRound size={28} color={color} />,
            tabBarLabelStyle: TYPOGRAPHY.body.small.bold,
            animation: 'shift'
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
            animation: 'shift'
          }}
        />
        <Tabs.Screen
          name="cafe/article/[articleId]"
          options={{
            href: null,
            headerShown: false,
            animation: 'shift'
          }}
        />
        <Tabs.Screen
          name="cafe/[id]/[articleId]"
          options={{
            href: null,
            headerShown: false,
            animation: 'shift'
          }}
        />
      </Tabs>
  );
}
