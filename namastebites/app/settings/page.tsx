"use client";
import React, { useState, useEffect } from "react";
import "./settings.css";
import useMessage from "../store/useMessage";
import { useLocation } from "../store/useLocation";
import {
  saveLocation,
  getLocationFromCoords,
} from "../functions/api/user/location";
import { LocationType } from "../types/types";
import { useRouter, useSearchParams } from "next/navigation";
import useProfile from "../store/useProfile";
import { useUser } from "@clerk/nextjs";

const Settings = () => {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromCart = searchParams.get("fromCart") === "true";

  const setMessage = useMessage((s) => s.setMessage);
  const setType = useMessage((s) => s.setType);
  const {
    locations,
    addLocation,
    removeLocation,
    setCurrentLocation,
    currentLocationId,
  } = useLocation();

  const { phone, setPhone, setName, setEmail } = useProfile();
  const [phoneInput, setPhoneInput] = useState(phone || "");

  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setEmail(user.emailAddresses[0]?.emailAddress || "");
      if (!phone && user.primaryPhoneNumber) {
        setPhone(user.primaryPhoneNumber.phoneNumber);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPhoneInput(user.primaryPhoneNumber.phoneNumber);
      }
    }
  }, [user, phone, setName, setEmail, setPhone]);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [landmark, setLandmark] = useState("");
  const [coords, setCoords] = useState<
    { lat: number; lng: number } | undefined
  >();

  const handlePhoneSave = async () => {
    if (!phoneInput || phoneInput.length < 10 || phoneInput.length > 11) {
      setType("error");
      setMessage("Please enter a valid 10 or 11 digit phone number!");
      return;
    }
    await setPhone(phoneInput);
    setType("success");
    setMessage("Phone number updated!");
  };

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Only numbers
    if (value.length <= 11) {
      setPhoneInput(value);
    }
  };

  const handleUseCurrentLocation = () => {
    console.log("get current location clicked!");
    if (!navigator.geolocation) {
      setType("error");
      setMessage("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log("postiion: ", position);
        if (!lat || !lng) {
          const response = await fetch(`https://ipapi.co/json`);
          const { latitude: lat, longitude: lng } = await response.json();
          console.log("ip location: ", lat, lng);
          setCoords({ lat, lng });
        } else {
          setCoords({ lat, lng });
        }

        const response = await getLocationFromCoords(lat, lng);
        if (response.success) {
          const { address, city, locality } = response.data;
          setAddress(locality || address.split(",")[0]);
          setCity(city || "");
          setType("success");
          setMessage(
            "Location fetched successfully! Please review the details.",
          );
        } else {
          setType("error");
          setMessage(response.message || "Failed to fetch location details");
        }
      },
      (error) => {
        setType("error");
        setMessage("Unable to retrieve your location: " + error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000,
      },
    );
  };

  const handleSave = async () => {
    if (!address || !city) {
      setType("error");
      setMessage("Address and City are required!");
      return;
    }

    const newLocation: LocationType = {
      id: crypto.randomUUID(),
      address,
      city,
      landmark,
      lat: coords?.lat,
      lng: coords?.lng,
    };

    addLocation(newLocation);

    // Set as current location if it's the first one or user explicitly saves it (user experience choice, sticking to simple logic for now)
    if (locations.length === 0) {
      setCurrentLocation(newLocation.id);
    }

    // Call backend placeholder
    await saveLocation(newLocation);

    // Reset form
    setAddress("");
    setCity("");
    setLandmark("");
    setCoords(undefined);

    setType("success");
    setMessage("Location saved successfully!");

    if (fromCart) {
      if (!phone || phone.length < 10 || phone.length > 11) {
        setType("error");
        setMessage(
          "Please save your phone number before proceeding to checkout.",
        );
        return;
      }
      router.push("/cart");
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeLocation(id);
    setType("info");
    setMessage("Location removed.");
  };

  const handleSelectLocation = (id: string) => {
    setCurrentLocation(id);
    setType("success");
    setMessage("Delivery location updated!");
    if (fromCart) {
      if (!phone || phone.length < 10 || phone.length > 11) {
        setType("error");
        setMessage(
          "Please save your phone number before proceeding to checkout.",
        );
        return;
      }
      router.push("/cart");
    }
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>Settings</h1>
      </div>
      <div className="settings-body">
        <div className="personal-info">
          <h2>Personal Information</h2>
          <div className="form-group">
            <label>Phone Number</label>
            <div className="phone-input-group">
              <input
                type="tel"
                value={phoneInput}
                onChange={handlePhoneInputChange}
                placeholder="Enter 10-11 digit phone number"
              />
              <button className="save-phone-btn" onClick={handlePhoneSave}>
                Save Phone
              </button>
            </div>
            {(!phone || phone.length < 10 || phone.length > 11) && (
              <p className="warning-text">
                Valid phone number is required for ordering.
              </p>
            )}
          </div>
        </div>

        <div className="location-form">
          <h2>Add New Location</h2>
          <div className="form-group">
            <label>Address (Local)</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g., House 123, Street 4"
            />
          </div>
          <div className="form-group">
            <label>City / Village</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g., Kolkata"
            />
          </div>
          <div className="form-group">
            <label>Landmark (Optional)</label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g., Near City Center"
            />
          </div>
          <div className="location-actions">
            <button className="geo-btn" onClick={handleUseCurrentLocation}>
              <span className="material-symbols-outlined">my_location</span>
              Use Current Location
            </button>
            <button className="save-btn" onClick={handleSave}>
              {fromCart ? "Save and go to cart" : "Save Location"}
            </button>
          </div>
        </div>

        <div className="saved-locations">
          <h2>Saved Locations</h2>
          <div className="location-list">
            {locations.length === 0 ? (
              <p style={{ color: "rgba(255,255,255,0.5)" }}>
                No locations saved yet.
              </p>
            ) : (
              locations.map((loc) => (
                <div
                  key={loc.id}
                  className={`location-item ${currentLocationId === loc.id ? "active" : ""}`}
                  onClick={() => handleSelectLocation(loc.id)}
                >
                  <div className="location-details">
                    <span className="address">
                      {loc.address}, {loc.city}
                    </span>
                    <span className="meta">
                      {loc.landmark ? `Near ${loc.landmark}` : ""}
                      {loc.lat && loc.lng ? " • GPS Set" : ""}
                    </span>
                  </div>
                  <div className="location-actions">
                    <button onClick={(e) => handleDelete(loc.id, e)}>
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
