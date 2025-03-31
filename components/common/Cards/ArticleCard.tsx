import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Circle } from "lucide-react-native";
import { router } from "expo-router";
import { StyleProp, ViewStyle } from "react-native";

import TYPOGRAPHY from "@/constants/Typography";
import COLORS from "@/constants/Colors";
import SPACING from "@/constants/Spacing";
import React from "react";

type ArticleCardProps = {
  status: "In Stock" | "Almost Out" | "Out of Stock";

  /** The name of the article */
  name: string;

  /** The calories of the article */
  calories?: string;

  /** The price range of the article */
  price: string;

  /** The rating of the article */
  rating?: number;

  /** The image of the article */
  image?: string;

  /** The size of the card */
  size?: "medium" | "large";

  /** The slug of the article */
  slug?: string;

  /** The slug of the cafe */
  cafeSlug?: string;

  /** Additional styles for the card */
  style?: StyleProp<ViewStyle>;
};
const formatPrice = (price: string) => {
  if (price.charAt(price.length - 2) == ".") {
    return price + "0";
  }
  else{
    return price
  }
}

let cardDimensions = {
  medium: {
    width: "100%",
    height: 135,
    image: require("@/assets/images/placeholder/imagesm.png"),
  },
  large: {
    width: 160,
    height: 108,
    image: require("@/assets/images/placeholder/imagexs.png"),
  },
};

/**
 * ## articleCard Component
 *
 * A reusable card component that displays information about a article, including its name, calories,
 * price range, rating, and status. The card also includes an image and supports navigation to the
 * article's details page when pressed.
 *
 * ### Example Usage
 *
 * ```tsx
 * <articleCard
 *   status="open"
 *   name="Cozy Coffee"
 *   calories="123 Coffee Lane"
 *   price="$$"
 *   rating={4.5}
 *   image="https://example.com/image.jpg"
 *   size="large"
 *   slug="cozy-coffee"
 * />
 * ```
 *
 * @param {ArticleCardProps} props - The props for the articleCard component.
 */
export default function ArticleCard({
  status,
  name,
  calories,
  price,
  image,
  size = "medium",
  cafeSlug = "INVALID_SLUG",
  slug = "INVALID_SLUG",
  style,
}: ArticleCardProps) {
  return (
    <View style={[style, {width: "40%"}]}>
        <Pressable
          onPress={() => router.push(`/cafe/${cafeSlug}/${slug}`)}
          style={{ width: cardDimensions[size].width }}
          testID="button"
        >
          <>
            <View style={styles.wrapper}>
              <Image
                source={image ? { uri: image } : cardDimensions[size].image}
                width={cardDimensions[size].width}
                height={cardDimensions[size].height}
                style={[{ borderRadius: SPACING["sm"] }]}
                testID="image"
              />
              <Text
                style={[TYPOGRAPHY.body.small.bold, styles.rating]}
                testID="icon-button"
              >
                <Circle
                  width={12}
                  height={12}
                  strokeWidth={1}
                  color={
                    status === "In Stock"
                      ? COLORS.status.green
                      : status === "Almost Out"
                      ? COLORS.status.orange
                      : COLORS.status.red
                  }
                  fill={
                    status === "In Stock"
                      ? COLORS.status.green
                      : status === "Almost Out"
                      ? COLORS.status.orange
                      : COLORS.status.red
                  }
                  testID="tooltip-icon"
                />
              </Text>
            </View>
            <View style={styles.caption}>
              <View style={styles.articleInfo}>
              <View style={styles.articleInfoHeader}>
                <Text style={[TYPOGRAPHY.body.large.semiBold]}>{name}</Text>
              </View>
              {calories && (
                <Text
                style={[
                  TYPOGRAPHY.body.small.base,
                  styles.articleInfocalories,
                ]}
                >
                {calories} Calories
                </Text>
              )}
              </View>
              <View style={styles.priceContainer}>
              <Text style={[TYPOGRAPHY.body.large.semiBold, styles.priceText]}>
                {formatPrice(price)}
              </Text>
              </View>
            </View>
          </>
        </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  caption: {
    justifyContent: "space-between",
    marginTop: SPACING["lg"],
    flexDirection: "row",
    alignItems: "flex-end",
  },
  articleInfo: {
    gap: 6,
  },
  priceContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  articleInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING["xs"],
  },
  articleInfocalories: {
    color: COLORS.black45,
  },
  priceIcon: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs,
    justifyContent: "center",
    borderRadius: 500,
  },
  rating: {
    position: "absolute",
    right: SPACING.sm,
    top: SPACING.sm,
  },
  wrapper: {
    shadowColor: "#000",                       // Black shadow
    shadowOffset: { width: 5, height: 5 },     // Offset shadow towards bottom-right 
    shadowOpacity: 0.25,                        // Half opaque
    shadowRadius: 5,                          // Smoothness of the shadow

    elevation: 3, 
  },
  priceText: {
    color: COLORS.black, // Example style, adjust as needed
    fontSize: 16,
  },
});
