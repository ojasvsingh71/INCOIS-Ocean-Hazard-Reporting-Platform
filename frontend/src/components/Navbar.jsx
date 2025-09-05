import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, AlertTriangle, MessageCircle, BarChart3, LogOut, Waves } from 'lucide-react'
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
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Waves className="w-8 h-8 text-teal-400" />
              <div>
                <h1 className="text-lg font-bold">INCOIS</h1>
                <p className="text-xs text-blue-200">Ocean Hazard Platform</p>
              </div>
            </div>
            
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'bg-blue-700 text-white'
                        : 'text-blue-200 hover:text-white hover:bg-blue-800'
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
            <div className="text-sm">
              <span className="text-blue-200">Welcome,</span>
              <span className="font-medium ml-1">{user?.name}</span>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              user?.role === 'analyst' ? 'bg-purple-600' :
              user?.role === 'official' ? 'bg-orange-600' : 'bg-green-600'
            }`}>
              {user?.role}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-blue-200 hover:text-white hover:bg-blue-800 transition-colors"
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