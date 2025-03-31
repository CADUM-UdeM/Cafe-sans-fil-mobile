
import React, { useEffect, useState } from 'react'

import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import HeaderLayout from "@/components/layouts/HeaderLayout";
import { deleteSecurely, fetchSync, saveSync } from '@/script/storage';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { deleteSecurely, fetchSecurely } from '@/scripts/storage';
import { fetchPannier } from '@/scripts/pannier';
import { router } from 'expo-router';

const Panier = () => {

  let panierID = "12345";
  const [items, setItems] = useState(new Array());

  useEffect(() => {
      const fetchPanierItems = () =>{
        try{
          let currPanier = fetchSync("12345");
          console.log(currPanier);
          if (currPanier){
            setItems(currPanier);
          }
        }catch(error){

        }
      }
      fetchPanierItems();
    }, []);

  const [cart, setCart] = useState();
  const [reload, setReload] = useState(false);
  
  useEffect(() => {
    let savedCart = async () => {
      let ret = await fetchSecurely('pannier');
      setCart(ret);
      console.log(ret);
    }
    savedCart();
  }, [reload]);

  // Fonction pour calculer le total du panier
  function calculateTotal() {
    let total = 0;
    if(!items){
      return total;
    }
    for(const item of items){
      let itemPrice = Number(fetchSync(item.id).price);
      total = total + itemPrice;
    }
    return total;
  }

  // Fonction pour augmenter la quantité d'un item
  const increaseQuantity = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Fonction pour diminuer la quantité d'un item
  const decreaseQuantity = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  function deletePanierItem(id){
    try{
      deleteSecurely(id);
    }catch(error){

    }

    //find idx of id
    let idx = -1;
    for(let i = 0; i<items.length; i++){
      if(id == items[i].id){
        idx=i
      }
    }
    if(idx!=-1){
      setItems(items.splice(idx,1));
    }
    saveSync(panierID,items);
  }

  // Fonction pour supprimer un item du panier
  const removeItem = (id) => {
    Alert.alert(
      'Supprimer l’item',
      'Êtes-vous sûr de vouloir supprimer cet article du panier ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          onPress: () => deletePanierItem(id),
        },
      ]
    );
  };
  function panierItemToItem(panierItem){
    return fetchSync(panierItem.id);
  }

  function panierItemDisplay(panierItem){
    let item = panierItemToItem(panierItem);
    return(
      <View style={styles.itemContainer}>
                <Image source={{ uri: item.image_url }} style={styles.itemImage} />
                <View style={styles.textContainer}>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  <Text style={styles.itemPrice}>{Number(item.price).toFixed(2)} $</Text>
                  <Text style={styles.itemQuantity}>
                    Quantité: {panierItem.quantity}
                  </Text>
                </View>
                <View style={styles.actionContainer}>
                  <TouchableOpacity onPress={() => increaseQuantity(panierItem.id)}>
                    <Feather name="plus" size={20} color="#000" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => decreaseQuantity(panierItem.id)}>
                    <Feather name="minus" size={20} color="#000" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeItem(panierItem.id)}>
                    <Feather name="trash" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
    )
  }

  function refreshPanier(){
    let currPanier = fetchSync(panierID);
    if(currPanier&&currPanier.length>0){
      setItems(currPanier);
    }
  }

  return (<>
    <HeaderLayout />
    <View style={styles.container}>
      
      <Text style={styles.title}>Panier des items sélectionnés</Text>

      {items.length>0 ? (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              panierItemDisplay(item)
            )}
          />

          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: {calculateTotal().toFixed(2)} $</Text>
            <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.checkoutButtonText}>Passer la commande</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.totalContainer}>
            <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.checkoutButtonText} onPress={()=>refreshPanier()}>Refresh panier</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (<>
        <Text style={styles.emptyCartText}>Votre panier est vide.</Text>
        <View style={styles.totalContainer}>
            <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.checkoutButtonText} onPress={()=>refreshPanier()}>Refresh panier</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View></>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
    color: '#555',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#555',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  checkoutButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginTop: 32,
  },
});

export default Panier;
