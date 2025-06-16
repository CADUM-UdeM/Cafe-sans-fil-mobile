import { Redirect, router, Tabs } from "expo-router";
import TYPOGRAPHY from "@/constants/Typography";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import HeaderLayout from "@/components/layouts/HeaderLayout";
import { Home, Settings, ShoppingBasket, UserRound} from "lucide-react-native";
import { Platform, View, ActivityIndicator } from "react-native";
import { getInfoFromToken, getToken, getRefreshToken, clearTokens, updateToken } from "@/utils/tokenStorage";
import { useEffect, useState } from "react";

export default function TabLayout() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
          if (userInfo ==  false) {
            await updateToken(refreshToken);
            <Redirect href="/first-onboarding" />
          }
        } else {
          console.log("Tokens are missing, user not signed in");
          setIsSignedIn(false);
        }
      } catch (error) {
        console.error("Error checking tokens:", error);
        console.log(error)
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }


  if (!isSignedIn) {
    return <Redirect href="/first-onboarding" />;
  }


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "#89898D",
        tabBarStyle: {
          ...Platform.select({
            ios: { padding: 6 },
            android: { padding: 8, height: "7%" }
          })
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
          title: "Pannier",
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
