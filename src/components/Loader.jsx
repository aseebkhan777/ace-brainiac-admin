import React from 'react';
import { PacmanLoader } from "react-spinners";

export const LoadingSpinner = ({ size = "default", color = "#6366F1" }) => {
  // Size presets for the PacmanLoader
  const sizes = {
    small: 15,
    default: 25,
    large: 35
  };
  
  const loaderSize = sizes[size] || sizes.default;
  
  return (
    <div className="flex justify-center items-center">
      <PacmanLoader 
        color={color}
        size={loaderSize}
        margin={2}
      />
    </div>
  );
};

// Create a LoadingContainer for full-page or section loading
export const LoadingContainer = ({ isLoading, children }) => {
  return isLoading ? (
    <div className="flex justify-center items-center w-full h-full min-h-40">
      <LoadingSpinner />
    </div>
  ) : children;
};