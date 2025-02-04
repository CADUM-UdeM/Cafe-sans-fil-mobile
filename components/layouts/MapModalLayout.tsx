import { View, Text } from "react-native";
import React from "react";
import * as Location from "expo-location";
import COLORS from "@/constants/Colors";
import { pavillonCoordinates } from "@/constants/Coordinates";
import SPACING from "@/constants/Spacing";
import TYPOGRAPHY from "@/constants/Typography";
import MapView, { Marker, Callout } from "react-native-maps";
import FilterModalLayout from "./FilterModalLayout";

export default function MapModalLayout({
    handleApplyFilter,
    handleResetFilter,
    handleMarkerPress,
    location,
    currentLocalisation,
    isCurrentLocalisationModified,
    locationLoaded,
}: {
    handleApplyFilter: () => void;
    handleResetFilter: () => void;
    handleMarkerPress: (pressedLocation: string) => void;
    location: Location.LocationObject;
    currentLocalisation: string;
    isCurrentLocalisationModified: boolean;
    locationLoaded: string;
}) {
  return (
    <FilterModalLayout
      title="Localisation"
      handleApplyFilter={handleApplyFilter}
      handleResetFilter={handleResetFilter}
    >
      <MapView
        style={{
          width: "100%",
          height: 400,
          borderRadius: 20,
          marginTop: 16,
        }}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
        showsMyLocationButton
        showsTraffic
        minZoomLevel={15}
        cameraZoomRange={{
          maxCenterCoordinateDistance: 3000,
        }}
        mapType="standard"
      >
        {pavillonCoordinates.map((coordinate, index) =>
          coordinate.pavillon ===
          (isCurrentLocalisationModified
            ? locationLoaded
            : currentLocalisation) ? (
            <Marker
              key={index}
              coordinate={{
                latitude: coordinate.lat,
                longitude: coordinate.lng,
              }}
            >
              <Callout>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: SPACING.xs,
                  }}
                >
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 100,
                      backgroundColor: COLORS.status.red,
                    }}
                  />
                  <Text
                    style={[
                      TYPOGRAPHY.body.normal.semiBold,
                      { color: COLORS.black },
                    ]}
                  >
                    {coordinate.pavillon}
                  </Text>
                </View>
              </Callout>
            </Marker>
          ) : (
            <Marker
              key={index}
              coordinate={{
                latitude: coordinate.lat,
                longitude: coordinate.lng,
              }}
              title={coordinate.pavillon}
              pinColor="blue"
              onPress={() => handleMarkerPress(coordinate.pavillon)}
            >
              <Callout>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: SPACING.xs,
                  }}
                >
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 100,
                      backgroundColor: "blue",
                    }}
                  />
                  <Text
                    style={[
                      TYPOGRAPHY.body.normal.semiBold,
                      { color: COLORS.black },
                    ]}
                  >
                    {coordinate.pavillon}
                  </Text>
                </View>
              </Callout>
            </Marker>
          )
        )}
      </MapView>
      <View
        style={{
          flexDirection: "row",
          alignSelf: "center",
          marginTop: SPACING.xs,
          gap: 0,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: SPACING.xs,
            padding: SPACING.xs,
          }}
        >
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 100,
              backgroundColor: COLORS.status.red,
            }}
          />
          <Text
            style={{
              ...TYPOGRAPHY.body.normal.semiBold,
            }}
          >
            Votre pavillon
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: SPACING.xs,
            padding: SPACING.xs,
          }}
        >
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 100,
              backgroundColor: "blue",
            }}
          />
          <Text
            style={{
              ...TYPOGRAPHY.body.normal.semiBold,
            }}
          >
            Autres pavillons
          </Text>
        </View>
      </View>
      <Text
        style={{
          ...TYPOGRAPHY.body.normal.base,
          textAlign: "center",
          marginBlock: SPACING.md,
          paddingHorizontal: SPACING.lg,
          lineHeight: 18,
        }}
      >
        Selectionnez le pavillon de votre choix puis appuyez sur le bouton
        "Appliquer" pour confirmer votre choix.
      </Text>
    </FilterModalLayout>
  );
}
