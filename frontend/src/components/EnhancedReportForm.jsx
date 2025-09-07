import React, { useState, useEffect } from 'react'
import { MapPin, Camera, Upload, AlertTriangle, CheckCircle, Mic, Video, FileText, Plus, X, Clock, Users, Zap, Shield, Globe, Phone, Mail, Star, Info } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useUser } from '../context/UserContext'
import MediaUpload from './MediaUpload'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

const EnhancedReportForm = ({ onClose }) => {
  const { addReport } = useData()
  const { user, canPerformAction } = useUser()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    type: '',
    customType: '',
    severity: '',
    location: { lat: '', lng: '', name: '', address: '', landmark: '' },
    description: '',
    media: [],
    urgency: 'normal',
    witnesses: '',
    damage: '',
    evacuationNeeded: false,
    reporterEmail: user?.email || '',
    reporterPhone: '',
    tags: [],
    timeOfObservation: new Date(),
    weatherConditions: '',
    seaConditions: '',
    tideLevel: '',
    windSpeed: '',
    visibility: '',
    temperature: '',
    affectedInfrastructure: [],
    emergencyServicesContacted: false,
    emergencyServiceDetails: '',
    additionalContacts: [],
    followUpRequired: false,
    confidenceLevel: 'high',
    previousOccurrences: false,
    environmentalImpact: '',
    economicImpact: '',
    socialImpact: '',
    recommendedActions: '',
    priority: 'normal',
    isAnonymous: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)

  // Check if user can submit reports
  if (!canPerformAction('submit_report')) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600">
            You don't have permission to submit reports. Please contact your administrator.
          </p>
        </div>
      </div>
    )
  }

  const hazardTypes = [
    { value: 'tsunami', label: 'Tsunami', description: 'Unusual wave behavior or tsunami activity', icon: '🌊', severity: 'critical' },
    { value: 'storm_surge', label: 'Storm Surge', description: 'Storm-related coastal flooding', icon: '⛈️', severity: 'high' },
    { value: 'high_waves', label: 'High Waves', description: 'Abnormally high wave conditions', icon: '🌊', severity: 'medium' },
    { value: 'swell_surge', label: 'Swell Surge', description: 'Long-period wave surges', icon: '〰️', severity: 'medium' },
    { value: 'coastal_erosion', label: 'Coastal Erosion', description: 'Beach or cliff erosion', icon: '🏖️', severity: 'low' },
    { value: 'abnormal_tide', label: 'Abnormal Tide', description: 'Unusual tidal behavior', icon: '🌀', severity: 'medium' },
    { value: 'rip_current', label: 'Rip Current', description: 'Dangerous rip current conditions', icon: '🌊', severity: 'high' },
    { value: 'marine_debris', label: 'Marine Debris', description: 'Hazardous debris in water', icon: '🗑️', severity: 'low' },
    { value: 'oil_spill', label: 'Oil Spill', description: 'Oil or chemical contamination', icon: '🛢️', severity: 'high' },
    { value: 'algal_bloom', label: 'Algal Bloom', description: 'Harmful algal bloom', icon: '🦠', severity: 'medium' },
    { value: 'seismic_activity', label: 'Seismic Activity', description: 'Underwater earthquake or tremor', icon: '📳', severity: 'critical' },
    { value: 'custom', label: 'Custom Hazard', description: 'Report a different type of hazard', icon: '⚠️', severity: 'medium' }
  ]

  const severityLevels = [
    { value: 'low', label: 'Low Risk', color: 'yellow', description: 'Minor impact expected', icon: '⚠️', examples: 'Minor debris, small waves' },
    { value: 'medium', label: 'Moderate Risk', color: 'orange', description: 'Moderate impact possible', icon: '🔶', examples: 'Moderate flooding, strong currents' },
    { value: 'high', label: 'High Risk', color: 'red', description: 'Severe impact likely', icon: '🔴', examples: 'Major flooding, dangerous conditions' },
    { value: 'critical', label: 'Critical Risk', color: 'red', description: 'Immediate threat to life', icon: '🚨', examples: 'Tsunami, major earthquake' }
  ]

  const urgencyLevels = [
    { value: 'low', label: 'Low', description: 'Can wait for regular processing', timeframe: '24-48 hours' },
    { value: 'normal', label: 'Normal', description: 'Standard processing time', timeframe: '4-8 hours' },
    { value: 'urgent', label: 'Urgent', description: 'Requires immediate attention', timeframe: '1-2 hours' },
    { value: 'critical', label: 'Critical', description: 'Emergency response needed', timeframe: 'Immediate' }
  ]

  const confidenceLevels = [
    { value: 'low', label: 'Low Confidence', description: 'Uncertain about observations' },
    { value: 'medium', label: 'Medium Confidence', description: 'Reasonably sure about observations' },
    { value: 'high', label: 'High Confidence', description: 'Very confident about observations' }
  ]

  const weatherConditions = [
    'Clear', 'Partly Cloudy', 'Overcast', 'Light Rain', 'Heavy Rain', 
    'Thunderstorm', 'Fog', 'Windy', 'Calm', 'Unknown'
  ]

  const seaConditions = [
    'Calm', 'Slight', 'Moderate', 'Rough', 'Very Rough', 'High', 'Very High', 'Phenomenal'
  ]

  const infrastructureTypes = [
    'Roads', 'Bridges', 'Buildings', 'Ports', 'Beaches', 'Seawalls', 
    'Piers', 'Boats', 'Fishing Equipment', 'Power Lines', 'Communication Towers'
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

  const validateStep = (step) => {
    const errors = {}
    
    switch (step) {
      case 1:
        if (!formData.type) errors.type = 'Please select a hazard type'
        if (formData.type === 'custom' && !formData.customType) {
          errors.customType = 'Please specify the custom hazard type'
        }
        break
      case 2:
        if (!formData.severity) errors.severity = 'Please select severity level'
        if (!formData.urgency) errors.urgency = 'Please select urgency level'
        break
      case 3:
        if (!formData.location.lat) errors.lat = 'Latitude is required'
        if (!formData.location.lng) errors.lng = 'Longitude is required'
        if (!formData.description) errors.description = 'Description is required'
        break
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep(4)) return
    
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    const reportData = {
      ...formData,
      reporter: formData.isAnonymous ? 'Anonymous' : user.name,
      location: {
        lat: parseFloat(formData.location.lat),
        lng: parseFloat(formData.location.lng),
        name: formData.location.name,
        address: formData.location.address,
        landmark: formData.location.landmark
      },
      actualType: formData.type === 'custom' ? formData.customType : formData.type,
      submissionTime: new Date().toISOString(),
      reportId: `HR-${Date.now()}`,
      source: 'web_form',
      version: '2.0'
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

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5))
    }
  }
  
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }))
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({ 
      ...prev, 
      tags: prev.tags.filter(tag => tag !== tagToRemove) 
    }))
  }

  const addContact = () => {
    setFormData(prev => ({
      ...prev,
      additionalContacts: [...prev.additionalContacts, { name: '', phone: '', email: '', relation: '' }]
    }))
  }

  const updateContact = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      additionalContacts: prev.additionalContacts.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      )
    }))
  }

  const removeContact = (index) => {
    setFormData(prev => ({
      ...prev,
      additionalContacts: prev.additionalContacts.filter((_, i) => i !== index)
    }))
  }

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted Successfully</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your detailed report. Our emergency response team has been notified and will review the information immediately.
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              Your report ID: <span className="font-mono font-medium">HR-{Date.now()}</span>
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Expected response time: {urgencyLevels.find(u => u.value === formData.urgency)?.timeframe || '4-8 hours'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg">
              <strong>Priority:</strong> {formData.urgency.toUpperCase()}
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <strong>Severity:</strong> {formData.severity.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-teal-700 bg-clip-text text-transparent">
          Advanced Hazard Reporting System
        </h1>
        <p className="text-gray-600 mt-2">Comprehensive hazard documentation for enhanced emergency response</p>
        
        {/* Enhanced Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of 5</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / 5) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-600 to-teal-600 h-3 rounded-full transition-all duration-500 relative"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            >
              <div className="absolute right-0 top-0 w-3 h-3 bg-white rounded-full border-2 border-blue-600 transform translate-x-1/2 -translate-y-0"></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Type</span>
            <span>Severity</span>
            <span>Location</span>
            <span>Details</span>
            <span>Review</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-100 shadow-xl p-8">
        {/* Step 1: Enhanced Hazard Type Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2 text-blue-600" />
                What type of hazard are you reporting?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hazardTypes.map((type) => (
                  <label key={type.value} className="relative cursor-pointer group">
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="sr-only"
                    />
                    <div className={`p-6 border-2 rounded-xl transition-all duration-200 group-hover:shadow-lg ${
                      formData.type === type.value
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-teal-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}>
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-3xl">{type.icon}</span>
                        <div>
                          <div className="font-semibold text-gray-900">{type.label}</div>
                          <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                            type.severity === 'critical' ? 'bg-red-100 text-red-700' :
                            type.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                            type.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {type.severity.toUpperCase()}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                    </div>
                  </label>
                ))}
              </div>
              {validationErrors.type && (
                <p className="text-red-600 text-sm mt-2">{validationErrors.type}</p>
              )}
            </div>

            {/* Custom Hazard Type Input */}
            {formData.type === 'custom' && (
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h4 className="text-lg font-semibold mb-4 text-blue-900">Custom Hazard Details</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hazard Type Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Underwater landslide, Marine animal behavior"
                      value={formData.customType}
                      onChange={(e) => setFormData(prev => ({ ...prev, customType: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {validationErrors.customType && (
                      <p className="text-red-600 text-sm mt-1">{validationErrors.customType}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brief Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Provide a brief description of this custom hazard type..."
                      value={formData.customDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, customDescription: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Enhanced Severity and Urgency */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-orange-600" />
                How severe is this hazard?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {severityLevels.map((level) => (
                  <label key={level.value} className="relative cursor-pointer group">
                    <input
                      type="radio"
                      name="severity"
                      value={level.value}
                      checked={formData.severity === level.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value }))}
                      className="sr-only"
                    />
                    <div className={`p-6 border-2 rounded-xl text-center transition-all duration-200 group-hover:shadow-lg ${
                      formData.severity === level.value
                        ? `border-${level.color}-500 bg-${level.color}-50 shadow-md`
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}>
                      <div className="text-4xl mb-3">{level.icon}</div>
                      <div className="font-semibold text-gray-900 mb-2">{level.label}</div>
                      <div className="text-sm text-gray-600 mb-3">{level.description}</div>
                      <div className="text-xs text-gray-500 italic">
                        Examples: {level.examples}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {validationErrors.severity && (
                <p className="text-red-600 text-sm mt-2">{validationErrors.severity}</p>
              )}
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-red-600" />
                How urgent is this situation?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {urgencyLevels.map((level) => (
                  <label key={level.value} className="relative cursor-pointer group">
                    <input
                      type="radio"
                      name="urgency"
                      value={level.value}
                      checked={formData.urgency === level.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value }))}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg text-center transition-all duration-200 group-hover:shadow-md ${
                      formData.urgency === level.value
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="font-medium text-gray-900 mb-1">{level.label}</div>
                      <div className="text-xs text-gray-600 mb-2">{level.description}</div>
                      <div className="text-xs text-blue-600 font-medium">
                        Response: {level.timeframe}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {validationErrors.urgency && (
                <p className="text-red-600 text-sm mt-2">{validationErrors.urgency}</p>
              )}
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Star className="w-6 h-6 mr-2 text-purple-600" />
                Confidence Level
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {confidenceLevels.map((level) => (
                  <label key={level.value} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="confidenceLevel"
                      value={level.value}
                      checked={formData.confidenceLevel === level.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, confidenceLevel: e.target.value }))}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                      formData.confidenceLevel === level.value
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="font-medium text-gray-900">{level.label}</div>
                      <div className="text-sm text-gray-600 mt-1">{level.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Enhanced Location and Basic Details */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-green-600" />
                Where is this happening?
              </h3>
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Use Current Location</span>
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude *</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g., 13.0827"
                      value={formData.location.lat}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location: { ...prev.location, lat: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {validationErrors.lat && (
                      <p className="text-red-600 text-sm mt-1">{validationErrors.lat}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude *</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g., 80.2707"
                      value={formData.location.lng}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location: { ...prev.location, lng: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {validationErrors.lng && (
                      <p className="text-red-600 text-sm mt-1">{validationErrors.lng}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Marina Beach, Chennai"
                      value={formData.location.name}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location: { ...prev.location, name: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nearest Landmark</label>
                    <input
                      type="text"
                      placeholder="e.g., Lighthouse, Pier, Hotel"
                      value={formData.location.landmark}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location: { ...prev.location, landmark: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                  <input
                    type="text"
                    placeholder="Complete address with postal code"
                    value={formData.location.address}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, address: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-blue-600" />
                Describe what you observed
              </h3>
              <textarea
                rows={6}
                placeholder="Provide detailed description including time of observation, conditions, immediate impacts, and any other relevant information..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {validationErrors.description && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.description}</p>
              )}
              <div className="mt-2 text-sm text-gray-500">
                {formData.description.length}/1000 characters
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3">Time of Observation</h4>
              <DatePicker
                selected={formData.timeOfObservation}
                onChange={(date) => setFormData(prev => ({ ...prev, timeOfObservation: date }))}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
                maxDate={new Date()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Step 4: Enhanced Additional Information */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold flex items-center">
                <Info className="w-6 h-6 mr-2 text-purple-600" />
                Additional Information
              </h3>
              <button
                type="button"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <span>{showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options</span>
                <Zap className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    People Affected/Witnesses
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
                    Weather Conditions
                  </label>
                  <select
                    value={formData.weatherConditions}
                    onChange={(e) => setFormData(prev => ({ ...prev, weatherConditions: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select weather conditions</option>
                    {weatherConditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sea Conditions
                  </label>
                  <select
                    value={formData.seaConditions}
                    onChange={(e) => setFormData(prev => ({ ...prev, seaConditions: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select sea conditions</option>
                    {seaConditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Damage Assessment
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe any damage to property, infrastructure, or environment..."
                    value={formData.damage}
                    onChange={(e) => setFormData(prev => ({ ...prev, damage: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Affected Infrastructure
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {infrastructureTypes.map(type => (
                      <label key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.affectedInfrastructure.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                affectedInfrastructure: [...prev.affectedInfrastructure, type]
                              }))
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                affectedInfrastructure: prev.affectedInfrastructure.filter(i => i !== type)
                              }))
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            {showAdvancedOptions && (
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-6">
                <h4 className="text-lg font-semibold text-gray-900">Advanced Reporting Options</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Environmental Impact
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Impact on marine life, water quality, ecosystem..."
                        value={formData.environmentalImpact}
                        onChange={(e) => setFormData(prev => ({ ...prev, environmentalImpact: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Economic Impact
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Impact on fishing, tourism, business operations..."
                        value={formData.economicImpact}
                        onChange={(e) => setFormData(prev => ({ ...prev, economicImpact: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Social Impact
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Impact on communities, displacement, social activities..."
                        value={formData.socialImpact}
                        onChange={(e) => setFormData(prev => ({ ...prev, socialImpact: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recommended Actions
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Suggested immediate actions or precautions..."
                        value={formData.recommendedActions}
                        onChange={(e) => setFormData(prev => ({ ...prev, recommendedActions: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Services */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="emergencyServices"
                      checked={formData.emergencyServicesContacted}
                      onChange={(e) => setFormData(prev => ({ ...prev, emergencyServicesContacted: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="emergencyServices" className="text-sm font-medium text-gray-700">
                      Emergency services have been contacted
                    </label>
                  </div>

                  {formData.emergencyServicesContacted && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Service Details
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Which services were contacted and when..."
                        value={formData.emergencyServiceDetails}
                        onChange={(e) => setFormData(prev => ({ ...prev, emergencyServiceDetails: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>

                {/* Additional Contacts */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">Additional Contacts</label>
                    <button
                      type="button"
                      onClick={addContact}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Contact</span>
                    </button>
                  </div>
                  
                  {formData.additionalContacts.map((contact, index) => (
                    <div key={index} className="grid grid-cols-4 gap-3 mb-3 p-3 bg-white rounded-lg border">
                      <input
                        type="text"
                        placeholder="Name"
                        value={contact.name}
                        onChange={(e) => updateContact(index, 'name', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={contact.phone}
                        onChange={(e) => updateContact(index, 'phone', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={contact.email}
                        onChange={(e) => updateContact(index, 'email', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="Relation"
                          value={contact.relation}
                          onChange={(e) => updateContact(index, 'relation', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeContact(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Media Upload */}
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Upload Media (Optional)
              </h4>
              <MediaUpload
                onMediaChange={(media) => setFormData(prev => ({ ...prev, media }))}
                existingMedia={formData.media}
                maxFiles={10}
              />
            </div>

            {/* Tags */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add a tag..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag(e.target.value)
                      e.target.value = ''
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = e.target.previousElementSibling
                    addTag(input.value)
                    input.value = ''
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review and Submit */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
              Review Your Report
            </h3>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Hazard Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Type:</strong> {formData.type === 'custom' ? formData.customType : hazardTypes.find(h => h.value === formData.type)?.label}</div>
                    <div><strong>Severity:</strong> <span className="capitalize">{formData.severity}</span></div>
                    <div><strong>Urgency:</strong> <span className="capitalize">{formData.urgency}</span></div>
                    <div><strong>Confidence:</strong> <span className="capitalize">{formData.confidenceLevel}</span></div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Location</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Coordinates:</strong> {formData.location.lat}°N, {formData.location.lng}°E</div>
                    <div><strong>Name:</strong> {formData.location.name}</div>
                    {formData.location.landmark && <div><strong>Landmark:</strong> {formData.location.landmark}</div>}
                    {formData.location.address && <div><strong>Address:</strong> {formData.location.address}</div>}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Description</h4>
                <p className="text-sm text-gray-700 bg-white p-3 rounded border">{formData.description}</p>
              </div>
              
              {formData.media.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Media Files</h4>
                  <div className="text-sm text-gray-700">{formData.media.length} file(s) attached</div>
                </div>
              )}
              
              {formData.tags.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Privacy Options */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3">Privacy & Contact Options</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.isAnonymous}
                    onChange={(e) => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-blue-800">Submit this report anonymously</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.followUpRequired}
                    onChange={(e) => setFormData(prev => ({ ...prev, followUpRequired: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-blue-800">I would like to receive follow-up updates on this report</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.evacuationNeeded}
                    onChange={(e) => setFormData(prev => ({ ...prev, evacuationNeeded: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-blue-800">Evacuation may be needed for this area</span>
                </label>
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
              
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 transition-all duration-200"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Submit Report</span>
                    </>
                  )}
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