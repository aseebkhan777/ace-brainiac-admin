import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';

// DropdownItem Component
export default function DropdownItem({ value, children, selected, onSelect }) {
  return (
    <div 
      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between ${selected ? 'bg-gray-50' : ''}`}
      onClick={() => onSelect(value)}
    >
      <span>{children}</span>
      {selected && <Check size={16} className="text-primary" />}
    </div>
  );
}

// Dropdown Component
export function Dropdown({
  className = "",
  value,
  onChange,
  name,
  options = [],
  placeholder = "Select...",
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedOption = options.find(option => option.value === value);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Handle selection
  const handleSelect = (newValue) => {
    if (onChange) {
      onChange(newValue);
    }
    setIsOpen(false);
  };
  
  // Toggle dropdown
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div 
        className={`border p-2 rounded-lg bg-white cursor-pointer flex items-center justify-between ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        onClick={toggleDropdown}
      >
        <span className={selectedOption ? 'text-black' : 'text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <DropdownItem 
              key={option.value} 
              value={option.value}
              selected={value === option.value}
              onSelect={handleSelect}
            >
              {option.label}
            </DropdownItem>
          ))}
          {options.length === 0 && (
            <div className="px-3 py-2 text-gray-500">No options available</div>
          )}
        </div>
      )}
    </div>
  );
}