import React, { useState } from 'react'
import { MapPin, Camera, Upload, AlertTriangle, CheckCircle, Mic, Video, FileText } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useUser } from '../context/UserContext'

const EnhancedReportForm = ({ onClose }) => {
  const { addReport } = useData()
  const { user } = useUser()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    type: '',
    severity: '',
    location: { lat: '', lng: '', name: '' },
    description: '',
    media: [],
    urgency: 'normal',
    witnesses: '',
    damage: '',
    evacuationNeeded: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const hazardTypes = [
    { value: 'tsunami', label: 'Tsunami', description: 'Unusual wave behavior or tsunami activity', icon: '🌊' },
    { value: 'storm_surge', label: 'Storm Surge', description: 'Storm-related coastal flooding', icon: '⛈️' },
    { value: 'high_waves', label: 'High Waves', description: 'Abnormally high wave conditions', icon: '🌊' },
    { value: 'swell_surge', label: 'Swell Surge', description: 'Long-period wave surges', icon: '〰️' },
    { value: 'coastal_erosion', label: 'Coastal Erosion', description: 'Beach or cliff erosion', icon: '🏖️' },
    { value: 'abnormal_tide', label: 'Abnormal Tide', description: 'Unusual tidal behavior', icon: '🌀' }
  ]

  const severityLevels = [
    { value: 'low', label: 'Low Risk', color: 'yellow', description: 'Minor impact expected', icon: '⚠️' },
    { value: 'medium', label: 'Moderate Risk', color: 'orange', description: 'Moderate impact possible', icon: '🔶' },
    { value: 'high', label: 'High Risk', color: 'red', description: 'Severe impact likely', icon: '🔴' }
  ]

  const urgencyLevels = [
    { value: 'low', label: 'Low', description: 'Can wait for regular processing' },
    { value: 'normal', label: 'Normal', description: 'Standard processing time' },
    { value: 'urgent', label: 'Urgent', description: 'Requires immediate attention' },
    { value: 'critical', label: 'Critical', description: 'Emergency response needed' }
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
      onClose && onClose()
    }, 3000)
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted Successfully</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your report. Our emergency response team has been notified and will review the information immediately.
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Your report ID: <span className="font-mono font-medium">#{Date.now()}</span>
            </p>
            <p className="text-sm text-blue-600 mt-1">
              You will receive updates on the status of your report via the dashboard.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-teal-700 bg-clip-text text-transparent">
          Report Ocean Hazard
        </h1>
        <p className="text-gray-600 mt-2">Help protect coastal communities by reporting observed hazards</p>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of 4</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-teal-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-lg p-8">
        {/* Step 1: Hazard Type */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">What type of hazard are you reporting?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hazardTypes.map((type) => (
                  <label key={type.value} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="sr-only"
                    />
                    <div className={`p-6 border-2 rounded-xl transition-all duration-200 ${
                      formData.type === type.value
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-teal-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{type.icon}</span>
                        <div className="font-semibold text-gray-900">{type.label}</div>
                      </div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Severity and Urgency */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">How severe is this hazard?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {severityLevels.map((level) => (
                  <label key={level.value} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="severity"
                      value={level.value}
                      checked={formData.severity === level.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value }))}
                      className="sr-only"
                    />
                    <div className={`p-6 border-2 rounded-xl text-center transition-all duration-200 ${
                      formData.severity === level.value
                        ? `border-${level.color}-500 bg-${level.color}-50 shadow-md`
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}>
                      <div className="text-3xl mb-2">{level.icon}</div>
                      <div className="font-semibold text-gray-900 mb-1">{level.label}</div>
                      <div className="text-sm text-gray-600">{level.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">How urgent is this situation?</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {urgencyLevels.map((level) => (
                  <label key={level.value} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="urgency"
                      value={level.value}
                      checked={formData.urgency === level.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value }))}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${
                      formData.urgency === level.value
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="font-medium text-gray-900">{level.label}</div>
                      <div className="text-xs text-gray-600 mt-1">{level.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Location and Details */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Where is this happening?</h3>
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Use Current Location</span>
                </button>
                
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    step="any"
                    placeholder="Latitude"
                    value={formData.location.lat}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, lat: e.target.value }
                    }))}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Describe what you observed</h3>
              <textarea
                rows={6}
                placeholder="Provide detailed description of the hazard, including time of observation, conditions, and any immediate impacts..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        )}

        {/* Step 4: Additional Information */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of witnesses or people affected
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 5 people, entire beach area, fishing community"
                    value={formData.witnesses}
                    onChange={(e) => setFormData(prev => ({ ...prev, witnesses: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Damage assessment (if any)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe any damage to property, infrastructure, or environment..."
                    value={formData.damage}
                    onChange={(e) => setFormData(prev => ({ ...prev, damage: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="evacuation"
                    checked={formData.evacuationNeeded}
                    onChange={(e) => setFormData(prev => ({ ...prev, evacuationNeeded: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="evacuation" className="text-sm font-medium text-gray-700">
                    Evacuation may be needed for this area
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Upload Media (Optional)</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <div className="text-center">
                  <div className="flex justify-center space-x-4 mb-4">
                    <Camera className="w-8 h-8 text-gray-400" />
                    <Video className="w-8 h-8 text-gray-400" />
                    <Mic className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-4">
                    Upload photos, videos, or audio recordings of the hazard
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      type="button"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Choose Files</span>
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Take Photo</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <AlertTriangle className="w-4 h-4" />
              <span>All reports are verified by INCOIS officials</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && !formData.type) ||
                    (currentStep === 2 && (!formData.severity || !formData.urgency)) ||
                    (currentStep === 3 && (!formData.location.lat || !formData.description))
                  }
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EnhancedReportForm