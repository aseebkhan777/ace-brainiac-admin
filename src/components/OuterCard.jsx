import React from "react";
import Button from "./Button";

export default function OuterCard({
  title,
  children,
  buttonText,
  onButtonClick,
  className = "",
  padding = "py-24", // Default padding, but customizable
}) {
  return (
    <div className={`w-full flex justify-center ${padding}`}>
      <div
        className={`flex flex-col items-center bg-secondary rounded-2xl shadow-sm 
        px-6 py-8 w-full max-w-5xl flex-shrink-0 ${className}`}
      >
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-center w-full mb-6 gap-4 md:gap-0">
          <h1 className="text-2xl font-semibold">{title}</h1>
          {buttonText && (
            <Button
              variant="default"
              className="bg-primary text-white"
              onClick={onButtonClick}
            >
              {buttonText}
            </Button>
          )}
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}