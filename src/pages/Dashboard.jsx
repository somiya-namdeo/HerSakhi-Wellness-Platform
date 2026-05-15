import Sidebar from '../components/dashboard/Sidebar'
import Topbar from '../components/dashboard/Topbar'
import OverviewCards from '../components/dashboard/OverviewCards'
import CycleCalendar from '../components/dashboard/CycleCalendar'
import MoodCard from '../components/dashboard/MoodCard'
import DailyTrackers from '../components/dashboard/DailyTrackers'
import WeeklyTrends from '../components/dashboard/WeeklyTrends'
import AIInsights from '../components/dashboard/AIInsights'
import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background flex font-inter">
      <Sidebar />
      
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0">
        <Topbar />
        
        <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {/* Welcome Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4"
          >
            <div>
              <h2 className="text-3xl font-poppins font-bold text-dark mb-1">
                Welcome back, <span className="text-primary">Sarah!</span>
              </h2>
              <p className="text-gray-500">Here's your wellness overview for today</p>
            </div>
            
            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full shadow-sm border border-primary/10 w-fit">
              <Sparkles size={16} className="text-primary" />
              <span className="text-sm font-medium text-gray-600">Wellness Score:</span>
              <span className="text-sm font-bold text-primary">8.5/10</span>
            </div>
          </motion.div>

          {/* Overview Cards Row */}
          <div className="mb-8">
            <OverviewCards />
          </div>

          {/* Middle Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            <div className="xl:col-span-2">
              <CycleCalendar />
            </div>
            <div className="flex flex-col gap-6">
              <MoodCard />
              <DailyTrackers />
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
            <WeeklyTrends />
            <AIInsights />
          </div>
          
        </main>
      </div>
    </div>
  )
}

export default Dashboard
