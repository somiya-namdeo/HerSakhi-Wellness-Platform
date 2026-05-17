import { Calendar as CalendarIcon, Heart, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { calculateDaysUntil, formatDaysUntil, formatFullDate, formatDateRange } from '../../utils/dateHelpers'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
}

const OverviewCards = ({ prediction }) => {
  const daysRemaining = calculateDaysUntil(prediction?.next_period_date);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* Card 1: Next Period */}
      <motion.div variants={cardVariants} className="bg-gradient-to-br from-[#A78BFA] to-[#C4B5FD] rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-primary/20 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
        <div className="flex justify-between items-start mb-6">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <CalendarIcon size={24} className="text-white" />
          </div>
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">Upcoming</span>
        </div>
        <h3 className="font-poppins font-semibold text-xl mb-1">Next Period</h3>
        <div className="text-3xl font-bold font-poppins mb-2">
          {formatDaysUntil(daysRemaining)}
        </div>
        <p className="text-white/80 text-sm">
          {prediction?.next_period_date
            ? `Expected on ${formatFullDate(prediction.next_period_date)}`
            : 'Track more cycles to improve prediction.'}
        </p>
        
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
      </motion.div>

      {/* Card 2: Fertility Window */}
      <motion.div variants={cardVariants} className="bg-gradient-to-br from-[#F9A8D4] to-[#FBCFE8] rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-softPink/20 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
        <div className="flex justify-between items-start mb-6">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <Heart size={24} className="text-white" />
          </div>
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">Prediction</span>
        </div>
        <h3 className="font-poppins font-semibold text-xl mb-1">Fertility Window</h3>
        <div className="text-lg font-bold font-poppins mb-2 mt-4 leading-snug">
          {formatDateRange(prediction?.fertile_window_start, prediction?.fertile_window_end)}
        </div>
        <p className="text-white/80 text-sm mt-2">
          {prediction?.fertile_window_start ? 'Estimated window' : 'Track more cycles to improve prediction.'}
        </p>
        
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
      </motion.div>

      {/* Card 3: Cycle Length */}
      <motion.div variants={cardVariants} className="bg-gradient-to-br from-[#FDBA74] to-[#FED7AA] rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-peach/20 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
        <div className="flex justify-between items-start mb-6">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <TrendingUp size={24} className="text-white" />
          </div>
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
            {prediction?.predicted_cycle_length ? `${prediction.predicted_cycle_length} Days` : '—'}
          </span>
        </div>
        <h3 className="font-poppins font-semibold text-xl mb-1">Cycle Length</h3>
        <div className="text-xl font-bold font-poppins mb-2 mt-4">
          {prediction?.predicted_cycle_length ? `Avg ${prediction.predicted_cycle_length} Days` : '—'}
        </div>
        <p className="text-white/80 text-sm mt-2">
          {prediction?.confidence_score ? `Prediction Confidence: ${prediction.confidence_score}%` : 'Track more cycles to improve prediction.'}
        </p>
        
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
      </motion.div>
    </motion.div>
  )
}

export default OverviewCards

