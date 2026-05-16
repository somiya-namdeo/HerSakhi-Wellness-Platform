import Sidebar from '../components/dashboard/Sidebar'
import Topbar from '../components/dashboard/Topbar'
import OverviewCards from '../components/dashboard/OverviewCards'
import CycleCalendar from '../components/dashboard/CycleCalendar'
import MoodCard from '../components/dashboard/MoodCard'
import DailyTrackers from '../components/dashboard/DailyTrackers'
import WeeklyTrends from '../components/dashboard/WeeklyTrends'
import AIInsights from '../components/dashboard/AIInsights'
import { Sparkles, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { getStoredUser } from '../utils/userHelpers'
import { useState, useEffect } from 'react'
import { getFullPrediction } from '../api/predictionApi'

const Dashboard = () => {
  const user = getStoredUser();
  const firstName = user?.full_name ? user.full_name.split(' ')[0] : 'User';

  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        if (user?.id) {
          const data = await getFullPrediction(user.id)
          setPrediction(data)
        }
      } catch (err) {
        console.error("Failed to fetch predictions:", err)
        setError("Complete onboarding to generate predictions.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchPrediction()
  }, [user?.id])

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
                Welcome back, <span className="text-primary">{firstName}!</span>
              </h2>
              <p className="text-gray-500">Here's your wellness overview for today</p>
            </div>
            
            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full shadow-sm border border-primary/10 w-fit">
              <Sparkles size={16} className="text-primary" />
              <span className="text-sm font-medium text-gray-600">Wellness Score:</span>
              <span className="text-sm font-bold text-primary">8.5/10</span>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-primary">
              <Loader2 className="animate-spin w-8 h-8" />
              <span className="ml-3 font-medium">Loading your insights...</span>
            </div>
          ) : error ? (
            <div className="mb-8 p-6 bg-red-50 text-red-600 rounded-[2rem] border border-red-100 text-center font-medium">
              {error}
            </div>
          ) : (
            <>
              {/* Overview Cards Row */}
              <div className="mb-8">
                <OverviewCards prediction={prediction} />
              </div>

              {/* Middle Row */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                <div className="xl:col-span-2">
                  <CycleCalendar prediction={prediction} />
                </div>
                <div className="flex flex-col gap-6">
                  <MoodCard />
                  <DailyTrackers />
                </div>
              </div>
            </>
          )}

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
