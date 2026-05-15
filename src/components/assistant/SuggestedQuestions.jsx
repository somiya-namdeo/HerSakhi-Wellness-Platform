import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

const SuggestedQuestions = ({ onSelect }) => {
  const questions = [
    "Why am I having cramps?",
    "How can I reduce stress during periods?",
    "What foods should I eat during my period?",
    "Tips for managing PMS symptoms",
    "How to improve sleep quality?",
    "Natural remedies for headaches"
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5 h-full flex flex-col"
    >
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={20} className="text-primary" />
        <h3 className="font-poppins font-semibold text-lg text-dark">Suggested Questions</h3>
      </div>
      
      <div className="flex flex-col gap-3 overflow-y-auto">
        {questions.map((q, index) => (
          <button
            key={index}
            onClick={() => onSelect(q)}
            className="text-left px-5 py-4 rounded-2xl bg-background border border-primary/5 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:border-primary/20 hover:text-primary transition-all duration-200 shadow-sm shadow-primary/5"
          >
            {q}
          </button>
        ))}
      </div>
    </motion.div>
  )
}

export default SuggestedQuestions
