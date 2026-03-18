"use client";
import { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px", // "Short view" height
  borderRadius: "8px",
};

export default function AddressMiniMap({ address }) {
  // Removed TS Type annotation
  const [coords, setCoords] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (!address || !isLoaded) return;

    const fetchCoords = async () => {
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
          )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );
        const data = await res.json();
        
        if (data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setCoords({ lat, lng });
        } else {
          setCoords(null);
        }
      } catch (error) {
        console.error("Geocoding failed:", error);
        setCoords(null);
      }
    };

    fetchCoords();
  }, [address, isLoaded]);

  if (!isLoaded) return <div>Loading Map...</div>;

  return coords ? (
    <GoogleMap 
        mapContainerStyle={containerStyle} 
        center={coords} 
        zoom={15}
        options={{
            disableDefaultUI: true, 
            zoomControl: true,
        }}
    >
      <Marker position={coords} />
    </GoogleMap>
  ) : (
    <div className="h-[500px] bg-gray-100 flex items-center justify-center rounded-lg">
      <p className="text-sm text-gray-500">
        {address ? "Address not found" : "No address provided"}
      </p>
    </div>
  );
}