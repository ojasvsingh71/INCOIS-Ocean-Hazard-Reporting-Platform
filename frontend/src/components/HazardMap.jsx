import React, { useEffect, useRef } from 'react'
import { MapPin, AlertTriangle, Layers, ZoomIn, ZoomOut } from 'lucide-react'

const HazardMap = ({ reports, interactive = false }) => {
  const mapRef = useRef(null)
  const [mapView, setMapView] = React.useState('satellite')
  const [zoom, setZoom] = React.useState(1)

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
    <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-teal-100 rounded-lg overflow-hidden shadow-inner">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 400 300">
            {/* Enhanced coastline */}
            <path
              d="M30 120 Q80 100, 130 115 T220 135 Q270 125, 320 145 L320 280 Q270 270, 220 260 T130 250 Q80 240, 30 230 Z"
              fill="#bfdbfe"
              stroke="#0369a1"
              strokeWidth="2"
            />
            {/* Ocean depth indicators */}
            <circle cx="100" cy="180" r="3" fill="#0ea5e9" opacity="0.6" />
            <circle cx="200" cy="200" r="2" fill="#0ea5e9" opacity="0.4" />
            <circle cx="280" cy="190" r="4" fill="#0ea5e9" opacity="0.8" />
            {/* Wave patterns */}
            <path d="M50 160 Q70 155, 90 160 T130 160" stroke="#0891b2" strokeWidth="1" fill="none" opacity="0.5" />
            <path d="M150 170 Q170 165, 190 170 T230 170" stroke="#0891b2" strokeWidth="1" fill="none" opacity="0.5" />
          </svg>
        </div>
      </div>

      <div className="absolute inset-0">
        {reports.map((report, index) => {
          const TypeIcon = getTypeIcon(report.type)
          const x = ((report.location.lng - 68) / (97 - 68)) * 100 * zoom
          const y = ((report.location.lat - 8) / (37 - 8)) * 100 * zoom

          return (
            <div
              key={report.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all duration-300 hover:scale-110"
              style={{
                left: `${Math.max(10, Math.min(90, x))}%`,
                top: `${Math.max(10, Math.min(90, 100 - y))}%`
              }}
            >
              <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-all duration-200 ${getSeverityColor(report.severity)} ${
                report.severity === 'high' ? 'animate-pulse' : ''
              }`}>
                <TypeIcon className="w-4 h-4" />
              </div>
              
              {/* Ripple effect for high severity */}
              {report.severity === 'high' && (
                <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-75"></div>
              )}

              {interactive && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 p-4 min-w-56 z-10">
                  <div className="text-sm font-semibold text-gray-900 mb-1">{report.location.name}</div>
                  <div className="text-xs text-gray-600 capitalize mb-2">{report.type.replace('_', ' ')}</div>
                  <div className={`text-xs px-2 py-1 rounded-full inline-block mb-2 ${getSeverityColor(report.severity)}`}>
                    {report.severity} severity
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    Reporter: {report.reporter}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(report.timestamp).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-3">
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
        <div className="absolute top-4 right-4 space-y-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200">
            <button 
              onClick={() => setZoom(prev => Math.min(prev + 0.2, 2))}
              className="block p-2 hover:bg-gray-50 rounded-t-lg transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))}
              className="block p-2 hover:bg-gray-50 rounded-b-lg border-t transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-2">
            <select 
              value={mapView} 
              onChange={(e) => setMapView(e.target.value)}
              className="text-xs border-none bg-transparent focus:outline-none"
            >
              <option value="satellite">Satellite</option>
              <option value="terrain">Terrain</option>
              <option value="ocean">Ocean Depth</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}

export default HazardMap