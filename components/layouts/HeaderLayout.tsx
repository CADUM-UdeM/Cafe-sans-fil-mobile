import {
  Button,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Text,
  Platform,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, Tabs, useRouter } from "expo-router";

import SPACING from "@/constants/Spacing";
import COLORS from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  getExpoPushToken,
  fetchNotificationsFromBackend,
} from "@/utils/notifications";
import * as SecureStore from "expo-secure-store";

import { Bell } from "lucide-react-native";
import AccountInfo from "@/components/common/Auth/AccountInfo";
import React, { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
// FIXME: Replace with actual user data. This is just a placeholder.
export const user = {
  fullName: "Darlene Robertson",
  profilePicture: require("../../assets/images/placeholder/ProfilePicture.png"),
};

type HeaderLayoutProps = {
  fullName?: string;
  profilePicture?: any;
};

type Notification = {
  id: string;
  title: string;
  body: string;
};

/**
 * HeaderLayout component that renders a header layout with account info and icon button.
 */
export default function HeaderLayout({
  fullName,
  profilePicture,
}: HeaderLayoutProps) {
  const navigation = useRouter();
  const [notifModal, setNotifModal] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [newNotifCount, setNewNotifCount] = useState(0);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setIsLoadingNotifications(true);

        const unparsed = await SecureStore.getItemAsync("notifications");
        const localNotis = unparsed ? JSON.parse(unparsed) : null;

        // Fetch notifications from backend
        const notifications = await fetchNotificationsFromBackend();

        setNotifs(notifications);

        if (localNotis) {
          console.log(localNotis.length + " vs " + notifications.length);
          console.log("Fetched notifications:", notifications);
          console.log("Local notifications:", localNotis);
          if (notifications.length === localNotis.length) {
            console.log("No new notifications");
            setNewNotifCount(0);
          } else {
            setNewNotifCount(notifications.length - localNotis.length);
            await SecureStore.setItemAsync(
              "notifications",
              JSON.stringify(notifications)
            );
          }
        } else {
          setNewNotifCount(notifications.length);
          await SecureStore.setItemAsync(
            "notifications",
            JSON.stringify(notifications)
          );
        }
      } catch (error) {
        console.error("Error loading notifications:", error);
      } finally {
        setIsLoadingNotifications(false);
      }
    };

    loadNotifications();
  }, [notifModal]);

  // Since notifications from backend don't have status, we'll just display them
  return (
    <SafeAreaView style={styles.headerContainer} testID="header-container">
      <AccountInfo
        profilePicture={user.profilePicture}
        profileName={user.fullName}
      />
      <View style={{ position: "relative" }}>
        <Bell
          size={26}
          strokeWidth={2.5}
          color={COLORS.black}
          onPress={() => setNotifModal(true)}
        />
        {newNotifCount > 0 && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>{newNotifCount}</Text>
          </View>
        )}
      </View>
      <Modal
        animationType="slide"
        visible={notifModal}
        presentationStyle="pageSheet"
        onRequestClose={() => setNotifModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Mes Notifications</Text>
              <TouchableOpacity
                onPress={() => setNotifModal(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AntDesign name="close" size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              {/* Notifications List */}
              {isLoadingNotifications ? (
                <View>
                  <Text style={styles.noNotificationsText}>Chargement...</Text>
                </View>
              ) : notifs.length === 0 ? (
                <View>
                  <Text style={styles.noNotificationsText}>
                    Aucune notification disponible
                  </Text>
                </View>
              ) : (
                <>
                  {notifs.map((notif, index) => (
                    <View key={`${notif.id}-${index}`} style={styles.orderBox}>
                      <View style={styles.orderDetails}>
                        <Text style={styles.orderTitle}>{notif.title}</Text>
                        <Text style={styles.orderContent}>{notif.body}</Text>
                      </View>
                    </View>
                  ))}
                </>
              )}
            </ScrollView>
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
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.white,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    padding: 20,
    marginTop: Platform.OS === "android" ? 15 : 0,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  orderBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  closeButton: {
    padding: 10,
  },
  orderDetails: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  orderContent: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  noNotificationsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "bold",
  },
});
