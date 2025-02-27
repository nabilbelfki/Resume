"use client";
import React from "react";
import { LoadScript } from "@react-google-maps/api";

interface LoadScriptWrapperProps {
  children: React.ReactNode;
}

const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

const LoadScriptWrapper: React.FC<LoadScriptWrapperProps> = ({ children }) => {
  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>{children}</LoadScript>
  );
};

export default LoadScriptWrapper;
