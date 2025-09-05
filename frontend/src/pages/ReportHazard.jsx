import React, { useState } from 'react'
import { MapPin, Camera, Upload, AlertTriangle, CheckCircle } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useUser } from '../context/UserContext'

const ReportHazard = () => {
  const { addReport } = useData()
  const { user } = useUser()
  const [formData, setFormData] = useState({
    type: '',
    severity: '',
    location: { lat: '', lng: '', name: '' },
    description: '',
    media: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const hazardTypes = [
    { value: 'tsunami', label: 'Tsunami', description: 'Unusual wave behavior or tsunami activity' },
    { value: 'storm_surge', label: 'Storm Surge', description: 'Storm-related coastal flooding' },
    { value: 'high_waves', label: 'High Waves', description: 'Abnormally high wave conditions' },
    { value: 'swell_surge', label: 'Swell Surge', description: 'Long-period wave surges' },
    { value: 'coastal_erosion', label: 'Coastal Erosion', description: 'Beach or cliff erosion' },
    { value: 'abnormal_tide', label: 'Abnormal Tide', description: 'Unusual tidal behavior' }
  ]

  const severityLevels = [
    { value: 'low', label: 'Low', color: 'yellow', description: 'Minor impact expected' },
    { value: 'medium', label: 'Medium', color: 'orange', description: 'Moderate impact possible' },
    { value: 'high', label: 'High', color: 'red', description: 'Severe impact likely' }
  ]

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              lat: position.coords.latitude.toFixed(6),
              lng: position.coords.longitude.toFixed(6),
              name: `${position.coords.latitude.toFixed(2)}°N, ${position.coords.longitude.toFixed(2)}°E`
            }
          }))
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    const reportData = {
      ...formData,
      reporter: user.name,
      location: {
        lat: parseFloat(formData.location.lat),
        lng: parseFloat(formData.location.lng),
        name: formData.location.name
      }
    }

    addReport(reportData)
    setIsSubmitting(false)
    setIsSuccess(true)

    // Reset form after success
    setTimeout(() => {
      setIsSuccess(false)
      setFormData({
        type: '',
        severity: '',
        location: { lat: '', lng: '', name: '' },
        description: '',
        media: []
      })
    }, 3000)
  }

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted Successfully</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your report. Our team will review and verify the information shortly.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-sm text-blue-800">
              Your report ID: <span className="font-mono font-medium">#{Date.now()}</span>
            </p>
            <p className="text-sm text-blue-600 mt-1">
              You can track the status of your report in the dashboard.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Report Ocean Hazard</h1>
        <p className="text-gray-600">Help us monitor coastal conditions by reporting observed hazards</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Hazard Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Hazard Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 gap-3">
                {hazardTypes.map((type) => (
                  <label key={type.value} className="relative">
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.type === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="font-medium text-gray-900">{type.label}</div>
                      <div className="text-sm text-gray-500">{type.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Severity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Severity Level <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {severityLevels.map((level) => (
                  <label key={level.value} className="relative">
                    <input
                      type="radio"
                      name="severity"
                      value={level.value}
                      checked={formData.severity === level.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value }))}
                      className="sr-only"
                    />
                    <div className={`p-3 border-2 rounded-lg cursor-pointer text-center transition-colors ${
                      formData.severity === level.value
                        ? `border-${level.color}-500 bg-${level.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="font-medium text-gray-900">{level.label}</div>
                      <div className="text-xs text-gray-500">{level.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-dashed border-blue-300 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Use Current Location</span>
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    step="any"
                    placeholder="Latitude"
                    value={formData.location.lat}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, lat: e.target.value }
                    }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <input
                    type="number"
                    step="any"
                    placeholder="Longitude"
                    value={formData.location.lng}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, lng: e.target.value }
                    }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <input
                  type="text"
                  placeholder="Location description (e.g., Marina Beach, Chennai)"
                  value={formData.location.name}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, name: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={6}
                placeholder="Describe what you observed in detail..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos/Videos (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-2">
                    Upload photos or videos of the hazard
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Choose Files</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              All reports are reviewed by INCOIS officials before publication
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !formData.type || !formData.severity || !formData.location.lat}
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ReportHazard