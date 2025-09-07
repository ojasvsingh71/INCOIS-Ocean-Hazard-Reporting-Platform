import React, { createContext, useContext, useState, useEffect } from 'react'
import { isWithinInterval, subDays, subHours, parseISO } from 'date-fns'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

// Enhanced mock data with more comprehensive information
const mockReports = [
  {
    id: '1',
    type: 'tsunami',
    location: { lat: 13.0827, lng: 80.2707, name: 'Chennai, Tamil Nadu' },
    severity: 'high',
    description: 'Unusual wave behavior observed near Marina Beach. Waves reaching 4-5 meters in height with unusual retreat patterns.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    reporter: 'Citizen Reporter',
    reporterEmail: 'citizen@example.com',
    status: 'verified',
    media: [
      'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg',
      'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg'
    ],
    comments: [
      {
        id: 'c1',
        author: 'Dr. Marine Expert',
        content: 'This appears to be consistent with seismic activity. Monitoring stations confirm unusual patterns.',
        timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        role: 'expert'
      },
      {
        id: 'c2',
        author: 'Local Fisherman',
        content: 'I can confirm similar observations from my boat. Fish behavior was also unusual this morning.',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        role: 'citizen'
      }
    ],
    auditTrail: [
      {
        id: 'a1',
        action: 'created',
        user: 'Citizen Reporter',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        details: 'Report submitted'
      },
      {
        id: 'a2',
        action: 'status_changed',
        user: 'INCOIS Official',
        timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        details: 'Status changed from pending to investigating'
      },
      {
        id: 'a3',
        action: 'verified',
        user: 'Marine Expert',
        timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        details: 'Report verified after expert analysis'
      }
    ],
    tags: ['tsunami', 'high-waves', 'seismic-activity'],
    priority: 'critical',
    affectedPopulation: 250000,
    evacuationStatus: 'recommended'
  },
  {
    id: '2',
    type: 'storm_surge',
    location: { lat: 15.2993, lng: 74.1240, name: 'Goa' },
    severity: 'medium',
    description: 'Coastal flooding in low-lying areas due to storm surge. Water levels 1.5m above normal high tide.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    reporter: 'Local Official',
    reporterEmail: 'official@goa.gov.in',
    status: 'investigating',
    media: ['https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg'],
    comments: [
      {
        id: 'c3',
        author: 'Weather Department',
        content: 'Storm system moving northeast. Conditions expected to improve in 6-8 hours.',
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        role: 'official'
      }
    ],
    auditTrail: [
      {
        id: 'a4',
        action: 'created',
        user: 'Local Official',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        details: 'Report submitted by local authorities'
      }
    ],
    tags: ['storm-surge', 'flooding', 'coastal'],
    priority: 'high',
    affectedPopulation: 50000,
    evacuationStatus: 'monitoring'
  },
  {
    id: '3',
    type: 'high_waves',
    location: { lat: 11.9416, lng: 75.4849, name: 'Kozhikode, Kerala' },
    severity: 'low',
    description: 'Wave height exceeding 3 meters. Fishing activities suspended as precautionary measure.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    reporter: 'Fisherman Association',
    reporterEmail: 'fishermen@kerala.org',
    status: 'confirmed',
    media: [],
    comments: [],
    auditTrail: [
      {
        id: 'a5',
        action: 'created',
        user: 'Fisherman Association',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        details: 'Report submitted by fishermen association'
      }
    ],
    tags: ['high-waves', 'fishing-advisory'],
    priority: 'medium',
    affectedPopulation: 15000,
    evacuationStatus: 'none'
  }
]

export const DataProvider = ({ children }) => {
  const [reports, setReports] = useState(mockReports)
  const [filters, setFilters] = useState({
    type: 'all',
    severity: 'all',
    status: 'all',
    dateRange: '24h',
    customDateRange: {
      start: null,
      end: null
    },
    proximity: {
      enabled: false,
      center: null,
      radius: 50 // km
    },
    region: 'all'
  })
  const [userLocation, setUserLocation] = useState(null)
  const [notifications, setNotifications] = useState([])

  // Get user location for proximity filtering
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => console.log('Location access denied')
      )
    }
  }, [])

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Monitor for high-severity reports and send notifications
  useEffect(() => {
    const highSeverityReports = reports.filter(r => 
      r.severity === 'high' && 
      new Date(r.timestamp) > new Date(Date.now() - 1000 * 60 * 5) // Last 5 minutes
    )

    highSeverityReports.forEach(report => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`High Severity Alert: ${report.type}`, {
          body: `${report.description.substring(0, 100)}... - ${report.location.name}`,
          icon: '/favicon.ico',
          tag: report.id
        })
      }
    })
  }, [reports])

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Enhanced filtering logic
  const filteredReports = reports.filter(report => {
    // Type filter
    if (filters.type !== 'all' && report.type !== filters.type) return false
    
    // Severity filter
    if (filters.severity !== 'all' && report.severity !== filters.severity) return false
    
    // Status filter
    if (filters.status !== 'all' && report.status !== filters.status) return false
    
    // Date range filter
    const reportDate = parseISO(report.timestamp)
    const now = new Date()
    
    if (filters.dateRange === 'custom' && filters.customDateRange.start && filters.customDateRange.end) {
      if (!isWithinInterval(reportDate, {
        start: filters.customDateRange.start,
        end: filters.customDateRange.end
      })) return false
    } else {
      let dateThreshold
      switch (filters.dateRange) {
        case '1h':
          dateThreshold = subHours(now, 1)
          break
        case '24h':
          dateThreshold = subHours(now, 24)
          break
        case '7d':
          dateThreshold = subDays(now, 7)
          break
        case '30d':
          dateThreshold = subDays(now, 30)
          break
        default:
          dateThreshold = subHours(now, 24)
      }
      if (reportDate < dateThreshold) return false
    }
    
    // Proximity filter
    if (filters.proximity.enabled && userLocation && filters.proximity.center) {
      const distance = calculateDistance(
        filters.proximity.center.lat,
        filters.proximity.center.lng,
        report.location.lat,
        report.location.lng
      )
      if (distance > filters.proximity.radius) return false
    }
    
    // Region filter
    if (filters.region !== 'all') {
      const reportRegion = report.location.name.toLowerCase()
      if (!reportRegion.includes(filters.region.toLowerCase())) return false
    }
    
    return true
  })

  const addReport = (report) => {
    const newReport = {
      id: `${Date.now()}`,
      ...report,
      timestamp: new Date().toISOString(),
      status: 'pending',
      comments: [],
      auditTrail: [
        {
          id: `a_${Date.now()}`,
          action: 'created',
          user: report.reporter,
          timestamp: new Date().toISOString(),
          details: 'Report submitted'
        }
      ],
      tags: [],
      priority: report.severity === 'high' ? 'critical' : report.severity === 'medium' ? 'high' : 'medium',
      affectedPopulation: 0,
      evacuationStatus: 'none'
    }
    setReports(prev => [newReport, ...prev])
    
    // Send notification for high severity reports
    if (newReport.severity === 'high' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(`New High Severity Report: ${newReport.type}`, {
        body: `${newReport.description.substring(0, 100)}... - ${newReport.location.name}`,
        icon: '/favicon.ico'
      })
    }
  }

  const updateReportStatus = (reportId, status, user = 'System') => {
    setReports(prev =>
      prev.map(report => {
        if (report.id === reportId) {
          const updatedReport = { ...report, status }
          updatedReport.auditTrail = [
            ...report.auditTrail,
            {
              id: `a_${Date.now()}`,
              action: 'status_changed',
              user,
              timestamp: new Date().toISOString(),
              details: `Status changed to ${status}`
            }
          ]
          return updatedReport
        }
        return report
      })
    )
  }

  const addComment = (reportId, comment, author, role = 'citizen') => {
    const newComment = {
      id: `c_${Date.now()}`,
      author,
      content: comment,
      timestamp: new Date().toISOString(),
      role
    }
    
    setReports(prev =>
      prev.map(report => {
        if (report.id === reportId) {
          return {
            ...report,
            comments: [...report.comments, newComment],
            auditTrail: [
              ...report.auditTrail,
              {
                id: `a_${Date.now()}`,
                action: 'comment_added',
                user: author,
                timestamp: new Date().toISOString(),
                details: 'Comment added to report'
              }
            ]
          }
        }
        return report
      })
    )
  }

  const updateReport = (reportId, updates, user = 'System') => {
    setReports(prev =>
      prev.map(report => {
        if (report.id === reportId) {
          const updatedReport = { ...report, ...updates }
          updatedReport.auditTrail = [
            ...report.auditTrail,
            {
              id: `a_${Date.now()}`,
              action: 'updated',
              user,
              timestamp: new Date().toISOString(),
              details: `Report updated: ${Object.keys(updates).join(', ')}`
            }
          ]
          return updatedReport
        }
        return report
      })
    )
  }

  // Analytics functions
  const getAnalytics = () => {
    const now = new Date()
    const last24h = subHours(now, 24)
    const last7d = subDays(now, 7)
    const last30d = subDays(now, 30)

    const reportsLast24h = reports.filter(r => parseISO(r.timestamp) > last24h)
    const reportsLast7d = reports.filter(r => parseISO(r.timestamp) > last7d)
    const reportsLast30d = reports.filter(r => parseISO(r.timestamp) > last30d)

    // Hazard frequency by type
    const hazardFrequency = reports.reduce((acc, report) => {
      acc[report.type] = (acc[report.type] || 0) + 1
      return acc
    }, {})

    // Location analysis
    const locationStats = reports.reduce((acc, report) => {
      const location = report.location.name
      if (!acc[location]) {
        acc[location] = {
          count: 0,
          severityBreakdown: { high: 0, medium: 0, low: 0 },
          avgResponseTime: 0
        }
      }
      acc[location].count++
      acc[location].severityBreakdown[report.severity]++
      return acc
    }, {})

    // Trend analysis
    const trendData = []
    for (let i = 6; i >= 0; i--) {
      const date = subDays(now, i)
      const dayReports = reports.filter(r => {
        const reportDate = parseISO(r.timestamp)
        return reportDate.toDateString() === date.toDateString()
      })
      trendData.push({
        date: date.toLocaleDateString(),
        reports: dayReports.length,
        high: dayReports.filter(r => r.severity === 'high').length,
        medium: dayReports.filter(r => r.severity === 'medium').length,
        low: dayReports.filter(r => r.severity === 'low').length
      })
    }

    return {
      totalReports: reports.length,
      reportsLast24h: reportsLast24h.length,
      reportsLast7d: reportsLast7d.length,
      reportsLast30d: reportsLast30d.length,
      hazardFrequency,
      locationStats,
      trendData,
      averageResponseTime: '2.3 hours',
      verificationRate: (reports.filter(r => r.status === 'verified').length / reports.length * 100).toFixed(1)
    }
  }

  const value = {
    reports,
    filters,
    setFilters,
    filteredReports,
    userLocation,
    addReport,
    updateReportStatus,
    addComment,
    updateReport,
    getAnalytics,
    calculateDistance,
    notifications,
    setNotifications
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}