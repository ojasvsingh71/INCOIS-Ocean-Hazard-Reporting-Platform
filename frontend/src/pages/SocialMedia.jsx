import React, { useState } from 'react'
import { MessageCircle, TrendingUp, AlertCircle, Filter, Search } from 'lucide-react'
import { useData } from '../context/DataContext'

const SocialMedia = () => {
  const { socialMediaPosts } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedSentiment, setSelectedSentiment] = useState('all')

  const platforms = [
    { value: 'all', label: 'All Platforms' },
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

  const filteredPosts = socialMediaPosts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlatform = selectedPlatform === 'all' || post.platform === selectedPlatform
    const matchesSentiment = selectedSentiment === 'all' || post.sentiment === selectedSentiment
    return matchesSearch && matchesPlatform && matchesSentiment
  })

  const getPlatformIcon = (platform) => {
    return MessageCircle
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
    { hashtag: '#tsunami', posts: 245, trend: '+15%' },
    { hashtag: '#coastalflood', posts: 189, trend: '+8%' },
    { hashtag: '#chennai', posts: 156, trend: '+22%' },
    { hashtag: '#oceanalert', posts: 134, trend: '+12%' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Social Media Monitoring</h1>
        <p className="text-gray-600">Real-time analysis of hazard-related social media activity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        <div className="lg:col-span-1 space-y-6">

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>


            <div className="mb-4">
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
            </div>


            <div className="mb-4">
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


          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Trending Topics
            </h3>
            <div className="space-y-3">
              {mockTrendingTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <span className="font-medium text-blue-600">{topic.hashtag}</span>
                    <p className="text-sm text-gray-500">{topic.posts} posts</p>
                  </div>
                  <span className="text-xs text-green-600 font-medium">{topic.trend}</span>
                </div>
              ))}
            </div>
          </div>


          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Alert Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">High Priority</span>
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Medium Priority</span>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Low Priority</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">12</span>
              </div>
            </div>
          </div>
        </div>


        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Social Media Posts</h3>
              <p className="text-sm text-gray-600">{filteredPosts.length} posts found</p>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredPosts.map((post) => {
                const PlatformIcon = getPlatformIcon(post.platform)
                return (
                  <div key={post.id} className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${post.platform === 'twitter' ? 'bg-blue-100 text-blue-600' :
                            post.platform === 'facebook' ? 'bg-blue-100 text-blue-600' :
                              'bg-pink-100 text-pink-600'
                          }`}>
                          <PlatformIcon className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-medium capitalize">{post.platform}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getSentimentColor(post.sentiment)}`}>
                            {post.sentiment}
                          </span>
                          <span className="text-sm text-gray-500">{post.location}</span>
                        </div>

                        <p className="text-gray-900 mb-3">{post.content}</p>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span>{post.engagement} interactions</span>
                            <span>Relevance: {(post.relevanceScore * 100).toFixed(0)}%</span>
                          </div>
                          <span>{new Date(post.timestamp).toLocaleString()}</span>
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

export default SocialMedia