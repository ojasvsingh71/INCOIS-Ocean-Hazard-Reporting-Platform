import React, { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Users, AlertTriangle, ExternalLink } from 'lucide-react'

const EmergencyContacts = () => {
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [contactType, setContactType] = useState('all')

  const emergencyContacts = [
    {
      id: 1,
      name: 'INCOIS Emergency Response Center',
      type: 'primary',
      region: 'national',
      phone: '+91-40-23886001',
      email: 'emergency@incois.gov.in',
      address: 'Hyderabad, Telangana',
      available: '24/7',
      specialization: 'Tsunami & Ocean Hazards',
      responseTime: '< 5 minutes',
      languages: ['English', 'Hindi', 'Telugu']
    },
    {
      id: 2,
      name: 'Chennai Coast Guard',
      type: 'rescue',
      region: 'tamil_nadu',
      phone: '+91-44-25361405',
      email: 'chennai.coastguard@gov.in',
      address: 'Chennai, Tamil Nadu',
      available: '24/7',
      specialization: 'Maritime Rescue & Safety',
      responseTime: '< 15 minutes',
      languages: ['English', 'Tamil', 'Hindi']
    },
    {
      id: 3,
      name: 'Kerala Disaster Management Authority',
      type: 'disaster',
      region: 'kerala',
      phone: '+91-471-2721566',
      email: 'control@keraladisaster.gov.in',
      address: 'Thiruvananthapuram, Kerala',
      available: '24/7',
      specialization: 'Disaster Response & Coordination',
      responseTime: '< 10 minutes',
      languages: ['English', 'Malayalam', 'Hindi']
    },
    {
      id: 4,
      name: 'Goa Emergency Services',
      type: 'emergency',
      region: 'goa',
      phone: '108',
      email: 'emergency@goa.gov.in',
      address: 'Panaji, Goa',
      available: '24/7',
      specialization: 'General Emergency Response',
      responseTime: '< 8 minutes',
      languages: ['English', 'Konkani', 'Hindi']
    },
    {
      id: 5,
      name: 'Mumbai Port Trust Emergency',
      type: 'port',
      region: 'maharashtra',
      phone: '+91-22-22615000',
      email: 'emergency@mumbaiport.gov.in',
      address: 'Mumbai, Maharashtra',
      available: '24/7',
      specialization: 'Port & Harbor Safety',
      responseTime: '< 12 minutes',
      languages: ['English', 'Marathi', 'Hindi']
    },
    {
      id: 6,
      name: 'Visakhapatnam Naval Base',
      type: 'naval',
      region: 'andhra_pradesh',
      phone: '+91-891-2844444',
      email: 'ops@vizagnaval.gov.in',
      address: 'Visakhapatnam, Andhra Pradesh',
      available: '24/7',
      specialization: 'Naval Operations & Rescue',
      responseTime: '< 20 minutes',
      languages: ['English', 'Telugu', 'Hindi']
    }
  ]

  const regions = [
    { value: 'all', label: 'All Regions' },
    { value: 'national', label: 'National' },
    { value: 'tamil_nadu', label: 'Tamil Nadu' },
    { value: 'kerala', label: 'Kerala' },
    { value: 'goa', label: 'Goa' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'andhra_pradesh', label: 'Andhra Pradesh' }
  ]

  const types = [
    { value: 'all', label: 'All Types' },
    { value: 'primary', label: 'Primary Response' },
    { value: 'rescue', label: 'Rescue Services' },
    { value: 'disaster', label: 'Disaster Management' },
    { value: 'emergency', label: 'Emergency Services' },
    { value: 'port', label: 'Port Authority' },
    { value: 'naval', label: 'Naval Operations' }
  ]

  const getTypeColor = (type) => {
    switch (type) {
      case 'primary': return 'bg-red-100 text-red-800'
      case 'rescue': return 'bg-orange-100 text-orange-800'
      case 'disaster': return 'bg-purple-100 text-purple-800'
      case 'emergency': return 'bg-blue-100 text-blue-800'
      case 'port': return 'bg-green-100 text-green-800'
      case 'naval': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'primary': return AlertTriangle
      case 'rescue': return Users
      case 'disaster': return AlertTriangle
      case 'emergency': return Phone
      case 'port': return MapPin
      case 'naval': return Users
      default: return Phone
    }
  }

  const filteredContacts = emergencyContacts.filter(contact => {
    const matchesRegion = selectedRegion === 'all' || contact.region === selectedRegion
    const matchesType = contactType === 'all' || contact.type === contactType
    return matchesRegion && matchesType
  })

  const quickDialNumbers = [
    { number: '108', label: 'Emergency Services', description: 'General emergency hotline' },
    { number: '1078', label: 'Pollution Control', description: 'Environmental emergencies' },
    { number: '1070', label: 'Coast Guard', description: 'Maritime emergencies' },
    { number: '100', label: 'Police', description: 'Law enforcement' }
  ]

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Phone className="w-6 h-6 mr-2 text-red-600" />
            Emergency Contacts
          </h3>
          <p className="text-gray-600 mt-1">24/7 emergency response and coordination centers</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
          >
            {regions.map(region => (
              <option key={region.value} value={region.value}>{region.label}</option>
            ))}
          </select>
          
          <select
            value={contactType}
            onChange={(e) => setContactType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
          >
            {types.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Dial Numbers */}
      <div className="mb-6">
        <h4 className="text-lg font-medium mb-3">Quick Dial Numbers</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickDialNumbers.map((quick, index) => (
            <div key={index} className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-700 mb-1">{quick.number}</div>
              <div className="text-sm font-medium text-red-800">{quick.label}</div>
              <div className="text-xs text-red-600 mt-1">{quick.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contacts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredContacts.map((contact) => {
          const TypeIcon = getTypeIcon(contact.type)
          return (
            <div key={contact.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TypeIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${getTypeColor(contact.type)}`}>
                      {contact.type.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>ONLINE</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a href={`tel:${contact.phone}`} className="text-blue-600 hover:text-blue-800 font-medium">
                    {contact.phone}
                  </a>
                </div>
                
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-800">
                    {contact.email}
                  </a>
                </div>
                
                <div className="flex items-center space-x-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{contact.address}</span>
                </div>
                
                <div className="flex items-center space-x-3 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{contact.available}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500">Specialization:</span>
                    <p className="font-medium text-gray-900">{contact.specialization}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Response Time:</span>
                    <p className="font-medium text-gray-900">{contact.responseTime}</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <span className="text-gray-500 text-xs">Languages:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {contact.languages.map((lang, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm font-medium">
                  Call Now
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-8">
          <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No emergency contacts found for the selected filters.</p>
        </div>
      )}
    </div>
  )
}

export default EmergencyContacts