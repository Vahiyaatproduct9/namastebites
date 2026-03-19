import path from "@/app/path/path";
import { LocationType } from "@/app/types/types";

export async function saveLocation(location: LocationType) {
  // Placeholder for backend API call
  console.log("Saving location to backend:", location);
  return { success: true, message: "Location saved" };
}

export async function getLocationFromCoords(lat: number, lng: number) {
  try {
    console.log("params: ", lat, lng);
    const response = await fetch(`${path}/user/location?lat=${lat}&lng=${lng}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching location from backend:", error);
    return { success: false, message: "Failed to connect to server" };
  }
}
