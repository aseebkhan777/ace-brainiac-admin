import React, { useState, useEffect } from 'react';
import { Dropdown } from './Dropdown';
import subjectsData from '../data/subject.json';

const SubjectDropdown = ({
  value,
  onChange,
  name,
  className = "",
  placeholder = "Select subject...",
  disabled = false,
  required = false,
  label,
  error,
  bgColor = "bg-secondary"
}) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    try {
      setSubjects(subjectsData);
      setLoading(false);
    } catch (err) {
      setLoadError("Failed to load subjects");
      setLoading(false);
    }
  }, []);

 
  const subjectOptions = !loading && subjects.length > 0 ? subjects.map(subject => ({
    value: subject.name, 
    label: subject.name,
    id: subject.id
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

  
  const selectedOption = subjects.find(subject => 
    subject.id === value || subject.name === value
  );
  
 
  const formattedValue = selectedOption ? selectedOption.name : value;

  return (
    <div className={className}>
      {label && (
        <label className="block text-gray-600 text-sm font-semibold mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {(error || loadError) && (
        <div className="text-red-500 text-xs mb-1">
          {error || loadError}
        </div>
      )}
      
      {loading ? (
        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
          Loading ..
        </div>
      ) : subjectOptions.length === 0 && !loadError ? (
        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
          No subjects available
        </div>
      ) : (
        <Dropdown
          value={formattedValue}
          onChange={handleChange}
          options={subjectOptions}
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

export default SubjectDropdown;