import {
  View,
  Text,
  Touchable,
  TouchableOpacity,
  Modal,
  Platform,
  Linking,
  Alert,
  Image,
  StatusBar,
  FlatList,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useCallback } from "react";
import ScrollableLayout from "@/components/layouts/ScrollableLayout";
import SPACING from "@/constants/Spacing";
import TYPOGRAPHY from "@/constants/Typography";
import HeaderLayout from "@/components/layouts/HeaderLayout";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import AntDesign from "@expo/vector-icons/AntDesign";
import COLORS from "@/constants/Colors";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EventsPage() {
  const [isRequestingData, setIsRequestingData] = React.useState(false);

  const [ListeCafes, setListeCafes] = React.useState<any>(null);
  const [events, setEvents] = React.useState<any>(null);
  const [isEventsLoading, setIsEventsLoading] = React.useState(true);

  const [isCafesLoading, setIsCafesLoading] = React.useState(true);
  const [modalData, setModalData] = React.useState<any>(null);

  const [setCafeRegion, setSetCafeRegion] = React.useState<any>(null);

  const [cafeLocation, setCafeLocation] = React.useState<any>(null);

  const getCafeNameById = (id: string) => {
    if (ListeCafes && ListeCafes.items) {
      const cafe = ListeCafes.items.find((cafe: any) => cafe.id === id);
      return cafe ? cafe.name : "Unknown Cafe";
    }
    return "Loading...";
  };

  const openMapNavigation = async (cafe: any) => {
    // Check if cafe has valid coordinates
    if (
      !cafe ||
      !cafe.location ||
      !cafe.location.geometry ||
      !cafe.location.geometry.coordinates ||
      cafe.location.geometry.coordinates.length < 2
    ) {
      Alert.alert(
        "Erreur",
        "Les coordonnées de ce café ne sont pas disponibles."
      );
      return;
    }

    const latitude = cafe.location.geometry.coordinates[1];
    const longitude = cafe.location.geometry.coordinates[0];
    const cafeName = cafe.name;

    if (Platform.OS === "android") {
      // Android: Open Google Maps directly
      const googleMapsUrl = `google.navigation:q=${latitude},${longitude}`;
      const fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

      try {
        const supported = await Linking.canOpenURL(googleMapsUrl);
        if (supported) {
          await Linking.openURL(googleMapsUrl);
        } else {
          await Linking.openURL(fallbackUrl);
        }
      } catch (error) {
        console.error("Error opening maps:", error);
      }
    } else {
      // iOS: Check if Google Maps is installed using different URL schemes
      const googleMapsNavigationUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      const googleMapsSimpleUrl = `comgooglemaps://`;
      const appleMapsUrl = `http://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`;

      try {
        // Try multiple Google Maps URL schemes to ensure detection
        let googleMapsInstalled = true;

        try {
          googleMapsInstalled = await Linking.canOpenURL(googleMapsSimpleUrl);
          console.log("Google Maps detection (simple):", googleMapsInstalled);
        } catch (e) {
          console.log("Google Maps simple URL check failed:", e);
        }

        if (!googleMapsInstalled) {
          try {
            googleMapsInstalled = await Linking.canOpenURL(
              googleMapsNavigationUrl
            );
            console.log(
              "Google Maps detection (navigation):",
              googleMapsInstalled
            );
          } catch (e) {
            console.log("Google Maps navigation URL check failed:", e);
          }
        }

        if (googleMapsInstalled) {
          // Show choice between Apple Maps and Google Maps
          Alert.alert(
            "Ouvrir dans",
            `Choisissez l'application pour naviguer vers ${cafeName}`,
            [
              {
                text: "Apple Maps",
                onPress: () => {
                  console.log("Opening Apple Maps");
                  Linking.openURL(appleMapsUrl);
                },
              },
              {
                text: "Google Maps",
                onPress: () => {
                  console.log("Opening Google Maps");
                  Linking.openURL(googleMapsNavigationUrl);
                },
              },
              {
                text: "Annuler",
                style: "cancel",
              },
            ]
          );
        } else {
          // Only Apple Maps available
          console.log("Google Maps not detected, opening Apple Maps");
          await Linking.openURL(appleMapsUrl);
        }
      } catch (error) {
        console.error("Error opening maps:", error);
        // Fallback to Apple Maps
        await Linking.openURL(appleMapsUrl);
      }
    }
  };

  const getCafeById = (id: string) => {
    if (ListeCafes && ListeCafes.items) {
      const cafe = ListeCafes.items.find((cafe: any) => cafe.id === id);
      return cafe;
    }
    return null;
  };

  const updateCafeRegion = (cafeId: string) => {
    const cafe = getCafeById(cafeId);
    if (
      cafe &&
      cafe.location &&
      cafe.location.geometry &&
      cafe.location.geometry.coordinates &&
      cafe.location.geometry.coordinates.length >= 2
    ) {
      return {
        latitude: cafe.location.geometry.coordinates[1],
        longitude: cafe.location.geometry.coordinates[0],
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      };
    }
    // Default region if cafe not found or coordinates are null
    return {
      latitude: 45.5017,
      longitude: -73.5673,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  };

  const openModalWithData = (data: any) => {
    setModalData(data);
    setShowModal(true);
  };

  const [showModal, setShowModal] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1); // API pages start at 1
  const [totalPages, setTotalPages] = React.useState(1);
  const [isFocused, setIsFocused] = React.useState(true);
  const [isPaginationLoading, setIsPaginationLoading] = React.useState(false);
  const ITEMS_PER_PAGE = 4; // Match API size parameter

  // Cache management
  const [lastEventsFetch, setLastEventsFetch] = React.useState<number>(0);
  const [cachedPage, setCachedPage] = React.useState<number>(0); // Track which page is cached
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  // Load cached data on focus
  useFocusEffect(
    useCallback(() => {
      // When screen comes into focus
      setIsFocused(true);
      console.log("Events page focused - loading cached data");

      // Load cached data and timestamps
      const loadCache = async () => {
        try {
          const [cachedEvents, cachedCafes, eventsTimestamp, cachedPageNum] =
            await Promise.all([
              AsyncStorage.getItem("events_cache"),
              AsyncStorage.getItem("cafes_cache"),
              AsyncStorage.getItem("events_cache_timestamp"),
              AsyncStorage.getItem("events_cache_page"),
            ]);

          if (cachedEvents) {
            setEvents(JSON.parse(cachedEvents));
            setIsEventsLoading(false);
            console.log("✅ Loaded cached events");
          }

          if (cachedCafes) {
            setListeCafes(JSON.parse(cachedCafes));
            setIsCafesLoading(false);
            console.log("✅ Loaded cached cafes");
          }

          if (eventsTimestamp) {
            setLastEventsFetch(parseInt(eventsTimestamp));
          }

          if (cachedPageNum) {
            setCachedPage(parseInt(cachedPageNum));
          }
        } catch (error) {
          console.error("Error loading cache:", error);
        }
      };

      loadCache();

      return () => {
        // When screen loses focus
        console.log("Events page unfocused");
        setIsFocused(false);
        setShowModal(false);
        setModalData(null);
      };
    }, [])
  );

  useEffect(() => {
    // Only fetch data when screen is focused
    if (!isFocused) {
      console.log("Screen not focused, skipping data fetch");
      return;
    }

    // Prevent multiple simultaneous requests
    if (isRequestingData) return;

    setIsRequestingData(true);

    const fetchWithTimeout = (
      url: string,
      timeout = 10000
    ): Promise<Response> => {
      return Promise.race([
        fetch(url),
        new Promise<Response>((_, reject) =>
          setTimeout(() => reject(new Error("Request timeout")), timeout)
        ),
      ]);
    };

    // Fetch cafes only if not already loaded (needed for both tabs)
    const fetchCafes = async () => {
      // Skip if already loaded
      if (ListeCafes && ListeCafes.items && ListeCafes.items.length > 0) {
        console.log("☕ Cafes already loaded, skipping fetch");
        return;
      }

      try {
        const response = await fetchWithTimeout(
          "https://cafesansfil-api-r0kj.onrender.com/api/cafes/"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("☕ Cafes fetched from API");
        setListeCafes(data);
        setIsCafesLoading(false);
        // Cache cafes
        await AsyncStorage.setItem("cafes_cache", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching cafes:", error);
        setIsCafesLoading(false);
        setListeCafes({ items: [] });
      }
    };

    // Fetch events data
    const fetchEventsData = async () => {
      const now = Date.now();
      const cacheAge = now - lastEventsFetch;

      // Check if we need to fetch based on cache validity AND page match
      // Only use cache if: 1) cache is fresh, 2) we have data, 3) it's the same page
      if (
        cacheAge < CACHE_DURATION &&
        events &&
        events.items &&
        events.items.length > 0 &&
        cachedPage === currentPage
      ) {
        console.log(
          `📄 Events cache still valid (${Math.round(
            cacheAge / 1000
          )}s old, page ${currentPage}), skipping fetch`
        );
        setIsRequestingData(false);
        setIsPaginationLoading(false);
        return;
      }

      console.log(
        `📄 Fetching events - Page ${currentPage} (cache expired, empty, or different page)`
      );

      // Fetch events with pagination
      try {
        setIsPaginationLoading(true);
        const url = `https://cafesansfil-api-r0kj.onrender.com/api/events/?page=${currentPage}&size=${ITEMS_PER_PAGE}`;
        const response = await fetchWithTimeout(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const fetchTime = Date.now();

        console.log("✅ Events fetched from API:", data.items?.length, "items");
        setEvents(data);
        setTotalPages(Math.ceil((data.total || 0) / ITEMS_PER_PAGE));
        setIsEventsLoading(false);
        setIsPaginationLoading(false);
        setLastEventsFetch(fetchTime);
        setCachedPage(currentPage);

        // Cache events, timestamp, and page number
        await AsyncStorage.setItem("events_cache", JSON.stringify(data));
        await AsyncStorage.setItem(
          "events_cache_timestamp",
          fetchTime.toString()
        );
        await AsyncStorage.setItem("events_cache_page", currentPage.toString());
      } catch (error) {
        console.error("Error fetching events:", error);
        setIsEventsLoading(false);
        setIsPaginationLoading(false);
        setEvents({ items: [], total: 0 });
        setTotalPages(1);
      }
    };

    // Execute requests
    Promise.all([fetchCafes(), fetchEventsData()]).finally(() => {
      setIsRequestingData(false);
    });
  }, [currentPage, isFocused]);

  const renderEventCard = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity onPress={() => openModalWithData(item)}>
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 16,
            padding: SPACING["lg"],
            marginBottom: SPACING["md"],
            ...(Platform.OS === "android"
              ? {
                  elevation: 2,
                }
              : {
                  shadowColor: COLORS.black,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                }),
            borderWidth: 1,
            borderColor: "#F0F0F0",
          }}
        >
          {item.image_url && (
            <Image
              source={{ uri: item.image_url }}
              style={{
                width: "100%",
                height: 120,
                borderRadius: 12,
                marginBottom: SPACING["md"],
              }}
              resizeMode="cover"
            />
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: SPACING["sm"],
            }}
          >
            <Text
              style={{
                ...TYPOGRAPHY.body.large.semiBold,
                flex: 1,
                marginRight: SPACING["sm"],
              }}
            >
              {item.name}
            </Text>
          </View>
          <Text
            style={{
              ...TYPOGRAPHY.body.normal.base,
              color: "#666",
              marginBottom: SPACING["sm"],
              lineHeight: 18,
            }}
            numberOfLines={2}
          >
            {item.description}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "#FF9800",
                  marginRight: SPACING["xs"],
                }}
              />
              <Text style={{ ...TYPOGRAPHY.body.small.base, color: "#666" }}>
                {item.cafes && item.cafes.length > 0
                  ? item.cafes[0].name
                  : "Multiple Cafés"}
              </Text>
            </View>
            <Text style={{ ...TYPOGRAPHY.body.small.base, color: "#999" }}>
              {new Date(item.start_date).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
              })}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar />
      <HeaderLayout />
      <ScrollableLayout>
        <View>
          <View
            style={{
              flex: 1,
              marginHorizontal: SPACING["md"],
              marginTop: SPACING["md"],
            }}
          >
            {isEventsLoading ? (
              <View style={{ alignItems: "center", marginTop: SPACING["xl"] }}>
                <ActivityIndicator size="large" color={COLORS.black} />
                <Text
                  style={{
                    ...TYPOGRAPHY.body.normal.base,
                    color: "#666",
                    marginTop: SPACING["md"],
                  }}
                >
                  Chargement des événements...
                </Text>
              </View>
            ) : isPaginationLoading ? (
              <View style={{ alignItems: "center", marginTop: SPACING["xl"] }}>
                <ActivityIndicator size="large" color={COLORS.black} />
                <Text
                  style={{
                    ...TYPOGRAPHY.body.normal.base,
                    color: "#666",
                    marginTop: SPACING["md"],
                  }}
                >
                  Chargement...
                </Text>
              </View>
            ) : events && events.items && events.items.length > 0 ? (
              <>
                <FlatList
                  data={events.items}
                  renderItem={renderEventCard}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  removeClippedSubviews={true}
                  maxToRenderPerBatch={ITEMS_PER_PAGE}
                  windowSize={3}
                  initialNumToRender={ITEMS_PER_PAGE}
                />

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: SPACING["lg"],
                      marginBottom: SPACING["xl"],
                      paddingHorizontal: SPACING["md"],
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1 || isPaginationLoading}
                      style={{
                        backgroundColor:
                          currentPage === 1 || isPaginationLoading
                            ? COLORS.darkWhite
                            : COLORS.black,
                        paddingHorizontal: SPACING["lg"],
                        paddingVertical: SPACING["sm"],
                        borderRadius: 8,
                        flex: 1,
                        marginRight: SPACING["sm"],
                        opacity: isPaginationLoading ? 0.5 : 1,
                      }}
                    >
                      <Text
                        style={{
                          ...TYPOGRAPHY.body.normal.semiBold,
                          color:
                            currentPage === 1 || isPaginationLoading
                              ? "#999"
                              : COLORS.white,
                          textAlign: "center",
                        }}
                      >
                        ← Précédent
                      </Text>
                    </TouchableOpacity>

                    <Text
                      style={{
                        ...TYPOGRAPHY.body.normal.base,
                        color: "#666",
                        marginHorizontal: SPACING["md"],
                      }}
                    >
                      {isPaginationLoading
                        ? "..."
                        : `${currentPage} / ${totalPages}`}
                    </Text>

                    <TouchableOpacity
                      onPress={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={
                        currentPage >= totalPages || isPaginationLoading
                      }
                      style={{
                        backgroundColor:
                          currentPage >= totalPages || isPaginationLoading
                            ? COLORS.darkWhite
                            : COLORS.black,
                        paddingHorizontal: SPACING["lg"],
                        paddingVertical: SPACING["sm"],
                        borderRadius: 8,
                        flex: 1,
                        marginLeft: SPACING["sm"],
                        opacity: isPaginationLoading ? 0.5 : 1,
                      }}
                    >
                      <Text
                        style={{
                          ...TYPOGRAPHY.body.normal.semiBold,
                          color:
                            currentPage >= totalPages || isPaginationLoading
                              ? "#999"
                              : COLORS.white,
                          textAlign: "center",
                        }}
                      >
                        Suivant →
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            ) : (
              <Text
                style={{
                  ...TYPOGRAPHY.body.normal.base,
                  color: "#666",
                  textAlign: "center",
                  marginTop: SPACING["xl"],
                }}
              >
                Aucun événement disponible
              </Text>
            )}
            {showModal && (
              <Modal
                visible={showModal}
                animationType="slide"
                onRequestClose={() => setShowModal(false)}
                presentationStyle="pageSheet"
              >
                <SafeAreaView
                  style={{
                    flex: 1,
                    backgroundColor: COLORS.white,
                  }}
                >
                  {/* Modal Header */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingHorizontal: SPACING["lg"],
                      paddingTop:
                        Platform.OS === "android"
                          ? SPACING["xl"]
                          : SPACING["lg"],
                      paddingBottom: SPACING["md"],
                      borderBottomWidth: 1,
                      borderBottomColor: "#F0F0F0",
                      backgroundColor: COLORS.white,
                      marginTop: Platform.OS === "android" ? 15 : 0,
                    }}
                  >
                    <Text style={{ ...TYPOGRAPHY.heading.small.bold }}>
                      {modalData && modalData.name
                        ? "Détails de l'événement"
                        : "Détails de l'annonce"}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowModal(false)}
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

                  {/* Modal Content */}
                  {modalData && (
                    <ScrollView
                      style={{ flex: 1, paddingBottom: SPACING["xl"] }}
                      contentContainerStyle={{
                        paddingHorizontal: SPACING["lg"],
                        paddingBottom: SPACING["xl"],
                      }}
                      showsVerticalScrollIndicator={true}
                    >
                      {/* Title and Tags/Location */}
                      <View style={{ marginTop: SPACING["lg"] }}>
                        <Text
                          style={{
                            ...TYPOGRAPHY.heading.medium.bold,
                            marginBottom: SPACING["sm"],
                            lineHeight: 28,
                          }}
                        >
                          {modalData.name || modalData.title}
                        </Text>

                        {/* Show tags for announcements or location for events */}
                        {modalData.tags ? (
                          <View
                            style={{
                              flexDirection: "row",
                              flexWrap: "wrap",
                              marginBottom: SPACING["lg"],
                            }}
                          >
                            {modalData.tags
                              .slice(0, 4)
                              .map((tag: string, index: number) => (
                                <View
                                  key={index}
                                  style={{
                                    backgroundColor: "#E8F4FD",
                                    paddingHorizontal: SPACING["sm"],
                                    paddingVertical: 6,
                                    borderRadius: 16,
                                    marginRight: SPACING["xs"],
                                    marginBottom: SPACING["xs"],
                                  }}
                                >
                                  <Text
                                    style={{
                                      ...TYPOGRAPHY.body.small.base,
                                      color: "#1976D2",
                                    }}
                                  >
                                    {tag}
                                  </Text>
                                </View>
                              ))}
                          </View>
                        ) : (
                          modalData.location && (
                            <View style={{ marginBottom: SPACING["lg"] }}>
                              <View
                                style={{
                                  backgroundColor: "#E8F5E8",
                                  paddingHorizontal: SPACING["md"],
                                  paddingVertical: 8,
                                  borderRadius: 16,
                                  alignSelf: "flex-start",
                                }}
                              >
                                <Text
                                  style={{
                                    ...TYPOGRAPHY.body.normal.medium,
                                    color: "#2E7D32",
                                  }}
                                >
                                  📍 {modalData.location}
                                </Text>
                              </View>
                            </View>
                          )
                        )}
                      </View>

                      {/* Event Info Cards */}
                      <View style={{ marginBottom: SPACING["lg"] }}>
                        {/* For announcements - show cafe */}
                        {modalData.cafe_id && (
                          <View
                            style={{
                              backgroundColor: "#F8F9FA",
                              borderRadius: 12,
                              padding: SPACING["md"],
                              marginBottom: SPACING["sm"],
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: SPACING["xs"],
                              }}
                            >
                              <View
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor: "#4CAF50",
                                  marginRight: SPACING["sm"],
                                }}
                              />
                              <Text
                                style={{
                                  ...TYPOGRAPHY.body.normal.semiBold,
                                  color: "#333",
                                }}
                              >
                                Café
                              </Text>
                            </View>
                            <Text
                              style={{
                                ...TYPOGRAPHY.body.normal.base,
                                color: "#666",
                                marginBottom: SPACING["sm"],
                              }}
                            >
                              {getCafeNameById(modalData.cafe_id)},{" "}
                              {getCafeById(modalData.cafe_id) &&
                              getCafeById(modalData.cafe_id).location &&
                              getCafeById(modalData.cafe_id).location.pavillon
                                ? getCafeById(modalData.cafe_id).location
                                    .pavillon
                                : ""}
                            </Text>

                            {getCafeById(modalData.cafe_id) && showModal && (
                              <MapView
                                style={{
                                  width: "100%",
                                  height: 150,
                                  borderRadius: 10,
                                  marginTop: SPACING["sm"],
                                }}
                                provider={
                                  Platform.OS === "android"
                                    ? PROVIDER_GOOGLE
                                    : undefined
                                }
                                initialRegion={updateCafeRegion(
                                  modalData.cafe_id
                                )}
                                scrollEnabled={false}
                                zoomEnabled={false}
                                rotateEnabled={false}
                                pitchEnabled={false}
                                loadingEnabled={true}
                                onPress={() =>
                                  openMapNavigation(
                                    getCafeById(modalData.cafe_id)
                                  )
                                }
                              >
                                <Marker
                                  coordinate={{
                                    latitude: getCafeById(modalData.cafe_id)
                                      .location.geometry.coordinates[1],
                                    longitude: getCafeById(modalData.cafe_id)
                                      .location.geometry.coordinates[0],
                                  }}
                                  title={getCafeNameById(modalData.cafe_id)}
                                  description={
                                    getCafeById(modalData.cafe_id).location
                                      .pavillon
                                  }
                                  onPress={() =>
                                    openMapNavigation(
                                      getCafeById(modalData.cafe_id)
                                    )
                                  }
                                />
                              </MapView>
                            )}
                          </View>
                        )}

                        {/* For events - show cafes */}
                        {modalData.cafes && modalData.cafes.length > 0 && (
                          <View
                            style={{
                              backgroundColor: "#F8F9FA",
                              borderRadius: 12,
                              padding: SPACING["md"],
                              marginBottom: SPACING["sm"],
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: SPACING["xs"],
                              }}
                            >
                              <View
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor: "#FF9800",
                                  marginRight: SPACING["sm"],
                                }}
                              />
                              <Text
                                style={{
                                  ...TYPOGRAPHY.body.normal.semiBold,
                                  color: "#333",
                                }}
                              >
                                Cafés participants
                              </Text>
                            </View>
                            {modalData.cafes.map((cafe: any, index: number) => {
                              const fullCafe = getCafeById(cafe.id);
                              return (
                                <Text
                                  key={index}
                                  style={{
                                    ...TYPOGRAPHY.body.normal.base,
                                    color: "#666",
                                    marginBottom: 4,
                                  }}
                                >
                                  • {cafe.name},{" "}
                                  {fullCafe &&
                                  fullCafe.location &&
                                  fullCafe.location.pavillon
                                    ? fullCafe.location.pavillon
                                    : ""}
                                </Text>
                              );
                            })}

                            {/* Show map for the first cafe in events */}
                            {showModal &&
                              modalData.cafes[0] &&
                              getCafeById(modalData.cafes[0].id) &&
                              getCafeById(modalData.cafes[0].id).location
                                ?.geometry?.coordinates && (
                                <MapView
                                  style={{
                                    width: "100%",
                                    height: 150,
                                    borderRadius: 10,
                                    marginTop: SPACING["sm"],
                                  }}
                                  provider={
                                    Platform.OS === "android"
                                      ? PROVIDER_GOOGLE
                                      : undefined
                                  }
                                  initialRegion={updateCafeRegion(
                                    modalData.cafes[0].id
                                  )}
                                  scrollEnabled={false}
                                  zoomEnabled={false}
                                  rotateEnabled={false}
                                  pitchEnabled={false}
                                  loadingEnabled={true}
                                  onPress={() =>
                                    openMapNavigation(
                                      getCafeById(modalData.cafes[0].id)
                                    )
                                  }
                                >
                                  <Marker
                                    coordinate={{
                                      latitude: getCafeById(
                                        modalData.cafes[0].id
                                      ).location.geometry.coordinates[1],
                                      longitude: getCafeById(
                                        modalData.cafes[0].id
                                      ).location.geometry.coordinates[0],
                                    }}
                                    title={modalData.cafes[0].name}
                                    description={
                                      getCafeById(modalData.cafes[0].id)
                                        .location.pavillon
                                    }
                                    onPress={() =>
                                      openMapNavigation(
                                        getCafeById(modalData.cafes[0].id)
                                      )
                                    }
                                  />
                                </MapView>
                              )}
                          </View>
                        )}

                        {/* Date info */}
                        <View
                          style={{
                            backgroundColor: "#F8F9FA",
                            borderRadius: 12,
                            padding: SPACING["md"],
                            marginBottom: SPACING["sm"],
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginBottom: SPACING["xs"],
                            }}
                          >
                            <View
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: "#2196F3",
                                marginRight: SPACING["sm"],
                              }}
                            />
                            <Text
                              style={{
                                ...TYPOGRAPHY.body.normal.semiBold,
                                color: "#333",
                              }}
                            >
                              {modalData.start_date
                                ? "Dates de l'événement"
                                : "Date limite"}
                            </Text>
                          </View>
                          {modalData.start_date ? (
                            <View>
                              <Text
                                style={{
                                  ...TYPOGRAPHY.body.normal.base,
                                  color: "#666",
                                }}
                              >
                                Début:{" "}
                                {new Date(
                                  modalData.start_date
                                ).toLocaleDateString("fr-FR", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </Text>
                              <Text
                                style={{
                                  ...TYPOGRAPHY.body.normal.base,
                                  color: "#666",
                                  marginTop: 4,
                                }}
                              >
                                Fin:{" "}
                                {new Date(
                                  modalData.end_date
                                ).toLocaleDateString("fr-FR", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </Text>
                            </View>
                          ) : (
                            <Text
                              style={{
                                ...TYPOGRAPHY.body.normal.base,
                                color: "#666",
                              }}
                            >
                              {new Date(
                                modalData.active_until
                              ).toLocaleDateString("fr-FR", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </Text>
                          )}
                        </View>

                        {/* Creator/Author info */}
                        {(modalData.creator || modalData.author) && (
                          <View
                            style={{
                              backgroundColor: "#F8F9FA",
                              borderRadius: 12,
                              padding: SPACING["md"],
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: SPACING["xs"],
                              }}
                            >
                              <View
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor: "#9C27B0",
                                  marginRight: SPACING["sm"],
                                }}
                              />
                              <Text
                                style={{
                                  ...TYPOGRAPHY.body.normal.semiBold,
                                  color: "#333",
                                }}
                              >
                                {modalData.creator
                                  ? "Créé par"
                                  : "Organisé par"}
                              </Text>
                            </View>
                            <Text
                              style={{
                                ...TYPOGRAPHY.body.normal.base,
                                color: "#666",
                              }}
                            >
                              {modalData.creator
                                ? `${modalData.creator.first_name} ${modalData.creator.last_name}`
                                : `${modalData.author.first_name} ${modalData.author.last_name}`}
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Description */}
                      <View>
                        <Text
                          style={{
                            ...TYPOGRAPHY.body.normal.semiBold,
                            color: "#333",
                            marginBottom: SPACING["sm"],
                          }}
                        >
                          Description
                        </Text>
                        <Text
                          style={{
                            ...TYPOGRAPHY.body.normal.base,
                            color: "#666",
                            lineHeight: 22,
                            marginBottom: SPACING["xl"],
                          }}
                        >
                          {modalData.description || modalData.content}
                        </Text>
                      </View>
                    </ScrollView>
                  )}
                </SafeAreaView>
              </Modal>
            )}
          </View>
        </View>
      </ScrollableLayout>
    </>
  );
}
