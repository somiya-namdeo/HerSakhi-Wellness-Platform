import { Droplet, Moon, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const DailyTrackers = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5"
    >
      <h3 className="font-poppins font-semibold text-xl text-dark mb-6">Daily Trackers</h3>
      
      <div className="space-y-6">
        {/* Hydration */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 text-primary">
              <Droplet size={16} />
              <span className="text-sm font-medium text-dark">Hydration</span>
            </div>
            <span className="text-xs font-medium text-primary">6/8 cups</span>
          </div>
          <div className="h-2.5 w-full bg-primary/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-primary rounded-full"
            ></motion.div>
          </div>
        </div>

        {/* Sleep */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 text-softPink">
              <Moon size={16} />
              <span className="text-sm font-medium text-dark">Sleep</span>
            </div>
            <span className="text-xs font-medium text-softPink">7.5 hrs</span>
          </div>
          <div className="h-2.5 w-full bg-softPink/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '85%' }}
              transition={{ duration: 1, delay: 0.6 }}
              className="h-full bg-softPink rounded-full"
            ></motion.div>
          </div>
        </div>

        {/* Energy */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 text-peach">
              <Zap size={16} />
              <span className="text-sm font-medium text-dark">Energy</span>
            </div>
            <span className="text-xs font-medium text-peach">Good</span>
          </div>
          <div className="h-2.5 w-full bg-peach/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '80%' }}
              transition={{ duration: 1, delay: 0.7 }}
              className="h-full bg-peach rounded-full"
            ></motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default DailyTrackers
