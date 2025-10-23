import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import Button from "@/components/common/Buttons/Button";
import IconButton from "@/components/common/Buttons/IconButton";
import Tooltip from "@/components/common/Tooltip";
import Counter from "@/components/common/Inputs/Counter";
import COLORS from "@/constants/Colors";
import SPACING from "@/constants/Spacing";
import TYPOGRAPHY from "@/constants/Typography";
import { ArrowLeft, Heart, X } from "lucide-react-native";
import { Item } from "@/constants/types/GET_item";
import { getToken } from "@/utils/tokenStorage";
import { router } from "expo-router";
import { fetchSync, saveSync } from "@/scripts/storage";
//import * as hash from "object-hash";

interface ArticleModalContentProps {
  articleId: string;
  cafeId: string;
  onClose: () => void;
}

export default function ArticleModalContent({
  articleId,
  cafeId,
  onClose,
}: ArticleModalContentProps) {
  const [menuItem, setMenuItem] = useState<Item | any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState<Number | null>(null);
  const [heart, toggleHeart] = useState(false);
  const [userArticlesFavorites, setUserArticlesFavorites] = useState<
    Array<[string, string]>
  >([]);

  const formatPrice = (price: string) => {
    if (price.charAt(price.length - 2) == ".") {
      return price + "0";
    }
    return price;
  };

  // Fetch menu item data
  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchMenuItem = async () => {
      try {
        if (!cafeId || !articleId) {
          throw new Error("Missing cafe ID or article ID");
        }

        const response = await fetch(
          `https://cafesansfil-api-r0kj.onrender.com/api/cafes/${cafeId}/menu/items/${articleId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        setMenuItem(json);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch menu item"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItem();
  }, [articleId, cafeId]);

  // Check favorite status
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const response = await fetch(
          "https://cafesansfil-api-r0kj.onrender.com/api/users/@me",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const articlesFavs = data.articles_favs || [];
          setUserArticlesFavorites(articlesFavs);

          const currentArticleId = String(articleId);
          const currentCafeId = menuItem.cafe_id
            ? String(menuItem.cafe_id)
            : String(cafeId);

          const isFavorited = articlesFavs.some(
            ([favArticleId, favCafeId]: [string, string]) =>
              String(favArticleId) === currentArticleId &&
              String(favCafeId) === currentCafeId
          );

          toggleHeart(isFavorited);
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    if (!loading && menuItem.id) {
      checkFavoriteStatus();
    }
  }, [articleId, cafeId, menuItem.cafe_id, menuItem.id, loading]);

  // Toggle favorite
  const handleToggleFavorite = async () => {
    try {
      const token = await getToken();
      if (!token) {
        onClose();
        router.push("/sign-in");
        return;
      }

      const currentArticleId = String(articleId);
      const currentCafeId = menuItem.cafe_id
        ? String(menuItem.cafe_id)
        : String(cafeId);

      const isCurrentlyFavorited = userArticlesFavorites.some(
        ([favArticleId, favCafeId]: [string, string]) =>
          String(favArticleId) === currentArticleId &&
          String(favCafeId) === currentCafeId
      );

      const method = isCurrentlyFavorited ? "DELETE" : "PUT";

      const response = await fetch(
        "https://cafesansfil-api-r0kj.onrender.com/api/users/@me/articles",
        {
          method: method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            article_id: currentArticleId,
            cafe_id: currentCafeId,
          }),
        }
      );

      if (response.ok) {
        toggleHeart(!isCurrentlyFavorited);

        if (isCurrentlyFavorited) {
          setUserArticlesFavorites((prev) =>
            prev.filter(
              ([favArticleId, favCafeId]) =>
                !(
                  String(favArticleId) === currentArticleId &&
                  String(favCafeId) === currentCafeId
                )
            )
          );
        } else {
          setUserArticlesFavorites((prev) => [
            ...prev,
            [currentArticleId, currentCafeId],
          ]);
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Alert.alert("Erreur", "Impossible de modifier les favoris");
    }
  };

  const options = menuItem.options
    ? menuItem.options.map(({ type, value, fee }) => ({ type, value, fee }))
    : [];

  const selectedFee =
    selectedIndex !== null &&
    selectedIndex >= 0 &&
    selectedIndex < options.length
      ? Number(options[selectedIndex].fee)
      : 0;
  const total = (
    (Number(menuItem.price) + Number(selectedFee)) *
    quantity
  ).toFixed(2);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.black} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text
          style={[
            TYPOGRAPHY.body.normal.semiBold,
            { color: "#D32F2F", marginBottom: 8 },
          ]}
        >
          Erreur de chargement
        </Text>
        <Text
          style={[TYPOGRAPHY.body.normal.base, { color: COLORS.subtuleDark }]}
        >
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={
              menuItem.image_url
                ? { uri: menuItem.image_url }
                : require("@/assets/images/placeholder/image2xl.png")
            }
          />

          <View style={styles.closeButton}>
            <IconButton
              Icon={X}
              onPress={onClose}
              style={{ backgroundColor: COLORS.white }}
            />
          </View>

          <View style={styles.heartButton}>
            <IconButton
              Icon={Heart}
              iconColor={heart ? COLORS.status.red : COLORS.black}
              fill={heart ? COLORS.status.red : "none"}
              onPress={handleToggleFavorite}
              style={{ backgroundColor: COLORS.white }}
            />
          </View>

          <View style={styles.statusBadge}>
            <Tooltip
              label={menuItem.in_stock ? "En Stock" : "En Rupture"}
              showChevron={false}
              status={menuItem.in_stock ? "green" : "red"}
            />
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <Text style={[TYPOGRAPHY.heading.medium.bold, { marginBottom: 8 }]}>
            {menuItem.name}
          </Text>
          <Text
            style={[
              TYPOGRAPHY.body.large.base,
              { color: COLORS.subtuleDark, lineHeight: 21, marginBottom: 16 },
            ]}
          >
            {menuItem.description}
          </Text>

          {/* Options Section */}
          {options.length > 0 && (
            <View style={styles.optionsSection}>
              <Text
                style={[TYPOGRAPHY.heading.small.bold, { marginBottom: 8 }]}
              >
                Options {options[0].type}
              </Text>
              <Text
                style={[
                  TYPOGRAPHY.body.large.base,
                  { color: COLORS.subtuleDark, marginBottom: 12 },
                ]}
              >
                Sélectionnez les options qui vous intéressent.
              </Text>
              <FlatList
                data={options}
                renderItem={({ item, index }) => (
                  <Button
                    onPress={() =>
                      setSelectedIndex((prev) =>
                        prev === index ? null : index
                      )
                    }
                    style={{
                      backgroundColor:
                        selectedIndex === index
                          ? COLORS.black
                          : COLORS.lightGray,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      borderRadius: 10,
                      flex: 1,
                      marginRight: 12,
                    }}
                  >
                    <Text
                      style={[
                        TYPOGRAPHY.body.normal.semiBold,
                        {
                          textAlign: "center",
                          color:
                            selectedIndex === index
                              ? COLORS.white
                              : COLORS.subtuleDark,
                        },
                      ]}
                    >
                      {item.value}
                      {item.fee != 0 && ` (+$${formatPrice(item.fee)})`}
                    </Text>
                  </Button>
                )}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomButton}>
        <Button
          onPress={() =>
            Alert.alert(
              "Pas encore implémenté",
              "La fonctionnalité de commande en ligne n'est pas encore disponible."
            )
          }
          style={{
            backgroundColor: menuItem.in_stock ? COLORS.black : "#6f6f6fff",
            paddingVertical: 16,
            borderRadius: 12,
            opacity: menuItem.in_stock ? 1 : 0.5,
          }}
        >
          <Text
            style={[
              TYPOGRAPHY.body.large.semiBold,
              { color: COLORS.white, textAlign: "center" },
            ]}
          >
            {menuItem.in_stock
              ? `Ajouter au panier • $${formatPrice(total)}`
              : `En rupture • $${formatPrice(total)}`}
          </Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.white,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 300,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  heartButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 16 : 30,
    right: 16,
  },
  closeButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 16 : 30,
    left: 16,
  },
  statusBadge: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
  },
  content: {
    padding: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  optionsSection: {
    marginTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  quantitySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 100, // Space for bottom button
  },
  bottomButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingBottom: Platform.OS === "ios" ? 16 : 66,
  },
});
