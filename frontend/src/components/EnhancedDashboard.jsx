import React, { useState, useEffect } from 'react'
import { AlertTriangle, MapPin, Clock, Users, TrendingUp, Activity, Waves, Satellite, Shield, Globe } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useUser } from '../context/UserContext'
import HazardMap from './HazardMap'
import ReportCard from './ReportCard'
import StatCard from './StatCard'
import FilterPanel from './FilterPanel'
import WeatherWidget from './WeatherWidget'
import AlertBanner from './AlertBanner'

const EnhancedDashboard = () => {
  const { filteredReports, reports } = useData()
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState('overview')
  const [realTimeUpdates, setRealTimeUpdates] = useState(true)

  const stats = {
    totalReports: reports.length,
    activeHazards: reports.filter(r => r.status !== 'resolved').length,
    highSeverity: reports.filter(r => r.severity === 'high').length,
    last24h: reports.filter(r => {
      const reportTime = new Date(r.timestamp)
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      return reportTime > dayAgo
    }).length,
    responseTime: '2.3h',
    coverage: '98.5%'
  }

  // Enhanced stats with additional metrics
  const enhancedStats = [
    {
      title: 'Active Reports',
      value: stats.totalReports,
      icon: Activity,
      trend: '+12%',
      color: 'blue',
      description: 'Total hazard reports'
    },
    {
      title: 'Critical Alerts',
      value: stats.activeHazards,
      icon: AlertTriangle,
      trend: '-3%',
      color: 'red',
      description: 'Requiring immediate attention'
    },
    {
      title: 'Response Time',
      value: stats.responseTime,
      icon: Clock,
      trend: '-15%',
      color: 'green',
      description: 'Average response time'
    },
    {
      title: 'Coverage Area',
      value: stats.coverage,
      icon: Shield,
      trend: '+2%',
      color: 'purple',
      description: 'Coastal monitoring coverage'
    },
    {
      title: 'Satellite Data',
      value: '24/7',
      icon: Satellite,
      trend: 'Live',
      color: 'teal',
      description: 'Real-time satellite feeds'
    },
    {
      title: 'Global Network',
      value: '156',
      icon: Globe,
      trend: '+8%',
      color: 'indigo',
      description: 'Connected monitoring stations'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl shadow-lg">
                <Waves className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-teal-700 bg-clip-text text-transparent">
                  Ocean Hazard Command Center
                </h1>
                <p className="text-gray-600 mt-1">Real-time monitoring and early warning system</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <WeatherWidget />
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${realTimeUpdates ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-sm text-gray-600">
                  {realTimeUpdates ? 'Live Updates' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Banner */}
        <AlertBanner />

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {enhancedStats.map((stat, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${
                  stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  stat.color === 'red' ? 'bg-red-100 text-red-600' :
                  stat.color === 'green' ? 'bg-green-100 text-green-600' :
                  stat.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                  stat.color === 'teal' ? 'bg-teal-100 text-teal-600' :
                  'bg-indigo-100 text-indigo-600'
                }`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.trend.startsWith('+') ? 'bg-green-100 text-green-700' :
                  stat.trend.startsWith('-') ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {stat.trend}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-xs font-medium text-gray-600 mb-1">{stat.title}</div>
              <div className="text-xs text-gray-500">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm p-1">
            <nav className="flex space-x-1">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'map', label: 'Live Map', icon: MapPin },
                { id: 'reports', label: 'Reports', icon: AlertTriangle },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Hazard Distribution Map</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">Live Data</span>
                  </div>
                </div>
                <div className="h-96 rounded-lg overflow-hidden">
                  <HazardMap reports={filteredReports} />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-200 text-center">
                    <AlertTriangle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-blue-900">New Report</span>
                  </button>
                  <button className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-200 text-center">
                    <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-green-900">Verify Alert</span>
                  </button>
                  <button className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all duration-200 text-center">
                    <Satellite className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-purple-900">Satellite View</span>
                  </button>
                  <button className="p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg hover:from-teal-100 hover:to-teal-200 transition-all duration-200 text-center">
                    <TrendingUp className="w-6 h-6 text-teal-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-teal-900">Analytics</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <FilterPanel />

              {/* Enhanced Recent Alerts */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Recent Alerts</h3>
                  <span className="text-sm text-gray-500">{filteredReports.length} active</span>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {filteredReports.slice(0, 6).map((report) => (
                    <div key={report.id} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:shadow-sm transition-all duration-200">
                      <div className={`w-3 h-3 rounded-full ${
                        report.severity === 'high' ? 'bg-red-500 animate-pulse' :
                        report.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{report.location.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{report.type.replace('_', ' ')}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400">
                          {new Date(report.timestamp).toLocaleTimeString()}
                        </span>
                        <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                          report.status === 'verified' ? 'bg-green-100 text-green-700' :
                          report.status === 'investigating' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {report.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Status */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Monitoring Network</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-700">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Data Processing</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-700">Normal</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Alert System</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-700">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Interactive Hazard Map</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Real-time Updates</span>
                </div>
                <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                  <option>Satellite View</option>
                  <option>Terrain View</option>
                  <option>Ocean Depth</option>
                </select>
              </div>
            </div>
            <div className="h-[600px] rounded-lg overflow-hidden">
              <HazardMap reports={filteredReports} interactive={true} />
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <FilterPanel />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Analytics Dashboard</h3>
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Advanced analytics coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EnhancedDashboard