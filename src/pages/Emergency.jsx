import Sidebar from '../components/dashboard/Sidebar'
import Topbar from '../components/dashboard/Topbar'
import EmergencyHero from '../components/emergency/EmergencyHero'
import EmergencyAlert from '../components/emergency/EmergencyAlert'
import HotlineCards from '../components/emergency/HotlineCards'
import PersonalContacts from '../components/emergency/PersonalContacts'
import NearbyHealthcare from '../components/emergency/NearbyHealthcare'
import SafetyResources from '../components/emergency/SafetyResources'
import SafetyMatters from '../components/emergency/SafetyMatters'

const Emergency = () => {
  return (
    <div className="min-h-screen bg-[#fdf7fb] flex font-inter">
      <Sidebar />
      
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0">
        <Topbar title="Emergency" />
        
        <main className="flex-1 p-6 lg:p-10 max-w-[1400px] mx-auto w-full">
          
          <EmergencyHero />
          
          <EmergencyAlert />
          
          <HotlineCards />

          {/* Two Column Layout for Contacts & Healthcare */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <PersonalContacts />
            <NearbyHealthcare />
          </div>

          <SafetyResources />
          
          <SafetyMatters />

        </main>
      </div>
    </div>
  )
}

export default Emergency
