import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Camera, Video, Mic, X, Eye, Download, FileText } from 'lucide-react'

const MediaUpload = ({ onMediaChange, existingMedia = [], maxFiles = 5 }) => {
  const [uploadedFiles, setUploadedFiles] = useState(existingMedia)
  const [previewFile, setPreviewFile] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      id: `${Date.now()}_${Math.random()}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadProgress: 0
    }))

    // Simulate upload progress
    newFiles.forEach(fileObj => {
      simulateUpload(fileObj)
    })

    const updatedFiles = [...uploadedFiles, ...newFiles].slice(0, maxFiles)
    setUploadedFiles(updatedFiles)
    onMediaChange(updatedFiles)
  }, [uploadedFiles, maxFiles, onMediaChange])

  const simulateUpload = (fileObj) => {
    const interval = setInterval(() => {
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileObj.id 
            ? { ...f, uploadProgress: Math.min(f.uploadProgress + 10, 100) }
            : f
        )
      )
    }, 100)

    setTimeout(() => {
      clearInterval(interval)
    }, 1000)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi'],
      'audio/*': ['.mp3', '.wav', '.m4a']
    },
    maxFiles: maxFiles - uploadedFiles.length,
    maxSize: 50 * 1024 * 1024 // 50MB
  })

  const removeFile = (fileId) => {
    const updatedFiles = uploadedFiles.filter(f => f.id !== fileId)
    setUploadedFiles(updatedFiles)
    onMediaChange(updatedFiles)
  }

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <Camera className="w-5 h-5" />
    if (type.startsWith('video/')) return <Video className="w-5 h-5" />
    if (type.startsWith('audio/')) return <Mic className="w-5 h-5" />
    return <FileText className="w-5 h-5" />
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const canUploadMore = uploadedFiles.length < maxFiles

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {canUploadMore && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="flex justify-center space-x-4">
              <Camera className="w-8 h-8 text-gray-400" />
              <Video className="w-8 h-8 text-gray-400" />
              <Mic className="w-8 h-8 text-gray-400" />
            </div>
            
            {isDragActive ? (
              <p className="text-blue-600 font-medium">Drop files here...</p>
            ) : (
              <div>
                <p className="text-gray-600 font-medium mb-2">
                  Drag & drop media files here, or click to select
                </p>
                <p className="text-sm text-gray-500">
                  Supports images, videos, and audio files (max {maxFiles} files, 50MB each)
                </p>
              </div>
            )}
            
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
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">
            Uploaded Media ({uploadedFiles.length}/{maxFiles})
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {uploadedFiles.map((fileObj) => (
              <div key={fileObj.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 text-gray-400">
                    {getFileIcon(fileObj.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fileObj.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(fileObj.size)}
                    </p>
                    
                    {/* Upload Progress */}
                    {fileObj.uploadProgress < 100 && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${fileObj.uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Uploading... {fileObj.uploadProgress}%
                        </p>
                      </div>
                    )}
                    
                    {/* Preview for images */}
                    {fileObj.type.startsWith('image/') && fileObj.uploadProgress === 100 && (
                      <div className="mt-2">
                        <img
                          src={fileObj.url}
                          alt={fileObj.name}
                          className="w-full h-20 object-cover rounded cursor-pointer"
                          onClick={() => setPreviewFile(fileObj)}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-shrink-0 flex space-x-1">
                    {fileObj.type.startsWith('image/') && (
                      <button
                        onClick={() => setPreviewFile(fileObj)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => removeFile(fileObj.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{previewFile.name}</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const link = document.createElement('a')
                    link.href = previewFile.url
                    link.download = previewFile.name
                    link.click()
                  }}
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              {previewFile.type.startsWith('image/') && (
                <img
                  src={previewFile.url}
                  alt={previewFile.name}
                  className="max-w-full h-auto"
                />
              )}
              {previewFile.type.startsWith('video/') && (
                <video
                  src={previewFile.url}
                  controls
                  className="max-w-full h-auto"
                />
              )}
              {previewFile.type.startsWith('audio/') && (
                <audio
                  src={previewFile.url}
                  controls
                  className="w-full"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MediaUpload