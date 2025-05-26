import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import COLORS from "@/constants/Colors";
import SPACING from "@/constants/Spacing";
import TYPOGRAPHY from "@/constants/Typography";
import MapView, { Marker, Callout } from "react-native-maps";
import FilterModalLayout from "./FilterModalLayout";

export default function MapModalLayout({
    handleApplyFilter,
    handleResetFilter,
    handleMarkerPress, // Updated to include coordinates
    location,
    currentLocalisation,
    isCurrentLocalisationModified,
    locationLoaded,
}: {
    handleApplyFilter: () => void;
    handleResetFilter: () => void;
    handleMarkerPress: (pressedLocation: string, lat: number, lng: number) => void; // Updated type definition
    location: Location.LocationObject;
    currentLocalisation: string;
    isCurrentLocalisationModified: boolean;
    locationLoaded: string;
}) {
  
  interface Coordinate {
    pavillon: string;
    lat: number;
    lng: number;
  }

  const [listCoordinates, setListCoordinates] = useState<(Coordinate | null)[]>([]);
  const [pavillonCoordinates, setPavillonCoordinates] = useState<Coordinate[]>([]);

  useEffect(() => {
    fetch("https://cafesansfil-api-r0kj.onrender.com/api/cafes")
      .then((response) => response.json())
      .then((json) => {
        // Process data in one go
        const filteredCoordinates = json.items
          .map((item: any) => {
            if (item.location.geometry) {
              return {
                pavillon: item.location.pavillon,
                lat: item.location.geometry.coordinates[1],
                lng: item.location.geometry.coordinates[0],
              };
            }
            return null;
          })
          .filter((coordinate : any): coordinate is Coordinate => coordinate !== null);
        
        // Single state update with filtered data
        setListCoordinates(filteredCoordinates);
      })
      .catch((error) => console.error(error));
  }, []);  // ← Remove location dependency to prevent re-fetching
  

  return (
    <FilterModalLayout
      title="Localisation"
      handleApplyFilter={handleApplyFilter}
      handleResetFilter={handleResetFilter}
    >
      <MapView
      key={`map-${listCoordinates.length}`} // Add this line to force re-render
        style={{
          width: "100%",
          height: 400,
          borderRadius: 20,
          marginTop: 16,
        }}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,  // Increased from 0.0922
          longitudeDelta: 0.0421, // Increased from 0.0421
        }}
        showsUserLocation
        showsMyLocationButton
        showsTraffic
        minZoomLevel={12}
        cameraZoomRange={{
          maxCenterCoordinateDistance: 3000,
        }}
        mapType="standard"
      >
        {listCoordinates.map((coordinate, index) =>
          coordinate && coordinate.pavillon ===
          (isCurrentLocalisationModified
            ? locationLoaded
            : currentLocalisation) ? (
            <Marker
              key={`selected-${coordinate.pavillon}-${index}`}
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
            coordinate && <Marker
              key={`regular-${coordinate.pavillon}-${index}`}
              coordinate={{
                latitude: coordinate.lat,
                longitude: coordinate.lng,
              }}
              title={coordinate.pavillon}
              pinColor= "blue"
              onPress={() => handleMarkerPress(
                coordinate.pavillon, 
                coordinate.lat,
                coordinate.lng
              )}
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
