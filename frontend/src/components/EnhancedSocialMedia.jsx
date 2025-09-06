import React, { useState, useEffect } from 'react'
import { MessageCircle, TrendingUp, AlertCircle, Filter, Search, Heart, Share, MessageSquare, ExternalLink, Zap } from 'lucide-react'
import { useData } from '../context/DataContext'

const EnhancedSocialMedia = () => {
  const { socialMediaPosts } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedSentiment, setSelectedSentiment] = useState('all')
  const [realTimeUpdates, setRealTimeUpdates] = useState(true)
  const [selectedPost, setSelectedPost] = useState(null)

  // Enhanced mock data with more realistic social media posts
  const [enhancedPosts, setEnhancedPosts] = useState([
    {
      id: 'sm1',
      platform: 'twitter',
      username: '@CoastalWatch_TN',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=50&h=50&fit=crop&crop=face',
      content: 'Massive waves hitting Marina Beach right now! Water levels rising rapidly. Everyone please stay away from the shore. #TsunamiAlert #Chennai #SafetyFirst',
      location: 'Chennai, Tamil Nadu',
      sentiment: 'concern',
      engagement: { likes: 245, shares: 89, comments: 34 },
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      relevanceScore: 0.95,
      verified: true,
      media: ['https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?w=400&h=300&fit=crop'],
      hashtags: ['#TsunamiAlert', '#Chennai', '#SafetyFirst']
    },
    {
      id: 'sm2',
      platform: 'facebook',
      username: 'Kerala Fishermen Association',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?w=50&h=50&fit=crop&crop=face',
      content: 'URGENT: All fishing boats advised to return to harbor immediately. Unusual wave patterns observed 15km off Kochi coast. Coast Guard has been notified.',
      location: 'Kochi, Kerala',
      sentiment: 'warning',
      engagement: { likes: 156, shares: 203, comments: 67 },
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      relevanceScore: 0.92,
      verified: true,
      media: [],
      hashtags: ['#FishingSafety', '#Kochi']
    },
    {
      id: 'sm3',
      platform: 'instagram',
      username: '@goa_beaches_official',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=50&h=50&fit=crop&crop=face',
      content: 'Beach advisory: High tide and strong currents at Baga Beach. Lifeguards on high alert. Please follow safety guidelines and swim only in designated areas.',
      location: 'Goa',
      sentiment: 'neutral',
      engagement: { likes: 89, shares: 23, comments: 12 },
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      relevanceScore: 0.78,
      verified: false,
      media: ['https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?w=400&h=300&fit=crop'],
      hashtags: ['#BeachSafety', '#Goa']
    },
    {
      id: 'sm4',
      platform: 'twitter',
      username: '@WeatherAlert_IN',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=50&h=50&fit=crop&crop=face',
      content: 'Meteorological update: Low pressure system developing in Bay of Bengal. Coastal areas of Tamil Nadu and Andhra Pradesh should monitor conditions closely.',
      location: 'Bay of Bengal',
      sentiment: 'neutral',
      engagement: { likes: 334, shares: 156, comments: 78 },
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      relevanceScore: 0.88,
      verified: true,
      media: [],
      hashtags: ['#WeatherUpdate', '#BayOfBengal']
    }
  ])

  const platforms = [
    { value: 'all', label: 'All Platforms', color: 'gray' },
    { value: 'twitter', label: 'Twitter', color: 'blue' },
    { value: 'facebook', label: 'Facebook', color: 'blue' },
    { value: 'instagram', label: 'Instagram', color: 'pink' }
  ]

  const sentiments = [
    { value: 'all', label: 'All Sentiments' },
    { value: 'concern', label: 'Concern', color: 'orange' },
    { value: 'warning', label: 'Warning', color: 'red' },
    { value: 'neutral', label: 'Neutral', color: 'gray' },
    { value: 'positive', label: 'Positive', color: 'green' }
  ]

  const filteredPosts = enhancedPosts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.username.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlatform = selectedPlatform === 'all' || post.platform === selectedPlatform
    const matchesSentiment = selectedSentiment === 'all' || post.sentiment === selectedSentiment
    return matchesSearch && matchesPlatform && matchesSentiment
  })

  const getPlatformIcon = (platform) => {
    return MessageCircle
  }

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'twitter': return 'bg-blue-500'
      case 'facebook': return 'bg-blue-600'
      case 'instagram': return 'bg-pink-500'
      default: return 'bg-gray-500'
    }
  }

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'concern': return 'text-orange-600 bg-orange-100'
      case 'warning': return 'text-red-600 bg-red-100'
      case 'neutral': return 'text-gray-600 bg-gray-100'
      case 'positive': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const mockTrendingTopics = [
    { hashtag: '#TsunamiAlert', posts: 1245, trend: '+25%', urgency: 'high' },
    { hashtag: '#CoastalFlood', posts: 892, trend: '+18%', urgency: 'medium' },
    { hashtag: '#Chennai', posts: 756, trend: '+32%', urgency: 'high' },
    { hashtag: '#BeachSafety', posts: 634, trend: '+12%', urgency: 'low' },
    { hashtag: '#WeatherAlert', posts: 523, trend: '+8%', urgency: 'medium' }
  ]

  const sentimentStats = {
    concern: enhancedPosts.filter(p => p.sentiment === 'concern').length,
    warning: enhancedPosts.filter(p => p.sentiment === 'warning').length,
    neutral: enhancedPosts.filter(p => p.sentiment === 'neutral').length,
    positive: enhancedPosts.filter(p => p.sentiment === 'positive').length
  }

  // Simulate real-time updates
  useEffect(() => {
    if (!realTimeUpdates) return

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newPost = {
          id: `sm_${Date.now()}`,
          platform: ['twitter', 'facebook', 'instagram'][Math.floor(Math.random() * 3)],
          username: '@LiveUpdate_' + Math.floor(Math.random() * 1000),
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=50&h=50&fit=crop&crop=face',
          content: 'New hazard observation reported from coastal monitoring station...',
          location: ['Chennai', 'Kochi', 'Mumbai'][Math.floor(Math.random() * 3)],
          sentiment: ['concern', 'warning', 'neutral'][Math.floor(Math.random() * 3)],
          engagement: { likes: Math.floor(Math.random() * 100), shares: Math.floor(Math.random() * 50), comments: Math.floor(Math.random() * 25) },
          timestamp: new Date().toISOString(),
          relevanceScore: 0.5 + Math.random() * 0.5,
          verified: Math.random() > 0.5,
          media: [],
          hashtags: ['#LiveUpdate']
        }
        setEnhancedPosts(prev => [newPost, ...prev.slice(0, 19)])
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [realTimeUpdates])

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Social Media Intelligence</h1>
            <p className="text-gray-600">Real-time monitoring and sentiment analysis of hazard-related social activity</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${realTimeUpdates ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-600">
                {realTimeUpdates ? 'Live Monitoring' : 'Paused'}
              </span>
              <button
                onClick={() => setRealTimeUpdates(!realTimeUpdates)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {realTimeUpdates ? 'Pause' : 'Resume'}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-900">{enhancedPosts.length}</div>
            <div className="text-sm text-blue-700">Total Posts</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-900">{sentimentStats.warning + sentimentStats.concern}</div>
            <div className="text-sm text-red-700">High Priority</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-900">94%</div>
            <div className="text-sm text-green-700">Accuracy Rate</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-900">2.3s</div>
            <div className="text-sm text-purple-700">Avg Response</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Enhanced Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </h3>

            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {platforms.map((platform) => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sentiment</label>
                <select
                  value={selectedSentiment}
                  onChange={(e) => setSelectedSentiment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {sentiments.map((sentiment) => (
                    <option key={sentiment.value} value={sentiment.value}>
                      {sentiment.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Enhanced Trending Topics */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Trending Topics
            </h3>
            <div className="space-y-3">
              {mockTrendingTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      topic.urgency === 'high' ? 'bg-red-500 animate-pulse' :
                      topic.urgency === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <span className="font-medium text-blue-600">{topic.hashtag}</span>
                      <p className="text-xs text-gray-500">{topic.posts.toLocaleString()} posts</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-green-600 font-medium">{topic.trend}</span>
                    <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                      topic.urgency === 'high' ? 'bg-red-100 text-red-700' :
                      topic.urgency === 'medium' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {topic.urgency}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sentiment Analysis */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Sentiment Analysis
            </h3>
            <div className="space-y-3">
              {Object.entries(sentimentStats).map(([sentiment, count]) => (
                <div key={sentiment} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getSentimentColor(sentiment).split(' ')[1]}`}></div>
                    <span className="text-sm capitalize">{sentiment}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getSentimentColor(sentiment).split(' ')[1]}`}
                        style={{ width: `${(count / enhancedPosts.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium min-w-[1.5rem]">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Posts Feed */}
        <div className="lg:col-span-3">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Social Media Feed</h3>
                  <p className="text-sm text-gray-600">{filteredPosts.length} posts found</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">AI-Powered Analysis</span>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200 max-h-[800px] overflow-y-auto">
              {filteredPosts.map((post) => {
                const PlatformIcon = getPlatformIcon(post.platform)
                return (
                  <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-4">
                      {/* Avatar and Platform */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={post.avatar}
                          alt={post.username}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${getPlatformColor(post.platform)}`}>
                          <PlatformIcon className="w-3 h-3 text-white" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-gray-900">{post.username}</span>
                          {post.verified && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{post.location}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">
                            {new Date(post.timestamp).toLocaleTimeString()}
                          </span>
                        </div>

                        {/* Content */}
                        <p className="text-gray-900 mb-3 leading-relaxed">{post.content}</p>

                        {/* Media */}
                        {post.media && post.media.length > 0 && (
                          <div className="mb-3">
                            <img
                              src={post.media[0]}
                              alt="Post media"
                              className="w-full max-w-md h-48 object-cover rounded-lg shadow-sm"
                            />
                          </div>
                        )}

                        {/* Hashtags */}
                        {post.hashtags && post.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.hashtags.map((hashtag, index) => (
                              <span key={index} className="text-blue-600 text-sm hover:text-blue-800 cursor-pointer">
                                {hashtag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4" />
                              <span>{post.engagement.likes}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Share className="w-4 h-4" />
                              <span>{post.engagement.shares}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageSquare className="w-4 h-4" />
                              <span>{post.engagement.comments}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${getSentimentColor(post.sentiment)}`}>
                              {post.sentiment}
                            </span>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <span>Relevance:</span>
                              <span className="font-medium">{(post.relevanceScore * 100).toFixed(0)}%</span>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedSocialMedia