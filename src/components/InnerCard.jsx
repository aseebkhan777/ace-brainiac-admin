import React from "react";
import Input from "./Input";
import { Search } from "lucide-react";
import DateFilter from "./DateFilter"; // Fixed typo in import name

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
  firstDropdownProps = {
    value: "",
    onChange: () => {},
    label: "Filter 1",
    options: []
  },
  secondDropdownProps = null, // ✅ Set default to null (optional)
  dateFilterProps = {
    selectedDate: "",
    onDateChange: () => {},
    label: "Date"
  },
  showDivider = true
}) {
  return (
    <div className={`bg-white w-full p-6 md:p-8 rounded-lg shadow-sm ${className}`}>
      {/* Search and Filters */}
      {showFilters && (
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
          {/* Search Input */}
          <div className="relative w-[50%]">
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
          
          {/* First Dropdown (Class) */}
          <select
            className="border p-2 rounded-lg bg-secondary w-full md:w-auto"
            value={firstDropdownProps.value}
            onChange={(e) => firstDropdownProps.onChange(e.target.value)}
          >
            <option value="">{firstDropdownProps.label}</option>
            {firstDropdownProps.options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Second Dropdown (Subject) - ✅ Render only if props exist */}
          {secondDropdownProps && (
            <select
              className="border p-2 rounded-lg bg-secondary w-full md:w-auto"
              value={secondDropdownProps.value}
              onChange={(e) => secondDropdownProps.onChange(e.target.value)}
            >
              <option value="">{secondDropdownProps.label}</option>
              {secondDropdownProps.options.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}

          {/* Date Filter Component */}
          <DateFilter
            label={dateFilterProps.label}
            selectedDate={dateFilterProps.selectedDate}
            onDateChange={dateFilterProps.onDateChange}
            className="w-full md:w-auto"
          />
        </div>
      )}
      
      {/* Divider Line */}
      {showDivider && <div className="h-[2px] w-full bg-primary mb-4 mt-5"></div>}

      {/* Content */}
      {children}
    </div>
  );
}