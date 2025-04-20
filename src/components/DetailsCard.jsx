import React from 'react';
import Card from './Card';

export default function DetailsCard({ 
  count, 
  label, 
  textColor = "text-white",
  height = "h-36",
  width = "w-full"
}) {
  return (
    <Card 
      className={`bg-gradient-to-br from-primary to-green-700 ${textColor} flex flex-col items-center justify-center`} 
      height={height}
      width={width}
    >
      <div className="text-5xl font-bold mb-1">{count}</div>
      <div className="text-xl">{label}</div>
    </Card>
  );
};