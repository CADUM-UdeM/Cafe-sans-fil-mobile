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
  Facebook,
  Instagram,
  Twitter,
  HelpCircle,
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
  Linking,
} from "react-native";
import { addFavorites } from '../../favoris';


export default function CafeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);

  const [cafe, setCafe] = useState({ social_media:{} }); // set social media as empty array pour ne pas produire d'erreur dans l'utlisation de map après

  // Have an openable link
  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
  };

  // function qui donne la plateform et le lien
  // const getSocialMediaLinks = (socialMediaObjet) => {
  //   if (!socialMediaObjet) return [];

  //   return Object.entries(socialMediaObjet).map(([plateform, link]) => ({
  //     name: plateform,
  //     link: link,
  //   }) );
  // };
  

  // Getting icons depending on platform names
  const getIcon = (platform) => {
    const icons = {
      x: Twitter,
      instagram: Instagram,
      facebook: Facebook,
    };
    return icons[platform] || HelpCircle;
  }; 

  // fetch cafe data
  useEffect(() => {
    setIsLoading(true);
    
    const fetchCafe = async () => {
        try {
            const response = await fetch(`https://cafesansfil-api-r0kj.onrender.com/api/cafes/${id}`);
            const json = await response.json();
            console.log("Social media: ", json.social_media)
            console.log(json.opening_hours);
            setCafe(json);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

      fetchCafe();
  }, [id]);

  function getCafeCats(menuItemList){
    let menuCatSet = new Set();
      for(let i = 0; i<menuItemList.length; i++){
        menuCatSet.add(menuItemList[i].category);
      }
      return Array.from(menuCatSet);
  }

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
          source={isLoading ? require("@/assets/images/placeholder/image2xl.png") : {uri: cafe.banner_url}}
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
            <IconButton Icon={Heart} style={styles.cafeHeaderIconButtons} onPress={() => addFavorites(cafe)} />
          </View>
        </View>

        <View style={styles.cafeHeaderOpenStatus}>
          <Tooltip label={"Ouvert"} showChevron={true} status={cafe.is_open ? "green" : "red"} />
        </View>
      </View>

      <View>
        <Text style={[TYPOGRAPHY.heading.medium.bold, styles.cafeName]}>
          {isLoading? "..." : cafe.name}
        </Text>
        <Text style={[TYPOGRAPHY.body.large.base, styles.cafeDescription]}>
          {isLoading? "..." : cafe.description}
        </Text>

        {/*Média sociaux*/}
          <View style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
            gap: 10,}}>

              {// convertie le json {plateform: link} à un tableau [plateform, link]
              cafe.social_media && Object.entries(cafe.social_media).map(([plateform, link]) => ( link ? (
                <Tooltip
                label={plateform.charAt(0).toUpperCase() + plateform.slice(1)}
                onPress={() => openLink(link)}
                Icon={getIcon(plateform)}
                showChevron={false} color='white'/>
              ) : null ))}
          </View>

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
        <FlatList data={cafe.opening_hours} horizontal
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
        <FlatList data={cafe.menu_items} horizontal scrollEnabled={false} 
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
          data={cafe.menu_items ? [...new Set(cafe.menu_items.map(item => item.category))].sort() : []}
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
        <FlatList data={cafe.menu_items ? cafe.menu_items.filter((item) => item.category === "Boissons chaudes") : []} // on ne prend que les boissons chaudes
          horizontal scrollEnabled={false} 
          renderItem={({item}) => <ArticleCard 
                                    name={item.name} 
                                    price={"$" + item.price} 
                                    status={item.in_stock? "In Stock" : "Out of Stock"}
                                    cafeSlug={cafe.slug}
                                    slug={item.slug}
                                    rating={4.8}
                                    calories="350 CALORIES"
                                    image={item.image_url}
                                    />}
        ItemSeparatorComponent={() => <View style={{ width: SPACING["md"] }} />} // padding
        />
      </CardScrollableLayout>

      <FlatList
        data={cafe.menu_items ? getCafeCats(cafe.menu_items):[]}
        renderItem={({item})=>
        <CardScrollableLayout
        title={item}
        titleMarginTop={SPACING["xl"]}
        scrollMarginTop={SPACING["xs"]}
        scrollMarginBottom={SPACING["md"]}
        scrollGap={SPACING["xl"]}
        dividerBottom
        >
          <FlatList data={cafe.menu_items ? cafe.menu_items.filter((menuItem) => menuItem.category== item) : []} // on ne prend que les boissons chaudes
          horizontal scrollEnabled={false} 
          renderItem={({item}) => <ArticleCard 
                                    name={item.name} 
                                    price={"$" + item.price} 
                                    status={item.in_stock? "In Stock" : "Out of Stock"}
                                    cafeSlug={cafe.slug}
                                    slug={item.slug}
                                    rating={4.8}
                                    calories="350 CALORIES"
                                    image={item.image_url}
                                    />}
          ItemSeparatorComponent={() => <View style={{ width: SPACING["md"] }} />} // padding
          />
        </CardScrollableLayout>}
        keyExtractor={item => item}
      />

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
      <FlatList data={cafe.menu_items} scrollEnabled={false} 
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
