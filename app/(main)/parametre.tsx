import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import ScrollableLayout from '@/components/layouts/ScrollableLayout'
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import Foundation from '@expo/vector-icons/Foundation';
import HeaderLayout from "@/components/layouts/HeaderLayout";
import TYPOGRAPHY from "@/constants/Typography";
import { Home, Settings, ShoppingBasket } from "lucide-react-native";
import { Tabs } from 'expo-router';

export default function ParametreScreen() {
  return (
    
    <><HeaderLayout /><ScrollableLayout style={styles.container}>

      <SafeAreaView style={styles.safe}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.category}>
            <FontAwesome style={styles.icon} size={24} name="user" color={"black"} />
            <Text style={styles.submenu}>Mon compte</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.category}>
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
          <TouchableOpacity style={[styles.category, styles.fullWidth, styles.centered]}>
            <Foundation name="info" size={24} color="black" />
            <Text style={styles.submenu}>À propos</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollableLayout></>
  )
}

const styles = StyleSheet.create({
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
});