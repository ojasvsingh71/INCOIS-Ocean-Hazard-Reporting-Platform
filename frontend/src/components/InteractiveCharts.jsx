import React, { useState } from 'react'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity, Calendar, MapPin } from 'lucide-react'
import { useData } from '../context/DataContext'

const InteractiveCharts = () => {
  const { reports } = useData()
  const [activeChart, setActiveChart] = useState('trends')
  const [timeRange, setTimeRange] = useState('7d')

  // Generate chart data
  const trendData = [
    { date: 'Mon', reports: 12, verified: 8, resolved: 6 },
    { date: 'Tue', reports: 19, verified: 14, resolved: 10 },
    { date: 'Wed', reports: 8, verified: 6, resolved: 4 },
    { date: 'Thu', reports: 25, verified: 18, resolved: 15 },
    { date: 'Fri', reports: 16, verified: 11, resolved: 8 },
    { date: 'Sat', reports: 22, verified: 15, resolved: 12 },
    { date: 'Sun', reports: 14, verified: 10, resolved: 7 }
  ]

  const hazardTypeData = [
    { name: 'Tsunami', value: 35, color: '#dc2626' },
    { name: 'Storm Surge', value: 28, color: '#ea580c' },
    { name: 'High Waves', value: 22, color: '#d97706' },
    { name: 'Swell Surge', value: 15, color: '#65a30d' }
  ]

  const severityData = [
    { severity: 'High', count: 15, percentage: 30 },
    { severity: 'Medium', count: 25, percentage: 50 },
    { severity: 'Low', count: 10, percentage: 20 }
  ]

  const locationData = [
    { location: 'Tamil Nadu', reports: 45, lat: 11.1271, lng: 78.6569 },
    { location: 'Kerala', reports: 32, lat: 10.8505, lng: 76.2711 },
    { location: 'Karnataka', reports: 28, lat: 15.3173, lng: 75.7139 },
    { location: 'Andhra Pradesh', reports: 25, lat: 15.9129, lng: 79.7400 },
    { location: 'Goa', reports: 18, lat: 15.2993, lng: 74.1240 }
  ]

  const responseTimeData = [
    { hour: '00:00', avgTime: 2.5, incidents: 3 },
    { hour: '06:00', avgTime: 1.8, incidents: 8 },
    { hour: '12:00', avgTime: 1.2, incidents: 15 },
    { hour: '18:00', avgTime: 1.5, incidents: 12 },
    { hour: '24:00', avgTime: 2.1, incidents: 6 }
  ]

  const radarData = [
    { subject: 'Response Time', A: 120, B: 110, fullMark: 150 },
    { subject: 'Accuracy', A: 98, B: 130, fullMark: 150 },
    { subject: 'Coverage', A: 86, B: 130, fullMark: 150 },
    { subject: 'Efficiency', A: 99, B: 100, fullMark: 150 },
    { subject: 'Reliability', A: 85, B: 90, fullMark: 150 },
    { subject: 'User Satisfaction', A: 65, B: 85, fullMark: 150 }
  ]

  const chartTypes = [
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'distribution', label: 'Distribution', icon: PieChartIcon },
    { id: 'severity', label: 'Severity', icon: BarChart3 },
    { id: 'performance', label: 'Performance', icon: Activity }
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h3>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="flex space-x-2 mb-6 bg-gray-100 p-1 rounded-lg">
        {chartTypes.map((chart) => {
          const Icon = chart.icon
          return (
            <button
              key={chart.id}
              onClick={() => setActiveChart(chart.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                activeChart === chart.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{chart.label}</span>
            </button>
          )
        })}
      </div>

      {/* Chart Content */}
      <div className="h-96">
        {activeChart === 'trends' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
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
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="verified"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorVerified)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'distribution' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <div>
              <h4 className="text-lg font-medium mb-4">Hazard Types</h4>
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={hazardTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {hazardTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Geographic Distribution</h4>
              <div className="space-y-3">
                {locationData.map((location, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">{location.location}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(location.reports / Math.max(...locationData.map(l => l.reports))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium min-w-[2rem]">{location.reports}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeChart === 'severity' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={severityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="severity" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'performance' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <div>
              <h4 className="text-lg font-medium mb-4">Response Time Analysis</h4>
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="avgTime"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">System Performance</h4>
              <ResponsiveContainer width="100%" height="80%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={90} domain={[0, 150]} />
                  <Radar
                    name="Current"
                    dataKey="A"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Target"
                    dataKey="B"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InteractiveCharts