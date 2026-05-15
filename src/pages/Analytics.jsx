import Sidebar from '../components/dashboard/Sidebar'
import Topbar from '../components/dashboard/Topbar'
import AnalyticsOverviewCards from '../components/analytics/AnalyticsOverviewCards'
import MoodEnergyChart from '../components/analytics/MoodEnergyChart'
import SymptomDistribution from '../components/analytics/SymptomDistribution'
import CycleLengthHistory from '../components/analytics/CycleLengthHistory'
import WellnessRadar from '../components/analytics/WellnessRadar'
import HealthInsights from '../components/analytics/HealthInsights'
import AIRecommendations from '../components/analytics/AIRecommendations'

const Analytics = () => {
  return (
    <div className="min-h-screen bg-[#fdf7fb] flex font-inter">
      <Sidebar />
      
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0">
        <Topbar title="Analytics" />
        
        <main className="flex-1 p-6 lg:p-10 max-w-[1400px] mx-auto w-full">
          
          {/* Top Overview Cards */}
          <AnalyticsOverviewCards />

          {/* Line Chart & Pie Chart Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            <div className="xl:col-span-2">
              <MoodEnergyChart />
            </div>
            <div className="xl:col-span-1">
              <SymptomDistribution />
            </div>
          </div>

          {/* Bar Chart & Radar Chart Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            <CycleLengthHistory />
            <WellnessRadar />
          </div>

          {/* Bottom Insights & Recommendations */}
          <HealthInsights />
          <AIRecommendations />

        </main>
      </div>
    </div>
  )
}

export default Analytics
