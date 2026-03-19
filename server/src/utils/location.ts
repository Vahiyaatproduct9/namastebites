export interface GeocodingResponse {
  address: string;
  pincode: string | null;
  locality: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  raw: any;
}

/**
 * Reverse geocoding using Nominatim (OpenStreetMap) with BigDataCloud as fallback
 * @param lat Latitude
 * @param lng Longitude
 * @returns Structured address object
 */
export async function getAddressFromCoordinates(
  lat: number,
  lng: number,
): Promise<GeocodingResponse> {
  // Try Nominatim first
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "NamasteBites/1.0",
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (!data.error) {
        return {
          address: data.display_name,
          pincode: data.address?.postcode || null,
          locality:
            data.address?.suburb ||
            data.address?.neighbourhood ||
            data.address?.city_district ||
            null,
          city:
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            null,
          state: data.address?.state || null,
          country: data.address?.country || null,
          raw: data.address,
        };
      }
    }
  } catch (error) {
    console.error("Nominatim failed, trying BigDataCloud...", error);
  }

  // Fallback to BigDataCloud
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`BigDataCloud failed: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      address: `${data.locality}, ${data.city}, ${data.principalSubdivision}, ${data.countryName}`,
      pincode: data.postcode || null,
      locality: data.locality || null,
      city: data.city || null,
      state: data.principalSubdivision || null,
      country: data.countryName || null,
      raw: data,
    };
  } catch (error) {
    console.error("Error in getAddressFromCoordinates (BigDataCloud):", error);
    throw error;
  }
}

/**
 * Calculates the Haversine distance between two points on Earth in meters.
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in meters
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance;
}
