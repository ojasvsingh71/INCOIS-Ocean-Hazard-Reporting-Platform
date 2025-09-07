import React from 'react'
import { Eye, Type, Contrast, Keyboard } from 'lucide-react'
import { useUser } from '../context/UserContext'

const AccessibilityControls = () => {
  const { userPreferences, updateUserPreferences } = useUser()

  const toggleAccessibilityFeature = (feature) => {
    updateUserPreferences({
      accessibility: {
        ...userPreferences.accessibility,
        [feature]: !userPreferences.accessibility[feature]
      }
    })
  }

  const accessibilityFeatures = [
    {
      key: 'highContrast',
      label: 'High Contrast',
      description: 'Increase contrast for better visibility',
      icon: Contrast
    },
    {
      key: 'largeText',
      label: 'Large Text',
      description: 'Increase text size for better readability',
      icon: Type
    },
    {
      key: 'screenReader',
      label: 'Screen Reader Support',
      description: 'Enhanced support for screen readers',
      icon: Eye
    },
    {
      key: 'keyboardNavigation',
      label: 'Keyboard Navigation',
      description: 'Enhanced keyboard navigation support',
      icon: Keyboard
    }
  ]

  // Apply accessibility styles to document
  React.useEffect(() => {
    const { accessibility } = userPreferences
    
    if (accessibility.highContrast) {
      document.body.classList.add('high-contrast')
    } else {
      document.body.classList.remove('high-contrast')
    }
    
    if (accessibility.largeText) {
      document.body.classList.add('large-text')
    } else {
      document.body.classList.remove('large-text')
    }
    
    if (accessibility.keyboardNavigation) {
      document.body.classList.add('keyboard-navigation')
    } else {
      document.body.classList.remove('keyboard-navigation')
    }
  }, [userPreferences.accessibility])

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Accessibility Settings</h3>
      
      <div className="space-y-3">
        {accessibilityFeatures.map((feature) => {
          const Icon = feature.icon
          const isEnabled = userPreferences.accessibility[feature.key]
          
          return (
            <div key={feature.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5 text-gray-600" />
                <div>
                  <h4 className="font-medium text-gray-900">{feature.label}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={() => toggleAccessibilityFeature(feature.key)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          )
        })}
      </div>
      
      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Keyboard Shortcuts</h4>
        <div className="space-y-1 text-sm text-blue-800">
          <div className="flex justify-between">
            <span>Navigate tabs:</span>
            <kbd className="px-2 py-1 bg-blue-200 rounded text-xs">Tab / Shift+Tab</kbd>
          </div>
          <div className="flex justify-between">
            <span>Activate button:</span>
            <kbd className="px-2 py-1 bg-blue-200 rounded text-xs">Enter / Space</kbd>
          </div>
          <div className="flex justify-between">
            <span>Close modal:</span>
            <kbd className="px-2 py-1 bg-blue-200 rounded text-xs">Escape</kbd>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccessibilityControls