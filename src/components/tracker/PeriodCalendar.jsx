import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

const PeriodCalendar = ({ selectedDate, onDateSelect }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
  // Mock data for May 2026
  const periodDays = [15, 16, 17, 18, 19]
  const ovulationDays = [28, 29, 30]
  const fertileDays = [26, 27, 31]
  
  const periodColor = "bg-red-100 text-red-400"
  const ovulationColor = "bg-pink-400 text-white shadow-md shadow-pink-400/30"
  const fertileColor = "bg-pink-50 text-pink-400"
  const selectedColor = "bg-primary text-white shadow-lg shadow-primary/30 transform scale-105 ring-2 ring-primary ring-offset-2 z-10"

  // May 2026 starts on Friday.
  const emptyDays = [null, null, null, null]
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1)
  const allSlots = [...emptyDays, ...calendarDays]

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
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ChevronLeft size={20} />
          </button>
          <span className="font-medium text-dark min-w-[80px] text-center">May 2026</span>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
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

          const isSelected = day === selectedDate
          const isPeriod = periodDays.includes(day)
          const isOvulation = ovulationDays.includes(day)
          const isFertile = fertileDays.includes(day)
          
          let dayClass = "w-11 h-11 sm:w-14 sm:h-14 lg:w-[72px] lg:h-[72px] mx-auto flex items-center justify-center rounded-2xl text-sm sm:text-base lg:text-lg transition-all duration-300 font-medium cursor-pointer "
          
          if (isSelected) {
            dayClass += selectedColor
          } else if (isPeriod) {
            dayClass += periodColor + " hover:opacity-80"
          } else if (isOvulation) {
            dayClass += ovulationColor + " hover:opacity-80"
          } else if (isFertile) {
            dayClass += fertileColor + " hover:opacity-80"
          } else {
            dayClass += "text-dark hover:bg-gray-50"
          }

          return (
            <div key={day} className="flex items-center justify-center">
              <div 
                className={dayClass}
                onClick={() => onDateSelect(day)}
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
          <div className="w-4 h-4 rounded-md bg-primary"></div>
          <span className="text-xs text-gray-500 font-medium">Selected</span>
        </div>
      </div>
    </motion.div>
  )
}

export default PeriodCalendar
