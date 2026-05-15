import Sidebar from '../components/dashboard/Sidebar'
import Topbar from '../components/dashboard/Topbar'
import ProfileHeader from '../components/profile/ProfileHeader'
import PersonalInformation from '../components/profile/PersonalInformation'
import AccountSettings from '../components/profile/AccountSettings'
import UserStats from '../components/profile/UserStats'
import HealthPreferences from '../components/profile/HealthPreferences'
import NotificationSettings from '../components/profile/NotificationSettings'
import DangerZone from '../components/profile/DangerZone'

const Profile = () => {
  return (
    <div className="min-h-screen bg-[#fdf7fb] flex font-inter">
      <Sidebar />
      
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0">
        <Topbar title="Profile" />
        
        <main className="flex-1 p-6 lg:p-10 max-w-[1400px] mx-auto w-full">
          
          <ProfileHeader />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (Span 2) */}
            <div className="lg:col-span-2">
              <PersonalInformation />
              <HealthPreferences />
              <NotificationSettings />
              <DangerZone />
            </div>

            {/* Right Column (Span 1) */}
            <div>
              <AccountSettings />
              <UserStats />
            </div>

          </div>

        </main>
      </div>
    </div>
  )
}

export default Profile
