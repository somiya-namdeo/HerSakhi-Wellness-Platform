import { useState } from 'react'
import { Heart, X, Shield, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const SafetyTips = () => {
  const [isTipsOpen, setIsTipsOpen] = useState(false)
  const [isPrepOpen, setIsPrepOpen] = useState(false)

  const safetyTipsList = [
    "Keep at least one trusted emergency contact saved.",
    "Share your location with trusted people in unsafe situations.",
    "Track unusual symptoms or severe pain patterns.",
    "Seek medical help for persistent heavy bleeding or fainting.",
    "Stay hydrated and keep essential medicines nearby.",
    "Save important helpline numbers in your phone.",
    "Reach out for emotional support during mental health distress."
  ]

  const prepList = [
    "Keep emergency contacts updated.",
    "Carry sanitary products during travel.",
    "Know your nearest trusted clinic/hospital.",
    "Keep charged phone and emergency cash available.",
    "Inform trusted family/friends during medical emergencies.",
    "Prepare basic health information if visiting emergency care."
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-[#fdf7fb] rounded-[2rem] p-8 lg:p-10 border border-pink-100 relative overflow-hidden mb-8"
    >
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center relative z-10">
        
        <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-[#a78bfa] shrink-0">
          <Heart size={32} />
        </div>
        
        <div className="flex-1">
          <h3 className="font-poppins font-semibold text-xl text-[#2d1b45] mb-2">Your Safety Matters</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-6 md:mb-0 max-w-3xl">
            All calls to helplines are confidential and free. Trained professionals are available 24/7 to provide support, resources, and guidance. You are not alone.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
          <button 
            onClick={() => setIsTipsOpen(true)}
            className="bg-gradient-to-r from-[#a78bfa] to-[#c4b5fd] text-white font-semibold py-3 px-6 rounded-2xl shadow-soft hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
          >
            <BookOpen size={16} />
            Safety Tips
          </button>
          
          <button 
            onClick={() => setIsPrepOpen(true)}
            className="bg-white border border-[#a78bfa]/30 text-[#a78bfa] font-semibold py-3 px-6 rounded-2xl hover:bg-pink-50 transition-all text-sm flex items-center justify-center gap-2"
          >
            <Shield size={16} />
            Emergency Preparedness
          </button>
        </div>
        
      </div>

      {/* Safety & Wellness Tips Modal */}
      <AnimatePresence>
        {isTipsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTipsOpen(false)}
              className="fixed inset-0 bg-[#2d1b45]/40 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] p-6 lg:p-8 max-w-lg w-full shadow-xl border border-pink-100 relative z-10 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-[#a78bfa]">
                    <Heart size={20} />
                  </div>
                  <h4 className="font-poppins font-semibold text-lg text-[#2d1b45]">
                    Safety & Wellness Tips
                  </h4>
                </div>
                <button 
                  onClick={() => setIsTipsOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-xs text-gray-500 italic">
                  Here are simple, supportive guidelines to help you maintain safety and wellness:
                </p>
                
                <ul className="space-y-3">
                  {safetyTipsList.map((tip, idx) => (
                    <li key={idx} className="flex gap-3 items-start text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] shrink-0 mt-2"></span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => setIsTipsOpen(false)}
                className="w-full py-3 bg-[#a78bfa] hover:bg-[#a78bfa]/90 text-white font-semibold rounded-xl text-sm transition-all"
              >
                Close Guidelines
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Emergency Preparedness Modal */}
      <AnimatePresence>
        {isPrepOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPrepOpen(false)}
              className="fixed inset-0 bg-[#2d1b45]/40 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] p-6 lg:p-8 max-w-lg w-full shadow-xl border border-pink-100 relative z-10 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-[#a78bfa]">
                    <Shield size={20} />
                  </div>
                  <h4 className="font-poppins font-semibold text-lg text-[#2d1b45]">
                    Emergency Preparedness Guide
                  </h4>
                </div>
                <button 
                  onClick={() => setIsPrepOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-xs text-gray-500 italic">
                  Keep these simple steps in mind to prepare for any unexpected medical or safety situation:
                </p>
                
                <ul className="space-y-3">
                  {prepList.map((step, idx) => (
                    <li key={idx} className="flex gap-3 items-start text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] shrink-0 mt-2"></span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => setIsPrepOpen(false)}
                className="w-full py-3 bg-[#a78bfa] hover:bg-[#a78bfa]/90 text-white font-semibold rounded-xl text-sm transition-all"
              >
                Close Guide
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default SafetyTips
