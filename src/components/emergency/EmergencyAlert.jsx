import { Phone, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const EmergencyAlert = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#fff5f5] border border-red-200 rounded-[2rem] p-6 lg:p-8 mb-10 shadow-sm relative overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-4 text-red-500">
        <AlertCircle size={20} strokeWidth={2.5} />
        <h3 className="font-poppins font-semibold text-lg">In Case of Emergency</h3>
      </div>
      
      <p className="text-gray-700 font-medium mb-6">
        If you are experiencing a medical emergency, please call your local emergency services immediately.
      </p>
      
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-gradient-to-r from-[#a78bfa] to-[#c4b5fd] text-white font-semibold py-3 px-6 rounded-2xl flex items-center gap-2 shadow-soft hover:shadow-lg transition-all"
      >
        <Phone size={18} fill="currentColor" />
        Call Emergency Services
      </motion.button>
    </motion.div>
  )
}

export default EmergencyAlert
