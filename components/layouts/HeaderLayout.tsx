import { Button, Modal, StyleSheet, TouchableOpacity, View, Text, TouchableHighlight,Animated } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, Tabs, useRouter } from "expo-router";

import {Swipeable} from "react-native-gesture-handler";

import SPACING from "@/constants/Spacing";
import COLORS from "@/constants/Colors";
import Ionicons from '@expo/vector-icons/Ionicons';
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Import GestureHandlerRootView

import {
  ChevronRight,
  Package,
  Bell,
  Settings2,
  HelpCircle,
  Info,
} from "lucide-react-native";
import AccountInfo from "@/components/common/Auth/AccountInfo";
import React, { useState , useRef} from "react";
// FIXME: Replace with actual user data. This is just a placeholder.
export const user = {
  fullName: "Darlene Robertson",
  profilePicture: require("../../assets/images/placeholder/ProfilePicture.png"),
};

type HeaderLayoutProps = {
  fullName?: string;
  profilePicture?: any;
};

/**
 * HeaderLayout component that renders a header layout with account info and icon button.
 */
export default function HeaderLayout({fullName, profilePicture}: HeaderLayoutProps) {
  
  const navigation = useRouter();
  const [notifModal, setNotifModal] = useState(false);

  


  const handleDelete = (id) => {
    setNotifs(notifs.filter((notif) => notif.id !== id));
    const swipeableRef = swipeableRefs.current.get(id);
    if (swipeableRef) {
      swipeableRef.close();
    }
  };

  const handleUpdate = (id) => {
    setNotifs(
      notifs.map((notif) =>
        notif.id === id ? { ...notif, status: !notif.status } : notif
      )
    );
    const swipeableRef = swipeableRefs.current.get(id);
    if (swipeableRef) {
      swipeableRef.close();
    }
  };
  const swipeableRefs = useRef(new Map());
  const renderRightActions = (dragX, id) => {
    const opacity = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const width = dragX.interpolate({
      inputRange: [-0, 0],
      outputRange: [0, 10],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.deleteButton, {transform: [{ translateX: width }]}]}>
        <TouchableOpacity onPress={() => handleDelete(id)}>
          <Text style={styles.deleteButtonText}>Effacer</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  const renderLeftActions = (dragX, id) => {
    const opacity = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const width = dragX.interpolate({
      inputRange: [-0, 0],
      outputRange: [0, 10],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.toggleButton, {transform: [{ translateX: width }]}]}>
        <TouchableOpacity onPress={() => handleUpdate(id)}>
            <Text style={styles.toggleButtonText}>
            {notifs.find((notif) => notif.id === id)?.status ? "Marquer comme non lu" : "Marquer comme lu"}
            </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  const [notifs, setNotifs] = useState([
      {
        id: 1,
        title: 'Titre notification #XXX',
        content: 'Contenu de la notification',
        status: true,
      },
      {
        id: 2,
        title: 'Titre notification #XXX',
        content: 'Contenu de la notification',
        status: false,
      },
      {
        id: 3,
        title: 'Titre notification #XXX',
        content: 'Contenu de la notification',
        status: false,
      },
      // Add more notifications as needed
    ]);
    const handleReadAll = () => {
      setNotifs(notifs.map((notif) => ({ ...notif, status: true })));
    };
    const unreadCount = notifs.filter((notif) => !notif.status).length;
  return (
    <SafeAreaView style={styles.headerContainer} testID="header-container">
      <AccountInfo
        profilePicture={user.profilePicture}
        profileName={user.fullName}
      />
      <View style={{ position: 'relative' }}>
          <Bell size={26} strokeWidth={2.5} color={COLORS.black} onPress={() => setNotifModal(true)} />
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={notifModal}
        onRequestClose={() => setNotifModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Mes Notifications</Text>
              <Button title="Fermer" onPress={() => setNotifModal(false)} />
            </View>
            <View style={styles.modalContent}>
            {notifs.length === 0 ? (
                  <Text style={styles.noNotificationsText}>Aucune notification</Text>
                ) : (
              notifs.map((notif) => (
                //<Swipeable key={notif.id} renderLeftActions={(progress, dragX) => renderLeftActions(dragX, notif.id)} renderRightActions={(progress, dragX) => renderRightActions(dragX, notif.id)} ref={(ref) => swipeableRefs.current.set(notif.id, ref)}>
                <View style={styles.orderBox} key={notif.title} >
                  <View style={styles.orderDetails}>
                    <Text style={styles.orderTitle}>{notif.title}</Text>
                    <Text style={styles.orderContent}>{notif.content}</Text>
                    <View style={{ position: 'absolute', right: 10, top: '50%', transform: [{ translateY: -5 }] }}>
                      <View style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: notif.status ? 'green' : 'red',
                      }} />
                    </View>
                  </View>
                </View>
                //</Swipeable>
              )))}
              
            </View>
            {unreadCount > 0 && (
              <TouchableOpacity style={styles.readAllButton} onPress={handleReadAll}>
              <Text style={styles.readAllButtonText}>✓</Text>
              </TouchableOpacity>
            )}
          </View>
          
        </View>
        
        
      </Modal>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingTop: SPACING.xs, 
    paddingBottom: -SPACING.lg,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.white,
    justifyContent: "space-between",
    borderBottomColor: COLORS.lightGray,
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
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding:20
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  orderBox: {
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
  closeButton :{
    padding: 10,
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
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '85%',
    borderTopRightRadius:12,
    borderBottomRightRadius:12
  },
  toggleButton: {
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '85%',
    borderTopLeftRadius:12,
    borderBottomLeftRadius:12
  },
  toggleButtonText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noNotificationsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  readAllButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'green',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  readAllButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
