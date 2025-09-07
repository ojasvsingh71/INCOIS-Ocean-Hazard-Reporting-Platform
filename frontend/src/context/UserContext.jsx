import React, { createContext, useContext, useState } from 'react'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

// Enhanced user roles with detailed permissions
const rolePermissions = {
  citizen: {
    canSubmitReports: true,
    canComment: true,
    canViewReports: true,
    canVerifyReports: false,
    canDeleteReports: false,
    canEditReports: false,
    canAccessAnalytics: false,
    canManageUsers: false,
    canExportData: false,
    canReceiveAlerts: true,
    maxReportsPerDay: 10
  },
  official: {
    canSubmitReports: true,
    canComment: true,
    canViewReports: true,
    canVerifyReports: true,
    canDeleteReports: false,
    canEditReports: true,
    canAccessAnalytics: true,
    canManageUsers: false,
    canExportData: true,
    canReceiveAlerts: true,
    maxReportsPerDay: 50
  },
  analyst: {
    canSubmitReports: true,
    canComment: true,
    canViewReports: true,
    canVerifyReports: true,
    canDeleteReports: true,
    canEditReports: true,
    canAccessAnalytics: true,
    canManageUsers: false,
    canExportData: true,
    canReceiveAlerts: true,
    maxReportsPerDay: 100
  },
  admin: {
    canSubmitReports: true,
    canComment: true,
    canViewReports: true,
    canVerifyReports: true,
    canDeleteReports: true,
    canEditReports: true,
    canAccessAnalytics: true,
    canManageUsers: true,
    canExportData: true,
    canReceiveAlerts: true,
    maxReportsPerDay: -1 // unlimited
  }
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('incois_user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [userPreferences, setUserPreferences] = useState(() => {
    const savedPrefs = localStorage.getItem('incois_user_preferences')
    return savedPrefs ? JSON.parse(savedPrefs) : {
      language: 'en',
      notifications: {
        email: true,
        push: true,
        sms: false,
        highSeverityOnly: false,
        proximityAlerts: true,
        proximityRadius: 50 // km
      },
      theme: 'light',
      accessibility: {
        highContrast: false,
        largeText: false,
        screenReader: false,
        keyboardNavigation: true
      },
      dashboard: {
        defaultView: 'overview',
        autoRefresh: true,
        refreshInterval: 30 // seconds
      }
    }
  })

  const login = (userData) => {
    const enhancedUser = {
      ...userData,
      permissions: rolePermissions[userData.role] || rolePermissions.citizen,
      loginTime: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    }
    setUser(enhancedUser)
    localStorage.setItem('incois_user', JSON.stringify(enhancedUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('incois_user')
    localStorage.removeItem('incois_user_preferences')
  }

  const updateUserPreferences = (newPreferences) => {
    const updatedPrefs = { ...userPreferences, ...newPreferences }
    setUserPreferences(updatedPrefs)
    localStorage.setItem('incois_user_preferences', JSON.stringify(updatedPrefs))
  }

  const updateLastActivity = () => {
    if (user) {
      const updatedUser = {
        ...user,
        lastActivity: new Date().toISOString()
      }
      setUser(updatedUser)
      localStorage.setItem('incois_user', JSON.stringify(updatedUser))
    }
  }

  // Permission checking functions
  const hasPermission = (permission) => {
    return user?.permissions?.[permission] || false
  }

  const canPerformAction = (action, context = {}) => {
    if (!user) return false

    switch (action) {
      case 'submit_report':
        return hasPermission('canSubmitReports')
      case 'verify_report':
        return hasPermission('canVerifyReports')
      case 'edit_report':
        return hasPermission('canEditReports') || (context.isOwner && user.role !== 'citizen')
      case 'delete_report':
        return hasPermission('canDeleteReports') || (context.isOwner && user.role === 'admin')
      case 'comment':
        return hasPermission('canComment')
      case 'access_analytics':
        return hasPermission('canAccessAnalytics')
      case 'export_data':
        return hasPermission('canExportData')
      case 'manage_users':
        return hasPermission('canManageUsers')
      default:
        return false
    }
  }

  const getRoleDisplayName = (role) => {
    const roleNames = {
      citizen: 'Citizen Reporter',
      official: 'INCOIS Official',
      analyst: 'Data Analyst',
      admin: 'System Administrator'
    }
    return roleNames[role] || role
  }

  const getRoleColor = (role) => {
    const roleColors = {
      citizen: 'bg-green-100 text-green-800',
      official: 'bg-blue-100 text-blue-800',
      analyst: 'bg-purple-100 text-purple-800',
      admin: 'bg-red-100 text-red-800'
    }
    return roleColors[role] || 'bg-gray-100 text-gray-800'
  }

  const value = {
    user,
    userPreferences,
    login,
    logout,
    updateUserPreferences,
    updateLastActivity,
    hasPermission,
    canPerformAction,
    getRoleDisplayName,
    getRoleColor,
    isAuthenticated: !!user,
    rolePermissions
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}