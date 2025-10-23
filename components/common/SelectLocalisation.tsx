import {
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
  View,
} from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { StyleProp, ViewStyle } from "react-native";

import { ChevronDown, MapPin } from "lucide-react-native";

import TYPOGRAPHY from "@/constants/Typography";
import COLORS from "@/constants/Colors";
import SPACING from "@/constants/Spacing";
import { useModal } from "../layouts/GlobalModal";

import { useEffect, useState, useRef } from "react";
import MapModalLayout from "../layouts/MapModalLayout";

type SelectLocalisationProps = {
  currentLocalisation: string;
  location: Location.LocationObject;
  style?: StyleProp<ViewStyle>;
  onLocationChange?: (
    pavilionName: string,
    coords: { latitude: number; longitude: number }
  ) => void;
};

export default function SelectLocalisation({
  currentLocalisation,
  location,
  style,
  onLocationChange,
}: SelectLocalisationProps) {
  const [localisation, setLocalisation] = useState("");
  const [isCurrentLocalisationModified, setisCurrentLocalisationModified] =
    useState(false);
  const [locationLoaded, setLocationLoaded] = useState("");
  const [selectedCoords, setSelectedCoords] = useState<{
    latitude: number;
    longitude: number;
  }>();
  const [newLocation, setNewLocation] = useState(""); // Add this line to store selected location name

  // Use refs to store immediate values
  const currentSelectionRef = useRef<{
    location: string;
    coords: { latitude: number; longitude: number };
  } | null>(null);

  // Reset internal state when currentLocalisation changes from parent
  useEffect(() => {
    if (currentLocalisation && !isCurrentLocalisationModified) {
      setLocationLoaded(currentLocalisation);
      setisCurrentLocalisationModified(true);
    }
  }, [currentLocalisation, isCurrentLocalisationModified]);

  const modalContext = useModal();
  const openModal = modalContext ? modalContext.openModal : () => {};
  const closeModal = modalContext ? modalContext.closeModal : () => {};

  function handleMarkerPress(
    pressedLocation: string,
    lat: number,
    lng: number
  ) {
    console.log("handleMarkerPress called with:", pressedLocation, lat, lng);
    const coords = { latitude: lat, longitude: lng };

    // Store immediately in ref
    currentSelectionRef.current = {
      location: pressedLocation,
      coords: coords,
    };

    // Also update state
    setLocalisation(pressedLocation);
    setNewLocation(pressedLocation);
    setSelectedCoords(coords);

    console.log("Stored in ref:", currentSelectionRef.current);
  }

  function handleApplyFilter() {
    console.log("handleApplyFilter called");
    console.log("State values:", { newLocation, selectedCoords });
    console.log("Ref values:", currentSelectionRef.current);

    // Use ref values if available, otherwise fall back to state
    const locationToUse = currentSelectionRef.current?.location || newLocation;
    const coordsToUse = currentSelectionRef.current?.coords || selectedCoords;

    console.log("Using values:", { locationToUse, coordsToUse });

    // Only proceed if we have both location and coordinates
    if (locationToUse && coordsToUse) {
      setLocationLoaded(locationToUse);
      setLocalisation("");
      setisCurrentLocalisationModified(true);

      // Call the parent callback with the new location info
      if (onLocationChange) {
        console.log(
          "Calling onLocationChange with:",
          locationToUse,
          coordsToUse
        );
        onLocationChange(locationToUse, coordsToUse);
      }

      // Clear the ref after use
      currentSelectionRef.current = null;
    } else {
      console.log("Missing location or coordinates");
    }

    closeModal();
  }

  function handleResetFilter() {
    setisCurrentLocalisationModified(false);
    setLocationLoaded("");
    closeModal();
  }

  function handlePress(event: GestureResponderEvent): void {
    openModal(
      <MapModalLayout
        handleApplyFilter={handleApplyFilter}
        handleResetFilter={handleResetFilter}
        handleMarkerPress={handleMarkerPress}
        location={location}
        currentLocalisation={currentLocalisation}
        isCurrentLocalisationModified={isCurrentLocalisationModified}
        locationLoaded={locationLoaded}
      />
    );
  }
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[style, styles.selectLocalisationContainer]}
      activeOpacity={0.5}
      testID="select-localisation-container"
    >
      <MapPin
        width={SPACING.md}
        height={SPACING.md}
        strokeWidth={2.5}
        color={COLORS.subtuleDark}
        testID="map-pin"
      />
      <Text
        style={[TYPOGRAPHY.body.normal.semiBold, styles.localisationText]}
        testID="localisation-text"
      >
        {currentLocalisation}
      </Text>
      <ChevronDown
        width={SPACING.lg}
        height={SPACING.lg}
        strokeWidth={2.5}
        color={COLORS.subtuleDark}
        testID="chevron-down"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  selectLocalisationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    padding: SPACING.xs,
  },
  localisationText: {
    marginLeft: SPACING.xxs,
    color: COLORS.subtuleDark,
  },
});
