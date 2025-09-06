import React, { useState, useEffect } from 'react'
import { MapPin, Layers, Filter, Search, AlertTriangle, Clock, Users, TrendingUp, Zap, Satellite, Navigation, Eye, Settings } from 'lucide-react'
import InteractiveMap from './InteractiveMap'
import { useData } from '../context/DataContext'

const MapDashboard = () => {
  const { filteredReports, reports } = useData()
  const [selectedReport, setSelectedReport] = useState(null)
  const [mapFilters, setMapFilters] = useState({
    severity: 'all',
    type: 'all',
    status: 'all',
    timeRange: '24h'
  })
  const [searchLocation, setSearchLocation] = useState('')
  const [showSidebar, setShowSidebar] = useState(true)

  // Enhanced statistics
  const mapStats = {
    totalReports: reports.length,
    activeAlerts: reports.filter(r => r.severity === 'high' && r.status !== 'resolved').length,
    verifiedReports: reports.filter(r => r.status === 'verified').length,
    coverage: '98.5%',
    responseTime: '2.3min',
    accuracy: '94%'
  }

  // Filter reports based on map filters
  const mapFilteredReports = reports.filter(report => {
    const matchesSeverity = mapFilters.severity === 'all' || report.severity === mapFilters.severity
    const matchesType = mapFilters.type === 'all' || report.type === mapFilters.type
    const matchesStatus = mapFilters.status === 'all' || report.status === mapFilters.status
    const matchesLocation = !searchLocation || 
      report.location.name.toLowerCase().includes(searchLocation.toLowerCase())
    
    return matchesSeverity && matchesType && matchesStatus && matchesLocation
  })

  const handleReportClick = (report) => {
    setSelectedReport(report)
  }

  const hazardTypes = [
    { value: 'all', label: 'All Types', count: reports.length },
    { value: 'tsunami', label: 'Tsunami', count: reports.filter(r => r.type === 'tsunami').length },
    { value: 'storm_surge', label: 'Storm Surge', count: reports.filter(r => r.type === 'storm_surge').length },
    { value: 'high_waves', label: 'High Waves', count: reports.filter(r => r.type === 'high_waves').length },
    { value: 'swell_surge', label: 'Swell Surge', count: reports.filter(r => r.type === 'swell_surge').length }
  ]

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Enhanced Sidebar */}
      {showSidebar && (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Map Control Center</h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg">
                <div className="text-lg font-bold text-blue-900">{mapStats.totalReports}</div>
                <div className="text-xs text-blue-700">Total Reports</div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-lg">
                <div className="text-lg font-bold text-red-900">{mapStats.activeAlerts}</div>
                <div className="text-xs text-red-700">Active Alerts</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg">
                <div className="text-lg font-bold text-green-900">{mapStats.verifiedReports}</div>
                <div className="text-xs text-green-700">Verified</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg">
                <div className="text-lg font-bold text-purple-900">{mapStats.coverage}</div>
                <div className="text-xs text-purple-700">Coverage</div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="space-y-4">
              {/* Location Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search location..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Severity Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Severity Level</label>
                <select
                  value={mapFilters.severity}
                  onChange={(e) => setMapFilters(prev => ({ ...prev, severity: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Severities</option>
                  <option value="high">High Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="low">Low Risk</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Status</label>
                <select
                  value={mapFilters.status}
                  onChange={(e) => setMapFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="investigating">Investigating</option>
                  <option value="verified">Verified</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>

          {/* Hazard Types */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Hazard Types</h3>
            <div className="space-y-2">
              {hazardTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setMapFilters(prev => ({ ...prev, type: type.value }))}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-sm transition-colors ${
                    mapFilters.type === type.value
                      ? 'bg-blue-100 text-blue-900 border border-blue-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="font-medium">{type.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    mapFilters.type === type.value
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {type.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Reports List */}
          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Reports</h3>
            <div className="space-y-3">
              {mapFilteredReports.slice(0, 10).map((report) => (
                <div
                  key={report.id}
                  onClick={() => handleReportClick(report)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedReport?.id === report.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        report.severity === 'high' ? 'bg-red-500 animate-pulse' :
                        report.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {report.type.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(report.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600">{report.location.name}</span>
                  </div>
                  
                  <p className="text-xs text-gray-700 line-clamp-2 mb-2">
                    {report.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      report.status === 'verified' ? 'bg-green-100 text-green-700' :
                      report.status === 'investigating' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {report.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      by {report.reporter}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Map Area */}
      <div className="flex-1 relative">
        {/* Show Sidebar Button */}
        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors"
          >
            <EyeOff className="w-5 h-5" />
          </button>
        )}

        {/* Map Header */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 px-4 py-2">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Live Monitoring</span>
            </div>
            <div className="text-gray-600">
              {mapFilteredReports.length} Reports Visible
            </div>
            <div className="text-gray-600">
              Coverage: {mapStats.coverage}
            </div>
          </div>
        </div>

        {/* Interactive Map */}
        <InteractiveMap
          reports={mapFilteredReports}
          height="100vh"
          showControls={true}
          onReportClick={handleReportClick}
        />

        {/* Selected Report Panel */}
        {selectedReport && (
          <div className="absolute bottom-4 right-4 z-[1000] w-80 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Report Details</h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Type:</span>
                <span className="text-sm text-gray-900 capitalize">
                  {selectedReport.type.replace('_', ' ')}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Severity:</span>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  selectedReport.severity === 'high' ? 'bg-red-100 text-red-800' :
                  selectedReport.severity === 'medium' ? 'bg-orange-100 text-orange-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedReport.severity}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  selectedReport.status === 'verified' ? 'bg-green-100 text-green-800' :
                  selectedReport.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {selectedReport.status}
                </span>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-700">Location:</span>
                <p className="text-sm text-gray-900 mt-1">{selectedReport.location.name}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-700">Description:</span>
                <p className="text-sm text-gray-900 mt-1 leading-relaxed">
                  {selectedReport.description}
                </p>
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Reported by {selectedReport.reporter}</span>
                  <span>{new Date(selectedReport.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MapDashboard