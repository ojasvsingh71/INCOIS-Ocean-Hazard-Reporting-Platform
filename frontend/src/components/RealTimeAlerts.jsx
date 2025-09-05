import React, { useState, useEffect } from 'react'
import { AlertTriangle, X, Volume2, VolumeX, Bell, Zap, MapPin, Clock, Users } from 'lucide-react'

const RealTimeAlerts = () => {
  const [alerts, setAlerts] = useState([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)

  // Mock real-time alerts
  const mockAlerts = [
    {
      id: 1,
      type: 'tsunami',
      severity: 'critical',
      title: 'Tsunami Warning - Immediate Action Required',
      message: 'Tsunami waves detected approaching Chennai coast. Estimated arrival: 15 minutes. Evacuate coastal areas immediately.',
      location: 'Chennai, Tamil Nadu',
      coordinates: { lat: 13.0827, lng: 80.2707 },
      timestamp: new Date(),
      estimatedImpact: 'High',
      affectedPopulation: '2.5M',
      evacuationZones: ['Zone A', 'Zone B', 'Zone C'],
      responseTeams: 12,
      status: 'active'
    },
    {
      id: 2,
      type: 'storm_surge',
      severity: 'high',
      title: 'Storm Surge Alert',
      message: 'Severe storm surge conditions developing. Coastal flooding expected in low-lying areas.',
      location: 'Kochi, Kerala',
      coordinates: { lat: 9.9312, lng: 76.2673 },
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      estimatedImpact: 'Medium',
      affectedPopulation: '800K',
      evacuationZones: ['Zone 1', 'Zone 2'],
      responseTeams: 8,
      status: 'monitoring'
    }
  ]

  useEffect(() => {
    setAlerts(mockAlerts)
    
    // Simulate new alerts
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const newAlert = {
          id: Date.now(),
          type: ['tsunami', 'storm_surge', 'high_waves'][Math.floor(Math.random() * 3)],
          severity: ['high', 'critical'][Math.floor(Math.random() * 2)],
          title: 'New Hazard Alert',
          message: 'New hazard conditions detected requiring immediate attention.',
          location: ['Mumbai', 'Visakhapatnam', 'Mangalore'][Math.floor(Math.random() * 3)],
          coordinates: { lat: 19.0760, lng: 72.8777 },
          timestamp: new Date(),
          estimatedImpact: ['High', 'Medium'][Math.floor(Math.random() * 2)],
          affectedPopulation: Math.floor(Math.random() * 1000) + 'K',
          evacuationZones: ['Zone A'],
          responseTeams: Math.floor(Math.random() * 10) + 5,
          status: 'active'
        }
        
        setAlerts(prev => [newAlert, ...prev.slice(0, 4)])
        
        // Play sound if enabled
        if (soundEnabled) {
          // In a real app, you would play an actual sound file
          console.log('🔊 Alert sound played')
        }
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [soundEnabled])

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 border-red-700 text-white'
      case 'high': return 'bg-orange-500 border-orange-600 text-white'
      case 'medium': return 'bg-yellow-500 border-yellow-600 text-white'
      default: return 'bg-blue-500 border-blue-600 text-white'
    }
  }

  const getTypeIcon = (type) => {
    return AlertTriangle
  }

  const dismissAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  const acknowledgeAlert = (id) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, status: 'acknowledged' } : alert
      )
    )
  }

  if (alerts.length === 0) return null

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${isMinimized ? 'w-16' : 'w-96'}`}>
      {isMinimized ? (
        <div className="bg-red-600 text-white p-3 rounded-lg shadow-lg cursor-pointer" onClick={() => setIsMinimized(false)}>
          <div className="flex items-center justify-center">
            <Bell className="w-6 h-6 animate-pulse" />
            {alerts.length > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 text-black text-xs rounded-full flex items-center justify-center font-bold">
                {alerts.length}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3 max-h-screen overflow-y-auto">
          {/* Header */}
          <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold">Live Alerts</span>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {alerts.filter(a => a.status === 'active').length}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="text-gray-300 hover:text-white"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="text-gray-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {alerts.map((alert) => {
            const TypeIcon = getTypeIcon(alert.type)
            return (
              <div
                key={alert.id}
                className={`border-2 rounded-lg shadow-lg overflow-hidden ${getSeverityColor(alert.severity)} ${
                  alert.severity === 'critical' ? 'animate-pulse' : ''
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <TypeIcon className="w-5 h-5" />
                      <span className="font-bold text-sm uppercase tracking-wide">
                        {alert.severity} Alert
                      </span>
                    </div>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="text-white/80 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 className="font-bold text-lg mb-2">{alert.title}</h4>
                  <p className="text-sm mb-3 opacity-90">{alert.message}</p>

                  <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{alert.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{alert.timestamp.toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{alert.affectedPopulation} affected</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{alert.responseTeams} teams deployed</span>
                    </div>
                  </div>

                  {alert.evacuationZones && alert.evacuationZones.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs font-semibold mb-1">Evacuation Zones:</div>
                      <div className="flex flex-wrap gap-1">
                        {alert.evacuationZones.map((zone, index) => (
                          <span key={index} className="bg-white/20 px-2 py-1 rounded text-xs">
                            {zone}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-xs">
                      Impact: <span className="font-semibold">{alert.estimatedImpact}</span>
                    </div>
                    <div className="flex space-x-2">
                      {alert.status === 'active' && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-xs font-medium transition-colors"
                        >
                          Acknowledge
                        </button>
                      )}
                      <button className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-xs font-medium transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>

                {alert.status === 'acknowledged' && (
                  <div className="bg-white/10 px-4 py-2 text-xs">
                    ✓ Alert acknowledged by emergency response team
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default RealTimeAlerts