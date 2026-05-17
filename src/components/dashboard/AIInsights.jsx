import { Sparkles, ChevronRight, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const AIInsights = ({ prediction }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5 h-full flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-poppins font-semibold text-xl text-dark">AI Wellness Insights</h3>
        <Sparkles size={20} className="text-primary" />
      </div>
      
      <div className="space-y-4 flex-1">
        {/* Insight 1: Wellness Insight */}
        <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 transition-colors hover:bg-primary/10 cursor-default">
          <p className="text-sm text-gray-700 leading-relaxed">
            {prediction?.wellness_insight || "Track more cycles to unlock deeper insights."}
          </p>
        </div>

        {/* Insight 2: Symptom Summary */}
        <div className="bg-softPink/5 p-4 rounded-2xl border border-softPink/10 transition-colors hover:bg-softPink/10 cursor-default">
          <p className="text-sm text-gray-700 leading-relaxed">
            {prediction?.symptom_summary || "Start logging daily to uncover symptom patterns."}
          </p>
        </div>

        {/* Insight 3: Top Recommendations */}
        <div className="bg-peach/5 p-4 rounded-2xl border border-peach/10 transition-colors hover:bg-peach/10 cursor-default">
          <p className="text-sm text-gray-700 leading-relaxed">
            {prediction?.recommendations && prediction.recommendations.length > 0
              ? prediction.recommendations.slice(0, 2).join(' ')
              : "Log your mood and symptoms to get personalized wellness recommendations."}
          </p>
        </div>

        {/* Risk Flags */}
        <div className={`p-4 rounded-2xl border transition-colors cursor-default ${
          prediction?.risk_flags?.length > 0 
            ? "bg-red-50 border-red-100 hover:bg-red-100" 
            : "bg-gray-50 border-gray-100 hover:bg-gray-100"
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {prediction?.risk_flags?.length > 0 && <AlertTriangle size={16} className="text-red-500" />}
            <span className={`text-sm font-semibold ${prediction?.risk_flags?.length > 0 ? "text-red-600" : "text-gray-600"}`}>
              Pattern Analysis
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {prediction?.risk_flags?.length > 0 
              ? prediction.risk_flags.join(' ')
              : "No concerning patterns detected."}
          </p>
        </div>
      </div>

      <button 
        onClick={() => navigate('/assistant')}
        className="w-full mt-6 py-3.5 rounded-2xl border-2 border-primary/20 text-primary font-medium hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group"
      >
        Chat with AI Assistant 
        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  )
}

export default AIInsights

