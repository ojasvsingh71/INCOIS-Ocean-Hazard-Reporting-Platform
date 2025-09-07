import React, { useState } from 'react'
import { Download, Share2, FileText, Image, Mail, Link, Facebook, Twitter, Linkedin } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useUser } from '../context/UserContext'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const ExportShare = ({ data, title = "Ocean Hazard Report" }) => {
  const { filteredReports } = useData()
  const { canPerformAction } = useUser()
  const [isExporting, setIsExporting] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  const exportToCSV = () => {
    if (!canPerformAction('export_data')) return

    const headers = [
      'ID', 'Type', 'Severity', 'Location', 'Description', 
      'Reporter', 'Status', 'Timestamp', 'Affected Population'
    ]
    
    const csvData = filteredReports.map(report => [
      report.id,
      report.type,
      report.severity,
      report.location.name,
      report.description.replace(/,/g, ';'), // Replace commas to avoid CSV issues
      report.reporter,
      report.status,
      new Date(report.timestamp).toLocaleString(),
      report.affectedPopulation || 0
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `ocean_hazard_reports_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToPDF = async () => {
    if (!canPerformAction('export_data')) return
    
    setIsExporting(true)
    
    try {
      const pdf = new jsPDF()
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      
      // Title
      pdf.setFontSize(20)
      pdf.text(title, 20, 30)
      
      // Subtitle
      pdf.setFontSize(12)
      pdf.text(`Generated on ${new Date().toLocaleString()}`, 20, 45)
      pdf.text(`Total Reports: ${filteredReports.length}`, 20, 55)
      
      let yPosition = 75
      
      // Summary statistics
      const stats = {
        'High Severity': filteredReports.filter(r => r.severity === 'high').length,
        'Medium Severity': filteredReports.filter(r => r.severity === 'medium').length,
        'Low Severity': filteredReports.filter(r => r.severity === 'low').length,
        'Verified Reports': filteredReports.filter(r => r.status === 'verified').length
      }
      
      pdf.setFontSize(14)
      pdf.text('Summary Statistics:', 20, yPosition)
      yPosition += 15
      
      pdf.setFontSize(10)
      Object.entries(stats).forEach(([key, value]) => {
        pdf.text(`${key}: ${value}`, 25, yPosition)
        yPosition += 10
      })
      
      yPosition += 10
      
      // Reports list
      pdf.setFontSize(14)
      pdf.text('Recent Reports:', 20, yPosition)
      yPosition += 15
      
      pdf.setFontSize(8)
      filteredReports.slice(0, 20).forEach((report, index) => {
        if (yPosition > pageHeight - 40) {
          pdf.addPage()
          yPosition = 30
        }
        
        pdf.text(`${index + 1}. ${report.type.toUpperCase()} - ${report.severity.toUpperCase()}`, 25, yPosition)
        yPosition += 8
        pdf.text(`   Location: ${report.location.name}`, 25, yPosition)
        yPosition += 8
        pdf.text(`   Status: ${report.status} | Reporter: ${report.reporter}`, 25, yPosition)
        yPosition += 8
        pdf.text(`   Time: ${new Date(report.timestamp).toLocaleString()}`, 25, yPosition)
        yPosition += 12
      })
      
      pdf.save(`ocean_hazard_report_${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const captureScreenshot = async () => {
    try {
      const element = document.querySelector('.dashboard-content') || document.body
      const canvas = await html2canvas(element, {
        height: window.innerHeight,
        width: window.innerWidth,
        scrollX: 0,
        scrollY: 0
      })
      
      const link = document.createElement('a')
      link.download = `ocean_hazard_dashboard_${new Date().toISOString().split('T')[0]}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error('Error capturing screenshot:', error)
    }
  }

  const generateShareUrl = () => {
    const baseUrl = window.location.origin
    const params = new URLSearchParams({
      filters: JSON.stringify({
        type: 'all',
        severity: 'all',
        dateRange: '24h'
      }),
      timestamp: Date.now()
    })
    const url = `${baseUrl}/shared-report?${params.toString()}`
    setShareUrl(url)
    
    // Copy to clipboard
    navigator.clipboard.writeText(url).then(() => {
      // Could show a toast notification here
    })
    
    return url
  }

  const shareToSocial = (platform) => {
    const url = generateShareUrl()
    const text = `Check out this ocean hazard report: ${filteredReports.length} reports analyzed`
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    }
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
  }

  const shareViaEmail = () => {
    const url = generateShareUrl()
    const subject = encodeURIComponent('Ocean Hazard Report')
    const body = encodeURIComponent(`I wanted to share this ocean hazard report with you:\n\n${url}\n\nThis report contains ${filteredReports.length} hazard reports and analysis.`)
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Share2 className="w-5 h-5 text-gray-600" />
        <h4 className="text-lg font-semibold text-gray-900">Export & Share</h4>
      </div>

      {/* Export Options */}
      {canPerformAction('export_data') && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h5 className="text-sm font-medium text-gray-900 mb-3">Export Data</h5>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={exportToCSV}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            
            <button
              onClick={exportToPDF}
              disabled={isExporting}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating...' : 'Export PDF'}</span>
            </button>
            
            <button
              onClick={captureScreenshot}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Image className="w-4 h-4" />
              <span>Screenshot</span>
            </button>
          </div>
        </div>
      )}

      {/* Share Options */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h5 className="text-sm font-medium text-gray-900 mb-3">Share Report</h5>
        
        {/* Generate Share Link */}
        <div className="mb-4">
          <button
            onClick={generateShareUrl}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Link className="w-4 h-4" />
            <span>Generate Share Link</span>
          </button>
          
          {shareUrl && (
            <div className="mt-2 p-3 bg-white border border-gray-200 rounded">
              <p className="text-xs text-gray-600 mb-1">Share this link:</p>
              <p className="text-sm font-mono text-gray-900 break-all">{shareUrl}</p>
              <p className="text-xs text-green-600 mt-1">✓ Copied to clipboard</p>
            </div>
          )}
        </div>
        
        {/* Social Media Sharing */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => shareToSocial('twitter')}
            className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            <Twitter className="w-4 h-4" />
            <span>Twitter</span>
          </button>
          
          <button
            onClick={() => shareToSocial('facebook')}
            className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Facebook className="w-4 h-4" />
            <span>Facebook</span>
          </button>
          
          <button
            onClick={() => shareToSocial('linkedin')}
            className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn</span>
          </button>
          
          <button
            onClick={shareViaEmail}
            className="flex items-center justify-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExportShare