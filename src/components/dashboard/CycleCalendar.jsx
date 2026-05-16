import { ChevronRight, ChevronLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const CycleCalendar = ({ prediction }) => {
  const navigate = useNavigate();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // Helper to get formatted YYYY-MM-DD from any given parts
  const formatDateString = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  // Helper to generate a Set of date strings from a date range
  const getDateSetInRange = (startStr, endStr) => {
    const dates = new Set()
    if (!startStr || !endStr) return dates;
    const start = new Date(startStr);
    const end = new Date(endStr);
    let current = new Date(start);
    while (current <= end) {
      dates.add(formatDateString(current.getFullYear(), current.getMonth(), current.getDate()));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }

  // Generate sets for quick lookup
  const periodDateStrings = prediction ? getDateSetInRange(prediction.period_start, prediction.period_end) : new Set()
  const fertileDateStrings = prediction ? getDateSetInRange(prediction.fertile_window_start, prediction.fertile_window_end) : new Set()
  const ovulationStr = prediction?.ovulation_date ? prediction.ovulation_date : null
  
  // Calendar Math
  const monthStart = new Date(currentYear, currentMonth, 1)
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  
  const startDayOfWeek = monthStart.getDay()
  const emptySlotsCount = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1
  
  const emptySlots = Array(emptySlotsCount).fill(null)
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const allSlots = [...emptySlots, ...calendarDays]

  const monthName = monthStart.toLocaleString('default', { month: 'long' })
  const todayStr = formatDateString(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5 h-full flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h3 className="font-poppins font-semibold text-xl text-dark">Cycle Calendar</h3>
          <div className="flex items-center gap-1">
            <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium text-dark min-w-[80px] text-center">{monthName}</span>
            <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <button 
          onClick={() => navigate('/tracker')}
          className="text-primary text-sm font-medium flex items-center gap-1 hover:text-primary/80 transition-colors"
        >
          Full Calendar <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-6 gap-x-2 text-center mb-8 flex-1">
        {days.map(day => (
          <div key={day} className="text-xs font-medium text-gray-400 mb-2">{day}</div>
        ))}
        
        {allSlots.map((day, index) => {
          if (!day) return <div key={`empty-${index}`}></div>

          const cellDateStr = formatDateString(currentYear, currentMonth, day)
          
          const isToday = cellDateStr === todayStr
          const isPeriod = periodDateStrings.has(cellDateStr)
          const isOvulation = ovulationStr === cellDateStr
          const isFertile = fertileDateStrings.has(cellDateStr) && !isOvulation
          
          let dayClass = "w-10 h-10 mx-auto flex items-center justify-center rounded-xl text-sm transition-all duration-300 font-medium "
          
          if (isToday) {
            dayClass += "bg-primary text-white shadow-md shadow-primary/30 transform hover:scale-110 cursor-pointer"
          } else if (isPeriod) {
            dayClass += "bg-red-100 text-red-500 cursor-pointer"
          } else if (isOvulation) {
            dayClass += "bg-pink-400 text-white cursor-pointer shadow-sm shadow-pink-400/30"
          } else if (isFertile) {
            dayClass += "bg-pink-50 text-pink-500 cursor-pointer"
          } else {
            dayClass += "text-gray-600 hover:bg-gray-50 cursor-pointer"
          }

          return (
            <div key={cellDateStr}>
              <div className={dayClass} onClick={() => navigate('/tracker')}>
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
          <span className="text-xs text-gray-500 font-medium">Fertile</span>
        </div>
      </div>
    </motion.div>
  )
}

export default CycleCalendar
