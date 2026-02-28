"use client";
import React from "react";
import { LoadScript } from "@react-google-maps/api";
import { usePathname } from "next/navigation";

interface LoadScriptWrapperProps {
  children: React.ReactNode;
}

const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const LoadScriptWrapper: React.FC<LoadScriptWrapperProps> = ({ children }) => {
  // Skip loading on admin pages where maps aren't needed
  const pathname = usePathname();
  const isAdminPage = pathname ? pathname.startsWith('/admin') : false;

  if (!googleMapsApiKey || isAdminPage) {
    return <>{children}</>;
  }

  return (
    <LoadScript
      googleMapsApiKey={googleMapsApiKey}
      loadingElement={<div>Loading maps...</div>}
      onError={() => console.error("Google Maps failed to load")}
      onLoad={() => console.log("Google Maps loaded successfully")}
    >
      {children}
    </LoadScript>
  );
};

export default LoadScriptWrapper;