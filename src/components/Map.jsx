"use client";
import { useState, useEffect } from "react";
import {
  APIProvider,
  Map,
  Marker,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

// 1. Inner component handles the map logic once the API is loaded
function MapContent({ address }) {
  const [coords, setCoords] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Officially recommended way to load the Geocoder in React
  const geocodingLibrary = useMapsLibrary("geocoding");

  useEffect(() => {
    if (!address) {
      setIsLoading(false);
      setCoords(null);
      return;
    }

    // Wait until the geocoding library is fully loaded by the APIProvider
    if (!geocodingLibrary) return;

    const geocoder = new geocodingLibrary.Geocoder();

    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        // results[0].geometry.location automatically handles the lat/lng coordinates
        setCoords(results[0].geometry.location);
      } else {
        console.error("Geocoding failed:", status);
        setCoords(null);
      }
      setIsLoading(false);
    });
  }, [address, geocodingLibrary]);

  // Loading State
  if (isLoading || !geocodingLibrary) {
    return (
      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading Map...</p>
      </div>
    );
  }

  // Error / Not Found State
  if (!coords) {
    return (
      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
        <p className="text-sm text-gray-500">
          {address ? "Address not found" : "No address provided"}
        </p>
      </div>
    );
  }

  // Success State: Render the Map
  return (
    <Map
      center={coords}
      defaultZoom={15}
      disableDefaultUI={true}
      zoomControl={true}
    >
      <Marker position={coords} />
    </Map>
  );
}

// 2. Outer component provides the Google Maps context
export default function AddressMiniMap({ address }) {
  return (
    // The container needs strict dimensions for the map to render correctly
    <div className="w-full h-[500px] overflow-hidden rounded-lg bg-gray-50">
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
        <MapContent address={address} />
      </APIProvider>
    </div>
  );
}