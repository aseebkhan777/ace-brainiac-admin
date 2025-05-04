import React from 'react';
import { Dropdown } from './Dropdown';
import useGetClasses from '../hooks/useGetClasses';

const ClassDropdown = ({
    value,
    onChange,
    name,
    className = "",
    placeholder = "Select class...",
    disabled = false,
    required = false,
    label,
    error,
    bgColor = "bg-secondary" 
}) => {
    const { classes, loading, error: classesError } = useGetClasses();
    
   
    const classOptions = !loading && classes.length > 0 ? classes.map(classItem => ({
      value: classItem.class,
      label: `Class ${classItem.class}`,
      id: classItem.id
    })) : [];
  
   
    const handleChange = (selectedValue) => {
      if (selectedValue && typeof selectedValue === 'object' && selectedValue.value) {
        onChange(selectedValue.value);
      } else if (selectedValue && selectedValue.target) {
        onChange(selectedValue.target.value);
      } else {
        onChange(selectedValue || "");
      }
    };
  
    return (
      <div className={className}>
        {label && (
          <label className="block text-gray-600 text-sm font-semibold mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        
        {(error || classesError) && (
          <div className="text-red-500 text-xs mb-1">
            {error || (classesError && "Failed to load classes")}
          </div>
        )}
        
        {loading ? (
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
            Loading ..
          </div>
        ) : classOptions.length === 0 && !classesError ? (
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
            No classes available
          </div>
        ) : (
          <Dropdown
            value={value}
            onChange={handleChange}
            options={classOptions}
            placeholder={placeholder}
            disabled={disabled || loading}
            className="w-full"
            showClearButton={true}
            bgColor={bgColor} 
          />
        )}
      </div>
    );
};

export default ClassDropdown;