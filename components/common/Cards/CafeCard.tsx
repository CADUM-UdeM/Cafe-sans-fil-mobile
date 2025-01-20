import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Circle } from "lucide-react-native";
import { router } from "expo-router";


import TYPOGRAPHY from "@/constants/Typography";
import COLORS from "@/constants/Colors";
import SPACING from "@/constants/Spacing";

type CafeCardProps = {
  status: "open" | "closing soon" | "closed";

  /** The name of the cafe */
  name: string;

  /** The location of the cafe */
  location: string;

  /** The price range of the cafe */
  priceRange: "$" | "$$" | "$$$";

  /** The rating of the cafe */
  rating: number;

  /** The image of the cafe */
  image?: string;

  /** The size of the card */
  size?: "medium" | "large";

  /** The slug of the cafe */
  slug?: string;
};

let cardDimensions = {
  medium: {
    width: 318,
    height: 180,
    image: require("@/assets/images/placeholder/imagemd.png"),
  },
  large: {
    width: 361,
    height: 210,
    image: require("@/assets/images/placeholder/imagexl.png"),
  },
};

/**
 * ## CafeCard Component
 *
 * A reusable card component that displays information about a cafe, including its name, location,
 * price range, rating, and status. The card also includes an image and supports navigation to the
 * cafe's details page when pressed.
 *
 * ### Example Usage
 *
 * ```tsx
 * <CafeCard
 *   status="open"
 *   name="Cozy Coffee"
 *   location="123 Coffee Lane"
 *   priceRange="$$"
 *   rating={4.5}
 *   image="https://example.com/image.jpg"
 *   size="large"
 *   slug="cozy-coffee"
 * />
 * ```
 *
 * @param {CafeCardProps} props - The props for the CafeCard component.
 */
export default function CafeCard({
  status,
  name,
  location,
  priceRange,
  rating,
  image,
  size = "medium",
  slug = "INVALID_SLUG",
}: CafeCardProps) {
  return (
    <Pressable
      onPress={() => router.push(`/cafe/${slug}`)}
      style={{ width: cardDimensions[size].width }}
      testID="button"
    >
      <View>
        <Image
          source={image ? { uri: image } : cardDimensions[size].image}
          width={cardDimensions[size].width}
          height={cardDimensions[size].height}
          style={{ borderRadius: SPACING["sm"] }}
          testID="image"
        />
        <Text
          style={[
            TYPOGRAPHY.body.small.bold,
            styles.priceRangeIcon,
            styles.rating,
          ]}
          testID="icon-button"
        >
          {rating}
        </Text>
      </View>
      <View style={styles.caption}>
        <View style={styles.cafeInfo}>
          <View style={styles.cafeInfoHeader}>
            <Text style={[TYPOGRAPHY.body.large.semiBold]}>{name}</Text>
            <Circle
              width={12}
              height={12}
              strokeWidth={1}
              color={
                status === "open"
                  ? COLORS.status.green
                  : status === "closing soon"
                  ? COLORS.status.orange
                  : COLORS.status.red
              }
              fill={
                status === "open"
                  ? COLORS.status.green
                  : status === "closing soon"
                  ? COLORS.status.orange
                  : COLORS.status.red
              }
              testID="tooltip-icon"
            />
          </View>
          <Text
            style={[TYPOGRAPHY.body.normal.semiBold, styles.cafeInfoLocation]}
          >
            {location}
          </Text>
        </View>
        <Text
          style={[TYPOGRAPHY.body.normal.base, styles.priceRangeIcon]}
          testID="icon-button"
        >
          {priceRange}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  caption: {
    justifyContent: "space-between",
    marginTop: SPACING["lg"],
    flexDirection: "row",
    alignItems: "center",
  },
  cafeInfo: {
    gap: SPACING["xxs"],
  },
  cafeInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING["xs"],
  },
  cafeInfoLocation: {
    color: COLORS.black45,
  },
  priceRangeIcon: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs,
    justifyContent: "center",
    borderRadius: 500,
  },
  rating: {
    backgroundColor: COLORS.white, // FIXME: Remove this line later
    position: "absolute",
    right: SPACING.sm,
    top: SPACING.sm,
  },
});
