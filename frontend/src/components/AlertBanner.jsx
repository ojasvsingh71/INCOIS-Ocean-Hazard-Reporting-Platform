import React, { useState } from 'react'
import { AlertTriangle, X, ExternalLink } from 'lucide-react'

const AlertBanner = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [alerts] = useState([
    {
      id: 1,
      type: 'warning',
      message: 'High wave alert issued for Tamil Nadu coast - Wave heights up to 4.5m expected',
      location: 'Tamil Nadu',
      severity: 'high',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
    }
  ])

  if (!isVisible || alerts.length === 0) return null

  return (
    <div className="mb-6">
      {alerts.map((alert) => (
        <div key={alert.id} className={`rounded-xl border-l-4 p-4 shadow-sm ${
          alert.severity === 'high' 
            ? 'bg-red-50 border-red-500 text-red-900' 
            : alert.severity === 'medium'
            ? 'bg-orange-50 border-orange-500 text-orange-900'
            : 'bg-yellow-50 border-yellow-500 text-yellow-900'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                alert.severity === 'high' ? 'text-red-600' :
                alert.severity === 'medium' ? 'text-orange-600' : 'text-yellow-600'
              }`} />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-sm uppercase tracking-wide">
                    {alert.type} Alert
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    alert.severity === 'high' ? 'bg-red-200 text-red-800' :
                    alert.severity === 'medium' ? 'bg-orange-200 text-orange-800' :
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm mb-2">{alert.message}</p>
                <div className="flex items-center space-x-4 text-xs">
                  <span>Location: {alert.location}</span>
                  <span>Issued: {new Date(alert.timestamp).toLocaleTimeString()}</span>
                  <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800">
                    <span>View Details</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AlertBanner