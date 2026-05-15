import { Droplet, Moon, Sun, Activity } from 'lucide-react'
import { motion } from 'framer-motion'

const HealthInsights = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white rounded-[30px] p-6 lg:p-8 shadow-card border border-primary/5 mb-8"
    >
      <h3 className="font-poppins font-semibold text-xl text-dark mb-6">Health Insights</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Hydration */}
        <div className="p-5 rounded-2xl border border-primary/10 bg-primary/5 hover:bg-primary/10 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <Droplet size={18} className="text-primary" />
            <span className="text-sm font-medium text-gray-700">Hydration</span>
          </div>
          <div className="text-2xl font-poppins font-semibold text-primary mb-1">6.5/8</div>
          <div className="text-xs text-gray-500">cups per day</div>
        </div>

        {/* Sleep */}
        <div className="p-5 rounded-2xl border border-pink-400/10 bg-pink-400/5 hover:bg-pink-400/10 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <Moon size={18} className="text-pink-400" />
            <span className="text-sm font-medium text-gray-700">Sleep</span>
          </div>
          <div className="text-2xl font-poppins font-semibold text-pink-400 mb-1">7.5</div>
          <div className="text-xs text-gray-500">hours per night</div>
        </div>

        {/* Energy */}
        <div className="p-5 rounded-2xl border border-peach/20 bg-peach/10 hover:bg-peach/20 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <Sun size={18} className="text-orange-400" />
            <span className="text-sm font-medium text-gray-700">Energy</span>
          </div>
          <div className="text-2xl font-poppins font-semibold text-orange-400 mb-1">Good</div>
          <div className="text-xs text-gray-500">avg 7/10</div>
        </div>

        {/* Activity */}
        <div className="p-5 rounded-2xl border border-primary/10 bg-background hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <Activity size={18} className="text-primary" />
            <span className="text-sm font-medium text-gray-700">Activity</span>
          </div>
          <div className="text-2xl font-poppins font-semibold text-primary mb-1">4x</div>
          <div className="text-xs text-gray-500">per week</div>
        </div>

      </div>
    </motion.div>
  )
}

export default HealthInsights
