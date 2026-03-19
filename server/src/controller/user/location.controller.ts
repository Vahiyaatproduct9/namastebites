import { Context } from "elysia";
import { calculateDistance, getAddressFromCoordinates } from "@/utils/location";
import { SERVER_LAT, SERVER_LNG } from "@/env";

export async function getLocationDetails(ctx: Context) {
  const { lat, lng } = ctx.query as { lat: string; lng: string };

  if (!lat || !lng) {
    return {
      status: 400,
      message: "Latitude and Longitude are required",
      success: false,
    };
  }
  console.log("location: ", lat, lng);
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    return {
      status: 400,
      message: "Invalid coordinates",
      success: false,
    };
  }

  // Calculate distance from server
  const distance = calculateDistance(
    latitude,
    longitude,
    SERVER_LAT,
    SERVER_LNG,
  );
  const distanceKm = distance / 1000;

  if (distanceKm > 20) {
    return {
      status: 400,
      message: "Orders more than 20km away won't be taken.",
      success: false,
      data: {
        distance: distanceKm,
      },
    };
  }

  try {
    const addressDetails = await getAddressFromCoordinates(latitude, longitude);
    console.log("addressDetails: ", addressDetails);
    return {
      status: 200,
      message: "Location details fetched successfully",
      success: true,
      data: {
        ...addressDetails,
        distance: distanceKm,
      },
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to fetch address details",
      success: false,
    };
  }
}
