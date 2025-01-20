// hooks/useSortedItemsByDistance.ts
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { getDistanceFromLatLonInKm } from "@/utils/distance";

/**
 * Generic type for items that can be sorted by distance.
 *
 * @template T - The item type.
 * @template KLat - The key representing latitude in T.
 * @template KLng - The key representing longitude in T.
 * @template KName - The key representing the name in T.
 */
type SortableItem<
  T,
  KLat extends keyof T,
  KLng extends keyof T,
  KName extends keyof T
> = {
  /** Latitude coordinate */
  [key in KLat]: number;
} & {
  /** Longitude coordinate */
  [key in KLng]: number;
} & {
  /** Name of the item */
  [key in KName]: string;
} & {
  /** Optional identifier */
  id?: string | number;
};

/**
 * Custom hook to sort items by distance from the user's current location.
 * 
 * The items are sorted from closest to farthest based on the distance from the user's location.
 * 
 * #### Usage
 * ```tsx
 * import useLocation from "@/hooks/useLocation";
 * import { pavillonCoordinates, type PavillonCoordinate } from "@/constants/Coordinates";

 * const [location, getCurrentLocation] = useLocation();
 * const sortedPavillons = useSortedItemsByDistance<
    PavillonCoordinate,
    "lat",
    "lng",
    "pavillon"
  >(location, pavillonCoordinates, "lat", "lng", "pavillon");
 * ```
 *
 * @template T - The item type.
 * @template KLat - The key representing latitude in T.
 * @template KLng - The key representing longitude in T.
 * @template KName - The key representing the name in T.
 *
 * @param location - The user's current location object.
 * @param items - Array of items to sort.
 * @param latKey - The key representing latitude in the items.
 * @param lngKey - The key representing longitude in the items.
 * @param nameKey - The key representing the name in the items.
 *
 * @returns A sorted array of item names from closest to farthest.
 */
export default function useSortedItemsByDistance<
  T,
  KLat extends keyof T,
  KLng extends keyof T,
  KName extends keyof T
>(
  location: Location.LocationObject | null,
  items: SortableItem<T, KLat, KLng, KName>[],
  latKey: KLat,
  lngKey: KLng,
  nameKey: KName
): string[] {

  // State to store the sorted item names.
  const [sortedItemNames, setSortedItemNames] = useState<string[]>([]);

  useEffect(() => {
    if (location && items.length > 0) {
      const userLat = location.coords.latitude;
      const userLng = location.coords.longitude;

      // Sort items based on distance from the user's location
      const sorted = [...items].sort((a, b) => {
        const distanceA = getDistanceFromLatLonInKm(
          userLat,
          userLng,
          a[latKey],
          a[lngKey]
        );
        const distanceB = getDistanceFromLatLonInKm(
          userLat,
          userLng,
          b[latKey],
          b[lngKey]
        );
        return distanceA - distanceB;
      });

      // Extract the name property from each sorted item
      const sortedNames = sorted.map((item) => item[nameKey]);
      setSortedItemNames(sortedNames);

      // FIXME: Remove this log after testing.
      console.warn("Sorted Items: ", sortedNames);
    } else {
      setSortedItemNames([]);
    }
  }, [location, items, latKey, lngKey, nameKey]);

  return sortedItemNames;
}
