import { APICall } from "../apiClient";
import { LocationType } from "@/app/types/types";

export async function saveLocation(location: LocationType) {
  return await APICall("/user/location/save", {
    method: "POST",
    body: location,
  });
}

export async function getLocationFromCoords(lat: number, lng: number) {
  return await APICall(`/user/location?lat=${lat}&lng=${lng}`);
}
