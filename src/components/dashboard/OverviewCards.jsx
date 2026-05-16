import { Calendar as CalendarIcon, Heart, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

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
  // Format dates nicely, e.g. "May 19, 2026"
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Calculate days remaining until next period
  const getDaysRemaining = () => {
    if (!prediction?.next_period_date) return 0;
    const today = new Date();
    // Normalize to midnight
    today.setHours(0, 0, 0, 0);
    const nextPeriod = new Date(prediction.next_period_date);
    nextPeriod.setHours(0, 0, 0, 0);
    
    const diffTime = nextPeriod - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  const daysRemaining = getDaysRemaining();
  
  // Format fertile window, e.g. "May 25-30"
  const formatWindow = (startStr, endStr) => {
    if (!startStr || !endStr) return '';
    const start = new Date(startStr);
    const end = new Date(endStr);
    const month = start.toLocaleDateString('en-US', { month: 'short' });
    return `${month} ${start.getDate()}-${end.getDate()}`;
  }

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
          {daysRemaining > 0 ? `in ${daysRemaining} days` : daysRemaining === 0 ? 'Today' : 'Overdue'}
        </div>
        <p className="text-white/80 text-sm">Expected on {formatDate(prediction?.next_period_date)}</p>
        
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
      </motion.div>

      {/* Card 2: Fertility Window */}
      <motion.div variants={cardVariants} className="bg-gradient-to-br from-[#F9A8D4] to-[#FBCFE8] rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-softPink/20 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
        <div className="flex justify-between items-start mb-6">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <Heart size={24} className="text-white" />
          </div>
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">Low</span>
        </div>
        <h3 className="font-poppins font-semibold text-xl mb-1">Fertility Window</h3>
        <div className="text-xl font-bold font-poppins mb-2 mt-4">Not in fertile phase</div>
        <p className="text-white/80 text-sm mt-2">
          Next window: {formatWindow(prediction?.fertile_window_start, prediction?.fertile_window_end)}
        </p>
        
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
      </motion.div>

      {/* Card 3: Current Phase / Confidence */}
      <motion.div variants={cardVariants} className="bg-gradient-to-br from-[#FDBA74] to-[#FED7AA] rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-peach/20 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
        <div className="flex justify-between items-start mb-6">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <TrendingUp size={24} className="text-white" />
          </div>
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
            {prediction?.predicted_cycle_length} Days
          </span>
        </div>
        <h3 className="font-poppins font-semibold text-xl mb-1">Cycle Length</h3>
        <div className="text-xl font-bold font-poppins mb-2 mt-4">Avg {prediction?.predicted_cycle_length} Days</div>
        <p className="text-white/80 text-sm mt-2">Prediction Confidence: {prediction?.confidence_score}%</p>
        
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
      </motion.div>
    </motion.div>
  )
}

export default OverviewCards
