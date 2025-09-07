import React from 'react'
import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

const LanguageSelector = () => {
  const { i18n } = useTranslation()

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' }
  ]

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode)
  }

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
        <Globe className="w-4 h-4" />
        <span className="text-sm">
          {languages.find(lang => lang.code === i18n.language)?.flag || '🌐'}
        </span>
      </button>
      
      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-2">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                i18n.language === language.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="font-medium">{language.name}</span>
              {i18n.language === language.code && (
                <span className="ml-auto text-blue-600">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LanguageSelector