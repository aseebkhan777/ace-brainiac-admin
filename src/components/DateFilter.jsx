import { useState, useEffect, useRef } from "react";
import { Calendar, X, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";

const DateFilter = ({ 
  label = "Date",
  selectedDate = "", 
  onDateChange, 
  className = "" 
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const datePickerRef = useRef(null);
  
  
  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(new Date(selectedDate));
    }
  }, []);
  
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [datePickerRef]);
  
  const clearDateFilter = (e) => {
    e.stopPropagation();
    onDateChange("");
  };
  
  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };
  
 
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };
  
 
  const selectDate = (date) => {
    // YYYY-MM-DD format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`; 
    
    onDateChange(dateString);
    setShowDatePicker(false);
  };
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    
    const firstDayOfWeek = firstDay.getDay();
    
    // Total days in month
    const totalDays = lastDay.getDate();
    
   
    const calendarDays = [];
    
   
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= totalDays; day++) {
      calendarDays.push(new Date(year, month, day));
    }
    
    return calendarDays;
  };
  
  // Get month name
  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long' });
  };
  
  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    const selected = new Date(selectedDate);
    return date.getDate() === selected.getDate() &&
           date.getMonth() === selected.getMonth() &&
           date.getFullYear() === selected.getFullYear();
  };
  
  // Days of the week
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  
  return (
    <div className="relative" ref={datePickerRef}>
      <Button 
        variant="outline"
        className={`bg-secondary border border-secondary hover:border-black flex items-center gap-2 px-4 py-2 ${selectedDate ? 'border-primary text-primary' : ''} ${className}`}
        onClick={toggleDatePicker}
      >
        <Calendar size={16} className="text-black" />
        <span className="text-black">
          {selectedDate 
            ? formatDate(selectedDate) 
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
        <div className="absolute z-10 mt-1 p-2 bg-white rounded-md shadow-lg w-64">
          {/* Month navigation */}
          <div className="flex justify-between items-center mb-2">
            <button 
              className="p-1 rounded hover:bg-gray-100" 
              onClick={prevMonth}
            >
              <ChevronLeft size={20} />
            </button>
            <div className="font-medium">
              {getMonthName(currentMonth)} {currentMonth.getFullYear()}
            </div>
            <button 
              className="p-1 rounded hover:bg-gray-100" 
              onClick={nextMonth}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500">
            {daysOfWeek.map(day => (
              <div key={day} className="p-1">{day}</div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1 mt-1">
            {generateCalendarDays().map((date, index) => (
              <div 
                key={index} 
                className={`p-1 text-center text-sm rounded cursor-pointer ${
                  !date ? 'invisible' : 
                  isSelected(date) ? 'bg-blue-500 text-white' : 
                  isToday(date) ? 'bg-gray-200' : 
                  'hover:bg-gray-100'
                }`}
                onClick={() => date && selectDate(date)}
              >
                {date ? date.getDate() : ''}
              </div>
            ))}
          </div>
          
          {/* Bottom buttons */}
          <div className="flex justify-between mt-2 pt-2 border-t">
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs"
              onClick={() => setShowDatePicker(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs"
              onClick={() => {
                const today = new Date().toISOString().split('T')[0];
                onDateChange(today);
                setShowDatePicker(false);
              }}
            >
              Today
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateFilter;