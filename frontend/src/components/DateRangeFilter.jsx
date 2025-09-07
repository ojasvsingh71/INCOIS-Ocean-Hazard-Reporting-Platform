import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import { Calendar, X } from 'lucide-react'
import { useData } from '../context/DataContext'
import "react-datepicker/dist/react-datepicker.css"

const DateRangeFilter = () => {
  const { filters, setFilters } = useData()
  const [showCustomRange, setShowCustomRange] = useState(false)

  const dateRangeOptions = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: 'custom', label: 'Custom Range' }
  ]

  const handleDateRangeChange = (value) => {
    if (value === 'custom') {
      setShowCustomRange(true)
    } else {
      setShowCustomRange(false)
      setFilters(prev => ({
        ...prev,
        dateRange: value,
        customDateRange: { start: null, end: null }
      }))
    }
  }

  const handleCustomDateChange = (dates) => {
    const [start, end] = dates
    setFilters(prev => ({
      ...prev,
      dateRange: 'custom',
      customDateRange: { start, end }
    }))
  }

  const clearCustomRange = () => {
    setShowCustomRange(false)
    setFilters(prev => ({
      ...prev,
      dateRange: '24h',
      customDateRange: { start: null, end: null }
    }))
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="w-4 h-4 inline mr-2" />
          Date Range
        </label>
        <select
          value={filters.dateRange}
          onChange={(e) => handleDateRangeChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {dateRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {showCustomRange && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">Custom Date Range</h4>
            <button
              onClick={clearCustomRange}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Start Date
              </label>
              <DatePicker
                selected={filters.customDateRange.start}
                onChange={(date) => handleCustomDateChange([date, filters.customDateRange.end])}
                selectsStart
                startDate={filters.customDateRange.start}
                endDate={filters.customDateRange.end}
                maxDate={new Date()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholderText="Select start date"
                dateFormat="MMM d, yyyy"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                End Date
              </label>
              <DatePicker
                selected={filters.customDateRange.end}
                onChange={(date) => handleCustomDateChange([filters.customDateRange.start, date])}
                selectsEnd
                startDate={filters.customDateRange.start}
                endDate={filters.customDateRange.end}
                minDate={filters.customDateRange.start}
                maxDate={new Date()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholderText="Select end date"
                dateFormat="MMM d, yyyy"
              />
            </div>
          </div>
          
          {filters.customDateRange.start && filters.customDateRange.end && (
            <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-800">
              Selected: {filters.customDateRange.start.toLocaleDateString()} - {filters.customDateRange.end.toLocaleDateString()}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DateRangeFilter