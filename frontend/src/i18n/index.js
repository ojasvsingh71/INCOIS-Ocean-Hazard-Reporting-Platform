import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.map': 'Live Map',
      'nav.report': 'Report Hazard',
      'nav.social': 'Social Media',
      'nav.analytics': 'Analytics',
      'nav.emergency': 'Emergency',
      'nav.profile': 'Profile',
      'nav.logout': 'Logout',
      
      // Dashboard
      'dashboard.title': 'Ocean Hazard Command Center',
      'dashboard.subtitle': 'Real-time monitoring and early warning system',
      'dashboard.totalReports': 'Total Reports',
      'dashboard.activeHazards': 'Active Hazards',
      'dashboard.responseTime': 'Response Time',
      'dashboard.coverage': 'Coverage Area',
      
      // Report Form
      'report.title': 'Report Ocean Hazard',
      'report.subtitle': 'Help protect coastal communities by reporting observed hazards',
      'report.type': 'Hazard Type',
      'report.severity': 'Severity Level',
      'report.location': 'Location',
      'report.description': 'Description',
      'report.submit': 'Submit Report',
      'report.success': 'Report Submitted Successfully',
      
      // Hazard Types
      'hazard.tsunami': 'Tsunami',
      'hazard.storm_surge': 'Storm Surge',
      'hazard.high_waves': 'High Waves',
      'hazard.swell_surge': 'Swell Surge',
      'hazard.coastal_erosion': 'Coastal Erosion',
      'hazard.abnormal_tide': 'Abnormal Tide',
      
      // Severity Levels
      'severity.low': 'Low Risk',
      'severity.medium': 'Moderate Risk',
      'severity.high': 'High Risk',
      
      // Status
      'status.pending': 'Pending',
      'status.investigating': 'Investigating',
      'status.verified': 'Verified',
      'status.confirmed': 'Confirmed',
      'status.resolved': 'Resolved',
      
      // Common
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.cancel': 'Cancel',
      'common.save': 'Save',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.view': 'View',
      'common.close': 'Close',
      'common.search': 'Search',
      'common.filter': 'Filter',
      'common.export': 'Export',
      'common.share': 'Share'
    }
  },
  hi: {
    translation: {
      // Navigation
      'nav.dashboard': 'डैशबोर्ड',
      'nav.map': 'लाइव मैप',
      'nav.report': 'खतरे की रिपोर्ट',
      'nav.social': 'सोशल मीडिया',
      'nav.analytics': 'विश्लेषण',
      'nav.emergency': 'आपातकाल',
      'nav.profile': 'प्रोफ़ाइल',
      'nav.logout': 'लॉग आउट',
      
      // Dashboard
      'dashboard.title': 'समुद्री खतरा कमांड सेंटर',
      'dashboard.subtitle': 'रीयल-टाइम निगरानी और प्रारंभिक चेतावनी प्रणाली',
      'dashboard.totalReports': 'कुल रिपोर्ट',
      'dashboard.activeHazards': 'सक्रिय खतरे',
      'dashboard.responseTime': 'प्रतिक्रिया समय',
      'dashboard.coverage': 'कवरेज क्षेत्र',
      
      // Report Form
      'report.title': 'समुद्री खतरे की रिपोर्ट करें',
      'report.subtitle': 'देखे गए खतरों की रिपोर्ट करके तटीय समुदायों की सुरक्षा में मदद करें',
      'report.type': 'खतरे का प्रकार',
      'report.severity': 'गंभीरता स्तर',
      'report.location': 'स्थान',
      'report.description': 'विवरण',
      'report.submit': 'रिपोर्ट जमा करें',
      'report.success': 'रिपोर्ट सफलतापूर्वक जमा की गई',
      
      // Hazard Types
      'hazard.tsunami': 'सुनामी',
      'hazard.storm_surge': 'तूफानी लहर',
      'hazard.high_waves': 'ऊंची लहरें',
      'hazard.swell_surge': 'स्वेल सर्ज',
      'hazard.coastal_erosion': 'तटीय कटाव',
      'hazard.abnormal_tide': 'असामान्य ज्वार',
      
      // Severity Levels
      'severity.low': 'कम जोखिम',
      'severity.medium': 'मध्यम जोखिम',
      'severity.high': 'उच्च जोखिम',
      
      // Status
      'status.pending': 'लंबित',
      'status.investigating': 'जांच में',
      'status.verified': 'सत्यापित',
      'status.confirmed': 'पुष्ट',
      'status.resolved': 'हल',
      
      // Common
      'common.loading': 'लोड हो रहा है...',
      'common.error': 'त्रुटि',
      'common.success': 'सफलता',
      'common.cancel': 'रद्द करें',
      'common.save': 'सहेजें',
      'common.delete': 'हटाएं',
      'common.edit': 'संपादित करें',
      'common.view': 'देखें',
      'common.close': 'बंद करें',
      'common.search': 'खोजें',
      'common.filter': 'फ़िल्टर',
      'common.export': 'निर्यात',
      'common.share': 'साझा करें'
    }
  },
  ta: {
    translation: {
      // Navigation
      'nav.dashboard': 'டாஷ்போர்டு',
      'nav.map': 'நேரடி வரைபடம்',
      'nav.report': 'ஆபத்து அறிக்கை',
      'nav.social': 'சமூக ஊடகம்',
      'nav.analytics': 'பகுப்பாய்வு',
      'nav.emergency': 'அவசரநிலை',
      'nav.profile': 'சுயவிவரம்',
      'nav.logout': 'வெளியேறு',
      
      // Dashboard
      'dashboard.title': 'கடல் ஆபத்து கட்டளை மையம்',
      'dashboard.subtitle': 'நிகழ்நேர கண்காணிப்பு மற்றும் முன்னெச்சரிக்கை அமைப்பு',
      'dashboard.totalReports': 'மொத்த அறிக்கைகள்',
      'dashboard.activeHazards': 'செயலில் உள்ள ஆபத்துகள்',
      'dashboard.responseTime': 'பதில் நேரம்',
      'dashboard.coverage': 'கவரேஜ் பகுதி',
      
      // Report Form
      'report.title': 'கடல் ஆபத்தை அறிவிக்கவும்',
      'report.subtitle': 'கண்டறியப்பட்ட ஆபத்துகளை அறிவித்து கடலோர சமூகங்களைப் பாதுகாக்க உதவுங்கள்',
      'report.type': 'ஆபத்து வகை',
      'report.severity': 'தீவிரத்தன்மை நிலை',
      'report.location': 'இடம்',
      'report.description': 'விளக்கம்',
      'report.submit': 'அறிக்கையை சமர்பிக்கவும்',
      'report.success': 'அறிக்கை வெற்றிகரமாக சமர்பிக்கப்பட்டது',
      
      // Common
      'common.loading': 'ஏற்றுகிறது...',
      'common.error': 'பிழை',
      'common.success': 'வெற்றி',
      'common.cancel': 'ரத்து செய்',
      'common.save': 'சேமி',
      'common.delete': 'நீக்கு',
      'common.edit': 'திருத்து',
      'common.view': 'பார்',
      'common.close': 'மூடு',
      'common.search': 'தேடு',
      'common.filter': 'வடிகட்டி',
      'common.export': 'ஏற்றுமதி',
      'common.share': 'பகிர்'
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  })

export default i18n