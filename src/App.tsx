import React, { useEffect, useState } from 'react'
import './App.css'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import EmailVerification from './pages/EmailVerification'
import Dashboard from './pages/firm/Dashboard'
import LoadBoard from './pages/firm/LoadBoard'
import TruckBoard from './pages/firm/TruckBoard'
import AdminConsole from './pages/firm/AdminConsole'
import Search from './pages/firm/Search'
import Profile from './pages/firm/Profile'
import Notifications from './pages/firm/Notifications'
import BusinessProfilePage from './pages/firm/BusinessProfile'
import ResetPassword from './pages/ResetPassword'
import { fetchAuthSession } from 'aws-amplify/auth'
import AppLayout from './navigation/AppLayout'
import { LoadProvider } from './context/LoadContext'

// Redirect to dashboard if already signed in
function RedirectIfSignedIn({ children }: { children: React.ReactElement }) {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const session = await fetchAuthSession()
        const signedIn = Boolean(session?.tokens)
        if (signedIn && mounted) {
          navigate('/firm', { replace: true })
          return
        }
      } catch {
        // ignore
      } finally {
        if (mounted) setChecking(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [navigate])
  if (checking) return null
  return children
}

// Protect routes that require authentication
function RequireAuth({ children }: { children: React.ReactElement }) {
  const [allowed, setAllowed] = useState<boolean | null>(null)
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const session = await fetchAuthSession()
        if (mounted) setAllowed(Boolean(session?.tokens))
      } catch {
        if (mounted) setAllowed(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])
  if (allowed === null) return null
  return allowed ? children : <Navigate to="/login" replace />
}

function App() {
  // No additional styling needed here; each page styles itself.
  return (
    <LoadProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Auth routes (no sidebar) */}
        <Route
          path="/login"
          element={
            <RedirectIfSignedIn>
              <Login />
            </RedirectIfSignedIn>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectIfSignedIn>
              <Register />
            </RedirectIfSignedIn>
          }
        />
        <Route
          path="/verify"
          element={
            <RedirectIfSignedIn>
              <EmailVerification />
            </RedirectIfSignedIn>
          }
        />
        <Route
          path="/reset"
          element={
            <RedirectIfSignedIn>
              <ResetPassword />
            </RedirectIfSignedIn>
          }
        />

        {/* Protected routes with sidebar layout */}
        <Route
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route path="/firm" element={<Dashboard />} />
          <Route path="/firm/load-board" element={<LoadBoard />} />
          <Route path="/firm/truck-board" element={<TruckBoard />} />
          <Route path="/firm/admin" element={<AdminConsole />} />
          <Route path="/firm/search" element={<Search />} />
          <Route path="/firm/notifications" element={<Notifications />} />
          <Route path="/firm/profile" element={<Profile />} />
          <Route path="/firm/business-profile" element={<BusinessProfilePage />} />
        </Route>
      </Routes>
    </LoadProvider>
  )
}

export default App
