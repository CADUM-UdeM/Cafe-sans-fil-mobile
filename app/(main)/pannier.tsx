import React, { useState } from 'react'
import ScrollableLayout from '@/components/layouts/ScrollableLayout'
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
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const Panier = () => {
  const [items, setItems] = useState([
    {
      id: '1',
      name: 'Café Latte',
      price: 3.5,
      quantity: 1,
      image: 'https://via.placeholder.com/80',
    },
    {
      id: '2',
      name: 'Croissant',
      price: 2.0,
      quantity: 2,
      image: 'https://via.placeholder.com/80',
    },
  ]);

  // Fonction pour calculer le total du panier
  const calculateTotal = () =>
    items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

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

  // Fonction pour supprimer un item du panier
  const removeItem = (id) => {
    Alert.alert(
      'Supprimer l’item',
      'Êtes-vous sûr de vouloir supprimer cet article du panier ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          onPress: () => setItems((prevItems) => prevItems.filter((item) => item.id !== id)),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panier des items sélectionnés</Text>

      {items.length > 0 ? (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.textContainer}>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  <Text style={styles.itemPrice}>{item.price.toFixed(2)} $</Text>
                  <Text style={styles.itemQuantity}>
                    Quantité: {item.quantity}
                  </Text>
                </View>
                <View style={styles.actionContainer}>
                  <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
                    <Feather name="plus" size={20} color="#000" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
                    <Feather name="minus" size={20} color="#000" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeItem(item.id)}>
                    <Feather name="trash" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: {calculateTotal()} $</Text>
            <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.checkoutButtonText}>Passer la commande</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={styles.emptyCartText}>Votre panier est vide.</Text>
      )}
    </View>
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
    marginTop: "10%",
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
