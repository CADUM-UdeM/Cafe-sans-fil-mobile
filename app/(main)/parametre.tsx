import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Modal,
  Button,
  TextInput,
  ScrollView,
  StatusBar,
  Switch,
  Alert,
  ActivityIndicator,
  Pressable,
  Dimensions,
  Linking,
  Platform,
} from "react-native";
import Constants from "expo-constants";
import React, { useState } from "react";
import ScrollableLayout from "@/components/layouts/ScrollableLayout";
import {
  ChevronRight,
  Package,
  Bell,
  Settings2,
  HelpCircle,
  Info,
  Eye,
  EyeOff,
  Camera,
  User,
  Mail,
  Lock,
  LogOut,
  Trash2,
  HeartHandshake,
} from "lucide-react-native";
import COLORS from "@/constants/Colors";
import SPACING from "@/constants/Spacing";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import TYPOGRAPHY from "@/constants/Typography";
import Divider from "@/components/common/Divider";
import AntDesign from "@expo/vector-icons/AntDesign"; // icone de Instagram
import FontAwesome from "@expo/vector-icons/FontAwesome"; // icone de user-secret
import { useRouter, useFocusEffect } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {
  clearTokens,
  getInfoFromToken,
  getToken,
  deleteAccount,
  setUserFullname,
  setUserPhotoUrl,
  getUserFullname,
  getUserPhotoUrl,
} from "@/utils/tokenStorage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Menu item interface for type safety
interface MenuItem {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}

export default function ParametreScreen() {
  const navigation = useRouter();
  const [notifModal, setNotifModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [ordersModalVisible, setOrdersModalVisible] = useState(false);
  const [prferencesModalVisible, setPreferencesModalVisible] = useState(false);
  const [userImage, setUserImage] = React.useState<string | null>(null);
  const [userFullName, setUserFullName] = React.useState<string>("");
  const [userProfilePicture, setUserProfilePicture] = React.useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [userEmail, setUserEmail] = React.useState<string>("");

  const [remmerciementsModalVisible, setRemerciementsModalVisible] =
    useState(false);

  // Form state for editing
  const [editFirstName, setEditFirstName] = React.useState<string>("");
  const [editLastName, setEditLastName] = React.useState<string>("");
  const [editEmail, setEditEmail] = React.useState<string>("");
  const [editPassword, setEditPassword] = React.useState<string>("");
  const [counter, setCounter] = React.useState<number>(0);
  const [editPhotoUrl, setEditPhotoUrl] = React.useState<string>("");
  const [editUsername, setEditUsername] = React.useState<string>("");
  //const [editMatricule, setEditMatricule] = React.useState<string>("");
  const [isUploading, setIsUploading] = React.useState<boolean>(false);

  // Original values to track changes
  const [originalFirstName, setOriginalFirstName] = React.useState<string>("");
  const [originalLastName, setOriginalLastName] = React.useState<string>("");
  const [originalEmail, setOriginalEmail] = React.useState<string>("");
  const [originalPhotoUrl, setOriginalPhotoUrl] = React.useState<string>("");
  const [originalUsername, setOriginalUsername] = React.useState<string>("");
  //const [originalMatricule, setOriginalMatricule] = React.useState<string>("");

  // Preference states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [promotionsEnabled, setPromotionsEnabled] = useState(true);
  const [updatesEnabled, setUpdatesEnabled] = useState(false);
  //const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  //const [languagePreference, setLanguagePreference] = useState('french');

  const insets = useSafeAreaInsets();
  const getTabBarHeight = () => {
    if (Platform.OS === "android") {
      // If bottom inset is 0, device uses button navigation
      // If bottom inset > 0, device uses gesture navigation
      const hasButtonNavigation = insets.bottom === 0;
      return hasButtonNavigation ? 60 : 70 + insets.bottom;
    }
    return undefined; // Let iOS handle it automatically
  };

  const { width, height } = Dimensions.get("screen");
  const orders = [
    {
      id: 1,
      image: "https://placehold.jp/150x150.png",
      title: "Commande #XXX",
      content: "Trucs que t'as acheté",
      restaurant: "Jean Brillant",
      price: "$20.00",
    },
    {
      id: 2,
      image: "https://placehold.jp/150x150.png",
      title: "Commande #XXX",
      content: "Trucs que t'as acheté",
      restaurant: "André Aisenstadt",
      price: "$15.00",
    },
    // Add more orders as needed
  ];

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
            setUserEmail(userInfo.email);

            // Set original and edit values
            setOriginalFirstName(userInfo.first_name || "");
            setOriginalLastName(userInfo.last_name || "");
            setOriginalEmail(userInfo.email || "");
            setOriginalPhotoUrl(userInfo.photo_url || "");
            setOriginalUsername(userInfo.username || "");
            //setOriginalMatricule(userInfo.matricule || "");

            setEditFirstName(userInfo.first_name || "");
            setEditLastName(userInfo.last_name || "");
            setEditEmail(userInfo.email || "");
            setEditPhotoUrl(userInfo.photo_url || "");
            setEditUsername(userInfo.username || "");
            //setEditMatricule(userInfo.matricule || "");
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
          navigation.push("/sign-in");
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

  // Refresh user data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const refreshUserInfo = async () => {
        try {
          console.log("Parametre screen focused - refreshing user info");

          // Get stored values from AsyncStorage
          const storedFullName = await getUserFullname();
          const storedPhotoUrl = await getUserPhotoUrl();

          // Get fresh data from server
          const accessToken = await getToken();
          if (accessToken) {
            const userInfo = await getInfoFromToken(accessToken);
            console.log("Fresh user info from server:", userInfo);

            if (userInfo) {
              // Update full name if changed
              if (userInfo.first_name && userInfo.last_name) {
                const newFullName = `${userInfo.first_name} ${userInfo.last_name}`;
                if (newFullName !== storedFullName) {
                  setUserFullName(newFullName);
                  setEditFirstName(userInfo.first_name);
                  setEditLastName(userInfo.last_name);
                  setOriginalFirstName(userInfo.first_name);
                  setOriginalLastName(userInfo.last_name);
                }
              }

              // Update photo URL if changed
              if (userInfo.photo_url && userInfo.photo_url !== storedPhotoUrl) {
                setUserImage(userInfo.photo_url);
                setEditPhotoUrl(userInfo.photo_url);
                setOriginalPhotoUrl(userInfo.photo_url);
              }

              // Update other fields
              if (userInfo.email) {
                setUserEmail(userInfo.email);
                setEditEmail(userInfo.email);
                setOriginalEmail(userInfo.email);
              }

              if (userInfo.username) {
                setEditUsername(userInfo.username);
                setOriginalUsername(userInfo.username);
              }

              /*
              
              if (userInfo.matricule) {
                setEditMatricule(userInfo.matricule);
                setOriginalMatricule(userInfo.matricule);
              }
              */
            }
          }
        } catch (error) {
          console.error("Error refreshing user info on focus:", error);
        }
      };

      refreshUserInfo();
    }, [])
  );

  const uploadImageToCloudflare = async (imageUri: string) => {
    try {
      const cloudflareToken = process.env.EXPO_PUBLIC_CLOUDFLARE_API_TOKEN;
      const cloudflareAccountId = process.env.EXPO_PUBLIC_CLOUDFLARE_ACCOUNT_ID;

      if (!cloudflareToken || !cloudflareAccountId) {
        throw new Error("Cloudflare credentials not configured");
      }

      const formData = new FormData();

      // Extract filename from URI or use a default
      const filename = imageUri.split("/").pop() || "profile-picture.jpg";

      // Append the image file
      formData.append("file", {
        uri: imageUri,
        name: filename,
        type: "image/jpeg", // You can adjust based on actual image type
      } as any);

      formData.append("requireSignedURLs", "false");
      formData.append("metadata", JSON.stringify({ key: "profile_picture" }));

      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/images/v1`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${cloudflareToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Cloudflare upload error:", errorData);
        throw new Error("Failed to upload image to Cloudflare");
      }

      const data = await response.json();
      console.log("Cloudflare upload response:", data);

      // Return the public variant URL (2nd variant)
      if (
        data.result &&
        data.result.variants &&
        data.result.variants.length >= 2
      ) {
        return data.result.variants[1]; // The "public" variant
      }

      throw new Error("No public variant URL in response");
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const pickImageAndUpload = async () => {
    try {
      // Request permission to access media library
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        alert("Permission d'accéder à la galerie est requise!");
        return;
      }

      // Open image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;

        // Show loading state
        setIsUploading(true);

        // Upload to Cloudflare
        const uploadedUrl = await uploadImageToCloudflare(imageUri);

        // Set the uploaded URL
        setEditPhotoUrl(uploadedUrl);

        // Automatically update profile with new photo URL
        const token = await getToken();
        if (token) {
          const updateResponse = await fetch(
            "https://cafesansfil-api-r0kj.onrender.com/api/users/@me",
            {
              method: "PUT",
              headers: {
                accept: "application/json",
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ photo_url: uploadedUrl }),
            }
          );

          if (updateResponse.ok) {
            const updatedUserInfo = await updateResponse.json();
            console.log(
              "Profile picture updated successfully:",
              updatedUserInfo
            );

            // Update local state with new photo URL
            setUserImage(uploadedUrl);
            setOriginalPhotoUrl(uploadedUrl);

            // Update stored photo URL
            await setUserPhotoUrl(uploadedUrl);

            setIsUploading(false);
            setAccountModalVisible(false);
          } else {
            const errorData = await updateResponse.json();
            console.error("Error updating profile picture:", errorData);
            setIsUploading(false);
            alert(
              `Erreur lors de la mise à jour: ${
                errorData.detail || "Erreur inconnue"
              }`
            );
          }
        } else {
          setIsUploading(false);
          alert("Vous devez être connecté pour mettre à jour votre profil.");
        }
      }
    } catch (error) {
      console.error("Error picking/uploading image:", error);
      setIsUploading(false);
      alert("Erreur lors du téléchargement de l'image.");
    }
  };

  const updateProfile = async () => {
    try {
      const token = await getToken();
      if (!token) {
        alert("Vous devez être connecté pour modifier votre profil.");
        return;
      }

      // Build the update payload with only changed values
      const updates: any = {};

      if (editUsername !== originalUsername && editUsername.trim() !== "") {
        updates.username = editUsername.trim();
      }

      if (editEmail !== originalEmail && editEmail.trim() !== "") {
        updates.email = editEmail.trim();
      }

      /*
      if (editMatricule !== originalMatricule && editMatricule.trim() !== "") {
        updates.matricule = editMatricule.trim();
      }
      */

      if (editPassword.trim() !== "") {
        updates.password = editPassword.trim();
      }

      if (editFirstName !== originalFirstName && editFirstName.trim() !== "") {
        updates.first_name = editFirstName.trim();
      }

      if (editLastName !== originalLastName && editLastName.trim() !== "") {
        updates.last_name = editLastName.trim();
      }

      if (editPhotoUrl !== originalPhotoUrl && editPhotoUrl.trim() !== "") {
        updates.photo_url = editPhotoUrl.trim();
      }

      // If no changes, don't make the request
      if (Object.keys(updates).length === 0) {
        alert("Aucune modification détectée.");
        return;
      }

      console.log("Sending updates:", updates);

      const response = await fetch(
        "https://cafesansfil-api-r0kj.onrender.com/api/users/@me",
        {
          method: "PUT",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating profile:", errorData);
        alert(
          `Erreur lors de la mise à jour: ${
            errorData.detail || "Erreur inconnue"
          }`
        );
        return;
      }

      const updatedUserInfo = await response.json();
      console.log("Profile updated successfully:", updatedUserInfo);

      // Update local state with new values
      if (updatedUserInfo.first_name && updatedUserInfo.last_name) {
        const newFullName = `${updatedUserInfo.first_name} ${updatedUserInfo.last_name}`;
        setUserFullName(newFullName);
        setOriginalFirstName(updatedUserInfo.first_name);
        setOriginalLastName(updatedUserInfo.last_name);

        // Update stored full name
        await setUserFullname(newFullName);
      }

      if (updatedUserInfo.email) {
        setUserEmail(updatedUserInfo.email);
        setOriginalEmail(updatedUserInfo.email);
      }

      if (updatedUserInfo.photo_url) {
        setUserImage(updatedUserInfo.photo_url);
        setOriginalPhotoUrl(updatedUserInfo.photo_url);
        setEditPhotoUrl(updatedUserInfo.photo_url);

        // Update stored photo URL
        await setUserPhotoUrl(updatedUserInfo.photo_url);
      }

      if (updatedUserInfo.username) {
        setOriginalUsername(updatedUserInfo.username);
        setEditUsername(updatedUserInfo.username);
      }

      /*
      if (updatedUserInfo.matricule) {
        setOriginalMatricule(updatedUserInfo.matricule);
        setEditMatricule(updatedUserInfo.matricule);
      }
      */

      // Clear password field
      setEditPassword("");

      alert("Profil mis à jour avec succès!");
      setAccountModalVisible(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Erreur lors de la mise à jour du profil.");
    }
  };

  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  const logoutfromthis = async () => {
    // Clear all tokens and user data
    await clearTokens();
    console.log("Logged out - cleared all tokens and user data");
    setAccountModalVisible(false);
    navigation.push("/first-onboarding");
  };

  const deletethisaccount = async () => {
    // Get token first to check if user is logged in
    const token = await getToken();

    if (!token) {
      alert("Vous devez être connecté pour supprimer votre compte.");
      setAccountModalVisible(false);
      return;
    }

    // Show confirmation alert
    Alert.alert(
      "Êtes-vous sûr?",
      "La suppression de votre compte est irréversible. Toutes vos données seront perdues.",
      [
        {
          text: "Annuler",
          style: "cancel",
          onPress: () => {
            console.log("Account deletion cancelled");
          },
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            // This is where the actual deletion happens after confirmation
            try {
              const isDeleted = await deleteAccount(token);

              if (isDeleted) {
                // Clear all user data
                await clearTokens();
                setAccountModalVisible(false);

                // Navigate to onboarding
                navigation.push("/first-onboarding");

                alert("Votre compte a été supprimé avec succès.");
              } else {
                alert(
                  "Erreur lors de la suppression du compte. Veuillez réessayer plus tard."
                );
              }
            } catch (error) {
              console.error("Error deleting account:", error);
              alert(
                "Erreur lors de la suppression du compte. Veuillez réessayer plus tard."
              );
            }
          },
        },
      ]
    );
  };

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  const [showPassword, setShowPassword] = useState(false);
  const fetchOrders = async () => {
    try {
      const token = await getToken();

      // Don't fetch if no token (user logged out)
      if (!token) {
        console.log("No token available, skipping orders fetch");
        return [];
      }

      const response = await fetch(
        "https://cafesansfil-api-r0kj.onrender.com/api/users/@me/orders",
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        // Don't throw error, just log it and return empty array
        console.log(`Failed to fetch orders: ${response.status}`);
        return [];
      }

      const ordersData = await response.json();
      console.log("Orders Data: ", ordersData);
      return ordersData;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  };
  const easteregg = () => {
    setCounter(counter + 1);
    setShowPassword(!showPassword);
    if (counter >= 6) {
      Alert.alert("Easter Egg!", "jalal was here :P");
      setCounter(0);
    }
  };

  // Only fetch orders if component is mounted and user is logged in
  React.useEffect(() => {
    fetchOrders();
  }, []);
  // Menu items data with their respective icons and actions
  const menuItems: MenuItem[] = [
    /*
    {
      icon: <Package size={26} strokeWidth={2.5} color={COLORS.black} />,
      title: "Mes commandes",
      subtitle: "Consultez vos commandes et transactions passées.",
      onPress:() => setOrdersModalVisible(true),
    },
    
    {
      icon: <Settings2 size={26} strokeWidth={2.5} color={COLORS.black} />,
      title: "Mes préférences",
      subtitle: "Gérez et personnalisez vos préférences.",
      onPress: () => setPreferencesModalVisible(true),
    },
    /*
    {
      icon: <HelpCircle size={26} strokeWidth={2.5} color={COLORS.black} />,
      title: "Aide et support",
      subtitle: "Obtenez de l'aide et contactez le support.",
      onPress: () => console.log("Support pressed"),
    },
    */
    {
      icon: <HeartHandshake size={26} strokeWidth={2.5} color={COLORS.black} />,
      title: "Remerciements",
      subtitle: "Découvrez l'équipe derrière cette application.",
      onPress: () => setRemerciementsModalVisible(true),
    },
    {
      icon: <Info size={26} strokeWidth={2.5} color={COLORS.black} />,
      title: "À propos",
      subtitle: "En savoir plus l'application.",
      onPress: () => setModalVisible(true),
    },
  ];

  // Render a single menu item
  const renderMenuItem = ({ icon, title, subtitle, onPress }: MenuItem) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} key={title}>
      <View style={styles.menuItemLeft}>
        {icon}
        <View style={styles.menuItemText}>
          <Text
            style={[
              TYPOGRAPHY.body.large.semiBold,
              styles.menuItemTitle,
              { fontSize: 15 },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              TYPOGRAPHY.body.small.base,
              styles.menuItemSubtitle,
              { fontSize: 10.6 },
            ]}
          >
            {subtitle}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar />
      {/* User Profile Section */}
      <TouchableOpacity
        style={styles.profileSection}
        onPress={() => setAccountModalVisible(true)}
      >
        <View style={styles.profileLeft}>
          <Image
            source={{ uri: userImage } as any}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={[TYPOGRAPHY.heading.small.bold, styles.profileName]}>
              {isLoading ? "Chargement..." : userFullName}
              {}
            </Text>
            <Text
              style={[
                TYPOGRAPHY.body.small.base,
                styles.profileSubtitle,
                { fontSize: 11 },
              ]}
            >
              Gérez les informations de votre compte.
            </Text>
          </View>
        </View>
        <ChevronRight size={24} color={COLORS.black} strokeWidth={2.5} />
      </TouchableOpacity>
      <ScrollableLayout>
        <SafeAreaView style={styles.container}>
          {/* Menu Items */}
          <View style={styles.menuSection}>
            {menuItems.map(renderMenuItem)}
          </View>

          <Divider marginTop={16} marginBottom={4}></Divider>

          {/* System Status 
        <View style={styles.systemStatus}>
          <Text style={[TYPOGRAPHY.body.normal.semiBold, styles.systemStatusTitle]}>
            État du système
          </Text>
          <View style={styles.systemStatusIndicator}>
            <View style={{ position: 'relative' }}>
              <Animated.View
                style={[
                  styles.pulsingDot,
                  {
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              />
              <View style={styles.statusDot} />
            </View>
            <Text style={[TYPOGRAPHY.body.small.bold, styles.systemStatusText]}>
              Opérationnel
            </Text>
          </View>
          <Text style={[TYPOGRAPHY.body.small.base, styles.systemStatusSubtext]}>
            Le système fonctionne correctement.
          </Text>
        </View>
        */}

          <Modal
            animationType="slide"
            visible={remmerciementsModalVisible}
            onRequestClose={() => setRemerciementsModalVisible(false)}
            presentationStyle="pageSheet"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modernModalTitle}>Remerciements</Text>
                <TouchableOpacity
                  onPress={() => setRemerciementsModalVisible(false)}
                >
                  <AntDesign name="close" size={24} color={COLORS.black} />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.modernModalContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.aboutSection}>
                  <View style={styles.sectionIcon}>
                    <FontAwesome name="heart" size={22} color={COLORS.white} />
                  </View>
                  <Text style={styles.sectionTitle}>Contributeurs</Text>
                  <Text style={styles.sectionContent}>
                    Cette application mobile a été développée avec passion par
                    les membres du CADUM. Un immense merci à tous ceux qui ont
                    contribué à donner vie à ce projet :
                  </Text>

                  <View style={styles.contributorsList}>
                    <Text style={styles.contributorName}>• Jalal Fatouaki</Text>
                    <Text style={styles.contributorName}>
                      • William Hayward
                    </Text>
                    <Text style={styles.contributorName}>• Thierno Diallo</Text>
                    <Text style={styles.contributorName}>• Flora Kang</Text>
                    <Text style={styles.contributorName}>• Ding Wen Li</Text>
                    <Text style={styles.contributorName}>• Trung Nguyen</Text>
                    <Text style={styles.contributorName}>
                      • Udeme-Obong Itoro Samuel
                    </Text>
                    <Text style={styles.contributorName}>
                      • Louis Edouard Lafontant et l'équipe Café Sans-fil web
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />
              </ScrollView>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            visible={accountModalVisible}
            onRequestClose={() => setAccountModalVisible(false)}
            presentationStyle="pageSheet"
          >
            <View style={styles.modalContainer}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Mon Profil</Text>
                <TouchableOpacity onPress={() => setAccountModalVisible(false)}>
                  <AntDesign name="close" size={24} color={COLORS.black} />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.accountModalScroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.accountModalContent}
              >
                {/* Profile Picture Section */}
                <View style={styles.modalProfileSection}>
                  <View style={styles.profileImageContainer}>
                    <Image
                      source={{
                        uri:
                          editPhotoUrl ||
                          userImage ||
                          "https://via.placeholder.com/120",
                      }}
                      style={styles.modernProfilePicture}
                    />
                    <TouchableOpacity
                      style={styles.cameraButton}
                      onPress={pickImageAndUpload}
                    >
                      <Camera size={20} color={COLORS.white} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.modalProfileName}>
                    {userFullName || "Utilisateur"}
                  </Text>
                  <Text style={styles.modalProfileEmail}>
                    {userEmail || "email@exemple.com"}
                  </Text>
                </View>

                {/* Account Information Section */}
                <View style={styles.accountSectionContainer}>
                  {/* Username Input */}
                  <View style={styles.inputGroup}>
                    <View style={styles.inputLabelContainer}>
                      <User size={18} color="#666" />
                      <Text style={styles.inputLabel}>Nom d'utilisateur</Text>
                    </View>
                    <TextInput
                      style={styles.modernInput}
                      placeholder="Entrez votre nom d'utilisateur"
                      placeholderTextColor="#999"
                      value={editUsername}
                      onChangeText={setEditUsername}
                      autoCapitalize="none"
                    />
                  </View>

                  {/* First Name Input */}
                  <View style={styles.inputGroup}>
                    <View style={styles.inputLabelContainer}>
                      <User size={18} color="#666" />
                      <Text style={styles.inputLabel}>Prénom</Text>
                    </View>
                    <TextInput
                      style={styles.modernInput}
                      placeholder="Entrez votre prénom"
                      placeholderTextColor="#999"
                      value={editFirstName}
                      onChangeText={setEditFirstName}
                    />
                  </View>

                  {/* Last Name Input */}
                  <View style={styles.inputGroup}>
                    <View style={styles.inputLabelContainer}>
                      <User size={18} color="#666" />
                      <Text style={styles.inputLabel}>Nom de famille</Text>
                    </View>
                    <TextInput
                      style={styles.modernInput}
                      placeholder="Entrez votre nom de famille"
                      placeholderTextColor="#999"
                      value={editLastName}
                      onChangeText={setEditLastName}
                    />
                  </View>

                  {/* Email Input */}
                  <View style={styles.inputGroup}>
                    <View style={styles.inputLabelContainer}>
                      <Mail size={18} color="#666" />
                      <Text style={styles.inputLabel}>Adresse e-mail</Text>
                    </View>
                    <TextInput
                      style={styles.modernInput}
                      placeholder="Entrez votre email"
                      placeholderTextColor="#999"
                      value={editEmail}
                      onChangeText={setEditEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  {/* Matricule Input 
                  <View style={styles.inputGroup}>
                    <View style={styles.inputLabelContainer}>
                      <User size={18} color="#666" />
                      <Text style={styles.inputLabel}>Matricule</Text>
                    </View>
                    <TextInput 
                      style={styles.modernInput}
                      placeholder="Entrez votre matricule" 
                      placeholderTextColor="#999" 
                      value={editMatricule}
                      onChangeText={setEditMatricule}
                    />
                  </View>
                  */}

                  {/* Password Input */}
                  <View style={styles.inputGroup}>
                    <View style={styles.inputLabelContainer}>
                      <Lock size={18} color="#666" />
                      <Text style={styles.inputLabel}>Mot de passe</Text>
                    </View>
                    <View style={styles.modernPasswordContainer}>
                      <TextInput
                        style={styles.modernPasswordInput}
                        placeholder="Nouveau mot de passe"
                        secureTextEntry={!showPassword}
                        placeholderTextColor="#999"
                        value={editPassword}
                        onChangeText={setEditPassword}
                        autoCapitalize="none"
                      />
                      <TouchableOpacity
                        style={styles.modernPasswordToggle}
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        {!showPassword ? (
                          <EyeOff size={20} color="#666" />
                        ) : (
                          <Eye size={20} color="#666" />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Save Changes Button */}
                <TouchableOpacity
                  onPress={updateProfile}
                  style={styles.saveButton}
                >
                  <Text style={styles.saveButtonText}>
                    Enregistrer les modifications
                  </Text>
                </TouchableOpacity>

                {/* Danger Zone Section */}
                <View style={styles.dangerZone}>
                  <Text style={styles.dangerZoneTitle}>Zone de danger</Text>

                  <TouchableOpacity
                    style={styles.modernLogoutButton}
                    onPress={async () => {
                      logoutfromthis();
                    }}
                  >
                    <LogOut size={20} color="#FF9800" />
                    <Text style={styles.modernLogoutText}>Se déconnecter</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modernDeleteButton}
                    onPress={() => {
                      deletethisaccount();
                    }}
                  >
                    <Trash2 size={20} color="#FF4444" />
                    <Text style={styles.modernDeleteText}>
                      Supprimer mon compte
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
            presentationStyle="pageSheet"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modernModalTitle}>À propos</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <AntDesign name="close" size={24} color={COLORS.black} />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.modernModalContent}
                showsVerticalScrollIndicator={false}
              >
                {/*}
        <View style={styles.aboutSection}>
          <View style={styles.sectionIcon}>
            <Info size={24} color={COLORS.white} />
          </View>
          <Text style={styles.sectionTitle}>Bienvenue!</Text>
          <Text style={styles.sectionContent}>
            Avez-vous déjà rêvé d'utiliser une application mobile pour pouvoir commander un bon repas? 
            C'est exactement ce qui a poussé notre équipe à créer une application de ce type. 
            Notre club, du nom de CADUM, est justement à la charge de cela. Ce club vise à développer des applications mobiles pour améliorer la vie des étudiants des différentes universités. 
            Si vous avez tendance à avoir le manque d'énergie de tout le temps commander de la nourriture, nous sommes justement là pour vous. Soyez la bienvenue!
          </Text>
        </View>


        <View style={styles.divider} />
        */}

                <View style={styles.aboutSection}>
                  <View style={styles.sectionIcon}>
                    <FontAwesome name="users" size={22} color={COLORS.white} />
                  </View>
                  <Text style={styles.sectionTitle}>À propos du CADUM</Text>
                  <Text style={styles.sectionContent}>
                    Le Club de développement d'applications de l'Université de
                    Montréal (CADUM) est un club étudiant fondé à l'automne
                    2024. Nous rassemblons des étudiants passionnés par le
                    développement mobile qui souhaitent apprendre, créer et
                    collaborer sur des projets concrets.
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.aboutSection}>
                  <View style={styles.sectionIcon}>
                    <FontAwesome
                      name="user-secret"
                      size={22}
                      color={COLORS.white}
                    />
                  </View>
                  <Text style={styles.sectionTitle}>
                    Politiques et confidentalité
                  </Text>
                  <Text style={styles.sectionContent}>
                    Vous pouvez consulter notre politique de confidentialité et
                    nos conditions d'utilisation en détails sur notre site web:{" "}
                    <Text
                      style={{
                        color: "#007AFF",
                        textDecorationLine: "underline",
                      }}
                      onPress={() =>
                        Linking.openURL(
                          "https://cadum.aediroum.ca/politique.html"
                        )
                      }
                    >
                      https://cadum.aediroum.ca/politique.html
                    </Text>
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.aboutSection}>
                  <View style={styles.sectionIcon}>
                    <FontAwesome6
                      name="share-nodes"
                      size={20}
                      color={COLORS.white}
                    />
                  </View>
                  <Text style={styles.sectionTitle}>Rejoignez-nous</Text>
                  <Text style={styles.sectionContent}>
                    Suivez nos actualités, participez à nos ateliers et
                    contribuez à nos projets open source. Rejoignez notre
                    communauté pour apprendre et grandir avec nous !
                  </Text>

                  <View style={styles.socialIcons}>
                    <TouchableOpacity
                      style={styles.socialButton}
                      onPress={() =>
                        navigation.push("https://discord.gg/DvJWz9hwWF")
                      }
                    >
                      <FontAwesome6
                        name="discord"
                        size={24}
                        color={COLORS.white}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.socialButton}
                      onPress={() =>
                        navigation.push("https://github.com/CADUM-UdeM")
                      }
                    >
                      <AntDesign name="github" size={24} color={COLORS.white} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.socialButton}
                      onPress={() =>
                        navigation.push("https://cadum.aediroum.ca")
                      }
                    >
                      <FontAwesome
                        name="globe"
                        size={24}
                        color={COLORS.white}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.footerSection}>
                  <Text style={styles.versionText}>
                    Version {Constants.expoConfig?.version}
                  </Text>
                  <Text style={styles.copyrightText}>
                    © 2025 CADUM. Tous droits réservés.
                  </Text>
                </View>
              </ScrollView>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            visible={prferencesModalVisible}
            onRequestClose={() => setPreferencesModalVisible(false)}
            presentationStyle="pageSheet"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modernModalTitle}>Mes préférences</Text>
                <TouchableOpacity
                  onPress={() => setPreferencesModalVisible(false)}
                >
                  <AntDesign name="close" size={24} color={COLORS.black} />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.modernModalContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Notifications Section */}
                <View style={styles.preferenceSection}>
                  <View style={styles.preferenceSectionHeader}>
                    <View style={styles.sectionIcon}>
                      <Bell size={20} color={COLORS.black} />
                    </View>
                    <Text style={styles.preferenceSectionTitle}>
                      Notifications
                    </Text>
                  </View>
                  <Text style={styles.preferenceSectionDescription}>
                    Gérez vos préférences de notification pour rester informé
                  </Text>

                  <View style={styles.toggleContainer}>
                    <View style={styles.toggleItem}>
                      <View style={styles.toggleTextContainer}>
                        <Text style={styles.toggleTitle}>
                          Toutes les notifications
                        </Text>
                        <Text style={styles.toggleSubtitle}>
                          Activer/désactiver toutes les notifications
                        </Text>
                      </View>
                      <Switch
                        value={notificationsEnabled}
                        onValueChange={setNotificationsEnabled}
                        trackColor={{
                          false: COLORS.darkWhite,
                          true: "#25c800ff",
                        }}
                        thumbColor={COLORS.white}
                        ios_backgroundColor={COLORS.darkWhite}
                      />
                    </View>

                    <View style={styles.toggleItem}>
                      <View style={styles.toggleTextContainer}>
                        <Text style={styles.toggleTitle}>Annonces</Text>
                        <Text style={styles.toggleSubtitle}>
                          Recevez les nouvelles annonces
                        </Text>
                      </View>
                      <Switch
                        value={promotionsEnabled}
                        onValueChange={setPromotionsEnabled}
                        trackColor={{
                          false: COLORS.darkWhite,
                          true: "#25c800ff",
                        }}
                        thumbColor={COLORS.white}
                        ios_backgroundColor={COLORS.darkWhite}
                        disabled={notificationsEnabled}
                      />
                    </View>

                    <View style={styles.toggleItem}>
                      <View style={styles.toggleTextContainer}>
                        <Text style={styles.toggleTitle}>Événements</Text>
                        <Text style={styles.toggleSubtitle}>
                          Recevez les nouveaux événements
                        </Text>
                      </View>
                      <Switch
                        value={updatesEnabled}
                        onValueChange={setUpdatesEnabled}
                        trackColor={{
                          false: COLORS.darkWhite,
                          true: "#25c800ff",
                        }}
                        thumbColor={COLORS.white}
                        ios_backgroundColor={COLORS.darkWhite}
                        disabled={notificationsEnabled}
                      />
                    </View>
                  </View>
                </View>

                {/*
        <View style={styles.divider} />

         Theme Section 
        <View style={styles.preferenceSection}>
          <View style={styles.preferenceSectionHeader}>
            <View style={styles.sectionIcon}>
              <Settings2 size={20} color={COLORS.black} />
            </View>
            <Text style={styles.preferenceSectionTitle}>Apparence</Text>
          </View>
          <Text style={styles.preferenceSectionDescription}>
            Personnalisez l'apparence de l'application
          </Text>
          
          <View style={styles.toggleContainer}>
            <View style={styles.toggleItem}>
              <View style={styles.toggleTextContainer}>
                <Text style={styles.toggleTitle}>Mode sombre</Text>
                <Text style={styles.toggleSubtitle}>Activez le thème sombre pour réduire la fatigue oculaire</Text>
              </View>
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: '#E0E0E0', true: '#25c800ff' }}
                thumbColor={COLORS.white}
                ios_backgroundColor="#E0E0E0"
              />
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Language Section 
        <View style={styles.preferenceSection}>
          <View style={styles.preferenceSectionHeader}>
            <View style={styles.sectionIcon}>
              <FontAwesome name="globe" size={20} color={COLORS.black} />
            </View>
            <Text style={styles.preferenceSectionTitle}>Langue</Text>
          </View>
          <Text style={styles.preferenceSectionDescription}>
            Sélectionnez votre langue préférée
          </Text>
          
          <View style={styles.languageContainer}>
            <TouchableOpacity 
              style={[
                styles.languageOption,
                languagePreference === 'french' && styles.languageOptionSelected
              ]}
              onPress={() => setLanguagePreference('french')}
            >
              <View style={styles.languageOptionContent}>
                <Text style={[
                  styles.languageText,
                  languagePreference === 'french' && styles.languageTextSelected
                ]}>
                  🇫🇷 Français
                </Text>
                {languagePreference === 'french' && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.languageOption,
                languagePreference === 'english' && styles.languageOptionSelected
              ]}
              onPress={() => setLanguagePreference('english')}
            >
              <View style={styles.languageOptionContent}>
                <Text style={[
                  styles.languageText,
                  languagePreference === 'english' && styles.languageTextSelected
                ]}>
                  🇬🇧 English
                </Text>
                {languagePreference === 'english' && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.languageOption,
                languagePreference === 'spanish' && styles.languageOptionSelected
              ]}
              onPress={() => setLanguagePreference('spanish')}
            >
              <View style={styles.languageOptionContent}>
                <Text style={[
                  styles.languageText,
                  languagePreference === 'spanish' && styles.languageTextSelected
                ]}>
                  🇪🇸 Español
                </Text>
                {languagePreference === 'spanish' && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
        */}
              </ScrollView>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            visible={ordersModalVisible}
            onRequestClose={() => setOrdersModalVisible(false)}
            presentationStyle="pageSheet"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Mes Commandes</Text>
                <TouchableOpacity onPress={() => setOrdersModalVisible(false)}>
                  <AntDesign name="close" size={24} color={COLORS.black} />
                </TouchableOpacity>
              </View>
              <View style={styles.modalContent}>
                {orders.map((order) => (
                  <TouchableOpacity
                    key={order.id}
                    style={styles.orderBox}
                    onPress={() => {}}
                  >
                    <Image
                      source={{ uri: order.image }}
                      style={styles.orderImage}
                    />
                    <View style={styles.orderDetails}>
                      <Text style={styles.orderTitle}>{order.title}</Text>
                      <Text style={styles.orderContent}>{order.content}</Text>
                      <Text style={styles.orderRestaurant}>
                        {order.restaurant}
                      </Text>
                    </View>
                    <Text style={styles.orderPrice}>{order.price}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </ScrollableLayout>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: "#F0F0F0",
    borderTopColor: COLORS.white,
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === "ios" ? SPACING["8xl"] : SPACING["3xl"],
    paddingHorizontal: SPACING.md,
  },
  profileLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  profileImage: {
    width: SPACING["8xl"],
    height: SPACING["8xl"],
    borderRadius: 100,
    borderWidth: 2,
    // borderColor: "rgba(0, 0, 0, 0.1)", // Not from any university
    borderColor: COLORS.darkWhite, // From University of Montreal
    // borderColor: "rgba(237, 27, 47, .2)", // From McGill University
  },
  profileInfo: {
    gap: SPACING.xxs,
  },
  profileName: {
    color: COLORS.black,
  },
  profileSubtitle: {
    color: COLORS.subtuleDark,
  },
  menuSection: {
    gap: 0,
    marginHorizontal: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: SPACING.md,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  menuItemText: {
    gap: 5,
  },
  menuItemTitle: {
    color: COLORS.black,
  },
  menuItemSubtitle: {
    color: COLORS.subtuleDark,
  },
  systemStatus: {
    marginTop: SPACING.xl,
    padding: SPACING.lg,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    gap: SPACING.sm,
    marginHorizontal: SPACING.md,
  },
  systemStatusTitle: {
    color: COLORS.black,
  },
  systemStatusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.status.green,
    position: "relative",
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.status.green,
    position: "absolute",
    opacity: 0.5,
  },
  systemStatusText: {
    color: COLORS.status.green,
  },
  systemStatusSubtext: {
    color: COLORS.subtuleDark,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    padding: 20,
    marginTop: Platform.OS === "android" ? 15 : 0,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
  },
  input: {
    height: 45,
    backgroundColor: "#f0f0f0",
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  // Modern Account Modal Styles
  accountModalContainer: {
    width: "100%",
    height: "90%",
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    marginTop: "auto",
  },
  accountModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: COLORS.white,
  },
  accountModalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.black,
  },
  contributorsList: {
    marginTop: 12,
    paddingLeft: 8,
  },
  contributorName: {
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 6,
    lineHeight: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
  },
  accountModalScroll: {
    flex: 1,
  },
  accountModalContent: {
    paddingHorizontal: 20,
    paddingBottom: 70,
  },
  modalProfileSection: {
    alignItems: "center",
    paddingVertical: 30,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  modernProfilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.darkWhite,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.black,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  modalProfileName: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.black,
    marginBottom: 4,
  },
  modalProfileEmail: {
    fontSize: 14,
    color: "#666",
  },
  accountSectionContainer: {
    marginBottom: 24,
  },
  accountSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.black,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  modernInput: {
    height: 50,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.darkWhite,
  },
  modernPasswordContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.darkWhite,
  },
  modernPasswordInput: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: COLORS.black,
  },
  modernPasswordToggle: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#00ac25ff",
    height: 54,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#0eac00ff",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
  dangerZone: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  dangerZoneTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FF4444",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modernLogoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    backgroundColor: "#FFF3E0",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FFE0B2",
    gap: 10,
  },
  modernLogoutText: {
    color: "#FF9800",
    fontSize: 15,
    fontWeight: "600",
  },
  modernDeleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    backgroundColor: "#FFEBEE",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFCDD2",
    gap: 10,
  },
  modernDeleteText: {
    color: "#FF4444",
    fontSize: 15,
    fontWeight: "600",
  },
  btn: {
    borderRadius: 15,
    margin: 10,
    width: "60%",
    alignSelf: "center",
  },
  orderBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  orderImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  orderDetails: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  orderContent: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  orderRestaurant: {
    fontSize: 14,
    color: "#999",
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  clubText: {
    fontSize: 17, // taille de texte plus grande
    fontFamily: "Arial", // police Calibri
    textAlign: "justify",
    padding: 5,
  },
  socialText: {
    fontSize: 17,
    fontFamily: "Arial",
    textAlign: "justify",
    padding: 5,
  },
  policyText: {
    fontSize: 17,
    fontFamily: "Arial",
    textAlign: "justify",
    padding: 5,
  },
  boldText: {
    fontSize: 21,
    fontFamily: "Arial",
    fontWeight: "bold",
    textDecorationLine: "underline",
    lineHeight: 45,
    color: "#000033", // peut etre repeter cette couleur dans les autres parties
  },
  textContainer: {
    margin: 10,
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 10,
  },
  // Additional styles for the modern modal
  modernModalContainer: {
    width: "100%",
    maxHeight: "90%",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  modernModalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.black,
  },
  modernModalContent: {
    padding: 20,
  },
  aboutSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: COLORS.black,
  },
  sectionContent: {
    fontSize: 15,
    lineHeight: 24,
    color: "#555",
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.black, // UdeM blue with transparency
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 20,
  },
  socialIcons: {
    flexDirection: "row",
    marginTop: 15,
    gap: 15,
    justifyContent: "center",
  },
  socialButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: COLORS.black, // UdeM blue with transparency

    alignItems: "center",
    justifyContent: "center",
  },
  footerSection: {
    marginTop: 20,
    alignItems: "center",
    paddingVertical: 15,
    paddingBottom: 90,
  },
  versionText: {
    fontSize: 14,
    color: "#999",
    marginBottom: 5,
  },
  copyrightText: {
    fontSize: 12,
    color: "#999",
    marginBottom: SPACING["md"],
  },
  // Preferences Modal Styles
  preferenceSection: {
    marginBottom: 24,
  },
  preferenceSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },
  preferenceSectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.black,
    marginTop: -14,
  },
  preferenceSectionDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  toggleContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 4,
  },
  toggleItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginBottom: 4,
  },
  toggleTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 4,
  },
  toggleSubtitle: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  languageContainer: {
    gap: 8,
  },
  languageOption: {
    backgroundColor: "#f8faf8ff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  languageOptionSelected: {
    backgroundColor: "rgba(0, 172, 34, 0.08)",
    borderColor: "#1dac00ff",
  },
  languageOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  languageText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  languageTextSelected: {
    color: "#1dac00ff",
    fontWeight: "600",
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#1dac00ff",
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 20,
    gap: 12,
  },
  deleteButton: {
    backgroundColor: "#FF4444",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    shadowColor: "#FF4444",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  deleteButtonText: {
    color: COLORS.white,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderWidth: 1.5,
    borderColor: COLORS.darkWhite,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutButtonText: {
    color: "#333",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 8,
    height: 45,
  },
  passwordInput: {
    flex: 1,
    height: "100%",
    color: COLORS.black,
  },
  passwordToggle: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadImageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 87, 172, 1)", // UdeM blue
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 8,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  uploadImageButtonDisabled: {
    backgroundColor: "rgba(0, 87, 172, 0.5)",
    opacity: 0.7,
  },
  uploadImageButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "600",
  },
});
