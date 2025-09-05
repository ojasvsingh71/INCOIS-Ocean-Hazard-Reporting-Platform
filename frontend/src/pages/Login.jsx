import React, { useState } from 'react'
import { Waves, User, Lock } from 'lucide-react'
import { useUser } from '../context/UserContext'

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState('citizen')
  const { login } = useUser()

  const handleSubmit = (e) => {
    e.preventDefault()


    const userData = {
      id: 1,
      name: email.split('@')[0] || 'User',
      email,
      role: selectedRole
    }

    login(userData)
    onLogin()
  }

  const demoAccounts = [
    { role: 'citizen', email: 'citizen@demo.com', name: 'Citizen User' },
    { role: 'official', email: 'official@incois.gov.in', name: 'INCOIS Official' },
    { role: 'analyst', email: 'analyst@incois.gov.in', name: 'Data Analyst' }
  ]

  const quickLogin = (account) => {
    setEmail(account.email)
    setSelectedRole(account.role)
    const userData = {
      id: 1,
      name: account.name,
      email: account.email,
      role: account.role
    }
    login(userData)
    onLogin()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <Waves className="w-12 h-12 text-teal-400" />
            <div className="text-white">
              <h1 className="text-2xl font-bold">INCOIS</h1>
              <p className="text-sm text-blue-200">Ocean Hazard Reporting Platform</p>
            </div>
          </div>
          <h2 className="text-white text-xl font-semibold">Sign in to your account</h2>
          <p className="mt-2 text-blue-200">Monitor and report ocean hazards in real-time</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="citizen">Citizen</option>
                <option value="official">INCOIS Official</option>
                <option value="analyst">Data Analyst</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6">
            <div className="text-center text-sm text-gray-500 mb-4">
              Quick Demo Login
            </div>
            <div className="space-y-2">
              {demoAccounts.map((account, index) => (
                <button
                  key={index}
                  onClick={() => quickLogin(account)}
                  className="w-full text-left px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-sm"
                >
                  <span className="font-medium">{account.name}</span>
                  <span className="text-gray-500 ml-2">({account.role})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login