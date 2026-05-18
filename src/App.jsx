import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import AIAssistant from './pages/AIAssistant'
import PeriodTracker from './pages/PeriodTracker'
import Analytics from './pages/Analytics'
import HealthTips from './pages/HealthTips'
import MythBusters from './pages/MythBusters'
import Emergency from './pages/Emergency'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-background text-dark">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/assistant" element={
            <ProtectedRoute>
              <AIAssistant />
            </ProtectedRoute>
          } />
          <Route path="/tracker" element={
            <ProtectedRoute>
              <PeriodTracker />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="/health-tips" element={
            <ProtectedRoute>
              <HealthTips />
            </ProtectedRoute>
          } />
          <Route path="/myth-busters" element={
            <ProtectedRoute>
              <MythBusters />
            </ProtectedRoute>
          } />
          <Route path="/emergency" element={
            <ProtectedRoute>
              <Emergency />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
