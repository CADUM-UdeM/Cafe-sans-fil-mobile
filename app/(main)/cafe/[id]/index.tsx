import React, { useRef, useEffect, useState } from 'react';
import IconButton from "@/components/common/Buttons/IconButton";
import ArticleCard from "@/components/common/Cards/ArticleCard";
import CafeCard from "@/components/common/Cards/CafeCard";
import DayCard from "@/components/common/Cards/DayCard";
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
  FlatList,
} from "react-native";
import { 
  deleteSecurely,
  fetchSecurely, 
  saveFav 
} from '@/scripts/storage';
import { createPathConfigForStaticNavigation } from '@react-navigation/native';
import { sampleFavoris } from '@/constants/type_samples';

export default function CafeScreen() {
  var favCafe : Favoris[] = [];
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);

  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [favorited, setFavorited] = useState(false);

  // handle the saving and deletion of the cafe
  useEffect(() => {
    if (!cafe || !id) return; // Ensure cafe is fully loaded before proceeding
  
    const handleFavorites = async () => {
      try {
        if (favorited) {
          let favObj = { ...sampleFavoris }; // Clone instead of modifying directly
          favObj.cafe_id = cafe.cafe_id;
          favObj.image_url = cafe.image_url;
          favObj.faculty = cafe.faculty;
          favObj.is_open = cafe.is_open;
          favObj.location = cafe.location;
          favObj.name = cafe.name;
          favObj.slug = cafe.slug;
          favObj.status_message = cafe.status_message;
  
          await saveFav(favObj);
          console.log("Saved cafe:", id);
        } else {
          let fetchedData = await fetchSecurely("favorites"); // Use consistent key
          if (fetchedData) {
            await deleteSecurely("favorites"); // Delete only if it exists
            console.log("Deleted cafe:", id);
          }
        }
      } catch (error) {
        console.error("Error handling favorites:", error);
      }
    };
  
    handleFavorites();
  }, [favorited, cafe, id]);

  // fetch cafe data
  useEffect(() => {
    setIsLoading(true);
    const fetchCafe = async () => {
      try {
        const response = await fetch(`https://cafesansfil-api-r0kj.onrender.com/api/cafes/${id}`);
        const json = await response.json();
        setCafe(json);
  
        let storedFavorites = await fetchSecurely("favorites") || [];
        if (storedFavorites.some((fav : Favoris) => fav.cafe_id === id)) {
          setFavorited(true);
        } else {
          setFavorited(false);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCafe();
  }, [id]);
  

  return (
    <SafeAreaView>
    <ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={{backgroundColor: "#f4f4f4"}} >
      <View>
        <Image
          style={styles.cafeBackgroundImage}
          source={isLoading ? require("@/assets/images/placeholder/image2xl.png") : {uri: cafe?.image_url}}
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
            <IconButton Icon={Heart} style={[favorited? styles.cafeFavoritedButton : styles.cafeHeaderIconButtons]} 
              onPress={() => {
                setFavorited(!favorited);
              }} />
          </View>
        </View>

        <View style={styles.cafeHeaderOpenStatus}>
          <Tooltip label={"Ouvert"} showChevron={true} status={cafe?.is_open ? "green" : "red"} />
        </View>
      </View>

      <View>
        <Text style={[TYPOGRAPHY.heading.medium.bold, styles.cafeName]}>
          {isLoading? "..." : cafe?.name}
        </Text>
        <Text style={[TYPOGRAPHY.body.large.base, styles.cafeDescription]}>
          {isLoading? "..." : cafe?.description}
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
          Horaires
        </Text>
        <FlatList data={cafe?.opening_hours} horizontal
          keyExtractor={(item, index) => `${item.day}-${index}`} // Add a keyExtractor to avoid warnings
          renderItem={({ item }) => (
            <DayCard day={item.day} blocks={item.blocks} />
          )}
        />
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
        <FlatList data={cafe?.menu_items} horizontal scrollEnabled={false} 
          renderItem={({item}) => <ArticleCard 
                                    name={item.name} 
                                    price={"$" + item.price} 
                                    status={item.in_stock? "In Stock" : "Out of Stock"}
                                    cafeSlug={item.slug}
                                    rating={4.8}
                                    calories="350 CALORIES"
                                    image={item.image_url}
                                    />} 
        ItemSeparatorComponent={() => <View style={{ width: SPACING["md"] }} />} // padding
        />
      </CardScrollableLayout>

      {/* <CardScrollableLayout
        title="Catégories"
        titleMarginTop={SPACING["xl"]}
        scrollMarginTop={SPACING["xs"]}
        scrollMarginBottom={SPACING["md"]}
        scrollGap={SPACING["lg"]}
        dividerBottom
      > */}
        <FlatList style={{backgroundColor:COLORS.white, padding:2 }} 
          data={cafe?.menu_items ? [...new Set(cafe?.menu_items.map(item => item.category))].sort() : []}
          horizontal renderItem={({item}) => <CategoryCard name={item} icon={CupSoda}/>}
          ItemSeparatorComponent={() => <View style={{width:10}}></View>}
        />
        
      {/* </CardScrollableLayout> */}

      <CardScrollableLayout
        title="Boissons"
        titleMarginTop={SPACING["xl"]}
        scrollMarginTop={SPACING["xs"]}
        scrollMarginBottom={SPACING["md"]}
        scrollGap={SPACING["xl"]}
        dividerBottom
      >
        <FlatList data={cafe?.menu_items? cafe.menu_items.filter((item) => item.category === "Boissons chaudes") : []} // on ne prend que les boissons chaudes
          horizontal scrollEnabled={false} 
          renderItem={({item}) => <ArticleCard 
                                    name={item.name} 
                                    price={"$" + item.price} 
                                    status={item.in_stock? "In Stock" : "Out of Stock"}
                                    cafeSlug={item.slug}
                                    rating={4.8}
                                    calories="350 CALORIES"
                                    image={item.image_url}
                                    />}
        ItemSeparatorComponent={() => <View style={{ width: SPACING["md"] }} />} // padding
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
      <View style={{ paddingHorizontal: 16, paddingBlock: 28, gap: 32 , alignItems: 'center'}}>
      <FlatList data={cafe?.menu_items} scrollEnabled={false} 
          renderItem={({item}) => <ArticleCard 
                                    name={item.name} 
                                    price={"$" + item.price} 
                                    status={item.in_stock? "In Stock" : "Out of Stock"}
                                    cafeSlug={item.slug}
                                    rating={4.8}
                                    calories="350 CALORIES"
                                    image={item.image_url}
                                    />} 
        ItemSeparatorComponent={() => <View style={{ marginBottom: SPACING["md"] }} />} // padding
        />
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
          slug="Cafe Tore et Fraction"
          name="Jean Brillant"
          location="Pavillon Claire McNicole"
          priceRange="$$"
          rating={4.8}
          status="open"
        />
      </CardScrollableLayout>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cafeBackgroundImage: {
    width: "100%",  // Fill width
    height: 250,    // Fixed height, adjust as needed
    borderBottomLeftRadius: SPACING["7xl"],
    borderBottomRightRadius: SPACING["7xl"],
    borderTopLeftRadius: SPACING["7xl"],
    borderTopRightRadius: SPACING["7xl"],
    
  },
  cafeHeaderButtons: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 100,
    paddingHorizontal: 16,
    marginTop: SPACING["sm"],
  },
  cafeHeaderButtonsRight: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  cafeHeaderIconButtons: {
    backgroundColor: "white",
  },
  cafeFavoritedButton:{
    backgroundColor: "pink",
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
