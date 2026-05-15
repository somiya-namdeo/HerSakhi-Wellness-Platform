import { motion } from 'framer-motion'

const AIRecommendations = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.6 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-white rounded-[30px] p-6 lg:p-8 shadow-card border border-primary/5 mb-8"
    >
      <h3 className="font-poppins font-semibold text-xl text-dark mb-6">AI Recommendations</h3>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {/* Rec 1 */}
        <motion.div variants={item} className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-dark">Cycle Prediction:</span> Based on your tracking, your next period is predicted with 95% accuracy.
          </p>
        </motion.div>

        {/* Rec 2 */}
        <motion.div variants={item} className="p-5 rounded-2xl bg-pink-400/5 border border-pink-400/10">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-dark">Mood Pattern:</span> Your mood tends to dip during Week 3. Consider stress management techniques during this time.
          </p>
        </motion.div>

        {/* Rec 3 */}
        <motion.div variants={item} className="p-5 rounded-2xl bg-peach/10 border border-peach/20">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-dark">Sleep Insight:</span> You're getting great sleep! Maintain this routine for optimal wellness.
          </p>
        </motion.div>

        {/* Rec 4 */}
        <motion.div variants={item} className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-dark">Symptom Trend:</span> Cramps are your most common symptom. Try magnesium supplements and heat therapy.
          </p>
        </motion.div>

      </motion.div>
    </motion.div>
  )
}

export default AIRecommendations
