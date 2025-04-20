import React from 'react';
import Button from './Button';
import Card from './Card';

export default function Table({ 
  data = [], 
  secondColumnName = "Name", 
  onView = () => {},
  cardWidth = "w-full",
  cardHeight = "h-auto",
  cardClassName = "",
  tableClassName = "",
  buttonVariant = "secondary",
  buttonText = "View"
}) {
  return (
    <Card width={cardWidth} height={cardHeight} className={`border border-transparent bg-secondary ${cardClassName}`}>
      <div className="overflow-x-auto">
        <table className={`w-full ${tableClassName}`}>
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-4 text-left font-medium text-gray-700">#</th>
              <th className="py-2 px-4 text-left font-medium text-gray-700">{secondColumnName}</th>
              <th className="py-2 px-4 text-left font-medium text-gray-700">Class</th>
              <th className="py-2 px-4 text-right font-medium text-gray-700"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr 
                key={item.id || index} 
                className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-secondary'}`}
              >
                <td className="py-3 px-4 text-gray-700">{index + 1}</td>
                <td className="py-3 px-4 text-gray-700">{item.name}</td>
                <td className="py-3 px-4 text-gray-700">{item.class}</td>
                <td className="py-3 px-4 text-right">
                  <Button 
                    variant={buttonVariant}
                    onClick={() => onView(item)}
                    className="text-sm px-3 py-1"
                  >
                    {buttonText}
                  </Button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-500">
                  No items to display
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}