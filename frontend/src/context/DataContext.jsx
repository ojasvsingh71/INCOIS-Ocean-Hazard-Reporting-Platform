import React, { createContext, useContext, useState, useEffect } from 'react'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

// Mock data for demonstration
const mockReports = [
  {
    id: '1',
    type: 'tsunami',
    location: { lat: 13.0827, lng: 80.2707, name: 'Chennai, Tamil Nadu' },
    severity: 'high',
    description: 'Unusual wave behavior observed near Marina Beach',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    reporter: 'Citizen Reporter',
    status: 'verified',
    media: ['https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg']
  },
  {
    id: '2',
    type: 'storm_surge',
    location: { lat: 15.2993, lng: 74.1240, name: 'Goa' },
    severity: 'medium',
    description: 'Coastal flooding in low-lying areas',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    reporter: 'Local Official',
    status: 'investigating',
    media: ['https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg']
  },
  {
    id: '3',
    type: 'high_waves',
    location: { lat: 11.9416, lng: 75.4849, name: 'Kozhikode, Kerala' },
    severity: 'low',
    description: 'Wave height exceeding 3 meters',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    reporter: 'Fisherman',
    status: 'confirmed',
    media: []
  }
]

const mockSocialMediaPosts = [
  {
    id: 'sm1',
    platform: 'twitter',
    content: 'Huge waves hitting the coast near Chennai. Everyone stay safe! #tsunami #chennai',
    location: 'Chennai',
    sentiment: 'concern',
    engagement: 245,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    relevanceScore: 0.9
  },
  {
    id: 'sm2',
    platform: 'facebook',
    content: 'Water levels rising in coastal areas. Authorities have issued warnings.',
    location: 'Goa',
    sentiment: 'warning',
    engagement: 89,
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    relevanceScore: 0.85
  }
]

export const DataProvider = ({ children }) => {
  const [reports, setReports] = useState(mockReports)
  const [socialMediaPosts, setSocialMediaPosts] = useState(mockSocialMediaPosts)
  const [filters, setFilters] = useState({
    type: 'all',
    severity: 'all',
    status: 'all',
    dateRange: '24h'
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Occasionally add new reports or social media posts
      if (Math.random() > 0.8) {
        const newReport = {
          id: `${Date.now()}`,
          type: ['tsunami', 'storm_surge', 'high_waves'][Math.floor(Math.random() * 3)],
          location: {
            lat: 10 + Math.random() * 10,
            lng: 70 + Math.random() * 15,
            name: ['Mumbai', 'Kochi', 'Visakhapatnam'][Math.floor(Math.random() * 3)]
          },
          severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          description: 'New hazard observation reported',
          timestamp: new Date().toISOString(),
          reporter: 'Citizen',
          status: 'investigating',
          media: []
        }
        setReports(prev => [newReport, ...prev.slice(0, 9)])
      }
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const addReport = (report) => {
    const newReport = {
      id: `${Date.now()}`,
      ...report,
      timestamp: new Date().toISOString(),
      status: 'pending'
    }
    setReports(prev => [newReport, ...prev])
  }

  const updateReportStatus = (reportId, status) => {
    setReports(prev =>
      prev.map(report =>
        report.id === reportId ? { ...report, status } : report
      )
    )
  }

  const filteredReports = reports.filter(report => {
    if (filters.type !== 'all' && report.type !== filters.type) return false
    if (filters.severity !== 'all' && report.severity !== filters.severity) return false
    if (filters.status !== 'all' && report.status !== filters.status) return false
    return true
  })

  const value = {
    reports,
    socialMediaPosts,
    filters,
    setFilters,
    filteredReports,
    addReport,
    updateReportStatus
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}