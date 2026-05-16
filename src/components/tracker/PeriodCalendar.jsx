import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const PeriodCalendar = ({ selectedDate, onDateSelect, logs = [], prediction = null }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
  // State for navigating the calendar view
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth())
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear())

  // Keep calendar view in sync if selectedDate changes externally
  useEffect(() => {
    setCurrentMonth(selectedDate.getMonth())
    setCurrentYear(selectedDate.getFullYear())
  }, [selectedDate])

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
  
  const loggedDateStrings = new Set(logs.map(log => log.log_date))

  // Calendar Math
  const monthStart = new Date(currentYear, currentMonth, 1)
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  
  // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const startDayOfWeek = monthStart.getDay()
  // Adjust so Monday is 0, Sunday is 6
  const emptySlotsCount = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1
  
  const emptySlots = Array(emptySlotsCount).fill(null)
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const allSlots = [...emptySlots, ...calendarDays]

  // Formatting header
  const monthName = monthStart.toLocaleString('default', { month: 'long' })
  
  const selectedDateStr = formatDateString(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())

  const periodColor = "bg-red-100 text-red-400 hover:opacity-80"
  const ovulationColor = "bg-pink-400 text-white shadow-md shadow-pink-400/30 hover:opacity-80"
  const fertileColor = "bg-pink-50 text-pink-400 hover:opacity-80"
  const selectedColor = "bg-primary text-white shadow-lg shadow-primary/30 transform scale-105 ring-2 ring-primary ring-offset-2 z-10"
  const loggedColor = "ring-2 ring-green-400 ring-offset-1"

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5 flex flex-col"
    >
      <div className="flex justify-between items-center mb-6 lg:mb-8">
        <h2 className="text-2xl font-poppins font-bold text-dark">Period Calendar</h2>
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ChevronLeft size={20} />
          </button>
          <span className="font-medium text-dark min-w-[120px] text-center">{monthName} {currentYear}</span>
          <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-2 gap-x-1 sm:gap-2 text-center mb-8">
        {days.map(day => (
          <div key={day} className="text-sm font-medium text-gray-400 mb-2">{day}</div>
        ))}
        
        {allSlots.map((day, index) => {
          if (!day) return <div key={`empty-${index}`}></div>

          const cellDateStr = formatDateString(currentYear, currentMonth, day)
          
          const isSelected = cellDateStr === selectedDateStr
          const isPeriod = periodDateStrings.has(cellDateStr)
          const isOvulation = ovulationStr === cellDateStr
          const isFertile = fertileDateStrings.has(cellDateStr) && !isOvulation
          const isLogged = loggedDateStrings.has(cellDateStr)
          
          let dayClass = "w-11 h-11 sm:w-14 sm:h-14 lg:w-[72px] lg:h-[72px] mx-auto flex items-center justify-center rounded-2xl text-sm sm:text-base lg:text-lg transition-all duration-300 font-medium cursor-pointer "
          
          if (isSelected) {
            dayClass += selectedColor
          } else if (isPeriod) {
            dayClass += periodColor
          } else if (isOvulation) {
            dayClass += ovulationColor
          } else if (isFertile) {
            dayClass += fertileColor
          } else {
            dayClass += "text-dark hover:bg-gray-50"
          }

          if (isLogged && !isSelected) {
            dayClass += " " + loggedColor
          }

          return (
            <div key={cellDateStr} className="flex items-center justify-center">
              <div 
                className={dayClass}
                onClick={() => onDateSelect(new Date(currentYear, currentMonth, day))}
              >
                {day}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-auto pt-6 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-red-100"></div>
          <span className="text-xs text-gray-500 font-medium">Period Days</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-pink-400"></div>
          <span className="text-xs text-gray-500 font-medium">Ovulation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-pink-50"></div>
          <span className="text-xs text-gray-500 font-medium">Fertile Window</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-green-400"></div>
          <span className="text-xs text-gray-500 font-medium">Logged Entry</span>
        </div>
      </div>
    </motion.div>
  )
}

export default PeriodCalendar
