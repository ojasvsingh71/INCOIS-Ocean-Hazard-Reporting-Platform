import React from 'react'
import { MapPin, Clock, User, AlertTriangle, CheckCircle, XCircle, Eye } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useData } from '../context/DataContext'

const ReportCard = ({ report }) => {
  const { user } = useUser()
  const { updateReportStatus } = useData()

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200'
      case 'medium': return 'text-orange-600 bg-orange-100 border-orange-200'
      case 'low': return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      default: return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-100'
      case 'confirmed': return 'text-blue-600 bg-blue-100'
      case 'investigating': return 'text-yellow-600 bg-yellow-100'
      case 'resolved': return 'text-gray-600 bg-gray-100'
      default: return 'text-orange-600 bg-orange-100'
    }
  }

  const getTypeIcon = (type) => {
    return AlertTriangle
  }

  const handleStatusChange = (newStatus) => {
    updateReportStatus(report.id, newStatus)
  }



  const TypeIcon = getTypeIcon(report.type)
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${getSeverityColor(report.severity)}`}>
              <TypeIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 capitalize">
                {report.type.replace('_', ' ')}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                  {report.severity}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span>{report.location.name}</span>
        </div>
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {report.description}
        </p>
        {report.media && report.media.length > 0 && (
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-2">
              {report.media.slice(0, 2).map((media, index) => (
                <img
                  key={index}
                  src={media}
                  alt="Report media"
                  className="w-full h-20 object-cover rounded-md"
                />
              ))}
            </div>
            {report.media.length > 2 && (
              <div className="mt-2 text-xs text-gray-500">
                +{report.media.length - 2} more files
              </div>
            )}
          </div>
        )}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <User className="w-3 h-3" />
                <span>{report.reporter}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{new Date(report.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
            {(user?.role === 'official' || user?.role === 'analyst') && report.status === 'pending' && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleStatusChange('investigating')}
                  className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                  title="Mark as Investigating"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleStatusChange('verified')}
                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                  title="Verify Report"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleStatusChange('rejected')}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                  title="Reject Report"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportCard