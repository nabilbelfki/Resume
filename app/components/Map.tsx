import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Location } from "./types";

const containerStyle = {
  width: "100%",
  height: "550px",
  borderRadius: "10px",
};

const options = {
  mapTypeControl: false, // Remove map/satellite toggle
  fullscreenControl: false, // Remove fullscreen control
  streetViewControl: false, // Remove pegman
  disableDefaultUI: true, // Disable all default UI
  keyboardShortcuts: false, // Disable keyboard shortcuts
};

// Custom SVG Marker
const svgMarker = {
  url:
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`<svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_381_34)">
<path d="M7.50916 4.02341C6.62326 4.14166 5.80615 4.5545 5.17247 5.20385C4.53254 5.8618 4.1365 6.70896 4.0281 7.64643C3.97182 8.13882 3.99892 8.57746 4.11982 9.0978C4.47626 10.6201 5.63731 12.5123 7.39868 14.441C7.85309 14.9376 7.9198 15 8.00109 15C8.0803 15 8.20328 14.8817 8.68688 14.3442C10.6275 12.1854 11.7698 10.1815 11.9699 8.58606C12.1221 7.37121 11.6906 6.10047 10.8235 5.20385C10.2273 4.5889 9.49565 4.19972 8.63477 4.04491C8.37004 3.99545 7.79264 3.9847 7.50916 4.02341ZM8.44717 6.28753C9.12462 6.47889 9.60196 6.97558 9.78331 7.68084C9.83959 7.9023 9.8375 8.35169 9.77705 8.58176C9.65407 9.04834 9.37892 9.44827 9.00789 9.69554C7.81974 10.489 6.26265 9.68264 6.17093 8.22913C6.13758 7.69589 6.33144 7.17555 6.70664 6.78637C6.98179 6.5047 7.29446 6.33268 7.67591 6.25743C7.87185 6.21872 8.2554 6.23378 8.44717 6.28753Z" fill="#011A49"/>
<path d="M8.47435 6.1913L8.47416 6.19124C8.36735 6.1613 8.21462 6.14365 8.06701 6.13788L8.47435 6.1913ZM8.47435 6.1913C9.18737 6.39271 9.69028 6.91752 9.88016 7.65593L9.88023 7.65621M8.47435 6.1913L9.88023 7.65621M9.88023 7.65621C9.91143 7.77898 9.92502 7.95647 9.92395 8.12869C9.92289 8.30107 9.90707 8.48045 9.87377 8.60717L9.87375 8.60724M9.88023 7.65621L9.87375 8.60724M9.87375 8.60724C9.74516 9.09512 9.45666 9.51661 9.06342 9.7787C7.80724 10.6175 6.1674 9.76108 6.07113 8.23543L6.07113 8.23537M9.87375 8.60724L6.07113 8.23537M6.07113 8.23537C6.03599 7.67362 6.24033 7.12597 6.63465 6.71696L6.63511 6.71649M6.07113 8.23537L6.63511 6.71649M6.63511 6.71649C6.92395 6.4208 7.25464 6.23862 7.65654 6.15932L6.63511 6.71649ZM7.52268 4.12249L7.52239 4.12253C6.65909 4.23777 5.86246 4.64003 5.24416 5.27357C4.62017 5.91513 4.23341 6.74157 4.12745 7.65783C4.07256 8.13808 4.09874 8.56517 4.2172 9.07505C4.56796 10.573 5.71584 12.4499 7.47246 14.3735C7.70082 14.6231 7.82791 14.7592 7.90786 14.8335C7.9697 14.8909 7.99144 14.8994 7.99828 14.9002C7.99978 14.8998 8.00625 14.8976 8.01947 14.8891C8.0416 14.8748 8.07406 14.8485 8.1232 14.8014C8.22109 14.7077 8.37016 14.5467 8.61251 14.2773C10.5491 12.1231 11.6744 10.1382 11.8707 8.57363C12.019 7.38955 11.5982 6.14874 10.7516 5.27337C10.1702 4.6737 9.45758 4.29448 8.61707 4.14333L8.61641 4.14321C8.49228 4.12002 8.28833 4.10508 8.0771 4.10108C7.86618 4.09708 7.65691 4.10416 7.52268 4.12249ZM8.00109 14.9C7.99972 14.9 7.99877 14.9001 7.99829 14.9002C8.00017 14.9004 8.00092 14.9001 8.00107 14.9C8.00108 14.9 8.00109 14.9 8.00109 14.9Z" stroke="white" stroke-width="0.2"/>
</g>
<defs>
<filter id="filter0_d_381_34" x="0" y="0" width="16" height="19" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_381_34"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_381_34" result="shape"/>
</filter>
</defs>
</svg>
`),
};

interface MapProps {
  location: Location;
}

const Map: React.FC<MapProps> = ({ location }) => {
  const initialCenter = {
    lat: location.latitude,
    lng: location.longitude,
  };

  const googleMapsApiKey = process.env
    .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

  if (!googleMapsApiKey) {
    throw new Error("Google Maps API key is not defined");
  }

  // Manually adjust the center by a small longitude offset
  const longitudeOffset = 0.265; // Adjust this value as needed
  const adjustedCenter = {
    lat: location.latitude,
    lng: location.longitude - longitudeOffset,
  };

  // Function to handle the Marker load
  const handleMarkerLoad = (marker: google.maps.Marker) => {
    // Now that the map is loaded, update the scaledSize of the SVG marker
    marker.setIcon({
      ...svgMarker,
      scaledSize: new window.google.maps.Size(64, 76),
    });
  };

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={adjustedCenter}
        zoom={10}
        options={options}
      >
        <Marker
          position={initialCenter}
          icon={svgMarker}
          onLoad={handleMarkerLoad}
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
