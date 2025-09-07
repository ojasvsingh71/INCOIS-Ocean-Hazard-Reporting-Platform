import React, { useState, useEffect } from 'react'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter } from 'recharts'
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity, Calendar, MapPin, Download, Share2, Filter, RefreshCw, Zap, AlertTriangle, Users, Clock, Target } from 'lucide-react'
import { useData } from '../context/DataContext'

const EnhancedAnalytics = () => {
  const { reports, getAnalytics } = useData() 
  const [activeChart, setActiveChart] = useState('overview')
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('reports')
  const [isRealTime, setIsRealTime] = useState(true)
  const [analyticsData, setAnalyticsData] = useState({})

  // Enhanced chart data generation
  const generateAnalyticsData = () => {
    const analytics = getAnalytics()

    const trendData = [
      ...analytics.trendData.slice(-30).map(day => ({
        ...day,
        responseTime: Math.random() * 3 + 1,
        accuracy: Math.random() * 10 + 90
      }))
    ]

    const hazardTypeData = Object.entries(analytics.hazardFrequency).map(([type, count], index) => ({
      name: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: count,
      color: ['#dc2626', '#ea580c', '#d97706', '#65a30d', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#6366f1', '#84cc16'][index % 11],
      trend: `${Math.random() > 0.5 ? '+' : '-'}${Math.floor(Math.random() * 20)}%`
    }))

    const locationAnalytics = Object.entries(analytics.regionalStats).map(([region, stats]) => ({
      location: region.replace(/\b\w/g, l => l.toUpperCase()),
      reports: stats.count,
      severity: (stats.severityBreakdown.critical * 4 + stats.severityBreakdown.high * 3 + stats.severityBreakdown.medium * 2 + stats.severityBreakdown.low * 1) / stats.count,
      responseTime: stats.avgResponseTime / 60, // Convert to hours
      accuracy: Math.random() * 10 + 90,
      economicImpact: stats.totalEconomicImpact
    }))

    const performanceMetrics = [
      { metric: 'Response Time', current: analytics.responseTimeStats.average / 60, target: 2.0, unit: 'hours' },
      { metric: 'Verification Rate', current: parseFloat(analytics.verificationRate), target: 95, unit: '%' },
      { metric: 'Resolution Rate', current: parseFloat(analytics.resolutionRate), target: 85, unit: '%' },
      { metric: 'Coverage Area', current: 98.5, target: 99, unit: '%' },
      { metric: 'User Satisfaction', current: 4.2, target: 4.5, unit: '/5' },
      { metric: 'System Uptime', current: 99.8, target: 99.9, unit: '%' }
    ]

    const riskAssessment = Object.entries(analytics.regionalStats).slice(0, 8).map(([region, stats], index) => ({
      zone: region.replace(/\b\w/g, l => l.toUpperCase()),
      risk: Math.min(100, (stats.severityBreakdown.critical * 25 + stats.severityBreakdown.high * 15 + stats.severityBreakdown.medium * 8 + stats.severityBreakdown.low * 3)),
      population: Math.floor(Math.random() * 500000) + 100000,
      preparedness: Math.floor(Math.random() * 30) + 70,
      recentIncidents: stats.count,
      economicRisk: stats.totalEconomicImpact / 1000000 // Convert to millions
    }))

    const severityTrends = analytics.trendData.slice(-7).map(day => ({
      date: day.date,
      critical: day.critical || 0,
      high: day.high || 0,
      medium: day.medium || 0,
      low: day.low || 0
    }))

    return {
      trendData,
      hazardTypeData,
      locationAnalytics,
      performanceMetrics,
      riskAssessment,
      severityTrends,
      analytics
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
            <p className={`text-sm font-medium mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
              {change} vs last period
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color === 'blue' ? 'bg-blue-100 text-blue-600' :
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
            value={analyticsData.analytics?.totalReports || reports.length}
            change="+12%"
            icon={Activity}
            color="blue"
          />
          <StatCard
            title="Response Time"
            value={analyticsData.analytics?.responseTimeStats?.averageFormatted || "2.3h"}
            change="-15%"
            icon={Clock}
            color="green"
          />
          <StatCard
            title="Accuracy Rate"
            value={`${analyticsData.analytics?.verificationRate || 94}%`}
            change="+3%"
            icon={Target}
            color="purple"
          />
          <StatCard
            title="Critical Reports"
            value={analyticsData.analytics?.criticalReports || 0}
            change="-8%"
            icon={AlertTriangle}
            color="red"
          />
          <StatCard
            title="Economic Impact"
            value={analyticsData.analytics?.economicImpact?.formatted || "₹0Cr"}
            change="+25%"
            icon={TrendingUp}
            color="orange"
          />
          <StatCard
            title="Affected Population"
            value={`${Math.floor((analyticsData.analytics?.totalAffectedPopulation || 0) / 1000)}K`}
            change="+18%"
            icon={Users}
            color="indigo"
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
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${activeChart === chart.id
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
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
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
                        <div className={`text-sm ${metric.current >= metric.target ? 'text-green-600' : 'text-orange-600'
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
              <h4 className="text-lg font-medium mb-4">Severity Distribution Over Time</h4>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.severityTrends}>
                  <defs>
                    <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ea580c" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ea580c" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="critical"
                    stackId="1"
                    stroke="#dc2626"
                    fill="url(#colorCritical)"
                  />
                  <Area
                    type="monotone"
                    dataKey="high"
                    stackId="1"
                    stroke="#ea580c"
                    fill="url(#colorHigh)"
                  />
                  <Area
                    type="monotone"
                    dataKey="medium"
                    stackId="1"
                    stroke="#d97706"
                    fill="#d97706"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="low"
                    stackId="1"
                    stroke="#65a30d"
                    fill="#65a30d"
                    fillOpacity={0.6}
                  />
                </AreaChart>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              <div>
                <ResponsiveContainer width="100%" height="80%">
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
                              <p className="text-sm text-gray-700">Recent Incidents: {data.recentIncidents}</p>
                              <p className="text-sm text-gray-700">Economic Risk: ₹{data.economicRisk.toFixed(1)}M</p>
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

              <div>
                <h4 className="text-lg font-medium mb-4">Risk Summary</h4>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {analyticsData.riskAssessment?.map((zone, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{zone.zone}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${zone.risk > 80 ? 'bg-red-100 text-red-800' :
                          zone.risk > 60 ? 'bg-orange-100 text-orange-800' :
                            zone.risk > 40 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                          }`}>
                          {zone.risk > 80 ? 'Critical' : zone.risk > 60 ? 'High' : zone.risk > 40 ? 'Medium' : 'Low'} Risk
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>Population: {zone.population.toLocaleString()}</div>
                        <div>Preparedness: {zone.preparedness}%</div>
                        <div>Incidents: {zone.recentIncidents}</div>
                        <div>Economic Risk: ₹{zone.economicRisk.toFixed(1)}M</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
                            Avg Severity: {location.severity.toFixed(1)}/4
                          </div>
                          <div className="text-sm text-gray-600">
                            Economic Impact: ₹{(location.economicImpact / 1000000).toFixed(1)}M
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{location.reports}</div>
                        <div className="text-sm text-gray-600">reports</div>
                        <div className="text-sm text-gray-600">{location.responseTime.toFixed(1)}h avg</div>
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