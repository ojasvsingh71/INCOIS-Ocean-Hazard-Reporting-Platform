import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Activity, Users, AlertTriangle } from 'lucide-react'
import { useData } from '../context/DataContext'

const Analytics = () => {
  const { reports } = useData()
  const [timeRange, setTimeRange] = useState('7d')

  // Process data for charts
  const hazardTypeData = [
    { name: 'Tsunami', count: reports.filter(r => r.type === 'tsunami').length, color: '#dc2626' },
    { name: 'Storm Surge', count: reports.filter(r => r.type === 'storm_surge').length, color: '#ea580c' },
    { name: 'High Waves', count: reports.filter(r => r.type === 'high_waves').length, color: '#d97706' },
    { name: 'Swell Surge', count: reports.filter(r => r.type === 'swell_surge').length, color: '#65a30d' }
  ]

  const severityData = [
    { name: 'High', value: reports.filter(r => r.severity === 'high').length, color: '#dc2626' },
    { name: 'Medium', value: reports.filter(r => r.severity === 'medium').length, color: '#ea580c' },
    { name: 'Low', value: reports.filter(r => r.severity === 'low').length, color: '#fbbf24' }
  ]

  const trendData = [
    { day: 'Mon', reports: 12, resolved: 8 },
    { day: 'Tue', reports: 19, resolved: 14 },
    { day: 'Wed', reports: 8, resolved: 6 },
    { day: 'Thu', reports: 25, resolved: 18 },
    { day: 'Fri', reports: 16, resolved: 11 },
    { day: 'Sat', reports: 22, resolved: 15 },
    { day: 'Sun', reports: 14, resolved: 10 }
  ]

  const locationData = [
    { location: 'Tamil Nadu', reports: 45 },
    { location: 'Kerala', reports: 32 },
    { location: 'Karnataka', reports: 28 },
    { location: 'Andhra Pradesh', reports: 25 },
    { location: 'Goa', reports: 18 }
  ]

  const stats = [
    {
      title: 'Total Reports',
      value: reports.length,
      change: '+12%',
      icon: Activity,
      color: 'blue'
    },
    {
      title: 'Response Time',
      value: '2.3h',
      change: '-15%',
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Verified Reports',
      value: reports.filter(r => r.status === 'verified' || r.status === 'confirmed').length,
      change: '+8%',
      icon: AlertTriangle,
      color: 'orange'
    },
    {
      title: 'Active Analysts',
      value: '24',
      change: '+2%',
      icon: Users,
      color: 'purple'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Comprehensive analysis of hazard reporting patterns</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="1d">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${
                  stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  stat.color === 'green' ? 'bg-green-100 text-green-600' :
                  stat.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-2">
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last period</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Reports Trend */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Reports Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="reports" stroke="#3b82f6" strokeWidth={3} />
              <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Hazard Types */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Hazard Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hazardTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Severity Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Severity Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {severityData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Locations */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Reports by Location</h3>
          <div className="space-y-4">
            {locationData.map((location, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{location.location}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(location.reports / Math.max(...locationData.map(l => l.reports))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 min-w-[2rem]">{location.reports}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-6">System Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">98.5%</div>
            <div className="text-sm text-gray-600">System Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">1.2s</div>
            <div className="text-sm text-gray-600">Avg Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">94%</div>
            <div className="text-sm text-gray-600">Report Accuracy</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics