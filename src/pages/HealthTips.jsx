import Sidebar from '../components/dashboard/Sidebar'
import Topbar from '../components/dashboard/Topbar'
import HealthCategories from '../components/health/HealthCategories'
import FeaturedArticles from '../components/health/FeaturedArticles'
import QuickTipsSection from '../components/health/QuickTipsSection'
import MythBusters from '../components/health/MythBusters'
import LearnMoreCTA from '../components/health/LearnMoreCTA'

const HealthTips = () => {
  return (
    <div className="min-h-screen bg-[#fdf7fb] flex font-inter">
      <Sidebar />
      
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0">
        <Topbar title="Health Tips" />
        
        <main className="flex-1 p-6 lg:p-10 max-w-[1400px] mx-auto w-full">
          
          {/* Section 1: Categories */}
          <HealthCategories />

          {/* Section 2: Featured Articles */}
          <FeaturedArticles />

          {/* Section 3: Quick Tips & Myth Busters Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <QuickTipsSection />
            <MythBusters />
          </div>

          {/* Section 4: Learn More Call to Action */}
          <LearnMoreCTA />

        </main>
      </div>
    </div>
  )
}

export default HealthTips
