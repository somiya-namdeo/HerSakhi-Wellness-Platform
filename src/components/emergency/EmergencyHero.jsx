import { AlertCircle, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

const EmergencyHero = () => {
  const handleCall = () => {
    if (window.confirm("Call India National Emergency Helpline (112)?")) {
      window.location.href = "tel:112"
    }
  }

  return (
    <div className="mb-8">
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-500 shadow-sm shrink-0">
          <AlertCircle size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-poppins font-bold text-[#2d1b45]">Emergency & Safety</h2>
          <p className="text-gray-500 text-sm">Quick access to reliable help and emergency support</p>
        </div>
      </div>

      {/* Hero Helpline Callout Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-100 rounded-[2rem] p-6 lg:p-8 shadow-sm relative overflow-hidden"
      >
        <div className="max-w-3xl relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            24/7 National Support
          </span>
          
          <h3 className="font-poppins font-bold text-xl md:text-2xl text-[#2d1b45] mb-2">
            India National Emergency Support
          </h3>
          
          <p className="text-[#2d1b45]/80 text-sm md:text-base mb-6 leading-relaxed">
            For urgent medical, safety, or emergency support in India, call the national emergency helpline.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCall}
              className="inline-flex items-center justify-center gap-2 bg-[#a78bfa] hover:bg-[#a78bfa]/90 text-white font-semibold py-3 px-6 rounded-2xl shadow-soft hover:shadow-lg transition-all"
            >
              <Phone size={18} fill="currentColor" />
              Call 112
            </motion.button>
            
            <p className="text-xs text-gray-500 italic">
              * On mobile devices, this opens your phone dialer.
            </p>
          </div>
        </div>
        
        {/* Decorative subtle background visual element */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-red-100/10 to-transparent pointer-events-none hidden md:block"></div>
      </motion.div>
    </div>
  )
}

export default EmergencyHero
