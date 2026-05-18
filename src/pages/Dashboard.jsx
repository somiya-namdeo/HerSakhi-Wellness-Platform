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
import { getCycleLogs } from '../api/cycleApi'
import { getWellnessLogs } from '../api/wellnessApi'

const Dashboard = () => {
  const user = getStoredUser();
  const firstName = user?.full_name ? user.full_name.split(' ')[0] : 'User';

  const [prediction, setPrediction] = useState(null)
  const [cycleLogs, setCycleLogs] = useState([])
  const [wellnessLogs, setWellnessLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id) {
          const [predData, cycleData, wellnessData] = await Promise.all([
            getFullPrediction(user.id),
            getCycleLogs(user.id),
            getWellnessLogs(user.id).catch(() => ({ logs: [] })) // Handle potential 404s gracefully
          ]);
          setPrediction(predData);
          setCycleLogs(cycleData?.logs || []);
          setWellnessLogs(wellnessData?.logs || []);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err)
        setError("Complete onboarding to generate predictions.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [user?.id])

  const getWellnessScoreString = (cycles, wellness) => {
    if ((!cycles || cycles.length === 0) && (!wellness || wellness.length === 0)) return "Start tracking";
    
    const totalLogs = (cycles ? cycles.length : 0) + (wellness ? wellness.length : 0);
    if (totalLogs < 3) return "Not enough data";
    
    // Calculate score
    let score = 7.0; // Start with a positive baseline
    
    // 1. Consistency (up to +1.5)
    score += Math.min(1.5, totalLogs * 0.1);
    
    // 2. Pain level impact (deduct up to 1.5)
    const logsWithPain = cycles ? cycles.filter(c => typeof c.pain_level === 'number') : [];
    if (logsWithPain.length > 0) {
      const avgPain = logsWithPain.reduce((sum, c) => sum + c.pain_level, 0) / logsWithPain.length;
      // Assume pain_level is on a 1-5 or 1-10 scale. If 1-5, avgPain is max 5.
      const maxPainScale = Math.max(...logsWithPain.map(c => c.pain_level), 5);
      score -= (avgPain / maxPainScale) * 1.5;
    }
    
    // 3. Hydration impact (+1.0 to -1.0)
    const logsWithHydration = wellness ? wellness.filter(w => typeof w.hydration === 'number') : [];
    if (logsWithHydration.length > 0) {
      const avgHydration = logsWithHydration.reduce((sum, w) => sum + w.hydration, 0) / logsWithHydration.length;
      if (avgHydration >= 8) {
        score += 1.0;
      } else if (avgHydration >= 5) {
        score += 0.5;
      } else {
        score -= (1.0 - (avgHydration / 8));
      }
    }
    
    // 4. Sleep impact (+1.0 to -1.0)
    const logsWithSleep = wellness ? wellness.filter(w => typeof w.sleep_hours === 'number') : [];
    if (logsWithSleep.length > 0) {
      const avgSleep = logsWithSleep.reduce((sum, w) => sum + w.sleep_hours, 0) / logsWithSleep.length;
      if (avgSleep >= 7 && avgSleep <= 9) {
        score += 1.0;
      } else if (avgSleep >= 6 && avgSleep < 7) {
        score += 0.3;
      } else {
        score -= 0.7;
      }
    }
    
    // 5. Energy and Stress (+1.0 to -1.5)
    const logsWithEnergy = wellness ? wellness.filter(w => typeof w.energy_level === 'number') : [];
    const logsWithStress = wellness ? wellness.filter(w => typeof w.stress_level === 'number') : [];
    
    if (logsWithEnergy.length > 0) {
      const avgEnergy = logsWithEnergy.reduce((sum, w) => sum + w.energy_level, 0) / logsWithEnergy.length;
      score += (avgEnergy / 5) * 1.0 - 0.5;
    }
    if (logsWithStress.length > 0) {
      const avgStress = logsWithStress.reduce((sum, w) => sum + w.stress_level, 0) / logsWithStress.length;
      score -= (avgStress / 5) * 1.0;
    }
    
    // 6. Reminders bonus (+0.5)
    try {
      const reminders = JSON.parse(localStorage.getItem('hersakhi_reminders') || '{}');
      const enabledCount = Object.values(reminders).filter(Boolean).length;
      score += (enabledCount / 5) * 0.5;
    } catch (e) {}
    
    // Clamp between 1.0 and 10.0
    const finalScore = Math.max(1.0, Math.min(10.0, score));
    return `${finalScore.toFixed(1)}/10`;
  };

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
              <span className="text-sm font-bold text-primary">
                {getWellnessScoreString(cycleLogs, wellnessLogs)}
              </span>
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
            <WeeklyTrends cycleLogs={cycleLogs} wellnessLogs={wellnessLogs} />
            <AIInsights prediction={prediction} />
          </div>
          
        </main>
      </div>
    </div>
  )
}

export default Dashboard
