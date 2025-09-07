import React, { useState } from 'react'
import { MessageCircle, Send, User, Shield, Award, Clock, ThumbsUp, Flag } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useUser } from '../context/UserContext'
import { formatDistanceToNow } from 'date-fns'

const CommentSystem = ({ reportId, comments = [] }) => {
  const { addComment } = useData()
  const { user, canPerformAction, getRoleColor } = useUser()
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || !canPerformAction('comment')) return

    setIsSubmitting(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    addComment(reportId, newComment.trim(), user.name, user.role)
    setNewComment('')
    setIsSubmitting(false)
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'expert':
      case 'analyst':
        return <Award className="w-4 h-4 text-purple-600" />
      case 'official':
        return <Shield className="w-4 h-4 text-blue-600" />
      case 'admin':
        return <Shield className="w-4 h-4 text-red-600" />
      default:
        return <User className="w-4 h-4 text-gray-600" />
    }
  }

  const sortedComments = [...comments].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <MessageCircle className="w-5 h-5 text-gray-600" />
        <h4 className="text-lg font-semibold text-gray-900">
          Discussion ({comments.length})
        </h4>
      </div>

      {/* Comment Form */}
      {canPerformAction('comment') ? (
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your observations, ask questions, or provide additional information..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                disabled={isSubmitting}
              />
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-gray-500">
                  Commenting as <span className="font-medium">{user?.name}</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getRoleColor(user?.role)}`}>
                    {user?.role?.toUpperCase()}
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Posting...' : 'Post'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            Please log in to participate in the discussion.
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {sortedComments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          sortedComments.map((comment) => (
            <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold text-gray-900">{comment.author}</span>
                    {getRoleIcon(comment.role)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(comment.role)}`}>
                      {comment.role?.toUpperCase()}
                    </span>
                    <span className="text-gray-500">•</span>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-3">{comment.content}</p>
                  
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span>Helpful</span>
                    </button>
                    <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600 transition-colors">
                      <Flag className="w-4 h-4" />
                      <span>Report</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CommentSystem