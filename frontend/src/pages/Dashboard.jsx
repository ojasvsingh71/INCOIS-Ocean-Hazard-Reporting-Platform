import React, { useState } from 'react'
import { AlertTriangle, MapPin, Clock, Users, TrendingUp, Activity } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useUser } from '../context/UserContext'
import HazardMap from '../components/HazardMap'
import ReportCard from '../components/ReportCard'
import StatCard from '../components/StatCard'
import FilterPanel from '../components/FilterPanel'

const Dashboard = () => {
  const { filteredReports, reports } = useData()
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState('overview')

  const stats = {
    totalReports: reports.length,
    activeHazards: reports.filter(r => r.status !== 'resolved').length,
    highSeverity: reports.filter(r => r.severity === 'high').length,
    last24h: reports.filter(r => {
      const reportTime = new Date(r.timestamp)
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      return reportTime > dayAgo
    }).length
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ocean Hazard Dashboard</h1>
        <p className="text-gray-600">Real-time monitoring and reporting system</p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Reports"
          value={stats.totalReports}
          icon={Activity}
          trend="+12%"
          color="blue"
        />
        <StatCard
          title="Active Hazards"
          value={stats.activeHazards}
          icon={AlertTriangle}
          trend="-3%"
          color="orange"
        />
        <StatCard
          title="High Severity"
          value={stats.highSeverity}
          icon={TrendingUp}
          trend="+5%"
          color="red"
        />
        <StatCard
          title="Last 24h"
          value={stats.last24h}
          icon={Clock}
          trend="+8%"
          color="green"
        />
      </div>


      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'map', label: 'Interactive Map' },
              { id: 'reports', label: 'Recent Reports' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Hazard Distribution Map</h3>
              <div className="h-96">
                <HazardMap reports={filteredReports} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <FilterPanel />

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {filteredReports.slice(0, 5).map((report) => (
                  <div key={report.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                    <div className={`w-3 h-3 rounded-full ${report.severity === 'high' ? 'bg-red-500' :
                        report.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'
                      }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{report.location.name}</p>
                      <p className="text-xs text-gray-500">{report.type.replace('_', ' ')}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(report.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'map' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Interactive Hazard Map</h3>
          <div className="h-96">
            <HazardMap reports={filteredReports} interactive={true} />
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-4">
          <FilterPanel />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard