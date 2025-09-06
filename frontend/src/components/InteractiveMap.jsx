import React, { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, LayersControl, useMap } from 'react-leaflet'
import { divIcon } from 'leaflet'
import { AlertTriangle, MapPin, Layers, ZoomIn, ZoomOut, Crosshair, Satellite, Navigation, Filter, Eye, EyeOff, Settings, Download, Share2, Maximize2 } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility'

const InteractiveMap = ({ reports = [], onReportClick, height = '600px', showControls = true }) => {
  const [mapView, setMapView] = useState('satellite')
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [showTrafficLayer, setShowTrafficLayer] = useState(false)
  const [showWeatherLayer, setShowWeatherLayer] = useState(false)
  const [selectedSeverity, setSelectedSeverity] = useState('all')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [mapCenter, setMapCenter] = useState([13.0827, 80.2707]) // Chennai
  const [mapZoom, setMapZoom] = useState(6)
  const mapRef = useRef()

  // Enhanced map layers
  const mapLayers = {
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    },
    street: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors'
    },
    terrain: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenTopoMap contributors'
    },
    ocean: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
    }
  }

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => console.log('Location access denied')
      )
    }
  }, [])

  // Create custom markers for different hazard types and severities
  const createCustomMarker = (report) => {
    const severityColors = {
      high: '#dc2626',
      medium: '#ea580c',
      low: '#fbbf24'
    }

    const typeIcons = {
      tsunami: '🌊',
      storm_surge: '⛈️',
      high_waves: '🌊',
      swell_surge: '〰️',
      coastal_erosion: '🏖️',
      abnormal_tide: '🌀'
    }

    const color = severityColors[report.severity] || '#6b7280'
    const icon = typeIcons[report.type] || '⚠️'
    const pulseClass = report.severity === 'high' ? 'animate-pulse' : ''

    return divIcon({
      html: `
        <div class="relative">
          <div class="w-10 h-10 rounded-full border-3 border-white shadow-lg flex items-center justify-center text-lg ${pulseClass}" 
               style="background-color: ${color}; border-width: 3px;">
            ${icon}
          </div>
          ${report.severity === 'high' ? `
            <div class="absolute inset-0 rounded-full border-2 animate-ping opacity-75" 
                 style="border-color: ${color};"></div>
          ` : ''}
        </div>
      `,
      className: 'custom-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    })
  }

  // Filter reports based on selected severity
  const filteredReports = reports.filter(report => 
    selectedSeverity === 'all' || report.severity === selectedSeverity
  )

  // Map control component
  const MapControls = () => {
    const map = useMap()

    const handleZoomIn = () => map.zoomIn()
    const handleZoomOut = () => map.zoomOut()
    const handleLocate = () => {
      if (userLocation) {
        map.setView(userLocation, 12)
      }
    }
    const handleCenter = () => map.setView(mapCenter, mapZoom)

    return null
  }

  // Weather overlay component (simulated)
  const WeatherOverlay = () => {
    if (!showWeatherLayer) return null
    
    const weatherData = [
      { position: [13.0827, 80.2707], temp: 28, condition: 'sunny' },
      { position: [9.9312, 76.2673], temp: 26, condition: 'cloudy' },
      { position: [15.2993, 74.1240], temp: 30, condition: 'rainy' }
    ]

    return (
      <>
        {weatherData.map((weather, index) => (
          <Marker
            key={`weather-${index}`}
            position={weather.position}
            icon={divIcon({
              html: `
                <div class="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200 text-xs">
                  <div class="font-bold text-blue-600">${weather.temp}°C</div>
                  <div class="text-gray-600">${weather.condition}</div>
                </div>
              `,
              className: 'weather-marker',
              iconSize: [60, 40],
              iconAnchor: [30, 40]
            })}
          />
        ))}
      </>
    )
  }

  // Evacuation zones (simulated)
  const evacuationZones = [
    {
      center: [13.0827, 80.2707],
      radius: 5000,
      color: '#dc2626',
      fillColor: '#dc2626',
      fillOpacity: 0.1,
      zone: 'High Risk Zone - Chennai'
    },
    {
      center: [9.9312, 76.2673],
      radius: 3000,
      color: '#ea580c',
      fillColor: '#ea580c',
      fillOpacity: 0.1,
      zone: 'Medium Risk Zone - Kochi'
    }
  ]

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`} style={{ height: isFullscreen ? '100vh' : height }}>
      {/* Enhanced Map Controls */}
      {showControls && (
        <div className="absolute top-4 left-4 z-[1000] space-y-2">
          {/* Layer Control */}
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-2">
            <div className="grid grid-cols-2 gap-1">
              {Object.entries(mapLayers).map(([key, layer]) => (
                <button
                  key={key}
                  onClick={() => setMapView(key)}
                  className={`px-3 py-2 text-xs font-medium rounded transition-colors ${
                    mapView === key
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200">
            <button
              onClick={() => mapRef.current?.zoomIn()}
              className="block p-3 hover:bg-gray-50 rounded-t-lg transition-colors border-b border-gray-200"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => mapRef.current?.zoomOut()}
              className="block p-3 hover:bg-gray-50 rounded-b-lg transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Controls */}
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200">
            <button
              onClick={() => {
                if (userLocation && mapRef.current) {
                  mapRef.current.setView(userLocation, 12)
                }
              }}
              className="block p-3 hover:bg-gray-50 rounded-t-lg transition-colors border-b border-gray-200"
              title="My Location"
            >
              <Crosshair className="w-4 h-4" />
            </button>
            <button
              onClick={() => mapRef.current?.setView(mapCenter, mapZoom)}
              className="block p-3 hover:bg-gray-50 rounded-b-lg transition-colors"
              title="Center Map"
            >
              <Navigation className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Right Panel Controls */}
      {showControls && (
        <div className="absolute top-4 right-4 z-[1000] space-y-2">
          {/* Severity Filter */}
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-3">
            <div className="text-xs font-medium text-gray-700 mb-2">Filter by Severity</div>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded px-2 py-1"
            >
              <option value="all">All Severities</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>

          {/* Layer Toggles */}
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-3">
            <div className="text-xs font-medium text-gray-700 mb-2">Overlays</div>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-xs">
                <input
                  type="checkbox"
                  checked={showWeatherLayer}
                  onChange={(e) => setShowWeatherLayer(e.target.checked)}
                  className="w-3 h-3"
                />
                <span>Weather Data</span>
              </label>
              <label className="flex items-center space-x-2 text-xs">
                <input
                  type="checkbox"
                  checked={showHeatmap}
                  onChange={(e) => setShowHeatmap(e.target.checked)}
                  className="w-3 h-3"
                />
                <span>Risk Zones</span>
              </label>
            </div>
          </div>

          {/* Map Actions */}
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="block p-3 hover:bg-gray-50 rounded-t-lg transition-colors border-b border-gray-200 w-full"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4 mx-auto" />
            </button>
            <button
              className="block p-3 hover:bg-gray-50 transition-colors border-b border-gray-200 w-full"
              title="Download Map"
            >
              <Download className="w-4 h-4 mx-auto" />
            </button>
            <button
              className="block p-3 hover:bg-gray-50 rounded-b-lg transition-colors w-full"
              title="Share Map"
            >
              <Share2 className="w-4 h-4 mx-auto" />
            </button>
          </div>
        </div>
      )}

      {/* Map Legend */}
      {showControls && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-4">
          <div className="text-sm font-semibold mb-3">Hazard Severity</div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-600"></div>
              <span className="text-xs">High Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-orange-600"></div>
              <span className="text-xs">Medium Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-xs">Low Risk</span>
            </div>
          </div>
          {userLocation && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Crosshair className="w-4 h-4 text-blue-600" />
                <span className="text-xs">Your Location</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Status Bar */}
      {showControls && (
        <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 px-3 py-2">
          <div className="flex items-center space-x-4 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Data</span>
            </div>
            <div>{filteredReports.length} Reports</div>
            <div>Zoom: {mapZoom}</div>
          </div>
        </div>
      )}

      {/* Main Map */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        className="z-0"
      >
        <MapControls />
        
        {/* Base Layer */}
        <TileLayer
          url={mapLayers[mapView].url}
          attribution={mapLayers[mapView].attribution}
        />

        {/* Weather Overlay */}
        <WeatherOverlay />

        {/* Evacuation Zones */}
        {showHeatmap && evacuationZones.map((zone, index) => (
          <Circle
            key={`zone-${index}`}
            center={zone.center}
            radius={zone.radius}
            pathOptions={{
              color: zone.color,
              fillColor: zone.fillColor,
              fillOpacity: zone.fillOpacity,
              weight: 2
            }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{zone.zone}</div>
                <div className="text-gray-600">Evacuation Zone</div>
              </div>
            </Popup>
          </Circle>
        ))}

        {/* User Location */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={divIcon({
              html: `
                <div class="relative">
                  <div class="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
                  <div class="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-75"></div>
                </div>
              `,
              className: 'user-location-marker',
              iconSize: [16, 16],
              iconAnchor: [8, 8]
            })}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">Your Location</div>
                <div className="text-gray-600">Current Position</div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Hazard Reports */}
        {filteredReports.map((report) => (
          <Marker
            key={report.id}
            position={[report.location.lat, report.location.lng]}
            icon={createCustomMarker(report)}
            eventHandlers={{
              click: () => onReportClick && onReportClick(report)
            }}
          >
            <Popup maxWidth={300}>
              <div className="p-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 capitalize">
                    {report.type.replace('_', ' ')}
                  </h4>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    report.severity === 'high' ? 'bg-red-100 text-red-800' :
                    report.severity === 'medium' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.severity}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-600">{report.location.name}</span>
                  </div>
                  
                  <p className="text-gray-700 text-xs leading-relaxed">
                    {report.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-xs text-gray-500">
                      {new Date(report.timestamp).toLocaleString()}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      report.status === 'verified' ? 'bg-green-100 text-green-700' :
                      report.status === 'investigating' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Coastal Lines (simulated) */}
        <Polyline
          positions={[
            [8.4875, 76.9525], // Kerala coast
            [11.1271, 78.6569], // Tamil Nadu coast
            [13.0827, 80.2707], // Chennai
            [17.6868, 83.2185], // Andhra Pradesh coast
          ]}
          pathOptions={{ color: '#0ea5e9', weight: 3, opacity: 0.7 }}
        />
      </MapContainer>

      {/* Fullscreen Exit Button */}
      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 z-[1001] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

export default InteractiveMap