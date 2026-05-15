import { Calendar, Heart, Smile, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

const AnalyticsOverviewCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      
      {/* Card 1 */}
      <motion.div 
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-[30px] p-6 shadow-card border border-primary/5 relative overflow-hidden"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Calendar size={24} />
          </div>
          <span className="text-3xl font-poppins font-bold text-primary">28</span>
        </div>
        <h3 className="text-sm font-semibold text-dark">Avg Cycle Length</h3>
        <p className="text-xs text-gray-400 mt-1">±2 days variation</p>
      </motion.div>

      {/* Card 2 */}
      <motion.div 
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-[30px] p-6 shadow-card border border-primary/5 relative overflow-hidden"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-400/10 flex items-center justify-center text-pink-400">
            <Heart size={24} />
          </div>
          <span className="text-3xl font-poppins font-bold text-pink-400">95%</span>
        </div>
        <h3 className="text-sm font-semibold text-dark">Cycle Regularity</h3>
        <p className="text-xs text-gray-400 mt-1">Very consistent</p>
      </motion.div>

      {/* Card 3 */}
      <motion.div 
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-[30px] p-6 shadow-card border border-primary/5 relative overflow-hidden"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-2xl bg-peach/20 flex items-center justify-center text-orange-400">
            <Smile size={24} />
          </div>
          <span className="text-3xl font-poppins font-bold text-orange-400">7.5</span>
        </div>
        <h3 className="text-sm font-semibold text-dark">Avg Mood Score</h3>
        <p className="text-xs text-gray-400 mt-1">Out of 10</p>
      </motion.div>

      {/* Card 4 */}
      <motion.div 
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-[30px] p-6 shadow-card border border-primary/5 relative overflow-hidden"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <TrendingUp size={24} />
          </div>
          <span className="text-3xl font-poppins font-bold text-primary">8.5</span>
        </div>
        <h3 className="text-sm font-semibold text-dark">Wellness Score</h3>
        <p className="text-xs text-gray-400 mt-1">Excellent!</p>
      </motion.div>

    </div>
  )
}

export default AnalyticsOverviewCards
