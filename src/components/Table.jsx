import React from 'react';
import Button from './Button';
import Card from './Card';

export default function Table({ 
  data = [], 
  columns = [
    { key: 'id', label: '#', isIndex: true },
    { key: 'name', label: 'Name' },
    { key: 'class', label: 'Class' }
  ],
  onView = () => {},
  cardWidth = "w-full",
  cardHeight = "h-auto",
  cardClassName = "",
  tableClassName = "",
  buttonVariant = "secondary",
  buttonText = "View",
  showViewButton = true
}) {
  return (
    <Card width={cardWidth} height={cardHeight} className={`border border-transparent bg-secondary ${cardClassName}`}>
      <div className="overflow-x-auto">
        <table className={`w-full ${tableClassName}`}>
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((column, index) => (
                <th 
                  key={index} 
                  className="py-2 px-4 text-left font-medium text-gray-700"
                >
                  {column.label}
                </th>
              ))}
              {showViewButton && (
                <th className="py-2 px-4 text-right font-medium text-gray-700"></th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => (
              <tr 
                key={item.id || rowIndex} 
                className={`border-b border-gray-200 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-secondary'}`}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="py-3 px-4 text-gray-700">
                    {column.isIndex ? rowIndex + 1 : item[column.key]}
                  </td>
                ))}
                {showViewButton && (
                  <td className="py-3 px-4 text-right">
                    <Button 
                      variant={buttonVariant}
                      onClick={() => onView(item)}
                      className="text-sm px-3 py-1"
                    >
                      {buttonText}
                    </Button>
                  </td>
                )}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length + (showViewButton ? 1 : 0)} className="py-6 text-center text-gray-500">
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