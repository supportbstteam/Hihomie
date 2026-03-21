"use client";
import React, { useState, useEffect } from "react";
import {
  Map,
  AdvancedMarker,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

export default function AddressMiniMap({ address, manualLocation }) {
  // Default coordinates (e.g., Madrid)
  const [coords, setCoords] = useState({ lat: 40.4168, lng: -3.7038 });
  const geocodingLib = useMapsLibrary("geocoding");

  // Priority 1: If user selects a specific place from the Autocomplete dropdown
  useEffect(() => {
    if (manualLocation) {
      setCoords({
        // Handle both Google Maps class methods and plain objects just in case
        lat: typeof manualLocation.lat === 'function' ? manualLocation.lat() : manualLocation.lat,
        lng: typeof manualLocation.lng === 'function' ? manualLocation.lng() : manualLocation.lng,
      });
    }
  }, [manualLocation]);

  // Priority 2: If the user manually types an address without selecting a suggestion
  useEffect(() => {
    // Skip if there's no address text or library hasn't loaded yet
    if (!address || !geocodingLib) return;

    // Debounce the geocoding request by 800ms so we don't spam the API on every keystroke
    const timer = setTimeout(() => {
      const geocoder = new geocodingLib.Geocoder();
      
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results[0]) {
          const loc = results[0].geometry.location;
          setCoords({ lat: loc.lat(), lng: loc.lng() });
        }
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [address, geocodingLib]);

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-lg bg-gray-50 border border-gray-200">
      <Map
        style={{ width: "100%", height: "100%" }}
        center={coords}
        // Dynamically zoom in closer if an address or location is provided
        zoom={address || manualLocation ? 16 : 6} 
        mapId="DEMO_MAP_ID" // Required to use AdvancedMarker
        disableDefaultUI={true}
        zoomControl={true}
      >
        <AdvancedMarker position={coords} />
      </Map>
    </div>
  );
}