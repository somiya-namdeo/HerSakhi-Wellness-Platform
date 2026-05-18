import Sidebar from '../components/dashboard/Sidebar'
import Topbar from '../components/dashboard/Topbar'
import EmergencyHero from '../components/emergency/EmergencyHero'
import HotlineCards from '../components/emergency/HotlineCards'
import PersonalContacts from '../components/emergency/PersonalContacts'
import SafetyResources from '../components/emergency/SafetyResources'
import SafetyTips from '../components/emergency/SafetyTips'

const Emergency = () => {
  return (
    <div className="min-h-screen bg-[#fdf7fb] flex font-inter">
      <Sidebar />
      
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0">
        <Topbar title="Emergency" />
        
        <main className="flex-1 p-6 lg:p-10 max-w-[1400px] mx-auto w-full">
          
          <EmergencyHero />
          
          <HotlineCards />

          <div className="mb-10">
            <PersonalContacts />
          </div>

          <SafetyResources />
          
          <SafetyTips />

        </main>
      </div>
    </div>
  )
}

export default Emergency
