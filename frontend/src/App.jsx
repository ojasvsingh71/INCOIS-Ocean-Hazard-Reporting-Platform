import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import ReportHazard from './pages/ReportHazard'
import SocialMedia from './pages/SocialMedia'
import Analytics from './pages/Analytics'
import Login from './pages/Login'
import UserProfile from './components/UserProfile'
import { UserProvider } from './context/UserContext'
import { DataProvider } from './context/DataContext'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {

    const user = localStorage.getItem('incois_user')
    if (user) {
      setIsAuthenticated(true)
    }
  }, [])

  return (
    <UserProvider>
      <DataProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            {isAuthenticated && <Navbar />}
            <Routes>
              <Route
                path="/login"
                element={
                  isAuthenticated ?
                    <Navigate to="/dashboard" /> :
                    <Login onLogin={() => setIsAuthenticated(true)} />
                }
              />
              <Route
                path="/dashboard"
                element={
                  isAuthenticated ?
                    <Dashboard /> :
                    <Navigate to="/login" />
                }
              />
              <Route
                path="/report"
                element={
                  isAuthenticated ?
                    <ReportHazard /> :
                    <Navigate to="/login" />
                }
              />
              <Route
                path="/social-media"
                element={
                  isAuthenticated ?
                    <SocialMedia /> :
                    <Navigate to="/login" />
                }
              />
              <Route
                path="/analytics"
                element={
                  isAuthenticated ?
                    <Analytics /> :
                    <Navigate to="/login" />
                }
              />
              <Route
                path="/profile"
                element={
                  isAuthenticated ?
                    <UserProfile /> :
                    <Navigate to="/login" />
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </Router>
      </DataProvider>
    </UserProvider>
  )
}

export default App