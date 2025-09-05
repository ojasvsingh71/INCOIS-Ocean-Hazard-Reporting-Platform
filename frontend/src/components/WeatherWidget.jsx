import React, { useState, useEffect } from 'react'
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets } from 'lucide-react'

const WeatherWidget = () => {
  const [weather, setWeather] = useState({
    temperature: 28,
    condition: 'partly-cloudy',
    humidity: 65,
    windSpeed: 12,
    location: 'Chennai'
  })

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny': return Sun
      case 'cloudy': return Cloud
      case 'rainy': return CloudRain
      default: return Cloud
    }
  }

  const WeatherIcon = getWeatherIcon(weather.condition)

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm p-4 min-w-[200px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <WeatherIcon className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-900">{weather.location}</span>
        </div>
        <span className="text-lg font-bold text-gray-900">{weather.temperature}°C</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
        <div className="flex items-center space-x-1">
          <Droplets className="w-3 h-3" />
          <span>{weather.humidity}%</span>
        </div>
        <div className="flex items-center space-x-1">
          <Wind className="w-3 h-3" />
          <span>{weather.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  )
}

export default WeatherWidget