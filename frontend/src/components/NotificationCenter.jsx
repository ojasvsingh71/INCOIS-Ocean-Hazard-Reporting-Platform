import React, { useState, useEffect } from 'react'
import { Bell, X, AlertTriangle, Info, CheckCircle, Clock, Filter } from 'lucide-react'
import { useData } from '../context/DataContext'

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('all')
  const { reports } = useData()

  useEffect(() => {
    // Generate notifications based on reports
    const newNotifications = [
      {
        id: 1,
        type: 'alert',
        title: 'High Severity Tsunami Alert',
        message: 'New tsunami report verified in Chennai area',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        read: false,
        priority: 'high'
      },
      {
        id: 2,
        type: 'update',
        title: 'Report Status Updated',
        message: 'Storm surge report #1234 has been confirmed',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        read: false,
        priority: 'medium'
      },
      {
        id: 3,
        type: 'info',
        title: 'System Maintenance',
        message: 'Scheduled maintenance completed successfully',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: true,
        priority: 'low'
      },
      {
        id: 4,
        type: 'success',
        title: 'New Monitoring Station',
        message: 'Kochi monitoring station is now online',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        read: true,
        priority: 'medium'
      }
    ]
    setNotifications(newNotifications)
  }, [reports])

  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type) => {
    switch (type) {
      case 'alert': return AlertTriangle
      case 'info': return Info
      case 'success': return CheckCircle
      case 'update': return Clock
      default: return Bell
    }
  }

  const getTypeColor = (type, priority) => {
    if (priority === 'high') return 'text-red-600 bg-red-100'
    switch (type) {
      case 'alert': return 'text-orange-600 bg-orange-100'
      case 'success': return 'text-green-600 bg-green-100'
      case 'info': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read
    if (filter === 'high') return n.priority === 'high'
    return true
  })

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="all">All</option>
                  <option value="unread">Unread</option>
                  <option value="high">High Priority</option>
                </select>
                
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Mark all read
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications found
                </div>
              ) : (
                filteredNotifications.map((notification) => {
                  const Icon = getIcon(notification.type)
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${getTypeColor(notification.type, notification.priority)}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {notification.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default NotificationCenter