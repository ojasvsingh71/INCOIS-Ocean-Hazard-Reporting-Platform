import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, AlertTriangle, MessageCircle, BarChart3, LogOut, Waves, Bell, Settings } from 'lucide-react'
import { useUser } from '../context/UserContext'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useUser()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/report', icon: AlertTriangle, label: 'Report Hazard' },
    { path: '/social-media', icon: MessageCircle, label: 'Social Media' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' }
  ]

  return (
    <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-teal-800 text-white shadow-xl border-b border-blue-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-teal-400 to-blue-400 rounded-lg shadow-lg">
                <Waves className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">INCOIS</h1>
                <p className="text-xs text-blue-200">Ocean Hazard Command Center</p>
              </div>
            </div>
            
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                        : 'text-blue-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <button className="relative p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              </span>
            </button>
            
            {/* Settings */}
            <button className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
              <Settings className="w-5 h-5" />
            </button>
            
            {/* User Info */}
            <div className="text-sm bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
              <span className="text-blue-200">Welcome,</span>
              <span className="font-semibold ml-1 text-white">{user?.name}</span>
            </div>
            
            {/* Role Badge */}
            <div className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
              user?.role === 'analyst' ? 'bg-purple-500 text-white' :
              user?.role === 'official' ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'
            }`}>
              {user?.role?.toUpperCase()}
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-blue-200 hover:text-white hover:bg-red-500/20 border border-transparent hover:border-red-400/30 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar