import React, { useEffect, useRef } from 'react'
import { MapPin, AlertTriangle } from 'lucide-react'

const HazardMap = ({ reports, interactive = false }) => {
  const mapRef = useRef(null)

  useEffect(() => {

    if (mapRef.current) {

    }
  }, [reports])

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-orange-600 bg-orange-100'
      case 'low': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeIcon = (type) => {
    return AlertTriangle
  }

  return (
    <div className="relative w-full h-full bg-blue-50 rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-teal-100">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 400 300">
            <path
              d="M50 150 Q100 120, 150 140 T250 160 Q300 150, 350 170 L350 250 Q300 240, 250 230 T150 220 Q100 210, 50 200 Z"
              fill="#e0f2fe"
              stroke="#0891b2"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      <div className="absolute inset-0">
        {reports.map((report, index) => {
          const TypeIcon = getTypeIcon(report.type)
          const x = ((report.location.lng - 68) / (97 - 68)) * 100
          const y = ((report.location.lat - 8) / (37 - 8)) * 100

          return (
            <div
              key={report.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{
                left: `${Math.max(10, Math.min(90, x))}%`,
                top: `${Math.max(10, Math.min(90, 100 - y))}%`
              }}
            >
              <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${getSeverityColor(report.severity)}`}>
                <TypeIcon className="w-4 h-4" />
              </div>

              {interactive && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-lg shadow-lg p-3 min-w-48 z-10">
                  <div className="text-sm font-semibold">{report.location.name}</div>
                  <div className="text-xs text-gray-600 capitalize">{report.type.replace('_', ' ')}</div>
                  <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${getSeverityColor(report.severity)}`}>
                    {report.severity} severity
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(report.timestamp).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3">
        <div className="text-xs font-semibold mb-2">Severity Levels</div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs">High</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-xs">Medium</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs">Low</span>
          </div>
        </div>
      </div>

      {interactive && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md">
          <button className="block p-2 hover:bg-gray-50 rounded-t-lg">+</button>
          <button className="block p-2 hover:bg-gray-50 rounded-b-lg border-t">-</button>
        </div>
      )}
    </div>
  )
}

export default HazardMap