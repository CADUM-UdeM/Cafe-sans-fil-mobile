import { Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";

import COLORS from "@/constants/Colors";
import SPACING from "@/constants/Spacing";
import TYPOGRAPHY from "@/constants/Typography";
import React from "react";
import { useRouter } from "expo-router";
import { getInfoFromToken, getToken } from "@/utils/tokenStorage";
import { user } from "@/components/layouts/HeaderLayout";


type AccountInfoProps = {
  title?: string;
  profileName?: string;
  profilePicture?: any;
};

export default function AccountInfo({
  title = "Bonjour et bienvenue",
  profileName,
  profilePicture,
}: AccountInfoProps) {
  const [userImage, setUserImage] = React.useState<string | null>(null);
  const [userFullName, setUserFullName] = React.useState<string>("");
  const [userProfilePicture, setUserProfilePicture] = React.useState<string | null>(profilePicture || null);
  const [isLoading, setIsLoading] = React.useState(true);
  const navigation = useRouter();

  React.useEffect(() => {
    const getUserInfo = async () => {
      try {
        // Get the access token
        const accessToken = await getToken();
        
        if (accessToken) {
          // Get user info from token
          const userInfo = await getInfoFromToken(accessToken);
          console.log("User Info from token:", userInfo);
          
          // Set the full name (first name + last name)
          if (userInfo && userInfo.first_name && userInfo.last_name) {
            setUserFullName(`${userInfo.first_name} ${userInfo.last_name}`);
            setUserImage(userInfo.photo_url);
          } else if (userInfo && userInfo.name) {
            // Fallback to name field if first_name/last_name aren't available
            setUserFullName(userInfo.name);
          } else if (userInfo && userInfo.username) {
            // Fallback to username if no name fields are available
            setUserFullName(userInfo.username);
          } else {
            setUserFullName("Utilisateur");
          }



        } else {
          console.log("No access token found");
          setUserFullName("Utilisateur");
        }
      
      } catch (error) {
        console.error("Error getting user info from token:", error);
        setUserFullName("Utilisateur");
      } finally {
        setIsLoading(false);
      }
    };

    getUserInfo();
  }, []);

  

  return (
    <View style={styles.accountContainer}>
      <TouchableOpacity onPress={() => {navigation.push("/(main)/parametre")}}>
        <Image 
          source={{ uri: userImage } as any} 
          style={styles.profilePicture} 
          testID="header-account-image"
        />
      </TouchableOpacity>
      <View>
        <Text style={[styles.welcomeText, TYPOGRAPHY.body.normal.base]}>
          {title}
        </Text>
        <Text style={[styles.userFullName, TYPOGRAPHY.heading.small.bold]}>
          {isLoading ? "Chargement..." : userFullName}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  accountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  profilePicture: {
    width: SPACING["8xl"],
    height: SPACING["8xl"],
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "rgba(0, 87, 172, .4)", // From University of Montreal
  },
  welcomeText: {},
  userFullName: {
    color: COLORS.black,
  },
});
