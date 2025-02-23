import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "550px",
  borderRadius: "10px",
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

const options = {
  mapTypeControl: false, // Remove map/satellite toggle
  fullscreenControl: false, // Remove fullscreen control
  streetViewControl: false, // Remove pegman
  disableDefaultUI: true, // Disable all default UI
  keyboardShortcuts: false, // Disable keyboard shortcuts
};

const Map = () => {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        options={options}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
