import React, { useState } from 'react'
import { MapPin, Target, Crosshair } from 'lucide-react'
import { useData } from '../context/DataContext'

const ProximityFilter = () => {
  const { filters, setFilters, userLocation } = useData()
  const [customLocation, setCustomLocation] = useState({ lat: '', lng: '' })

  const handleProximityToggle = (enabled) => {
    setFilters(prev => ({
      ...prev,
      proximity: {
        ...prev.proximity,
        enabled,
        center: enabled ? (userLocation || null) : null
      }
    }))
  }

  const handleRadiusChange = (radius) => {
    setFilters(prev => ({
      ...prev,
      proximity: {
        ...prev.proximity,
        radius: parseInt(radius)
      }
    }))
  }

  const useCurrentLocation = () => {
    if (userLocation) {
      setFilters(prev => ({
        ...prev,
        proximity: {
          ...prev.proximity,
          center: userLocation
        }
      }))
    }
  }

  const useCustomLocation = () => {
    if (customLocation.lat && customLocation.lng) {
      setFilters(prev => ({
        ...prev,
        proximity: {
          ...prev.proximity,
          center: {
            lat: parseFloat(customLocation.lat),
            lng: parseFloat(customLocation.lng)
          }
        }
      }))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
          <Target className="w-4 h-4" />
          <span>Proximity Filter</span>
        </label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={filters.proximity.enabled}
            onChange={(e) => handleProximityToggle(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {filters.proximity.enabled && (
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Radius (km)
            </label>
            <select
              value={filters.proximity.radius}
              onChange={(e) => handleRadiusChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={10}>10 km</option>
              <option value={25}>25 km</option>
              <option value={50}>50 km</option>
              <option value={100}>100 km</option>
              <option value={200}>200 km</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Center Location
            </label>
            
            {userLocation && (
              <button
                onClick={useCurrentLocation}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 mb-2 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                <Crosshair className="w-4 h-4" />
                <span>Use Current Location</span>
              </button>
            )}

            <div className="space-y-2">
              <input
                type="number"
                step="any"
                placeholder="Latitude"
                value={customLocation.lat}
                onChange={(e) => setCustomLocation(prev => ({ ...prev, lat: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                step="any"
                placeholder="Longitude"
                value={customLocation.lng}
                onChange={(e) => setCustomLocation(prev => ({ ...prev, lng: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={useCustomLocation}
                disabled={!customLocation.lat || !customLocation.lng}
                className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Set Custom Location
              </button>
            </div>
          </div>

          {filters.proximity.center && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-blue-800">
                <MapPin className="w-4 h-4" />
                <span>
                  Center: {filters.proximity.center.lat.toFixed(4)}°, {filters.proximity.center.lng.toFixed(4)}°
                </span>
              </div>
              <div className="text-sm text-blue-600 mt-1">
                Showing hazards within {filters.proximity.radius} km
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ProximityFilter