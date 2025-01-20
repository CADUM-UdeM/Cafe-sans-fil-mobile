import React, { useRef, useEffect } from 'react';
import IconButton from "@/components/common/Buttons/IconButton";
import ArticleCard from "@/components/common/Cards/ArticleCard";
import CafeCard from "@/components/common/Cards/CafeCard";
import CategoryCard from "@/components/common/Cards/CategoryCard";
import Tooltip from "@/components/common/Tooltip";
import CardScrollableLayout from "@/components/layouts/CardScrollableLayout";
import ScrollableLayout from "@/components/layouts/ScrollableLayout";
import COLORS from "@/constants/Colors";
import SPACING from "@/constants/Spacing";
import TYPOGRAPHY from "@/constants/Typography";
import { Link, router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  CakeSlice,
  Coffee,
  CupSoda,
  Heart,
  Locate,
  Sandwich,
  Search,
} from "lucide-react-native";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
} from "react-native";

export default function CafeScreen() {
  const { id } = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  }, [id]);

  return (
    <ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={[{ backgroundColor: COLORS.white }]}>
      <View>
        <Image
          style={styles.cafeBackgroundImage}
          source={require("@/assets/images/placeholder/image2xl.png")}
        />

        <View style={styles.cafeHeaderButtons}>
          <IconButton
            Icon={ArrowLeft}
            onPress={() => router.back()}
            style={styles.cafeHeaderIconButtons}
          />
          <View style={styles.cafeHeaderButtonsRight}>
            <IconButton Icon={Search} style={styles.cafeHeaderIconButtons} />
            <IconButton Icon={Locate} style={styles.cafeHeaderIconButtons} />
            <IconButton Icon={Heart} style={styles.cafeHeaderIconButtons} />
          </View>
        </View>

        <View style={styles.cafeHeaderOpenStatus}>
          <Tooltip label={"Ouvert"} showChevron={true} status="green" />
        </View>
      </View>

      <View>
        <Text style={[TYPOGRAPHY.heading.medium.bold, styles.cafeName]}>
          {id}
        </Text>
        <Text style={[TYPOGRAPHY.body.large.base, styles.cafeDescription]}>
          Accédez facilement à toutes les options de restauration du campus en
          un seul endroit.
        </Text>
      </View>
      <View
        style={{
          marginHorizontal: 16,
          marginTop: 40,
          backgroundColor: COLORS.lightGray,
          borderRadius: 10,
          paddingBlock: 28,
          paddingHorizontal: 28,
        }}
      >
        <Text
          style={[
            TYPOGRAPHY.body.large.semiBold,
            { color: COLORS.subtuleDark, textAlign: "center" },
          ]}
        >
          Appareils disponibles
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
            gap: 10,
          }}
        >
          <Tooltip label="Micro-ondes" showChevron={false} color="white" />
          <Tooltip label="Presse Panini" showChevron={false} color="white" />
          <Tooltip label="Machine à café" showChevron={false} color="white" />
          <Tooltip
            label="Voir plus"
            showChevron={false}
            color="black"
            textColor="white"
          />
        </View>
      </View>

      <CardScrollableLayout
        outerMarginTop={40}
        title="Tendances actuelles"
        titleMarginTop={SPACING["xl"]}
        scrollMarginTop={SPACING["xs"]}
        scrollMarginBottom={SPACING["md"]}
        scrollGap={SPACING["xl"]}
        dividerBottom
        dividerTop
      >
        <ArticleCard
          name="Croissant au chocolat"
          calories="350 CALORIES"
          price="$2.00"
          rating={4.8}
          status="In Stock"
          cafeSlug="Cafe Tore et Fraction"
          slug="1"
        />
        <ArticleCard
          name="Croissant au chocolat"
          calories="350 CALORIES"
          price="$2.00"
          rating={4.8}
          status="In Stock"
          slug="Cafe Tore et Fraction"
        />
        <ArticleCard
          name="Croissant au chocolat"
          calories="350 CALORIES"
          price="$2.00"
          rating={4.8}
          status="In Stock"
          slug="Cafe Tore et Fraction"
        />
        <ArticleCard
          name="Croissant au chocolat"
          calories="350 CALORIES"
          price="$2.00"
          rating={4.8}
          status="In Stock"
          slug="Cafe Tore et Fraction"
        />
        <ArticleCard
          name="Croissant au chocolat"
          calories="350 CALORIES"
          price="$2.00"
          rating={4.8}
          status="In Stock"
          slug="Cafe Tore et Fraction"
        />
      </CardScrollableLayout>

      <CardScrollableLayout
        title="Catégories"
        titleMarginTop={SPACING["xl"]}
        scrollMarginTop={SPACING["xs"]}
        scrollMarginBottom={SPACING["md"]}
        scrollGap={SPACING["lg"]}
        dividerBottom
      >
        <CategoryCard name="Boissons" icon={CupSoda} />
        <CategoryCard name="Snacks" icon={Sandwich} />
        <CategoryCard name="Caffé" icon={Coffee} />
        <CategoryCard name="Patisserie" icon={CakeSlice} />
      </CardScrollableLayout>

      <CardScrollableLayout
        title="Boissons"
        titleMarginTop={SPACING["xl"]}
        scrollMarginTop={SPACING["xs"]}
        scrollMarginBottom={SPACING["md"]}
        scrollGap={SPACING["xl"]}
        dividerBottom
      >
        <ArticleCard
          name="Croissant au chocolat"
          calories="350 CALORIES"
          price="$2.00"
          rating={4.8}
          status="In Stock"
          slug="Cafe Tore et Fraction"
        />
        <ArticleCard
          name="Croissant au chocolat"
          calories="350 CALORIES"
          price="$2.00"
          rating={4.8}
          status="In Stock"
          slug="Cafe Tore et Fraction"
        />
        <ArticleCard
          name="Croissant au chocolat"
          calories="350 CALORIES"
          price="$2.00"
          rating={4.8}
          status="In Stock"
          slug="Cafe Tore et Fraction"
        />
        <ArticleCard
          name="Croissant au chocolat"
          calories="350 CALORIES"
          price="$2.00"
          rating={4.8}
          status="In Stock"
          slug="Cafe Tore et Fraction"
        />
        <ArticleCard
          name="Croissant au chocolat"
          calories="350 CALORIES"
          price="$2.00"
          rating={4.8}
          status="In Stock"
          slug="Cafe Tore et Fraction"
        />
      </CardScrollableLayout>

      <CardScrollableLayout
        title="Snacks"
        titleMarginTop={SPACING["xl"]}
        scrollMarginTop={SPACING["xs"]}
        scrollMarginBottom={SPACING["md"]}
        scrollGap={SPACING["xl"]}
        dividerBottom
      >
        <ArticleCard
          name="Croissant au chocolat"
          calories="350 CALORIES"
          price="$2.00"
          rating={4.8}
          status="In Stock"
          slug="Cafe Tore et Fraction"
        />
        <ArticleCard
          name="Croissant au chocolat"
          calories="350 CALORIES"
          price="$2.00"
          rating={4.8}
          status="In Stock"
          slug="Cafe Tore et Fraction"
        />
        <ArticleCard
          name="Croissant au chocolat"
          calories="350 CALORIES"
          price="$2.00"
          rating={4.8}
          status="In Stock"
          slug="Cafe Tore et Fraction"
        />
        <ArticleCard
          name="Croissant au chocolat"
          calories="350 CALORIES"
          price="$2.00"
          rating={4.8}
          status="In Stock"
          slug="Cafe Tore et Fraction"
        />
        <ArticleCard
          name="Croissant au chocolat"
          calories="350 CALORIES"
          price="$2.00"
          rating={4.8}
          status="In Stock"
          slug="Cafe Tore et Fraction"
        />
      </CardScrollableLayout>

      <CardScrollableLayout
        title="Patisserie"
        titleMarginTop={SPACING["xl"]}
        scrollMarginTop={SPACING["xs"]}
        scrollMarginBottom={SPACING["md"]}
        scrollGap={SPACING["xl"]}
        dividerBottom
      >
        <ArticleCard
          name="Croissant au chocolat"
          calories="350 CALORIES"
          price="$2.00"
          rating={4.8}
          status="In Stock"
          slug="Cafe Tore et Fraction"
        />
        <ArticleCard
          name="Croissant au chocolat"
          calories="350 CALORIES"
          price="$2.00"
          rating={4.8}
          status="In Stock"
          slug="Cafe Tore et Fraction"
        />
        <ArticleCard
          name="Croissant au chocolat"
          calories="350 CALORIES"
          price="$2.00"
          rating={4.8}
          status="In Stock"
          slug="Cafe Tore et Fraction"
        />
        <ArticleCard
          name="Croissant au chocolat"
          calories="350 CALORIES"
          price="$2.00"
          rating={4.8}
          status="In Stock"
          slug="Cafe Tore et Fraction"
        />
        <ArticleCard
          name="Croissant au chocolat"
          calories="350 CALORIES"
          price="$2.00"
          rating={4.8}
          status="In Stock"
          slug="Cafe Tore et Fraction"
        />
      </CardScrollableLayout>

      <View
        style={{
          borderTopWidth: 1,
          borderBottomWidth: 2,
          paddingHorizontal: 16,
          paddingVertical: 20,
          borderBlockColor: COLORS.lightGray,
        }}
      >
        <Text style={TYPOGRAPHY.heading.small.bold}>Tous les articles</Text>
      </View>
      <View style={{ paddingHorizontal: 16, paddingBlock: 28, gap: 32 }}>
        <ArticleCard
          status={"In Stock"}
          name={""}
          calories={""}
          price={""}
          rating={0}
          size="large"
          cafeSlug="Cafe Tore et Fraction"
          slug="1"
        ></ArticleCard>
        <ArticleCard
          status={"In Stock"}
          name={""}
          calories={""}
          price={""}
          rating={0}
          size="large"
        ></ArticleCard>
        <ArticleCard
          status={"In Stock"}
          name={""}
          calories={""}
          price={""}
          rating={0}
          size="large"
        ></ArticleCard>
        <ArticleCard
          status={"In Stock"}
          name={""}
          calories={""}
          price={""}
          rating={0}
          size="large"
        ></ArticleCard>
        <ArticleCard
          status={"In Stock"}
          name={""}
          calories={""}
          price={""}
          rating={0}
          size="large"
        ></ArticleCard>
        <ArticleCard
          status={"In Stock"}
          name={""}
          calories={""}
          price={""}
          rating={0}
          size="large"
        ></ArticleCard>
        <ArticleCard
          status={"In Stock"}
          name={""}
          calories={""}
          price={""}
          rating={0}
          size="large"
        ></ArticleCard>
        <ArticleCard
          status={"In Stock"}
          name={""}
          calories={""}
          price={""}
          rating={0}
          size="large"
        ></ArticleCard>
        <ArticleCard
          status={"In Stock"}
          name={""}
          calories={""}
          price={""}
          rating={0}
          size="large"
        ></ArticleCard>
        <ArticleCard
          status={"In Stock"}
          name={""}
          calories={""}
          price={""}
          rating={0}
          size="large"
        ></ArticleCard>
        <ArticleCard
          status={"In Stock"}
          name={""}
          calories={""}
          price={""}
          rating={0}
          size="large"
        ></ArticleCard>
      </View>

      <CardScrollableLayout
        title="Autres cafés similaires"
        titleMarginTop={SPACING["xl"]}
        scrollMarginTop={SPACING["xs"]}
        scrollMarginBottom={SPACING["md"]}
        scrollGap={SPACING["md"]}
        dividerTop
      >
        <CafeCard
          name="Jean Brillant"
          location="Pavillon Claire McNicole"
          priceRange="$$"
          rating={4.8}
          status="open"
          slug="Cafe Tore et Fraction"
        />
        <CafeCard
          name="Jean Brillant"
          location="Pavillon Claire McNicole"
          priceRange="$$"
          rating={4.8}
          status="closing soon"
        />
        <CafeCard
          name="Jean Brillant"
          location="Pavillon Claire McNicole"
          priceRange="$$"
          rating={4.8}
          status="open"
        />
        <CafeCard
          name="Jean Brillant"
          location="Pavillon Claire McNicole"
          priceRange="$$"
          rating={4.8}
          status="closed"
        />
        <CafeCard
          name="Jean Brillant"
          location="Pavillon Claire McNicole"
          priceRange="$$"
          rating={4.8}
          status="open"
        />
      </CardScrollableLayout>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cafeBackgroundImage: {
    borderBottomLeftRadius: SPACING["7xl"],
    borderBottomRightRadius: SPACING["7xl"],
  },
  cafeHeaderButtons: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
    marginTop: SPACING["9xl"],
  },
  cafeHeaderButtonsRight: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  cafeHeaderIconButtons: {
    backgroundColor: "white",
  },
  cafeHeaderOpenStatus: {
    position: "absolute",
    paddingHorizontal: 16,
    bottom: 0,
    marginBottom: 26,
    alignSelf: "center",
  },
  cafeName: {
    marginHorizontal: SPACING["md"],
    marginTop: SPACING["2xl"],
    textAlign: "center",
  },
  cafeDescription: {
    marginHorizontal: SPACING["md"],
    lineHeight: 21,
    marginTop: SPACING["xs"],
    textAlign: "center",
  },
});
