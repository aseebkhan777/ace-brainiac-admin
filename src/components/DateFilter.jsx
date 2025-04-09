import { useState } from "react";
import { Calendar, X } from "lucide-react";
import Button from "./Button";

const DateFilter = ({ 
  label = "Date",
  selectedDate = "", 
  onDateChange, 
  className = "" 
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const handleDateSelection = (e) => {
    const newDate = e.target.value;
    onDateChange(newDate);
    setShowDatePicker(false);
  };
  
  const clearDateFilter = (e) => {
    e.stopPropagation();
    onDateChange("");
  };
  
  return (
    <div className="relative">
      <Button 
        variant="outline"
        className={`bg-secondary border border-secondary hover:border-black flex items-center gap-2 px-4 py-2 ${selectedDate ? 'border-primary text-primary' : ''} ${className}`}
        onClick={() => setShowDatePicker(!showDatePicker)}
      >
        <Calendar size={16} className="text-black" />
        <span className="text-black">
          {selectedDate 
            ? new Date(selectedDate).toLocaleDateString() 
            : label}
        </span>
        {selectedDate && (
          <X 
            size={14} 
            className="ml-2 text-gray-500 hover:text-gray-700" 
            onClick={clearDateFilter} 
          />
        )}
      </Button>
      
      {showDatePicker && (
        <div className="absolute z-10 mt-1 p-2 bg-white rounded-md shadow-lg">
          <input 
            type="date" 
            className="border rounded p-2"
            value={selectedDate}
            onChange={handleDateSelection}
          />
        </div>
      )}
    </div>
  );
};

export default DateFilter;