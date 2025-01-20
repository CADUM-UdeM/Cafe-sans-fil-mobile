/**
 * Calculates the distance between two geographical coordinates using the Haversine formula.
 *
 * @param lat1 - Latitude of the first coordinate in decimal degrees.
 * @param lon1 - Longitude of the first coordinate in decimal degrees.
 * @param lat2 - Latitude of the second coordinate in decimal degrees.
 * @param lon2 - Longitude of the second coordinate in decimal degrees.
 * @returns The distance between the two coordinates in kilometers.
 */
export function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

/**
 * Converts degrees to radians.
 *
 * @param deg - The angle in degrees.
 * @returns The angle in radians.
 */
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
