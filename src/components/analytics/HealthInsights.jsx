import { Droplet, HeartPulse, AlertTriangle, Activity } from 'lucide-react'
import { motion } from 'framer-motion'

const HealthInsights = ({ analytics }) => {
  const {
    cycleRegularity,
    hasEnoughData,
    symptom_summary,
    wellness_insight,
    risk_flags
  } = analytics

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white rounded-[30px] p-6 lg:p-8 shadow-card border border-primary/5 mb-8"
    >
      <h3 className="font-poppins font-semibold text-xl text-dark mb-6">Health Insights</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Wellness Insight */}
        <div className="p-5 rounded-2xl border border-pink-400/10 bg-pink-400/5 hover:bg-pink-400/10 transition-colors cursor-default">
          <div className="flex items-center gap-2 mb-3">
            <HeartPulse size={18} className="text-pink-400" />
            <span className="text-sm font-medium text-gray-700">Wellness Overview</span>
          </div>
          <div className="text-sm text-gray-700 leading-relaxed">
            {hasEnoughData ? (wellness_insight || 'Track more cycles to unlock deeper insights.') : 'Log data to see your wellness overview.'}
          </div>
        </div>

        {/* Symptom Summary */}
        <div className="p-5 rounded-2xl border border-primary/10 bg-primary/5 hover:bg-primary/10 transition-colors cursor-default">
          <div className="flex items-center gap-2 mb-3">
            <Droplet size={18} className="text-primary" />
            <span className="text-sm font-medium text-gray-700">Symptom Patterns</span>
          </div>
          <div className="text-sm text-gray-700 leading-relaxed">
            {hasEnoughData ? (symptom_summary || 'No major symptoms reported recently.') : 'Log symptoms to track patterns.'}
          </div>
        </div>

        {/* Risk Flags */}
        <div className={`p-5 rounded-2xl border transition-colors cursor-default ${risk_flags?.length > 0 ? 'border-red-100 bg-red-50 hover:bg-red-100' : 'border-peach/20 bg-peach/10 hover:bg-peach/20'}`}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={18} className={risk_flags?.length > 0 ? "text-red-500" : "text-orange-400"} />
            <span className={`text-sm font-medium ${risk_flags?.length > 0 ? "text-red-600" : "text-gray-700"}`}>
              Pattern Alerts
            </span>
          </div>
          <div className="text-sm text-gray-700 leading-relaxed">
            {hasEnoughData 
              ? (risk_flags?.length > 0 ? risk_flags.join(' ') : 'No concerning patterns detected.') 
              : 'Log data to track pattern alerts.'}
          </div>
        </div>

        {/* Regularity */}
        <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors cursor-default">
          <div className="flex items-center gap-2 mb-3">
            <Activity size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Cycle Regularity</span>
          </div>
          <div className="text-xl font-poppins font-semibold text-gray-700 mb-1">
            {cycleRegularity}
          </div>
          <div className="text-xs text-gray-500">
            Based on your historical cycle data
          </div>
        </div>

      </div>
    </motion.div>
  )
}

export default HealthInsights
