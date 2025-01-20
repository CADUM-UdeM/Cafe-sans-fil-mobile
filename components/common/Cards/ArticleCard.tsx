import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Circle } from "lucide-react-native";
import { router } from "expo-router";

import TYPOGRAPHY from "@/constants/Typography";
import COLORS from "@/constants/Colors";
import SPACING from "@/constants/Spacing";
import React from "react";

type ArticleCardProps = {
  status: "In Stock" | "Almost Out" | "Out of Stock";

  /** The name of the article */
  name: string;

  /** The calories of the article */
  calories: string;

  /** The price range of the article */
  price: string;

  /** The rating of the article */
  rating: number;

  /** The image of the article */
  image?: string;

  /** The size of the card */
  size?: "medium" | "large";

  /** The slug of the article */
  slug?: string;

  /** The slug of the cafe */
  cafeSlug?: string;
};

let cardDimensions = {
  medium: {
    width: 220,
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
}: ArticleCardProps) {
  return (
    <View>
      {size === "large" ? (
        <Pressable onPress={() => router.push(`/cafe/${cafeSlug}/${slug}`)}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            overflow: "hidden",
          }}
        >
          <View style={{ gap: 10, width: "50%" }}>
            <View style={{ gap: 8 }}>
              <Text style={TYPOGRAPHY.body.large.semiBold}>
                Croissant au chocolat
              </Text>
              <Text style={{ fontSize: 12 }}>
                Un ssssscroissant au chocolat d'exception, savourez sssleset
                laissez-vous ssstransporter en France. Bonne dégustationsss!
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={TYPOGRAPHY.body.small.bold}>350 CALORIES</Text>
              <Text style={TYPOGRAPHY.body.small.bold}>$2.00</Text>
            </View>
          </View>
          <View>
            <Image
              source={require("@/assets/images/placeholder/imagexs.png")}
              width={160}
              height={108}
              style={{ borderRadius: SPACING["sm"] }}
            ></Image>
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
        </Pressable>
      ) : (
        <Pressable
          onPress={() => router.push(`/cafe/${cafeSlug}/${slug}`)}
          style={{ width: cardDimensions[size].width }}
          testID="button"
        >
          <>
            <View>
              <Image
                source={image ? { uri: image } : cardDimensions[size].image}
                width={cardDimensions[size].width}
                height={cardDimensions[size].height}
                style={{ borderRadius: SPACING["sm"] }}
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
                <Text
                  style={[
                    TYPOGRAPHY.body.normal.semiBold,
                    styles.articleInfocalories,
                  ]}
                >
                  {calories}
                </Text>
              </View>
              <Text style={[TYPOGRAPHY.body.normal.semiBold]}>{price}</Text>
            </View>
          </>
        </Pressable>
      )}
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
});
