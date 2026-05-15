import { Heart, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

const LearnMoreCTA = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-12 bg-primary/5 rounded-[2rem] p-10 lg:p-14 text-center relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-300/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

      <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
        <Heart size={48} className="text-primary mb-6" strokeWidth={1.5} />
        
        <h2 className="text-3xl font-poppins font-bold text-dark mb-4">
          Want to Learn More?
        </h2>
        
        <p className="text-gray-600 mb-8">
          Access our complete library of health articles and expert guides
        </p>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-primary to-pink-400 text-white font-semibold py-4 px-8 rounded-2xl flex items-center gap-2 shadow-lg shadow-primary/30"
        >
          Explore All Articles
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </motion.div>
  )
}

export default LearnMoreCTA
