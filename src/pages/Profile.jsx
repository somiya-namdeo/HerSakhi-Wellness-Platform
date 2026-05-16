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
import { getUserStats, getOnboardingData } from '../api/userApi'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    days_tracked: 0,
    cycles_logged: 0,
    insights_gained: 0
  })
  const [onboarding, setOnboarding] = useState(null)

  useEffect(() => {
    const storedUser = getStoredUser()
    setUser(storedUser)
    
    if (storedUser?.id) {
      fetchExtraData(storedUser.id)
    }
  }, [])

  const fetchExtraData = async (userId) => {
    try {
      const [statsData, onboardingData] = await Promise.allSettled([
        getUserStats(userId),
        getOnboardingData(userId)
      ])
      
      if (statsData.status === 'fulfilled') {
        setStats(statsData.value)
      }
      if (onboardingData.status === 'fulfilled') {
        setOnboarding(onboardingData.value)
      }
    } catch (err) {
      console.error("Failed to fetch extra profile data:", err)
    }
  }

  const handleUpdate = (updatedUser) => {
    saveUser(updatedUser)
    setUser(updatedUser)
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
