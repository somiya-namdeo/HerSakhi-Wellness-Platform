import { Droplet, Moon, Sun, Activity } from 'lucide-react'
import { motion } from 'framer-motion'

const HealthInsights = ({ analytics, cycleLogs = [] }) => {
  const {
    topSymptom,
    avgPainLevel,
    moodTrend,
    cycleRegularity,
    avgMoodScore,
    hasEnoughData,
  } = analytics

  // --- Sleep proxy: low pain = better sleep ---
  const sleepHours = avgPainLevel != null
    ? Math.max(5, +(8 - avgPainLevel * 0.3).toFixed(1))
    : null

  // --- Energy label from mood score ---
  const energyLabel = () => {
    if (!hasEnoughData) return '—'
    if (avgMoodScore >= 7) return 'Great'
    if (avgMoodScore >= 5) return 'Good'
    if (avgMoodScore >= 3) return 'Fair'
    return 'Low'
  }

  const energyScore = hasEnoughData
    ? `avg ${avgMoodScore}/10`
    : 'Log moods to track'

  // --- Activity proxy: count logs per week ---
  const logsPerWeek = cycleLogs.length > 0
    ? Math.min(7, Math.round(cycleLogs.length / Math.max(1, Math.ceil(cycleLogs.length / 7))))
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white rounded-[30px] p-6 lg:p-8 shadow-card border border-primary/5 mb-8"
    >
      <h3 className="font-poppins font-semibold text-xl text-dark mb-6">Health Insights</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Most Common Symptom */}
        <div className="p-5 rounded-2xl border border-primary/10 bg-primary/5 hover:bg-primary/10 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <Droplet size={18} className="text-primary" />
            <span className="text-sm font-medium text-gray-700">Top Symptom</span>
          </div>
          <div className="text-2xl font-poppins font-semibold text-primary mb-1 truncate" title={topSymptom ?? '—'}>
            {topSymptom ?? '—'}
          </div>
          <div className="text-xs text-gray-500">
            {topSymptom ? 'Most reported this period' : 'No symptoms logged yet'}
          </div>
        </div>

        {/* Sleep (proxy via pain) */}
        <div className="p-5 rounded-2xl border border-pink-400/10 bg-pink-400/5 hover:bg-pink-400/10 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <Moon size={18} className="text-pink-400" />
            <span className="text-sm font-medium text-gray-700">Avg Pain Level</span>
          </div>
          <div className="text-2xl font-poppins font-semibold text-pink-400 mb-1">
            {avgPainLevel != null ? `${avgPainLevel}/10` : '—'}
          </div>
          <div className="text-xs text-gray-500">
            {avgPainLevel != null
              ? avgPainLevel <= 3 ? 'Low — great!'
                : avgPainLevel <= 6 ? 'Moderate'
                : 'High — consider consulting a doctor'
              : 'Log pain to see data'}
          </div>
        </div>

        {/* Mood Trend */}
        <div className="p-5 rounded-2xl border border-peach/20 bg-peach/10 hover:bg-peach/20 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <Sun size={18} className="text-orange-400" />
            <span className="text-sm font-medium text-gray-700">Mood Trend</span>
          </div>
          <div className="text-2xl font-poppins font-semibold text-orange-400 mb-1">
            {energyLabel()}
          </div>
          <div className="text-xs text-gray-500">{energyScore}</div>
        </div>

        {/* Regularity Score */}
        <div className="p-5 rounded-2xl border border-primary/10 bg-background hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <Activity size={18} className="text-primary" />
            <span className="text-sm font-medium text-gray-700">Mood Pattern</span>
          </div>
          <div className="text-2xl font-poppins font-semibold text-primary mb-1 truncate" title={moodTrend}>
            {moodTrend}
          </div>
          <div className="text-xs text-gray-500">
            {cycleRegularity === 'Regular' ? 'Cycle: Regular ✓' : 'Keep logging to analyze'}
          </div>
        </div>

      </div>
    </motion.div>
  )
}

export default HealthInsights
