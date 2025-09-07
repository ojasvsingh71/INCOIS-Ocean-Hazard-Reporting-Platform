import React, { useState } from 'react'
import { History, User, Clock, Eye, EyeOff, Shield, Edit, Trash2, MessageCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useUser } from '../context/UserContext'

const AuditTrail = ({ auditTrail = [] }) => {
  const { user, getRoleColor } = useUser()
  const [isExpanded, setIsExpanded] = useState(false)
  const [filter, setFilter] = useState('all')

  const getActionIcon = (action) => {
    switch (action) {
      case 'created':
        return <Edit className="w-4 h-4 text-green-600" />
      case 'status_changed':
        return <Shield className="w-4 h-4 text-blue-600" />
      case 'updated':
        return <Edit className="w-4 h-4 text-orange-600" />
      case 'verified':
        return <Shield className="w-4 h-4 text-green-600" />
      case 'comment_added':
        return <MessageCircle className="w-4 h-4 text-purple-600" />
      case 'deleted':
        return <Trash2 className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getActionColor = (action) => {
    switch (action) {
      case 'created':
        return 'text-green-700 bg-green-50'
      case 'status_changed':
        return 'text-blue-700 bg-blue-50'
      case 'updated':
        return 'text-orange-700 bg-orange-50'
      case 'verified':
        return 'text-green-700 bg-green-50'
      case 'comment_added':
        return 'text-purple-700 bg-purple-50'
      case 'deleted':
        return 'text-red-700 bg-red-50'
      default:
        return 'text-gray-700 bg-gray-50'
    }
  }

  const getActionLabel = (action) => {
    const labels = {
      created: 'Created',
      status_changed: 'Status Changed',
      updated: 'Updated',
      verified: 'Verified',
      comment_added: 'Comment Added',
      deleted: 'Deleted'
    }
    return labels[action] || action.replace('_', ' ').toUpperCase()
  }

  const filteredTrail = auditTrail.filter(entry => {
    if (filter === 'all') return true
    return entry.action === filter
  })

  const sortedTrail = [...filteredTrail].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  )

  const displayedTrail = isExpanded ? sortedTrail : sortedTrail.slice(0, 3)

  const actionTypes = [...new Set(auditTrail.map(entry => entry.action))]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-gray-600" />
          <h4 className="text-lg font-semibold text-gray-900">
            Activity History ({auditTrail.length})
          </h4>
        </div>
        
        <div className="flex items-center space-x-2">
          {actionTypes.length > 1 && (
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="all">All Actions</option>
              {actionTypes.map(action => (
                <option key={action} value={action}>
                  {getActionLabel(action)}
                </option>
              ))}
            </select>
          )}
          
          {auditTrail.length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
            >
              {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{isExpanded ? 'Show Less' : 'Show All'}</span>
            </button>
          )}
        </div>
      </div>

      {displayedTrail.length === 0 ? (
        <div className="text-center py-8">
          <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No activity history available.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedTrail.map((entry, index) => (
            <div key={entry.id} className="flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex-shrink-0">
                {getActionIcon(entry.action)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(entry.action)}`}>
                    {getActionLabel(entry.action)}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{entry.user}</span>
                </div>
                
                <p className="text-sm text-gray-700 mb-2">{entry.details}</p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}</span>
                  </div>
                  <span>{new Date(entry.timestamp).toLocaleString()}</span>
                </div>
              </div>
              
              {/* Timeline connector */}
              {index < displayedTrail.length - 1 && (
                <div className="absolute left-6 mt-8 w-px h-4 bg-gray-200"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AuditTrail