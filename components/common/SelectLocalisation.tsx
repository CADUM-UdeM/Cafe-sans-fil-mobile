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

import { useEffect, useState } from "react";
import MapModalLayout from "../layouts/MapModalLayout";

type SelectLocalisationProps = {
  currentLocalisation: string;
  location: Location.LocationObject;
  style?: StyleProp<ViewStyle>;
  onLocationChange?: (pavilionName: string, coords: {latitude: number, longitude: number}) => void;
};

export default function SelectLocalisation({
  currentLocalisation,
  location,
  style,
  onLocationChange,
}: SelectLocalisationProps) {
  const [localisation, setLocalisation] = useState("");
  const [isCurrentLocalisationModified, setisCurrentLocalisationModified] = useState(false);
  const [locationLoaded, setLocationLoaded] = useState("");
  const [selectedCoords, setSelectedCoords] = useState<{latitude: number; longitude: number}>();
  const [newLocation, setNewLocation] = useState(""); // Add this line to store selected location name

  useEffect(() => {}, [localisation]);

  const modalContext = useModal();
  const openModal = modalContext ? modalContext.openModal : () => {};
  const closeModal = modalContext ? modalContext.closeModal : () => {};

  function handleMarkerPress(pressedLocation: string, lat: number, lng: number) {
    setLocalisation(pressedLocation);
    setNewLocation(pressedLocation); // Set newLocation when marker is pressed
    setSelectedCoords({latitude: lat, longitude: lng});
  }

  function handleApplyFilter() {
    setLocationLoaded(newLocation);
    setLocalisation("");
    setisCurrentLocalisationModified(true);
    
    // Call the parent callback with the new location info
    if(onLocationChange && selectedCoords) {
      console.log("Updating location to:", newLocation, selectedCoords);
      onLocationChange(newLocation, selectedCoords);
    }
    
    closeModal();
  }

  function handleResetFilter() {
    setisCurrentLocalisationModified(false);
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
        {isCurrentLocalisationModified ? locationLoaded : currentLocalisation}
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
