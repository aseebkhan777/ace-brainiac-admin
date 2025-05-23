import React from "react";
import Input from "./Input";
import { Search } from "lucide-react";
import DateFilter from "./DateFilter";
import ClassDropdown from "./ClassDropdown";
import SubjectDropdown from "./SubjectDropdown";

export default function InnerCard({ 
  children,
  className = "",
  showFilters = true,
  searchProps = {
    value: "",
    onChange: () => {},
    placeholder: "Search...",
    showSearchIcon: true
  },
  firstDropdownProps = null, 
  secondDropdownProps = null,
  dateFilterProps = null, 
  showDivider = true,
  classDropdownProps = null,
  subjectDropdownProps = null
}) {
  return (
    <div className={`bg-white w-full p-6 md:p-8 rounded-lg shadow-sm ${className}`}>
      {/* Search and Filters */}
      {showFilters && (
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
          
          <div className="relative w-full md:w-[40%]">
            <Input
              placeholder={searchProps.placeholder}
              value={searchProps.value}
              onChange={searchProps.onChange}
              className="w-full pr-10"
            />
            {searchProps.showSearchIcon && (
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            )}
          </div>
          
         
          {firstDropdownProps && (
            <select
              className="border p-2 rounded-lg bg-secondary w-full md:w-auto"
              value={firstDropdownProps.value || ""}
              onChange={(e) => {
                
                if (typeof firstDropdownProps.onChange === 'function') {
                  firstDropdownProps.onChange({
                    target: { value: e.target.value }
                  });
                }
              }}
            >
              {firstDropdownProps.placeholder && (
                <option value="">{firstDropdownProps.placeholder || firstDropdownProps.label || "Select..."}</option>
              )}
              {Array.isArray(firstDropdownProps.options) && firstDropdownProps.options.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}

        
          {classDropdownProps && (
            <ClassDropdown
              value={classDropdownProps.value}
              onChange={classDropdownProps.onChange}
              placeholder={classDropdownProps.placeholder || "Select class..."}
              className="w-full md:w-auto bg-secondary"
              required={classDropdownProps.required}
              error={classDropdownProps.error}
            />
          )}

          {/* Subject Dropdown */}
          {subjectDropdownProps && (
            <SubjectDropdown
              value={subjectDropdownProps.value}
              onChange={subjectDropdownProps.onChange}
              placeholder={subjectDropdownProps.placeholder || "Select subject..."}
              className="w-full md:w-auto bg-secondary"
              required={subjectDropdownProps.required}
              error={subjectDropdownProps.error}
            />
          )}

          {/* Second Dropdown (optional) */}
          {secondDropdownProps && (
            <select
              className="border p-2 rounded-lg bg-secondary w-full md:w-auto"
              value={secondDropdownProps.value || ""}
              onChange={(e) => {
                // Create a fake event object if the parent expects an event
                if (typeof secondDropdownProps.onChange === 'function') {
                  secondDropdownProps.onChange({
                    target: { value: e.target.value }
                  });
                }
              }}
            >
              {secondDropdownProps.placeholder && (
                <option value="">{secondDropdownProps.placeholder || secondDropdownProps.label || "Select..."}</option>
              )}
              {Array.isArray(secondDropdownProps.options) && secondDropdownProps.options.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}

          {/* Date Filter Component (optional) */}
          {dateFilterProps && (
            <DateFilter
              label={dateFilterProps.label}
              selectedDate={dateFilterProps.selectedDate}
              onDateChange={dateFilterProps.onDateChange}
              className="w-full md:w-auto"
            />
          )}
        </div>
      )}
      
      {/* Divider Line */}
      {showDivider && <div className="h-[2px] w-full bg-primary mb-4 mt-5"></div>}

      {/* Content */}
      {children}
    </div>
  );
}