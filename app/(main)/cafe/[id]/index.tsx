import React, { useRef, useEffect, useState } from 'react';
import IconButton from "@/components/common/Buttons/IconButton";
import ArticleCard from "@/components/common/Cards/ArticleCard";
import CafeCard from "@/components/common/Cards/CafeCard";
import DayCard from "@/components/common/Cards/DayCard";
import CategoryCard from "@/components/common/Cards/CategoryCard";
import Tooltip from "@/components/common/Tooltip";
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
  DollarSign,
  CreditCard,
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
  ActivityIndicator
} from "react-native";
import { Cafe, Category, Item } from "@/constants/types/GET_cafe";

export default function CafeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  // café id
  const { id } = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);

  // data for the café returned by the API
  // const [cafe, setCafe] = useState<Cafe | any>({ social_media:{} }); // set social media as empty array pour ne pas produire d'erreur dans l'utlisation de map après
  
  // list of items to display
  const [itemList, setItemList] = useState<Item[]>();

  const [cafe, setCafe] = useState<Cafe>(); // set social media as empty object


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
  const getIcon = (platform : any) => {
    const icons = {
      x: Twitter,
      instagram: Instagram,
      facebook: Facebook,
    };
    return icons[platform] || HelpCircle;
  }; 

  // fetch cafe data
  useEffect(() => {
    // api data fetching
    setIsLoading(true);

    const fetchCafe = async () => {

      try {
        const response = await fetch(
          `https://cafesansfil-api-r0kj.onrender.com/api/cafes/${id}`
        );
        const json = await response.json();
        console.log("Social media: ", json.social_media);
        setCafe(json);

        // After setting the cafe data, filter the menu items
        // Directly use 'json' instead of 'cafe'
        const filteredItems = filterMenu("", json.menu.categories);
        setItemList(filteredItems);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCafe();
  }, [id]);
  
  const [activeFilter, setActiveFilter] = useState("Tous");

  // filter the menu based on argument filter
function filterMenu(filter?: string, menuData?: any): Item[] {
  let menu = menuData ? menuData : ((cafe && cafe.menu) ? cafe.menu.categories : []);
  let itemList: Item[] = [];

  // if no filter --> all items to be displayed
  if (filter) {
    setActiveFilter(filter)
    for (let i = 0; i < menu.length; i++) {
      // search for the filter
      if (menu[i].name == filter) {
        itemList = menu[i].items;
        break;
      }
    }
  } else {
    setActiveFilter("Tous");
    // loop through each individual category...
    for (let i = 0; i < menu.length; i++) {
      let itemsInCat: Item[] = menu[i].items;
      // loop through each item for that category...
      for (let j = 0; j < itemsInCat.length; j++) {
        // push the item to the list
        let item = itemsInCat[j];
        itemList.push(item);
      }
    }
  }
  return itemList;
}
  // Tableau des média sociaux des cafés : convertie le json {plateform: link} à un tableau [plateform, link]
  const socialMediaTab = cafe?.social_media ? Object.entries(cafe.social_media).map(([plateform, link]) =>
    ({plateform, link})) : [] ;

  // Méthode pour traduire en français
  const translationPaymentMethod = (method) => {
    const methodTranslated = {
      CREDIT : "Crédit",
      DEBIT : "Débit",
      CASH : "Cash",
    };
    return methodTranslated[method] || method;
  };

  // Tableau? des détails de payements
  const paymentDetails = cafe?.payment_details ? cafe.payment_details.map(({method, minimum}) => ({
    method : translationPaymentMethod(method), minimum })) : [];

console.log(paymentDetails);
  

  



  if(isLoading){
    return(
      <ActivityIndicator size={'large'}
      style={{backgroundColor: COLORS.white,
              flex: 1,
              alignContent: 'center',
              justifyContent: 'center'
      }} />
    )
  }

  return (

    <SafeAreaView style={{}}>
      
    <ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={{backgroundColor: "#f4f4f4"}} >
      <View>
        <Image
          style={styles.cafeBackgroundImage}
          source={isLoading ? require("@/assets/images/placeholder/image2xl.png") : {uri: cafe?.banner_url}}
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

        {/*Média sociaux*/}
          <View style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
            gap: 10,}}>

              {socialMediaTab.map(({plateform, link}) => ( link ? (
                <Tooltip
                label={plateform.charAt(0).toUpperCase() + plateform.slice(1)}
                onPress={() => openLink(link)}
                Icon={getIcon(plateform)}
                showChevron={false} color='white'/>
              ) : null ))}
          </View>

        {/* Section paiement */}
          <Text
            style={[
              TYPOGRAPHY.body.large.semiBold,
              { color: COLORS.subtuleDark, textAlign: "center" },
              { marginTop: 20},
            ]}
          >
            Paiement
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
          {paymentDetails.map(({method, minimum}) => ( minimum ? (
            <View key={method}>
              <Tooltip
                label={`${method} MIN : ${minimum}`}
                showChevron={true}
                color="white"
                Icon={CreditCard}
                /> 
            </View>
                ) : 
                (
              <View key={method}>
                <Tooltip
                  label={method}
                  showChevron={false}
                  color="white"
                  Icon={DollarSign}/>
              </View>    
              )
            //<Text>{method} MIN: {minimum}</Text> ) : <Text>{method}</Text> */ }
          ))}
        </View>

      </View>
      <View
        style={{
          marginHorizontal: 16,
          marginTop: 20,
          backgroundColor: COLORS.lightGray,
          paddingBlock: 28,
        }}
      >

        {/* Horaires du café*/}
        <Text
          style={[
            TYPOGRAPHY.heading.medium.bold,
            { color: "black", textAlign: "center", marginBottom:8},
          ]}
        >
          Horaires
        </Text>
        <FlatList data={cafe?.opening_hours} horizontal
          keyExtractor={item => item.day}
          ItemSeparatorComponent={(item) => 
            <View key={item.day}
              style={{margin:10, borderColor: "black", borderWidth: 0.5}}></View>
          }
          renderItem={({ item }) => (
              <DayCard day={item.day} blocks={item.blocks} />
          )}
          style={{borderColor: "black", borderWidth: 0.25, borderRadius: 10, padding: SPACING["sm"]}}
        />
      </View>

      {/* Menu */}
      <Text 
        style={{
          marginVertical: SPACING["xl"], 
          marginHorizontal: SPACING["md"], 
          alignSelf: 'center',
          ...TYPOGRAPHY.heading.large.bold
        }}>Menu
        </Text>


      {/* Catégories */}
      <View>
          <Text 
            style={{
              marginHorizontal: SPACING["md"], 
              ...TYPOGRAPHY.heading.small.bold
            }}>
            Filtres 
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignContent:'center', justifyContent: 'center'}}>
            {cafe? [
              ...cafe.menu.categories.map((item : Category) => (
                <View 
                  key={item.id} 
                  style={{marginRight: SPACING["sm"], marginTop: SPACING["sm"]}}
                >
                  <Tooltip
                    key={item.id}
                    label={item.name}
                    showChevron={false}
                    color="white"
                    textColor="black"
                    status={activeFilter == item.name ? "black" : "white"}
                    onPress={() => setItemList(filterMenu(item.name))}
                  />
                </View>
              )),
              <TouchableOpacity 
                  key={"all"} 
                  style={{marginRight: SPACING["sm"], marginTop: SPACING["sm"]}}
                >
                  <Tooltip
                    label={"Tous"}
                    showChevron={false}
                    color="white"
                    textColor="black"
                    status={activeFilter == "Tous" ? "black" : "white"}
                    onPress={() => setItemList(filterMenu())}
                  />
                </TouchableOpacity>
            ]: []}
          </View>

        </View>

      {/* Menu */}
      <FlatList 
      data={itemList? itemList : []}  
      keyExtractor={item => item.id}
      renderItem={({item}) => <ArticleCard
                                cafeSlug={cafe?.slug}
                                slug={item.id}
                                name={item.name} 
                                price={"$" + item.price} 
                                status={item.in_stock? "In Stock" : "Out of Stock"}
                                image={item.image_url}
                                style={{alignItems: 'center'}}
                              />
                              }
      ItemSeparatorComponent={() => <View style={{ marginTop: SPACING["md"]}} />} // padding
      scrollEnabled={false}
      style={{marginTop: SPACING['md']}}
      />      

      {/* Cafés similaires */}
      <Text 
        style={{
          marginVertical: SPACING["xl"], 
          marginHorizontal: SPACING["md"], 
          ...TYPOGRAPHY.heading.small.bold
        }}>
          Autres cafés similaires
        </Text>

        {/* TODO: IMPLÉMENTER LA FLATLIST */}

    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cafeBackgroundImage: {
    width: "100%",  // Fill width
    height: 250,    // Fixed height, adjust as needed
  },
  cafeHeaderButtons: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
    marginTop: SPACING["sm"],
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
