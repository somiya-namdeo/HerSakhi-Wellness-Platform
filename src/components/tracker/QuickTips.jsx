import { motion } from 'framer-motion'

const QuickTips = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5"
    >
      <h3 className="font-poppins font-semibold text-xl text-dark mb-6">Quick Tips</h3>
      
      <div className="space-y-4">
        <div className="bg-background py-3.5 px-5 rounded-2xl text-sm font-medium text-gray-600 border border-primary/5 transition-colors hover:bg-primary/5">
          Track consistently for accurate predictions
        </div>
        <div className="bg-background py-3.5 px-5 rounded-2xl text-sm font-medium text-gray-600 border border-primary/5 transition-colors hover:bg-primary/5">
          Note symptoms to identify patterns
        </div>
        <div className="bg-background py-3.5 px-5 rounded-2xl text-sm font-medium text-gray-600 border border-primary/5 transition-colors hover:bg-primary/5">
          Stay hydrated during your period
        </div>
      </div>
    </motion.div>
  )
}

export default QuickTips
