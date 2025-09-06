import React, { useState, useEffect } from 'react'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter } from 'recharts'
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity, Calendar, MapPin, Download, Share2, Filter, RefreshCw, Zap, AlertTriangle, Users, Clock, Target } from 'lucide-react'
import { useData } from '../context/DataContext'

const EnhancedAnalytics = () => {
  const { reports } = useData()
  const [activeChart, setActiveChart] = useState('overview')
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('reports')
  const [isRealTime, setIsRealTime] = useState(true)
  const [analyticsData, setAnalyticsData] = useState({})

  // Enhanced chart data generation
  const generateAnalyticsData = () => {
    const trendData = [
      { date: 'Mon', reports: 12, verified: 8, resolved: 6, responseTime: 2.5, accuracy: 94 },
      { date: 'Tue', reports: 19, verified: 14, resolved: 10, responseTime: 2.1, accuracy: 96 },
      { date: 'Wed', reports: 8, verified: 6, resolved: 4, responseTime: 3.2, accuracy: 92 },
      { date: 'Thu', reports: 25, verified: 18, resolved: 15, responseTime: 1.8, accuracy: 97 },
      { date: 'Fri', reports: 16, verified: 11, resolved: 8, responseTime: 2.3, accuracy: 95 },
      { date: 'Sat', reports: 22, verified: 15, resolved: 12, responseTime: 2.0, accuracy: 96 },
      { date: 'Sun', reports: 14, verified: 10, resolved: 7, responseTime: 2.7, accuracy: 93 }
    ]

    const hazardTypeData = [
      { name: 'Tsunami', value: 35, color: '#dc2626', trend: '+12%' },
      { name: 'Storm Surge', value: 28, color: '#ea580c', trend: '+8%' },
      { name: 'High Waves', value: 22, color: '#d97706', trend: '-3%' },
      { name: 'Swell Surge', value: 15, color: '#65a30d', trend: '+15%' }
    ]

    const locationAnalytics = [
      { location: 'Tamil Nadu', reports: 45, severity: 3.2, responseTime: 2.1, accuracy: 96 },
      { location: 'Kerala', reports: 32, severity: 2.8, responseTime: 2.5, accuracy: 94 },
      { location: 'Karnataka', reports: 28, severity: 2.5, responseTime: 2.8, accuracy: 92 },
      { location: 'Andhra Pradesh', reports: 25, severity: 3.0, responseTime: 2.3, accuracy: 95 },
      { location: 'Goa', reports: 18, severity: 2.2, responseTime: 3.1, accuracy: 91 }
    ]

    const performanceMetrics = [
      { metric: 'Response Time', current: 2.3, target: 2.0, unit: 'hours' },
      { metric: 'Accuracy Rate', current: 94, target: 95, unit: '%' },
      { metric: 'Coverage Area', current: 98.5, target: 99, unit: '%' },
      { metric: 'User Satisfaction', current: 4.2, target: 4.5, unit: '/5' },
      { metric: 'System Uptime', current: 99.8, target: 99.9, unit: '%' },
      { metric: 'Alert Speed', current: 1.2, target: 1.0, unit: 'seconds' }
    ]

    const riskAssessment = [
      { zone: 'Zone A', risk: 85, population: 250000, preparedness: 78 },
      { zone: 'Zone B', risk: 72, population: 180000, preparedness: 82 },
      { zone: 'Zone C', risk: 65, population: 320000, preparedness: 75 },
      { zone: 'Zone D', risk: 58, population: 150000, preparedness: 88 },
      { zone: 'Zone E', risk: 45, population: 200000, preparedness: 85 }
    ]

    return {
      trendData,
      hazardTypeData,
      locationAnalytics,
      performanceMetrics,
      riskAssessment
    }
  }

  useEffect(() => {
    setAnalyticsData(generateAnalyticsData())
    
    // Real-time updates
    if (isRealTime) {
      const interval = setInterval(() => {
        setAnalyticsData(generateAnalyticsData())
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [isRealTime])

  const chartTypes = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'distribution', label: 'Distribution', icon: PieChartIcon },
    { id: 'performance', label: 'Performance', icon: Target },
    { id: 'risk', label: 'Risk Analysis', icon: AlertTriangle },
    { id: 'geographic', label: 'Geographic', icon: MapPin }
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-lg shadow-xl">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm text-gray-700">{entry.name}:</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{entry.value}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm font-medium mt-1 ${
              change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {change} vs last period
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${
          color === 'blue' ? 'bg-blue-100 text-blue-600' :
          color === 'green' ? 'bg-green-100 text-green-600' :
          color === 'orange' ? 'bg-orange-100 text-orange-600' :
          color === 'red' ? 'bg-red-100 text-red-600' :
          'bg-purple-100 text-purple-600'
        }`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-teal-700 bg-clip-text text-transparent">
              Advanced Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Comprehensive insights and performance metrics for ocean hazard monitoring</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isRealTime ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-600">
                {isRealTime ? 'Real-time' : 'Static'}
              </span>
              <button
                onClick={() => setIsRealTime(!isRealTime)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {isRealTime ? 'Pause' : 'Resume'}
              </button>
            </div>
            
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Reports"
            value={reports.length}
            change="+12%"
            icon={Activity}
            color="blue"
          />
          <StatCard
            title="Response Time"
            value="2.3h"
            change="-15%"
            icon={Clock}
            color="green"
          />
          <StatCard
            title="Accuracy Rate"
            value="94%"
            change="+3%"
            icon={Target}
            color="purple"
          />
          <StatCard
            title="Active Alerts"
            value={reports.filter(r => r.severity === 'high').length}
            change="-8%"
            icon={AlertTriangle}
            color="red"
          />
        </div>
      </div>

      {/* Chart Navigation */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm p-2">
        <div className="flex flex-wrap gap-2">
          {chartTypes.map((chart) => {
            const Icon = chart.icon
            return (
              <button
                key={chart.id}
                onClick={() => setActiveChart(chart.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeChart === chart.id
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{chart.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Chart Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm p-6">
        {activeChart === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">System Overview</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80">
                <h4 className="text-lg font-medium mb-4">Weekly Trends</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData.trendData}>
                    <defs>
                      <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="reports"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorReports)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="h-80">
                <h4 className="text-lg font-medium mb-4">Performance Metrics</h4>
                <div className="space-y-4">
                  {analyticsData.performanceMetrics?.slice(0, 4).map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-900">{metric.metric}</span>
                        <div className="text-sm text-gray-600">
                          Target: {metric.target}{metric.unit}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          {metric.current}{metric.unit}
                        </div>
                        <div className={`text-sm ${
                          metric.current >= metric.target ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {metric.current >= metric.target ? '✓ On Target' : '⚠ Below Target'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeChart === 'trends' && (
          <div className="h-96">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Trend Analysis</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="reports"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="verified"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeChart === 'distribution' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
            <div>
              <h4 className="text-lg font-medium mb-4">Hazard Types Distribution</h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.hazardTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {analyticsData.hazardTypeData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-4">Regional Distribution</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.locationAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="location" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="reports" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeChart === 'performance' && (
          <div className="h-96">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">System Performance Analysis</h3>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={analyticsData.performanceMetrics}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Current"
                  dataKey="current"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Target"
                  dataKey="target"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeChart === 'risk' && (
          <div className="h-96">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Risk Assessment by Zone</h3>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={analyticsData.riskAssessment}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="risk" name="Risk Level" stroke="#6b7280" />
                <YAxis dataKey="preparedness" name="Preparedness" stroke="#6b7280" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-lg shadow-xl">
                          <p className="font-semibold text-gray-900 mb-2">{data.zone}</p>
                          <p className="text-sm text-gray-700">Risk Level: {data.risk}%</p>
                          <p className="text-sm text-gray-700">Preparedness: {data.preparedness}%</p>
                          <p className="text-sm text-gray-700">Population: {data.population.toLocaleString()}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Scatter dataKey="preparedness" fill="#3b82f6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeChart === 'geographic' && (
          <div className="h-96">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Geographic Analysis</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              <div>
                <h4 className="text-lg font-medium mb-4">Reports by Location</h4>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {analyticsData.locationAnalytics?.map((location, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <div>
                          <span className="font-medium text-gray-900">{location.location}</span>
                          <div className="text-sm text-gray-600">
                            Avg Severity: {location.severity}/5
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{location.reports}</div>
                        <div className="text-sm text-gray-600">reports</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-4">Response Time by Region</h4>
                <ResponsiveContainer width="100%" height="80%">
                  <BarChart data={analyticsData.locationAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="location" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="responseTime" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EnhancedAnalytics