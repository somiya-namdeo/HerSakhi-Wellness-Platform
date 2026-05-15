import Sidebar from '../components/dashboard/Sidebar'
import Topbar from '../components/dashboard/Topbar'
import PeriodCalendar from '../components/tracker/PeriodCalendar'
import DailyLogPanel from '../components/tracker/DailyLogPanel'
import CycleStats from '../components/tracker/CycleStats'
import QuickTips from '../components/tracker/QuickTips'
import PredictionSummary from '../components/tracker/PredictionSummary'
import { useState } from 'react'

const PeriodTracker = () => {
  const [selectedDate, setSelectedDate] = useState(14)

  return (
    <div className="min-h-screen bg-background flex font-inter">
      <Sidebar />
      
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0">
        <Topbar title="Period Tracker" />
        
        <main className="p-6 lg:p-10 max-w-[1400px] mx-auto w-full pb-12">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            
            {/* Left Column: Calendar & Stats */}
            <div className="flex-1 min-w-0 flex flex-col gap-6 lg:gap-8">
              <PeriodCalendar 
                selectedDate={selectedDate} 
                onDateSelect={setSelectedDate} 
              />
              <CycleStats />
              <PredictionSummary />
            </div>

            {/* Right Column: Daily Log & Tips */}
            <div className="w-full lg:w-[370px] xl:w-[410px] flex flex-col flex-shrink-0 gap-6 lg:gap-8">
              <DailyLogPanel selectedDate={selectedDate} />
              <QuickTips />
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

export default PeriodTracker

