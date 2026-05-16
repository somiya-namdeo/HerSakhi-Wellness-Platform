import Sidebar from '../components/dashboard/Sidebar'
import Topbar from '../components/dashboard/Topbar'
import PeriodCalendar from '../components/tracker/PeriodCalendar'
import DailyLogPanel from '../components/tracker/DailyLogPanel'
import CycleStats from '../components/tracker/CycleStats'
import QuickTips from '../components/tracker/QuickTips'
import PredictionSummary from '../components/tracker/PredictionSummary'
import { useState, useEffect } from 'react'
import { getCycleLogs } from '../api/cycleApi'
import { getFullPrediction } from '../api/predictionApi'
import { getStoredUser } from '../utils/userHelpers'

const PeriodTracker = () => {
  // Use today's Date as the default selected date
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [logs, setLogs] = useState([])
  const [prediction, setPrediction] = useState(null)
  
  const [loadingLogs, setLoadingLogs] = useState(true)
  const [loadingPrediction, setLoadingPrediction] = useState(true)
  
  const [errorLogs, setErrorLogs] = useState('')
  const [errorPrediction, setErrorPrediction] = useState('')

  const fetchLogs = async () => {
    try {
      const user = getStoredUser()
      if (user?.id) {
        const data = await getCycleLogs(user.id)
        setLogs(data.logs || [])
      }
    } catch (err) {
      console.error("Failed to fetch logs:", err)
      setErrorLogs("Failed to load your cycle history.")
    } finally {
      setLoadingLogs(false)
    }
  }

  const fetchPrediction = async () => {
    try {
      const user = getStoredUser()
      if (user?.id) {
        const data = await getFullPrediction(user.id)
        setPrediction(data)
      }
    } catch (err) {
      console.error("Failed to fetch prediction:", err)
      setErrorPrediction("Complete onboarding to generate predictions.")
    } finally {
      setLoadingPrediction(false)
    }
  }

  useEffect(() => {
    fetchLogs()
    fetchPrediction()
  }, [])

  return (
    <div className="min-h-screen bg-background flex font-inter">
      <Sidebar />
      
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0">
        <Topbar title="Period Tracker" />
        
        <main className="p-6 lg:p-10 max-w-[1400px] mx-auto w-full pb-12">
          {errorLogs && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium">
              {errorLogs}
            </div>
          )}
          
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            
            {/* Left Column: Calendar & Stats */}
            <div className="flex-1 min-w-0 flex flex-col gap-6 lg:gap-8">
              <PeriodCalendar 
                selectedDate={selectedDate} 
                onDateSelect={setSelectedDate} 
                logs={logs}
                prediction={prediction}
              />
              <CycleStats />
              <PredictionSummary 
                prediction={prediction} 
                loading={loadingPrediction} 
                error={errorPrediction} 
              />
            </div>

            {/* Right Column: Daily Log & Tips */}
            <div className="w-full lg:w-[370px] xl:w-[410px] flex flex-col flex-shrink-0 gap-6 lg:gap-8">
              <DailyLogPanel 
                selectedDate={selectedDate} 
                onLogSaved={fetchLogs}
              />
              <QuickTips />
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

export default PeriodTracker
