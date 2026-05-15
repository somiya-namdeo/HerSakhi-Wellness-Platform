import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'

const SafetyMatters = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-[#fdf7fb] rounded-[2rem] p-8 lg:p-10 border border-primary/10 relative overflow-hidden mb-8"
    >
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center relative z-10">
        
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-[#a78bfa] shrink-0">
          <Heart size={32} />
        </div>
        
        <div className="flex-1">
          <h3 className="font-poppins font-semibold text-xl text-dark mb-2">Your Safety Matters</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-6 md:mb-0 max-w-3xl">
            All calls to helplines are confidential and free. Trained professionals are available 24/7 to provide support, resources, and guidance. You are not alone.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
          <button className="bg-gradient-to-r from-[#a78bfa] to-[#c4b5fd] text-white font-semibold py-3 px-6 rounded-2xl shadow-soft hover:shadow-lg transition-all text-sm">
            Learn About Safety Planning
          </button>
          <button className="bg-white border border-[#a78bfa]/30 text-[#a78bfa] font-semibold py-3 px-6 rounded-2xl hover:bg-primary/5 transition-all text-sm">
            View Privacy Policy
          </button>
        </div>
        
      </div>
    </motion.div>
  )
}

export default SafetyMatters
