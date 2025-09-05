import React, { useState } from 'react'
import { User, Settings, Bell, Shield, MapPin, Clock, Award, Activity } from 'lucide-react'
import { useUser } from '../context/UserContext'

const UserProfile = () => {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState('profile')
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    emergency: true
  })

  const userStats = {
    reportsSubmitted: 23,
    reportsVerified: 18,
    responseTime: '2.5 hours',
    accuracy: '94%',
    badgesEarned: 5,
    contributionScore: 850
  }

  const recentActivity = [
    {
      id: 1,
      type: 'report',
      title: 'Submitted tsunami report',
      location: 'Chennai, Tamil Nadu',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: 'verified'
    },
    {
      id: 2,
      type: 'verification',
      title: 'Verified storm surge report',
      location: 'Kochi, Kerala',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'completed'
    },
    {
      id: 3,
      type: 'badge',
      title: 'Earned "Quick Responder" badge',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      status: 'achieved'
    }
  ]

  const badges = [
    { name: 'First Reporter', description: 'First to report a hazard', earned: true, icon: '🏆' },
    { name: 'Quick Responder', description: 'Response time under 5 minutes', earned: true, icon: '⚡' },
    { name: 'Accurate Observer', description: '95%+ accuracy rate', earned: true, icon: '🎯' },
    { name: 'Community Helper', description: 'Helped verify 50+ reports', earned: false, icon: '🤝' },
    { name: 'Expert Analyst', description: 'Advanced hazard analysis', earned: false, icon: '🔬' }
  ]

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'achievements', label: 'Achievements', icon: Award }
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-6 py-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-blue-100">{user?.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user?.role === 'analyst' ? 'bg-purple-500/20 text-purple-100' :
                  user?.role === 'official' ? 'bg-orange-500/20 text-orange-100' : 
                  'bg-green-500/20 text-green-100'
                }`}>
                  {user?.role?.toUpperCase()}
                </span>
                <span className="text-blue-100 text-sm">Member since 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={user?.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={user?.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <input
                        type="text"
                        value={user?.role}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        placeholder="Your location"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Expertise Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Tsunami Detection', 'Storm Surge Analysis', 'Coastal Monitoring', 'Emergency Response'].map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{userStats.reportsSubmitted}</div>
                    <div className="text-sm text-gray-600">Reports Submitted</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{userStats.reportsVerified}</div>
                    <div className="text-sm text-gray-600">Reports Verified</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{userStats.accuracy}</div>
                    <div className="text-sm text-gray-600">Accuracy Rate</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{userStats.contributionScore}</div>
                    <div className="text-sm text-gray-600">Contribution Score</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'report' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'verification' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {activity.type === 'report' ? '📝' : activity.type === 'verification' ? '✅' : '🏆'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      {activity.location && (
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {activity.location}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.timestamp.toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activity.status === 'verified' ? 'bg-green-100 text-green-800' :
                      activity.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium capitalize">{key} Notifications</p>
                        <p className="text-sm text-gray-600">
                          Receive {key} notifications for hazard alerts and updates
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Profile Visibility</p>
                      <p className="text-sm text-gray-600">Make your profile visible to other users</p>
                    </div>
                    <select className="px-3 py-2 border border-gray-300 rounded-md">
                      <option>Public</option>
                      <option>Team Only</option>
                      <option>Private</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Badges & Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map((badge, index) => (
                  <div key={index} className={`p-6 rounded-lg border-2 transition-all ${
                    badge.earned 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}>
                    <div className="text-center">
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <h4 className="font-semibold text-gray-900">{badge.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
                      {badge.earned && (
                        <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Earned
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile