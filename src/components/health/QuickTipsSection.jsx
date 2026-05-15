import { Droplet, Activity, Apple, Brain } from 'lucide-react'
import { motion } from 'framer-motion'

const QuickTipsSection = () => {
  const tips = [
    { icon: Droplet, text: "Stay hydrated! Drink at least 8 glasses of water daily to reduce bloating.", colorClass: "text-primary bg-primary/5 border-primary/10" },
    { icon: Activity, text: "Light exercise like walking can help reduce period cramps by 20–40%.", colorClass: "text-pink-400 bg-pink-400/5 border-pink-400/10" },
    { icon: Apple, text: "Iron-rich foods like spinach and lentils help replenish blood loss.", colorClass: "text-orange-400 bg-orange-400/5 border-orange-400/10" },
    { icon: Brain, text: "Practice mindfulness for 10 minutes daily to manage stress and mood.", colorClass: "text-primary bg-primary/5 border-primary/10" },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5 h-full flex flex-col"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="text-primary">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
        </div>
        <h3 className="font-poppins font-semibold text-xl text-dark">Quick Tips</h3>
      </div>

      <div className="space-y-4 flex-1">
        {tips.map((tip, index) => (
          <div key={index} className={`flex items-start gap-4 p-4 rounded-2xl border ${tip.colorClass}`}>
            <div className="mt-0.5">
              <tip.icon size={20} />
            </div>
            <p className="text-sm text-gray-700 leading-relaxed font-medium">
              {tip.text}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default QuickTipsSection
