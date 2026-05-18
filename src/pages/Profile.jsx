import { useState, useEffect } from 'react'
import Sidebar from '../components/dashboard/Sidebar'
import Topbar from '../components/dashboard/Topbar'
import ProfileHeader from '../components/profile/ProfileHeader'
import PersonalInformation from '../components/profile/PersonalInformation'
import AccountSettings from '../components/profile/AccountSettings'
import UserStats from '../components/profile/UserStats'
import HealthPreferences from '../components/profile/HealthPreferences'
import NotificationSettings from '../components/profile/NotificationSettings'
import DangerZone from '../components/profile/DangerZone'
import { getStoredUser } from '../utils/userHelpers'
import { saveUser } from '../api/api'
import { getOnboardingData } from '../api/userApi'
import { getCycleLogs } from '../api/cycleApi'
import { getWellnessLogs } from '../api/wellnessApi'
import { getFullPrediction } from '../api/predictionApi'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    days_tracked: 0,
    cycles_logged: 0,
    insights_gained: 0
  })
  const [onboarding, setOnboarding] = useState(null)

  const loadUserDataAndStats = async () => {
    const storedUser = getStoredUser()
    setUser(storedUser)

    // Gather Local Storage logs (for offline/demo support)
    let localCyclesArray = []
    let localDaysArray = []

    try {
      const storedCycles = localStorage.getItem('hersakhi_cycles') || localStorage.getItem('hersakhi_cycle_logs')
      if (storedCycles) {
        const parsed = JSON.parse(storedCycles)
        localCyclesArray = Array.isArray(parsed) ? parsed : []
      }
    } catch (e) {}

    try {
      const storedDays = localStorage.getItem('hersakhi_symptom_logs') || localStorage.getItem('hersakhi_symptoms')
      if (storedDays) {
        const parsed = JSON.parse(storedDays)
        localDaysArray = Array.isArray(parsed) ? parsed : []
      }
    } catch (e) {}

    // 1. Initial State Definitions
    let cycleLogsList = [...localCyclesArray]
    let wellnessLogsList = [...localDaysArray]
    let onboardingInfo = null
    let predictionInfo = null

    // 2. Fetch Backend Data in Parallel if logged in
    if (storedUser?.id) {
      try {
        const [cycleRes, wellnessRes, onboardingRes, predictionRes] = await Promise.allSettled([
          getCycleLogs(storedUser.id),
          getWellnessLogs(storedUser.id),
          getOnboardingData(storedUser.id),
          getFullPrediction(storedUser.id)
        ])

        if (cycleRes.status === 'fulfilled' && cycleRes.value?.logs) {
          cycleLogsList = [...cycleLogsList, ...cycleRes.value.logs]
        }
        if (wellnessRes.status === 'fulfilled' && wellnessRes.value?.logs) {
          wellnessLogsList = [...wellnessLogsList, ...wellnessRes.value.logs]
        }
        if (onboardingRes.status === 'fulfilled') {
          onboardingInfo = onboardingRes.value
          setOnboarding(onboardingRes.value)
        }
        if (predictionRes.status === 'fulfilled') {
          predictionInfo = predictionRes.value
        }
      } catch (err) {
        console.error("Error loading backend profile stats:", err)
      }
    }

    // 3. Dynamic Calculation: Days Tracked (unique dates from both cycle logs & wellness logs)
    const uniqueDatesSet = new Set()
    
    // Process Cycle Logs
    cycleLogsList.forEach(log => {
      if (log.log_date) {
        const datePart = log.log_date.split('T')[0]
        uniqueDatesSet.add(datePart)
      }
    })

    // Process Wellness Logs
    wellnessLogsList.forEach(log => {
      if (log.log_date) {
        const datePart = log.log_date.split('T')[0]
        uniqueDatesSet.add(datePart)
      }
    })

    const daysTrackedCount = uniqueDatesSet.size

    // 4. Dynamic Calculation: Cycles Logged (group consecutive dates with gap <= 7 days)
    const periodDates = Array.from(uniqueDatesSet).sort()
    
    let cyclesLoggedCount = 0
    if (periodDates.length > 0) {
      cyclesLoggedCount = 1 // At least 1 cycle since there are period logs
      for (let i = 1; i < periodDates.length; i++) {
        const prevDate = new Date(periodDates[i - 1])
        const currDate = new Date(periodDates[i])
        const diffTime = Math.abs(currDate - prevDate)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays > 7) {
          cyclesLoggedCount++
        }
      }
    } else if (onboardingInfo || storedUser) {
      // Default to 1 for onboarding/new users
      cyclesLoggedCount = 1
    }

    // 5. Dynamic Calculation: Insights Gained (count AI recommendations + risk flags + insights)
    let insightsCount = 0
    if (predictionInfo) {
      if (predictionInfo.wellness_insight && !predictionInfo.wellness_insight.includes("Track more")) {
        insightsCount++
      }
      if (predictionInfo.symptom_summary && !predictionInfo.symptom_summary.includes("Start logging")) {
        insightsCount++
      }
      if (Array.isArray(predictionInfo.recommendations)) {
        insightsCount += predictionInfo.recommendations.length
      }
      if (Array.isArray(predictionInfo.risk_flags)) {
        insightsCount += predictionInfo.risk_flags.length
      }
    }

    // Prepare final stats object
    const finalStats = {
      days_tracked: daysTrackedCount > 0 ? daysTrackedCount : "Start tracking",
      cycles_logged: cyclesLoggedCount,
      insights_gained: insightsCount > 0 ? insightsCount : "Start tracking"
    }

    setStats(finalStats)
  }

  useEffect(() => {
    loadUserDataAndStats()

    // Add Storage Event Listener to sync dynamically when preferences update
    const handleStorageChange = () => {
      loadUserDataAndStats()
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleUpdate = (updatedUser) => {
    saveUser(updatedUser)
    setUser(updatedUser)
    loadUserDataAndStats()
  }

  return (
    <div className="min-h-screen bg-[#fdf7fb] flex font-inter">
      <Sidebar />
      
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0">
        <Topbar title="Profile" />
        
        <main className="flex-1 p-6 lg:p-10 max-w-[1400px] mx-auto w-full">
          
          <ProfileHeader user={user} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (Span 2) */}
            <div className="lg:col-span-2">
              <PersonalInformation user={user} onUpdate={handleUpdate} />
              <HealthPreferences onboardingData={onboarding} />
              <NotificationSettings />
              <DangerZone user={user} />
            </div>

            {/* Right Column (Span 1) */}
            <div>
              <AccountSettings />
              <UserStats stats={stats} />
            </div>

          </div>

        </main>
      </div>
    </div>
  )
}

export default Profile
