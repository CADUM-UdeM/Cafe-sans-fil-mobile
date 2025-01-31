import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Modal, Button, TextInput, Image } from 'react-native'
import React, { useState } from 'react'
import ScrollableLayout from '@/components/layouts/ScrollableLayout'
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import Foundation from '@expo/vector-icons/Foundation';
import HeaderLayout from "@/components/layouts/HeaderLayout";
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function ParametreScreen() {
  const navigation = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [ordersModalVisible, setOrdersModalVisible] = useState(false);
  

  const orders = [
    {
      id: 1,
      image: 'https://placehold.jp/150x150.png',
      title: 'Commande #XXX',
      content: 'Trucs que t\'as acheté',
      restaurant: 'Jean Brilliant',
      price: '$20.00',
    },
    {
      id: 2,
      image: 'https://placehold.jp/150x150.png',
      title: 'Commande #XXX',
      content: 'Trucs que t\'as acheté',
      restaurant: 'André Aisenstadt',
      price: '$15.00',
    },
    // Add more orders as needed
  ];

  const [profilePicture, setProfilePicture] = useState('https://placehold.jp/150x150.png');
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      if (result.assets && result.assets.length > 0) {
        setProfilePicture(result.assets[0].uri);
      }
    }
  };

  return (
    <>
      <HeaderLayout />
      <ScrollableLayout style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.row}>
            <TouchableOpacity style={styles.category} onPress={() => setAccountModalVisible(true)}>
              <FontAwesome style={styles.icon} size={24} name="user" color={"black"} />
              <Text style={styles.submenu}>Mon compte</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.category} onPress={() => setOrdersModalVisible(true)}>
              <FontAwesome5 style={styles.icon} name="receipt" size={24} color="black" />
              <Text style={styles.submenu}>Mes commandes</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.category}>
              <MaterialIcons style={styles.icon2} name="display-settings" size={24} color="black" />
              <Text style={styles.submenu}>Mes préférences</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.category}>
              <Feather style={styles.icon2} name="settings" size={24} color="black" />
              <Text style={styles.submenu}>Paramètres Application</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.category, styles.fullWidth, styles.centered]} onPress={() => setModalVisible(true)}>
              <Foundation  name="info" size={24} color="black" />
              <Text style={styles.submenu}>À propos</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={ordersModalVisible}
          onRequestClose={() => setOrdersModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Mes Commandes</Text>
                <Button title="Fermer" onPress={() => setOrdersModalVisible(false)} />
              </View>
              <View style={styles.modalContent}>
              {orders.map((order) => (
                <TouchableOpacity key={order.id} style={styles.orderBox} onPress={() => {}}>
                  <Image source={{ uri: order.image }} style={styles.orderImage} />
                  <View style={styles.orderDetails}>
                    <Text style={styles.orderTitle}>{order.title}</Text>
                    <Text style={styles.orderContent}>{order.content}</Text>
                    <Text style={styles.orderRestaurant}>{order.restaurant}</Text>
                  </View>
                  <Text style={styles.orderPrice}>{order.price}</Text>
                </TouchableOpacity>
              ))}
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>À propos</Text>
                <Button title="Fermer" onPress={() => setModalVisible(false)} />
              </View>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </Text>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={accountModalVisible}
          onRequestClose={() => setAccountModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Mon compte</Text>
                <Button title="Fermer et Sauvegarder" onPress={() => setAccountModalVisible(false)} />
              </View>
              <View style={styles.modalContent}>
                <TouchableOpacity onPress={pickImage}>
                  <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
                </TouchableOpacity>
                <Text style={[{alignSelf:'center',padding:20, fontWeight:500}]}>Modifier votre photo de profil</Text>
                <TextInput style={styles.input } placeholder="Modifier votre Nom" placeholderTextColor="grey" />
                <TextInput style={styles.input} placeholder="Modifier votre Email" placeholderTextColor="grey" />
                <TextInput style={styles.input} placeholder="Modifier votre Mot de passe" secureTextEntry placeholderTextColor="grey"/>
                <TouchableOpacity style={[styles.btn, { backgroundColor: 'red' }]} onPress={() => { /* Add delete account logic here */ }}>
                  <Text style={{ color: 'white', textAlign: 'center', padding: 10, fontSize:20, fontWeight:500 }}>Supprimer votre compte</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, { backgroundColor: 'White', borderWidth: 1, }]} onPress={() => { setAccountModalVisible(false); navigation.push('../(onboarding)/first-onboarding') }}>
                <Text style={{ color: 'black', textAlign: 'center', padding: 10, fontSize:20, fontWeight:500 }}>Se Déconnecter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollableLayout>
    </>
  )
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 15,
    margin: 10,
    width: '60%',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  safe: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  category: {
    flexBasis: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: 12,
  },
  fullWidth: {
    flexBasis: '100%',
  },
  icon2: {
    marginRight: 10,
    marginLeft: -3,
  },
  submenu: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  centered: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '100%',
    height: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: '20%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  orderBox :{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  orderImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  orderDetails: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderRestaurant: {
    fontSize: 14,
    color: '#999',
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});