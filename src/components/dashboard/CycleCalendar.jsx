import { ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const CycleCalendar = () => {
  const navigate = useNavigate();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
  // Mock data matching the screenshot
  const today = 12
  const periodDays = [15, 16, 17, 18, 19]
  const ovulationDays = [28, 29, 30]

  // Generate 35 days (5 weeks)
  const calendarGrid = Array.from({ length: 35 }, (_, i) => i + 1)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5 h-full flex flex-col"
    >
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-poppins font-semibold text-xl text-dark">Cycle Calendar</h3>
        <button 
          onClick={() => navigate('/tracker')}
          className="text-primary text-sm font-medium flex items-center gap-1 hover:text-primary/80 transition-colors"
        >
          View Full Calendar <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-6 gap-x-2 text-center mb-8 flex-1">
        {days.map(day => (
          <div key={day} className="text-xs font-medium text-gray-400 mb-2">{day}</div>
        ))}
        
        {calendarGrid.map(day => {
          const isToday = day === today
          const isPeriod = periodDays.includes(day)
          const isOvulation = ovulationDays.includes(day)
          
          let dayClass = "w-10 h-10 mx-auto flex items-center justify-center rounded-xl text-sm transition-all duration-300 font-medium "
          
          if (isToday) {
            dayClass += "bg-primary text-white shadow-md shadow-primary/30 transform hover:scale-110 cursor-pointer"
          } else if (isPeriod) {
            dayClass += "bg-red-100 text-red-500 cursor-pointer"
          } else if (isOvulation) {
            dayClass += "bg-pink-50 text-pink-500 cursor-pointer"
          } else {
            dayClass += "text-gray-600 hover:bg-gray-50 cursor-pointer"
          }

          return (
            <div key={day}>
              <div className={dayClass}>
                {day}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-6 mt-auto pt-6 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-md bg-primary"></div>
          <span className="text-xs text-gray-500 font-medium">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-md bg-red-100"></div>
          <span className="text-xs text-gray-500 font-medium">Period</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-md bg-pink-50"></div>
          <span className="text-xs text-gray-500 font-medium">Ovulation</span>
        </div>
      </div>
    </motion.div>
  )
}

export default CycleCalendar
