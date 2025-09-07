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

// Significantly expanded mock data for better analytics
const generateMockReports = () => {
  const locations = [
    { lat: 13.0827, lng: 80.2707, name: 'Chennai, Tamil Nadu', region: 'tamil nadu' },
    { lat: 15.2993, lng: 74.1240, name: 'Goa', region: 'goa' },
    { lat: 11.9416, lng: 75.4849, name: 'Kozhikode, Kerala', region: 'kerala' },
    { lat: 19.0760, lng: 72.8777, name: 'Mumbai, Maharashtra', region: 'maharashtra' },
    { lat: 17.6868, lng: 83.2185, name: 'Visakhapatnam, Andhra Pradesh', region: 'andhra pradesh' },
    { lat: 14.5203, lng: 74.3588, name: 'Karwar, Karnataka', region: 'karnataka' },
    { lat: 12.9141, lng: 74.8560, name: 'Mangalore, Karnataka', region: 'karnataka' },
    { lat: 9.9312, lng: 76.2673, name: 'Kochi, Kerala', region: 'kerala' },
    { lat: 8.5241, lng: 76.9366, name: 'Thiruvananthapuram, Kerala', region: 'kerala' },
    { lat: 11.1271, lng: 78.6569, name: 'Puducherry', region: 'puducherry' },
    { lat: 16.5062, lng: 80.6480, name: 'Machilipatnam, Andhra Pradesh', region: 'andhra pradesh' },
    { lat: 20.7181, lng: 70.0169, name: 'Dwarka, Gujarat', region: 'gujarat' }
  ]

  const hazardTypes = [
    'tsunami', 'storm_surge', 'high_waves', 'swell_surge', 'coastal_erosion', 
    'abnormal_tide', 'rip_current', 'marine_debris', 'oil_spill', 'algal_bloom', 'seismic_activity'
  ]

  const severities = ['low', 'medium', 'high', 'critical']
  const statuses = ['pending', 'investigating', 'verified', 'confirmed', 'resolved', 'rejected']
  const reporters = [
    'Citizen Reporter', 'Local Official', 'Fisherman Association', 'Coast Guard', 
    'Marine Biologist', 'Tourist', 'Port Authority', 'Weather Station', 'Research Team',
    'Emergency Services', 'Naval Personnel', 'Lighthouse Keeper'
  ]

  const weatherConditions = ['Clear', 'Partly Cloudy', 'Overcast', 'Light Rain', 'Heavy Rain', 'Thunderstorm', 'Fog', 'Windy']
  const seaConditions = ['Calm', 'Slight', 'Moderate', 'Rough', 'Very Rough', 'High']

  const reports = []
  
  // Generate reports for the last 90 days
  for (let i = 0; i < 150; i++) {
    const daysAgo = Math.floor(Math.random() * 90)
    const hoursAgo = Math.floor(Math.random() * 24)
    const minutesAgo = Math.floor(Math.random() * 60)
    
    const timestamp = new Date()
    timestamp.setDate(timestamp.getDate() - daysAgo)
    timestamp.setHours(timestamp.getHours() - hoursAgo)
    timestamp.setMinutes(timestamp.getMinutes() - minutesAgo)

    const location = locations[Math.floor(Math.random() * locations.length)]
    const hazardType = hazardTypes[Math.floor(Math.random() * hazardTypes.length)]
    const severity = severities[Math.floor(Math.random() * severities.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const reporter = reporters[Math.floor(Math.random() * reporters.length)]

    // Generate more realistic descriptions based on hazard type
    const descriptions = {
      tsunami: [
        'Unusual wave behavior observed with rapid water retreat followed by large incoming waves.',
        'Seismic activity detected underwater, followed by abnormal wave patterns.',
        'Multiple waves of increasing height observed, causing coastal flooding.'
      ],
      storm_surge: [
        'Storm-driven water levels significantly above normal high tide causing coastal flooding.',
        'Strong winds pushing large volumes of water toward shore, flooding low-lying areas.',
        'Tropical cyclone approaching, causing dangerous storm surge conditions.'
      ],
      high_waves: [
        'Wave heights exceeding 4 meters observed, dangerous for small vessels.',
        'Unusually large waves breaking on shore, posing risk to coastal activities.',
        'Swell conditions creating hazardous surf with waves over 3 meters.'
      ],
      oil_spill: [
        'Oil slick observed on water surface, approximately 500 meters in diameter.',
        'Petroleum products washing ashore, affecting marine life and beach areas.',
        'Chemical contamination detected in coastal waters, source unknown.'
      ],
      algal_bloom: [
        'Red tide conditions observed, water discoloration and fish mortality reported.',
        'Harmful algal bloom causing water quality issues and marine life impact.',
        'Unusual water color and odor, possible toxic algae outbreak.'
      ]
    }

    const description = descriptions[hazardType] 
      ? descriptions[hazardType][Math.floor(Math.random() * descriptions[hazardType].length)]
      : `${hazardType.replace('_', ' ')} conditions observed in the area requiring attention.`

    const report = {
      id: `${i + 1}`,
      type: hazardType,
      location: {
        lat: location.lat + (Math.random() - 0.5) * 0.1, // Add some variation
        lng: location.lng + (Math.random() - 0.5) * 0.1,
        name: location.name,
        region: location.region,
        address: `${location.name} Coastal Area`,
        landmark: ['Lighthouse', 'Pier', 'Beach Resort', 'Fishing Harbor', 'Port'][Math.floor(Math.random() * 5)]
      },
      severity,
      description,
      timestamp: timestamp.toISOString(),
      reporter,
      reporterEmail: `${reporter.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      status,
      media: Math.random() > 0.7 ? [
        'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg',
        'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg'
      ] : [],
      comments: [],
      auditTrail: [
        {
          id: `a${i}_1`,
          action: 'created',
          user: reporter,
          timestamp: timestamp.toISOString(),
          details: 'Report submitted'
        }
      ],
      tags: [hazardType.replace('_', '-'), severity, location.region.replace(' ', '-')],
      priority: severity === 'critical' ? 'critical' : severity === 'high' ? 'high' : 'medium',
      affectedPopulation: Math.floor(Math.random() * 100000),
      evacuationStatus: severity === 'critical' ? 'required' : severity === 'high' ? 'recommended' : 'none',
      weatherConditions: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
      seaConditions: seaConditions[Math.floor(Math.random() * seaConditions.length)],
      confidenceLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      responseTime: Math.floor(Math.random() * 480) + 30, // 30 minutes to 8 hours
      verificationTime: status === 'verified' ? Math.floor(Math.random() * 240) + 60 : null, // 1-4 hours
      economicImpact: Math.floor(Math.random() * 10000000), // Up to 10M
      environmentalImpact: ['minimal', 'moderate', 'significant', 'severe'][Math.floor(Math.random() * 4)],
      followUpRequired: Math.random() > 0.7,
      emergencyServicesContacted: Math.random() > 0.6,
      mediaAttention: Math.random() > 0.8,
      internationalConcern: severity === 'critical' && Math.random() > 0.9
    }

    // Add some comments to random reports
    if (Math.random() > 0.6) {
      const commentCount = Math.floor(Math.random() * 5) + 1
      for (let j = 0; j < commentCount; j++) {
        const commentTime = new Date(timestamp)
        commentTime.setMinutes(commentTime.getMinutes() + (j + 1) * 30)
        
        report.comments.push({
          id: `c${i}_${j}`,
          author: reporters[Math.floor(Math.random() * reporters.length)],
          content: [
            'Confirmed similar observations in the area.',
            'Emergency response team has been dispatched.',
            'Monitoring stations show elevated readings.',
            'Local authorities have issued advisory.',
            'Situation appears to be stabilizing.',
            'Additional resources may be required.',
            'Weather conditions are improving.',
            'Marine life impact assessment ongoing.'
          ][Math.floor(Math.random() * 8)],
          timestamp: commentTime.toISOString(),
          role: ['citizen', 'official', 'expert', 'analyst'][Math.floor(Math.random() * 4)]
        })
      }
    }

    // Add audit trail entries for processed reports
    if (status !== 'pending') {
      report.auditTrail.push({
        id: `a${i}_2`,
        action: 'status_changed',
        user: 'INCOIS Official',
        timestamp: new Date(timestamp.getTime() + 30 * 60000).toISOString(),
        details: `Status changed to ${status}`
      })
    }

    if (status === 'verified' || status === 'confirmed') {
      report.auditTrail.push({
        id: `a${i}_3`,
        action: 'verified',
        user: 'Marine Expert',
        timestamp: new Date(timestamp.getTime() + 60 * 60000).toISOString(),
        details: 'Report verified after expert analysis'
      })
    }

    reports.push(report)
  }

  return reports
}

const mockReports = generateMockReports()

// Add some specific high-profile reports for demonstration
const specificReports = [
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
  // Add critical oil spill report
  {
    id: '999',
    type: 'oil_spill',
    location: { lat: 19.0760, lng: 72.8777, name: 'Mumbai, Maharashtra' },
    severity: 'critical',
    description: 'Major oil spill detected near Mumbai port. Estimated 10,000 liters of crude oil spreading across 2 km radius. Immediate containment efforts required.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    reporter: 'Port Authority',
    reporterEmail: 'emergency@mumbaiport.gov.in',
    status: 'investigating',
    media: ['https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg'],
    comments: [
      {
        id: 'c999',
        author: 'Environmental Officer',
        content: 'Coast Guard vessels deployed for containment. Marine life rescue operations initiated.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        role: 'official'
      }
    ],
    auditTrail: [
      {
        id: 'a999',
        action: 'created',
        user: 'Port Authority',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        details: 'Critical oil spill report submitted'
      }
    ],
    tags: ['oil-spill', 'environmental-disaster', 'critical'],
    priority: 'critical',
    affectedPopulation: 500000,
    evacuationStatus: 'required',
    economicImpact: 50000000,
    environmentalImpact: 'severe',
    internationalConcern: true
  }
]

// Combine specific reports with generated ones
const allMockReports = [...specificReports, ...mockReports]

export const DataProvider = ({ children }) => {
  const [reports, setReports] = useState(allMockReports)
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
  const [socialMediaPosts, setSocialMediaPosts] = useState([])

  // Generate social media posts based on reports
  useEffect(() => {
    const generateSocialMediaPosts = () => {
      const platforms = ['twitter', 'facebook', 'instagram']
      const posts = []
      
      // Generate posts for recent high-severity reports
      const recentHighSeverityReports = reports.filter(r => 
        r.severity === 'high' || r.severity === 'critical'
      ).slice(0, 20)

      recentHighSeverityReports.forEach((report, index) => {
        const platform = platforms[index % platforms.length]
        const post = {
          id: `sm_${report.id}`,
          platform,
          username: `@${report.location.name.replace(/[^a-zA-Z]/g, '').toLowerCase()}_watch`,
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=50&h=50&fit=crop&crop=face',
          content: `${report.type.replace('_', ' ').toUpperCase()} alert: ${report.description.substring(0, 100)}... #${report.type.replace('_', '')} #${report.location.name.replace(/[^a-zA-Z]/g, '')}`,
          location: report.location.name,
          sentiment: report.severity === 'critical' ? 'warning' : report.severity === 'high' ? 'concern' : 'neutral',
          engagement: {
            likes: Math.floor(Math.random() * 500) + 50,
            shares: Math.floor(Math.random() * 100) + 10,
            comments: Math.floor(Math.random() * 50) + 5
          },
          timestamp: report.timestamp,
          relevanceScore: report.severity === 'critical' ? 0.95 : report.severity === 'high' ? 0.85 : 0.75,
          verified: Math.random() > 0.5,
          media: report.media.length > 0 ? [report.media[0]] : [],
          hashtags: [`#${report.type.replace('_', '')}`, `#${report.location.name.replace(/[^a-zA-Z]/g, '')}`]
        }
        posts.push(post)
      })

      setSocialMediaPosts(posts)
    }

    generateSocialMediaPosts()
  }, [reports])

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

    // Severity distribution
    const severityDistribution = reports.reduce((acc, report) => {
      acc[report.severity] = (acc[report.severity] || 0) + 1
      return acc
    }, {})

    // Status distribution
    const statusDistribution = reports.reduce((acc, report) => {
      acc[report.status] = (acc[report.status] || 0) + 1
      return acc
    }, {})

    // Regional analysis
    const regionalStats = reports.reduce((acc, report) => {
      const region = report.location.region || 'unknown'
      if (!acc[region]) {
        acc[region] = {
          count: 0,
          severityBreakdown: { low: 0, medium: 0, high: 0, critical: 0 },
          typeBreakdown: {},
          avgResponseTime: 0,
          totalEconomicImpact: 0
        }
      }
      acc[region].count++
      acc[region].severityBreakdown[report.severity]++
      acc[region].typeBreakdown[report.type] = (acc[region].typeBreakdown[report.type] || 0) + 1
      if (report.responseTime) {
        acc[region].avgResponseTime += report.responseTime
      }
      if (report.economicImpact) {
        acc[region].totalEconomicImpact += report.economicImpact
      }
      return acc
    }, {})

    // Calculate averages
    Object.keys(regionalStats).forEach(region => {
      regionalStats[region].avgResponseTime = Math.round(regionalStats[region].avgResponseTime / regionalStats[region].count)
    })

    // Location analysis
    const locationStats = reports.reduce((acc, report) => {
      const location = report.location.name
      if (!acc[location]) {
        acc[location] = {
          count: 0,
          severityBreakdown: { low: 0, medium: 0, high: 0, critical: 0 },
          avgResponseTime: 0,
          totalAffectedPopulation: 0,
          economicImpact: 0
        }
      }
      acc[location].count++
      acc[location].severityBreakdown[report.severity]++
      if (report.affectedPopulation) {
        acc[location].totalAffectedPopulation += report.affectedPopulation
      }
      if (report.economicImpact) {
        acc[location].economicImpact += report.economicImpact
      }
      return acc
    }, {})

    // Enhanced trend analysis
    const trendData = []
    for (let i = 29; i >= 0; i--) {
      const date = subDays(now, i)
      const dayReports = reports.filter(r => {
        const reportDate = parseISO(r.timestamp)
        return reportDate.toDateString() === date.toDateString()
      })
      trendData.push({
        date: date.toLocaleDateString(),
        reports: dayReports.length,
        critical: dayReports.filter(r => r.severity === 'critical').length,
        high: dayReports.filter(r => r.severity === 'high').length,
        medium: dayReports.filter(r => r.severity === 'medium').length,
        low: dayReports.filter(r => r.severity === 'low').length,
        verified: dayReports.filter(r => r.status === 'verified').length,
        resolved: dayReports.filter(r => r.status === 'resolved').length
      })
    }

    // Response time analysis
    const responseTimeStats = reports
      .filter(r => r.responseTime)
      .reduce((acc, report) => {
        acc.total += report.responseTime
        acc.count++
        if (report.responseTime < 60) acc.under1h++
        else if (report.responseTime < 240) acc.under4h++
        else acc.over4h++
        return acc
      }, { total: 0, count: 0, under1h: 0, under4h: 0, over4h: 0 })

    const avgResponseTime = responseTimeStats.count > 0 
      ? Math.round(responseTimeStats.total / responseTimeStats.count) 
      : 0

    // Economic impact analysis
    const totalEconomicImpact = reports.reduce((sum, report) => sum + (report.economicImpact || 0), 0)
    const avgEconomicImpact = reports.length > 0 ? totalEconomicImpact / reports.length : 0

    // Environmental impact analysis
    const environmentalImpactStats = reports.reduce((acc, report) => {
      if (report.environmentalImpact) {
        acc[report.environmentalImpact] = (acc[report.environmentalImpact] || 0) + 1
      }
      return acc
    }, {})

    return {
      totalReports: reports.length,
      reportsLast24h: reportsLast24h.length,
      reportsLast7d: reportsLast7d.length,
      reportsLast30d: reportsLast30d.length,
      hazardFrequency,
      severityDistribution,
      statusDistribution,
      regionalStats,
      locationStats,
      trendData,
      responseTimeStats: {
        ...responseTimeStats,
        average: avgResponseTime,
        averageFormatted: `${Math.floor(avgResponseTime / 60)}h ${avgResponseTime % 60}m`
      },
      verificationRate: (reports.filter(r => r.status === 'verified').length / reports.length * 100).toFixed(1),
      resolutionRate: (reports.filter(r => r.status === 'resolved').length / reports.length * 100).toFixed(1),
      totalAffectedPopulation: reports.reduce((sum, r) => sum + (r.affectedPopulation || 0), 0),
      economicImpact: {
        total: totalEconomicImpact,
        average: avgEconomicImpact,
        formatted: `₹${(totalEconomicImpact / 10000000).toFixed(1)}Cr`
      },
      environmentalImpactStats,
      criticalReports: reports.filter(r => r.severity === 'critical').length,
      internationalConcernReports: reports.filter(r => r.internationalConcern).length
    }
  }

  const value = {
    reports,
    filters,
    setFilters,
    filteredReports,
    userLocation,
    socialMediaPosts,
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