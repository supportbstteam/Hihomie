"use client";
import { useState, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker, // Using the new marker
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

function MapContent({ address }) {
  const [coords, setCoords] = useState({ lat: 40.4168, lng: -3.7038 }); // Default Spain
  const [isLoading, setIsLoading] = useState(false);
  
  const geocodingLibrary = useMapsLibrary("geocoding");

  useEffect(() => {
    if (!address || address.trim() === "") {
      setCoords({ lat: 40.4168, lng: -3.7038 }); // Reset to Spain if input is cleared
      return; 
    }

    if (!geocodingLibrary) return;

    setIsLoading(true);

    // 1. Set a timer to wait 800ms after the user stops typing
    const delayDebounceFn = setTimeout(() => {
      const geocoder = new geocodingLibrary.Geocoder();

      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          const location = results[0].geometry.location;
          setCoords({
            lat: location.lat(),
            lng: location.lng(),
          });
        } else {
          // Silently fail in the UI, keep the map where it is, but log it for dev
          console.log(`Geocoding paused: No exact match for "${address}" yet.`);
        }
        setIsLoading(false);
      });
    }, 800); // 800 milliseconds delay

    // 2. Cleanup function: If the user types another letter before 800ms, cancel the previous timer
    return () => clearTimeout(delayDebounceFn);

  }, [address, geocodingLibrary]);

  if (isLoading) {
    return (
      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
        <p className="text-sm text-gray-500">Locating...</p>
      </div>
    );
  }

  return (
    <Map
      style={{ width: "100%", height: "100%" }} // Required for map to show
      center={coords}
      defaultZoom={address ? 15 : 6} 
      disableDefaultUI={true}
      zoomControl={true}
      mapId="DEMO_MAP_ID" // Required for AdvancedMarker
    >
      <AdvancedMarker position={coords} />
    </Map>
  );
}

export default function AddressMiniMap({ address }) {
  return (
    <div className="w-full h-[500px] overflow-hidden rounded-lg bg-gray-50 border border-gray-200">
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
        <MapContent address={address} />
      </APIProvider>
    </div>
  );
}