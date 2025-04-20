import React, { useState } from 'react';
import Card from './Card';

const PlanDistributionChart = ({ 
  data, 
  title = "Plan Distribution",
  height = "h-64", 
  showLegend = true 
}) => {
  const [hoveredSegment, setHoveredSegment] = useState(null);
  
  // Calculate total for percentage calculations
  const total = data?.reduce((sum, item) => sum + item.value, 0) || 0;
  
  // Handle empty data case
  if (!data || data.length === 0 || total === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-4" height={height}>
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-gray-500">No data available</p>
      </Card>
    );
  }
  
  // SVG parameters
  const size = 150;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.4;
  const innerRadius = radius;
  
  // Donut chart calculations
  let startAngle = 0;
  const segments = data.map((item, index) => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const endAngle = startAngle + angle;
    
    // Calculate SVG arc path
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    
    const x1 = centerX + innerRadius * Math.cos(startRad);
    const y1 = centerY + innerRadius * Math.sin(startRad);
    const x2 = centerX + innerRadius * Math.cos(endRad);
    const y2 = centerY + innerRadius * Math.sin(endRad);
    
    // Determine if the arc should be drawn the long way around
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    // Create the SVG arc path
    const path = `
      M ${centerX} ${centerY}
      L ${x1} ${y1}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      Z
    `;
    
    const segment = {
      path,
      color: item.color,
      name: item.name,
      value: item.value,
      percentage,
      index
    };
    
    startAngle = endAngle;
    return segment;
  });
  
  // Get tooltip content
  const getTooltipContent = () => {
    if (hoveredSegment === null) return null;
    const segment = segments[hoveredSegment];
    return (
      <>
        <div className="font-medium">{segment.name}</div>
        <div>{segment.value} ({Math.round(segment.percentage * 100)}%)</div>
      </>
    );
  };
  
  return (
    <Card className="p-4 border-transparent" height={height}>
      <div className="flex flex-col h-full">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        
        <div className="flex flex-1 items-center justify-center">
          <div className="relative" style={{ width: size, height: size }}>
            {/* Donut Chart */}
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              {segments.map((segment, index) => {
                // IMPORTANT: Using direct fill color instead of Tailwind classes
                // This fixes the issue with colors not showing up
                const fillColor = (() => {
                  switch(segment.name) {
                    case 'Basic': return '#ef4444'; // red-500
                    case 'Premium': return '#3b82f6'; // blue-500 
                    case 'Deluxe': return '#a855f7'; // purple-500
                    default: return index === 0 ? '#ef4444' : 
                             index === 1 ? '#3b82f6' : 
                             index === 2 ? '#a855f7' : '#10b981'; // Default colors
                  }
                })();
                
                return (
                  <path
                    key={index}
                    d={segment.path}
                    fill={fillColor}
                    className={`transition-all duration-200 ${hoveredSegment === index ? 'opacity-100 transform scale-105' : 'opacity-100'}`}
                    onMouseEnter={() => setHoveredSegment(index)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    style={{ cursor: 'pointer', transformOrigin: `${centerX}px ${centerY}px` }}
                  />
                );
              })}
              {/* Center circle to create donut effect */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius * 0.6}
                fill="white"
              />
            </svg>
            
            {/* Total in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-sm font-medium text-gray-500">Total</span>
              <span className="text-xl font-bold">{total}</span>
            </div>
            
            {/* Hover tooltip - appears only when hovering over a segment */}
            {hoveredSegment !== null && (
              <div className="absolute left-0 right-0 -top-12 bg-white shadow-lg rounded p-2 text-center mx-auto w-32 text-sm pointer-events-none">
                {getTooltipContent()}
              </div>
            )}
          </div>
        </div>
        
        {/* Legend */}
        {showLegend && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {data.map((item, index) => {
              // Determine dot color for legend based on the segment name
              const dotColor = (() => {
                switch(item.name) {
                  case 'Basic': return 'bg-red-500';
                  case 'Premium': return 'bg-blue-500';
                  case 'Deluxe': return 'bg-purple-500';
                  default: return index === 0 ? 'bg-red-500' : 
                           index === 1 ? 'bg-blue-500' : 
                           index === 2 ? 'bg-purple-500' : 'bg-green-500';
                }
              })();
              
              return (
                <div key={index} className="flex items-center text-sm">
                  <div className={`w-3 h-3 rounded-full mr-2 ${dotColor}`}></div>
                  <span className="mr-1">{item.name}:</span>
                  <span className="font-medium">{Math.round(item.value / total * 100)}%</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

export default PlanDistributionChart;